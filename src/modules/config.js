/**
 * global config for StayFit
 */

export const CONFIG = {
    whatsappNumber: '573103296863',
    whatsappMessage: 'Hola, quiero más información sobre StayFit',
    
    currency: {
        EXCHANGE_RATE: 4000,
        DEFAULT: 'COP',
    },
    
    storagePrefix: 'sf_',
    
    // Configuración estructurada de productos para el CheckoutEngine
    products: {
        'StayFit Pills': {
            name: 'StayFit Pills',
            price: 210000,
            usaPrice: 130,
            hasFlavors: false,
            badge: 'Producto Top de Ventas',
            icon: '💊'
        },
        'StayFit Tea': {
            name: 'StayFit Tea',
            price: 140000,
            usaPrice: 80,
            hasFlavors: true,
            badge: 'Detox Natural',
            icon: '🍵'
        },
        'Combo 1': {
            name: 'Combo 1 (Mix Inicial)',
            price: 340000,
            usaPrice: 200,
            hasFlavors: true,
            badge: 'Ideal para Iniciar',
            icon: '✨'
        },
        'Combo 2': {
            name: 'Combo 2 (Dúo)',
            price: 430000,
            usaPrice: 270,
            hasFlavors: true,
            badge: 'Ahorro Pack',
            icon: '🔥'
        },
        'Combo 3': {
            name: 'Combo 3 (Trío)',
            price: 575000,
            usaPrice: 350,
            hasFlavors: true,
            badge: 'Máximo Ahorro',
            icon: '👑'
        }
    },

    shipping: {
        usa: 20,
        colombia: 'A cargo de transportadora'
    },

    flavors: ['Piña', 'Uva', 'Limón', 'Naranja', 'Frutos Rojos'],
};

