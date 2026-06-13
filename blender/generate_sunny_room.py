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


def cyl(name, loc, radius, depth, material):
    bpy.ops.mesh.primitive_cylinder_add(location=loc, radius=radius, depth=depth)
    o = bpy.context.active_object
    o.name = name
    assign(o, material)
    return o


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

    # Window on right wall (bright sun)
    box("WindowFrame", (ROOM_W / 2 - 0.08, -1.35, 1.65), (0.05, 0.85, 0.75), m_white, root)
    box("WindowGlass", (ROOM_W / 2 - 0.12, -1.35, 1.65), (0.02, 0.75, 0.68), m_glass, root)

    # Desk group
    desk_y = -1.55
    box("DeskTop", (0, desk_y, 0.78), (1.05, 0.55, 0.04), m_wood, root)
    for i, x in enumerate([-0.85, 0.85]):
        box(f"DeskLeg_{i}", (x, desk_y, 0.38), (0.06, 0.06, 0.38), m_wood, root)

    # Monitor
    box("MonitorStand", (0, desk_y - 0.05, 0.92), (0.12, 0.08, 0.08), m_white, root)
    box("Monitor", (0, desk_y - 0.05, 1.18), (0.62, 0.05, 0.38), m_white, root)
    box("MonitorScreen", (0, desk_y - 0.12, 1.18), (0.54, 0.02, 0.31), m_screen, root)
    box("Keyboard", (0.15, desk_y + 0.08, 0.86), (0.38, 0.14, 0.02), m_white, root)
    box("Mouse", (0.62, desk_y + 0.1, 0.84), (0.08, 0.12, 0.025), m_sun, root)

    # Desk lamp
    cyl("LampBase", (-0.72, desk_y + 0.22, 0.86), 0.06, 0.04, m_sun)
    box("LampArm", (-0.72, desk_y + 0.08, 0.98), (0.03, 0.03, 0.22), m_sun, root)
    box("LampShade", (-0.72, desk_y - 0.02, 1.08), (0.1, 0.1, 0.06), mat("Lamp", (0.98, 0.92, 0.78), 0.35, emit=0.25), root)

    # Window sun streak (soft realism)
    box("SunStreak", (ROOM_W / 2 - 0.14, -1.35, 0.35), (0.01, 1.1, 2.2), mat("SunStreak", (1.0, 0.94, 0.78), 0.2, emit=0.35), root)

    # Chair (simple)
    box("ChairSeat", (-1.05, desk_y + 0.35, 0.48), (0.38, 0.38, 0.05), m_sun, root)
    box("ChairBack", (-1.05, desk_y + 0.05, 0.82), (0.38, 0.05, 0.42), m_sun, root)

    # Bookshelf on left wall
    box("Shelf", (-2.05, -2.35, 1.05), (0.35, 0.55, 1.05), m_wood, root)
    for i in range(3):
        box(f"ShelfBoard_{i}", (-2.05, -2.35, 0.55 + i * 0.55), (0.33, 0.53, 0.02), m_wood, root)
        box(f"Book_{i}", (-2.15 + i * 0.12, -2.25, 0.72 + i * 0.55), (0.05, 0.18, 0.22), m_sun if i == 1 else m_plant, root)

    # Plant + frame (personal touch)
    cyl("PlantPot", (1.85, -0.35, 0.12), 0.12, 0.24, m_white)
    cyl("PlantStem", (1.85, -0.35, 0.42), 0.04, 0.35, m_plant)
    box("Frame", (-1.75, -0.25, 1.75), (0.32, 0.02, 0.42), m_frame, root)
    box("FramePhoto", (-1.75, -0.18, 1.75), (0.26, 0.01, 0.34), m_sun, root)

    # Rug
    box("Rug", (0.15, -1.15, 0.02), (1.35, 0.95, 0.015), mat("Rug", (0.92, 0.78, 0.55), 0.85), root)

    # --- Lights (sun + fill) ---
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
        export_lights=True,
        export_cameras=False,
    )
    print(f"Exported: {EXPORT_PATH}")


if __name__ == "__main__":
    build_room()
    export_glb()
