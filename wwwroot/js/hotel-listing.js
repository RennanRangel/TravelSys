// Filter toggle functionality
document.addEventListener('DOMContentLoaded', function () {
    // Filter section toggle
    const filterHeaders = document.querySelectorAll('.filter-header');
    filterHeaders.forEach(header => {
        header.addEventListener('click', function () {
            const icon = this.querySelector('i');
            const content = this.nextElementSibling;

            if (content.style.display === 'none') {
                content.style.display = 'block';
                icon.classList.remove('fa-chevron-down');
                icon.classList.add('fa-chevron-up');
            } else {
                content.style.display = 'none';
                icon.classList.remove('fa-chevron-up');
                icon.classList.add('fa-chevron-down');
            }
        });
    });

    // Sorting tabs
    const sortTabs = document.querySelectorAll('.sort-tab');
    sortTabs.forEach(tab => {
        tab.addEventListener('click', function () {
            sortTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Favorite buttons
    const favoriteButtons = document.querySelectorAll('.btn-favorite');
    favoriteButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            const icon = this.querySelector('i');
            if (icon.classList.contains('far')) {
                icon.classList.remove('far');
                icon.classList.add('fas');
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
            }
        });
    });

    // Price range sliders
    const priceSliders = document.querySelectorAll('.price-range .range-slider');
    const priceLabels = document.querySelectorAll('.price-labels span');

    if (priceSliders.length === 2) {
        const minSlider = priceSliders[0];
        const maxSlider = priceSliders[1];
        const minLabel = priceLabels[0];
        const maxLabel = priceLabels[1];

        minSlider.addEventListener('input', function () {
            const minVal = parseInt(this.value);
            const maxVal = parseInt(maxSlider.value);

            if (minVal > maxVal) {
                this.value = maxVal;
                minLabel.textContent = '$' + maxVal;
            } else {
                minLabel.textContent = '$' + minVal;
            }
        });

        maxSlider.addEventListener('input', function () {
            const maxVal = parseInt(this.value);
            const minVal = parseInt(minSlider.value);

            if (maxVal < minVal) {
                this.value = minVal;
                maxLabel.textContent = '$' + minVal;
            } else {
                maxLabel.textContent = '$' + maxVal;
            }
        });
    }

    // Newsletter form
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            console.log('Newsletter subscription:', email);
            alert('Thank you for subscribing!');
            this.reset();
        });
    }

    // Search form
    const searchBtn = document.querySelector('.btn-search');
    if (searchBtn) {
        searchBtn.addEventListener('click', function (e) {
            e.preventDefault();
            console.log('Hotel Search initiated');
        });
    }

    // Load dynamic hotels from admin panel
    // loadDynamicHotels(); // Disabled to rely on Real Backend Filtering
});

// Function to get hotels from localStorage
function getDynamicHotels() {
    const hotels = localStorage.getItem('adminHotels');
    return hotels ? JSON.parse(hotels) : [];
}

// Function to get rating label
function getRatingLabel(rating) {
    const score = parseFloat(rating);
    if (score >= 4.5) return 'Excellent';
    if (score >= 4.0) return 'Very Good';
    if (score >= 3.5) return 'Good';
    if (score >= 3.0) return 'Average';
    return 'Fair';
}

// Function to generate star icons
function generateStars(stars) {
    let starsHTML = '';
    for (let i = 0; i < parseInt(stars); i++) {
        starsHTML += '<i class="fas fa-star"></i>';
    }
    return starsHTML;
}

// Function to render a hotel card
function renderHotelCard(hotel) {
    return `
        <div class="hotel-card">
            <div class="hotel-image">
                <img src="${hotel.image}" alt="${hotel.name}">
                <button class="btn-favorite" data-type="places" data-id="${hotel.id}"
                    data-name="${hotel.name}"
                    data-location="${hotel.location}" data-price="${hotel.price}"
                    data-rating="${hotel.rating}"
                    data-image="${hotel.image}">
                    <i class="far fa-heart"></i>
                </button>
            </div>
            <div class="hotel-details">
                <div class="hotel-header">
                    <h3>${hotel.name}</h3>
                    <div class="hotel-location">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${hotel.location}</span>
                    </div>
                    <div class="rating">
                        <div class="stars">
                            ${generateStars(hotel.stars)}
                        </div>
                        <span class="rating-score">${hotel.stars} Star Hotel</span>
                        <span class="reviews">${hotel.amenities ? hotel.amenities.split(',').length + '+ Amenities' : '20+ Amenities'}</span>
                    </div>
                    <div class="rating-badge">
                        <span class="score">${hotel.rating}</span>
                        <span class="label">${getRatingLabel(hotel.rating)}</span>
                        <span class="count">${hotel.reviews} reviews</span>
                    </div>
                </div>
                <div class="hotel-price-section">
                    <p class="price-label">starting from</p>
                    <p class="price">$${hotel.price}</p>
                    <p class="night-price">/night</p>
                    <p class="tax-label">excl. tax</p>
                    <button class="btn-view-details" onclick="window.location.href='hotel-details.html'">View Place</button>
                </div>
            </div>
        </div>
    `;
}

// Function to load and display dynamic hotels
function loadDynamicHotels() {
    const hotels = getDynamicHotels();
    const hotelCardsContainer = document.querySelector('.hotel-cards');

    if (!hotelCardsContainer || hotels.length === 0) {
        return;
    }

    // Append dynamic hotels to the container
    hotels.forEach(hotel => {
        hotelCardsContainer.insertAdjacentHTML('beforeend', renderHotelCard(hotel));
    });

    // Re-initialize favorite buttons for dynamic hotels
    const newFavoriteButtons = hotelCardsContainer.querySelectorAll('.btn-favorite');
    newFavoriteButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            const icon = this.querySelector('i');
            if (icon.classList.contains('far')) {
                icon.classList.remove('far');
                icon.classList.add('fas');
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
            }
        });
    });

    // Update results count
    updateResultsCount();
}

// Function to update results count
function updateResultsCount() {
    const totalHotels = document.querySelectorAll('.hotel-card').length;
    const resultsInfo = document.querySelector('.results-info p');
    if (resultsInfo) {
        resultsInfo.innerHTML = `Showing ${totalHotels} of <span>${totalHotels} places</span>`;
    }
}

