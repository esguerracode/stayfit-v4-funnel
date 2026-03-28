import { UI } from './ui-engine.js';
import { Billing } from './billing.js';
import { OrderEngine } from './order-engine.js';
import { CONFIG } from './config.js';

/**
 * checkout-ui: modal interactions, quantity control and form submission.
 */
export const CheckoutUI = {
    state: {
        qty: 1,
        currentProduct: '',
        lastFocused: null
    },

    init() {
        this.bindEvents();
    },

    bindEvents() {
        // Quantity
        const minus = document.getElementById('qty-minus');
        const plus = document.getElementById('qty-plus');
        if (minus) minus.onclick = () => this.updateQty(-1);
        if (plus) plus.onclick = () => this.updateQty(1);

        // Flavor Pills
        document.querySelectorAll('.pill-option').forEach(pill => {
            pill.onclick = () => {
                document.querySelectorAll('.pill-option').forEach(p => p.classList.remove('active'));
                pill.classList.add('active');
                const flavorInput = document.getElementById('flavor-hidden-input');
                if (flavorInput) flavorInput.value = pill.dataset.flavor;
            };
        });

        // Form Submit
        const form = document.getElementById('checkout-form');
        if (form) form.onsubmit = (e) => this.handleSubmit(e);
        
        // Country Sync
        const countrySelect = document.getElementById('country-select');
        const countryCode = document.getElementById('country-code');
        if (countrySelect && countryCode) {
            countrySelect.onchange = (e) => {
                countryCode.textContent = e.target.value === 'Estados Unidos' ? '+1' : '+57';
            };
        }
    },

    open(productName) {
        this.state.currentProduct = productName;
        this.state.qty = 1;
        this.state.lastFocused = document.activeElement;

        const title = document.getElementById('modal-title');
        const productInput = document.getElementById('product-hidden-input');
        const qtyDisplay = document.getElementById('qty-display');
        const flavorField = document.getElementById('flavor-field');

        if (title) title.textContent = productName;
        if (productInput) productInput.value = productName;
        if (qtyDisplay) qtyDisplay.textContent = '1';

        // Toggle flavor field
        if (flavorField) {
            flavorField.style.display = OrderEngine.isTea(productName) ? 'block' : 'none';
        }

        this.updateSummary();
        UI.modal.open('order-modal', (modal) => UI.trapFocus(modal));
    },

    updateQty(delta) {
        this.state.qty = Math.max(1, this.state.qty + delta);
        const display = document.getElementById('qty-display');
        if (display) display.textContent = this.state.qty;
        this.updateSummary();
    },

    updateSummary() {
        const summary = document.getElementById('summary-price');
        if (!summary) return;

        const basePrice = CONFIG.PRICES[this.state.currentProduct] || 210000;
        const total = basePrice * this.state.qty;
        summary.textContent = Billing.format(total, Billing.getCurrency());
    },

    async handleSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;

        submitBtn.disabled = true;
        submitBtn.innerHTML = '✨ Procesando...';

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Enrich data
        data.qty = this.state.qty;
        data.totalFormatted = document.getElementById('summary-price').textContent;
        data.countryCode = document.getElementById('country-code').textContent;
        data.phone = data.phone.replace(/\D/g, '');

        const waUrl = OrderEngine.generateWhatsAppUrl(data);

        setTimeout(() => {
            window.open(waUrl, '_blank');
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
            UI.modal.close('order-modal');
            form.reset();
        }, 800);
    }
};
