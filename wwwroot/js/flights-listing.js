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

    // Time range sliders
    const timeSliders = document.querySelectorAll('.time-range .range-slider');
    const timeLabels = document.querySelectorAll('.time-labels span');

    if (timeSliders.length === 2) {
        const minTimeSlider = timeSliders[0];
        const maxTimeSlider = timeSliders[1];
        const minTimeLabel = timeLabels[0];
        const maxTimeLabel = timeLabels[1];

        const updateTimeLabel = (val, labelElement) => {
            const hours = parseInt(val);
            const ampm = hours >= 12 && hours < 24 ? 'pm' : 'am';
            const displayHours = hours % 12 || 12; // Convert 0 to 12
            // Special handling for 24
            if (hours === 24) {
                labelElement.textContent = '11:59pm'; // or 12:00am next day? Keep consistency with view: 11:59pm
                return;
            }
            labelElement.textContent = displayHours.toString().padStart(2, '0') + ':00' + ampm;
        };

        // Initialize labels on load? The View sets them statically, but dynamic update is better.
        // Actually the view has static text 00:00am and 11:59pm which is fine for defaults.

        minTimeSlider.addEventListener('input', function () {
            const minVal = parseInt(this.value);
            const maxVal = parseInt(maxTimeSlider.value);

            if (minVal > maxVal) {
                this.value = maxVal;
                updateTimeLabel(maxVal, minTimeLabel);
            } else {
                updateTimeLabel(minVal, minTimeLabel);
            }
        });

        maxTimeSlider.addEventListener('input', function () {
            const maxVal = parseInt(this.value);
            const minVal = parseInt(minTimeSlider.value);

            if (maxVal < minVal) {
                this.value = minVal;
                updateTimeLabel(minVal, maxTimeLabel);
            } else {
                updateTimeLabel(maxVal, maxTimeLabel);
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

    // Search button - form now submits normally via GET
    // Removed preventDefault that was blocking form submission

    // Load dynamic flights from admin panel
    // loadDynamicFlights(); // Disabled to rely on Real Backend Filtering
});

// Function to get flights from localStorage
function getDynamicFlights() {
    const flights = localStorage.getItem('adminFlights');
    return flights ? JSON.parse(flights) : [];
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

// Function to render a flight card
function renderFlightCard(flight) {
    return `
        <div class="flight-card">
            <div class="flight-header">
                <div class="airline-info">
                    <img src="${flight.logo}"
                        alt="${flight.airline}" class="airline-logo">
                    <div class="rating">
                        <span class="rating-score">${flight.rating}</span>
                        <span class="rating-label">${getRatingLabel(flight.rating)}</span>
                        <span class="reviews">${flight.reviews} reviews</span>
                    </div>
                </div>
                <div class="price-info">
                    <p class="price-label">starting from</p>
                    <p class="price">$${flight.price}</p>
                </div>
            </div>
            <div class="flight-details">
                <div class="flight-time">
                    <input type="checkbox" class="flight-checkbox">
                    <div class="time-info">
                        <span class="time">${flight.departure}</span>
                        <span class="location">${flight.from}</span>
                    </div>
                    <div class="duration-info">
                        <span class="duration">${flight.stops}</span>
                        <div class="duration-line"></div>
                        <span class="duration-time">${flight.duration}</span>
                    </div>
                    <div class="time-info">
                        <span class="time">${flight.arrival}</span>
                        <span class="location">${flight.to}</span>
                    </div>
                </div>
            </div>
            <div class="flight-footer">
                <button class="btn-favorite" data-type="flights" data-id="${flight.id}" data-price="${flight.price}"
                    data-airline="${flight.airline}" data-route="${flight.from} - ${flight.to}"
                    data-image="${flight.logo}">
                    <i class="far fa-heart"></i>
                </button>
                <a href="flight-details.html?id=${flight.id}" class="btn-view-details">View Details</a>
            </div>
        </div>
    `;
}

// Function to load and display dynamic flights
function loadDynamicFlights() {
    const flights = getDynamicFlights();
    const flightCardsContainer = document.querySelector('.flight-cards');

    if (!flightCardsContainer || flights.length === 0) {
        return;
    }

    // Append dynamic flights to the container
    flights.forEach(flight => {
        flightCardsContainer.insertAdjacentHTML('beforeend', renderFlightCard(flight));
    });

    // Re-initialize favorite buttons for dynamic flights
    const newFavoriteButtons = flightCardsContainer.querySelectorAll('.btn-favorite');
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
    const totalFlights = document.querySelectorAll('.flight-card').length;
    const resultsInfo = document.querySelector('.results-info p');
    if (resultsInfo) {
        resultsInfo.innerHTML = `Showing ${totalFlights} of <span>${totalFlights} places</span>`;
    }
}

