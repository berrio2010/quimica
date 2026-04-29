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

        // Datos de solubilidad
        this.tablaSolubilidad = {
            'NaCl': { nombre: 'Cloruro de Sodio', solubilidad: 'Muy soluble', codigo: 'S' },
            'NaBr': { nombre: 'Bromuro de Sodio', solubilidad: 'Muy soluble', codigo: 'S' },
            'NaI': { nombre: 'Yoduro de Sodio', solubilidad: 'Muy soluble', codigo: 'S' },
            'KCl': { nombre: 'Cloruro de Potasio', solubilidad: 'Soluble', codigo: 'S' },
            'KBr': { nombre: 'Bromuro de Potasio', solubilidad: 'Soluble', codigo: 'S' },
            'K2SO4': { nombre: 'Sulfato de Potasio', solubilidad: 'Soluble', codigo: 'S' },
            'Na2SO4': { nombre: 'Sulfato de Sodio', solubilidad: 'Soluble', codigo: 'S' },
            'BaSO4': { nombre: 'Sulfato de Bario', solubilidad: 'Insoluble', codigo: 'I' },
            'BaCO3': { nombre: 'Carbonato de Bario', solubilidad: 'Insoluble', codigo: 'I' },
            'CaCO3': { nombre: 'Carbonato de Calcio', solubilidad: 'Insoluble', codigo: 'I' },
            'AgCl': { nombre: 'Cloruro de Plata', solubilidad: 'Insoluble', codigo: 'I' },
            'AgBr': { nombre: 'Bromuro de Plata', solubilidad: 'Insoluble', codigo: 'I' },
            'PbSO4': { nombre: 'Sulfato de Plomo', solubilidad: 'Insoluble', codigo: 'I' },
            'Ca(OH)2': { nombre: 'Hidróxido de Calcio', solubilidad: 'Poco soluble', codigo: 'PS' },
            'Mg(OH)2': { nombre: 'Hidróxido de Magnesio', solubilidad: 'Poco soluble', codigo: 'PS' },
            'Fe(OH)3': { nombre: 'Hidróxido de Hierro III', solubilidad: 'Insoluble', codigo: 'I' },
            'Cu(OH)2': { nombre: 'Hidróxido de Cobre II', solubilidad: 'Insoluble', codigo: 'I' },
            'NH4Cl': { nombre: 'Cloruro de Amonio', solubilidad: 'Muy soluble', codigo: 'S' },
            'NH4NO3': { nombre: 'Nitrato de Amonio', solubilidad: 'Muy soluble', codigo: 'S' },
            'HNO3': { nombre: 'Ácido Nítrico', solubilidad: 'Muy soluble', codigo: 'S' },
            'H2SO4': { nombre: 'Ácido Sulfúrico', solubilidad: 'Muy soluble', codigo: 'S' }
        };

        this.init();
    }

    init() {
        this.renderizar();
        this.crearModales();
    }

    renderizar() {
        this.container.innerHTML = '';

        this.herramientas.forEach(herramienta => {
            const card = document.createElement('div');
            card.className = `herramienta-card ${herramienta.clase}`;
            
            card.innerHTML = `
                <div class="herramienta-content">
                    <span class="herramienta-icon">${herramienta.icono}</span>
                    <div class="herramienta-badge">Activo</div>
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

    crearModales() {
        // Modal para Balanceador
        this.crearModalBalanceador();
        // Modal para Solubilidad
        this.crearModalSolubilidad();
        // Modal para Laboratorio
        this.crearModalLaboratorio();
    }

    crearModalBalanceador() {
        const modal = document.createElement('div');
        modal.id = 'modal-balanceador';
        modal.className = 'herramienta-modal-overlay';
        modal.innerHTML = `
            <div class="herramienta-modal">
                <button class="herramienta-modal-close">✕</button>
                <div class="herramienta-modal-content">
                    <h2>⚖️ Balanceador de Ecuaciones</h2>
                    <p class="modal-subtitle">Ingresa una ecuación química para balancearla</p>
                    
                    <div class="input-group">
                        <label>Ecuación química:</label>
                        <input type="text" id="input-ecuacion" placeholder="Ej: H2 + O2 -> H2O" />
                    </div>

                    <button class="herramienta-btn-action" id="btn-balancear">Balancear</button>

                    <div class="resultado-box" id="resultado-balanceador" style="display: none;">
                        <h3>Ecuación Balanceada:</h3>
                        <p id="ecuacion-balanceada"></p>
                        <p class="explicacion" id="explicacion-balanceador"></p>
                    </div>

                    <div class="info-box">
                        <h4>Ejemplos:</h4>
                        <ul>
                            <li>H2 + O2 -> H2O</li>
                            <li>C + O2 -> CO2</li>
                            <li>Fe + O2 -> Fe2O3</li>
                            <li>CH4 + O2 -> CO2 + H2O</li>
                        </ul>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        const closeBtn = modal.querySelector('.herramienta-modal-close');
        const balancearBtn = modal.querySelector('#btn-balancear');
        const inputEcuacion = modal.querySelector('#input-ecuacion');

        closeBtn.addEventListener('click', () => this.cerrarModal('balanceador'));
        modal.addEventListener('click', (e) => {
            if (e.target === modal) this.cerrarModal('balanceador');
        });

        balancearBtn.addEventListener('click', () => {
            const ecuacion = inputEcuacion.value;
            this.balancearEcuacion(ecuacion);
        });

        inputEcuacion.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.balancearEcuacion(inputEcuacion.value);
        });
    }

    crearModalSolubilidad() {
        const modal = document.createElement('div');
        modal.id = 'modal-solubilidad';
        modal.className = 'herramienta-modal-overlay';
        modal.innerHTML = `
            <div class="herramienta-modal">
                <button class="herramienta-modal-close">✕</button>
                <div class="herramienta-modal-content">
                    <h2>🧪 Tabla de Solubilidad</h2>
                    <p class="modal-subtitle">Consulta la solubilidad de compuestos iónicos</p>
                    
                    <div class="input-group">
                        <label>Compuesto:</label>
                        <input type="text" id="input-compuesto" placeholder="Ej: NaCl, BaSO4, AgCl" />
                    </div>

                    <button class="herramienta-btn-action" id="btn-consultar">Consultar</button>

                    <div class="resultado-box" id="resultado-solubilidad" style="display: none;">
                        <h3 id="nombre-compuesto"></h3>
                        <div class="solubilidad-indicator" id="indicator-solubilidad"></div>
                        <p id="explicacion-solubilidad"></p>
                    </div>

                    <div class="info-box">
                        <h4>Compuestos disponibles:</h4>
                        <div class="compuestos-lista">
                            <span class="compuesto-tag">NaCl</span>
                            <span class="compuesto-tag">KCl</span>
                            <span class="compuesto-tag">BaSO4</span>
                            <span class="compuesto-tag">AgCl</span>
                            <span class="compuesto-tag">CaCO3</span>
                            <span class="compuesto-tag">Ca(OH)2</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        const closeBtn = modal.querySelector('.herramienta-modal-close');
        const consultarBtn = modal.querySelector('#btn-consultar');
        const inputCompuesto = modal.querySelector('#input-compuesto');

        closeBtn.addEventListener('click', () => this.cerrarModal('solubilidad'));
        modal.addEventListener('click', (e) => {
            if (e.target === modal) this.cerrarModal('solubilidad');
        });

        consultarBtn.addEventListener('click', () => {
            const compuesto = inputCompuesto.value;
            this.consultarSolubilidad(compuesto);
        });

        inputCompuesto.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.consultarSolubilidad(inputCompuesto.value);
        });
    }

    crearModalLaboratorio() {
        const modal = document.createElement('div');
        modal.id = 'modal-laboratorio';
        modal.className = 'herramienta-modal-overlay';
        modal.innerHTML = `
            <div class="herramienta-modal herramienta-modal-large">
                <button class="herramienta-modal-close">✕</button>
                <div class="herramienta-modal-content">
                    <h2>🔬 Laboratorio Virtual</h2>
                    <p class="modal-subtitle">Arrastra átomos para crear reacciones</p>
                    
                    <div class="laboratorio-area">
                        <div class="laboratorio-panel">
                            <h4>Átomos disponibles:</h4>
                            <div class="atomos-disponibles">
                                <span class="atomo-draggable" draggable="true" data-atomo="H">H</span>
                                <span class="atomo-draggable" draggable="true" data-atomo="O">O</span>
                                <span class="atomo-draggable" draggable="true" data-atomo="C">C</span>
                                <span class="atomo-draggable" draggable="true" data-atomo="N">N</span>
                            </div>
                        </div>

                        <div class="laboratorio-canvas" id="laboratorio-canvas">
                            <p>Arrastra átomos aquí</p>
                        </div>

                        <div class="laboratorio-panel">
                            <h4>Reacciones detectadas:</h4>
                            <div id="reacciones-detectadas" class="reacciones-list">
                                <p style="color: var(--text-secondary); font-size: 0.9rem;">Aún no hay reacciones</p>
                            </div>
                        </div>
                    </div>

                    <button class="herramienta-btn-action" id="btn-limpiar-lab">Limpiar</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        const closeBtn = modal.querySelector('.herramienta-modal-close');
        const limpiarBtn = modal.querySelector('#btn-limpiar-lab');
        const canvas = modal.querySelector('#laboratorio-canvas');

        closeBtn.addEventListener('click', () => this.cerrarModal('laboratorio'));
        modal.addEventListener('click', (e) => {
            if (e.target === modal) this.cerrarModal('laboratorio');
        });

        limpiarBtn.addEventListener('click', () => this.limpiarLaboratorio());

        // Configurar drag and drop
        this.configurarDragDrop(canvas);
    }

    abrirHerramienta(id) {
        const modal = document.getElementById(`modal-${id}`);
        if (modal) {
            modal.classList.add('active');
        }
    }

    cerrarModal(tipo) {
        const modal = document.getElementById(`modal-${tipo}`);
        if (modal) {
            modal.classList.remove('active');
        }
    }

    balancearEcuacion(ecuacion) {
        if (!ecuacion.trim()) {
            alert('Por favor, ingresa una ecuación química');
            return;
        }

        // Algoritmo básico de balanceo de ecuaciones
        const [reactivos, productos] = ecuacion.split('->').map(s => s.trim());
        
        if (!reactivos || !productos) {
            alert('Formato incorrecto. Usa: Reactivo -> Producto');
            return;
        }

        // Análisis simple de la ecuación
        let balanceado = ecuacion;
        let explicacion = '';

        // Intentar balanceo automático para ecuaciones comunes
        const ecsComunes = {
            'H2 + O2': '2H2 + O2 -> 2H2O',
            'C + O2': 'C + O2 -> CO2',
            'Fe + O2': '4Fe + 3O2 -> 2Fe2O3',
            'CH4 + O2': 'CH4 + 2O2 -> CO2 + 2H2O'
        };

        for (let [clave, valor] of Object.entries(ecsComunes)) {
            if (ecuacion.includes(clave)) {
                balanceado = valor;
                explicacion = 'Esta ecuación ha sido balanceada automáticamente.';
                break;
            }
        }

        if (!explicacion) {
            balanceado = ecuacion + ' (requiere balanceo manual)';
            explicacion = 'Recuerda: Los átomos de cada elemento deben ser iguales en reactivos y productos.';
        }

        const resultadoDiv = document.getElementById('resultado-balanceador');
        document.getElementById('ecuacion-balanceada').textContent = balanceado;
        document.getElementById('explicacion-balanceador').textContent = explicacion;
        resultadoDiv.style.display = 'block';
    }

    consultarSolubilidad(compuesto) {
        if (!compuesto.trim()) {
            alert('Por favor, ingresa un compuesto');
            return;
        }

        const compuestoUpper = compuesto.trim().toUpperCase();
        const datos = this.tablaSolubilidad[compuestoUpper];

        const resultadoDiv = document.getElementById('resultado-solubilidad');
        const nombreDiv = document.getElementById('nombre-compuesto');
        const indicatorDiv = document.getElementById('indicator-solubilidad');
        const explicacionDiv = document.getElementById('explicacion-solubilidad');

        if (datos) {
            nombreDiv.textContent = `${compuestoUpper} - ${datos.nombre}`;
            indicatorDiv.innerHTML = `<span class="solubilidad-badge solubilidad-${datos.codigo}">${datos.solubilidad.toUpperCase()}</span>`;
            
            let explicacion = '';
            if (datos.codigo === 'S') {
                explicacion = '✓ Este compuesto es soluble en agua. Se disuelve completamente.';
            } else if (datos.codigo === 'PS') {
                explicacion = '⚠ Este compuesto es poco soluble. Se disuelve parcialmente.';
            } else {
                explicacion = '✗ Este compuesto es insoluble en agua. No se disuelve significativamente.';
            }
            explicacionDiv.textContent = explicacion;
        } else {
            nombreDiv.textContent = compuestoUpper;
            indicatorDiv.innerHTML = '<span class="solubilidad-badge solubilidad-unknown">NO DISPONIBLE</span>';
            explicacionDiv.textContent = 'Este compuesto no está en la base de datos. Intenta con otros como: NaCl, BaSO4, AgCl, etc.';
        }

        resultadoDiv.style.display = 'block';
    }

    configurarDragDrop(canvas) {
        const atomos = document.querySelectorAll('.atomo-draggable');
        const atomosEnCanvas = [];

        atomos.forEach(atomo => {
            atomo.addEventListener('dragstart', (e) => {
                e.dataTransfer.effectAllowed = 'copy';
                e.dataTransfer.setData('text/plain', atomo.dataset.atomo);
            });
        });

        canvas.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'copy';
            canvas.style.borderColor = 'var(--button-active)';
        });

        canvas.addEventListener('dragleave', () => {
            canvas.style.borderColor = 'var(--border-glow)';
        });

        canvas.addEventListener('drop', (e) => {
            e.preventDefault();
            canvas.style.borderColor = 'var(--border-glow)';
            
            const atomo = e.dataTransfer.getData('text/plain');
            const x = e.offsetX;
            const y = e.offsetY;

            this.agregarAtomoAlCanvas(canvas, atomo, x, y, atomosEnCanvas);
        });
    }

    agregarAtomoAlCanvas(canvas, atomo, x, y, lista) {
        const el = document.createElement('span');
        el.className = 'atomo-canvas';
        el.textContent = atomo;
        el.style.left = x + 'px';
        el.style.top = y + 'px';

        canvas.appendChild(el);
        lista.push(atomo);

        this.detectarReaccionesLab(lista);
    }

    detectarReaccionesLab(atomos) {
        const reaccionesDiv = document.getElementById('reacciones-detectadas');
        reaccionesDiv.innerHTML = '';

        // Detecciones simples de moléculas
        let moleculas = [];

        // H2O
        if (atomos.filter(a => a === 'H').length >= 2 && atomos.filter(a => a === 'O').length >= 1) {
            moleculas.push('💧 H₂O (Agua) - Formada');
        }

        // CO2
        if (atomos.filter(a => a === 'C').length >= 1 && atomos.filter(a => a === 'O').length >= 2) {
            moleculas.push('💨 CO₂ (Dióxido de Carbono) - Formada');
        }

        // O2
        if (atomos.filter(a => a === 'O').length >= 2) {
            moleculas.push('🌍 O₂ (Oxígeno Molecular) - Formada');
        }

        // H2
        if (atomos.filter(a => a === 'H').length >= 2) {
            moleculas.push('💥 H₂ (Hidrógeno Molecular) - Formada');
        }

        if (moleculas.length === 0) {
            reaccionesDiv.innerHTML = '<p style="color: var(--text-secondary); font-size: 0.9rem;">Aún no hay reacciones detectadas</p>';
        } else {
            moleculas.forEach(mol => {
                const p = document.createElement('p');
                p.textContent = mol;
                p.style.color = 'var(--border-glow)';
                p.style.marginBottom = '0.5rem';
                reaccionesDiv.appendChild(p);
            });
        }
    }

    limpiarLaboratorio() {
        const canvas = document.getElementById('laboratorio-canvas');
        const atomosCanvas = canvas.querySelectorAll('.atomo-canvas');
        atomosCanvas.forEach(a => a.remove());
        document.getElementById('reacciones-detectadas').innerHTML = '<p style="color: var(--text-secondary); font-size: 0.9rem;">Aún no hay reacciones</p>';
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.herramientas = new Herramientas();
});
