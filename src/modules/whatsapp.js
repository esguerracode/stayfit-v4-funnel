/**
 * WhatsApp CTA Module - STAYFIT PREMIUM
 * 
 * Single source of truth for all WhatsApp communications.
 * Messages are optimized for "Hot Leads" to ensure the AI Bot 
 * can process the order immediately.
 */

const WA_BASE = 'https://wa.me/573103296863?text=';

/**
 * All bot-trigger message templates.
 * Keys map 1:1 to CTA element IDs in the HTML.
 */
const MESSAGES = {
    // Hero & Navigation
    'cta-hero': 
        '🔥 ¡HOLA STAYFIT! Vengo de la web y quiero empezar mi transformación HOY mismo. ¿Qué pack me recomiendan?',
    'cta-header':
        '🛒 CATÁLOGO | Hola, quiero ver las opciones de StayFit y hacer un pedido ahora.',

    // Individual Products
    'cta-pills': 
        '🔥 TRATAMIENTO PILLS | Quiero mis StayFit Pills de 30 cápsulas. ¿Tienen disponibilidad inmediata para envío?',
    'cta-tea-naranja':
        '🛒 PEDIDO TEA | Sabor Naranja 🍊. Quiero un paquete de té. ¿Me confirman precio con envío?',
    'cta-tea-frutos':
        '🛒 PEDIDO TEA | Sabor Frutos Rojos 🍓. Quiero un paquete de té. ¿Me confirman precio con envío?',
    'cta-tea-pina':
        '🛒 PEDIDO TEA | Sabor Piña 🍍. Quiero un paquete de té. ¿Me confirman precio con envío?',
    'cta-tea-uva':
        '🛒 PEDIDO TEA | Sabor Uva 🍇. Quiero un paquete de té. ¿Me confirman precio con envío?',
    'cta-tea-limon':
        '🛒 PEDIDO TEA | Sabor Limón 🍋. Quiero un paquete de té. ¿Me confirman precio con envío?',
    'cta-tea-maracuya':
        '🛒 PEDIDO TEA | Sabor Maracuyá 💛. Quiero un paquete de té. ¿Me confirman precio con envío?',

    // Transformation Packs (High Value)
    'cta-combo1':
        '🚀 KIT DE INICIO | Pills + Tea. ¡Este es el que quiero! ¿Cómo hago el pago para recibirlo en 24-48h?',
    'cta-combo2':
        '🚀 PACK DÚO TEA | Quiero los 2 Tés para mi tratamiento intensivo. ¿Cómo procedemos?',
    'cta-combo3':
        '🚀 PROTOCOLO 360 | ¡Quiero el tratamiento completo de 3 cajas al mejor precio! ¿Cómo coordinamos?',

    // Wholesale & Support
    'cta-wholesale':
        '📦 MAYORISTAS | Hola, tengo una comunidad y quiero distribuir StayFit. ¿Me envían precios al por mayor?',
    'cta-sticky':
        '🛒 PEDIDO RÁPIDO | ¡Hola! Ayúdenme a finalizar mi pedido de StayFit por favor.',
    'cta-final':
        '✨ LISTA PARA EMPEZAR | Ya elegí StayFit. ¿Cuáles son los datos para el pago y envío?',
};

/**
 * Builds encoded URL.
 */
function buildUrl(message) {
    return WA_BASE + encodeURIComponent(message);
}

/**
 * Hydrates an element's href.
 */
function applyCta(ctaId) {
    const el = document.getElementById(ctaId);
    if (el && MESSAGES[ctaId]) {
        el.href = buildUrl(MESSAGES[ctaId]);
    }
}

/**
 * Dynamic flavor update (for sliders or modals).
 */
function updateTeaFlavor(flavorName) {
    const FLAVOR_EMOJIS = {
        'Naranja':      '🍊',
        'Frutos Rojos': '🍓',
        'Piña':         '🍍',
        'Uva':          '🍇',
        'Limón':        '🍋',
        'Maracuyá':     '💛',
    };
    const emoji = FLAVOR_EMOJIS[flavorName] || '🍵';
    const message = `🛒 PEDIDO TEA | Sabor ${flavorName} ${emoji}. Quiero hacer mi pedido ahora.`;
    
    // We update the tea-specific buttons if any
    const teaBtns = document.querySelectorAll('[data-product="Tea"]');
    teaBtns.forEach(btn => {
        btn.href = buildUrl(message);
    });
}

/**
 * Global initialization.
 */
function initAllCtas() {
    Object.keys(MESSAGES).forEach(applyCta);
    
    // Also handle dynamic data-msg elements if any
    const dynamicLinks = document.querySelectorAll('.whatsapp-link');
    dynamicLinks.forEach(link => {
        const customMsg = link.getAttribute('data-msg');
        if (customMsg) {
            link.href = buildUrl(customMsg);
        }
    });
}

export const WhatsApp = {
    initAllCtas,
    updateTeaFlavor,
    buildUrl,
    MESSAGES
};
