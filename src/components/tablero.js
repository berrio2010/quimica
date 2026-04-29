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
        this.enlaces = [];
        this.draggingAtomo = null;
        this.offsetX = 0;
        this.offsetY = 0;
        
        // Tabla de electronegatividad (Escala de Pauling)
        this.electronegatividad = {
            'H': 2.20, 'C': 2.55, 'N': 3.04, 'O': 3.44, 'F': 3.98, 'P': 2.19,
            'S': 2.58, 'Cl': 3.16, 'Br': 2.96, 'I': 2.66, 'Li': 0.98, 'Na': 0.93,
            'K': 0.82, 'Ca': 1.00, 'Mg': 1.31, 'Al': 1.61, 'Si': 1.90, 'B': 2.04,
            'Be': 1.57, 'Fe': 1.83, 'Cu': 1.90, 'Zn': 1.65, 'Ag': 1.93, 'Pb': 2.33,
            'Sn': 1.96, 'As': 2.18, 'Se': 2.55, 'Cr': 1.66, 'Mn': 1.55, 'Co': 1.88,
            'Ni': 1.91, 'Pb': 1.87
        };
        
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
        // Posicionar en el centro del canvas usando offsetWidth/offsetHeight
        const ancho = this.canvas.offsetWidth;
        const alto = this.canvas.offsetHeight;
        const x = (ancho - 60) / 2;
        const y = (alto - 60) / 2;

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
        this.detectarEnlaces();
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
            // Detectar enlaces cuando se suelta el átomo
            this.detectarEnlaces();
            this.mostrarExplicacion();
        }
    }

    removerAtomo(id) {
        const index = this.atomos.findIndex(a => a.id === id);
        if (index > -1) {
            const atom = this.atomos[index];
            atom.el.remove();
            this.atomos.splice(index, 1);
            this.actualizarStats();
            // Limpiar enlaces asociados
            this.limpiarEnlaces();
            this.detectarEnlaces();
            this.mostrarExplicacion();
        }
    }

    removerTodos() {
        this.atomos.forEach(atom => atom.el.remove());
        this.atomos = [];
        this.limpiarEnlaces();
        this.actualizarStats();
    }

    detectarEnlaces() {
        // Limpiar enlaces previos
        this.limpiarEnlaces();

        // Distancia máxima para considerar un enlace (en píxeles)
        const distanciaMaxima = 150;

        // Comparar cada átomo con los demás
        for (let i = 0; i < this.atomos.length; i++) {
            for (let j = i + 1; j < this.atomos.length; j++) {
                const atomo1 = this.atomos[i];
                const atomo2 = this.atomos[j];

                // Calcular distancia entre centros de los átomos
                const dx = (atomo1.x + 30) - (atomo2.x + 30);
                const dy = (atomo1.y + 30) - (atomo2.y + 30);
                const distancia = Math.sqrt(dx * dx + dy * dy);

                if (distancia < distanciaMaxima) {
                    this.crearEnlace(atomo1, atomo2, distancia);
                }
            }
        }
    }

    mostrarExplicacionEnlace() {
        if (this.enlaces.length === 0) return;

        const enlace = this.enlaces[0]; // Mostrar el primer enlace
        const atomo1 = enlace.atomo1.elemento;
        const atomo2 = enlace.atomo2.elemento;
        const diferencia = enlace.diferencia.toFixed(2);
        
        let explicacion = '';
        
        if (enlace.tipoEnlace === 'IÓNICO') {
            explicacion = `⚛️ Enlace Iónico: ${atomo1.simbolo} y ${atomo2.simbolo} forman un enlace iónico (ΔEN = ${diferencia}). El electrón se transfiere del átomo menos electronegativo al más electronegativo.`;
        } else if (enlace.tipoEnlace === 'COVALENTE POLAR') {
            explicacion = `⚛️ Enlace Covalente Polar: ${atomo1.simbolo} y ${atomo2.simbolo} comparten electrones desigualmente (ΔEN = ${diferencia}). Uno atrae más los electrones que el otro.`;
        } else {
            explicacion = `⚛️ Enlace Covalente Puro: ${atomo1.simbolo} y ${atomo2.simbolo} comparten electrones equitativamente (ΔEN = ${diferencia}). Ambos átomos atraen los electrones con igual fuerza.`;
        }

        this.explanation.textContent = explicacion;
    }

    crearEnlace(atomo1, atomo2, distancia) {
        // Obtener electronegatividades
        const en1 = this.electronegatividad[atomo1.elemento.simbolo] || 2.0;
        const en2 = this.electronegatividad[atomo2.elemento.simbolo] || 2.0;

        // Calcular diferencia de electronegatividad
        const diferencia = Math.abs(en1 - en2);

        // Determinar tipo de enlace
        let tipoEnlace = '';
        let color = '';

        if (diferencia > 1.7) {
            tipoEnlace = 'IÓNICO';
            color = '#FF6B6B'; // Rojo
        } else if (diferencia > 0.4) {
            tipoEnlace = 'COVALENTE POLAR';
            color = '#FFD700'; // Oro
        } else {
            tipoEnlace = 'COVALENTE PURO';
            color = '#00D9FF'; // Cyan
        }

        // Crear línea de enlace
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('class', 'enlace-svg');
        svg.style.position = 'absolute';
        svg.style.top = '0';
        svg.style.left = '0';
        svg.style.width = '100%';
        svg.style.height = '100%';
        svg.style.pointerEvents = 'none';
        svg.style.zIndex = '10';

        const x1 = atomo1.x + 30;
        const y1 = atomo1.y + 30;
        const x2 = atomo2.x + 30;
        const y2 = atomo2.y + 30;

        // Línea del enlace
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', x1);
        line.setAttribute('y1', y1);
        line.setAttribute('x2', x2);
        line.setAttribute('y2', y2);
        line.setAttribute('stroke', color);
        line.setAttribute('stroke-width', '3');
        line.setAttribute('class', 'bond-line');
        line.style.filter = `drop-shadow(0 0 3px ${color})`;

        svg.appendChild(line);

        // Texto del tipo de enlace en el centro
        const midX = (x1 + x2) / 2;
        const midY = (y1 + y2) / 2;

        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', midX);
        text.setAttribute('y', midY - 10);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('fill', color);
        text.setAttribute('font-size', '12');
        text.setAttribute('font-weight', 'bold');
        text.setAttribute('class', 'bond-label');
        text.style.filter = `drop-shadow(0 0 2px rgba(0,0,0,0.8))`;
        text.textContent = tipoEnlace;

        svg.appendChild(text);

        // Agregar tooltip con información
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip-enlace';
        tooltip.style.position = 'absolute';
        tooltip.style.left = midX + 'px';
        tooltip.style.top = midY + 'px';
        tooltip.style.pointerEvents = 'none';
        tooltip.title = `${atomo1.elemento.simbolo}-${atomo2.elemento.simbolo}\nEnlace: ${tipoEnlace}\nDiferencia EN: ${diferencia.toFixed(2)}`;

        this.canvas.appendChild(svg);

        this.enlaces.push({
            atomo1,
            atomo2,
            svg,
            tipoEnlace,
            diferencia
        });
    }

    limpiarEnlaces() {
        this.enlaces.forEach(enlace => {
            if (enlace.svg && enlace.svg.parentNode) {
                enlace.svg.remove();
            }
        });
        this.enlaces = [];
    }

    actualizarStats() {
        this.countAtoms.textContent = this.atomos.length;
    }

    mostrarExplicacion() {
        // Detectar moléculas presentes
        const moleculas = this.detectarMoleculas();

        if (moleculas && moleculas.length > 0) {
            // Si hay moléculas, mostrarlas como prioridad
            let explicacion = '🧪 Moléculas Formadas:\n\n';
            moleculas.forEach((mol, index) => {
                explicacion += `${index + 1}. ${mol.nombre} (${mol.formula}): ${mol.descripcion}\n\n`;
            });
            this.explanation.textContent = explicacion.trim();
        } else if (this.enlaces.length > 0) {
            // Si hay enlaces pero no molécula completa, mostrar explicación del enlace
            this.mostrarExplicacionEnlace();
        } else {
            // Si no hay enlaces, mostrar mensaje genérico
            const explicaciones = [
                "¡Excelente! Acerca los átomos para ver qué tipo de enlace forman.",
                "Arrastra los átomos para posicionarlos y observar los enlaces.",
                "Haz clic derecho en un átomo para eliminarlo.",
                "Los diferentes colores indican tipos de enlace distintos."
            ];

            const indice = Math.floor(Math.random() * explicaciones.length);
            this.explanation.textContent = explicaciones[indice];
        }
    }

    detectarMoleculas() {
        if (this.atomos.length === 0) return [];

        // Obtener símbolos de los átomos presentes
        const atomosPresentes = this.atomos.map(a => a.elemento.simbolo);

        // Usar la función global detectarTodasLasMoleculas de moleculas.js
        if (typeof detectarTodasLasMoleculas === 'function') {
            const todasLasMoleculas = detectarTodasLasMoleculas(atomosPresentes);
            return todasLasMoleculas.map(m => m.datos);
        }

        return [];
    }

    obtenerAtomos() {
        return this.atomos;
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.tablero = new Tablero();
});
