import * as THREE from 'three';

const canvas = document.createElement('canvas');
canvas.width = 32;
canvas.height = 32;
const ctx = canvas.getContext('2d');
ctx.beginPath();
ctx.arc(16, 16, 16, 0, Math.PI * 2);
ctx.fillStyle = '#ffffff';
ctx.fill();
const circleTexture = new THREE.CanvasTexture(canvas);

export const createTerrestrialVisionMaterial = () => {
    return new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0.0 },
            pointTexture: { value: circleTexture }
        },
        vertexShader: `
            // No attribute color declaration, avoiding the Three.js crash!
            varying vec3 vColor;
            varying vec3 vPos;
            
            void main() {
                vColor = color; 
                vPos = position;
                
                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                gl_Position = projectionMatrix * mvPosition;
                
                // Slightly smaller dots than the Bee, as Scavengers see sharper ground details
                gl_PointSize = 30.0 * (1.0 / -mvPosition.z); 
            }
        `,
        fragmentShader: `
            uniform float time;
            uniform sampler2D pointTexture;
            
            varying vec3 vColor;
            varying vec3 vPos;
            
            void main() {
                vec4 texColor = texture2D(pointTexture, gl_PointCoord);
                if (texColor.a < 0.5) discard;

                vec3 finalColor;

                // BIOLOGICAL LOGIC: Thermal / Infrared Vision
                // Scavengers care about the ground (Heat) and ignore the sky (Cold)
                
                if (vPos.y < 5.0) {
                    // THE GROUND: Hot spots. We map the X/Z position to create "heat pockets"
                    float heat = sin(vPos.x * 0.1 + time * 0.5) * cos(vPos.z * 0.1) * 0.5 + 0.5;
                    
                    // Mix Deep Crimson with burning Neon Orange based on the heat map
                    finalColor = mix(vec3(0.6, 0.0, 0.2), vec3(1.0, 0.4, 0.0), heat);
                } else {
                    // THE CANOPY / AIR: Freezing cold. 
                    // As Y gets higher, the dots fade into deep, dark blues and almost disappear
                    float coldFactor = clamp((vPos.y - 5.0) / 20.0, 0.0, 1.0);
                    finalColor = mix(vec3(0.0, 0.2, 0.5), vec3(0.0, 0.0, 0.1), coldFactor);
                }

                gl_FragColor = vec4(finalColor, 0.8);
            }
        `,
        transparent: true,
        vertexColors: true,
        depthWrite: false
    });
};