import * as THREE from 'three';

export class InsectSwarm {
    constructor(scene, count = 500) {
        this.count = count;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);

        this.velocities = [];
        this.energies = [];
        this.states = [];
        this.isRecallActive = false; 

        for (let i = 0; i < count; i++) {
            positions[ i * 3 ] = (Math.random() - 0.5) * 100;
            positions[ i * 3 + 1 ] = Math.random() * 40 + 10;
            positions[ i * 3 + 2 ] = (Math.random() - 0.5) * 100;

            // ORIGINAL INITIAL VELOCITY RESTORED
            this.velocities.push(new THREE.Vector3(
                (Math.random() - 0.5) * 0.5,
                (Math.random() - 0.5) * 0.5,
                (Math.random() - 0.5) * 0.5
            ));
            
            this.energies.push(Math.random() * 100); 
            this.states.push("EXPLORING_PERIMETER");
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const material = new THREE.PointsMaterial({
            color: 0xFFB300,
            size: 0.8,
            transparent: true,
            opacity: 0.8,
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
        const centerOfCanopy = new THREE.Vector3(0, 20, 0); 

        for (let i = 0; i < this.count; i++) {
            const idx = i * 3;
            const pos = new THREE.Vector3(positions[ idx ], positions[ idx + 1 ], positions[ idx + 2 ]);
            const vel = this.velocities[ i ];
            
            let energy = this.energies[ i ];
            let state = this.states[ i ];

            energy -= 0.15;

            if (this.isRecallActive) {
                state = "CORE_RESONANCE";
                energy = 100; 
            } else if (state === "CORE_RESONANCE") {
                state = "EXPLORING_PERIMETER"; 
            } else {
                if (energy < 30) state = "CRITICAL_SEEK_NECTAR";
                if (energy > 95) state = "EXPLORING_PERIMETER";
            }

            // --- ORIGINAL LIVELY PATROL MATH RESTORED ---
            if (state === "EXPLORING_PERIMETER") {
                vel.x += (Math.random() - 0.5) * 0.1;
                vel.y += (Math.random() - 0.5) * 0.1;
                vel.z += (Math.random() - 0.5) * 0.1;
                if (pos.length() > 60) vel.add(pos.clone().normalize().multiplyScalar(-0.05));
            } 
            else if (state === "CRITICAL_SEEK_NECTAR") {
                const directionToFood = new THREE.Vector3().subVectors(centerOfCanopy, pos).normalize();
                vel.add(directionToFood.multiplyScalar(0.08));
                if (pos.distanceTo(centerOfCanopy) < 15) energy += 2.5; 
            } 
            else if (state === "CORE_RESONANCE") {
                const dist = pos.distanceTo(centerOfCanopy);
                
                if (dist > 15) {
                    // Fast flight toward the tree
                    const direction = new THREE.Vector3().subVectors(centerOfCanopy, pos).normalize();
                    vel.add(direction.multiplyScalar(0.15)); 
                } else {
                    // TRUE BEEHIVE SWARM LOGIC (No orbits, no stacking)
                    
                    // 1. Extreme chaotic darting inside the swarm cloud
                    vel.x += (Math.random() - 0.5) * 0.4;
                    vel.y += (Math.random() - 0.5) * 0.4;
                    vel.z += (Math.random() - 0.5) * 0.4;
                    
                    // 2. The Outer Wall: Don't wander away from the hive
                    if (dist > 12) {
                        const pushBack = new THREE.Vector3().subVectors(centerOfCanopy, pos).normalize();
                        vel.add(pushBack.multiplyScalar(0.1));
                    }
                    
                    // 3. The Inner Wall (Anti-Stacking): Push out if they hit the dead center
                    if (dist < 4) {
                        const pushOut = new THREE.Vector3().subVectors(pos, centerOfCanopy).normalize();
                        vel.add(pushOut.multiplyScalar(0.15));
                    }
                }
            }

            // --- ORIGINAL TOP SPEEDS RESTORED ---
            if (state === "CORE_RESONANCE") {
                vel.clampLength(0.1, 1.2); // Fast darting during swarm
            } else {
                vel.clampLength(0.1, 0.8); // Original fast patrol speed
            }
            
            pos.add(vel);
            if (pos.y < 2) pos.y = 2;

            positions[ idx ] = pos.x;
            positions[ idx + 1 ] = pos.y;
            positions[ idx + 2 ] = pos.z;
            
            this.energies[ i ] = energy;
            this.states[ i ] = state;
        }

        this.points.geometry.attributes.position.needsUpdate = true;
    }
}