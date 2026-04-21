import { CONFIG } from './config.js';

/**
 * CheckoutEngine: Maneja la lógica del modal de pedido en 2 pasos.
 */
export const CheckoutEngine = {
    state: {
        currentStep: 1,
        selectedProduct: null,
        selectedFlavor: 'Naranja',
        quantity: 1,
        pricePerUnit: 0
    },

    init() {
        this.cacheDOM();
        this.bindEvents();
        this.updateTotals();
        console.log('🚀 CheckoutEngine Initialized (High-End)');
    },

    cacheDOM() {
        this.dom = {
            overlay: document.getElementById('modal-overlay'),
            modal: document.getElementById('order-modal'),
            form: document.getElementById('checkout-form'),
            
            // Inputs
            inputName: document.getElementById('u-name'),
            inputPhone: document.getElementById('u-phone'),
            inputCity: document.getElementById('u-city'),
            inputDept: document.getElementById('u-dept'),
            inputAddress: document.getElementById('u-barrio'),
            
            // Steps & Screens
            step1: document.getElementById('step-1'),
            step2: document.getElementById('step-2'),
            step1Ind: document.getElementById('step1-indicator'),
            step2Ind: document.getElementById('step2-indicator'),
            stepDivider: document.getElementById('step-divider'),
            
            // Display & Controls
            modalTitle: document.getElementById('modal-title'),
            headerBadge: document.getElementById('header-badge'),
            headerIcon: document.getElementById('header-icon'),
            qtyDisplay: document.getElementById('qty-display'),
            qtyMinus: document.getElementById('qty-minus'),
            qtyPlus: document.getElementById('qty-plus'),
            
            // Totals
            subtotalHint: document.getElementById('subtotal-hint'),
            valSub: document.getElementById('val-sub'),
            valTotal: document.getElementById('val-total'),
            confirmTotal: document.getElementById('confirm-total'),
            
            // Flavor
            flavorField: document.getElementById('flavor-field'),
            flavorPills: document.querySelectorAll('.pill-option'),
            
            // Buttons
            btnNext: document.getElementById('btn-to-step2'),
            btnBack: document.getElementById('btn-back-step1'),
            btnClose: document.getElementById('close-modal'),
            
            // Summary Step 2
            sumProduct: document.getElementById('sum-product'),
            sumFlavor: document.getElementById('sum-flavor'),
            sumFlavorRow: document.getElementById('sum-flavor-row'),
            sumDest: document.getElementById('sum-dest')
        };
    },

    bindEvents() {
        // Global Delegation for Buy Buttons
        document.addEventListener('click', (e) => {
            const trigger = e.target.closest('[data-open-modal]');
            if (trigger) {
                const productId = trigger.dataset.product;
                const flavor = trigger.dataset.flavor;
                this.openModal(productId, flavor);
            }
        });

        // Navigation
        this.dom.btnNext.addEventListener('click', () => this.goToStep(2));
        this.dom.btnBack.addEventListener('click', () => this.goToStep(1));
        this.dom.btnClose.addEventListener('click', () => this.closeModal());
        this.dom.overlay.addEventListener('click', (e) => {
            if (e.target === this.dom.overlay) this.closeModal();
        });

        // Quantity
        this.dom.qtyMinus.addEventListener('click', () => this.updateQuantity(-1));
        this.dom.qtyPlus.addEventListener('click', () => this.updateQuantity(1));

        // Flavors
        this.dom.flavorPills.forEach(pill => {
            pill.addEventListener('click', () => {
                this.dom.flavorPills.forEach(p => p.classList.remove('active'));
                pill.classList.add('active');
                this.state.selectedFlavor = pill.dataset.flavor;
            });
        });

        // Final Submit
        this.dom.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.sendOrder();
        });
    },

    openModal(productId, flavor = null) {
        let product = CONFIG.products[productId];
        
        // Fallback if ID is different (e.g. "StayFit Pills" -> "Capsulas")
        if (!product) {
            const normalized = Object.keys(CONFIG.products).find(k => 
                k.toLowerCase().includes(productId.toLowerCase()) || 
                productId.toLowerCase().includes(k.toLowerCase())
            );
            product = CONFIG.products[normalized];
        }

        if (!product) {
            console.error('CheckoutEngine: Product not found:', productId);
            return;
        }

        this.state.selectedProduct = product;
        this.state.pricePerUnit = product.price;
        this.state.quantity = 1;

        // Flavor logic
        if (flavor) {
            this.state.selectedFlavor = flavor;
            this.dom.flavorPills.forEach(p => {
                p.classList.toggle('active', p.dataset.flavor === flavor);
            });
        }

        // UI Reset
        this.dom.modalTitle.textContent = product.name;
        this.dom.headerBadge.textContent = product.badge || 'Fórmula Original';
        this.dom.headerIcon.textContent = product.icon || '💜';
        
        // Mostrar/Ocultar Sabor
        this.dom.flavorField.style.display = product.hasFlavors ? 'block' : 'none';
        
        this.updateQuantity(0);
        this.goToStep(1);
        
        this.dom.overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    },

    closeModal() {
        this.dom.overlay.classList.remove('active');
        document.body.style.overflow = '';
    },

    goToStep(step) {
        if (step === 2 && !this.validateStep1()) return;

        this.state.currentStep = step;
        
        // Hide/Show screens
        this.dom.step1.classList.toggle('active', step === 1);
        this.dom.step2.classList.toggle('active', step === 2);

        // Update Indicators
        this.dom.step1Ind.classList.toggle('active', step === 1);
        this.dom.step1Ind.classList.toggle('done', step === 2);
        this.dom.step2Ind.classList.toggle('active', step === 2);
        this.dom.stepDivider.classList.toggle('done', step === 2);

        if (step === 2) this.renderSummary();
    },

    updateQuantity(change) {
        this.state.quantity = Math.max(1, this.state.quantity + change);
        this.dom.qtyDisplay.textContent = this.state.quantity;
        this.updateTotals();
    },

    updateTotals() {
        const subtotal = this.state.pricePerUnit * this.state.quantity;
        const formatted = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(subtotal);
        
        this.dom.subtotalHint.textContent = formatted;
        this.dom.valSub.textContent = formatted;
        this.dom.valTotal.textContent = formatted;
        this.dom.confirmTotal.textContent = formatted;
    },

    validateStep1() {
        let valid = true;
        const name = this.dom.inputName.value.trim();
        const phone = this.dom.inputPhone.value.trim();
        const city = this.dom.inputCity.value.trim();
        const dept = this.dom.inputDept.value.trim();
        const address = this.dom.inputAddress.value.trim();

        // Limpiar errores previos
        document.querySelectorAll('.field-error').forEach(e => e.classList.remove('visible'));
        document.querySelectorAll('.field-input, .phone-wrapper').forEach(e => e.classList.remove('shake'));

        if (name.length < 3) {
            this.showError('err-name', this.dom.inputName);
            valid = false;
        }
        if (!/^[0-9]{10}$/.test(phone)) {
            this.showError('err-phone', document.getElementById('phone-wrapper'));
            valid = false;
        }
        if (!city) {
            this.showError('err-city', this.dom.inputCity);
            valid = false;
        }
        if (!dept) {
            this.showError('err-dept', this.dom.inputDept);
            valid = false;
        }
        if (address.length < 5) {
            this.showError('err-address', this.dom.inputAddress);
            valid = false;
        }

        return valid;
    },

    showError(id, inputElement) {
        document.getElementById(id).classList.add('visible');
        inputElement.classList.add('shake');
        setTimeout(() => inputElement.classList.remove('shake'), 400);
    },

    renderSummary() {
        this.dom.sumProduct.textContent = this.state.selectedProduct.name;
        
        if (this.state.selectedProduct.hasFlavors) {
            this.dom.sumFlavorRow.style.display = 'flex';
            this.dom.sumFlavor.textContent = this.state.selectedFlavor;
        } else {
            this.dom.sumFlavorRow.style.display = 'none';
        }

        const city = this.dom.inputCity.value;
        const dept = this.dom.inputDept.value;
        this.dom.sumDest.textContent = `${city}, ${dept}`;
    },

    sendOrder() {
        const { selectedProduct, selectedFlavor, quantity } = this.state;
        const name = this.dom.inputName.value;
        const phone = this.dom.inputPhone.value;
        const city = this.dom.inputCity.value;
        const dept = this.dom.inputDept.value;
        const address = this.dom.inputAddress.value;
        const total = this.state.pricePerUnit * quantity;

        const flavorSuffix = selectedProduct.hasFlavors ? ` (${selectedFlavor})` : '';
        const subtotalFormatted = total.toLocaleString('es-CO');
        
        const message = `Hola, quiero hacer un pedido:\n\n` +
            `📦 Producto: ${selectedProduct.name}${flavorSuffix} (x${quantity})\n` +
            `💰 Subtotal: $${subtotalFormatted} COP\n` +
            `👤 Nombre: ${name}\n` +
            `📞 WhatsApp: +57${phone}\n` +
            `📍 Ciudad: ${city}, ${dept}\n` +
            `🏠 Dirección: ${address}`;

        const waUrl = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
        window.open(waUrl, '_blank');
        this.closeModal();
    }
};
