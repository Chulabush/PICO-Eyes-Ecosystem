import * as THREE from 'three';

export class TerrestrialClass {
    constructor(scene, count = 150) {
        this.count = count;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);

        this.velocities = [];
        this.energies = [];
        this.states = [];
        this.isRecallActive = false;

        for (let i = 0; i < count; i++) {
            positions[ i * 3 ] = (Math.random() - 0.5) * 120;
            positions[ i * 3 + 1 ] = 2; 
            positions[ i * 3 + 2 ] = (Math.random() - 0.5) * 120;

            this.velocities.push(new THREE.Vector3(
                (Math.random() - 0.5) * 0.02,
                0, 
                (Math.random() - 0.5) * 0.02
            ));
            
            this.energies.push(Math.random() * 100); 
            this.states.push("PATROLLING_BEDROCK");
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const material = new THREE.PointsMaterial({
            color: 0xFF0055,
            size: 1.2,
            transparent: true,
            opacity: 0.9,
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
        const rootNode = new THREE.Vector3(0, 2, 0); 

        for (let i = 0; i < this.count; i++) {
            const idx = i * 3;
            const pos = new THREE.Vector3(positions[ idx ], positions[ idx + 1 ], positions[ idx + 2 ]);
            const vel = this.velocities[ i ];
            
            let energy = this.energies[ i ];
            let state = this.states[ i ];

            energy -= 0.05; 
            vel.multiplyScalar(0.95); // Heavy friction so they don't slide

            if (this.isRecallActive) {
                state = "CORE_RESONANCE";
                energy = 100; 
            } else if (state === "CORE_RESONANCE") {
                state = "PATROLLING_BEDROCK"; 
            } else {
                if (energy < 25) state = "CRITICAL_SEEK_ROOTS";
                if (energy > 90) state = "PATROLLING_BEDROCK";
            }

            if (state === "PATROLLING_BEDROCK") {
                vel.x += (Math.random() - 0.5) * 0.01;
                vel.z += (Math.random() - 0.5) * 0.01;
                vel.y = 0; 
                if (pos.length() > 70) vel.add(pos.clone().normalize().multiplyScalar(-0.01));
            } 
            else if (state === "CRITICAL_SEEK_ROOTS") {
                const directionToRoots = new THREE.Vector3().subVectors(rootNode, pos).normalize();
                vel.add(directionToRoots.multiplyScalar(0.01)); 
                vel.y = 0; 
                if (pos.distanceTo(rootNode) < 10) energy += 1.5; 
            } 
            else if (state === "CORE_RESONANCE") {
                const dist = pos.distanceTo(rootNode);
                
                if (dist > 25) {
                    // Slow, steady pull to the tree
                    const direction = new THREE.Vector3().subVectors(rootNode, pos).normalize();
                    vel.add(direction.multiplyScalar(0.02)); 
                } else {
                    // Chaotic wandering under the tree (No circles, no stacking)
                    vel.x += (Math.random() - 0.5) * 0.01;
                    vel.z += (Math.random() - 0.5) * 0.01;
                    
                    if (dist > 25) {
                        const pushBack = new THREE.Vector3().subVectors(rootNode, pos).normalize();
                        vel.add(pushBack.multiplyScalar(0.02));
                    }
                }
                vel.y = 0;
            }

            // THE FIX: Extremely strict speed limits for Scavengers
            if (state === "CORE_RESONANCE") {
                vel.clampLength(0.01, 0.08); // A slight hustle when called by God
            } else {
                vel.clampLength(0.01, 0.03); // Slow, creeping patrol speed
            }
            
            pos.add(vel);
            pos.y = 2; 

            positions[ idx ] = pos.x;
            positions[ idx + 1 ] = pos.y;
            positions[ idx + 2 ] = pos.z;
            
            this.energies[ i ] = energy;
            this.states[ i ] = state;
        }
        this.points.geometry.attributes.position.needsUpdate = true;
    }
}