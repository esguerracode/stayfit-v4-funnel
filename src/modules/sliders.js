/**
 * sliders: handles flavor selection and visual transitions.
 * @param {string} sliderId - ID of the slider container element
 * @param {Element|null} dotsContainer - dots nav element
 * @param {Element|null} tabsContainer - tabs element
 * @param {Function|null} onFlavorChange - callback(flavorName: string) fired on every slide change
 */
export const Sliders = {
    initFlavorSlider(sliderId, dotsContainer, tabsContainer, onFlavorChange = null) {
        const slider = document.getElementById(sliderId);
        if (!slider) return;

        const slides = slider.querySelectorAll('.flavor-slide');
        const dots = dotsContainer ? dotsContainer.querySelectorAll('.dot') : [];
        const tabs = tabsContainer ? tabsContainer.querySelectorAll('.tab-item') : [];

        let currentIndex = 0;
        let startX = 0;
        let isDragging = false;

        const updateSlider = () => {
            slider.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
            slider.style.transform = `translateX(-${currentIndex * 100}%)`;
            
            slides.forEach((s, i) => s.classList.toggle('active', i === currentIndex));
            dots.forEach((d, i) => d.classList.toggle('active', i === currentIndex));
            tabs.forEach((t, i) => t.classList.toggle('active', i === currentIndex));
            
            const flavor = slides[currentIndex].getAttribute('data-flavor');
            
            // Notify orchestrator of flavor change so CTA href can be updated
            if (typeof onFlavorChange === 'function') {
                onFlavorChange(flavor);
            }

            const activeTab = tabs[currentIndex];
            if (activeTab && activeTab.parentElement && activeTab.parentElement.parentElement) {
                activeTab.parentElement.parentElement.scrollTo({
                    left: activeTab.offsetLeft - 20,
                    behavior: 'smooth'
                });
            }
        };

        const nextSlide = () => {
            if (currentIndex < slides.length - 1) currentIndex++;
            updateSlider();
        };

        const prevSlide = () => {
            if (currentIndex > 0) currentIndex--;
            updateSlider();
        };

        dots.forEach((dot, i) => {
            dot.addEventListener('click', () => {
                currentIndex = i;
                updateSlider();
            });
        });

        tabs.forEach((tab, i) => {
            tab.addEventListener('click', () => {
                currentIndex = i;
                updateSlider();
            });
        });

        slider.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
            slider.style.transition = 'none';
        }, { passive: true });

        slider.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            const diff = e.touches[0].clientX - startX;
            let translate = -(currentIndex * slider.offsetWidth) + diff;
            if (currentIndex === 0 && diff > 0) translate = diff * 0.3;
            if (currentIndex === slides.length - 1 && diff < 0) translate = -(currentIndex * slider.offsetWidth) + diff * 0.3;
            slider.style.transform = `translateX(${translate}px)`;
        }, { passive: true });

        slider.addEventListener('touchend', (e) => {
            isDragging = false;
            const diff = startX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) nextSlide(); else prevSlide();
            } else updateSlider();
        });
        
        slider.addEventListener('mousedown', (e) => {
            startX = e.clientX;
            isDragging = true;
            slider.style.transition = 'none';
            slider.style.cursor = 'grabbing';
            e.preventDefault();
        });

        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const diff = e.clientX - startX;
            let translate = -(currentIndex * slider.offsetWidth) + diff;
            if (currentIndex === 0 && diff > 0) translate = diff * 0.3;
            if (currentIndex === slides.length - 1 && diff < 0) translate = -(currentIndex * slider.offsetWidth) + diff * 0.3;
            slider.style.transform = `translateX(${translate}px)`;
            e.preventDefault();
        });

        window.addEventListener('mouseup', (e) => {
            if (!isDragging) return;
            isDragging = false;
            slider.style.cursor = 'grab';
            const diff = startX - e.clientX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) nextSlide(); else prevSlide();
            } else updateSlider();
        });
        
        // initialize styles
        updateSlider();
    }
};
