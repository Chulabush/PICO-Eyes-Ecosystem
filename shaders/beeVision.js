import * as THREE from 'three';

// Create a perfect circle texture for the shader
const canvas = document.createElement('canvas');
canvas.width = 32;
canvas.height = 32;
const ctx = canvas.getContext('2d');
ctx.beginPath();
ctx.arc(16, 16, 16, 0, Math.PI * 2);
ctx.fillStyle = '#ffffff';
ctx.fill();
const circleTexture = new THREE.CanvasTexture(canvas);

export const createBeeVisionMaterial = () => {
    return new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0.0 },
            pointTexture: { value: circleTexture }
        },
        vertexShader: `
            // REMOVED: 'attribute vec3 color;' because Three.js injects this automatically!
            varying vec3 vColor;
            varying vec3 vPos;
            
            void main() {
                vColor = color; // We can still use the color data
                vPos = position;
                
                // Calculate position on screen
                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                gl_Position = projectionMatrix * mvPosition;
                
                // Adjust dot size based on distance (Increased for better UV glow)
                gl_PointSize = 45.0 * (1.0 / -mvPosition.z); 
            }
        `,
        fragmentShader: `
            uniform float time;
            uniform sampler2D pointTexture;
            
            varying vec3 vColor;
            varying vec3 vPos;
            
            void main() {
                // Apply the circle mask
                vec4 texColor = texture2D(pointTexture, gl_PointCoord);
                if (texColor.a < 0.5) discard;

                vec3 finalColor = vColor;

                // BIOLOGICAL LOGIC: How Bees see the world
                // If the dot is predominantly Green (The Carbon Canopy)...
                if (vColor.g > 0.5 && vColor.r < 0.4) {
                    
                    // Create a pulsing UV "Nectar Guide" effect using a sine wave
                    float pulse = sin(time * 3.0 + vPos.x * 0.5) * 0.5 + 0.5;
                    
                    // Shift green to blinding Neon Magenta/White
                    finalColor = vec3(1.0, 0.2, 1.0) * pulse + vec3(0.5, 0.0, 0.5);
                    
                } else {
                    // Filter everything else (Rocks, Air) into deep UV blue/purple
                    finalColor = vec3(vColor.r * 0.2, 0.0, vColor.b * 1.5 + 0.2);
                }

                gl_FragColor = vec4(finalColor, 0.8);
            }
        `,
        transparent: true,
        vertexColors: true,
        depthWrite: false
    });
};