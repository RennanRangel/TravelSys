// Admin Panel Manager
class AdminManager {
    constructor() {
        this.editingFlightId = null;
        this.init();
    }

    init() {
        this.setupTabs();
        this.setupForms();
        this.loadFlights();
        this.loadHotels();
    }

    // Tab Management
    setupTabs() {
        const tabBtns = document.querySelectorAll('.admin-tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');

        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetTab = btn.dataset.tab;

                // Remove active class from all tabs and contents
                tabBtns.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));


                btn.classList.add('active');
                document.getElementById(targetTab).classList.add('active');
            });
        });
    }

    // Form Setup
    setupForms() {
        // Flight Form
        const flightForm = document.getElementById('flightForm');
        flightForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFlightSubmit();
        });

        // Image Preview Listeners
        this.setupImagePreview('flightMainImage', 'previewMainImage');
        for (let i = 1; i <= 8; i++) {
            this.setupImagePreview(`flightGallery${i}`, `previewGallery${i}`);
        }

        // Image Preview Listeners (Hotel)
        this.setupImagePreview('hotelMainImage', 'previewHotelMainImage');
        for (let i = 1; i <= 4; i++) {
            this.setupImagePreview(`hotelGallery${i}`, `previewHotelGallery${i}`);
        }

        // Hotel Form
        const hotelForm = document.getElementById('hotelForm');
        hotelForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleHotelSubmit();
        });
    }

    setupImagePreview(inputId, previewId) {
        const input = document.getElementById(inputId);
        const preview = document.getElementById(previewId);
        const img = preview.querySelector('img');

        if (input) {
            input.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    this.readFileAsBase64(file).then(base64 => {
                        img.src = base64;
                        preview.style.display = 'block';
                    });
                } else {
                    preview.style.display = 'none';
                }
            });
        }
    }

    readFileAsBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    removeImage(previewId, inputId) {
        const preview = document.getElementById(previewId);
        const input = document.getElementById(inputId);
        const img = preview.querySelector('img');

        // Clear preview
        img.src = '';
        preview.style.display = 'none';

        // Clear input
        if (input) input.value = '';
    }

    // Flight Management
    async handleFlightSubmit() {
        try {
            // Process Main Image from Preview
            const mainPreview = document.getElementById('previewMainImage');
            let mainImageBase64 = '';
            if (mainPreview.style.display !== 'none') {
                mainImageBase64 = mainPreview.querySelector('img').src;
            }

            // Process Gallery Images from Previews
            const gallery = [];
            for (let i = 1; i <= 8; i++) {
                const preview = document.getElementById(`previewGallery${i}`);
                if (preview.style.display !== 'none') {
                    const img = preview.querySelector('img');
                    if (img.src) {
                        gallery.push(img.src);
                    }
                }
            }

            const flightData = {
                id: this.editingFlightId || this.generateId('flight'),
                airline: document.getElementById('flightAirline').value,
                logo: document.getElementById('flightLogo').value,
                from: document.getElementById('flightFrom').value,
                to: document.getElementById('flightTo').value,
                departure: document.getElementById('flightDeparture').value,
                arrival: document.getElementById('flightArrival').value,
                duration: document.getElementById('flightDuration').value,
                stops: document.getElementById('flightStops').value,
                price: document.getElementById('flightPrice').value,
                rating: document.getElementById('flightRating').value,
                reviews: document.getElementById('flightReviews').value,
                // Visual Details
                mainImage: mainImageBase64,
                gallery: gallery,
                policies: document.getElementById('flightPolicies').value || '',
                // Return Flight Details
                returnFlight: {
                    date: document.getElementById('flightReturnDate').value,
                    duration: document.getElementById('flightReturnDuration').value,
                    airline: document.getElementById('flightReturnAirline').value,
                    aircraft: document.getElementById('flightReturnAircraft').value,
                    departureTime: document.getElementById('flightReturnDepartureTime').value,
                    departureAirport: document.getElementById('flightReturnDepartureAirport').value,
                    arrivalTime: document.getElementById('flightReturnArrivalTime').value,
                    arrivalAirport: document.getElementById('flightReturnArrivalAirport').value
                }
            };

            if (this.editingFlightId) {
                this.updateFlightInStorage(flightData);
                this.showMessage('Flight updated successfully!', 'success');
                this.cancelEdit('flight');
            } else {
                this.saveFlightToStorage(flightData);
                this.showMessage('Flight added successfully!', 'success');
                document.getElementById('flightForm').reset();
                // Reset previews
                document.querySelectorAll('.image-preview').forEach(el => el.style.display = 'none');
            }
            this.loadFlights();

        } catch (error) {
            console.error('Error processing flight submit:', error);
            this.showMessage('Error saving flight. Image might be too large.', 'error');
        }
    }

    saveFlightToStorage(flightData) {
        const flights = this.getFlightsFromStorage();
        flights.push(flightData);
        try {
            localStorage.setItem('adminFlights', JSON.stringify(flights));
        } catch (e) {
            this.showMessage('Storage full! Try smaller images.', 'error');
            flights.pop(); // Remove failed item
        }
    }

    getFlightsFromStorage() {
        const flights = localStorage.getItem('adminFlights');
        return flights ? JSON.parse(flights) : [];
    }

    deleteFlightFromStorage(flightId) {
        let flights = this.getFlightsFromStorage();
        flights = flights.filter(f => f.id !== flightId);
        localStorage.setItem('adminFlights', JSON.stringify(flights));
        this.showMessage('Flight deleted successfully!', 'success');
        this.cancelEdit('flight');
        this.loadFlights();
    }

    loadFlights() {
        const flights = this.getFlightsFromStorage();
        const flightsList = document.getElementById('flightsList');

        if (flights.length === 0) {
            flightsList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-plane-slash"></i>
                    <p>No flights registered yet. Add your first flight above!</p>
                </div>
            `;
            return;
        }

        flightsList.innerHTML = flights.map(flight => `
            <div class="item-card">
                <div class="item-header">
                    <div>
                        <div class="item-title">${flight.airline}</div>
                        <div class="item-subtitle">${flight.from} → ${flight.to}</div>
                    </div>
                    <div class="item-actions">
                        <button class="btn-edit" onclick="adminManager.editFlightFromStorage('${flight.id}')">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn-delete" onclick="adminManager.deleteFlightFromStorage('${flight.id}')">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </div>
                <div class="item-details">
                    <div class="item-detail">
                        <i class="fas fa-clock"></i>
                        <span>${flight.departure} - ${flight.arrival}</span>
                    </div>
                    <div class="item-detail">
                        <i class="fas fa-hourglass-half"></i>
                        <span>${flight.duration}</span>
                    </div>
                    <div class="item-detail">
                        <i class="fas fa-plane"></i>
                        <span>${flight.stops}</span>
                    </div>
                    <div class="item-detail">
                        <i class="fas fa-dollar-sign"></i>
                        <span><strong>$${flight.price}</strong></span>
                    </div>
                    <div class="item-detail">
                        <i class="fas fa-star"></i>
                        <span>${flight.rating} (${flight.reviews} reviews)</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    editFlightFromStorage(flightId) {
        const flights = this.getFlightsFromStorage();
        const flight = flights.find(f => f.id === flightId);

        if (!flight) {
            this.showMessage('Flight not found!', 'error');
            return;
        }

        // Populate form with flight data
        document.getElementById('flightAirline').value = flight.airline;
        document.getElementById('flightLogo').value = flight.logo;
        document.getElementById('flightFrom').value = flight.from;
        document.getElementById('flightTo').value = flight.to;
        document.getElementById('flightDeparture').value = flight.departure;
        document.getElementById('flightArrival').value = flight.arrival;
        document.getElementById('flightDuration').value = flight.duration;
        document.getElementById('flightStops').value = flight.stops;
        document.getElementById('flightPrice').value = flight.price;
        document.getElementById('flightRating').value = flight.rating;
        document.getElementById('flightReviews').value = flight.reviews;

        // Load visual details (Previews)
        if (flight.mainImage) {
            const preview = document.getElementById('previewMainImage');
            const img = preview.querySelector('img');
            img.src = flight.mainImage;
            preview.style.display = 'block';
        } else {
            document.getElementById('previewMainImage').style.display = 'none';
        }

        document.getElementById('flightPolicies').value = flight.policies || '';

        // Load Return Flight Details
        if (flight.returnFlight) {
            document.getElementById('flightReturnDate').value = flight.returnFlight.date || '';
            document.getElementById('flightReturnDuration').value = flight.returnFlight.duration || '';
            document.getElementById('flightReturnAirline').value = flight.returnFlight.airline || '';
            document.getElementById('flightReturnAircraft').value = flight.returnFlight.aircraft || '';
            document.getElementById('flightReturnDepartureTime').value = flight.returnFlight.departureTime || '';
            document.getElementById('flightReturnDepartureAirport').value = flight.returnFlight.departureAirport || '';
            document.getElementById('flightReturnArrivalTime').value = flight.returnFlight.arrivalTime || '';
            document.getElementById('flightReturnArrivalAirport').value = flight.returnFlight.arrivalAirport || '';
        } else {
            // Clear fields if no return flight data
            document.getElementById('flightReturnDate').value = '';
            document.getElementById('flightReturnDuration').value = '';
            document.getElementById('flightReturnAirline').value = '';
            document.getElementById('flightReturnAircraft').value = '';
            document.getElementById('flightReturnDepartureTime').value = '';
            document.getElementById('flightReturnDepartureAirport').value = '';
            document.getElementById('flightReturnArrivalTime').value = '';
            document.getElementById('flightReturnArrivalAirport').value = '';
        }

        // Load gallery images (Previews)
        // Reset all gallery previews first
        for (let i = 1; i <= 8; i++) {
            document.getElementById(`previewGallery${i}`).style.display = 'none';
        }

        if (flight.gallery && Array.isArray(flight.gallery)) {
            flight.gallery.forEach((base64, index) => {
                const preview = document.getElementById(`previewGallery${index + 1}`);
                if (preview) {
                    const img = preview.querySelector('img');
                    img.src = base64;
                    preview.style.display = 'block';
                }
            });
        }

        // Set editing mode
        this.editingFlightId = flightId;
        this.updateFormUI('flight', true);

        // Scroll to form
        document.getElementById('flightForm').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    updateFlightInStorage(flightData) {
        let flights = this.getFlightsFromStorage();
        const index = flights.findIndex(f => f.id === flightData.id);

        if (index !== -1) {
            flights[index] = flightData;
            localStorage.setItem('adminFlights', JSON.stringify(flights));
        }
    }

    cancelEdit(type = 'flight') {
        if (type === 'flight') {
            this.editingFlightId = null;
            document.getElementById('flightForm').reset();
            document.querySelectorAll('#flightForm .image-preview').forEach(el => el.style.display = 'none');
            this.updateFormUI('flight', false);
        } else if (type === 'hotel') {
            this.editingHotelId = null;
            document.getElementById('hotelForm').reset();
            document.querySelectorAll('#hotelForm .image-preview').forEach(el => el.style.display = 'none');
            this.updateFormUI('hotel', false);
        }
    }

    updateFormUI(type, isEditing) {
        const formId = type === 'flight' ? 'flightForm' : 'hotelForm';
        const form = document.getElementById(formId);
        const submitBtn = form.querySelector('.btn-submit');
        const formActions = form.querySelector('.form-actions');
        const itemType = type === 'flight' ? 'Flight' : 'Hotel';

        if (isEditing) {
            submitBtn.innerHTML = `<i class="fas fa-save"></i> Update ${itemType}`;

            // Add cancel button if it doesn't exist
            if (!form.querySelector('.btn-cancel')) {
                const cancelBtn = document.createElement('button');
                cancelBtn.type = 'button';
                cancelBtn.className = 'btn-cancel';
                cancelBtn.innerHTML = '<i class="fas fa-times"></i> Cancel';
                cancelBtn.onclick = () => this.cancelEdit(type);
                formActions.insertBefore(cancelBtn, submitBtn.nextSibling);
            }

            // Add visual indicator
            form.classList.add('editing-mode');
        } else {
            submitBtn.innerHTML = `<i class="fas fa-plus"></i> Add ${itemType}`;

            // Remove cancel button
            const cancelBtn = form.querySelector('.btn-cancel');
            if (cancelBtn) cancelBtn.remove();

            // Remove visual indicator
            form.classList.remove('editing-mode');
        }
    }

    // Hotel Management
    // Hotel Management
    async handleHotelSubmit() {
        try {
            // Process Main Image from Preview
            const mainPreview = document.getElementById('previewHotelMainImage');
            let mainImageBase64 = '';
            if (mainPreview.style.display !== 'none') {
                mainImageBase64 = mainPreview.querySelector('img').src;
            }

            // Process Gallery Images from Previews
            const gallery = [];
            for (let i = 1; i <= 4; i++) {
                const preview = document.getElementById(`previewHotelGallery${i}`);
                if (preview.style.display !== 'none') {
                    const img = preview.querySelector('img');
                    if (img.src) {
                        gallery.push(img.src);
                    }
                }
            }

            const hotelData = {
                id: this.editingHotelId || this.generateId('hotel'),
                name: document.getElementById('hotelName').value,
                overview: document.getElementById('hotelOverview').value,
                mapUrl: document.getElementById('hotelMapUrl').value,
                location: document.getElementById('hotelLocation').value,
                stars: document.getElementById('hotelStars').value,
                price: document.getElementById('hotelPrice').value,
                rating: document.getElementById('hotelRating').value,
                reviews: document.getElementById('hotelReviews').value,
                amenities: document.getElementById('hotelAmenities').value,
                // Visual Details
                mainImage: mainImageBase64,
                gallery: gallery
            };

            if (this.editingHotelId) {
                this.updateHotelInStorage(hotelData);
                this.showMessage('Hotel updated successfully!', 'success');
                this.cancelEdit('hotel');
            } else {
                this.saveHotelToStorage(hotelData);
                this.showMessage('Hotel added successfully!', 'success');
                document.getElementById('hotelForm').reset();
                // Reset previews
                document.querySelectorAll('#hotelForm .image-preview').forEach(el => el.style.display = 'none');
            }
            this.loadHotels();

        } catch (error) {
            console.error('Error processing hotel submit:', error);
            this.showMessage('Error saving hotel. Image might be too large.', 'error');
        }
    }

    saveHotelToStorage(hotelData) {
        const hotels = this.getHotelsFromStorage();
        hotels.push(hotelData);
        try {
            localStorage.setItem('adminHotels', JSON.stringify(hotels));
        } catch (e) {
            this.showMessage('Storage full! Try smaller images.', 'error');
            hotels.pop();
        }
    }

    updateHotelInStorage(hotelData) {
        let hotels = this.getHotelsFromStorage();
        const index = hotels.findIndex(h => h.id === hotelData.id);

        if (index !== -1) {
            hotels[index] = hotelData;
            localStorage.setItem('adminHotels', JSON.stringify(hotels));
        }
    }

    getHotelsFromStorage() {
        const hotels = localStorage.getItem('adminHotels');
        return hotels ? JSON.parse(hotels) : [];
    }

    deleteHotelFromStorage(hotelId) {
        let hotels = this.getHotelsFromStorage();
        hotels = hotels.filter(h => h.id !== hotelId);
        localStorage.setItem('adminHotels', JSON.stringify(hotels));
        this.showMessage('Hotel deleted successfully!', 'success');
        this.cancelEdit('hotel');
        this.loadHotels();
    }

    editHotelFromStorage(hotelId) {
        const hotels = this.getHotelsFromStorage();
        const hotel = hotels.find(h => h.id === hotelId);

        if (!hotel) {
            this.showMessage('Hotel not found!', 'error');
            return;
        }

        // Populate form
        document.getElementById('hotelName').value = hotel.name;
        document.getElementById('hotelOverview').value = hotel.overview || '';
        document.getElementById('hotelMapUrl').value = hotel.mapUrl || '';
        document.getElementById('hotelLocation').value = hotel.location;
        document.getElementById('hotelStars').value = hotel.stars;
        document.getElementById('hotelPrice').value = hotel.price;
        document.getElementById('hotelRating').value = hotel.rating;
        document.getElementById('hotelReviews').value = hotel.reviews;
        document.getElementById('hotelAmenities').value = hotel.amenities || '';

        // Load Visual Details
        if (hotel.mainImage) {
            const preview = document.getElementById('previewHotelMainImage');
            const img = preview.querySelector('img');
            img.src = hotel.mainImage;
            preview.style.display = 'block';
        } else {
            document.getElementById('previewHotelMainImage').style.display = 'none';
        }

        // Load Gallery
        for (let i = 1; i <= 4; i++) {
            document.getElementById(`previewHotelGallery${i}`).style.display = 'none';
        }

        if (hotel.gallery && Array.isArray(hotel.gallery)) {
            hotel.gallery.forEach((base64, index) => {
                const preview = document.getElementById(`previewHotelGallery${index + 1}`);
                if (preview) {
                    const img = preview.querySelector('img');
                    img.src = base64;
                    preview.style.display = 'block';
                }
            });
        }

        this.editingHotelId = hotelId;
        this.updateFormUI('hotel', true);
        document.getElementById('hotelForm').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    loadHotels() {
        const hotels = this.getHotelsFromStorage();
        const hotelsList = document.getElementById('hotelsList');

        if (hotels.length === 0) {
            hotelsList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-hotel"></i>
                    <p>No hotels registered yet. Add your first hotel above!</p>
                </div>
            `;
            return;
        }

        hotelsList.innerHTML = hotels.map(hotel => `
            <div class="item-card">
                <div class="item-header">
                    <div>
                        <div class="item-title">${hotel.name}</div>
                        <div class="item-subtitle">${hotel.location}</div>
                    </div>
                    <div class="item-actions">
                        <button class="btn-edit" onclick="adminManager.editHotelFromStorage('${hotel.id}')">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn-delete" onclick="adminManager.deleteHotelFromStorage('${hotel.id}')">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </div>
                <div class="item-details">
                    <div class="item-detail">
                        <i class="fas fa-star"></i>
                        <span>${hotel.stars} Star Hotel</span>
                    </div>
                    <div class="item-detail">
                        <i class="fas fa-dollar-sign"></i>
                        <span><strong>$${hotel.price}</strong>/night</span>
                    </div>
                    <div class="item-detail">
                        <i class="fas fa-heart"></i>
                        <span>${hotel.rating} (${hotel.reviews} reviews)</span>
                    </div>
                    ${hotel.amenities ? `
                        <div class="item-detail" style="grid-column: 1 / -1;">
                            <i class="fas fa-check-circle"></i>
                            <span>${hotel.amenities}</span>
                        </div>
                    ` : ''}
                </div>
            </div>
        `).join('');
    }

    // Utility Functions
    generateId(prefix) {
        return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    showMessage(text, type = 'success') {
        const messageContainer = document.getElementById('messageContainer');
        const messageId = `msg_${Date.now()}`;

        const messageHTML = `
            <div class="message ${type}" id="${messageId}">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
                <span>${text}</span>
            </div>
        `;

        messageContainer.insertAdjacentHTML('beforeend', messageHTML);

        // Auto remove after 5 seconds
        setTimeout(() => {
            const msg = document.getElementById(messageId);
            if (msg) {
                msg.style.opacity = '0';
                setTimeout(() => msg.remove(), 300);
            }
        }, 5000);
    }

    // Get rating label based on score
    getRatingLabel(rating) {
        const score = parseFloat(rating);
        if (score >= 4.5) return 'Excellent';
        if (score >= 4.0) return 'Very Good';
        if (score >= 3.5) return 'Good';
        if (score >= 3.0) return 'Average';
        return 'Fair';
    }
}

// Initialize Admin Manager
let adminManager;
document.addEventListener('DOMContentLoaded', () => {
    adminManager = new AdminManager();
});

