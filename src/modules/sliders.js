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
    },

    initTestimonialSlider(trackId, progressContainerId, duration = 6000) {
        const track = document.getElementById(trackId);
        const progressContainer = document.getElementById(progressContainerId);
        if (!track || !progressContainer) return;

        const slides = Array.from(track.querySelectorAll('.testi-slide'));
        const slideCount = slides.length;
        let currentIndex = 0;
        let timer = null;
        let isDragging = false;
        let startX = 0;
        let dragOffset = 0; // -1 to 1

        // Create progress bars
        progressContainer.innerHTML = '';
        slides.forEach(() => {
            const bar = document.createElement('div');
            bar.className = 'testi-progress-bar';
            bar.innerHTML = '<div class="testi-progress-fill"></div>';
            progressContainer.appendChild(bar);
        });
        const fills = progressContainer.querySelectorAll('.testi-progress-fill');

        const updateVisuals = (animate = false) => {
            slides.forEach((slide, i) => {
                let offset = (i - currentIndex) + dragOffset;
                
                if (animate) {
                    slide.style.transition = 'transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.6s ease, filter 0.6s ease';
                } else {
                    slide.style.transition = 'none';
                }

                if (offset === 0) {
                    // Active centered
                    slide.style.transform = 'translateX(0%) scale(1) rotateY(0deg)';
                    slide.style.opacity = '1';
                    slide.style.zIndex = '10';
                    slide.style.filter = 'blur(0px)';
                    slide.style.pointerEvents = 'auto';
                } else if (offset < 0) {
                    // Past slides (left stack)
                    const clamped = Math.max(offset, -1);
                    slide.style.transform = `translateX(${clamped * 50}%) scale(${1 + clamped * 0.15}) rotateY(${clamped * -15}deg)`;
                    slide.style.opacity = String(1 + clamped);
                    slide.style.zIndex = '5';
                    slide.style.filter = `blur(${Math.abs(clamped) * 4}px)`;
                    slide.style.pointerEvents = 'none';
                } else {
                    // Upcoming slides (right stack)
                    const clamped = Math.min(offset, 3);
                    slide.style.transform = `translateX(${clamped * 85}%) scale(${1 - clamped * 0.05}) rotateY(${clamped * -10}deg)`;
                    slide.style.opacity = clamped > 2 ? '0' : String(1 - clamped * 0.2);
                    slide.style.zIndex = String(Math.floor(10 - clamped));
                    slide.style.filter = `blur(${clamped * 2}px)`;
                    slide.style.pointerEvents = 'none';
                }
            });
        };

        const updateState = (animate = true) => {
            updateVisuals(animate);
            
            // Progress bars
            fills.forEach((fill, i) => {
                fill.style.transition = 'none';
                fill.style.width = i < currentIndex ? '100%' : '0%';
            });

            if (!isDragging) {
                setTimeout(() => {
                    const currentFill = fills[currentIndex];
                    if (currentFill) {
                        currentFill.style.transition = `width ${duration}ms linear`;
                        currentFill.style.width = '100%';
                    }
                }, 50);
            }

            // Video handling
            slides.forEach((slide, i) => {
                const vid = slide.querySelector('video');
                if (vid) {
                    if (i === currentIndex && !isDragging) {
                        vid.currentTime = 0;
                        vid.play().catch(() => {});
                    } else {
                        vid.pause();
                    }
                }
            });
        };

        const resetTimer = () => {
            if (timer) clearInterval(timer);
            if (!isDragging) {
                timer = setInterval(nextSlide, duration);
            }
        };

        const nextSlide = () => {
            // Loop back to 0 if at the end to make it a continuous loop!
            currentIndex = (currentIndex + 1) % slideCount;
            dragOffset = 0;
            updateState(true);
            resetTimer();
        };

        const prevSlide = () => {
            // Loop back to end if at the beginning
            currentIndex = (currentIndex - 1 + slideCount) % slideCount;
            dragOffset = 0;
            updateState(true);
            resetTimer();
        };

        // Touch & Drag events
        const onDragStart = (x) => {
            isDragging = true;
            startX = x;
            if (timer) clearInterval(timer);
            
            // Pause current video during drag
            const vid = slides[currentIndex].querySelector('video');
            if (vid) vid.pause();
            
            fills[currentIndex].style.transition = 'none';
            fills[currentIndex].style.width = '0%';
        };

        const onDragMove = (x) => {
            if (!isDragging) return;
            const diff = x - startX;
            const trackWidth = track.offsetWidth || 300;
            dragOffset = diff / trackWidth;
            
            // If dragging would go out of bounds, allow it but we have wrap-around logic now.
            // Let's implement wrap around logic for visuals or just resist.
            // Since nextSlide/prevSlide wraps around, the visuals should resist slightly.
            if (currentIndex === 0 && dragOffset > 0) dragOffset *= 0.4;
            if (currentIndex === slideCount - 1 && dragOffset < 0) dragOffset *= 0.4;
            
            updateVisuals(false);
        };

        const onDragEnd = () => {
            if (!isDragging) return;
            isDragging = false;
            
            if (dragOffset < -0.15) {
                if (currentIndex === slideCount - 1) {
                    // Snap back if at end and pulling left (resistance)
                    dragOffset = 0;
                    updateState(true);
                    resetTimer();
                } else {
                    nextSlide();
                }
            } else if (dragOffset > 0.15) {
                if (currentIndex === 0) {
                    // Snap back if at start and pulling right (resistance)
                    dragOffset = 0;
                    updateState(true);
                    resetTimer();
                } else {
                    prevSlide();
                }
            } else {
                // Snap back
                dragOffset = 0;
                updateState(true);
                resetTimer();
            }
        };

        track.addEventListener('touchstart', (e) => onDragStart(e.touches[0].clientX), { passive: true });
        track.addEventListener('touchmove', (e) => onDragMove(e.touches[0].clientX), { passive: true });
        track.addEventListener('touchend', () => onDragEnd());

        track.addEventListener('mousedown', (e) => {
            e.preventDefault();
            onDragStart(e.clientX);
            track.style.cursor = 'grabbing';
        });
        
        window.addEventListener('mousemove', (e) => {
            if (isDragging) onDragMove(e.clientX);
        });
        
        window.addEventListener('mouseup', () => {
            if (isDragging) {
                track.style.cursor = 'grab';
                onDragEnd();
            }
        });

        // Click to skip functionality on sides
        track.addEventListener('click', (e) => {
            if (Math.abs(dragOffset) > 0.05) return; // Prevent click if dragged
            const rect = track.getBoundingClientRect();
            const x = e.clientX - rect.left;
            if (x > rect.width * 0.7) {
                nextSlide();
            } else if (x < rect.width * 0.3) {
                prevSlide();
            }
        });

        // Initialize
        track.style.cursor = 'grab';
        updateState(true);
        resetTimer();
    }
};
