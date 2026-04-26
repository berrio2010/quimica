// ====================================
// COMPONENTE - MODAL FLOTANTE
// ====================================

class ModalElemento {
    constructor() {
        this.overlay = document.getElementById('modal-overlay');
        this.modal = document.getElementById('modal-element');
        this.closeBtn = document.getElementById('modal-close');
        this.closeBtnAlt = document.getElementById('modal-close-btn');
        this.simulateBtn = document.getElementById('modal-simulate');
        this.elementoActual = null;
        this.init();
    }

    init() {
        this.closeBtn.addEventListener('click', () => this.cerrar());
        this.closeBtnAlt.addEventListener('click', () => this.cerrar());
        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay) this.cerrar();
        });
        this.simulateBtn.addEventListener('click', () => this.simularReaccion());
    }

    mostrar(elemento) {
        this.elementoActual = elemento;
        
        // Rellenar datos del modal
        document.getElementById('modal-name').textContent = elemento.nombre;
        document.getElementById('modal-symbol').textContent = elemento.simbolo;
        document.getElementById('modal-number').textContent = `Z = ${elemento.numero}`;
        document.getElementById('modal-mass').textContent = elemento.masa;
        document.getElementById('modal-type').textContent = elemento.tipo;
        document.getElementById('modal-state').textContent = elemento.estado;
        document.getElementById('modal-group').textContent = `Grupo ${elemento.grupo}`;
        document.getElementById('modal-period').textContent = `Período ${elemento.periodo}`;
        document.getElementById('modal-ions').textContent = elemento.iones.length > 0 ? elemento.iones.join(', ') : 'No tiene iones comunes';
        document.getElementById('modal-config').textContent = elemento.config;
        document.getElementById('modal-description').textContent = elemento.descripcion;

        // Cambiar color del núcleo según elemento
        const nucleusColor = this.obtenerColor(elemento.categoria);
        document.getElementById('atom-nucleus').style.background = `radial-gradient(circle, ${nucleusColor}, ${nucleusColor}99)`;
        document.getElementById('atom-nucleus').style.boxShadow = `0 0 20px ${nucleusColor}`;

        // Mostrar modal
        this.overlay.classList.add('active');
    }

    cerrar() {
        this.overlay.classList.remove('active');
        this.elementoActual = null;
    }

    obtenerColor(categoria) {
        const colores = {
            'alcalinos': '#FF6B6B',
            'alcalinoterreos': '#FFA500',
            'transicion': '#9D4EDD',
            'nometales': '#00D9FF',
            'gasesnobles': '#64B5F6',
            'lantanidos': '#FFD700',
            'actinidos': '#FF69B4'
        };
        return colores[categoria] || '#00E5FF';
    }

    simularReaccion() {
        if (!this.elementoActual) return;
        
        alert(`Simulación: Reacción del ${this.elementoActual.nombre}\n\nEste es un ejemplo de simulación interactiva.`);
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.modal = new ModalElemento();
});
