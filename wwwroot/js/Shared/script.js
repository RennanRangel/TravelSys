document.addEventListener('DOMContentLoaded', () => {
    
    const DOM = {
        tabBtns: document.querySelectorAll('.tab-btn'),
        flightsForm: document.querySelector('#flights-form'),
        staysForm: document.querySelector('#stays-form'),
        newsletterForm: document.querySelector('.newsletter-form'),
        header: document.querySelector('.header'),
        featureCards: document.querySelectorAll('.feature-card'),
        destinationCards: document.querySelectorAll('.destination-card'),
        animatedElements: document.querySelectorAll('.destination-card, .review-card, .feature-card')
    };


    DOM.tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const type = btn.dataset.tab;
            DOM.tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            if (DOM.flightsForm) DOM.flightsForm.style.display = type === 'flights' ? 'flex' : 'none';
            if (DOM.staysForm) DOM.staysForm.style.display = type === 'stays' ? 'flex' : 'none';
        });
    });


    DOM.newsletterForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = DOM.newsletterForm.querySelector('input[type="email"]')?.value;
        if (email) {
            alert(`Obrigado por se inscrever, ${email}!`);
            DOM.newsletterForm.reset();
        }
    });


    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    DOM.animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });


    window.addEventListener('scroll', () => {
        if (!DOM.header) return;
        const isScrolled = window.pageYOffset > 100;
        DOM.header.style.background = isScrolled ? 'rgba(255, 255, 255, 0.95)' : 'transparent';
        DOM.header.style.backdropFilter = isScrolled ? 'blur(10px)' : 'none';
        DOM.header.style.boxShadow = isScrolled ? '0 2px 10px rgba(0, 0, 0, 0.1)' : 'none';
    });


    DOM.featureCards.forEach(card => {
        card.querySelector('.btn-secondary')?.addEventListener('click', (e) => {
            e.stopPropagation();
            const isFlight = card.classList.contains('flights-card');
            window.location.href = isFlight ? 'flights-listing.html' : 'hotel-listing.html';
        });
    });

    DOM.destinationCards.forEach(card => {
        card.addEventListener('click', () => {
            const name = card.querySelector('h3')?.textContent;
            if (name) alert(`Explorando ${name}...`);
        });
    });

    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});
