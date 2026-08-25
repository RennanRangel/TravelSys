document.addEventListener('DOMContentLoaded', () => {
    
    const DOM = {
        breadcrumbName: document.querySelector('#breadcrumbHotelName'),
        title: document.querySelector('#hotelTitle'),
        location: document.querySelector('#hotelLocation'),
        price: document.querySelector('#hotelPrice'),
        ratingBadge: document.querySelector('#hotelRatingBadge'),
        reviewCount: document.querySelector('#hotelReviewCount'),
        ratingText: document.querySelector('#hotelRatingText'),
        overview: document.querySelector('#hotelOverview'),
        stars: document.querySelector('#hotelStars'),
        gallery: document.querySelector('#hotelGallery'),
        amenities: document.querySelector('#hotelAmenities'),
        mapFrame: document.querySelector('#hotelMapFrame'),
        btnFavorite: document.querySelector('#btnFavorite')
    };


    const getRatingLabel = (rating) => {
        const score = parseFloat(rating);
        if (score >= 4.5) return 'Excelente';
        if (score >= 4.0) return 'Muito Bom';
        if (score >= 3.5) return 'Bom';
        if (score >= 3.0) return 'Regular';
        return 'Médio';
    };

    const updateUI = (hotel) => {
        if (!hotel) return;
        document.title = `${hotel.name} - Golobe`;
        
        if (DOM.breadcrumbName) DOM.breadcrumbName.textContent = hotel.name;
        if (DOM.title) DOM.title.textContent = hotel.name;
        if (DOM.location) DOM.location.textContent = hotel.location;
        if (DOM.price) DOM.price.textContent = `$${hotel.price}`;
        if (DOM.ratingBadge) DOM.ratingBadge.textContent = hotel.rating;
        if (DOM.reviewCount) DOM.reviewCount.textContent = `${hotel.reviews} reviews`;
        if (DOM.ratingText) DOM.ratingText.textContent = getRatingLabel(hotel.rating);
        if (DOM.overview) DOM.overview.textContent = hotel.overview || 'Sem descrição disponível.';

        if (DOM.stars) {
            DOM.stars.innerHTML = '';
            const count = parseInt(hotel.stars) || 5;
            for (let i = 0; i < count; i++) {
                const star = document.createElement('i');
                star.className = 'fas fa-star';
                DOM.stars.appendChild(star);
            }
            const span = document.createElement('span');
            span.textContent = `${count} Star Hotel`;
            DOM.stars.appendChild(span);
        }

        if (DOM.gallery) {
            DOM.gallery.innerHTML = '';
            if (hotel.mainImage) {
                const main = document.createElement('div');
                main.className = 'gallery-item main-image';
                main.innerHTML = `<img src="${hotel.mainImage}" alt="${hotel.name}">`;
                DOM.gallery.appendChild(main);
            }
            (hotel.gallery || []).slice(0, 4).forEach((img, i) => {
                const item = document.createElement('div');
                item.className = i === 3 ? 'gallery-item view-all-container' : 'gallery-item';
                item.innerHTML = i === 3 ? `<img src="${img}"><button class="btn-view-all">Ver todas</button>` : `<img src="${img}">`;
                DOM.gallery.appendChild(item);
            });
        }

        if (DOM.amenities) {
            DOM.amenities.innerHTML = `
                <div class="badge">
                    <span class="badge-score">${hotel.rating}</span>
                    <div class="badge-text"><strong>${getRatingLabel(hotel.rating)}</strong><span>${hotel.reviews} reviews</span></div>
                </div>
            `;
            if (hotel.amenities) {
                hotel.amenities.split(',').forEach(amenity => {
                    const badge = document.createElement('div');
                    badge.className = 'badge';
                    badge.innerHTML = `<i class="fas fa-check"></i> <span>${amenity.trim()}</span>`;
                    DOM.amenities.appendChild(badge);
                });
            }
        }

        if (DOM.mapFrame && hotel.mapUrl) DOM.mapFrame.src = hotel.mapUrl;
    };


    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    if (id) {
        const hotels = JSON.parse(localStorage.getItem('adminHotels')) || [];
        const hotel = hotels.find(h => h.id === id);
        if (hotel) updateUI(hotel);
    }

    if (typeof updateHeader === 'function') updateHeader();
    if (typeof updateProfileDropdown === 'function') updateProfileDropdown();
});
