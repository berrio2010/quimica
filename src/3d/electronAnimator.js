// ====================================
// ANIMADOR DE ELECTRONES
// ====================================

class ElectronAnimator {
    constructor() {
        this.electrons = [];
        this.orbitals = [];
        this.time = 0;
        this.animationSpeed = 0.01; // Velocidad de rotación
        this.isAnimating = false;
    }

    /**
     * Crea electrones para los orbitales
     * @param {array} orbitals - Array de orbitales (grupos de Three.js)
     * @param {object} sceneConfig - Instancia de SceneConfig
     * @returns {array} Array de electrones creados
     */
    createElectrons(orbitals, sceneConfig) {
        this.electrons = [];
        this.orbitals = orbitals;

        const materials = window.atomMaterials;
        const scene = sceneConfig.getScene();

        orbitals.forEach((orbital, orbitalIndex) => {
            const electronCount = orbital.userData.electronCount;
            const radius = orbital.userData.radius;

            // Crear electrones para este orbital
            for (let i = 0; i < electronCount; i++) {
                // Crear geometría de electrón (esfera pequeña)
                const geometry = new THREE.SphereGeometry(1.5, 8, 8);
                const material = materials.getElectronMaterial(i);

                const electron = new THREE.Mesh(geometry, material);
                electron.castShadow = true;
                electron.receiveShadow = true;

                // Datos del electrón
                electron.userData = {
                    orbitalIndex: orbitalIndex,
                    electronIndex: i,
                    radius: radius,
                    angle: (i / electronCount) * Math.PI * 2, // Espaciar electrones uniformemente
                    speed: 0.01 + (orbitalIndex * 0.002), // Electrones más externos más lentos
                    orbitalRotationX: orbital.rotation.x,
                    orbitalRotationY: orbital.rotation.y,
                    orbitalRotationZ: orbital.rotation.z
                };

                // Agregar a la escena
                scene.add(electron);

                // Guardar referencia
                this.electrons.push(electron);
                orbital.userData.electrons.push(electron);
            }
        });

        return this.electrons;
    }

    /**
     * Inicia la animación de electrones
     */
    startAnimation() {
        this.isAnimating = true;
    }

    /**
     * Detiene la animación de electrones
     */
    stopAnimation() {
        this.isAnimating = false;
    }

    /**
     * Actualiza la posición de los electrones (llamar en render loop)
     */
    animateElectrons() {
        if (!this.isAnimating) return;

        this.time += this.animationSpeed;

        this.electrons.forEach(electron => {
            const data = electron.userData;
            const orbital = this.orbitals[data.orbitalIndex];

            if (!orbital) return;

            // Calcular nueva posición en el orbital
            const angle = data.angle + this.time * data.speed;
            const radius = data.radius;

            // Posición en espacio local del orbital
            let x = Math.cos(angle) * radius;
            let y = Math.sin(angle) * radius * 0.3;
            let z = Math.sin(angle) * radius * 0.7;

            // Aplicar rotación del orbital
            const point = new THREE.Vector3(x, y, z);
            point.applyQuaternion(orbital.quaternion);

            // Establecer posición global
            electron.position.copy(orbital.position);
            electron.position.add(point);

            // Hacer que el electrón mire hacia el centro
            electron.lookAt(orbital.position.x, orbital.position.y, orbital.position.z);

            // Rotación adicional para efecto visual
            electron.rotation.x += 0.02;
            electron.rotation.y += 0.01;
        });
    }

    /**
     * Cambia la velocidad de animación
     * @param {number} speed - Nueva velocidad (0-1)
     */
    setAnimationSpeed(speed) {
        this.animationSpeed = Math.max(0, Math.min(1, speed)) * 0.05;
    }

    /**
     * Hace que los orbitales giren
     */
    rotateOrbitals() {
        this.orbitals.forEach((orbital, index) => {
            orbital.rotation.x += 0.0002 * (1 + index);
            orbital.rotation.y += 0.0001 * (1 + index);
            orbital.rotation.z += 0.00015 * (1 + index);
        });
    }

    /**
     * Resalta un electrón específico
     * @param {number} electronIndex - Índice del electrón
     */
    highlightElectron(electronIndex) {
        this.electrons.forEach((electron, index) => {
            if (index === electronIndex) {
                electron.scale.set(2, 2, 2);
                electron.material.emissiveIntensity = 1;
            } else {
                electron.scale.set(1, 1, 1);
                electron.material.emissiveIntensity = 0.8;
            }
        });
    }

    /**
     * Resetea el highlight de todos los electrones
     */
    resetHighlight() {
        this.electrons.forEach(electron => {
            electron.scale.set(1, 1, 1);
            electron.material.emissiveIntensity = 0.8;
        });
    }

    /**
     * Obtiene el número total de electrones
     */
    getTotalElectrons() {
        return this.electrons.length;
    }

    /**
     * Limpia los electrones
     */
    dispose() {
        this.electrons.forEach(electron => {
            if (electron.geometry) electron.geometry.dispose();
            if (electron.material) electron.material.dispose();
        });
        this.electrons = [];
        this.orbitals = [];
    }
}

// Exportar como variable global
window.ElectronAnimator = ElectronAnimator;
