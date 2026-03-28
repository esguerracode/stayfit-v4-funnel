/**
 * loader: handles sophisticated page loading states.
 */
export const Loader = {
    init() {
        const progressBar = document.getElementById('pl-progress');
        const loader = document.getElementById('page-loader');
        
        if (!progressBar || !loader) return;

        // "Smart" progress
        let progress = 0;
        const interval = setInterval(() => {
            if (progress >= 90) {
                clearInterval(interval);
            } else {
                progress += Math.random() * 15;
                progressBar.style.width = Math.min(progress, 90) + '%';
            }
        }, 100);

        window.addEventListener('load', () => {
            clearInterval(interval);
            progressBar.style.width = '100%';
            setTimeout(() => {
                loader.classList.add('loaded');
                document.body.classList.remove('is-loading');
            }, 500);
        });
    }
};
