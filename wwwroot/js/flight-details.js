document.addEventListener('DOMContentLoaded', () => {
    
    const DOM = {
        title: document.querySelector('.title-info h1'),
        location: document.querySelector('.location-info span'),
        price: document.querySelector('.price-actions .price'),
        ratingBadge: document.querySelector('.rating-info .badge'),
        reviews: document.querySelector('.rating-info .reviews'),
        heroImage: document.querySelector('.hero-image'),
        gallery: document.querySelector('.features-gallery'),
        policies: document.querySelector('.policies-grid'),
        returnCards: document.querySelectorAll('.return-flight-card'),
        favoriteBtns: document.querySelectorAll('.btn-favorites, .btn-icon'),
        classChecks: document.querySelectorAll('.class-options input[type="checkbox"]'),
        newsletterForm: document.querySelector('.newsletter-form'),
        bookBtn: document.querySelector('.btn-book')
    };


    const updateUI = (flight) => {
        if (!flight) return;
        if (DOM.title) DOM.title.textContent = `${flight.airline} ${flight.stops === 'non stop' ? 'Voo Direto' : flight.stops}`;
        if (DOM.location) DOM.location.textContent = `${flight.from} para ${flight.to}`;
        if (DOM.price) DOM.price.textContent = `$${flight.price}`;
        if (DOM.ratingBadge) DOM.ratingBadge.textContent = flight.rating;
        if (DOM.reviews) DOM.reviews.textContent = `${flight.reviews} reviews`;
        if (DOM.heroImage && flight.mainImage) DOM.heroImage.src = flight.mainImage;

        if (DOM.gallery && flight.gallery) {
            DOM.gallery.innerHTML = flight.gallery.map(url => `<img src="${url}" alt="Recurso" onclick="window.open('${url}', '_blank')">`).join('');
        }

        if (DOM.policies && flight.policies) {
            DOM.policies.innerHTML = flight.policies.split('\n').filter(p => p.trim()).map(p => `
                <div class="policy-item"><i class="fas fa-check-circle" style="color: #8DD3BB;"></i><span>${p}</span></div>
            `).join('');
        }

        DOM.returnCards.forEach(card => {
            const name = card.querySelector('.airline-name h4');
            const logo = card.querySelector('.airline-logo-box img');
            const times = card.querySelectorAll('.time');
            if (name) name.textContent = flight.airline;
            if (logo && flight.logo) logo.src = flight.logo;
            if (times.length >= 2) {
                times[0].textContent = flight.departure;
                times[1].textContent = flight.arrival;
            }
        });
    };


    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    if (id) {
        const flights = JSON.parse(localStorage.getItem('adminFlights')) || [];
        const flight = flights.find(f => f.id === id);
        if (flight) updateUI(flight);
    }

    
    DOM.favoriteBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const icon = btn.querySelector('i.fa-heart');
            if (icon) {
                const isActive = icon.classList.contains('fas');
                icon.classList.toggle('fas', !isActive);
                icon.classList.toggle('far', isActive);
                icon.style.color = isActive ? '' : '#FF8682';
            }
        });
    });

    
    DOM.classChecks.forEach(check => {
        check.addEventListener('change', () => {
            if (check.checked) DOM.classChecks.forEach(c => { if (c !== check) c.checked = false; });
        });
    });

    DOM.newsletterForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Obrigado por se inscrever!');
        DOM.newsletterForm.reset();
    });

    DOM.bookBtn?.addEventListener('click', () => window.location.href = 'flight-booking.html');
});

function updateFlightPrice(val, name, className) {
    const priceDisplay = document.getElementById('flight-price-display');
    const titleDisplay = document.getElementById('features-title-display');
    const classInput = document.getElementById('flightClassInput');
    
    if (priceDisplay) priceDisplay.innerHTML = 'R$ ' + parseFloat(val).toFixed(2);
    if (titleDisplay) titleDisplay.innerHTML = name;
    if (classInput) classInput.value = className;
}
