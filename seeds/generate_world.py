import math
import random
import os

def create_pandora_seed(filename, num_points=100000):
    # Ensure the seeds directory exists
    os.makedirs(os.path.dirname(filename), exist_ok=True)
    
    with open(filename, 'w') as f:
        # --- PLY File Header ---
        # This tells 3D engines how to read our dot data
        f.write("ply\n")
        f.write("format ascii 1.0\n")
        f.write(f"element vertex {num_points}\n")
        f.write("property float x\n")
        f.write("property float y\n")
        f.write("property float z\n")
        f.write("property uchar red\n")
        f.write("property uchar green\n")
        f.write("property uchar blue\n")
        f.write("end_header\n")

        # --- 1. Terrestrial Layer (Inorganic/Rocks) ---
        # 50% of the dots. Deep Indigo (30, 30, 50)
        # Spawns a wide, slightly uneven floor
        ground_points = int(num_points * 0.5)
        for _ in range(ground_points):
            x = random.uniform(-50, 50)
            z = random.uniform(-50, 50)
            y = random.uniform(-2, 2) 
            f.write(f"{x} {y} {z} 30 30 50\n")

        # --- 2. Living Infrastructure (Organic/Carbon Canopy) ---
        # 30% of the dots. Electric Neon Green (57, 255, 20)
        # Spawns a dense, floating spherical canopy of leaves
        canopy_points = int(num_points * 0.3)
        for _ in range(canopy_points):
            r = random.uniform(0, 15)
            theta = random.uniform(0, 2 * math.pi)
            phi = math.acos(random.uniform(-1, 1))
            x = r * math.sin(phi) * math.cos(theta)
            y = 20 + r * math.sin(phi) * math.sin(theta) # Elevated 20 units up
            z = r * math.cos(phi)
            f.write(f"{x} {y} {z} 57 255 20\n")

        # --- 3. Atmospheric Layer (Nitrogen/Air particles) ---
        # 20% of the dots. Electric Cyan (0, 255, 255)
        # Spawns a highly scattered gas volume around the world
        air_points = int(num_points * 0.2)
        for _ in range(air_points):
            x = random.uniform(-50, 50)
            y = random.uniform(0, 40)
            z = random.uniform(-50, 50)
            f.write(f"{x} {y} {z} 0 255 255\n")

    print(f"Success! {num_points} biomimetic seeds planted in {filename}")

# Run the generator
seed_path = "seeds/pandora_seed_001.ply"
create_pandora_seed(seed_path, 100000)
