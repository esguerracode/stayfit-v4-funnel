/**
 * Animation Engine: High-conversion animations (Web Interface Guidelines Compliant)
 * - Only animate transform/opacity (compositor-friendly)
 * - Respect prefers-reduced-motion
 * - No transition: all - list properties explicitly
 */
export const Animations = {
    init() {
        // Essential: Add js-enabled class if not already there
        document.documentElement.classList.add('js-enabled');

        if (this.shouldReduceMotion()) {
            this.revealAll();
            return;
        }
        
        this.initStickyHeader();
        this.initScrollReveal();
        this.initMicroInteractions();
        this.initCountUpAnimations();

        // Safety: If after 2 seconds elements are still hidden, force reveal
        setTimeout(() => this.revealAll(), 2000);
    },

    revealAll() {
        document.querySelectorAll('.reveal').forEach(el => el.classList.add('active'));
    },

    shouldReduceMotion() {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    },

    // Sticky state for header & footer CTA
    initStickyHeader() {
        const handleScroll = () => {
            if (window.scrollY > 300) {
                document.body.classList.add('is-scrolled');
            } else {
                document.body.classList.remove('is-scrolled');
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
    },

    initScrollReveal() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        document.querySelectorAll('.reveal').forEach(el => {
            observer.observe(el);
        });


    // Micro-interacciones para CTAs
    initMicroInteractions() {
        // Efecto pulse mejorado para CTAs principales
        document.querySelectorAll('.btn-pulse').forEach(btn => {
            btn.style.animation = 'pulse-glow 2s infinite';
        });

        // Efectos hover en product cards
        document.querySelectorAll('.product-card, .combo-card').forEach(card => {
            card.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
        });

        // Contador animado para números
        document.querySelectorAll('.sp-number').forEach(el => {
            const text = el.textContent;
            if (text.includes('+') || text.includes('.')) {
                el.dataset.count = text;
            }
        });
    },

    // Animación de números (count up)
    initCountUpAnimations() {
        const counters = document.querySelectorAll('.sp-number[data-count]');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                    this.animateCounter(entry.target);
                    entry.target.classList.add('counted');
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => observer.observe(counter));
    },

    animateCounter(element) {
        const target = element.dataset.count.replace(/[+,.]/g, '');
        const suffix = element.dataset.count.match(/[+,.]/)?.[0] || '';
        const duration = 2000;
        const steps = 60;
        const increment = parseInt(target) / steps;
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= parseInt(target)) {
                element.textContent = element.dataset.count;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current) + suffix;
            }
        }, duration / steps);
    }
};
