// ====================================
// GENERADOR DE ORBITALES
// ====================================

class OrbitalGenerator {
    constructor() {
        this.orbitalRadii = [15, 30, 45, 60, 75, 90]; // Radios para cada capa
        this.shellData = [];
    }

    /**
     * Genera orbitales basados en la configuración electrónica
     * @param {string|object} configElectronica - Ej: "1s2 2s2 2p6" o número atómico
     * @param {object} sceneConfig - Instancia de SceneConfig
     * @returns {array} Array de objetos orbitales
     */
    generateOrbitals(configElectronica, sceneConfig) {
        this.shellData = this.parseConfiguration(configElectronica);
        const orbitals = [];

        const materials = window.atomMaterials;

        // Crear orbital para cada capa
        this.shellData.forEach((shell, index) => {
            const orbitalGroup = new THREE.Group();
            orbitalGroup.name = `shell_${index}`;

            const radius = this.orbitalRadii[index] || (15 + index * 15);

            // Opción 1: Crear torus (anillo 3D sólido)
            const torusGeometry = new THREE.TorusGeometry(radius, 1, 8, 64);
            const torusMaterial = materials.createCustomMaterial({
                color: 0x00e5ff,
                emissive: 0x00e5ff,
                emissiveIntensity: 0.4,
                metalness: 0.5,
                roughness: 0.5,
                transparent: true,
                opacity: 0.3 - (index * 0.05),
                wireframe: false
            });

            const torus = new THREE.Mesh(torusGeometry, torusMaterial);
            orbitalGroup.add(torus);

            // Opción 2: Crear línea circular (wireframe)
            const points = [];
            for (let i = 0; i <= 64; i++) {
                const angle = (i / 64) * Math.PI * 2;
                points.push(
                    new THREE.Vector3(
                        Math.cos(angle) * radius,
                        Math.sin(angle) * radius * 0.3,
                        Math.sin(angle) * radius * 0.7
                    )
                );
            }

            const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
            const lineMaterial = new THREE.LineBasicMaterial({
                color: 0x00e5ff,
                linewidth: 2,
                opacity: 0.6,
                transparent: true
            });

            const line = new THREE.Line(lineGeometry, lineMaterial);
            orbitalGroup.add(line);

            // Rotación inicial para variación visual
            orbitalGroup.rotation.x = Math.random() * 0.5;
            orbitalGroup.rotation.y = Math.random() * Math.PI * 2;

            // Guardar datos del orbital
            orbitalGroup.userData = {
                shellIndex: index,
                electronCount: shell.electrons,
                radius: radius,
                electrons: []
            };

            orbitals.push(orbitalGroup);
            sceneConfig.getScene().add(orbitalGroup);
        });

        return orbitals;
    }

    /**
     * Parsea la configuración electrónica
     * Ejemplo: "1s2 2s2 2p6" -> [{shell: 1, subshell: 's', electrons: 2}, ...]
     * @param {string|number} config - Configuración o número atómico
     * @returns {array}
     */
    parseConfiguration(config) {
        // Si es número, convertir a configuración
        if (typeof config === 'number') {
            return this.getConfigFromAtomicNumber(config);
        }

        // Si es string, parsear
        if (typeof config === 'string') {
            const shells = [];
            const regex = /(\d)([spdf])(\d+)/g;
            let match;

            while ((match = regex.exec(config)) !== null) {
                shells.push({
                    shell: parseInt(match[1]),
                    subshell: match[2],
                    electrons: parseInt(match[3])
                });
            }

            // Agrupar por capa principal
            const grouped = {};
            shells.forEach(shell => {
                if (!grouped[shell.shell]) {
                    grouped[shell.shell] = { shell: shell.shell, electrons: 0 };
                }
                grouped[shell.shell].electrons += shell.electrons;
            });

            return Object.values(grouped).sort((a, b) => a.shell - b.shell);
        }

        // Por defecto, devolver configuración del hidrógeno
        return [{ shell: 1, electrons: 1 }];
    }

    /**
     * Obtiene configuración electrónica desde número atómico
     * @param {number} atomicNumber - Número atómico (Z)
     * @returns {array}
     */
    getConfigFromAtomicNumber(atomicNumber) {
        const configurations = {
            1: '1s1',
            2: '1s2',
            3: '1s2 2s1',
            4: '1s2 2s2',
            5: '1s2 2s2 2p1',
            6: '1s2 2s2 2p2',
            7: '1s2 2s2 2p3',
            8: '1s2 2s2 2p4',
            9: '1s2 2s2 2p5',
            10: '1s2 2s2 2p6',
            11: '1s2 2s2 2p6 3s1',
            12: '1s2 2s2 2p6 3s2',
            13: '1s2 2s2 2p6 3s2 3p1',
            14: '1s2 2s2 2p6 3s2 3p2',
            15: '1s2 2s2 2p6 3s2 3p3',
            16: '1s2 2s2 2p6 3s2 3p4',
            17: '1s2 2s2 2p6 3s2 3p5',
            18: '1s2 2s2 2p6 3s2 3p6',
            19: '[Ar] 4s1',
            20: '[Ar] 4s2',
            29: '[Ar] 3d10 4s1',
            30: '[Ar] 3d10 4s2'
        };

        const config = configurations[atomicNumber] || '1s1';
        return this.parseConfiguration(config);
    }

    /**
     * Obtiene información sobre un orbital específico
     */
    getOrbitalInfo(index) {
        if (index < this.shellData.length) {
            return this.shellData[index];
        }
        return null;
    }

    /**
     * Obtiene el número total de electrones de los orbitales
     */
    getTotalElectrons() {
        return this.shellData.reduce((sum, shell) => sum + shell.electrons, 0);
    }

    /**
     * Limpia geometrías
     */
    dispose() {
        this.shellData = [];
    }
}

// Exportar como variable global
window.OrbitalGenerator = OrbitalGenerator;
