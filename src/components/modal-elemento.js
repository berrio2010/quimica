// ====================================
// COMPONENTE - MODAL FLOTANTE
// ====================================

class ModalElemento {
    constructor() {
        this.overlay = document.getElementById('modal-overlay');
        this.modal = document.getElementById('modal-element');
        this.closeBtn = document.getElementById('modal-close');
        this.closeBtnAlt = document.getElementById('modal-close-btn');
        this.addAtomBtn = document.getElementById('modal-add-atom');
        this.elementoActual = null;
        this.atomo3D = null;
        this.init();
    }

    init() {
        this.closeBtn.addEventListener('click', () => this.cerrar());
        this.closeBtnAlt.addEventListener('click', () => this.cerrar());
        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay) this.cerrar();
        });
        this.addAtomBtn.addEventListener('click', () => this.agregarAlTablero());
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

        // Limpiar visualizador 3D anterior
        if (this.atomo3D) {
            this.atomo3D.dispose();
        }

        // Crear nuevo visualizador 3D usando el nuevo módulo
        const container3D = document.getElementById('modal-atom-3d');
        container3D.innerHTML = ''; // Limpiar
        container3D.classList.add('atom-3d-container');
        
        // Usar el nuevo AtomRenderer
        this.atomo3D = new AtomRenderer();
        this.atomo3D.renderAtom(elemento, container3D);

        // Mostrar modal
        this.overlay.classList.add('active');
    }

    cerrar() {
        this.overlay.classList.remove('active');
        this.elementoActual = null;
        
        // Limpiar visualizador 3D
        if (this.atomo3D) {
            this.atomo3D.dispose();
            this.atomo3D = null;
        }
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

    agregarAlTablero() {
        if (!this.elementoActual) return;
        
        // Agregar el elemento al tablero
        if (window.tablero) {
            window.tablero.agregarAtomo(this.elementoActual);
            
            // Cambiar a la vista del tablero
            if (window.navbar) {
                window.navbar.switchView('tablero');
            }
            
            // Cerrar el modal
            this.cerrar();
        }
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.modal = new ModalElemento();
});
