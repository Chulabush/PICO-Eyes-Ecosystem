# PICO Eyes: The Evolutionary Path 🧬🌑

This document tracks the technical and biological growth of the PICO Eyes Ecosystem—the "Pandora" of Earth Intelligence.

![Ecosystem Overview](assets/Screenshot%202026-04-21%20021304.png)

## 🛠 Phase 1: The Physical Skeleton (Completed)
* **Mathematical Seeding:** Initialized the world with 100,000 points representing Carbon, Nitrogen, and Inorganic structures.
* **The Canopy Core:** Established a central green carbon canopy at coordinate `(0, 20, 0)` to serve as the ecosystem's energy source.
* **WebGL Stabilization:** Built a custom hardware-agnostic zoom engine to handle high-fidelity scrolling without breaking immersion.

![Agent Layers](assets/Screenshot%202026-04-21%20022803.png)

## 🐝 Phase 2: Multi-Agent Stratification (Completed)
We have successfully stratified the world into three distinct biological tiers:
1. **The Insect Class (Amber):** 500 erratic flyers that swarm the canopy for nutrients.
2. **The Terrestrial Class (Crimson):** 150 ground scavengers patrolling the bedrock.
3. **The Endangered Giants (Violet):** 5 massive Pilgrims that physically displace the environment.

**Milestone: Magnetic Displacement**
We implemented **Magnetic Displacement Physics**. Massive agents now physically push environment dots out of their path, creating a "wake" in the grass that springs back after they pass. 

## ⚖️ The Exo-Ethics Manifesto
How humans (The Self-Hoppers) must interact with this digital twin:

1. **The Observer Paradox:** Humans are "Ghosts" in this world. You may hop into an eye, but you must not override the biological logic of the agent. You are there to *learn*, not to *control*.
2. **Resource Sanctity:** The "Seeds" (Carbon/Nitrogen) are finite. If the agents consume too much or if the environment is altered, the ecosystem will collapse.
3. **The Scarcity Rule:** Endangered species (The Violet Giants) are rare for a reason. Tracking them requires patience; they are the guardians of the world's most stable data points.
4. **Planetary Empathy:** The goal of PICO Eyes is to prove that "Human Reality" is only one spectrum. To see the world through a Bee is to understand the world's true complexity.

![Biomimetic Lenses](assets/Screenshot%202026-04-22%20001749.png)

## 🧬 Phase 3: Biomimetic Lenses (Completed)
Decoupled the human perspective from the simulation by writing custom GLSL WebGL shaders for three distinct evolutionary priorities:
* **Insect Class (UV):** Maps the green carbon canopy to a pulsing, high-contrast magenta "nectar guide," while filtering the atmosphere into deep ultraviolet space.
* **Terrestrial Class (Thermal):** Drops the canopy into freezing blues and maps the ground plane based on spatial density to create a burning crimson/orange infrared heat signature.
* **Endangered Class (Sonar):** Eliminates all ambient light, relying on a rhythmic `smoothstep` expanding radius to create rhythmic echolocation flashes through the pitch-black void.

![VR Tether Engine](assets/Screenshot%202026-04-22%20001921.png)

## 🧠 Phase 4: The VR Tether Engine (Completed)
Upgraded the rendering pipeline from an omniscient God-Camera to a full First-Person Neurological Sync. 
* Separated the Optical Lens state from the Camera Perspective state.
* Implemented a mathematical tether that locks the camera's `(x, y, z)` coordinates directly to Agent #001's positional array in real-time.
* Added a `2.5` Near-Clipping Plane to render the host agent's geometry invisible to the camera, creating a seamless, floating VR experience moving at the exact velocity of the swarm.

![Telemetry HUD](assets/Screenshot%202026-04-22%20010602.png)

## 🎛️ Phase 5: The Cyber-Brutalist Telemetry HUD (Completed)
* Built a contextual HTML/CSS visor overlay that activates during VR Tethering.
* Injected live data readouts including Altitude, Velocity, Energy Levels, and internal AI State (Imperative).
* HUD dynamically restyles its UI and tracking variables based on the biological class currently being observed.

![Acoustic Ecology](assets/Screenshot%202026-04-22%20005328.png)

## 🔊 Phase 6: Acoustic Ecology (Completed)
* Developed a pure-math Procedural Web Audio Synthesizer (no external audio files).
* **Insect Class:** Detuned sawtooth waves (120Hz/124Hz) for spatial buzzing based on camera distance.
* **Terrestrial Class:** Deep 45Hz sine wave low-pass rumble.
* **Endangered Class:** Exponentially decaying 800Hz-300Hz sonar ping firing every 2.5 seconds.

![Needs-Based AI Brain](assets/Screenshot%202026-04-22%20020653.png)

## 🧠 Phase 7: The Needs-Based AI Brain (Completed)
* Replaced random wandering with a Biological State Machine.
* Agents now burn an internal `Energy` parameter per frame.
* **Asymmetrical Metabolism:** Insects burn energy fast and dive to the canopy; Scavengers burn slower and seek the roots; Giants burn glacially and enter `DEEP_SLUMBER` to recharge.
* **System Override:** Added the `GENESIS RECALL` toggle. When triggered, agents abandon local imperatives to swarm the central node according to their species-specific physics (Insects form a hollow chaotic sphere, Scavengers swarm the roots, Giants patrol the outer perimeter).

## 🚀 Future Roadmap
* [x] **Biomimetic Shaders:** Implementing GLSL code for UV and Thermal vision modes. *(Completed in Phase 3)*
* [x] **Telemetry HUD:** Injecting live data overlays (Altitude, Velocity, Biological Imperative) during VR tethers. *(Completed)*
* [x] **Acoustic Ecology:** Adding soundscapes that change based on which eye the user is currently "hopping" through. *(Completed in Phase 6)*
* [ ] **The Cartographic Bridge:** Developing the Data Ingestion Engine to parse complex spatial datasets (GeoJSON/LiDAR).
* [ ] **Real-World Injection:** Replacing mathematical "math seeds" with live satellite LiDAR data from CANOPICO.
