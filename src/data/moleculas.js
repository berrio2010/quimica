// ====================================
// DATOS - MOLÉCULAS Y COMPUESTOS
// ====================================

const MOLECULAS = {
    // Moléculas simples
    'H2': {
        nombre: 'Hidrógeno Molecular',
        formula: 'H₂',
        tipo: 'covalente',
        atomos: [
            { simbolo: 'H', cantidad: 2 }
        ],
        descripcion: 'Gas diatómico altamente inflamable. Elemento más abundante del universo.'
    },
    'O2': {
        nombre: 'Oxígeno Molecular',
        formula: 'O₂',
        tipo: 'covalente',
        atomos: [
            { simbolo: 'O', cantidad: 2 }
        ],
        descripcion: 'Gas diatómico esencial para la respiración aeróbica.'
    },
    'N2': {
        nombre: 'Nitrógeno Molecular',
        formula: 'N₂',
        tipo: 'covalente',
        atomos: [
            { simbolo: 'N', cantidad: 2 }
        ],
        descripcion: 'Gas inerte que constituye el 78% de la atmósfera terrestre.'
    },
    'Cl2': {
        nombre: 'Cloro Molecular',
        formula: 'Cl₂',
        tipo: 'covalente',
        atomos: [
            { simbolo: 'Cl', cantidad: 2 }
        ],
        descripcion: 'Gas tóxico de color verde amarillento usado como desinfectante.'
    },

    // Moléculas con oxígeno
    'H2O': {
        nombre: 'Agua',
        formula: 'H₂O',
        tipo: 'covalente',
        atomos: [
            { simbolo: 'H', cantidad: 2 },
            { simbolo: 'O', cantidad: 1 }
        ],
        descripcion: 'Líquido incoloro, inodoro e insípido. Esencial para la vida. Disolvente universal.'
    },
    'CO2': {
        nombre: 'Dióxido de Carbono',
        formula: 'CO₂',
        tipo: 'covalente',
        atomos: [
            { simbolo: 'C', cantidad: 1 },
            { simbolo: 'O', cantidad: 2 }
        ],
        descripcion: 'Gas incoloro producido por la respiración y combustión. Importante en fotosíntesis.'
    },
    'NH3': {
        nombre: 'Amoníaco',
        formula: 'NH₃',
        tipo: 'covalente',
        atomos: [
            { simbolo: 'N', cantidad: 1 },
            { simbolo: 'H', cantidad: 3 }
        ],
        descripcion: 'Gas incoloro de olor penetrante. Usado en fertilizantes y limpiadores.'
    },
    'CH4': {
        nombre: 'Metano',
        formula: 'CH₄',
        tipo: 'covalente',
        atomos: [
            { simbolo: 'C', cantidad: 1 },
            { simbolo: 'H', cantidad: 4 }
        ],
        descripcion: 'Gas incoloro, inodoro. Principal componente del gas natural.'
    },
    'C2H6': {
        nombre: 'Etano',
        formula: 'C₂H₆',
        tipo: 'covalente',
        atomos: [
            { simbolo: 'C', cantidad: 2 },
            { simbolo: 'H', cantidad: 6 }
        ],
        descripcion: 'Gas incoloro. Segundo alcano más simple encontrado en gas natural.'
    },

    // Óxidos
    'NO': {
        nombre: 'Monóxido de Nitrógeno',
        formula: 'NO',
        tipo: 'covalente',
        atomos: [
            { simbolo: 'N', cantidad: 1 },
            { simbolo: 'O', cantidad: 1 }
        ],
        descripcion: 'Gas incoloro producido en combustión de alta temperatura. Contaminante.'
    },
    'NO2': {
        nombre: 'Dióxido de Nitrógeno',
        formula: 'NO₂',
        tipo: 'covalente',
        atomos: [
            { simbolo: 'N', cantidad: 1 },
            { simbolo: 'O', cantidad: 2 }
        ],
        descripcion: 'Gas marrón rojizo. Contaminante del aire, precursor del ozono troposférico.'
    },
    'SO2': {
        nombre: 'Dióxido de Azufre',
        formula: 'SO₂',
        tipo: 'covalente',
        atomos: [
            { simbolo: 'S', cantidad: 1 },
            { simbolo: 'O', cantidad: 2 }
        ],
        descripcion: 'Gas incoloro con olor pungente. Producido en erupciones volcánicas y combustión de carbón.'
    },

    // Compuestos iónicos
    'NaCl': {
        nombre: 'Cloruro de Sodio',
        formula: 'NaCl',
        tipo: 'ionico',
        atomos: [
            { simbolo: 'Na', cantidad: 1 },
            { simbolo: 'Cl', cantidad: 1 }
        ],
        descripcion: 'Sal común. Cristales blancos. Esencial para la vida, usado como condimento y conservante.'
    },
    'KCl': {
        nombre: 'Cloruro de Potasio',
        formula: 'KCl',
        tipo: 'ionico',
        atomos: [
            { simbolo: 'K', cantidad: 1 },
            { simbolo: 'Cl', cantidad: 1 }
        ],
        descripcion: 'Sal blanca. Importante para funciones nerviosas y musculares.'
    },
    'CaCO3': {
        nombre: 'Carbonato de Calcio',
        formula: 'CaCO₃',
        tipo: 'ionico',
        atomos: [
            { simbolo: 'Ca', cantidad: 1 },
            { simbolo: 'C', cantidad: 1 },
            { simbolo: 'O', cantidad: 3 }
        ],
        descripcion: 'Mineral blanco. Componente de caliza, mármol y caparazones. Usado como antácido.'
    }
};

// Función para buscar todas las moléculas que se pueden formar con los átomos presentes
function detectarTodasLasMoleculas(atomosPresentes) {
    if (!atomosPresentes || atomosPresentes.length === 0) {
        return [];
    }

    // Contar átomos por símbolo
    const contador = {};
    atomosPresentes.forEach(simbolo => {
        contador[simbolo] = (contador[simbolo] || 0) + 1;
    });

    const moleculasEncontradas = [];

    // Buscar en la base de datos
    for (const [formula, datos] of Object.entries(MOLECULAS)) {
        const esperado = {};
        datos.atomos.forEach(atomo => {
            esperado[atomo.simbolo] = atomo.cantidad;
        });

        // Verificar si todos los átomos de esta molécula están disponibles
        let seCanFormar = true;
        for (const [simbolo, cantidad] of Object.entries(esperado)) {
            if (!contador[simbolo] || contador[simbolo] < cantidad) {
                seCanFormar = false;
                break;
            }
        }

        if (seCanFormar) {
            // Calcular peso molecular para priorizar moléculas más grandes
            const peso = datos.atomos.reduce((sum, atom) => sum + atom.cantidad, 0);
            moleculasEncontradas.push({
                datos,
                peso,
                formula
            });
        }
    }

    // Ordenar por peso (más grande primero)
    moleculasEncontradas.sort((a, b) => b.peso - a.weight);
    return moleculasEncontradas;
}

// Función para buscar moléculas por combinación de átomos (retorna la principal)
function detectarMolecula(atomosPresentes) {
    const todas = detectarTodasLasMoleculas(atomosPresentes);
    return todas.length > 0 ? todas[0].datos : null;
}
