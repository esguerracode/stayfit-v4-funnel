import { Attribution } from './modules/attribution.js';
import { Billing } from './modules/billing.js';
import { UI } from './modules/ui-engine.js';
import { CheckoutUI } from './modules/checkout-ui.js';
import { Sliders } from './modules/sliders.js';
import { Loader } from './modules/loader.js';

/**
 * StayFit Main Application (ESM Orchestration)
 */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Core Logic
    Attribution.init();
    Billing.updateDOM();
    UI.initReveal();
    Loader.init();
    CheckoutUI.init();

    // 2. Specialized Components
    Sliders.initFlavorSlider('flavor-slider-tea', document.querySelector('.flavor-dots'), document.getElementById('flavor-tabs-tea'));

    // 3. Global Event Delegation
    initGlobalDelegation();
});

function initGlobalDelegation() {
    document.addEventListener('click', (e) => {
        // Modal Trigger
        const trigger = e.target.closest('[data-open-modal]');
        if (trigger) {
            e.preventDefault();
            const product = trigger.getAttribute('data-product') || 'Producto StayFit';
            CheckoutUI.open(product);
        }

        // Currency Toggle
        const currencyBtn = e.target.closest('#currency-toggle');
        if (currencyBtn) {
            const current = Billing.getCurrency();
            const next = current === 'COP' ? 'USD' : 'COP';
            Billing.setCurrency(next);
            currencyBtn.innerHTML = next;
        }

        // Modal Specific Close
        if (e.target.closest('#close-modal') || e.target.closest('#modal-overlay')) {
            UI.modal.close('order-modal');
        }
    });

    // Escape Key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            UI.modal.close('order-modal');
        }
    });
}
