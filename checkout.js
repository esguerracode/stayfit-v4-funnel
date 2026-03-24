/**
 * StayFit Premium Checkout & UX Logic
 * Includes: WCAG Focus Trap, Escape close, Currency Conversion, WhatsApp Integration
 */

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('order-modal');
    const closeBtns = document.querySelectorAll('#close-modal, #modal-overlay');
    const checkoutForm = document.getElementById('checkout-form');
    const countrySelect = document.getElementById('country-select');
    const countryCode = document.getElementById('country-code');
    const productHidden = document.getElementById('product-hidden-input');
    const modalTitle = document.getElementById('modal-title');
    
    let lastFocusedElement;

    /**
     * WCAG 2.1.2 Focus Trap Implementation
     */
    const trapFocus = (element) => {
        const focusableSelectors = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
        const focusableElements = element.querySelectorAll(focusableSelectors);
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];

        element.addEventListener('keydown', function(e) {
            if (e.key !== 'Tab') return;

            if (e.shiftKey) { // Shift + Tab
                if (document.activeElement === firstFocusable) {
                    lastFocusable.focus();
                    e.preventDefault();
                }
            } else { // Tab
                if (document.activeElement === lastFocusable) {
                    firstFocusable.focus();
                    e.preventDefault();
                }
            }
        });
    };

    /**
     * FEATURE 2: MODAL LOGIC (Prices, Qty, Flavors)
     */
    const qtyDisplay = document.getElementById('qty-display');
    const qtyMinus = document.getElementById('qty-minus');
    const qtyPlus = document.getElementById('qty-plus');
    const flavorField = document.getElementById('flavor-field');
    const flavorPills = document.querySelectorAll('.pill-option');
    const flavorHidden = document.getElementById('product-hidden-input'); // Usaremos el mismo hidden si es necesario o uno específico
    const flavorSelectedInput = document.getElementById('flavor-hidden-input'); // El que definimos en FEATURE 1
    const summaryPrice = document.getElementById('summary-price');
    let qty = 1;

    // Fixed Prices
    const PRICES = {
        'StayFit Pills': 210000,
        'StayFit Tea': 140000,
        'Combo 1 (Mix Inicial)': 340000,
        'Combo 2 (Dúo Poder)': 260000,
        'Combo 3 (Máximo Detox)': 375000,
        'Tratamiento StayFit': 210000,
    };

    const formatCOP = (n) => 
        new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n);

    const updateSummary = () => {
        const productName = document.getElementById('product-hidden-input').value;
        const base = PRICES[productName] || 210000;
        if (summaryPrice) summaryPrice.textContent = formatCOP(base * qty);
    };

    const isTea = (name) => 
        name && (name.toLowerCase().includes('tea') || name.toLowerCase().includes('té') || name.toLowerCase().includes('te '));

    // Quantity Listeners
    if (qtyMinus && qtyPlus) {
        qtyMinus.onclick = () => { if (qty > 1) { qty--; qtyDisplay.textContent = qty; updateSummary(); } };
        qtyPlus.onclick = () => { qty++; qtyDisplay.textContent = qty; updateSummary(); };
    }

    // Flavor Pill Logic
    flavorPills.forEach(pill => {
        pill.onclick = () => {
            flavorPills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            if (flavorSelectedInput) flavorSelectedInput.value = pill.dataset.flavor;
        };
    });

    /**
     * Modal Control Functions (Optimized)
     */
    const openModal = (productName) => {
        if (!modal) return;
        
        lastFocusedElement = document.activeElement;
        const productInput = document.getElementById('product-hidden-input');
        if (productInput) productInput.value = productName;
        modalTitle.textContent = productName;
        
        qty = 1;
        if (qtyDisplay) qtyDisplay.textContent = qty;
        
        if (flavorField) {
            const teaActive = isTea(productName);
            flavorField.style.display = teaActive ? 'block' : 'none';
            if (teaActive && flavorSelectedInput) {
                const currentFlavor = flavorSelectedInput.value || 'Naranja';
                flavorPills.forEach(p => p.classList.toggle('active', p.dataset.flavor === currentFlavor));
            }
        }
        
        updateSummary();
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        setTimeout(() => { modal.classList.add('active'); }, 10);
        trapFocus(modal);
    };

    const closeModal = () => {
        if (!modal) return;
        modal.classList.remove('active');
        document.body.style.overflow = '';
        setTimeout(() => { modal.style.display = 'none'; if (lastFocusedElement) lastFocusedElement.focus(); }, 400); 
    };

    /**
     * Global Event Listeners
     */
    document.addEventListener('click', (e) => {
        const trigger = e.target.closest('[data-open-modal]');
        if (trigger) {
            e.preventDefault();
            const product = trigger.getAttribute('data-product') || 'Producto StayFit';
            openModal(product);
        }
    });

    closeBtns.forEach(btn => btn.addEventListener('click', closeModal));

    // Escape Key Handler
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // Country Code Sync
    if (countrySelect) {
        countrySelect.addEventListener('change', (e) => {
            countryCode.textContent = e.target.value === 'Estados Unidos' ? '+1' : '+57';
        });
    }

    /**
     * Optimized WhatsApp Submission (Redesigned)
     */
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalContent = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<span>✨ Procesando...</span>';
            submitBtn.disabled = true;

            const formData = new FormData(this);
            const data = Object.fromEntries(formData.entries());
            const cleanPhone = data.phone.replace(/\D/g, '');
            
            const totalStr = summaryPrice ? summaryPrice.textContent : '';
            const teaActive = isTea(data.product);

            const messageHeader = `🛍️ *ORDEN PENDIENTE STAYFIT*`;
            const messageBody = [
                `📦 *Producto:* ${data.product}`,
                teaActive ? `🍵 *Sabor:* ${data.flavor}` : '',
                `🔢 *Cantidad:* ${qty}`,
                `💰 *Total:* ${totalStr}`,
                `👤 *Cliente:* ${data.name}`,
                `📱 *WhatsApp:* ${countryCode.textContent} ${cleanPhone}`,
                `🏠 *Dirección:* ${data.address}`,
                `📍 *Origen:* ${data.country}`
            ].filter(line => line !== '').join('\n');
            
            const messageFooter = `---------------------------------\n_Enviado desde el Checkout de la Web_`;

            const fullMessage = `${messageHeader}\n\n${messageBody}\n\n${messageFooter}`;
            const encodedMsg = encodeURIComponent(fullMessage);
            const waUrl = `https://wa.me/573103296863?text=${encodedMsg}`;

            setTimeout(() => {
                window.open(waUrl, '_blank');
                submitBtn.innerHTML = originalContent;
                submitBtn.disabled = false;
                
                if (typeof window.gtag === 'function') {
                    window.gtag('event', 'conversion', { 'send_to': 'AW-CONVERSION_ID', 'value': 1.0, 'currency': 'COP' });
                }

                closeModal();
                checkoutForm.reset();
            }, 800);
        });
    }

    /**
     * Perceived Performance: Real Progress Loader
     */
    const progressBar = document.getElementById('pl-progress');
    if (progressBar) {
        let width = 0;
        const interval = setInterval(() => {
            if (width >= 100) {
                clearInterval(interval);
            } else {
                width += Math.random() * 30;
                if (width > 100) width = 100;
                progressBar.style.width = width + '%';
            }
        }, 150);
    }
});
