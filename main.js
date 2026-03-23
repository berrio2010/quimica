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
        
        elemento.innerHTML = `
            <span class="elemento-simbolo">${simbolo}</span>
            <span class="elemento-valencia">e⁻: ${datos.valencia}</span>
        `;
        
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

// Mostrar información del enlace
function mostrarInfoEnlace(enlace) {
    const infoDiv = document.getElementById('enlace-info');
    
    if (enlace) {
        let mensaje = '';
        const { tipo, atomo1, atomo2 } = enlace;

        if (tipo === 'ionico') {
            const cationoSim = atomo1.electronesTransferidos > 0 ? atomo1.simbolo : atomo2.simbolo;
            const anionSim = atomo1.electronesTransferidos < 0 ? atomo1.simbolo : atomo2.simbolo;
            const carga = Math.abs(atomo1.electronesTransferidos);
            
            mensaje = `
                <div class="info-title">⚛️ Enlace Iónico Detectado</div>
                <p><strong>Reacción:</strong> ${atomo1.simbolo} + ${atomo2.simbolo} → ${cationoSim}<sup>+${carga}</sup> + ${anionSim}<sup>-${carga}</sup></p>
                <p><strong>Tipo:</strong> Transferencia electrónica (${carga} electrón${carga > 1 ? 'es' : ''} transferido${carga > 1 ? 's' : ''})</p>
                <p><strong>Resultado:</strong> Compuesto iónico con iones cargados</p>
            `;
        } else if (tipo === 'covalente') {
            const electronesCompartidos = Math.min(atomo1.valencia, atomo2.valencia);
            mensaje = `
                <div class="info-title">🔗 Enlace Covalente Detectado</div>
                <p><strong>Reacción:</strong> ${atomo1.simbolo} + ${atomo2.simbolo} → ${atomo1.simbolo}${atomo2.simbolo}</p>
                <p><strong>Tipo:</strong> Compartición de ${electronesCompartidos} par${electronesCompartidos > 1 ? 'es' : ''} de electrones</p>
                <p><strong>Resultado:</strong> Molécula covalente</p>
            `;
        }

        infoDiv.innerHTML = mensaje;
    } else {
        infoDiv.innerHTML = '<div class="info-title">ℹ️ Información</div><p>Selecciona dos elementos y acércalos para ver el tipo de enlace formado</p>';
    }
}

// Limpiar tablero
function limpiarTablero() {
    const tablero = document.getElementById('tablero');
    tablero.innerHTML = '';
    atomos = [];
    document.getElementById('enlace-info').innerHTML = '<div class="info-title">ℹ️ Información</div><p>Selecciona dos elementos y acércalos para ver el tipo de enlace formado</p>';
}

// Modal de ayuda
function configurarModal() {
    const btnInfo = document.getElementById('info-btn');
    const modal = document.getElementById('modal-ayuda');
    const closeBtn = document.querySelector('.close-btn');

    btnInfo.addEventListener('click', () => {
        modal.classList.add('show');
    });

    closeBtn.addEventListener('click', () => {
        modal.classList.remove('show');
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
        }
    });
}

// Configurar modal de tabla periódica
function configurarModalTabla() {
    const openBtn = document.getElementById('toggle-tabla-modal-btn');
    const closeBtn = document.getElementById('close-tabla-modal-btn');
    const tablaModal = document.getElementById('tabla-modal');
    
    openBtn.addEventListener('click', () => {
        tablaModal.classList.add('show');
    });
    
    closeBtn.addEventListener('click', () => {
        tablaModal.classList.remove('show');
    });
    
    // Cerrar modal al hacer clic fuera
    tablaModal.addEventListener('click', (e) => {
        if (e.target === tablaModal) {
            tablaModal.classList.remove('show');
        }
    });
    
    // Cerrar con tecla Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && tablaModal.classList.contains('show')) {
            tablaModal.classList.remove('show');
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

