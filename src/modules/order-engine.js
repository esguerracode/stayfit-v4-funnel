import { CONFIG } from './config.js';
import { Attribution } from './attribution.js';
import { Billing } from './billing.js';

/**
 * order-engine: handles checkout logic, validation and whatsapp payload generation.
 */
export const OrderEngine = {
    generateWhatsAppUrl(data) {
        const teaActive = this.isTea(data.product);
        const utmSuffix = Attribution.getSuffix();
        const currency = Billing.getCurrency();

        let fullMessage = `✨ *NUEVO PEDIDO STAYFIT* ✨\n\n`;
        fullMessage += `👤 *Cliente:* ${data.name}\n`;
        fullMessage += `📞 *Teléfono:* ${data.phone}\n`;
        fullMessage += `📍 *Ciudad:* ${data.city}\n`;
        fullMessage += `🏘️ *Dirección:* ${data.address}\n\n`;
        fullMessage += `📦 *Producto:* ${data.product}\n`;
        if (data.flavor) fullMessage += `🍵 *Sabor:* ${data.flavor}\n`;
        fullMessage += `💰 *Total:* ${data.totalFormatted}\n\n`;
        fullMessage += `🚚 *Entrega:* 2 a 4 días hábiles.\n`;
        fullMessage += `⚠️ *Nota:* Pago contra entrega solo en Villavicencio/Yopal. Otros destinos requieren pago previo.\n\n`;
        fullMessage += `¡Quedo atento(a) a la confirmación! 🚀`;
        fullMessage += `\n\n---------------------------------\n_Enviado desde el Checkout de la Web_`;
        fullMessage += utmSuffix;
        
        return `https://wa.me/${CONFIG.WHATSAPP.PHONE}?text=${encodeURIComponent(fullMessage)}`;
    },

    isTea(name) {
        return name && (name.toLowerCase().includes('tea') || name.toLowerCase().includes('té') || name.toLowerCase().includes('te '));
    }
};
