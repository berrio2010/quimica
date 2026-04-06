let elementos = {};
let atomos = [];
let atomoArrastrado = null;
let offsetX = 0;
let offsetY = 0;
let filtroActual = 'all';

// Cargar elementos desde JSON
async function cargarElementos() {
    try {
        const response = await fetch('elementos.json');
        elementos = await response.json();
        crearTablaPeriodica();
        configurarFiltros();
    } catch (error) {
        console.error('Error cargando elementos:', error);
    }
}

// Crear tabla periódica
function crearTablaPeriodica() {
    const tablaPeriodica = document.getElementById('tabla-periodica');
    tablaPeriodica.innerHTML = '';

    // Ordenar por número atómico
    const elementosOrdenados = Object.entries(elementos).sort((a, b) => a[1].numero - b[1].numero);

    for (const [simbolo, datos] of elementosOrdenados) {
        const elemento = document.createElement('div');
        elemento.className = `elemento ${datos.categoria}`;
        elemento.setAttribute('data-numero', datos.numero);
        elemento.title = `${simbolo} - Z: ${datos.numero} - Masa: ${datos.masa}`;
        
        elemento.innerHTML = `${simbolo}`;
        
        elemento.addEventListener('click', () => crearAtomo(simbolo));
        elemento.addEventListener('mouseenter', () => mostrarElementoInfo(simbolo, datos));
        
        elemento.setAttribute('data-categoria', datos.categoria);
        tablaPeriodica.appendChild(elemento);
    }
}

// Configurar filtros
function configurarFiltros() {
    const filtros = document.querySelectorAll('.filter-btn');
    filtros.forEach(btn => {
        btn.addEventListener('click', () => {
            filtros.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filtroActual = btn.getAttribute('data-filter');
            aplicarFiltro(filtroActual);
        });
    });
}

// Aplicar filtro a la tabla
function aplicarFiltro(categoría) {
    const elementos = document.querySelectorAll('.elemento');
    elementos.forEach(el => {
        if (categoría === 'all' || el.getAttribute('data-categoria') === categoría) {
            el.style.display = '';
            el.style.opacity = '1';
        } else {
            el.style.opacity = '0.2';
            el.style.pointerEvents = 'none';
        }
    });
}

// Mostrar información del elemento
function mostrarElementoInfo(simbolo, datos) {
    const infoPanel = document.getElementById('elemento-info');
    
    let html = `
        <div class="detalle-titulo">⚛️ ${simbolo} - Número atómico: ${datos.numero}</div>
        <div class="detalle-fila">
            <div class="detalle-label">Masa atómica:</div>
            <div class="detalle-valor">${datos.masa} u</div>
        </div>
        <div class="detalle-fila">
            <div class="detalle-label">Período:</div>
            <div class="detalle-valor">${datos.periodo}</div>
        </div>
        <div class="detalle-fila">
            <div class="detalle-label">Grupo:</div>
            <div class="detalle-valor">${datos.grupo}</div>
        </div>
        <div class="detalle-fila">
            <div class="detalle-label">Valencia:</div>
            <div class="detalle-valor">${datos.valencia} e⁻</div>
        </div>
        <div class="detalle-fila">
            <div class="detalle-label">Categoría:</div>
            <div class="detalle-valor">${datos.categoria}</div>
        </div>
    `;
    
    infoPanel.innerHTML = html;
}

// Crear átomo en el tablero
function crearAtomo(simbolo) {
    const tablero = document.getElementById('tablero');
    const rect = tablero.getBoundingClientRect();
    const x = Math.max(10, Math.random() * (rect.width - 100));
    const y = Math.max(10, Math.random() * (rect.height - 100));

    const atomo = {
        id: Date.now() + Math.random(),
        simbolo: simbolo,
        valencia: elementos[simbolo].valencia,
        categoria: elementos[simbolo].categoria,
        masa: elementos[simbolo].masa,
        numero: elementos[simbolo].numero,
        x: x,
        y: y,
        elemento: null,
        electronesTransferidos: 0,
        enlacesActuales: []
    };

    atomos.push(atomo);
    renderizarAtomo(atomo, tablero);
}

// Renderizar átomo
function renderizarAtomo(atomo, tablero) {
    const div = document.createElement('div');
    div.className = 'atomo';
    div.id = `atomo-${atomo.id}`;
    div.style.left = atomo.x + 'px';
    div.style.top = atomo.y + 'px';

    div.innerHTML = `
        <div class="atomo-circulo">
            <span>${atomo.simbolo}</span>
            ${atomo.electronesTransferidos !== 0 ? `<sup>${atomo.electronesTransferidos > 0 ? '+' : ''}${Math.abs(atomo.electronesTransferidos)}</sup>` : ''}
            <div class="atomo-valencia" id="valencia-${atomo.id}"></div>
        </div>
    `;

    // Dibujar electrones de valencia
    const valenciaDiv = div.querySelector('.atomo-valencia');
    dibujarElectrones(valenciaDiv, atomo.valencia);

    div.addEventListener('mousedown', (e) => iniciarArrastre(e, atomo));
    div.addEventListener('touchstart', (e) => iniciarArrastre(e, atomo));
    div.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        eliminarAtomo(atomo);
    });

    tablero.appendChild(div);
    atomo.elemento = div;
}

// Dibujar electrones alrededor del átomo
function dibujarElectrones(contenedor, valencia) {
    const radio = 30;
    
    if (valencia === 0) return;

    const anguloPorElectron = 360 / valencia;

    for (let i = 0; i < valencia; i++) {
        const angulo = (i * anguloPorElectron) * (Math.PI / 180);
        const x = radio * Math.cos(angulo);
        const y = radio * Math.sin(angulo);

        const electron = document.createElement('div');
        electron.className = 'electron';
        electron.style.left = (x + 37.5) + 'px';
        electron.style.top = (y + 37.5) + 'px';
        contenedor.appendChild(electron);
    }
}

// Iniciar arrastre
function iniciarArrastre(e, atomo) {
    atomoArrastrado = atomo;
    const rect = atomo.elemento.getBoundingClientRect();
    offsetX = (e.clientX || e.touches[0].clientX) - rect.left;
    offsetY = (e.clientY || e.touches[0].clientY) - rect.top;

    document.addEventListener('mousemove', arrastrarAtomo);
    document.addEventListener('touchmove', arrastrarAtomo, { passive: false });
    document.addEventListener('mouseup', finalizarArrastre);
    document.addEventListener('touchend', finalizarArrastre);

    e.preventDefault();
}

// Arrastrar átomo
function arrastrarAtomo(e) {
    if (!atomoArrastrado) return;

    const tablero = document.getElementById('tablero');
    const rect = tablero.getBoundingClientRect();
    
    const clientX = e.clientX || e.touches[0].clientX;
    const clientY = e.clientY || e.touches[0].clientY;
    
    let x = clientX - rect.left - offsetX;
    let y = clientY - rect.top - offsetY;

    // Limitar dentro del tablero
    x = Math.max(0, Math.min(x, rect.width - 75));
    y = Math.max(0, Math.min(y, rect.height - 75));

    atomoArrastrado.x = x;
    atomoArrastrado.y = y;
    atomoArrastrado.elemento.style.left = x + 'px';
    atomoArrastrado.elemento.style.top = y + 'px';

    // Detectar enlaces
    detectarEnlaces();
}

// Finalizar arrastre
function finalizarArrastre() {
    atomoArrastrado = null;

    document.removeEventListener('mousemove', arrastrarAtomo);
    document.removeEventListener('touchmove', arrastrarAtomo);
    document.removeEventListener('mouseup', finalizarArrastre);
    document.removeEventListener('touchend', finalizarArrastre);
}

// Eliminar átomo
function eliminarAtomo(atomo) {
    atomo.elemento.remove();
    atomos = atomos.filter(a => a.id !== atomo.id);
    detectarEnlaces();
}

// Detectar enlaces
function detectarEnlaces() {
    const distanciaMinima = 140;
    let enlaceFormado = null;

    // Limpiar enlaces anteriores
    atomos.forEach(a => {
        a.enlacesActuales = [];
        if (a.elemento) {
            a.elemento.querySelector('.atomo-circulo').classList.remove('atomo-ionizado');
            a.electronesTransferidos = 0;
        }
    });

    // Buscar pares de átomos cercanos
    for (let i = 0; i < atomos.length; i++) {
        for (let j = i + 1; j < atomos.length; j++) {
            const distancia = calcularDistancia(atomos[i], atomos[j]);

            if (distancia < distanciaMinima) {
                const tipo = determinarTipoEnlace(atomos[i], atomos[j]);
                enlaceFormado = {
                    tipo: tipo,
                    atomo1: atomos[i],
                    atomo2: atomos[j],
                    distancia: distancia
                };

                aplicarEnlace(atomos[i], atomos[j], tipo);
            }
        }
    }

    // Mostrar información del enlace
    mostrarInfoEnlace(enlaceFormado);
}

// Calcular distancia entre átomos
function calcularDistancia(atomo1, atomo2) {
    const dx = atomo1.x - atomo2.x;
    const dy = atomo1.y - atomo2.y;
    return Math.sqrt(dx * dx + dy * dy);
}

// Determinar tipo de enlace mejorado
function determinarTipoEnlace(atomo1, atomo2) {
    const sym1 = atomo1.simbolo;
    const sym2 = atomo2.simbolo;
    const val1 = atomo1.valencia;
    const val2 = atomo2.valencia;
    const diferenciaValencia = Math.abs(val1 - val2);

    // Pares conocidos que forman enlaces iónicos
    const enlacesIonicos = [
        ['Na', 'F'], ['Na', 'Cl'], ['Na', 'Br'],
        ['K', 'F'], ['K', 'Cl'],
        ['Li', 'F'], ['Li', 'Cl'],
        ['Ca', 'F'], ['Ca', 'Cl'], ['Ca', 'O'],
        ['Mg', 'F'], ['Mg', 'Cl'],
    ];

    const esIonico = enlacesIonicos.some(par => 
        (par[0] === sym1 && par[1] === sym2) || 
        (par[0] === sym2 && par[1] === sym1)
    ) || (val1 <= 2 && val2 >= 6 && diferenciaValencia >= 4);

    return esIonico ? 'ionico' : 'covalente';
}

// Aplicar enlace
function aplicarEnlace(atomo1, atomo2, tipo) {
    atomo1.enlacesActuales.push({ con: atomo2, tipo: tipo });
    atomo2.enlacesActuales.push({ con: atomo1, tipo: tipo });

    if (tipo === 'ionico') {
        // Transferencia de electrones
        const transferencia = Math.min(atomo1.valencia, atomo2.valencia);
        
        if (atomo2.valencia > atomo1.valencia) {
            atomo1.electronesTransferidos = transferencia;
            atomo2.electronesTransferidos = -transferencia;
        } else {
            atomo2.electronesTransferidos = transferencia;
            atomo1.electronesTransferidos = -transferencia;
        }
        
        atomo1.elemento.querySelector('.atomo-circulo').classList.add('atomo-ionizado');
        atomo2.elemento.querySelector('.atomo-circulo').classList.add('atomo-ionizado');
    }

    // Actualizar visualización
    actualizarVisualizacionAtomo(atomo1);
    actualizarVisualizacionAtomo(atomo2);
}

// Actualizar visualización del átomo
function actualizarVisualizacionAtomo(atomo) {
    const circulo = atomo.elemento.querySelector('.atomo-circulo');
    let contenido = `<span>${atomo.simbolo}</span>`;
    
    if (atomo.electronesTransferidos !== 0) {
        const signo = atomo.electronesTransferidos > 0 ? '+' : '';
        contenido += `<sup>${signo}${Math.abs(atomo.electronesTransferidos)}</sup>`;
    }
    
    // Preservar electrones
    contenido += `<div class="atomo-valencia" id="valencia-${atomo.id}"></div>`;
    circulo.innerHTML = contenido;
    
    const valenciaDiv = circulo.querySelector('.atomo-valencia');
    dibujarElectrones(valenciaDiv, atomo.valencia);
}

// Mostrar información del enlace - ACTUALIZADO PARA NUEVO DISEÑO
function mostrarInfoEnlace(enlace) {
    const bondTypeBadge = document.getElementById('bond-type-badge');
    const reactionFormula = document.getElementById('reaction-formula');
    const transferMechanics = document.getElementById('transfer-mechanics');
    
    // Ocultar el placeholder del canvas si hay átomos
    if (atomos.length > 0) {
        const placeholder = document.querySelector('.canvas-placeholder');
        if (placeholder) placeholder.style.display = 'none';
    }
    
    if (enlace) {
        let tipo_display = '';
        let formula = '';
        let mecanica = '';

        const { tipo, atomo1, atomo2 } = enlace;

        if (tipo === 'ionico') {
            tipo_display = 'Ionic Bond Detected';
            const cationoSim = atomo1.electronesTransferidos > 0 ? atomo1.simbolo : atomo2.simbolo;
            const anionSim = atomo1.electronesTransferidos < 0 ? atomo1.simbolo : atomo2.simbolo;
            const carga = Math.abs(atomo1.electronesTransferidos);
            
            formula = `${atomo1.simbolo} + ${atomo2.simbolo} → ${cationoSim}<sup>+${carga}</sup> + ${anionSim}<sup>-${carga}</sup>`;
            mecanica = `<strong>Single electron migration from ${atomo1.simbolo} to ${atomo2.simbolo}</strong>`
            
        } else if (tipo === 'covalente') {
            tipo_display = 'Covalent Bond Detected';
            const electronesCompartidos = Math.min(atomo1.valencia, atomo2.valencia);
            formula = `${atomo1.simbolo} + ${atomo2.simbolo} → ${atomo1.simbolo}${atomo2.simbolo}`;
            mecanica = `<strong>Electron pair sharing between atoms</strong><br><em>${electronesCompartidos} electron pair${electronesCompartidos > 1 ? 's' : ''} shared</em>`;
        }

        bondTypeBadge.innerHTML = `<span>${tipo_display}</span>`;
        reactionFormula.innerHTML = formula;
        transferMechanics.innerHTML = mecanica;
    } else {
        // Mostrar estado por defecto
        bondTypeBadge.innerHTML = '<span>No bond detected</span>';
        reactionFormula.innerHTML = 'Select elements to see formula';
        transferMechanics.innerHTML = '<em>Electron transfer details</em>';
        
        // Mostrar placeholder si no hay átomos
        if (atomos.length === 0) {
            const placeholder = document.querySelector('.canvas-placeholder');
            if (placeholder) placeholder.style.display = 'block';
        }
    }
}

// Limpiar tablero
function limpiarTablero() {
    const tablero = document.getElementById('tablero');
    tablero.innerHTML = `
        <div class="canvas-placeholder">
            <i class="fas fa-arrow-pointer"></i>
            <p>Selecciona elementos de la tabla para comenzar</p>
        </div>
    `;
    atomos = [];
    
    // Resetear análisis
    document.getElementById('bond-type-badge').innerHTML = '<span>No bond detected</span>';
    document.getElementById('reaction-formula').innerHTML = 'Select elements to see formula';
    document.getElementById('transfer-mechanics').innerHTML = '<em>Electron transfer details</em>';
}

// Modal de ayuda - ACTUALIZADO
function configurarModal() {
    const btnInfo = document.getElementById('info-btn');
    const modal = document.getElementById('modal-ayuda');
    const closeBtn = document.querySelector('.close-btn');

    btnInfo.addEventListener('click', () => {
        modal.classList.add('active');
    });

    closeBtn.addEventListener('click', () => {
         modal.classList.remove('active');
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
    
    // Cerrar con Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            modal.classList.remove('active');
        }
    });
}

// Configurar modal de tabla periódica - ACTUALIZADO
function configurarModalTabla() {
    const openBtn = document.getElementById('toggle-tabla-modal-btn');
    const closeBtn = document.getElementById('close-tabla-modal-btn');
    const tablaModal = document.getElementById('tabla-modal');
    
    openBtn.addEventListener('click', () => {
        tablaModal.classList.add('active');
    });
    
    closeBtn.addEventListener('click', () => {
        tablaModal.classList.remove('active');
    });
    
    // Cerrar modal al hacer clic fuera
    tablaModal.addEventListener('click', (e) => {
        if (e.target === tablaModal) {
            tablaModal.classList.remove('active');
        }
    });
    
    // Cerrar con tecla Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && tablaModal.classList.contains('active')) {
            tablaModal.classList.remove('active');
        }
    });
}

// Inicializar aplicación
document.addEventListener('DOMContentLoaded', () => {
    const btnLimpiar = document.getElementById('limpiar-btn');
    btnLimpiar.addEventListener('click', limpiarTablero);

    configurarModal();
    configurarModalTabla();
    cargarElementos();
});

