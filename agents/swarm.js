import * as THREE from 'three';

export class InsectSwarm {
    constructor(scene, count = 500) {
        this.count = count;
        this.scene = scene;
        
        // Neon Amber color for the Bees
        const material = new THREE.PointsMaterial({
            color: 0xFFB300, 
            size: 1.5, // Slightly larger than environment dots
            transparent: true,
            opacity: 0.9
        });

        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(this.count * 3);
        this.velocities = [];

        // Spawn bees randomly within the ecosystem bounds
        for (let i = 0; i < this.count * 3; i += 3) {
            positions[ i ] = (Math.random() - 0.5) * 100;     // X
            positions[ i + 1 ] = Math.random() * 40;          // Y
            positions[ i + 2 ] = (Math.random() - 0.5) * 100; // Z

            // Give each bee a random flying speed/direction
            this.velocities.push({
                x: (Math.random() - 0.5) * 0.2,
                y: (Math.random() - 0.5) * 0.2,
                z: (Math.random() - 0.5) * 0.2
            });
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        this.points = new THREE.Points(geometry, material);
        this.scene.add(this.points);
    }

    // This updates their position every single frame
    update() {
        const positions = this.points.geometry.attributes.position.array;
        
        // The Carbon Canopy is located at Center (0, 20, 0)
        const targetX = 0;
        const targetY = 20;
        const targetZ = 0;
        
        for (let i = 0; i < this.count; i++) {
            const index = i * 3;
            
            // Get current position
            let px = positions[ index ];
            let py = positions[ index + 1 ];
            let pz = positions[ index + 2 ];

            // 1. FORAGING LOGIC: Calculate direction to the canopy
            let dx = targetX - px;
            let dy = targetY - py;
            let dz = targetZ - pz;

            // Apply a tiny attraction force towards the green dots
            this.velocities[ i ].x += dx * 0.001;
            this.velocities[ i ].y += dy * 0.001;
            this.velocities[ i ].z += dz * 0.001;

            // 2. BIOLOGICAL WOBBLE: Add random "buzzing" movement
            this.velocities[ i ].x += (Math.random() - 0.5) * 0.05;
            this.velocities[ i ].y += (Math.random() - 0.5) * 0.05;
            this.velocities[ i ].z += (Math.random() - 0.5) * 0.05;

            // 3. PHYSICAL LIMITS: Cap their max speed
            this.velocities[ i ].x = Math.max(-0.3, Math.min(0.3, this.velocities[ i ].x));
            this.velocities[ i ].y = Math.max(-0.3, Math.min(0.3, this.velocities[ i ].y));
            this.velocities[ i ].z = Math.max(-0.3, Math.min(0.3, this.velocities[ i ].z));

            // Move the bee
            positions[ index ] += this.velocities[ i ].x;
            positions[ index + 1 ] += this.velocities[ i ].y;
            positions[ index + 2 ] += this.velocities[ i ].z;

            // Keep them inside the world boundaries (Bounce back)
            if (Math.abs(positions[ index ]) > 50) this.velocities[ i ].x *= -1;
            if (positions[ index + 1 ] > 50 || positions[ index + 1 ] < 0) this.velocities[ i ].y *= -1;
            if (Math.abs(positions[ index + 2 ]) > 50) this.velocities[ i ].z *= -1;
        }
        
        this.points.geometry.attributes.position.needsUpdate = true;
    }
}