document.addEventListener('DOMContentLoaded', () => {
    
    let editingFlightId = null;
    let editingHotelId = null;

    
    const DOM = {
        tabBtns: document.querySelectorAll('.admin-tab-btn'),
        tabContents: document.querySelectorAll('.tab-content'),
        flightForm: document.querySelector('#flightForm'),
        hotelForm: document.querySelector('#hotelForm'),
        flightsList: document.querySelector('#flightsList'),
        hotelsList: document.querySelector('#hotelsList'),
        messageContainer: document.querySelector('#messageContainer')
    };


    const showMessage = (text, type = 'success') => {
        const id = `msg_${Date.now()}`;
        const html = `
            <div class="message ${type}" id="${id}">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
                <span>${text}</span>
            </div>
        `;
        DOM.messageContainer?.insertAdjacentHTML('beforeend', html);
        setTimeout(() => {
            const msg = document.querySelector(`#${id}`);
            if (msg) {
                msg.style.opacity = '0';
                setTimeout(() => msg.remove(), 300);
            }
        }, 5000);
    };

    const readFileAsBase64 = (file) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });

    const generateId = (prefix) => `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;


    DOM.tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.tab;
            DOM.tabBtns.forEach(b => b.classList.remove('active'));
            DOM.tabContents.forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            document.querySelector(`#${target}`)?.classList.add('active');
        });
    });


    const setupPreview = (inputId, previewId) => {
        const input = document.querySelector(`#${inputId}`);
        const preview = document.querySelector(`#${previewId}`);
        const img = preview?.querySelector('img');

        input?.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (file && img && preview) {
                const base64 = await readFileAsBase64(file);
                img.src = base64;
                preview.style.display = 'block';
            } else if (preview) {
                preview.style.display = 'none';
            }
        });
    };

    setupPreview('flightMainImage', 'previewMainImage');
    for (let i = 1; i <= 8; i++) setupPreview(`flightGallery${i}`, `previewGallery${i}`);
    setupPreview('hotelMainImage', 'previewHotelMainImage');
    for (let i = 1; i <= 4; i++) setupPreview(`hotelGallery${i}`, `previewHotelGallery${i}`);


    const getFlights = () => JSON.parse(localStorage.getItem('adminFlights')) || [];

    const loadFlights = () => {
        const flights = getFlights();
        if (!DOM.flightsList) return;

        if (flights.length === 0) {
            DOM.flightsList.innerHTML = '<div class="empty-state"><i class="fas fa-plane-slash"></i><p>Nenhum voo registrado.</p></div>';
            return;
        }

        DOM.flightsList.innerHTML = flights.map(f => `
            <div class="item-card">
                <div class="item-header">
                    <div><div class="item-title">${f.airline}</div><div class="item-subtitle">${f.from} → ${f.to}</div></div>
                    <div class="item-actions">
                        <button class="btn-edit" data-id="${f.id}"><i class="fas fa-edit"></i> Editar</button>
                        <button class="btn-delete" data-id="${f.id}"><i class="fas fa-trash"></i> Excluir</button>
                    </div>
                </div>
                <div class="item-details">
                    <div class="item-detail"><i class="fas fa-clock"></i><span>${f.departure} - ${f.arrival}</span></div>
                    <div class="item-detail"><i class="fas fa-dollar-sign"></i><span><strong>$${f.price}</strong></span></div>
                </div>
            </div>
        `).join('');
    };

    DOM.flightsList?.addEventListener('click', (e) => {
        const editBtn = e.target.closest('.btn-edit');
        const deleteBtn = e.target.closest('.btn-delete');
        
        if (editBtn) window.editFlight(editBtn.dataset.id);
        if (deleteBtn) window.deleteFlight(deleteBtn.dataset.id);
    });

    window.editFlight = (id) => {
        const flight = getFlights().find(f => f.id === id);
        if (!flight) return;

        editingFlightId = id;
        document.querySelector('#flightAirline').value = flight.airline;
        document.querySelector('#flightFrom').value = flight.from;
        document.querySelector('#flightTo').value = flight.to;
        document.querySelector('#flightPrice').value = flight.price;
        
        const submitBtn = DOM.flightForm?.querySelector('.btn-submit');
        if (submitBtn) submitBtn.innerHTML = '<i class="fas fa-save"></i> Atualizar Voo';
        DOM.flightForm?.scrollIntoView({ behavior: 'smooth' });
    };

    window.deleteFlight = (id) => {
        if (!confirm('Excluir este voo?')) return;
        const flights = getFlights().filter(f => f.id !== id);
        localStorage.setItem('adminFlights', JSON.stringify(flights));
        showMessage('Voo excluído!');
        loadFlights();
    };

    DOM.flightForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(DOM.flightForm);
        const flightData = {
            id: editingFlightId || generateId('flight'),
            airline: formData.get('Airline'),
            from: formData.get('From'),
            to: formData.get('To'),
            price: formData.get('Price'),
        };

        let flights = getFlights();
        if (editingFlightId) {
            const idx = flights.findIndex(f => f.id === editingFlightId);
            flights[idx] = flightData;
            editingFlightId = null;
        } else {
            flights.push(flightData);
        }

        localStorage.setItem('adminFlights', JSON.stringify(flights));
        showMessage('Voo salvo com sucesso!');
        DOM.flightForm.reset();
        loadFlights();
    });


    const getHotels = () => JSON.parse(localStorage.getItem('adminHotels')) || [];

    const loadHotels = () => {
        const hotels = getHotels();
        if (!DOM.hotelsList) return;

        if (hotels.length === 0) {
            DOM.hotelsList.innerHTML = '<div class="empty-state"><i class="fas fa-hotel"></i><p>Nenhum hotel registrado.</p></div>';
            return;
        }

        DOM.hotelsList.innerHTML = hotels.map(h => `
            <div class="item-card">
                <div class="item-header">
                    <div><div class="item-title">${h.name}</div><div class="item-subtitle">${h.location}</div></div>
                    <div class="item-actions">
                        <button class="btn-edit-hotel" data-id="${h.id}"><i class="fas fa-edit"></i> Editar</button>
                        <button class="btn-delete-hotel" data-id="${h.id}"><i class="fas fa-trash"></i> Excluir</button>
                    </div>
                </div>
            </div>
        `).join('');
    };

    DOM.hotelsList?.addEventListener('click', (e) => {
        const editBtn = e.target.closest('.btn-edit-hotel');
        const deleteBtn = e.target.closest('.btn-delete-hotel');
        if (editBtn) window.editHotel(editBtn.dataset.id);
        if (deleteBtn) window.deleteHotel(deleteBtn.dataset.id);
    });

    window.editHotel = (id) => {
        const hotel = getHotels().find(h => h.id === id);
        if (!hotel) return;
        editingHotelId = id;
        document.querySelector('#hotelName').value = hotel.name;
        document.querySelector('#hotelLocation').value = hotel.location;
        DOM.hotelForm?.scrollIntoView({ behavior: 'smooth' });
    };

    window.deleteHotel = (id) => {
        if (!confirm('Excluir este hotel?')) return;
        const hotels = getHotels().filter(h => h.id !== id);
        localStorage.setItem('adminHotels', JSON.stringify(hotels));
        showMessage('Hotel excluído!');
        loadHotels();
    };

    DOM.hotelForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const hotelData = {
            id: editingHotelId || generateId('hotel'),
            name: document.querySelector('#hotelName').value,
            location: document.querySelector('#hotelLocation').value,
            price: document.querySelector('#hotelPrice').value
        };

        let hotels = getHotels();
        if (editingHotelId) {
            const idx = hotels.findIndex(h => h.id === editingHotelId);
            hotels[idx] = hotelData;
            editingHotelId = null;
        } else {
            hotels.push(hotelData);
        }
        localStorage.setItem('adminHotels', JSON.stringify(hotels));
        showMessage('Hotel salvo!');
        DOM.hotelForm.reset();
        loadHotels();
    });

    loadFlights();
    loadHotels();
});
