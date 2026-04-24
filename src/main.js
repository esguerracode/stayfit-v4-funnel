import { Attribution } from './modules/attribution.js';
import { Billing }     from './modules/billing.js';
import { UI }          from './modules/ui-engine.js';
import { Sliders }     from './modules/sliders.js';
import { Loader }      from './modules/loader.js';
import { StorageWrapper } from './modules/storage.js';
import { WhatsApp }    from './modules/whatsapp.js';
import { Animations }  from './modules/animations.js';
import { CheckoutEngine } from './modules/checkout-engine.js';

/**
 * StayFit Main Application (ESM Orchestration)
 * 
 * Boot order:
 *   1. Analytics / attribution
 *   2. Currency detection & DOM update
 *   3. UI reveal animations + page loader
 *   4. WhatsApp CTA hydration (static hrefs)
 *   5. High-conversion animations (scroll, parallax, micro-interactions)
 *   6. Flavor slider init
 *   7. Global event delegation
 */
document.addEventListener('DOMContentLoaded', () => {
    // ── 1. Attribution ────────────────────────────────────────────────────
    Attribution.init();

    // ── 2. Currency Detection ─────────────────────────────────────────────
    Billing.autoDetectCurrency();

    // ── 3. UI Animations & Loader ─────────────────────────────────────────
    UI.initReveal();
    Loader.init();

    // ── 4. High-Conversion Animations ────────────────────────────────────
    Animations.init();

    // ── 5. WhatsApp CTA Hydration ─────────────────────────────────────────
    // Writes the correct bot-trigger message into every CTA href on the page.
    // The Tea CTA starts with "Naranja" (default slide index 0).
    WhatsApp.initAllCtas();

    // ── 5. Sliders ───────────────────────────────────────────────────────
    if (document.getElementById('flavor-slider-tea')) {
        Sliders.initFlavorSlider(
            'flavor-slider-tea',
            document.querySelector('.flavor-dots'),
            document.getElementById('flavor-tabs-tea'),
            (flavorName) => WhatsApp.updateTeaFlavor(flavorName),
        );
    }

    if (document.getElementById('testimonial-track')) {
        Sliders.initTestimonialSlider('testimonial-track', 'testi-progress-bars', 3000);
    }

    // ── 6. Checkout Logic ────────────────────────────────────────────────
    CheckoutEngine.init();

    // ── 7. Global Event Delegation ────────────────────────────────────────
    initGlobalDelegation();

    // ── 8. Direct Bindings (Critical Fix) ─────────────────────────────────
    const currencyToggle = document.getElementById('currency-toggle');
    if (currencyToggle) {
        currencyToggle.addEventListener('click', (e) => {
            e.preventDefault();
            const current = Billing.getCurrency();
            const next    = current === 'COP' ? 'USD' : 'COP';
            console.log(`StayFit: Actionable Toggle Triggered -> ${next}`);
            Billing.setCurrency(next);
        });
    }
});

function initGlobalDelegation() {
    document.addEventListener('click', (e) => {
        // Newsletter Feedback
        const newsForm = e.target.closest('#newsletter-form');
        if (newsForm && e.type === 'submit') { // delegation for submit might be tricky, let's bind it specifically
        }
    });

    const newsletter = document.getElementById('newsletter-form');
    if (newsletter) {
        newsletter.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = newsletter.querySelector('button');
            const input = newsletter.querySelector('input');
            btn.disabled = true;
            btn.innerText = '✨';
            input.value = '¡Bienvenida al club!';
            input.disabled = true;
        });
    }

    // Global Error Boundary (Safe UI)
    window.addEventListener('error', (e) => {
        console.warn('StayFit [ErrorBoundary]:', e.error);
    });
    window.addEventListener('unhandledrejection', (e) => {
        console.warn('StayFit [ErrorBoundary Promise]:', e.reason);
    });
}
