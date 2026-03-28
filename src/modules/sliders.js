/**
 * sliders: handles flavor selection and visual transitions.
 */
export const Sliders = {
    initFlavorSlider(sliderId, dotsContainer, tabsContainer) {
        const slider = document.getElementById(sliderId);
        if (!slider) return;

        const slides = slider.querySelectorAll('.flavor-slide');
        const dots = dotsContainer ? dotsContainer.querySelectorAll('.dot') : [];
        const tabs = tabsContainer ? tabsContainer.querySelectorAll('.tab-item') : [];

        const goToSlide = (index) => {
            slides.forEach((s, i) => s.classList.toggle('active', i === index));
            dots.forEach((d, i) => d.classList.toggle('active', i === index));
            tabs.forEach((t, i) => t.classList.toggle('active', i === index));
            
            // Sync with hidden input if in modal context
            const flavor = slides[index].getAttribute('data-flavor');
            const flavorInput = document.getElementById('flavor-hidden-input');
            if (flavorInput) flavorInput.value = flavor;
        };

        dots.forEach((dot, i) => {
            dot.onclick = () => goToSlide(i);
        });

        tabs.forEach((tab, i) => {
            tab.onclick = () => goToSlide(i);
        });
    }
};
