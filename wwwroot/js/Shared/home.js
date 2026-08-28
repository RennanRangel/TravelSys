document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================================================
    // 1. Heart Button Like Toggle (Trip to Greece card)
    // ==========================================================================
    const heartBtn = document.getElementById('greece-heart-btn');
    if (heartBtn) {
        heartBtn.addEventListener('click', () => {
            heartBtn.classList.toggle('far');
            heartBtn.classList.toggle('fas');
            heartBtn.classList.toggle('liked');
        });
    }

    // ==========================================================================
    // 2. Play Demo Video Lightbox (Bootstrap Modal)
    // ==========================================================================
    const btnPlayDemo = document.getElementById('btn-play-demo');
    const videoModalEl = document.getElementById('videoModal');
    const videoIframe = document.getElementById('videoIframe');
    
    if (btnPlayDemo && videoModalEl && videoIframe) {
        const videoUrl = 'https://www.youtube.com/embed/56E6WTh1StE?autoplay=1&rel=0';
        
        // Use Bootstrap modal instance
        const bsModal = new bootstrap.Modal(videoModalEl);
        
        btnPlayDemo.addEventListener('click', () => {
            videoIframe.src = videoUrl;
            bsModal.show();
        });
        
        // Stop playing when modal is closed
        videoModalEl.addEventListener('hidden.bs.modal', () => {
            videoIframe.src = '';
        });
    }

    // ==========================================================================
    // 3. Testimonial Stack Slider
    // ==========================================================================
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.testimonial-dots .dot');
    const btnPrev = document.getElementById('testimonial-prev-btn');
    const btnNext = document.getElementById('testimonial-next-btn');
    
    let activeIndex = 0;
    const totalCards = testimonialCards.length;

    function showTestimonial(index) {
        if (totalCards === 0) return;
        
        // Normalize index
        activeIndex = (index + totalCards) % totalCards;
        
        testimonialCards.forEach((card, i) => {
            card.classList.remove('active', 'next');
            
            if (i === activeIndex) {
                card.classList.add('active');
            } else if (i === (activeIndex + 1) % totalCards) {
                card.classList.add('next');
            }
        });
        
        dots.forEach((dot, i) => {
            if (i === activeIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    if (btnNext) {
        btnNext.addEventListener('click', () => {
            showTestimonial(activeIndex + 1);
        });
    }

    if (btnPrev) {
        btnPrev.addEventListener('click', () => {
            showTestimonial(activeIndex - 1);
        });
    }

    dots.forEach((dot) => {
        dot.addEventListener('click', () => {
            const idx = parseInt(dot.getAttribute('data-index') || '0', 10);
            showTestimonial(idx);
        });
    });

    // Auto rotate testimonials every 7 seconds
    let testimonialInterval = setInterval(() => {
        showTestimonial(activeIndex + 1);
    }, 7000);

    // Pause auto-rotation on mouse enter
    const sliderContainer = document.querySelector('.testimonials-right');
    if (sliderContainer) {
        sliderContainer.addEventListener('mouseenter', () => {
            clearInterval(testimonialInterval);
        });
        sliderContainer.addEventListener('mouseleave', () => {
            testimonialInterval = setInterval(() => {
                showTestimonial(activeIndex + 1);
            }, 7000);
        });
    }

    // ==========================================================================
    // 4. Newsletter Subscribe Submit Handler
    // ==========================================================================
    const subscribeForm = document.getElementById('subscribe-form');
    if (subscribeForm) {
        subscribeForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = document.getElementById('subscribe-email');
            if (emailInput && emailInput.value) {
                alert(`Thank you for subscribing! We will send travel updates to: ${emailInput.value}`);
                subscribeForm.reset();
            }
        });
    }
});
