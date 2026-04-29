// ====================================
// CONFIGURACIÓN - ESCENA THREE.JS
// ====================================

class SceneConfig {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.container = null;
        this.width = 0;
        this.height = 0;
        this.animationId = null;
    }

    /**
     * Inicializa la escena Three.js en un contenedor
     * @param {HTMLElement} container - Elemento DOM donde montar el canvas
     */
    initScene(container) {
        if (!container) {
            console.error('Container no proporcionado para SceneConfig');
            return false;
        }

        this.container = container;
        this.width = container.clientWidth || 400;
        this.height = container.clientHeight || 400;

        // Crear escena
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x0a1628); // Fondo oscuro
        this.scene.fog = new THREE.Fog(0x0a1628, 100, 1000);

        // Crear cámara
        this.camera = new THREE.PerspectiveCamera(
            75,
            this.width / this.height,
            0.1,
            1000
        );
        this.camera.position.z = 50;

        // Crear renderer
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true, 
            alpha: true,
            precision: 'highp'
        });
        this.renderer.setSize(this.width, this.height);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFShadowShadowMap;

        // Limpiar contenedor y montar renderer
        container.innerHTML = '';
        container.appendChild(this.renderer.domElement);

        // Aplicar estilos al canvas
        this.renderer.domElement.style.borderRadius = '8px';
        this.renderer.domElement.style.boxShadow = '0 0 30px rgba(0, 229, 255, 0.3)';
        this.renderer.domElement.style.display = 'block';

        // Agregar luces
        this.setupLights();

        // Manejar redimensionamiento
        window.addEventListener('resize', () => this.onWindowResize());

        return true;
    }

    /**
     * Configura las luces de la escena
     */
    setupLights() {
        // Luz ambiental
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);

        // Luz puntual - Cyan
        const pointLight1 = new THREE.PointLight(0x00e5ff, 1, 100);
        pointLight1.position.set(30, 30, 30);
        pointLight1.castShadow = true;
        this.scene.add(pointLight1);

        // Luz puntual - Magenta
        const pointLight2 = new THREE.PointLight(0xff6b9d, 0.8, 100);
        pointLight2.position.set(-30, -30, 30);
        pointLight2.castShadow = true;
        this.scene.add(pointLight2);

        // Luz de relleno suave
        const fillLight = new THREE.DirectionalLight(0xffffff, 0.4);
        fillLight.position.set(0, 0, 50);
        this.scene.add(fillLight);
    }

    /**
     * Maneja el redimensionamiento de la ventana
     */
    onWindowResize() {
        if (!this.container) return;

        const newWidth = this.container.clientWidth || 400;
        const newHeight = this.container.clientHeight || 400;

        if (newWidth !== this.width || newHeight !== this.height) {
            this.width = newWidth;
            this.height = newHeight;

            this.camera.aspect = this.width / this.height;
            this.camera.updateProjectionMatrix();

            this.renderer.setSize(this.width, this.height);
        }
    }

    /**
     * Retorna la escena actual
     */
    getScene() {
        return this.scene;
    }

    /**
     * Retorna la cámara actual
     */
    getCamera() {
        return this.camera;
    }

    /**
     * Retorna el renderer actual
     */
    getRenderer() {
        return this.renderer;
    }

    /**
     * Limpia la escena
     */
    clearScene() {
        if (!this.scene) return;

        // Remover todos los objetos
        while (this.scene.children.length > 0) {
            const obj = this.scene.children[0];
            this.scene.remove(obj);

            // Limpiar geometría y materiales
            if (obj.geometry) obj.geometry.dispose();
            if (obj.material) {
                if (Array.isArray(obj.material)) {
                    obj.material.forEach(m => m.dispose());
                } else {
                    obj.material.dispose();
                }
            }
        }

        // Re-agregar luces
        this.setupLights();
    }

    /**
     * Inicia el loop de animación
     */
    startRenderLoop(animationCallback) {
        const animate = () => {
            this.animationId = requestAnimationFrame(animate);

            if (animationCallback && typeof animationCallback === 'function') {
                animationCallback();
            }

            this.renderer.render(this.scene, this.camera);
        };

        animate();
    }

    /**
     * Detiene el loop de animación
     */
    stopRenderLoop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    /**
     * Rota la cámara alrededor del objeto
     */
    rotateCamera(deltaX, deltaY) {
        if (!this.camera) return;

        const radius = this.camera.position.length();
        let theta = Math.atan2(this.camera.position.x, this.camera.position.z);
        let phi = Math.acos(this.camera.position.y / radius);

        theta -= deltaX * 0.01;
        phi += deltaY * 0.01;

        phi = Math.max(0.1, Math.min(Math.PI - 0.1, phi));

        this.camera.position.x = radius * Math.sin(phi) * Math.sin(theta);
        this.camera.position.y = radius * Math.cos(phi);
        this.camera.position.z = radius * Math.sin(phi) * Math.cos(theta);
        this.camera.lookAt(0, 0, 0);
    }

    /**
     * Limpia todos los recursos
     */
    dispose() {
        this.stopRenderLoop();
        this.clearScene();

        if (this.renderer) {
            this.renderer.dispose();
            if (this.renderer.domElement.parentNode) {
                this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
            }
        }

        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.container = null;
    }
}

// Exportar como variable global
window.SceneConfig = SceneConfig;
