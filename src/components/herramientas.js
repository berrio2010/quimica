// ====================================
// COMPONENTE - HERRAMIENTAS
// ====================================

class Herramientas {
    constructor() {
        this.container = document.getElementById('herramientas-grid');
        this.herramientas = [
            {
                id: 'balanceador',
                titulo: 'Balanceador de Ecuaciones',
                descripcion: 'Herramienta para equilibrar ecuaciones químicas automáticamente.',
                icono: '⚖️',
                clase: 'balanceador'
            },
            {
                id: 'solubilidad',
                titulo: 'Tabla de Solubilidad',
                descripcion: 'Consulta la solubilidad de diferentes compuestos iónicos.',
                icono: '🧪',
                clase: 'solubilidad'
            },
            {
                id: 'laboratorio',
                titulo: 'Laboratorio Virtual',
                descripcion: 'Realiza experimentos virtuales y simula reacciones químicas.',
                icono: '🔬',
                clase: 'laboratorio'
            }
        ];
        this.init();
    }

    init() {
        this.renderizar();
    }

    renderizar() {
        this.container.innerHTML = '';

        this.herramientas.forEach(herramienta => {
            const card = document.createElement('div');
            card.className = `herramienta-card ${herramienta.clase}`;
            
            card.innerHTML = `
                <div class="herramienta-content">
                    <span class="herramienta-icon">${herramienta.icono}</span>
                    <div class="herramienta-badge">Nueva</div>
                    <h3>${herramienta.titulo}</h3>
                    <p>${herramienta.descripcion}</p>
                    <button class="herramienta-btn" data-id="${herramienta.id}">
                        Abrir Herramienta
                    </button>
                </div>
            `;

            const btn = card.querySelector('.herramienta-btn');
            btn.addEventListener('click', () => this.abrirHerramienta(herramienta.id));

            this.container.appendChild(card);
        });
    }

    abrirHerramienta(id) {
        switch(id) {
            case 'balanceador':
                this.abrirBalanceador();
                break;
            case 'solubilidad':
                this.abrirSolubilidad();
                break;
            case 'laboratorio':
                this.abrirLaboratorio();
                break;
        }
    }

    abrirBalanceador() {
        const ecuacion = prompt('Ingresa la ecuación química (ej: H2 + O2 -> H2O):');
        if (ecuacion) {
            alert(`Balanceador:\n\nEcuación: ${ecuacion}\n\nEsta función está en desarrollo.`);
        }
    }

    abrirSolubilidad() {
        const compuesto = prompt('Ingresa el compuesto a consultar (ej: NaCl):');
        if (compuesto) {
            alert(`Tabla de Solubilidad:\n\nCompuesto: ${compuesto}\n\nSolubilidad: Datos en desarrollo.`);
        }
    }

    abrirLaboratorio() {
        alert('Laboratorio Virtual:\n\nBienvenido al laboratorio virtual.\n\nAquí podrás simular reacciones químicas.\n\nEsta función está en desarrollo.');
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.herramientas = new Herramientas();
});
