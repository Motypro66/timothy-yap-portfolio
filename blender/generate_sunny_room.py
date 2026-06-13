"""
Timothy Yap Portfolio — Sunny workspace room (low-poly, Iris Xe friendly)
Run inside Blender: Scripting workspace → Open → Run Script
Or headless: blender --background --python generate_sunny_room.py
"""
import bpy
import math
import os

# Export next to this script → public/models/sunny-room.glb
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)
EXPORT_PATH = os.path.join(PROJECT_ROOT, "public", "models", "sunny-room.glb")

# Room bounds (Blender Z-up): X ±2.6, Y 0..-4.2 (depth), Z 0..2.9
ROOM_W = 5.2
ROOM_D = 4.2
ROOM_H = 2.85


def clear_scene():
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)
    for block in (
        bpy.data.meshes,
        bpy.data.materials,
        bpy.data.lights,
        bpy.data.cameras,
    ):
        for item in list(block):
            if item.users == 0:
                block.remove(item)


def mat(name, rgb, roughness=0.55, emit=0.0):
    m = bpy.data.materials.new(name=name)
    m.use_nodes = True
    bsdf = m.node_tree.nodes.get("Principled BSDF")
    bsdf.inputs["Base Color"].default_value = (*rgb, 1.0)
    bsdf.inputs["Roughness"].default_value = roughness
    if emit > 0:
        bsdf.inputs["Emission Color"].default_value = (*rgb, 1.0)
        bsdf.inputs["Emission Strength"].default_value = emit
    return m


def assign(obj, material):
    if obj.data.materials:
        obj.data.materials[0] = material
    else:
        obj.data.materials.append(material)


def box(name, loc, scale, material, collection=None):
    bpy.ops.mesh.primitive_cube_add(location=loc)
    o = bpy.context.active_object
    o.name = name
    o.scale = scale
    assign(o, material)
    if collection:
        collection.objects.link(o)
        bpy.context.collection.objects.unlink(o)
    return o


def cyl(name, loc, radius, depth, material, collection=None):
    bpy.ops.mesh.primitive_cylinder_add(location=loc, radius=radius, depth=depth)
    o = bpy.context.active_object
    o.name = name
    assign(o, material)
    if collection:
        collection.objects.link(o)
        bpy.context.collection.objects.unlink(o)
    return o


def uv_sphere(name, loc, radius, material, collection=None):
    bpy.ops.mesh.primitive_uv_sphere_add(location=loc, radius=radius, segments=12, ring_count=8)
    o = bpy.context.active_object
    o.name = name
    assign(o, material)
    if collection:
        collection.objects.link(o)
        bpy.context.collection.objects.unlink(o)
    return o


def apply_bevels(root):
    """Soft edges on furniture — reads more realistic without heavy poly count."""
    keywords = (
        "Desk", "Monitor", "Shelf", "Chair", "Frame", "Mug", "Speaker", "Lamp",
        "Keyboard", "Drawer", "Plant", "Window", "Book", "Notebook",
    )
    for obj in root.all_objects:
        if obj.type != "MESH":
            continue
        if not any(k in obj.name for k in keywords):
            continue
        bevel = obj.modifiers.new(name="Bevel", type="BEVEL")
        bevel.width = 0.012
        bevel.segments = 2
        bevel.limit_method = "ANGLE"
        bevel.angle_limit = math.radians(35)
    bpy.context.view_layer.update()
    for obj in root.all_objects:
        if obj.type != "MESH" or "Bevel" not in obj.modifiers:
            continue
        bpy.context.view_layer.objects.active = obj
        obj.select_set(True)
        try:
            bpy.ops.object.modifier_apply(modifier="Bevel")
        except RuntimeError:
            obj.modifiers.remove(obj.modifiers["Bevel"])
        obj.select_set(False)


def build_room():
    clear_scene()

    # --- Materials (sunny, confident) ---
    m_wall = mat("Wall", (0.96, 0.91, 0.84), 0.75)
    m_floor = mat("FloorWood", (0.78, 0.62, 0.42), 0.45)
    m_ceil = mat("Ceiling", (0.98, 0.96, 0.92), 0.9)
    m_wood = mat("WoodDesk", (0.62, 0.42, 0.26), 0.4)
    m_white = mat("White", (0.94, 0.94, 0.92), 0.35)
    m_screen = mat("ScreenGlow", (0.45, 0.72, 0.95), 0.2, emit=2.2)
    m_sun = mat("SunAccent", (0.96, 0.65, 0.22), 0.3, emit=0.4)
    m_plant = mat("Plant", (0.35, 0.62, 0.38), 0.6)
    m_frame = mat("Frame", (0.92, 0.88, 0.82), 0.5)
    m_glass = mat("WindowLight", (0.85, 0.92, 1.0), 0.1, emit=0.15)

    root = bpy.data.collections.new("SunnyRoom")
    bpy.context.scene.collection.children.link(root)

    # Floor
    box("Floor", (0, -ROOM_D / 2, 0.04), (ROOM_W / 2, ROOM_D / 2, 0.04), m_floor, root)

    # Ceiling
    box("Ceiling", (0, -ROOM_D / 2, ROOM_H - 0.04), (ROOM_W / 2, ROOM_D / 2, 0.04), m_ceil, root)

    # Walls: back, left, right (front open = entrance)
    box("WallBack", (0, -ROOM_D + 0.06, ROOM_H / 2), (ROOM_W / 2, 0.06, ROOM_H / 2), m_wall, root)
    box("WallLeft", (-ROOM_W / 2 + 0.06, -ROOM_D / 2, ROOM_H / 2), (0.06, ROOM_D / 2, ROOM_H / 2), m_wall, root)
    box("WallRight", (ROOM_W / 2 - 0.06, -ROOM_D / 2, ROOM_H / 2), (0.06, ROOM_D / 2, ROOM_H / 2), m_wall, root)

    # Window on right wall (bright sun) + mullions
    box("WindowFrame", (ROOM_W / 2 - 0.08, -1.35, 1.65), (0.05, 0.85, 0.75), m_white, root)
    box("WindowGlass", (ROOM_W / 2 - 0.12, -1.35, 1.65), (0.02, 0.75, 0.68), m_glass, root)
    box("WindowMullionV", (ROOM_W / 2 - 0.12, -1.35, 1.65), (0.015, 0.72, 0.04), m_white, root)
    box("WindowMullionH", (ROOM_W / 2 - 0.12, -1.35, 1.65), (0.015, 0.04, 0.66), m_white, root)

    # Desk group — top, apron, legs (not one solid slab)
    desk_y = -1.55
    box("DeskTop", (0, desk_y, 0.78), (1.05, 0.55, 0.035), m_wood, root)
    box("DeskApronFront", (0, desk_y + 0.42, 0.62), (0.98, 0.04, 0.12), m_wood, root)
    box("DeskDrawer", (0.42, desk_y + 0.18, 0.64), (0.38, 0.28, 0.08), m_wood, root)
    box("DeskDrawerHandle", (0.42, desk_y + 0.18, 0.71), (0.14, 0.02, 0.015), m_sun, root)
    for i, x in enumerate([-0.82, 0.82]):
        cyl(f"DeskLeg_{i}", (x, desk_y, 0.36), 0.045, 0.72, m_wood, root)

    # Monitor — bezel + chin + thin screen
    box("MonitorStand", (0, desk_y - 0.05, 0.92), (0.14, 0.1, 0.06), m_white, root)
    box("MonitorNeck", (0, desk_y - 0.02, 0.98), (0.05, 0.04, 0.14), m_white, root)
    box("Monitor", (0, desk_y - 0.05, 1.2), (0.64, 0.05, 0.4), m_white, root)
    box("MonitorBezel", (0, desk_y - 0.1, 1.2), (0.58, 0.015, 0.34), mat("Bezel", (0.12, 0.12, 0.14), 0.35), root)
    box("MonitorScreen", (0, desk_y - 0.12, 1.2), (0.52, 0.012, 0.3), m_screen, root)
    box("MonitorChin", (0, desk_y - 0.02, 1.02), (0.22, 0.04, 0.04), m_white, root)
    box("Keyboard", (0.15, desk_y + 0.08, 0.86), (0.38, 0.14, 0.018), m_white, root)
    for i, x in enumerate([0.04, 0.12, 0.2, 0.28]):
        box(f"Key_{i}", (x, desk_y + 0.1, 0.875), (0.06, 0.08, 0.008), mat("Key", (0.88, 0.88, 0.9), 0.45), root)
    box("Mouse", (0.62, desk_y + 0.1, 0.84), (0.08, 0.12, 0.022), m_sun, root)

    # Desk lamp
    cyl("LampBase", (-0.72, desk_y + 0.22, 0.86), 0.06, 0.04, m_sun)
    box("LampArm", (-0.72, desk_y + 0.08, 0.98), (0.03, 0.03, 0.22), m_sun, root)
    box("LampShade", (-0.72, desk_y - 0.02, 1.08), (0.1, 0.1, 0.06), mat("Lamp", (0.98, 0.92, 0.78), 0.35, emit=0.25), root)

    # Sun patch on floor (stays above floor — avoids bad bbox below y=0)
    box("SunStreak", (0.25, -1.35, 0.025), (1.05, 0.95, 0.008), mat("SunStreak", (1.0, 0.94, 0.78), 0.2, emit=0.28), root)

    # Chair — seat, back, arm hints, base
    box("ChairSeat", (-1.05, desk_y + 0.35, 0.48), (0.38, 0.38, 0.045), m_sun, root)
    box("ChairBack", (-1.05, desk_y + 0.05, 0.82), (0.38, 0.05, 0.42), m_sun, root)
    box("ChairArmL", (-1.25, desk_y + 0.22, 0.55), (0.05, 0.22, 0.32), m_sun, root)
    cyl("ChairBase", (-1.05, desk_y + 0.35, 0.22), 0.05, 0.08, mat("Metal", (0.35, 0.35, 0.38), 0.25), root)

    # Bookshelf on left wall
    box("Shelf", (-2.05, -2.35, 1.05), (0.35, 0.55, 1.05), m_wood, root)
    for i in range(3):
        box(f"ShelfBoard_{i}", (-2.05, -2.35, 0.55 + i * 0.55), (0.33, 0.53, 0.02), m_wood, root)
        box(f"Book_{i}", (-2.15 + i * 0.12, -2.25, 0.72 + i * 0.55), (0.05, 0.18, 0.22), m_sun if i == 1 else m_plant, root)

    # Plant + frame (personal touch)
    cyl("PlantPot", (1.85, -0.35, 0.12), 0.12, 0.24, m_white, root)
    cyl("PlantStem", (1.85, -0.35, 0.42), 0.035, 0.32, m_plant, root)
    for i, (ox, oz, r) in enumerate([(0, 0, 0.14), (0.08, 0.06, 0.11), (-0.07, 0.05, 0.1)]):
        uv_sphere(f"PlantLeaf_{i}", (1.85 + ox, -0.35 + oz, 0.62 + i * 0.06), r, m_plant, root)
    box("Frame", (-1.75, -0.25, 1.75), (0.32, 0.02, 0.42), m_frame, root)
    box("FramePhoto", (-1.75, -0.18, 1.75), (0.26, 0.01, 0.34), m_sun, root)
    box("FrameMat", (-1.75, -0.17, 1.75), (0.22, 0.005, 0.28), m_white, root)

    # Rug
    box("Rug", (0.15, -1.15, 0.02), (1.35, 0.95, 0.015), mat("Rug", (0.92, 0.78, 0.55), 0.85), root)

    # Baseboards + window sill (more finished interior read)
    box("BaseboardBack", (0, -ROOM_D + 0.12, 0.12), (ROOM_W / 2 - 0.08, 0.04, 0.12), m_white, root)
    box("BaseboardLeft", (-ROOM_W / 2 + 0.12, -ROOM_D / 2, 0.12), (0.04, ROOM_D / 2 - 0.08, 0.12), m_white, root)
    box("BaseboardRight", (ROOM_W / 2 - 0.12, -ROOM_D / 2, 0.12), (0.04, ROOM_D / 2 - 0.08, 0.12), m_white, root)
    box("WindowSill", (ROOM_W / 2 - 0.1, -1.35, 1.05), (0.08, 0.9, 0.06), m_white, root)

    # Crown molding (finishing detail)
    box("CrownLeft", (-ROOM_W / 2 + 0.12, -ROOM_D / 2, ROOM_H - 0.06), (0.04, ROOM_D / 2 - 0.08, 0.06), m_white, root)
    box("CrownRight", (ROOM_W / 2 - 0.12, -ROOM_D / 2, ROOM_H - 0.06), (0.04, ROOM_D / 2 - 0.08, 0.06), m_white, root)
    box("CrownBack", (0, -ROOM_D + 0.12, ROOM_H - 0.06), (ROOM_W / 2 - 0.08, 0.04, 0.06), m_white, root)

    # Extra desk props
    cyl("Mug", (0.45, desk_y + 0.12, 0.88), 0.05, 0.08, m_white, root)
    box("Notebook", (-0.35, desk_y + 0.1, 0.88), (0.18, 0.24, 0.015), mat("Notebook", (0.35, 0.42, 0.55), 0.7), root)
    box("SpeakerL", (-0.95, desk_y + 0.06, 0.92), (0.08, 0.08, 0.14), m_white, root)
    box("SpeakerR", (0.95, desk_y + 0.06, 0.92), (0.08, 0.08, 0.14), m_white, root)

    # Ceiling light panel
    box("CeilingLight", (0, -ROOM_D / 2, ROOM_H - 0.08), (0.55, 0.35, 0.03), mat("CeilingLight", (1.0, 0.98, 0.92), 0.2, emit=0.6), root)

    apply_bevels(root)
    sun = bpy.data.lights.new("Sun", type="SUN")
    sun_obj = bpy.data.objects.new("Sun", sun)
    root.objects.link(sun_obj)
    sun_obj.location = (2.5, 1.0, 3.5)
    sun_obj.rotation_euler = (math.radians(55), math.radians(15), math.radians(25))
    sun.energy = 2.8
    sun.color = (1.0, 0.95, 0.88)

    area = bpy.data.lights.new("WindowArea", type="AREA")
    area_obj = bpy.data.objects.new("WindowArea", area)
    root.objects.link(area_obj)
    area_obj.location = (ROOM_W / 2 - 0.3, -1.35, 1.65)
    area_obj.rotation_euler = (0, math.radians(90), 0)
    area.energy = 180
    area.size = 1.6
    area.color = (0.88, 0.94, 1.0)

    screen = bpy.data.lights.new("ScreenFill", type="POINT")
    screen_obj = bpy.data.objects.new("ScreenFill", screen)
    root.objects.link(screen_obj)
    screen_obj.location = (0, desk_y - 0.1, 1.15)
    screen.energy = 35
    screen.color = (0.55, 0.78, 1.0)

    # World background (soft warm sky)
    world = bpy.context.scene.world
    if world is None:
        world = bpy.data.worlds.new("World")
        bpy.context.scene.world = world
    world.use_nodes = True
    bg = world.node_tree.nodes["Background"]
    bg.inputs["Color"].default_value = (0.92, 0.88, 0.82, 1.0)
    bg.inputs["Strength"].default_value = 0.35

    bpy.context.scene.render.engine = "BLENDER_EEVEE"

    return root


def export_glb():
    os.makedirs(os.path.dirname(EXPORT_PATH), exist_ok=True)
    bpy.ops.object.select_all(action="DESELECT")
    for obj in bpy.data.collections.get("SunnyRoom", bpy.context.scene.collection).objects:
        obj.select_set(True)
    # Select all in SunnyRoom collection recursively
    col = bpy.data.collections.get("SunnyRoom")
    if col:
        for obj in col.all_objects:
            obj.select_set(True)

    bpy.ops.export_scene.gltf(
        filepath=EXPORT_PATH,
        export_format="GLB",
        use_selection=True,
        export_apply=True,
        export_yup=True,
        export_materials="EXPORT",
        export_lights=False,
        export_cameras=False,
    )
    print(f"Exported: {EXPORT_PATH}")


if __name__ == "__main__":
    build_room()
    export_glb()
