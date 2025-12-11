document.addEventListener('DOMContentLoaded', function () {
    // Load user data from localStorage
    loadUserData();

    // Load Flight Details
    loadFlightDetails();

    // Event Listeners
    setupEventListeners();
});

function loadUserData() {
    const userData = JSON.parse(localStorage.getItem('userData'));

    if (userData) {
        // Update all user name displays
        const userNameElements = document.querySelectorAll('.user-profile span');
        userNameElements.forEach(element => {
            if (element.textContent.includes('John D.')) {
                const firstName = userData.firstName || 'User';
                const lastNameInitial = userData.lastName ? userData.lastName.charAt(0) + '.' : '';
                element.textContent = `${firstName} ${lastNameInitial}`;
            }
        });

        // Update dropdown header
        const dropdownName = document.querySelector('.user-info h4');
        if (dropdownName && dropdownName.textContent.includes('John Doe')) {
            const fullName = `${userData.firstName || 'User'} ${userData.lastName || ''}`.trim();
            dropdownName.textContent = fullName + '.';
        }
    }
}

function loadFlightDetails() {
    // Get Flight ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const flightId = urlParams.get('id');
    console.log('Loading Flight Details for ID:', flightId);

    if (!flightId) {
        console.warn('No flight ID found in URL');
        return;
    }

    // Get flights from storage
    const flights = JSON.parse(localStorage.getItem('adminFlights')) || [];
    console.log('All flights in storage:', flights);

    const flight = flights.find(f => f.id === flightId);
    console.log('Found flight:', flight);

    if (flight) {
        updateFlightUI(flight);
    } else {
        console.error('Flight not found in storage!');
        alert('Flight not found!');
    }
}

function updateFlightUI(flight) {
    console.log('Updating UI with flight data:', flight);

    // 1. Basic Info
    document.querySelector('.title-info h1').textContent = `${flight.airline} ${flight.stops === 'non stop' ? 'Direct Flight' : flight.stops}`;
    document.querySelector('.location-info span').textContent = `${flight.from} to ${flight.to}`;

    // Price
    const priceElement = document.querySelector('.price-actions .price');
    if (priceElement) priceElement.textContent = `$${flight.price}`;

    // Rating
    const badgeElement = document.querySelector('.rating-info .badge');
    if (badgeElement) badgeElement.textContent = flight.rating;

    const reviewsElement = document.querySelector('.rating-info .reviews');
    if (reviewsElement) reviewsElement.textContent = `${flight.reviews} reviews`;

    // 2. Main Image (Hero)
    if (flight.mainImage) {
        const heroImage = document.querySelector('.hero-image');
        if (heroImage) heroImage.src = flight.mainImage;
    }

    // 3. Gallery Images
    if (flight.gallery && flight.gallery.length > 0) {
        const galleryContainer = document.querySelector('.features-gallery');
        if (galleryContainer) {
            galleryContainer.innerHTML = flight.gallery.map(url =>
                `<img src="${url}" alt="Flight Feature" onclick="window.open('${url}', '_blank')">`
            ).join('');
        }
    }

    // 4. Policies
    if (flight.policies) {
        const policiesContainer = document.querySelector('.policies-grid');
        if (policiesContainer) {
            // Split policies by new line
            const policiesList = flight.policies.split('\n').filter(p => p.trim() !== '');

            policiesContainer.innerHTML = policiesList.map(policy => `
                <div class="policy-item">
                    <i class="fas fa-check-circle" style="color: #8DD3BB;"></i>
                    <span>${policy}</span>
                </div>
            `).join('');
        }
    }

    // 5. Update Return Flights (Optional - using same flight data for demo)
    updateReturnFlights(flight);
}

function updateReturnFlights(flight) {
    // Update the return flight cards to match the airline and times
    const returnCards = document.querySelectorAll('.return-flight-card');
    returnCards.forEach(card => {
        const airlineName = card.querySelector('.airline-name h4');
        if (airlineName) airlineName.textContent = flight.airline;

        // Update logo if available
        const logoImg = card.querySelector('.airline-logo-box img');
        if (logoImg && flight.logo) logoImg.src = flight.logo;

        // Update times
        const times = card.querySelectorAll('.time');
        if (times.length >= 2) {
            times[0].textContent = flight.departure;
            times[1].textContent = flight.arrival;
        }

        // Update duration
        const duration = card.querySelector('.flight-duration');
        if (duration) duration.textContent = flight.duration;
    });
}

function setupEventListeners() {
    // Favorites button toggle
    const favoriteButtons = document.querySelectorAll('.btn-favorites, .btn-icon');
    favoriteButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            const icon = this.querySelector('i');
            if (icon && (icon.classList.contains('fa-heart'))) {
                if (icon.classList.contains('far')) {
                    icon.classList.remove('far');
                    icon.classList.add('fas');
                    icon.style.color = '#FF8682';
                } else {
                    icon.classList.remove('fas');
                    icon.classList.add('far');
                    icon.style.color = '';
                }
            }
        });
    });

    // Class selection checkboxes
    const classCheckboxes = document.querySelectorAll('.class-options input[type="checkbox"]');
    classCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            if (this.checked) {
                classCheckboxes.forEach(cb => {
                    if (cb !== this) cb.checked = false;
                });
            }
        });
    });

    // Newsletter form
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            if (email) {
                alert('Thank you for subscribing!');
                this.reset();
            }
        });
    }

    // Book now button
    const bookBtn = document.querySelector('.btn-book');
    if (bookBtn) {
        bookBtn.addEventListener('click', function () {
            window.location.href = 'flight-booking.html';
        });
    }
}
