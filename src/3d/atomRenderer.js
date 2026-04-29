// ====================================
// RENDERIZADOR DE ÁTOMOS 3D
// ====================================

class AtomRenderer {
    constructor() {
        this.sceneConfig = null;
        this.orbitalGenerator = null;
        this.electronAnimator = null;
        this.nucleus = null;
        this.orbitals = [];
        this.isDisposed = false;
        this.mouseX = 0;
        this.mouseY = 0;
        this.lastMouseX = 0;
        this.lastMouseY = 0;
    }

    /**
     * Renderiza un átomo completo en un contenedor
     * @param {object} elementData - Datos del elemento (nombre, simbolo, numero, config, etc.)
     * @param {HTMLElement} container - Contenedor DOM
     */
    renderAtom(elementData, container) {
        if (!container || this.isDisposed) return;

        // Inicializar configuración de escena
        this.sceneConfig = new SceneConfig();
        if (!this.sceneConfig.initScene(container)) {
            console.error('No se pudo inicializar la escena');
            return;
        }

        // Inicializar generadores
        this.orbitalGenerator = new OrbitalGenerator();
        this.electronAnimator = new ElectronAnimator();

        // Limpiar escena anterior
        this.sceneConfig.clearScene();

        // Crear núcleo
        this.createNucleus(elementData);

        // Generar orbitales
        this.orbitals = this.orbitalGenerator.generateOrbitals(
            elementData.numero,
            this.sceneConfig
        );

        // Crear electrones
        this.electronAnimator.createElectrons(this.orbitals, this.sceneConfig);

        // Iniciar animación
        this.startAnimation();

        // Configurar controles de interacción
        this.setupInteractionControls(container);
    }

    /**
     * Crea el núcleo del átomo
     * @param {object} elementData - Datos del elemento
     */
    createNucleus(elementData) {
        const materials = window.atomMaterials;
        const scene = this.sceneConfig.getScene();

        // Tamaño del núcleo proporcional al número atómico
        // Normalizamos entre 2 y 8
        const baseSize = 2 + (Math.min(elementData.numero, 118) / 118) * 6;

        // Geometría del núcleo
        const nucleusGeometry = new THREE.IcosahedronGeometry(baseSize, 4);
        const nucleusMaterial = materials.createCustomMaterial({
            color: 0x00e5ff,
            emissive: 0x00e5ff,
            emissiveIntensity: 0.9,
            metalness: 0.8,
            roughness: 0.2,
            wireframe: false
        });

        this.nucleus = new THREE.Mesh(nucleusGeometry, nucleusMaterial);
        this.nucleus.castShadow = true;
        this.nucleus.receiveShadow = true;

        // Datos del núcleo
        this.nucleus.userData = {
            elementName: elementData.nombre,
            elementSymbol: elementData.simbolo,
            atomicNumber: elementData.numero,
            rotationSpeed: 0.001
        };

        scene.add(this.nucleus);
    }

    /**
     * Inicia el loop de animación
     */
    startAnimation() {
        let lastTime = Date.now();

        const animate = () => {
            // Verificar si se ha dispuesto
            if (this.isDisposed) {
                return;
            }

            const currentTime = Date.now();
            const deltaTime = (currentTime - lastTime) / 1000;
            lastTime = currentTime;

            // Animar núcleo (rotación)
            if (this.nucleus) {
                this.nucleus.rotation.x += this.nucleus.userData.rotationSpeed;
                this.nucleus.rotation.y += this.nucleus.userData.rotationSpeed * 1.5;
                this.nucleus.rotation.z += this.nucleus.userData.rotationSpeed * 0.7;
            }

            // Animar orbitales
            if (this.electronAnimator) {
                this.electronAnimator.animateElectrons();
                this.electronAnimator.rotateOrbitals();
            }

            // Rotar cámara suavemente si hay input
            if (Math.abs(this.mouseX - this.lastMouseX) > 0 || Math.abs(this.mouseY - this.lastMouseY) > 0) {
                const deltaX = this.mouseX - this.lastMouseX;
                const deltaY = this.mouseY - this.lastMouseY;
                this.sceneConfig.rotateCamera(deltaX, deltaY);
                this.lastMouseX = this.mouseX;
                this.lastMouseY = this.mouseY;
            }

            // Renderizar
            if (this.sceneConfig) {
                this.sceneConfig.getRenderer().render(
                    this.sceneConfig.getScene(),
                    this.sceneConfig.getCamera()
                );
            }

            if (!this.isDisposed) {
                requestAnimationFrame(animate);
            }
        };

        animate();
    }

    /**
     * Configura controles de interacción del ratón/toque
     */
    setupInteractionControls(container) {
        const canvas = this.sceneConfig.getRenderer().domElement;

        // Evento de movimiento del ratón
        canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            this.mouseX = e.clientX - rect.left;
            this.mouseY = e.clientY - rect.top;
        });

        // Evento de salida del ratón
        canvas.addEventListener('mouseleave', () => {
            this.mouseX = this.lastMouseX;
            this.mouseY = this.lastMouseY;
        });

        // Eventos táctiles
        canvas.addEventListener('touchmove', (e) => {
            if (e.touches.length > 0) {
                const rect = canvas.getBoundingClientRect();
                this.mouseX = e.touches[0].clientX - rect.left;
                this.mouseY = e.touches[0].clientY - rect.top;
            }
            e.preventDefault();
        });

        // Rueda del ratón para zoom
        canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            const camera = this.sceneConfig.getCamera();
            const zoomSpeed = 2;
            const direction = e.deltaY > 0 ? 1 : -1;
            const currentDistance = camera.position.length();
            const newDistance = Math.max(20, Math.min(200, currentDistance + direction * zoomSpeed));
            const scale = newDistance / currentDistance;

            camera.position.multiplyScalar(scale);
            camera.lookAt(0, 0, 0);
        });
    }

    /**
     * Obtiene información del átomo renderizado
     */
    getAtomInfo() {
        if (!this.nucleus) return null;

        return {
            elementName: this.nucleus.userData.elementName,
            elementSymbol: this.nucleus.userData.elementSymbol,
            atomicNumber: this.nucleus.userData.atomicNumber,
            totalElectrons: this.electronAnimator.getTotalElectrons(),
            totalOrbitals: this.orbitals.length
        };
    }

    /**
     * Configura la velocidad de animación
     * @param {number} speed - Velocidad (0-1)
     */
    setAnimationSpeed(speed) {
        if (this.electronAnimator) {
            this.electronAnimator.setAnimationSpeed(speed);
        }
    }

    /**
     * Pausa la animación
     */
    pauseAnimation() {
        if (this.electronAnimator) {
            this.electronAnimator.stopAnimation();
        }
    }

    /**
     * Reanuda la animación
     */
    resumeAnimation() {
        if (this.electronAnimator) {
            this.electronAnimator.startAnimation();
        }
    }

    /**
     * Resalta un orbital específico
     * @param {number} orbitalIndex - Índice del orbital
     */
    highlightOrbital(orbitalIndex) {
        this.orbitals.forEach((orbital, index) => {
            if (index === orbitalIndex) {
                orbital.children.forEach(child => {
                    if (child.material && child.material.opacity !== undefined) {
                        child.material.opacity = 0.8;
                    }
                });
            } else {
                orbital.children.forEach(child => {
                    if (child.material && child.material.opacity !== undefined) {
                        child.material.opacity = 0.2;
                    }
                });
            }
        });
    }

    /**
     * Resetea los highlights
     */
    resetHighlights() {
        this.orbitals.forEach(orbital => {
            orbital.children.forEach(child => {
                if (child.material && child.material.opacity !== undefined) {
                    child.material.opacity = 0.3 - (orbital.userData.shellIndex * 0.05);
                }
            });
        });
    }

    /**
     * Toma una captura de pantalla del átomo
     */
    takeScreenshot() {
        const renderer = this.sceneConfig.getRenderer();
        return renderer.domElement.toDataURL('image/png');
    }

    /**
     * Limpia todos los recursos
     */
    dispose() {
        if (this.isDisposed) return;

        this.isDisposed = true;

        // Dispose de animador
        if (this.electronAnimator) {
            this.electronAnimator.dispose();
            this.electronAnimator = null;
        }

        // Dispose de generador
        if (this.orbitalGenerator) {
            this.orbitalGenerator.dispose();
            this.orbitalGenerator = null;
        }

        // Dispose de escena
        if (this.sceneConfig) {
            this.sceneConfig.dispose();
            this.sceneConfig = null;
        }

        this.nucleus = null;
        this.orbitals = [];
    }
}

// Exportar como variable global
window.AtomRenderer = AtomRenderer;
