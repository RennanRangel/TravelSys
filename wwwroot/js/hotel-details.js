document.addEventListener('DOMContentLoaded', () => {
    loadHotelDetails();
    setupAuth();
});

function loadHotelDetails() {
    // Get hotel ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const hotelId = urlParams.get('id');

    if (!hotelId) {
        // If no ID, maybe show default or redirect (keeping default behavior for now if needed)
        // console.warn('No hotel ID provided');
        return;
    }

    // Get hotels from storage
    const hotels = JSON.parse(localStorage.getItem('adminHotels')) || [];
    const hotel = hotels.find(h => h.id === hotelId);

    if (!hotel) {
        console.error('Hotel not found');
        return;
    }

    updateHotelUI(hotel);
}

function updateHotelUI(hotel) {
    // Basic Info
    document.title = `${hotel.name} - Golobe`;
    document.getElementById('breadcrumbHotelName').textContent = hotel.name;
    document.getElementById('hotelTitle').textContent = hotel.name;
    document.getElementById('hotelLocation').textContent = hotel.location;
    document.getElementById('hotelPrice').textContent = `$${hotel.price}`;
    document.getElementById('hotelRatingBadge').textContent = hotel.rating;
    document.getElementById('hotelReviewCount').textContent = `${hotel.reviews} reviews`;
    document.getElementById('hotelRatingText').textContent = getRatingLabel(hotel.rating);
    document.getElementById('hotelOverview').textContent = hotel.overview || 'No description available.';

    // Stars
    const starsContainer = document.getElementById('hotelStars');
    starsContainer.innerHTML = '';
    const starCount = parseInt(hotel.stars) || 5;
    for (let i = 0; i < starCount; i++) {
        const iStar = document.createElement('i');
        iStar.className = 'fas fa-star';
        starsContainer.appendChild(iStar);
    }
    const starText = document.createElement('span');
    starText.textContent = `${starCount} Star Hotel`;
    starsContainer.appendChild(starText);

    // Gallery
    const galleryContainer = document.getElementById('hotelGallery');
    galleryContainer.innerHTML = '';

    // Main Image
    if (hotel.mainImage) {
        const mainItem = document.createElement('div');
        mainItem.className = 'gallery-item main-image';
        mainItem.innerHTML = `<img src="${hotel.mainImage}" alt="${hotel.name}">`;
        galleryContainer.appendChild(mainItem);
    }

    // Gallery Images (up to 4)
    if (hotel.gallery && hotel.gallery.length > 0) {
        hotel.gallery.forEach((imgSrc, index) => {
            if (index < 4) {
                const item = document.createElement('div');
                item.className = 'gallery-item';
                // If it's the last one (4th), add "View all" button style if needed, 
                // but for now simple grid
                if (index === 3) {
                    item.className = 'gallery-item view-all-container';
                    item.innerHTML = `
                        <img src="${imgSrc}" alt="Gallery ${index + 1}">
                        <button class="btn-view-all">View all photos</button>
                     `;
                } else {
                    item.innerHTML = `<img src="${imgSrc}" alt="Gallery ${index + 1}">`;
                }
                galleryContainer.appendChild(item);
            }
        });
    }

    // Amenities (Badges in Overview)
    const amenitiesContainer = document.getElementById('hotelAmenities');
    amenitiesContainer.innerHTML = '';

    // Add Rating Badge
    const ratingBadge = document.createElement('div');
    ratingBadge.className = 'badge';
    ratingBadge.innerHTML = `
        <span class="badge-score">${hotel.rating}</span>
        <div class="badge-text">
            <strong>${getRatingLabel(hotel.rating)}</strong>
            <span>${hotel.reviews} reviews</span>
        </div>
    `;
    amenitiesContainer.appendChild(ratingBadge);

    // Add Amenities from text (comma separated)
    if (hotel.amenities) {
        const amenitiesList = hotel.amenities.split(',').map(a => a.trim());
        amenitiesList.forEach(amenity => {
            const badge = document.createElement('div');
            badge.className = 'badge';

            // Simple icon mapping
            let iconClass = 'fas fa-check';
            const lowerAmenity = amenity.toLowerCase();
            if (lowerAmenity.includes('pool')) iconClass = 'fas fa-swimming-pool';
            else if (lowerAmenity.includes('wifi')) iconClass = 'fas fa-wifi';
            else if (lowerAmenity.includes('spa')) iconClass = 'fas fa-spa';
            else if (lowerAmenity.includes('gym') || lowerAmenity.includes('fitness')) iconClass = 'fas fa-dumbbell';
            else if (lowerAmenity.includes('restaurant') || lowerAmenity.includes('food')) iconClass = 'fas fa-utensils';
            else if (lowerAmenity.includes('bar')) iconClass = 'fas fa-glass-martini-alt';
            else if (lowerAmenity.includes('parking')) iconClass = 'fas fa-parking';
            else if (lowerAmenity.includes('coffee') || lowerAmenity.includes('tea')) iconClass = 'fas fa-coffee';
            else if (lowerAmenity.includes('room service')) iconClass = 'fas fa-concierge-bell';

            badge.innerHTML = `
                <i class="${iconClass}"></i>
                <span>${amenity}</span>
            `;
            amenitiesContainer.appendChild(badge);
        });
    }

    // Map
    if (hotel.mapUrl) {
        const mapFrame = document.getElementById('hotelMapFrame');
        if (mapFrame) {
            mapFrame.src = hotel.mapUrl;
        }
    }

    // Update Favorite Button
    const btnFavorite = document.getElementById('btnFavorite');
    if (btnFavorite) {
        btnFavorite.setAttribute('data-id', hotel.id);
        btnFavorite.setAttribute('data-name', hotel.name);
        btnFavorite.setAttribute('data-location', hotel.location);
        btnFavorite.setAttribute('data-price', hotel.price);
        btnFavorite.setAttribute('data-rating', hotel.rating);
        btnFavorite.setAttribute('data-image', hotel.mainImage || '');
    }
}

function getRatingLabel(rating) {
    const score = parseFloat(rating);
    if (score >= 4.5) return 'Excellent';
    if (score >= 4.0) return 'Very Good';
    if (score >= 3.5) return 'Good';
    if (score >= 3.0) return 'Average';
    return 'Fair';
}

function setupAuth() {
    // Check if auth.js functions are available
    if (typeof updateHeader === 'function') {
        updateHeader();
    }
    if (typeof updateProfileDropdown === 'function') {
        updateProfileDropdown();
    }
}
