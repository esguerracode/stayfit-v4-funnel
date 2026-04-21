/**
 * loader: handles sophisticated page loading states.
 * Following UI/UX Pro Max guidelines:
 * - Progressive loading for operations >300ms
 * - Motion conveys meaning
 * - Exit faster than enter (60-70% of enter duration)
 * - Reduced motion support
 */
export const Loader = {
    init() {
        const progressBar = document.getElementById('pl-progress');
        const percentageText = document.getElementById('pl-percentage');
        const loader = document.getElementById('page-loader');
        
        if (!progressBar || !loader) return;

        // Check for reduced motion preference
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        // Multi-phase loading for better UX (progressive disclosure)
        const phases = [
            { start: 0, end: 20, duration: 800, label: 'Cargando recursos...' },
            { start: 20, end: 50, duration: 1000, label: 'Preparando experiencia...' },
            { start: 50, end: 80, duration: 1000, label: 'Casi listo...' },
            { start: 80, end: 98, duration: 800, label: 'Finalizando...' }
        ];
        
        let currentPhase = 0;
        let phaseStartTime = Date.now();
        
        const updateProgress = () => {
            const elapsed = Date.now() - phaseStartTime;
            const phase = phases[currentPhase];
            
            // Calculate progress within current phase
            const phaseProgress = Math.min(elapsed / phase.duration, 1);
            
            // Easing: ease-out cubic for natural feel (UI/UX Pro Max)
            const easedProgress = 1 - Math.pow(1 - phaseProgress, 3);
            
            // Interpolate between phase boundaries
            const progress = phase.start + (phase.end - phase.start) * easedProgress;
            
            progressBar.style.width = progress + '%';
            
            if (percentageText) {
                percentageText.textContent = Math.floor(progress) + '%';
            }
            
            // Move to next phase or keep loading
            if (phaseProgress >= 1) {
                if (currentPhase < phases.length - 1) {
                    currentPhase++;
                    phaseStartTime = Date.now();
                } else if (progress < 98) {
                    // Force continue if not complete
                }
            }
            
            if (prefersReducedMotion) {
                // Skip to end quickly for reduced motion
                progressBar.style.width = '100%';
                if (percentageText) percentageText.textContent = '100%';
                return;
            }
            
            if (progress < 98) {
                requestAnimationFrame(updateProgress);
            }
        };
        
        if (prefersReducedMotion) {
            progressBar.style.width = '100%';
            if (percentageText) percentageText.textContent = '100%';
        } else {
            requestAnimationFrame(updateProgress);
        }

        window.addEventListener('load', () => {
            // Complete to 100%
            progressBar.style.transition = 'width 0.3s ease-out';
            progressBar.style.width = '100%';
            if (percentageText) percentageText.textContent = '100%';
            
            // Exit animation: faster than enter (UI/UX Pro Max rule)
            // Enter was ~4s, so exit should be ~2.4s (60%)
            setTimeout(() => {
                loader.style.transition = 'opacity 0.4s ease-out, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
                loader.style.opacity = '0';
                loader.style.transform = 'translateY(-100%)';
                document.body.classList.remove('is-loading');
            }, 400);
        });
    }
};
