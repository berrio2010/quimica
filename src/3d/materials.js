// ====================================
// MATERIALES - COLORES Y ESTILOS 3D
// ====================================

class AtomMaterials {
    constructor() {
        this.materials = {};
        this.initMaterials();
    }

    /**
     * Inicializa todos los materiales futuristas
     */
    initMaterials() {
        // Material del núcleo - Cyan neón brillante
        this.materials.nucleus = new THREE.MeshStandardMaterial({
            color: 0x00e5ff,
            emissive: 0x00e5ff,
            emissiveIntensity: 0.8,
            metalness: 0.7,
            roughness: 0.2,
            wireframe: false
        });

        // Material del núcleo alternativo - Blanco intenso
        this.materials.nucleusWhite = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            emissive: 0xffffff,
            emissiveIntensity: 0.6,
            metalness: 0.8,
            roughness: 0.1,
            wireframe: false
        });

        // Material de orbitales - Línea fina cyan
        this.materials.orbitalWireframe = new THREE.LineBasicMaterial({
            color: 0x00e5ff,
            linewidth: 2,
            opacity: 0.8,
            transparent: true
        });

        // Material de orbitales - Torus sólido
        this.materials.orbitalTorus = new THREE.MeshStandardMaterial({
            color: 0x00e5ff,
            emissive: 0x00e5ff,
            emissiveIntensity: 0.3,
            metalness: 0.5,
            roughness: 0.5,
            wireframe: false,
            transparent: true,
            opacity: 0.4
        });

        // Material de orbitales - Wireframe
        this.materials.orbitalWireframeMesh = new THREE.MeshStandardMaterial({
            color: 0x00e5ff,
            emissive: 0x00e5ff,
            emissiveIntensity: 0.5,
            metalness: 0.6,
            roughness: 0.3,
            wireframe: true,
            transparent: false
        });

        // Material de electrones - Punto blanco brillante
        this.materials.electron = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            emissive: 0xffffff,
            emissiveIntensity: 0.9,
            metalness: 1,
            roughness: 0,
            wireframe: false
        });

        // Material de electrones - Magenta
        this.materials.electronMagenta = new THREE.MeshStandardMaterial({
            color: 0xff6b9d,
            emissive: 0xff6b9d,
            emissiveIntensity: 0.8,
            metalness: 0.9,
            roughness: 0.1,
            wireframe: false
        });

        // Material de electrones - Cyan
        this.materials.electronCyan = new THREE.MeshStandardMaterial({
            color: 0x00e5ff,
            emissive: 0x00e5ff,
            emissiveIntensity: 0.8,
            metalness: 0.9,
            roughness: 0.1,
            wireframe: false
        });

        // Material de electrones - Amarillo
        this.materials.electronYellow = new THREE.MeshStandardMaterial({
            color: 0xffff00,
            emissive: 0xffff00,
            emissiveIntensity: 0.7,
            metalness: 0.8,
            roughness: 0.2,
            wireframe: false
        });
    }

    /**
     * Obtiene un material específico
     * @param {string} name - Nombre del material
     */
    getMaterial(name) {
        return this.materials[name] || this.materials.nucleus;
    }

    /**
     * Obtiene el material del núcleo
     */
    getNucleusMaterial() {
        return this.materials.nucleus;
    }

    /**
     * Obtiene el material de orbital
     */
    getOrbitalMaterial() {
        return this.materials.orbitalWireframe;
    }

    /**
     * Obtiene un material de electrón con color alternativo
     * @param {number} index - Índice del electrón para variar colores
     */
    getElectronMaterial(index) {
        const colors = [
            this.materials.electron,
            this.materials.electronCyan,
            this.materials.electronMagenta,
            this.materials.electronYellow
        ];
        return colors[index % colors.length];
    }

    /**
     * Crea un material personalizado
     * @param {object} options - Opciones del material
     */
    createCustomMaterial(options = {}) {
        const defaults = {
            color: 0x00e5ff,
            emissive: 0x00e5ff,
            emissiveIntensity: 0.5,
            metalness: 0.7,
            roughness: 0.3,
            wireframe: false
        };

        return new THREE.MeshStandardMaterial({
            ...defaults,
            ...options
        });
    }

    /**
     * Obtiene material de línea para orbitales
     */
    getLineOrbitalMaterial() {
        return this.materials.orbitalWireframe;
    }

    /**
     * Limpia los materiales (dispose)
     */
    dispose() {
        Object.values(this.materials).forEach(material => {
            if (material && typeof material.dispose === 'function') {
                material.dispose();
            }
        });
        this.materials = {};
    }
}

// Crear instancia global
window.atomMaterials = new AtomMaterials();
