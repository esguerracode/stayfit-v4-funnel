/**
 * ui-engine: handles modals, sliders and visual effects.
 */
export const UI = {
    // Reveal animations using IntersectionObserver
    initReveal() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    },

    // Modal Control
    modal: {
        open(modalId, onOpen = null) {
            const modal = document.getElementById(modalId);
            if (!modal) return;
            
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            setTimeout(() => { modal.classList.add('active'); }, 10);
            
            if (onOpen) onOpen(modal);
        },

        close(modalId) {
            const modal = document.getElementById(modalId);
            if (!modal) return;
            
            modal.classList.remove('active');
            document.body.style.overflow = '';
            setTimeout(() => { modal.style.display = 'none'; }, 400); 
        }
    },

    // Focus Trap for Accessibility
    trapFocus(element) {
        const focusableSelectors = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
        const focusableElements = element.querySelectorAll(focusableSelectors);
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];

        element.addEventListener('keydown', (e) => {
            if (e.key !== 'Tab') return;
            if (e.shiftKey) { 
                if (document.activeElement === firstFocusable) {
                    lastFocusable.focus();
                    e.preventDefault();
                }
            } else { 
                if (document.activeElement === lastFocusable) {
                    firstFocusable.focus();
                    e.preventDefault();
                }
            }
        });
    }
};
