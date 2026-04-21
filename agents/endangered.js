import * as THREE from 'three';

export class EndangeredClass {
    constructor(scene, count = 5) {
        this.count = count;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);

        this.velocities = [];
        this.energies = [];
        this.states = [];
        this.isRecallActive = false;

        for (let i = 0; i < count; i++) {
            positions[ i * 3 ] = (Math.random() - 0.5) * 80;
            positions[ i * 3 + 1 ] = 4; 
            positions[ i * 3 + 2 ] = (Math.random() - 0.5) * 80;

            this.velocities.push(new THREE.Vector3(
                (Math.random() - 0.5) * 0.005,
                0, 
                (Math.random() - 0.5) * 0.005
            ));
            
            this.energies.push(Math.random() * 100); 
            this.states.push("MIGRATING");
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const material = new THREE.PointsMaterial({
            color: 0x9D00FF,
            size: 4.0, 
            transparent: true,
            opacity: 1.0,
            blending: THREE.AdditiveBlending
        });

        this.points = new THREE.Points(geometry, material);
        scene.add(this.points);
    }

    setRecallMode(isActive) {
        this.isRecallActive = isActive;
    }

    update() {
        const positions = this.points.geometry.attributes.position.array;
        const centerNode = new THREE.Vector3(0, 4, 0); 

        for (let i = 0; i < this.count; i++) {
            const idx = i * 3;
            const pos = new THREE.Vector3(positions[ idx ], positions[ idx + 1 ], positions[ idx + 2 ]);
            const vel = this.velocities[ i ];
            
            let energy = this.energies[ i ];
            let state = this.states[ i ];

            energy -= 0.01; 
            vel.multiplyScalar(0.90); // Massive friction for Giants

            if (this.isRecallActive) {
                state = "CORE_RESONANCE";
                energy = 100; 
            } else if (state === "CORE_RESONANCE") {
                state = "MIGRATING"; 
            } else {
                if (energy < 15) state = "DEEP_SLUMBER"; 
                if (energy > 85) state = "MIGRATING";
            }

            if (state === "MIGRATING") {
                vel.x += (Math.random() - 0.5) * 0.002;
                vel.z += (Math.random() - 0.5) * 0.002;
                if (pos.length() > 60) vel.add(pos.clone().normalize().multiplyScalar(-0.002));
                pos.y = 4; 
            } 
            else if (state === "DEEP_SLUMBER") {
                vel.multiplyScalar(0.5); 
                energy += 0.2; 
                pos.y = 3.5; 
            } 
            else if (state === "CORE_RESONANCE") {
                pos.y = 4; 
                const dist = pos.distanceTo(centerNode);
                
                if (dist > 40) {
                    // Very slow pull to the outer perimeter
                    const direction = new THREE.Vector3().subVectors(centerNode, pos).normalize();
                    vel.add(direction.multiplyScalar(0.005)); 
                } else {
                    // Arrived. Slow, majestic wandering on the edge.
                    vel.x += (Math.random() - 0.5) * 0.01;
                    vel.z += (Math.random() - 0.5) * 0.01;
                    
                    if (dist > 40) {
                        const pushBack = new THREE.Vector3().subVectors(centerNode, pos).normalize();
                        vel.add(pushBack.multiplyScalar(0.005));
                    } else if (dist < 25) {
                        const pushOut = new THREE.Vector3().subVectors(pos, centerNode).normalize();
                        vel.add(pushOut.multiplyScalar(0.005));
                    }
                }
            }

            // THE FIX: Glacial Speed Limits
            if (state === "CORE_RESONANCE") {
                vel.clampLength(0.001, 0.02); 
            } else {
                vel.clampLength(0.001, 0.02); 
            }
            
            pos.add(vel);

            positions[ idx ] = pos.x;
            positions[ idx + 1 ] = pos.y;
            positions[ idx + 2 ] = pos.z;
            
            this.energies[ i ] = energy;
            this.states[ i ] = state;
        }
        this.points.geometry.attributes.position.needsUpdate = true;
    }
}