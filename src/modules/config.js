/**
 * global config for StayFit
 */

export const CONFIG = {
    WHATSAPP: {
        PHONE: '573103296863',
        DEFAULT_MSG: 'Hola, quiero más información sobre StayFit',
    },
    CURRENCY: {
        EXCHANGE_RATE: 4000,
        DEFAULT: 'COP',
    },
    STORAGE_PREFIX: 'sf_',
    UTM_PARAMS: ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid'],
    PRICES: {
        'StayFit Pills': 210000,
        'StayFit Tea': 140000,
        'Combo 1 (Mix Inicial)': 340000,
        'Combo 2 (Dúo Poder)': 260000,
        'Combo 3 (Máximo Detox)': 375000,
        'Tratamiento StayFit': 210000,
    },
    // Precios fijos para Estados Unidos (según requerimiento de Notion)
    USA_PRICES: {
        'StayFit Pills': 130,
        'StayFit Tea': 80,
        'Combo 1 (Mix Inicial)': 200,
        'Combo 2 (Dúo Poder)': 140,
        'Combo 3 (Máximo Detox)': 180,
        'Tratamiento StayFit': 130,
        'SHIPPING': 20
    },

    // Sabores oficiales (Eliminado Maracuya)
    FLAVORS: ['Piña', 'Uva', 'Limón', 'Naranja', 'Frutos Rojos'],
};
