/**
 * StayFit Conversion & Tracking System v1.1
 * Centraliza el tracking de UTM, automatización de WhatsApp y utilidades de UI.
 */

(function() {
    // 1. UTM Tracking
    function initUTM() {
        const urlParams = new URLSearchParams(window.location.search);
        const utmParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid'];
        
        utmParams.forEach(param => {
            const value = urlParams.get(param);
            if (value) {
                localStorage.setItem('sf_' + param, value);
            }
        });

        if (!localStorage.getItem('sf_first_visit')) {
            localStorage.setItem('sf_first_visit', new Date().toISOString());
        }
    }

    function getUTMSuffix() {
        const source = localStorage.getItem('sf_utm_source') || 'organico';
        const campaign = localStorage.getItem('sf_utm_campaign') || 'directo';
        const medium = localStorage.getItem('sf_utm_medium') || '';
        
        let suffix = `\n\n[Atribución: ${source}${medium ? '/' + medium : ''} - ${campaign}]`;
        return suffix;
    }

    // 2. Currency Conversion System
    const EXCHANGE_RATE = 4000; // Fixed rate for simplicity (1 USD = 4000 COP)
    
    function initCurrency() {
        const savedCurrency = localStorage.getItem('sf_currency');
        if (savedCurrency) {
            setCurrency(savedCurrency);
        } else {
            // Auto-detect by timezone as a hint for Colombia
            const isColombia = Intl.DateTimeFormat().resolvedOptions().timeZone === 'America/Bogota';
            setCurrency(isColombia ? 'COP' : 'USD');
        }
        
        // Setup toggle button if it exists
        const toggle = document.getElementById('currency-toggle');
        if (toggle) {
            toggle.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('StayFit: Currency toggle clicked');
                const current = localStorage.getItem('sf_currency') || 'COP';
                setCurrency(current === 'COP' ? 'USD' : 'COP');
            });
        }
    }

    function setCurrency(currency) {
        localStorage.setItem('sf_currency', currency);
        document.body.setAttribute('data-currency', currency);
        
        const toggle = document.getElementById('currency-toggle');
        if (toggle) {
            toggle.innerHTML = currency === 'COP' ? 'COP' : 'USD';
        }
        
        updatePrices();
        if (typeof applyWhatsAppLinks === 'function') {
            applyWhatsAppLinks();
        }
        console.log('StayFit: Currency updated to', currency);
    }

    function updatePrices() {
        const currency = localStorage.getItem('sf_currency') || 'COP';
        const formatterCOP = new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });
        const formatterUSD = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });

        document.querySelectorAll('[data-amount-cop]').forEach(el => {
            const copValue = parseInt(el.getAttribute('data-amount-cop').replace(/\./g, ''));
            const usdValue = el.getAttribute('data-amount-usd');
            
            if (currency === 'COP') {
                el.innerHTML = `${formatterCOP.format(copValue)} <small>COP</small>`;
            } else {
                el.innerHTML = `${formatterUSD.format(usdValue)} <small>USD</small>`;
            }
        });
    }

    // 3. Global WhatsApp Formatter
    window.formatStayFitWA = function(msg, regionSuffix = '') {
        const baseNumber = '573103296863';
        const utmSuffix = getUTMSuffix();
        const currency = localStorage.getItem('sf_currency') || 'COP';
        
        // Add context about currency preference to the message
        const fullMsg = (regionSuffix ? `🌍 *Región:* ${regionSuffix}\n` : '') + 
                        `💳 *Preferencia:* ${currency}\n` + msg + utmSuffix;
        
        return `https://wa.me/${baseNumber}?text=${encodeURIComponent(fullMsg)}`;
    };

    // 4. Inject Global Sticky CTA CSS
    function injectGlobalStyles() {
        if (document.getElementById('stayfit-conversion-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'stayfit-conversion-styles';
        style.innerHTML = `
            .sticky-cta-mobile {
                display: none;
                position: fixed;
                bottom: 0;
                left: 0;
                width: 100vw;
                max-width: 100%;
                box-sizing: border-box;
                background: var(--glass-bg, rgba(255,255,255,0.8));
                backdrop-filter: var(--glass-blur, blur(10px));
                -webkit-backdrop-filter: var(--glass-blur, blur(10px));
                padding: 10px 16px;
                border-top: 1px solid var(--border, rgba(0,0,0,0.1));
                z-index: 9999;
                justify-content: space-between;
                align-items: center;
                gap: 8px;
                box-shadow: 0 -4px 20px rgba(0,0,0,0.05);
            }
            @media (max-width: 768px) {
                .sticky-cta-mobile { display: flex !important; }
                .sticky-cta-mobile .btn { padding: 8px 16px !important; font-size: 0.8rem !important; white-space: nowrap; flex-shrink: 0; }
                .sticky-cta-mobile > div { flex-shrink: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
                body { padding-bottom: 80px !important; }
            }
            @keyframes pulse-red {
                0% { box-shadow: 0 0 0 0 rgba(255, 45, 85, 0.4); }
                70% { box-shadow: 0 0 0 10px rgba(255, 45, 85, 0); }
                100% { box-shadow: 0 0 0 0 rgba(255, 45, 85, 0); }
            }
            .btn-pulse { animation: pulse-red 2.5s infinite; }
            #currency-toggle { cursor: pointer; transition: all 0.3s ease; }
            #currency-toggle:hover { transform: scale(1.05); }
        `;
        document.head.appendChild(style);
    }

    // 6. Theme Initialization
    function initTheme() {
        const savedTheme = localStorage.getItem('stayfit_theme') || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-mode');
            document.body.classList.remove('light-mode');
        } else {
            document.body.classList.add('light-mode');
            document.body.classList.remove('dark-mode');
        }
    }

    // 7. Apply WhatsApp links globally
    function applyWhatsAppLinks() {
        const links = document.querySelectorAll('.whatsapp-link');
        const region = localStorage.getItem('stayfit_region') || (Intl.DateTimeFormat().resolvedOptions().timeZone === 'America/Bogota' ? 'CO' : 'US');
        const regionName = region === 'CO' ? 'Colombia 🇨🇴' : 'Internacional 🌎';
        
        links.forEach(link => {
            const msg = link.getAttribute('data-msg') || 'Hola, quiero más información';
            link.href = window.formatStayFitWA(msg, regionName);
        });
    }

    // --- Flavor Slider Logic (Tea Card) ---
    function initFlavorSlider() {
        const wrap = document.querySelector('.flavor-slider-wrap');
        const slider = document.getElementById('flavor-slider-tea');
        const slides = document.querySelectorAll('.flavor-slide');
        const dots = document.querySelectorAll('.dot');
        const tabs = document.querySelectorAll('.tab-item');
        
        if (!slider) return;

        let currentIndex = 0;
        let startX = 0;
        let isDragging = false;
        let currentTranslate = 0;
        let prevTranslate = 0;

        function updateSlider() {
            slider.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
            slider.style.transform = `translateX(-${currentIndex * 100}%)`;
            
            // Sync UI
            dots.forEach((d, i) => d.classList.toggle('active', i === currentIndex));
            tabs.forEach((t, i) => t.classList.toggle('active', i === currentIndex));
            
            // Scroll tabs into view
            const activeTab = tabs[currentIndex];
            if (activeTab) {
                activeTab.parentElement.parentElement.scrollTo({
                    left: activeTab.offsetLeft - 20,
                    behavior: 'smooth'
                });
            }
            
            // Update hidden input if modal is open or about to open
            const hiddenFlavor = document.getElementById('flavor-hidden-input');
            if (hiddenFlavor) {
                hiddenFlavor.value = slides[currentIndex].getAttribute('data-flavor');
            }
        }

        function nextSlide() {
            if (currentIndex < slides.length - 1) currentIndex++;
            updateSlider();
        }

        function prevSlide() {
            if (currentIndex > 0) currentIndex--;
            updateSlider();
        }

        // Touch Handlers
        slider.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
            slider.style.transition = 'none';
        }, { passive: true });

        slider.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            const currentX = e.touches[0].clientX;
            const diff = currentX - startX;
            const translate = -(currentIndex * slider.offsetWidth) + diff;
            slider.style.transform = `translateX(${translate}px)`;
        }, { passive: true });

        slider.addEventListener('touchend', (e) => {
            isDragging = false;
            const endX = e.changedTouches[0].clientX;
            const diff = startX - endX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) nextSlide();
                else prevSlide();
            } else {
                updateSlider();
            }
        }, { passive: true });

        // Mouse Handlers (for desktop "slide")
        slider.addEventListener('mousedown', (e) => {
            startX = e.clientX;
            isDragging = true;
            slider.style.transition = 'none';
            slider.classList.add('grabbing');
        });

        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const currentX = e.clientX;
            const diff = currentX - startX;
            const translate = -(currentIndex * slider.offsetWidth) + diff;
            slider.style.transform = `translateX(${translate}px)`;
        });

        window.addEventListener('mouseup', (e) => {
            if (!isDragging) return;
            isDragging = false;
            slider.classList.remove('grabbing');
            const endX = e.clientX;
            const diff = startX - endX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) nextSlide();
                else prevSlide();
            } else {
                updateSlider();
            }
        });

        // Click handlers for navigation
        dots.forEach(dot => {
            dot.addEventListener('click', () => {
                currentIndex = parseInt(dot.getAttribute('data-index'));
                updateSlider();
            });
        });

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                currentIndex = parseInt(tab.getAttribute('data-index'));
                updateSlider();
            });
        });
    }

    // --- Bootstrap ---
    function bootstrap() {
        injectGlobalStyles();
        initUTM();
        initTheme();
        initCurrency();
        applyWhatsAppLinks();
        initFlavorSlider(); // Initialize slider

        window.addEventListener('regionChanged', () => applyWhatsAppLinks());
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bootstrap);
    } else {
        bootstrap();
    }
})();
