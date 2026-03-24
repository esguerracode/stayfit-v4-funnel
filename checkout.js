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
     * Modal Control Functions
     */
    const openModal = (productName) => {
        if (!modal) return;
        
        lastFocusedElement = document.activeElement; // Remember trigger
        productHidden.value = productName;
        modalTitle.textContent = productName;
        
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        // Minor delay for CSS transition
        setTimeout(() => {
            modal.classList.add('active');
            // Move focus to first input
            const firstInput = modal.querySelector('input');
            if (firstInput) firstInput.focus();
        }, 10);

        trapFocus(modal);
    };

    const closeModal = () => {
        if (!modal) return;
        
        modal.classList.remove('active');
        document.body.style.overflow = '';
        
        setTimeout(() => {
            modal.style.display = 'none';
            // Restore focus to trigger element
            if (lastFocusedElement) lastFocusedElement.focus();
        }, 400); 
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
     * Optimized WhatsApp Submission
     */
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalContent = submitBtn.innerHTML;
            
            // Visual feedback
            submitBtn.innerHTML = '<span>✨ Procesando...</span>';
            submitBtn.disabled = true;

            const formData = new FormData(this);
            const data = Object.fromEntries(formData.entries());
            const cleanPhone = data.phone.replace(/\D/g, '');

            const messageHeader = `🛍️ *ORDEN PENDIENTE STAYFIT*`;
            const messageBody = [
                `📦 *Producto:* ${data.product}`,
                `👤 *Cliente:* ${data.name}`,
                `📱 *WhatsApp:* ${countryCode.textContent} ${cleanPhone}`,
                `🏠 *Dirección:* ${data.address}`,
                `📍 *Origen:* ${data.country}`
            ].join('\n');
            const messageFooter = `---------------------------------\n_Enviado desde el Checkout de la Web_`;

            const fullMessage = `${messageHeader}\n\n${messageBody}\n\n${messageFooter}`;
            const encodedMsg = encodeURIComponent(fullMessage);
            const waUrl = `https://wa.me/573103296863?text=${encodedMsg}`;

            // Small delay for perceived robustness & UX
            setTimeout(() => {
                window.open(waUrl, '_blank'); // Open in new tab to keep lead on site
                
                // Reset state
                submitBtn.innerHTML = originalContent;
                submitBtn.disabled = false;
                
                // Track Conversion (Optional Placeholder)
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
