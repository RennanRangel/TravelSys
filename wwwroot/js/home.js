document.addEventListener('DOMContentLoaded', () => {
    
    const DOM = {
        btnShowPlaces: document.querySelector('.btn-show-places'),
        bookBtns: document.querySelectorAll('.btn-book, .btn-book-white'),
        newsletterForm: document.querySelector('.newsletter-form')
    };


    DOM.btnShowPlaces?.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = 'hotel-listing.html';
    });

    DOM.bookBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            window.location.href = 'flight-booking.html';
        });
    });


    DOM.newsletterForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = DOM.newsletterForm.querySelector('input')?.value;
        if (email) {
            alert(`Obrigado: ${email}`);
            DOM.newsletterForm.reset();
        }
    });

    const heroImg = document.getElementById('home-hero-img');
    if (heroImg) {
        const heroImages = [
            '/images/Rectangle 31.png',
            '/images/Rectangle 3.png',
            '/images/Sydney.jpg'
        ];
        let heroIdx = 0;
        
        heroImg.style.transition = 'opacity 0.8s ease-in-out';
        
        function rotateHeroBg() {
            heroIdx = (heroIdx + 1) % heroImages.length;
            
            heroImg.style.opacity = 0;
            
            setTimeout(() => {
                heroImg.src = heroImages[heroIdx];
                // Fade in
                heroImg.style.opacity = 1;
            }, 800);
        }
        
        heroImg.style.opacity = 1;
        
        setInterval(rotateHeroBg, 5000);
        setTimeout(rotateHeroBg, 3000);
    }
});
