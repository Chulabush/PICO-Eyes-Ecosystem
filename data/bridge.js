import * as THREE from 'three';

export class CartographicBridge {
    constructor(scene) {
        this.scene = scene;
        this.points = null;
    }

    async loadSatelliteSwath(url) {
        const response = await fetch(url);
        const data = await response.json();

        // 1. MATHEMATICAL NORMALIZATION
        // We find the center of the forest so we can move it to (0,0,0)
        let minLat = Infinity, maxLat = -Infinity;
        let minLon = Infinity, maxLon = -Infinity;

        data.forEach(p => {
            if (p.lat < minLat) minLat = p.lat;
            if (p.lat > maxLat) maxLat = p.lat;
            if (p.lon < minLon) minLon = p.lon;
            if (p.lon > maxLon) maxLon = p.lon;
        });

        const centerLat = (minLat + maxLat) / 2;
        const centerLon = (minLon + maxLon) / 2;

        // 2. SCALING ENGINE
        // Real-world coordinates are tiny. We multiply by 10000 to 
        // make them large enough to see in our 3D space.
        const scaleFactor = 10000; 

        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(data.length * 3);
        const colors = new THREE.Color();
        const colorArray = new Float32Array(data.length * 3);

        data.forEach((p, i) => {
            // Subtract the center to "Center the World"
            const x = (p.lon - centerLon) * scaleFactor;
            const z = (p.lat - centerLat) * scaleFactor;
            const y = p.alt; // Elevation stays as-is

            positions[ i * 3 ] = x;
            positions[ i * 3 + 1 ] = y;
            positions[ i * 3 + 2 ] = z;

            // 3. CARBON VISUALIZATION
            // Map Carbon Density (0 to 1) to a Green/Teal gradient
            colors.setHSL(0.35, 1.0, p.c_den * 0.5); 
            colorArray[ i * 3 ] = colors.r;
            colorArray[ i * 3 + 1 ] = colors.g;
            colorArray[ i * 3 + 2 ] = colors.b;
        });

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));

        const material = new THREE.PointsMaterial({
            size: 2.5,
            vertexColors: true,
            transparent: true,
            opacity: 0.9
        });

        this.points = new THREE.Points(geometry, material);
        this.scene.add(this.points);
        
        console.log("BRIDGE: Real-world data successfully projected.");
        return this.points;
    }
}