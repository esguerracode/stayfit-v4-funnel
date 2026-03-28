import { CONFIG } from './config.js';

/**
 * billing engine: handles currency, exchange rates and price formatting.
 */
export const Billing = {
    getCurrency() {
        return localStorage.getItem('sf_currency') || CONFIG.CURRENCY.DEFAULT;
    },

    setCurrency(currency) {
        localStorage.setItem('sf_currency', currency);
        document.body.setAttribute('data-currency', currency);
        this.updateDOM();
        
        // notify global listeners
        window.dispatchEvent(new CustomEvent('sf_currency_changed', { detail: { currency } }));
    },

    format(amount, currency = 'COP') {
        const locale = currency === 'COP' ? 'es-CO' : 'en-US';
        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    },

    updateDOM() {
        const currency = this.getCurrency();
        
        document.querySelectorAll('[data-amount-cop]').forEach(el => {
            const copValue = parseInt(el.getAttribute('data-amount-cop').replace(/\./g, ''));
            const usdValue = el.getAttribute('data-amount-usd');
            
            if (currency === 'COP') {
                el.innerHTML = `${this.format(copValue, 'COP')} <small>COP</small>`;
            } else {
                el.innerHTML = `${this.format(usdValue, 'USD')} <small>USD</small>`;
            }
        });
    }
};
