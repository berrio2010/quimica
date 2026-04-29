// ====================================
// MAIN - INTEGRACIÓN SPA
// ====================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🧪 Química Interactiva - Iniciando aplicación...');

    // Inicializar todos los componentes
    setTimeout(() => {
        console.log('✅ Navbar inicializado');
        console.log('✅ Tabla Periódica inicializada');
        console.log('✅ Modal Flotante inicializado');
        console.log('✅ Tablero Interactivo inicializado');
        console.log('✅ Herramientas inicializadas');
        console.log('🎉 Aplicación lista');
    }, 100);

    // Agregar funcionalidad a botones de la navbar
    const infoBtn = document.getElementById('info-btn');
    const settingsBtn = document.getElementById('settings-btn');

    if (infoBtn) {
        infoBtn.addEventListener('click', () => {
            mostrarInfo();
        });
    }

    if (settingsBtn) {
        settingsBtn.addEventListener('click', () => {
            mostrarConfiguracion();
        });
    }

    // Agregar atajos de teclado
    document.addEventListener('keydown', (e) => {
        // ESC para cerrar modal
        if (e.key === 'Escape' && window.modal) {
            window.modal.cerrar();
        }
        
        // Ctrl + L para limpiar tablero
        if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
            e.preventDefault();
            if (window.tablero) {
                window.tablero.removerTodos();
            }
        }

        // 1, 2, 3 para cambiar de sección
        if (e.key === '1') window.navbar?.switchView('tablero');
        if (e.key === '2') window.navbar?.switchView('tabla');
        if (e.key === '3') window.navbar?.switchView('herramientas');
    });
});

// ====================================
// FUNCIONES AUXILIARES
// ====================================

function mostrarInfo() {
    const infoHTML = `
        <div class="info-section">
            <h3>📖 GUÍA RÁPIDA</h3>
            <hr>
        </div>

        <div class="info-section">
            <h4>🎯 TABLERO INTERACTIVO</h4>
            <ul>
                <li>Haz clic en elementos de la tabla para agregarlos</li>
                <li>Arrastra los átomos para posicionarlos</li>
                <li>Haz clic derecho para eliminar un átomo</li>
            </ul>
        </div>

        <div class="info-section">
            <h4>📊 TABLA PERIÓDICA</h4>
            <ul>
                <li>Haz clic en cualquier elemento para ver detalles</li>
                <li>Aprende sobre propiedades y características</li>
                <li>Visualiza la estructura atómica</li>
            </ul>
        </div>

        <div class="info-section">
            <h4>🔧 HERRAMIENTAS</h4>
            <ul>
                <li>Balanceador de ecuaciones</li>
                <li>Tabla de solubilidad</li>
                <li>Laboratorio virtual</li>
            </ul>
        </div>

        <div class="info-section">
            <h4>⌨️ ATAJOS DE TECLADO</h4>
            <ul>
                <li><kbd>ESC</kbd> - Cerrar modal</li>
                <li><kbd>Ctrl+L</kbd> - Limpiar tablero</li>
                <li><kbd>1</kbd> - Ir a Tablero</li>
                <li><kbd>2</kbd> - Ir a Tabla Periódica</li>
                <li><kbd>3</kbd> - Ir a Herramientas</li>
            </ul>
        </div>

        <div class="info-section">
            <p style="text-align: center; margin-top: 2rem; opacity: 0.7;">
                💡 Andersson Developers<br>
                📅 Versión 2.0.0
            </p>
        </div>
    `;
    
    window.modalInfo.mostrar('ℹ️ INFORMACIÓN', infoHTML);
}

function mostrarConfiguracion() {
    const configHTML = `
        <div class="info-section">
            <h4>⚙️ OPCIONES DISPONIBLES</h4>
        </div>

        <div class="config-option">
            <h5>🎨 Tema (Oscuro/Claro)</h5>
            <p class="text-secondary">Próxima versión</p>
        </div>

        <div class="config-option">
            <h5>🌍 Idioma</h5>
            <p class="text-secondary">Próxima versión</p>
        </div>

        <div class="config-option">
            <h5>🔔 Notificaciones</h5>
            <p class="text-secondary">Próxima versión</p>
        </div>

        <div class="config-option">
            <h5>📏 Unidades</h5>
            <p class="text-secondary">Próxima versión</p>
        </div>

        <div class="info-section">
            <p style="margin-top: 2rem; padding: 1rem; background: rgba(0, 229, 255, 0.1); border-radius: 8px; border-left: 3px solid var(--primary-color);">
                ⚡ Más configuraciones en desarrollo...
            </p>
        </div>
    `;
    
    window.modalInfo.mostrar('⚙️ CONFIGURACIÓN', configHTML);
}

// ====================================
// EXPORTAR FUNCIONES GLOBALES
// ====================================

window.APP = {
    version: '2.0.0',
    nombre: 'Química Interactiva',
    mostrarInfo: mostrarInfo,
    mostrarConfiguracion: mostrarConfiguracion,
    
    // Métodos de utilidad
    obtenerEstadisticas: () => {
        return {
            atomos: window.tablero?.obtenerAtomos().length || 0,
            elementoActual: window.modal?.elementoActual?.nombre || 'Ninguno'
        };
    },

    limpiarTablero: () => {
        if (window.tablero) {
            window.tablero.removerTodos();
            console.log('✨ Tablero limpiado');
        }
    },

    irASeccion: (seccion) => {
        if (window.navbar) {
            window.navbar.switchView(seccion);
        }
    }
};

console.log('✨ Objeto APP disponible en consola');

