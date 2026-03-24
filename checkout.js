/**
 * StayFit Checkout & Modal Logic
 * Handles the multi-step sales process:
 * 1. Open order modal with product context
 * 2. Capture user leads (name, phone, address, qty)
 * 3. Redirect to WhatsApp with a pre-formatted message
 */

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. DOM References ---
    const modal     = document.getElementById('order-modal');
    const closeBtn  = document.getElementById('close-modal');
    const form      = document.getElementById('checkout-form');
    const qtyVal    = document.getElementById('qty-val');
    const qtyInput  = document.getElementById('quantity-input');
    const productInput = document.getElementById('product-hidden-input');
    const modalTitle   = document.getElementById('modal-product-title');
    const qtyMinus  = document.getElementById('qty-minus');
    const qtyPlus   = document.getElementById('qty-plus');

    // Wholesale references
    const wholesaleBtn = document.getElementById('open-wholesale-btn');
    const wholesaleModal = document.getElementById('wholesale-modal');
    const wholesaleCloseBtn = document.getElementById('close-wholesale-modal');
    const wholesaleForm = document.getElementById('wholesale-form');

    // --- 2. Currency Toggle (product pages) ---
    const currencyBtn   = document.getElementById('currency-toggle');
    const priceElements = document.querySelectorAll('[data-amount-cop]');
    let isCOP = true;  // default currency state

    if (currencyBtn) {
        // Restore saved preference
        const saved = localStorage.getItem('sf_currency');
        if (saved === 'usd') { isCOP = false; applyCurrency(); }

        currencyBtn.addEventListener('click', () => {
            isCOP = !isCOP;
            localStorage.setItem('sf_currency', isCOP ? 'cop' : 'usd');
            applyCurrency();
        });
    }

    function applyCurrency() {
        if (!currencyBtn) return;
        priceElements.forEach(el => {
            if (isCOP) {
                el.textContent = '$' + el.dataset.amountCop + ' COP';
            } else {
                el.textContent = '$' + el.dataset.amountUsd + ' USD';
            }
        });
        currencyBtn.innerHTML = isCOP ? '🇺🇸 USD' : '🇨🇴 COP';

        // Update CTA button label
        const ctaBtn = document.querySelector('[data-open-modal]');
        if (ctaBtn) {
            const priceEl = document.querySelector('.current-price');
            if (priceEl) {
                const rawPrice = isCOP
                    ? '$' + priceEl.dataset.amountCop
                    : '$' + priceEl.dataset.amountUsd;
                const label = ctaBtn.dataset.product || 'Ordenar';
                ctaBtn.textContent = `Ordenar Hoy — ${rawPrice}`;
            }
        }
    }

    // --- 3. Modal Triggers ---
    document.addEventListener('click', (e) => {
        const trigger = e.target.closest('[data-open-modal]');
        if (trigger) {
            e.preventDefault();
            const product = trigger.getAttribute('data-product') || 'StayFit Product';
            openModal(product);
        }
    });

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (modal)    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
            closeWholesale();
        }
    });

    // --- 4. Modal Open / Close ---
    function openModal(productName) {
        if (!modal) return;
        if (productInput) productInput.value = productName;
        if (modalTitle)   modalTitle.textContent = productName;
        setQty(1);

        // Flavor logic based on product
        const f1 = document.getElementById('flavor1');
        const f2 = document.getElementById('flavor2');
        const f3 = document.getElementById('flavor3');
        const fLabel = document.getElementById('flavor-label');
        
        if (f1 && f2 && f3 && fLabel) {
            // Reset state
            f1.style.display = 'block';
            f2.style.display = 'none';
            f3.style.display = 'none';
            f1.required = true;
            f2.required = false;
            f3.required = false;
            fLabel.textContent = 'Sabor Preferido';

            const nameLow = productName.toLowerCase();
            if (nameLow.includes('pastillas') && !nameLow.includes('combo')) {
                f1.style.display = 'none';
                f1.value = 'No aplica';
                f1.required = false;
                fLabel.textContent = 'Sabor (No aplica para pastillas)';
            } else if (nameLow.includes('combo 2')) {
                f2.style.display = 'block';
                f2.required = true;
                fLabel.textContent = 'Elige tus 2 sabores';
            } else if (nameLow.includes('combo 3')) {
                f2.style.display = 'block';
                f3.style.display = 'block';
                f2.required = true;
                f3.required = true;
                fLabel.textContent = 'Elige tus 3 sabores';
            } else {
                // If it's single tea, leave f1 required
                f1.required = false; // We can set it false generic if we dont want to strictly block
            }
        }

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        // Focus first input for accessibility
        setTimeout(() => {
            const first = modal.querySelector('input:not([type=hidden])');
            if (first) first.focus();
        }, 300);
    }

    function closeModal() {
        if (!modal) return;
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // --- Wholesale Modal Logic ---
    if (wholesaleBtn) {
        wholesaleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (wholesaleModal) {
                wholesaleModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    }

    function closeWholesale() {
        if (wholesaleModal) {
            wholesaleModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    if (wholesaleCloseBtn) wholesaleCloseBtn.addEventListener('click', closeWholesale);
    if (wholesaleModal) wholesaleModal.addEventListener('click', (e) => { if (e.target === wholesaleModal) closeWholesale(); });

    // --- 5. Quantity Controls ---
    function setQty(val) {
        if (!qtyVal || !qtyInput) return;
        const n = Math.max(1, parseInt(val) || 1);
        qtyVal.textContent = n;
        qtyInput.value = n;
    }

    function changeQty(delta) {
        const current = parseInt(qtyInput?.value) || 1;
        setQty(current + delta);
    }

    if (qtyMinus) qtyMinus.addEventListener('click', () => changeQty(-1));
    if (qtyPlus)  qtyPlus.addEventListener('click',  () => changeQty(+1));

    // Keep global for any inline usage
    window.updateQty = changeQty;

    // --- Country Selection Logic ---
    const countrySelect = document.getElementById('country-select');
    const countryCodeSpan = document.getElementById('country-code');
    const idLabel = document.getElementById('id-label');
    const idInput = document.getElementById('id-input');

    if (countrySelect) {
        countrySelect.addEventListener('change', (e) => {
            if (e.target.value === 'Estados Unidos') {
                if(countryCodeSpan) countryCodeSpan.textContent = '+1';
                if(idLabel) idLabel.textContent = 'ZIP / Postal Code';
                if(idInput) idInput.placeholder = 'Ej: 33101';
            } else {
                if(countryCodeSpan) countryCodeSpan.textContent = '+57';
                if(idLabel) idLabel.textContent = 'Cédula (Colombia)';
                if(idInput) idInput.placeholder = 'Ej: 10203040';
            }
        });
    }

    const wsCountrySelect = document.getElementById('ws-country-select');
    const wsCountryCodeSpan = document.getElementById('ws-country-code');
    if (wsCountrySelect) {
        wsCountrySelect.addEventListener('change', (e) => {
            if (e.target.value === 'Estados Unidos') {
                if(wsCountryCodeSpan) wsCountryCodeSpan.textContent = '+1';
            } else {
                if(wsCountryCodeSpan) wsCountryCodeSpan.textContent = '+57';
            }
        });
    }

    // --- 6. Form Submission → WhatsApp ---

    // Order Checkout
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            const data = Object.fromEntries(new FormData(this).entries());
            const qty  = parseInt(data.quantity) || 1;

            // Determine current price for the product from global if applicable, but we default generic here
            // Note: Since clicking combos opens the same modal from standard prices,
            // we look up the nearest element with data-amount-cop or pass generic
            // Better behavior: calculate from specific product if available, else generic.
            
            // For robust simple checkout, we might use generic 'Ver precio en sitio'
            // or find the clicked triggering button (complicated as it's lost after click)
            // But we already have logic here:
            const priceEl = document.querySelector('.current-price');
            const priceLabel = priceEl
                ? priceEl.textContent.trim()
                : 'Se calculará al enviar';

            const unitPrice = priceEl
                ? (isCOP
                    ? parseInt((priceEl.dataset.amountCop || '0').replace(/\./g, ''))
                    : parseInt(priceEl.dataset.amountUsd || '0'))
                : 0;

            const totalPrice = unitPrice
                ? (isCOP
                    ? `$${(unitPrice * qty).toLocaleString('es-CO')} COP`
                    : `$${(unitPrice * qty).toLocaleString('en-US')} USD`)
                : 'Consultar';

            // Build WhatsApp message
            const lines = [
                `🛍️ *NUEVO PEDIDO STAYFIT*`,
                ``,
                `*Producto:* ${data.product}`,
                `*Cantidad:* ${qty} unidad${qty > 1 ? 'es' : ''}`,
                `*Precio c/u:* ${priceLabel}`,
                `*Total estimado:* ${totalPrice}`
            ];

            // Resolve flavors
            const f1 = data.flavor1 || data.flavor; // fallbacks to name="flavor" if it exists
            if (f1 && f1 !== 'No aplica') {
                let fText = f1;
                if (data.flavor2) fText += `, ${data.flavor2}`;
                if (data.flavor3) fText += `, ${data.flavor3}`;
                lines.push(`*Sabor(es):* ${fText}`);
            }

            lines.push(
                ``,
                `*Datos del Cliente:*`,
                `*Nombre:* ${data.name}`,
                `*Teléfono:* ${(document.getElementById('country-code') ? document.getElementById('country-code').textContent.trim() : '+57')} ${data.phone || 'No indicado'}`,
                `*Identificación:* ${data.identification || 'No indicado'}`,
                `*País/Región:* ${data.country || 'No indicado'}`,
                `*Dirección:* ${data.address}`,
                ``,
                `_Enviado desde StayFit.co — ${new Date().toLocaleDateString('es-CO')}_`
            );

            const message = lines.join('\n');
            const waNumber = '573103296863';
            const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;

            window.location.href = waUrl;
        });
    }

    // Wholesale Checkou/Request
    if (wholesaleForm) {
        wholesaleForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const data = Object.fromEntries(new FormData(this).entries());
            
            const lines = [
                `🤝 *SOLICITUD MAYORISTA STAYFIT*`,
                ``,
                `*Nombre/Empresa:* ${data.name}`,
                `*País/Región:* ${data.country || 'No indicado'}`,
                `*Ciudad:* ${data.city}`,
                `*Teléfono:* ${(document.getElementById('ws-country-code') ? document.getElementById('ws-country-code').textContent.trim() : '+57')} ${data.phone}`,
                `*Interés:* ${data.interest}`,
                ``,
                `_Quiero recibir más información acerca de los planes mayoristas._`
            ];
            
            const message = lines.join('\n');
            const waNumber = '573103296863';
            const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;
            
            window.location.href = waUrl;
        });
    }

});
