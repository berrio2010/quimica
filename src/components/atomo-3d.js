// ====================================
// COMPONENTE - VISUALIZADOR DE ÁTOMO 3D
// ====================================

class Atomo3D {
    constructor(containerId, elemento) {
        this.container = document.getElementById(containerId);
        this.elemento = elemento;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.atom = null;
        this.orbitales = [];
        this.rotationX = 0;
        this.rotationY = 0;
        this.isDragging = false;
        this.previousMousePosition = { x: 0, y: 0 };
        
        this.init();
    }

    init() {
        if (!this.container) return;

        // Crear escena
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x0a1628);

        // Crear cámara
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        this.camera.position.z = 150;

        // Crear renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.container.appendChild(this.renderer.domElement);

        // Agregar iluminación
        this.agregarIluminacion();

        // Crear átomo
        this.crearAtomo();

        // Crear orbitales
        this.crearOrbitales();

        // Manejar eventos
        this.attachEventListeners();

        // Animación
        this.animate();

        // Redimensionar responsivamente
        window.addEventListener('resize', () => this.onWindowResize());
    }

    agregarIluminacion() {
        // Luz ambiente
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);

        // Luz puntual
        const pointLight = new THREE.PointLight(0x00E5FF, 1.5, 500);
        pointLight.position.set(100, 100, 100);
        this.scene.add(pointLight);

        // Segunda luz
        const pointLight2 = new THREE.PointLight(0xFF6B9D, 0.8, 500);
        pointLight2.position.set(-100, -100, 100);
        this.scene.add(pointLight2);
    }

    crearAtomo() {
        const color = this.obtenerColorElemento(this.elemento.categoria);
        const radio = this.obtenerRadioAtomo(this.elemento.numero);

        // Crear núcleo
        const geometry = new THREE.SphereGeometry(radio, 64, 64);
        const material = new THREE.MeshPhongMaterial({
            color: color,
            emissive: color,
            emissiveIntensity: 0.5,
            shininess: 100
        });

        this.atom = new THREE.Mesh(geometry, material);
        this.atom.castShadow = true;
        this.atom.receiveShadow = true;
        this.scene.add(this.atom);
    }

    crearOrbitales() {
        const colores = [0x00E5FF, 0xFF6B9D, 0x4ECDC4];
        const radios = [60, 100, 140];

        for (let i = 0; i < 3; i++) {
            const curve = new THREE.EllipseCurve(0, 0, radios[i], radios[i], 0, Math.PI * 2);
            const points = curve.getPoints(100);
            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            const material = new THREE.LineBasicMaterial({
                color: colores[i],
                linewidth: 2,
                fog: false
            });

            const orbital = new THREE.Line(geometry, material);
            orbital.rotation.x = Math.PI / 4 + i * 0.3;
            orbital.rotation.y = i * 0.5;

            this.scene.add(orbital);
            this.orbitales.push({
                mesh: orbital,
                rotationSpeed: 0.005 + i * 0.002
            });
        }
    }

    obtenerColorElemento(categoria) {
        const colores = {
            'alcalinos': 0xFF6B6B,
            'alcalinoterreos': 0xFFA500,
            'transicion': 0x9D4EDD,
            'nometales': 0x00D9FF,
            'gasesnobles': 0x64B5F6,
            'lantanidos': 0xFFD700,
            'actinidos': 0xFF69B4
        };
        return colores[categoria] || 0x00E5FF;
    }

    obtenerRadioAtomo(numero) {
        // Radio aproximado en Ångströms normalizado
        return Math.max(15, Math.min(40, 10 + numero * 0.3));
    }

    attachEventListeners() {
        this.renderer.domElement.addEventListener('mousedown', (e) => this.onMouseDown(e));
        this.renderer.domElement.addEventListener('mousemove', (e) => this.onMouseMove(e));
        this.renderer.domElement.addEventListener('mouseup', () => this.onMouseUp());
        this.renderer.domElement.addEventListener('touchstart', (e) => this.onTouchStart(e));
        this.renderer.domElement.addEventListener('touchmove', (e) => this.onTouchMove(e));
        this.renderer.domElement.addEventListener('touchend', () => this.onMouseUp());
    }

    onMouseDown(e) {
        this.isDragging = true;
        this.previousMousePosition = { x: e.clientX, y: e.clientY };
    }

    onMouseMove(e) {
        if (!this.isDragging) return;

        const deltaX = e.clientX - this.previousMousePosition.x;
        const deltaY = e.clientY - this.previousMousePosition.y;

        this.rotationY += deltaX * 0.01;
        this.rotationX += deltaY * 0.01;

        this.previousMousePosition = { x: e.clientX, y: e.clientY };
    }

    onMouseUp() {
        this.isDragging = false;
    }

    onTouchStart(e) {
        if (e.touches.length === 1) {
            this.isDragging = true;
            this.previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }
    }

    onTouchMove(e) {
        if (!this.isDragging || e.touches.length !== 1) return;

        const deltaX = e.touches[0].clientX - this.previousMousePosition.x;
        const deltaY = e.touches[0].clientY - this.previousMousePosition.y;

        this.rotationY += deltaX * 0.01;
        this.rotationX += deltaY * 0.01;

        this.previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        // Rotación automática
        if (!this.isDragging) {
            this.rotationY += 0.003;
            this.rotationX += 0.001;
        }

        // Aplicar rotación al átomo
        this.atom.rotation.x = this.rotationX;
        this.atom.rotation.y = this.rotationY;

        // Animar orbitales
        this.orbitales.forEach((orbital, index) => {
            orbital.mesh.rotation.x += orbital.rotationSpeed;
            orbital.mesh.rotation.y += orbital.rotationSpeed * 0.7;
            
            // Pulsación de color
            const intensity = 0.5 + Math.sin(Date.now() * 0.001 + index) * 0.3;
            orbital.mesh.material.opacity = intensity;
        });

        // Renderizar escena
        this.renderer.render(this.scene, this.camera);
    }

    onWindowResize() {
        if (!this.container) return;

        const width = this.container.clientWidth;
        const height = this.container.clientHeight;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    dispose() {
        if (this.renderer) {
            this.renderer.dispose();
            this.renderer.domElement.remove();
        }
        if (this.scene) {
            this.scene.clear();
        }
    }
}
