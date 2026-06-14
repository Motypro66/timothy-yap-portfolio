# Compose sunny studio from CC0 GLBs + Poly Haven PBR textures.
import bpy
import math
import os
from mathutils import Vector

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)
ASSETS = os.path.join(SCRIPT_DIR, 'assets')
HI_DIR = os.path.join(ASSETS, 'homeinterior')
CC0_DIR = os.path.join(ASSETS, 'cc0')
TEX_DIR = os.path.join(ASSETS, 'textures')
EXPORT_PATH = os.path.join(PROJECT_ROOT, 'public', 'models', 'sunny-room.glb')
ROOM_W, ROOM_D, ROOM_H, DESK_Y = 5.2, 4.2, 2.85, -1.55
COL = 'SunnyRoom'


def clear_scene():
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete(use_global=False)
    for block in (bpy.data.meshes, bpy.data.materials, bpy.data.images, bpy.data.lights, bpy.data.cameras):
        for item in list(block):
            if item.users == 0:
                block.remove(item)


def simple_mat(name, rgb, roughness=0.55, emit=0.0, metal=0.0):
    m = bpy.data.materials.new(name=name)
    m.use_nodes = True
    bsdf = m.node_tree.nodes.get('Principled BSDF')
    bsdf.inputs['Base Color'].default_value = (*rgb, 1.0)
    bsdf.inputs['Roughness'].default_value = roughness
    bsdf.inputs['Metallic'].default_value = metal
    if emit > 0:
        bsdf.inputs['Emission Color'].default_value = (*rgb, 1.0)
        bsdf.inputs['Emission Strength'].default_value = emit
    return m


def glass_mat(name):
    m = bpy.data.materials.new(name=name)
    m.use_nodes = True
    bsdf = m.node_tree.nodes.get('Principled BSDF')
    bsdf.inputs['Base Color'].default_value = (0.82, 0.91, 1.0, 1.0)
    bsdf.inputs['Roughness'].default_value = 0.04
    bsdf.inputs['Metallic'].default_value = 0.0
    bsdf.inputs['Transmission Weight'].default_value = 0.72
    bsdf.inputs['IOR'].default_value = 1.45
    bsdf.inputs['Emission Color'].default_value = (0.78, 0.9, 1.0, 1.0)
    bsdf.inputs['Emission Strength'].default_value = 0.15
    return m


def valid_tex(path):
    return bool(path) and os.path.isfile(path) and os.path.getsize(path) > 2048


def pbr_mat(name, diffuse, rough, normal=None, scale=(3.0, 3.0, 3.0), metal=0.0):
    if not valid_tex(diffuse) or not valid_tex(rough):
        print('WARN missing PBR maps for', name, '- using flat fallback')
        return simple_mat(name, (0.72, 0.68, 0.62), 0.55, metal=metal)

    m = bpy.data.materials.new(name=name)
    m.use_nodes = True
    nodes, links = m.node_tree.nodes, m.node_tree.links
    bsdf = nodes.get('Principled BSDF')
    bsdf.inputs['Metallic'].default_value = metal
    texcoord = nodes.new('ShaderNodeTexCoord')
    mapping = nodes.new('ShaderNodeMapping')
    mapping.inputs['Scale'].default_value = (scale[0], scale[1], scale[2])

    def load_img(path, colorspace):
        img = bpy.data.images.load(path, check_existing=True)
        img.colorspace_settings.name = colorspace
        try:
            img.pack()
        except RuntimeError:
            pass
        n = nodes.new('ShaderNodeTexImage')
        n.image = img
        return n

    links.new(texcoord.outputs['Generated'], mapping.inputs['Vector'])
    diff_n = load_img(diffuse, 'sRGB')
    links.new(mapping.outputs['Vector'], diff_n.inputs['Vector'])
    links.new(diff_n.outputs['Color'], bsdf.inputs['Base Color'])
    rough_n = load_img(rough, 'Non-Color')
    links.new(mapping.outputs['Vector'], rough_n.inputs['Vector'])
    links.new(rough_n.outputs['Color'], bsdf.inputs['Roughness'])
    if normal and valid_tex(normal):
        nor_n = load_img(normal, 'Non-Color')
        links.new(mapping.outputs['Vector'], nor_n.inputs['Vector'])
        nmap = nodes.new('ShaderNodeNormalMap')
        links.new(nor_n.outputs['Color'], nmap.inputs['Color'])
        links.new(nmap.outputs['Normal'], bsdf.inputs['Normal'])
    return m


def assign(obj, material):
    if obj.type != 'MESH':
        return
    if obj.data.materials:
        obj.data.materials[0] = material
    else:
        obj.data.materials.append(material)


def box(name, loc, scale, material, collection):
    bpy.ops.mesh.primitive_cube_add(location=loc)
    o = bpy.context.active_object
    o.name = name
    o.scale = scale
    assign(o, material)
    collection.objects.link(o)
    for c in o.users_collection:
        if c != collection:
            c.objects.unlink(o)
    return o


def group_bounds(objects):
    mins = Vector((1e9, 1e9, 1e9))
    maxs = Vector((-1e9, -1e9, -1e9))
    found = False
    for obj in objects:
        if obj.type != 'MESH':
            continue
        found = True
        for corner in obj.bound_box:
            w = obj.matrix_world @ Vector(corner)
            mins = Vector((min(mins[i], w[i]) for i in range(3)))
            maxs = Vector((max(maxs[i], w[i]) for i in range(3)))
    if not found:
        return Vector((0, 0, 0)), Vector((1, 1, 1))
    return mins, maxs


def import_glb(filepath, label, collection):
    if not os.path.isfile(filepath):
        print('WARN missing', filepath)
        return [], None
    before = set(bpy.data.objects)
    bpy.ops.import_scene.gltf(filepath=filepath)
    imported = [o for o in bpy.data.objects if o not in before]
    root = bpy.data.objects.new(label, None)
    collection.objects.link(root)
    for obj in imported:
        obj.parent = root
        if collection not in obj.users_collection:
            collection.objects.link(obj)
        for c in list(obj.users_collection):
            if c.name == 'Collection':
                c.objects.unlink(obj)
    return imported, root


def normalize_and_place(filepath, label, collection, center, target_height=None, target_width=None, yaw=0.0):
    imported, root = import_glb(filepath, label, collection)
    if not imported:
        return None
    bpy.context.view_layer.update()
    mins, maxs = group_bounds(imported)
    size = maxs - mins
    scale = 1.0
    if target_height and size.z > 1e-6:
        scale = target_height / size.z
    if target_width and max(size.x, size.y) > 1e-6:
        scale = min(scale, target_width / max(size.x, size.y))
    mid = (mins + maxs) / 2.0
    for obj in imported:
        obj.location -= mid
    root.location = center
    root.rotation_euler = (0.0, 0.0, yaw)
    root.scale = (scale, scale, scale)
    return root


def add_baseboards(root, m_trim, m_wall):
    h, d = 0.11, 0.025
    y = 0.04 + h / 2
    box('BaseboardBack', (0, -ROOM_D + d, y), (ROOM_W / 2, d, h / 2), m_trim, root)
    box('BaseboardLeft', (-ROOM_W / 2 + d, -ROOM_D / 2, y), (d, ROOM_D / 2, h / 2), m_trim, root)
    box('BaseboardRight', (ROOM_W / 2 - d, -ROOM_D / 2, y), (d, ROOM_D / 2, h / 2), m_trim, root)
    cy = ROOM_H - 0.06
    box('CrownBack', (0, -ROOM_D + 0.04, cy), (ROOM_W / 2, 0.03, 0.04), m_wall, root)
    box('CrownLeft', (-ROOM_W / 2 + 0.04, -ROOM_D / 2, cy), (0.03, ROOM_D / 2, 0.04), m_wall, root)
    box('CrownRight', (ROOM_W / 2 - 0.04, -ROOM_D / 2, cy), (0.03, ROOM_D / 2, 0.04), m_wall, root)


def add_window_trim(root, m_trim, m_glass):
    wx, wy, wz = ROOM_W / 2 - 0.12, -1.35, 1.65
    tw, th = 0.75, 1.36
    ft = 0.06
    box('WindowFrameTop', (wx, wy, wz + th / 2 + ft / 2), (ft / 2, tw, ft / 2), m_trim, root)
    box('WindowFrameBottom', (wx, wy, wz - th / 2 - ft / 2), (ft / 2, tw, ft / 2), m_trim, root)
    box('WindowFrameLeft', (wx, wy - tw / 2 - ft / 2, wz), (ft / 2, ft / 2, th / 2), m_trim, root)
    box('WindowFrameRight', (wx, wy + tw / 2 + ft / 2, wz), (ft / 2, ft / 2, th / 2), m_trim, root)
    box('WindowSill', (wx + 0.04, wy, wz - th / 2 - 0.05), (0.08, tw + 0.12, 0.04), m_trim, root)
    box('WindowGlass', (wx, wy, wz), (0.015, tw - 0.04, th - 0.04), m_glass, root)


def add_desk_setup(root, m_desk, m_dark, m_screen, m_metal):
    box('DeskTop', (0, DESK_Y, 0.78), (1.05, 0.55, 0.035), m_desk, root)
    normalize_and_place(os.path.join(HI_DIR, 'table.glb'), 'DeskBase', root, (0, DESK_Y, 0.36), 0.72, 2.2)
    box('MonitorStand', (0, DESK_Y - 0.02, 1.05), (0.14, 0.08, 0.04), m_dark, root)
    box('MonitorNeck', (0, DESK_Y + 0.08, 1.08), (0.04, 0.04, 0.18), m_dark, root)
    box('MonitorBezel', (0, DESK_Y - 0.05, 1.22), (0.66, 0.06, 0.42), m_dark, root)
    box('MonitorScreen', (0, DESK_Y - 0.12, 1.22), (0.54, 0.012, 0.32), m_screen, root)
    box('Keyboard', (0.08, DESK_Y + 0.14, 0.92), (0.38, 0.14, 0.018), m_dark, root)
    box('MousePad', (-0.42, DESK_Y + 0.18, 0.88), (0.22, 0.16, 0.008), simple_mat('MousePad', (0.18, 0.2, 0.22), 0.85), root)
    box('Mouse', (-0.42, DESK_Y + 0.2, 0.9), (0.05, 0.07, 0.022), m_metal, root)


def build_room():
    clear_scene()
    root = bpy.data.collections.new(COL)
    bpy.context.scene.collection.children.link(root)
    tex = lambda n: os.path.join(TEX_DIR, n)

    m_floor = pbr_mat(
        'FloorPBR',
        tex('wood_floor_worn_diff_1k.jpg'),
        tex('wood_floor_worn_rough_1k.jpg'),
        tex('wood_floor_worn_nor_gl_1k.jpg'),
        (2.5, 2.5, 2.5),
    )
    m_wall = pbr_mat(
        'WallPBR',
        tex('plastered_wall_diff_1k.jpg'),
        tex('plastered_wall_rough_1k.jpg'),
        tex('plastered_wall_nor_gl_1k.jpg'),
        (2.0, 2.0, 2.0),
    )
    m_ceil = pbr_mat(
        'CeilingPBR',
        tex('plastered_wall_diff_1k.jpg'),
        tex('plastered_wall_rough_1k.jpg'),
        tex('plastered_wall_nor_gl_1k.jpg'),
        (3.5, 3.5, 3.5),
    )
    m_desk = pbr_mat(
        'DeskPBR',
        tex('wood_table_diff_1k.jpg'),
        tex('wood_table_rough_1k.jpg'),
        tex('wood_table_nor_gl_1k.jpg'),
        (1.5, 1.5, 1.5),
    )
    m_trim = pbr_mat(
        'TrimPBR',
        tex('wood_table_diff_1k.jpg'),
        tex('wood_table_rough_1k.jpg'),
        tex('wood_table_nor_gl_1k.jpg'),
        (0.8, 0.8, 0.8),
    )
    rug_diff = tex('carpet_persian_diff_1k.jpg')
    if valid_tex(rug_diff):
        rug_nor = tex('carpet_persian_nor_gl_1k.jpg')
        if not valid_tex(rug_nor):
            rug_nor = tex('wood_floor_worn_nor_gl_1k.jpg')
        m_rug = pbr_mat('RugPBR', rug_diff, tex('wood_floor_worn_rough_1k.jpg'), rug_nor, (1.2, 1.2, 1.2))
    else:
        m_rug = simple_mat('RugPBR', (0.52, 0.32, 0.24), 0.88)
    m_glass = glass_mat('WindowGlassMat')
    m_dark = simple_mat('DarkPlastic', (0.12, 0.12, 0.13), 0.35, 0.0, 0.05)
    m_screen = simple_mat('ScreenGlow', (0.42, 0.7, 0.94), 0.15, 2.4)
    m_metal = (
        pbr_mat(
            'MetalPBR',
            tex('metal_plate_diff_1k.jpg'),
            tex('metal_plate_rough_1k.jpg'),
            tex('metal_plate_nor_gl_1k.jpg'),
            (4.0, 4.0, 4.0),
            metal=0.85,
        )
        if valid_tex(tex('metal_plate_diff_1k.jpg'))
        else simple_mat('MetalPBR', (0.72, 0.74, 0.78), 0.28, 0.0, 0.88)
    )

    box('Floor', (0, -ROOM_D / 2, 0.04), (ROOM_W / 2, ROOM_D / 2, 0.04), m_floor, root)
    box('Rug', (0.15, -1.85, 0.045), (0.95, 0.72, 0.006), m_rug, root)
    box('Ceiling', (0, -ROOM_D / 2, ROOM_H - 0.04), (ROOM_W / 2, ROOM_D / 2, 0.04), m_ceil, root)
    box('WallBack', (0, -ROOM_D + 0.06, ROOM_H / 2), (ROOM_W / 2, 0.06, ROOM_H / 2), m_wall, root)
    box('WallLeft', (-ROOM_W / 2 + 0.06, -ROOM_D / 2, ROOM_H / 2), (0.06, ROOM_D / 2, ROOM_H / 2), m_wall, root)
    box('WallRight', (ROOM_W / 2 - 0.06, -ROOM_D / 2, ROOM_H / 2), (0.06, ROOM_D / 2, ROOM_H / 2), m_wall, root)
    box('Entrance', (0, 0.08, 0.02), (0.55, 0.02, 0.55), m_floor, root)

    add_baseboards(root, m_trim, m_wall)
    add_window_trim(root, m_trim, m_glass)
    add_desk_setup(root, m_desk, m_dark, m_screen, m_metal)

    normalize_and_place(os.path.join(HI_DIR, 'bookcase.glb'), 'Shelf', root, (-2.05, -2.35, 0.0), 2.1, 1.1, math.radians(90))
    normalize_and_place(os.path.join(HI_DIR, 'chair02.glb'), 'Chair', root, (-1.05, DESK_Y + 0.35, 0.0), 0.95, None, math.radians(25))
    normalize_and_place(os.path.join(HI_DIR, 'couch.glb'), 'Couch', root, (1.35, -3.05, 0.0), 0.85, 2.4, math.radians(-15))
    normalize_and_place(os.path.join(HI_DIR, 'books.glb'), 'Books', root, (-2.0, -2.1, 1.05), 0.25, None, math.radians(90))
    normalize_and_place(os.path.join(HI_DIR, 'books.glb'), 'BooksStack', root, (-1.85, -2.45, 0.55), 0.18, None, math.radians(75))
    normalize_and_place(os.path.join(HI_DIR, 'vase.glb'), 'Vase', root, (1.85, -0.35, 0.0), 0.35)
    normalize_and_place(os.path.join(HI_DIR, 'frame.glb'), 'WallFrame', root, (-0.55, -ROOM_D + 0.22, 1.75), 0.55, None, 0.0)
    normalize_and_place(os.path.join(HI_DIR, 'frame.glb'), 'WallFrame2', root, (0.85, -ROOM_D + 0.22, 1.45), 0.42, None, math.radians(-8))
    normalize_and_place(os.path.join(HI_DIR, 'cabinet.glb'), 'Cabinet', root, (2.05, -2.55, 0.0), 0.95, 0.55, math.radians(-90))
    normalize_and_place(os.path.join(HI_DIR, 'bench.glb'), 'Bench', root, (-0.35, -3.35, 0.0), 0.42, 1.4, math.radians(5))
    normalize_and_place(os.path.join(HI_DIR, 'stool.glb'), 'Stool', root, (0.95, -0.55, 0.0), 0.42)
    normalize_and_place(os.path.join(CC0_DIR, 'Pot_Plant.glb'), 'PotPlant', root, (1.75, -0.45, 0.0), 0.55)
    normalize_and_place(os.path.join(CC0_DIR, 'Pot_Plant.glb'), 'PotPlant2', root, (-2.35, -0.25, 0.0), 0.42)
    normalize_and_place(os.path.join(CC0_DIR, 'CoffeeMug.glb'), 'CoffeeMug', root, (0.45, DESK_Y + 0.12, 0.82), 0.1)
    normalize_and_place(os.path.join(CC0_DIR, 'TableLamp.glb'), 'TableLamp', root, (-0.72, DESK_Y + 0.22, 0.82), 0.45)
    normalize_and_place(os.path.join(CC0_DIR, 'TableLamp.glb'), 'SideLamp', root, (2.0, -2.15, 0.95), 0.38)
    box('CeilingLight', (0, -1.2, ROOM_H - 0.02), (0.55, 0.35, 0.012), simple_mat('CeilingLight', (1.0, 0.96, 0.88), 0.2, 1.8), root)

    return root


def export_glb():
    os.makedirs(os.path.dirname(EXPORT_PATH), exist_ok=True)
    bpy.ops.object.select_all(action='DESELECT')
    col = bpy.data.collections.get(COL)
    if col:
        for obj in col.all_objects:
            obj.select_set(True)
    for img in bpy.data.images:
        if img.filepath and not img.packed_file:
            try:
                img.pack()
            except RuntimeError:
                pass
    bpy.ops.export_scene.gltf(
        filepath=EXPORT_PATH,
        export_format='GLB',
        use_selection=True,
        export_apply=True,
        export_yup=True,
        export_materials='EXPORT',
        export_image_format='AUTO',
        export_lights=False,
        export_cameras=False,
    )
    print('Exported', EXPORT_PATH, os.path.getsize(EXPORT_PATH))


def main():
    build_room()
    export_glb()


if __name__ == '__main__':
    main()
