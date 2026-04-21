import { CONFIG } from './config.js';
import { StorageWrapper } from './storage.js';

/**
 * billing engine: handles currency, exchange rates and price formatting.
 */
// Expose to window for direct access if module loading has issues elsewhere
window.Billing = Billing;
export const Billing = {
    getCurrency() {
        return StorageWrapper.getItem('sf_currency') || CONFIG.currency.DEFAULT;
    },

    setCurrency(currency) {
        StorageWrapper.setItem('sf_currency', currency);
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
        document.body.setAttribute('data-currency', currency);
        
        document.querySelectorAll('[data-amount-cop]').forEach(el => {
            const copRaw = el.getAttribute('data-amount-cop');
            const usdRaw = el.getAttribute('data-amount-usd');
            
            if (currency === 'COP') {
                const copValue = parseInt(String(copRaw).replace(/[^0-9]/g, ''));
                const formatted = this.format(copValue, 'COP');
                el.innerHTML = el.classList.contains('price-strikethrough') ? formatted : `${formatted} <small>COP</small>`;
            } else {
                const usdValue = parseFloat(String(usdRaw).replace(/[^0-9.]/g, ''));
                const formatted = this.format(usdValue, 'USD');
                el.innerHTML = el.classList.contains('price-strikethrough') ? formatted : `${formatted} <small>USD</small>`;
            }
        });

        // Sync visual toggle if it exists
        const toggleBtn = document.getElementById('currency-toggle');
        if (toggleBtn) {
            toggleBtn.innerHTML = currency;
            toggleBtn.setAttribute('data-active-currency', currency);
        }
    },

    async autoDetectCurrency() {
        // Skip if manual selection exists
        if (StorageWrapper.getItem('sf_currency')) {
            this.updateDOM();
            return;
        }

        try {
            // First attempt: GeoJS
            const res = await fetch('https://get.geojs.io/v1/ip/country.json');
            const data = await res.json();
            const currency = (data.country === 'CO' || data.country_code === 'CO') ? 'COP' : 'USD';
            this.setCurrency(currency);
        } catch (e) {
            try {
                // Failover: IP-API
                const res = await fetch('http://ip-api.com/json/');
                const data = await res.json();
                const currency = data.countryCode === 'CO' ? 'COP' : 'USD';
                this.setCurrency(currency);
            } catch (e2) {
                console.warn('StayFit: All Geo services failed. Falling back to COP.');
                this.setCurrency('COP');
            }
        }
    }
};
