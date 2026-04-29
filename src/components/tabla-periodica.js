// ====================================
// COMPONENTE - TABLA PERIÓDICA
// ====================================

class TablaPeriodica {
    constructor() {
        this.container = document.getElementById('tabla-periódica');
        this.elementos = ELEMENTOS;
        this.elementoSeleccionado = null;
        this.init();
    }

    init() {
        this.renderizar();
        this.attachEventListeners();
    }

    renderizar() {
        this.container.innerHTML = '';

        this.elementos.forEach(elemento => {
            const button = document.createElement('button');
            button.className = `elemento-btn ${elemento.categoria} periodo-${elemento.periodo} grupo-${elemento.grupo}`;
            
            // Clasificación especial para lantánidos y actínidos
            if (elemento.numero >= 57 && elemento.numero <= 71) {
                button.classList.add('lantanidos');
                button.classList.add(`lan-${elemento.numero - 56}`);
            } else if (elemento.numero >= 89 && elemento.numero <= 103) {
                button.classList.add('actinidos');
                button.classList.add(`act-${elemento.numero - 88}`);
            }

            button.innerHTML = `
                <span class="elemento-numero">${elemento.numero}</span>
                <span class="elemento-simbolo">${elemento.simbolo}</span>
                <span class="elemento-nombre">${elemento.nombre}</span>
            `;

            button.addEventListener('click', () => {
                this.seleccionarElemento(elemento);
                window.modal?.mostrar(elemento);
            });

            this.container.appendChild(button);
        });
    }

    seleccionarElemento(elemento) {
        this.elementoSeleccionado = elemento;
        // Remover clase selected de todos los botones
        document.querySelectorAll('.elemento-btn').forEach(btn => {
            btn.style.borderColor = '';
            btn.style.boxShadow = '';
        });
        
        // Agregar clase selected al elemento actual
        const button = event.target.closest('.elemento-btn');
        if (button) {
            button.style.borderColor = 'var(--button-active)';
            button.style.boxShadow = '0 0 30px var(--shadow-glow)';
        }
    }

    attachEventListeners() {
        // Eventos ya agregados en renderizar()
    }

    // Método para obtener elemento por símbolo
    obtenerElemento(simbolo) {
        return this.elementos.find(e => e.simbolo === simbolo);
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.tabla = new TablaPeriodica();
});
