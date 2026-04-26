// ====================================
// COMPONENTE - TABLERO INTERACTIVO
// ====================================

class Tablero {
    constructor() {
        this.canvas = document.getElementById('canvas-area');
        this.stats = document.getElementById('tablero-stats');
        this.countAtoms = document.getElementById('count-atoms');
        this.cursorCoords = document.getElementById('cursor-coords');
        this.explanation = document.getElementById('tablero-explanation');
        
        this.atomos = [];
        this.draggingAtomo = null;
        this.offsetX = 0;
        this.offsetY = 0;
        
        this.init();
    }

    init() {
        this.attachEventListeners();
        this.actualizarStats();
    }

    attachEventListeners() {
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.canvas.addEventListener('mouseup', () => this.handleMouseUp());
        this.canvas.addEventListener('mouseleave', () => this.handleMouseUp());
    }

    agregarAtomo(elemento) {
        // Generar posición aleatoria en el canvas
        const rect = this.canvas.getBoundingClientRect();
        const x = Math.random() * (rect.width - 60);
        const y = Math.random() * (rect.height - 60);

        const atom = {
            id: Date.now(),
            elemento: elemento,
            x: x,
            y: y,
            el: null
        };

        // Crear elemento DOM
        const atomEl = document.createElement('div');
        atomEl.className = `atom ${elemento.categoria}`;
        atomEl.innerHTML = elemento.simbolo;
        atomEl.style.left = x + 'px';
        atomEl.style.top = y + 'px';
        atomEl.dataset.id = atom.id;

        atomEl.addEventListener('mousedown', (e) => this.startDragging(e, atom));
        atomEl.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.removerAtomo(atom.id);
        });

        this.canvas.appendChild(atomEl);
        atom.el = atomEl;
        this.atomos.push(atom);

        // Animar entrada
        atomEl.classList.add('new');
        setTimeout(() => atomEl.classList.remove('new'), 500);

        this.actualizarStats();
        this.mostrarExplicacion();
    }

    startDragging(e, atom) {
        e.preventDefault();
        this.draggingAtomo = atom;
        const rect = this.canvas.getBoundingClientRect();
        this.offsetX = e.clientX - rect.left - atom.x;
        this.offsetY = e.clientY - rect.top - atom.y;
        atom.el.classList.add('dragging');
    }

    handleMouseDown(e) {
        // No hacer nada si es en un átomo
    }

    handleMouseMove(e) {
        // Actualizar coordenadas
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        this.cursorCoords.textContent = `X: ${Math.round(x)}, Y: ${Math.round(y)}`;

        // Arrastrar átomo
        if (this.draggingAtomo) {
            let newX = x - this.offsetX;
            let newY = y - this.offsetY;

            // Limitar dentro del canvas
            newX = Math.max(0, Math.min(newX, rect.width - 50));
            newY = Math.max(0, Math.min(newY, rect.height - 50));

            this.draggingAtomo.x = newX;
            this.draggingAtomo.y = newY;
            this.draggingAtomo.el.style.left = newX + 'px';
            this.draggingAtomo.el.style.top = newY + 'px';
        }
    }

    handleMouseUp() {
        if (this.draggingAtomo) {
            this.draggingAtomo.el.classList.remove('dragging');
            this.draggingAtomo = null;
        }
    }

    removerAtomo(id) {
        const index = this.atomos.findIndex(a => a.id === id);
        if (index > -1) {
            const atom = this.atomos[index];
            atom.el.remove();
            this.atomos.splice(index, 1);
            this.actualizarStats();
        }
    }

    removerTodos() {
        this.atomos.forEach(atom => atom.el.remove());
        this.atomos = [];
        this.actualizarStats();
    }

    actualizarStats() {
        this.countAtoms.textContent = this.atomos.length;
    }

    mostrarExplicacion() {
        const explicaciones = [
            "¡Excelente! Haz clic en más elementos para agregar átomos.",
            "Arrastra los átomos para posicionarlos.",
            "Haz clic derecho en un átomo para eliminarlo.",
            "Experimenta colocando diferentes átomos juntos."
        ];

        const indice = Math.floor(Math.random() * explicaciones.length);
        this.explanation.textContent = explicaciones[indice];
    }

    obtenerAtomos() {
        return this.atomos;
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.tablero = new Tablero();
});
