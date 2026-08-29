document.addEventListener("DOMContentLoaded", () => {
  const state = {
    editingFlightId: null,
    editingHotelId: null,
  };

  const DOM = {
    tabBtns: document.querySelectorAll(".admin-tab-btn"),
    tabContents: document.querySelectorAll(".tab-content"),
    flightForm: document.querySelector("#flightForm"),
    hotelForm: document.querySelector("#hotelForm"),
    flightsList: document.querySelector("#flightsList"),
    hotelsList: document.querySelector("#hotelsList"),
    messageContainer: document.querySelector("#messageContainer"),
  };

  const generateId = (prefix) =>
    `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const showMessage = (text, type = "success") => {
    const id = `msg_${Date.now()}`;
    const html = `
            <div class="message ${type}" id="${id}">
                <i class="fas fa-${type === "success" ? "check-circle" : "exclamation-circle"}"></i>
                <span>${text}</span>
            </div>
        `;
    DOM.messageContainer?.insertAdjacentHTML("beforeend", html);

    setTimeout(() => {
      const msg = document.querySelector(`#${id}`);
      if (msg) {
        msg.style.opacity = "0";
        setTimeout(() => msg.remove(), 300);
      }
    }, 5000);
  };

  const readFileAsBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const storage = {
    getFlights: () => JSON.parse(localStorage.getItem("adminFlights")) || [],
    saveFlights: (flights) =>
      localStorage.setItem("adminFlights", JSON.stringify(flights)),
    getHotels: () => JSON.parse(localStorage.getItem("adminHotels")) || [],
    saveHotels: (hotels) =>
      localStorage.setItem("adminHotels", JSON.stringify(hotels)),
  };

  const FlightModule = {
    render() {
      const flights = storage.getFlights();
      if (!DOM.flightsList) return;

      if (flights.length === 0) {
        DOM.flightsList.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-plane-slash"></i>
                        <p>Nenhum voo registrado.</p>
                    </div>`;
        return;
      }

      DOM.flightsList.innerHTML = flights
        .map(
          (f) => `
                <div class="item-card">
                    <div class="item-header">
                        <div>
                            <div class="item-title">${f.airline}</div>
                            <div class="item-subtitle">${f.from} → ${f.to}</div>
                        </div>
                        <div class="item-actions">
                            <button class="btn-edit" data-id="${f.id}"><i class="fas fa-edit"></i> Editar</button>
                            <button class="btn-delete" data-id="${f.id}"><i class="fas fa-trash"></i> Excluir</button>
                        </div>
                    </div>
                    <div class="item-details">
                        <div class="item-detail"><i class="fas fa-clock"></i><span>${f.departure || "--:--"} - ${f.arrival || "--:--"}</span></div>
                        <div class="item-detail"><i class="fas fa-dollar-sign"></i><span><strong>$${f.price}</strong></span></div>
                    </div>
                </div>
            `,
        )
        .join("");
    },

    edit(id) {
      const flight = storage.getFlights().find((f) => f.id === id);
      if (!flight) return;

      state.editingFlightId = id;
      document.querySelector("#flightAirline").value = flight.airline;
      document.querySelector("#flightFrom").value = flight.from;
      document.querySelector("#flightTo").value = flight.to;
      document.querySelector("#flightPrice").value = flight.price;

      const submitBtn = DOM.flightForm?.querySelector(".btn-submit");
      if (submitBtn)
        submitBtn.innerHTML = '<i class="fas fa-save"></i> Atualizar Voo';
      DOM.flightForm?.scrollIntoView({ behavior: "smooth" });
    },

    delete(id) {
      if (!confirm("Excluir este voo?")) return;
      const flights = storage.getFlights().filter((f) => f.id !== id);
      storage.saveFlights(flights);
      showMessage("Voo excluído!");
      this.render();
    },

    save(e) {
      e.preventDefault();
      const formData = new FormData(DOM.flightForm);
      const flightData = {
        id: state.editingFlightId || generateId("flight"),
        airline: formData.get("Airline"),
        from: formData.get("From"),
        to: formData.get("To"),
        price: formData.get("Price"),
      };

      let flights = storage.getFlights();
      if (state.editingFlightId) {
        const idx = flights.findIndex((f) => f.id === state.editingFlightId);
        flights[idx] = flightData;
        state.editingFlightId = null;
      } else {
        flights.push(flightData);
      }

      storage.saveFlights(flights);
      showMessage("Voo salvo com sucesso!");

      DOM.flightForm.reset();
      const submitBtn = DOM.flightForm?.querySelector(".btn-submit");
      if (submitBtn)
        submitBtn.innerHTML = '<i class="fas fa-plus"></i> Salvar Voo';

      this.render();
    },
  };

  const HotelModule = {
    render() {
      const hotels = storage.getHotels();
      if (!DOM.hotelsList) return;

      if (hotels.length === 0) {
        DOM.hotelsList.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-hotel"></i>
                        <p>Nenhum hotel registrado.</p>
                    </div>`;
        return;
      }

      DOM.hotelsList.innerHTML = hotels
        .map(
          (h) => `
                <div class="item-card">
                    <div class="item-header">
                        <div>
                            <div class="item-title">${h.name}</div>
                            <div class="item-subtitle">${h.location}</div>
                        </div>
                        <div class="item-actions">
                            <button class="btn-edit-hotel" data-id="${h.id}"><i class="fas fa-edit"></i> Editar</button>
                            <button class="btn-delete-hotel" data-id="${h.id}"><i class="fas fa-trash"></i> Excluir</button>
                        </div>
                    </div>
                </div>
            `,
        )
        .join("");
    },

    edit(id) {
      const hotel = storage.getHotels().find((h) => h.id === id);
      if (!hotel) return;

      state.editingHotelId = id;
      document.querySelector("#hotelName").value = hotel.name;
      document.querySelector("#hotelLocation").value = hotel.location;
      if (document.querySelector("#hotelPrice")) {
        document.querySelector("#hotelPrice").value = hotel.price || "";
      }
      DOM.hotelForm?.scrollIntoView({ behavior: "smooth" });
    },

    delete(id) {
      if (!confirm("Excluir este hotel?")) return;
      const hotels = storage.getHotels().filter((h) => h.id !== id);
      storage.saveHotels(hotels);
      showMessage("Hotel excluído!");
      this.render();
    },

    save(e) {
      e.preventDefault();
      const hotelData = {
        id: state.editingHotelId || generateId("hotel"),
        name: document.querySelector("#hotelName").value,
        location: document.querySelector("#hotelLocation").value,
        price: document.querySelector("#hotelPrice")?.value || 0,
      };

      let hotels = storage.getHotels();
      if (state.editingHotelId) {
        const idx = hotels.findIndex((h) => h.id === state.editingHotelId);
        hotels[idx] = hotelData;
        state.editingHotelId = null;
      } else {
        hotels.push(hotelData);
      }

      storage.saveHotels(hotels);
      showMessage("Hotel salvo!");
      DOM.hotelForm.reset();
      this.render();
    },
  };

  const setupPreview = (inputId, previewId) => {
    const input = document.querySelector(`#${inputId}`);
    const preview = document.querySelector(`#${previewId}`);
    const img = preview?.querySelector("img");

    input?.addEventListener("change", async (e) => {
      const file = e.target.files[0];
      if (file && img && preview) {
        const base64 = await readFileAsBase64(file);
        img.src = base64;
        preview.style.display = "block";
      } else if (preview) {
        preview.style.display = "none";
      }
    });
  };

  const initEvents = () => {
    DOM.tabBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const target = btn.dataset.tab;
        DOM.tabBtns.forEach((b) => b.classList.remove("active"));
        DOM.tabContents.forEach((c) => c.classList.remove("active"));
        btn.classList.add("active");
        document.querySelector(`#${target}`)?.classList.add("active");
      });
    });

    setupPreview("flightMainImage", "previewMainImage");
    for (let i = 1; i <= 8; i++)
      setupPreview(`flightGallery${i}`, `previewGallery${i}`);
    setupPreview("hotelMainImage", "previewHotelMainImage");
    for (let i = 1; i <= 4; i++)
      setupPreview(`hotelGallery${i}`, `previewHotelGallery${i}`);

    DOM.flightsList?.addEventListener("click", (e) => {
      const editBtn = e.target.closest(".btn-edit");
      const deleteBtn = e.target.closest(".btn-delete");
      if (editBtn) FlightModule.edit(editBtn.dataset.id);
      if (deleteBtn) FlightModule.delete(deleteBtn.dataset.id);
    });

    DOM.hotelsList?.addEventListener("click", (e) => {
      const editBtn = e.target.closest(".btn-edit-hotel");
      const deleteBtn = e.target.closest(".btn-delete-hotel");
      if (editBtn) HotelModule.edit(editBtn.dataset.id);
      if (deleteBtn) HotelModule.delete(deleteBtn.dataset.id);
    });

    DOM.flightForm?.addEventListener("submit", (e) => FlightModule.save(e));
    DOM.hotelForm?.addEventListener("submit", (e) => HotelModule.save(e));
  };

  initEvents();
  FlightModule.render();
  HotelModule.render();
});
