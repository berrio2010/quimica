// ====================================
// COMPONENTE - NAVBAR
// ====================================

class Navbar {
    constructor() {
        this.navLinks = document.querySelectorAll('.nav-link');
        this.views = document.querySelectorAll('.view');
        this.init();
    }

    init() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleNavClick(e));
        });
    }

    handleNavClick(e) {
        e.preventDefault();
        const section = e.target.dataset.section;
        this.switchView(section);
    }

    switchView(sectionName) {
        // Remover clase active de todos los links
        this.navLinks.forEach(link => link.classList.remove('active'));
        
        // Remover clase active de todas las vistas
        this.views.forEach(view => view.classList.remove('active'));
        
        // Agregar clase active al link actual
        const activeLink = document.querySelector(`[data-section="${sectionName}"]`);
        if (activeLink) activeLink.classList.add('active');
        
        // Agregar clase active a la vista actual
        const activeView = document.querySelector(`[data-view="${sectionName}"]`);
        if (activeView) activeView.classList.add('active');
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.navbar = new Navbar();
});
