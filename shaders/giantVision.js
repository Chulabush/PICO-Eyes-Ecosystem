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

export const createGiantVisionMaterial = () => {
    return new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0.0 },
            pointTexture: { value: circleTexture }
        },
        vertexShader: `
            varying vec3 vPos;
            
            void main() {
                vPos = position;
                
                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                gl_Position = projectionMatrix * mvPosition;
                
                // Massive dots to simulate echoing acoustic hits
                gl_PointSize = 40.0 * (1.0 / -mvPosition.z); 
            }
        `,
        fragmentShader: `
            uniform float time;
            uniform sampler2D pointTexture;
            
            varying vec3 vPos;
            
            void main() {
                vec4 texColor = texture2D(pointTexture, gl_PointCoord);
                if (texColor.a < 0.5) discard;

                // BIOLOGICAL LOGIC: Echolocation / Sonar
                // Calculate how far this dot is from the center (0,0)
                float dist = length(vPos.xz);
                
                // Create an expanding wave using Time and Distance
                float wave = sin(dist * 0.2 - time * 3.0);
                
                // 'smoothstep' sharpens the blurry wave into a crisp, razor-thin neon ring
                float ring = smoothstep(0.95, 1.0, wave);

                // Base color is pitch black (the void)
                vec3 baseColor = vec3(0.01, 0.01, 0.02);
                
                // The echo color is blinding Neon Violet and White
                vec3 echoColor = vec3(0.8, 0.2, 1.0) * 2.0; 

                // Mix the void and the echo based on where the ring is
                vec3 finalColor = mix(baseColor, echoColor, ring);

                // Add a "fog" so echoes fade out perfectly in the deep distance
                float fade = clamp(1.0 - (dist / 120.0), 0.0, 1.0);

                // If the ring isn't hitting the dot, it becomes almost invisible (alpha 0.05)
                float alpha = max(0.05, ring);

                gl_FragColor = vec4(finalColor * fade, alpha);
            }
        `,
        transparent: true,
        vertexColors: false, // We ignore physical colors entirely in the dark!
        depthWrite: false
    });
};