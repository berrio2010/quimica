// ====================================
// COMPONENTE - MODAL DE INFORMACIÓN Y CONFIGURACIÓN
// ====================================

class ModalInfo {
    constructor() {
        this.overlay = document.getElementById('modal-info-overlay');
        this.modal = document.getElementById('modal-info');
        this.closeBtn = document.getElementById('modal-info-close');
        this.init();
    }

    init() {
        if (!this.overlay) {
            this.crearElementos();
        }

        this.closeBtn = document.getElementById('modal-info-close');
        this.overlay = document.getElementById('modal-info-overlay');
        this.modal = document.getElementById('modal-info');

        this.closeBtn.addEventListener('click', () => this.cerrar());
        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay) this.cerrar();
        });

        // Cerrar con ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.overlay.classList.contains('active')) {
                this.cerrar();
            }
        });
    }

    crearElementos() {
        // Crear overlay
        const overlay = document.createElement('div');
        overlay.id = 'modal-info-overlay';
        overlay.className = 'modal-overlay';
        document.body.appendChild(overlay);

        // Crear modal
        const modal = document.createElement('div');
        modal.id = 'modal-info';
        modal.className = 'modal-element modal-info';
        modal.innerHTML = `
            <button id="modal-info-close" class="modal-close">✕</button>
            <div class="modal-content" id="modal-info-content">
                <!-- El contenido se insertará aquí -->
            </div>
        `;
        overlay.appendChild(modal);
    }

    mostrar(titulo, contenido) {
        const contentDiv = document.getElementById('modal-info-content');
        
        // Limpiar contenido anterior
        contentDiv.innerHTML = '';

        // Crear header
        const header = document.createElement('div');
        header.className = 'modal-info-header';
        header.innerHTML = `<h2>${titulo}</h2>`;
        contentDiv.appendChild(header);

        // Crear contenido
        const body = document.createElement('div');
        body.className = 'modal-info-body';
        
        // Si el contenido es HTML, usarlo directamente
        if (typeof contenido === 'string' && contenido.includes('<')) {
            body.innerHTML = contenido;
        } else if (typeof contenido === 'string') {
            // Si es texto plano, convertir saltos de línea a párrafos
            body.innerHTML = `<pre>${contenido}</pre>`;
        } else if (typeof contenido === 'object') {
            // Si es un objeto, renderizarlo como contenido estructurado
            body.innerHTML = this.renderizarObjeto(contenido);
        }

        contentDiv.appendChild(body);

        // Mostrar modal
        this.overlay.classList.add('active');
    }

    renderizarObjeto(obj) {
        let html = '';
        for (const [clave, valor] of Object.entries(obj)) {
            html += `
                <div class="info-item">
                    <strong>${clave}:</strong>
                    <span>${valor}</span>
                </div>
            `;
        }
        return html;
    }

    cerrar() {
        this.overlay.classList.remove('active');
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.modalInfo = new ModalInfo();
});
