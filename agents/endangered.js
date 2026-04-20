import * as THREE from 'three';

export class EndangeredClass {
    constructor(scene, count = 5) { // Only 5 exist in the world!
        this.count = count;
        this.scene = scene;
        
        // Cyber-Brutalist Neon Violet for rare, massive agents
        const material = new THREE.PointsMaterial({
            color: 0x9D00FF, 
            size: 5.0, // Massive size to represent "Big Species"
            transparent: true,
            opacity: 1.0
        });

        // Make them perfect spheres
        const circleCanvas = document.createElement('canvas');
        circleCanvas.width = 32;
        circleCanvas.height = 32;
        const ctx = circleCanvas.getContext('2d');
        ctx.beginPath();
        ctx.arc(16, 16, 16, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        material.map = new THREE.CanvasTexture(circleCanvas);
        material.alphaTest = 0.5;

        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(this.count * 3);
        this.velocities = [];

        // Spawn them at the extreme edges of the ecosystem
        for (let i = 0; i < this.count * 3; i += 3) {
            positions[ i ] = (Math.random() > 0.5 ? 1 : -1) * 45; // Far X edge
            positions[ i + 1 ] = 0;                               // Ground level
            positions[ i + 2 ] = (Math.random() > 0.5 ? 1 : -1) * 45; // Far Z edge

            this.velocities.push({ x: 0, y: 0, z: 0 });
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        this.points = new THREE.Points(geometry, material);
        this.scene.add(this.points);
    }

    update() {
        const positions = this.points.geometry.attributes.position.array;
        
        const targetX = 0;
        const targetZ = 0;
        
        for (let i = 0; i < this.count; i++) {
            const index = i * 3;
            
            let px = positions[ index ];
            let pz = positions[ index + 2 ];

            let dx = targetX - px;
            let dz = targetZ - pz;
            
            // Calculate distance to the center canopy
            let dist = Math.sqrt(dx * dx + dz * dz);

            if (dist < 15) {
                // ARRIVED: Start circling the canopy (Orbit Logic)
                // We use cross-product math to make them turn sideways
                this.velocities[ i ].x += dz * 0.0001; 
                this.velocities[ i ].z -= dx * 0.0001;
            } else {
                // PILGRIMAGE: Keep walking to the center
                this.velocities[ i ].x += dx * 0.00005;
                this.velocities[ i ].z += dz * 0.00005;
            }

            // Physical speed cap 
            this.velocities[ i ].x = Math.max(-0.02, Math.min(0.02, this.velocities[ i ].x));
            this.velocities[ i ].z = Math.max(-0.02, Math.min(0.02, this.velocities[ i ].z));

            // Move the giant
            positions[ index ] += this.velocities[ i ].x;
            positions[ index + 2 ] += this.velocities[ i ].z;

            // Turn around if they hit the edge of the world
            if (Math.abs(positions[ index ]) > 50) this.velocities[ i ].x *= -1;
            if (Math.abs(positions[ index + 2 ]) > 50) this.velocities[ i ].z *= -1;
        }
        
        this.points.geometry.attributes.position.needsUpdate = true;
    }
}