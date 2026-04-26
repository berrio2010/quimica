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
    const info = `
🧪 QUÍMICA INTERACTIVA v1.0

📖 GUÍA RÁPIDA:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 TABLERO INTERACTIVO:
  • Haz clic en elementos de la tabla para agregarlos
  • Arrastra los átomos para posicionarlos
  • Haz clic derecho para eliminar un átomo

📊 TABLA PERIÓDICA:
  • Haz clic en cualquier elemento para ver detalles
  • Aprende sobre propiedades y características
  • Visualiza la estructura atómica

🔧 HERRAMIENTAS:
  • Balanceador de ecuaciones
  • Tabla de solubilidad
  • Laboratorio virtual

⌨️ ATAJOS:
  • ESC: Cerrar modal
  • Ctrl+L: Limpiar tablero
  • 1: Ir a Tablero
  • 2: Ir a Tabla Periódica
  • 3: Ir a Herramientas

💡 AUTOR: Andersson Developers
📅 VERSIÓN: 1.0.0
    `;
    alert(info);
}

function mostrarConfiguracion() {
    alert(`
⚙️ CONFIGURACIÓN

Opciones disponibles:
• Tema (oscuro/claro) - Próxima versión
• Idioma - Próxima versión
• Notificaciones - Próxima versión
• Unidades - Próxima versión

Más configuraciones en desarrollo...
    `);
}

// ====================================
// EXPORTAR FUNCIONES GLOBALES
// ====================================

window.APP = {
    version: '1.0.0',
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

