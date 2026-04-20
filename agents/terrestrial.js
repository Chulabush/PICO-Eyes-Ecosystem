import * as THREE from 'three';

export class TerrestrialClass {
    constructor(scene, count = 150) {
        this.count = count;
        this.scene = scene;
        
        // Cyber-Brutalist Neon Crimson for ground agents
        const material = new THREE.PointsMaterial({
            color: 0xFF0055, 
            size: 2.0, // Slightly larger to be visible on the dark floor
            transparent: true,
            opacity: 0.9
        });

        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(this.count * 3);
        this.velocities = [];

        // Spawn scavengers on the indigo floor
        for (let i = 0; i < this.count * 3; i += 3) {
            positions[ i ] = (Math.random() - 0.5) * 90;     // X (Wide spread)
            positions[ i + 1 ] = -1.5;                       // Y (Locked to the ground layer)
            positions[ i + 2 ] = (Math.random() - 0.5) * 90; // Z (Wide spread)

            // Terrestrial agents move much slower than flying insects
            this.velocities.push({
                x: (Math.random() - 0.5) * 0.05,
                z: (Math.random() - 0.5) * 0.05
            });
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        this.points = new THREE.Points(geometry, material);
        this.scene.add(this.points);
    }

    update() {
        const positions = this.points.geometry.attributes.position.array;
        
        for (let i = 0; i < this.count; i++) {
            const index = i * 3;
            
            // Move the scavenger (Notice Y is not updated, keeping them on the ground)
            positions[ index ] += this.velocities[ i ].x;
            positions[ index + 2 ] += this.velocities[ i ].z;

            // Occasional biological "pause and turn" logic (simulating foraging)
            if (Math.random() < 0.01) {
                this.velocities[ i ].x = (Math.random() - 0.5) * 0.05;
                this.velocities[ i ].z = (Math.random() - 0.5) * 0.05;
            }

            // Keep them inside the world boundaries
            if (Math.abs(positions[ index ]) > 45) this.velocities[ i ].x *= -1;
            if (Math.abs(positions[ index + 2 ]) > 45) this.velocities[ i ].z *= -1;
        }
        
        this.points.geometry.attributes.position.needsUpdate = true;
    }
}