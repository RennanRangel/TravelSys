/**
 * Gerenciamento de Listagem de Voos (Simplificado)
 */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Cache de Elementos
    const DOM = {
        filterHeaders: document.querySelectorAll('.filter-header'),
        sortTabs: document.querySelectorAll('.sort-tab'),
        priceSliders: document.querySelectorAll('.price-range .range-slider'),
        priceLabels: document.querySelectorAll('.price-labels span'),
        timeSliders: document.querySelectorAll('.time-range .range-slider'),
        timeLabels: document.querySelectorAll('.time-labels span'),
        newsletterForm: document.querySelector('.newsletter-form'),
        flightCardsContainer: document.querySelector('.flight-cards')
    };

    // --- FILTROS E ABAS ---

    DOM.filterHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const icon = this.querySelector('i');
            const content = this.nextElementSibling;
            if (!content || !icon) return;

            const isHidden = content.style.display === 'none';
            content.style.display = isHidden ? 'block' : 'none';
            icon.classList.toggle('fa-chevron-up', isHidden);
            icon.classList.toggle('fa-chevron-down', !isHidden);
        });
    });

    DOM.sortTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            DOM.sortTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
        });
    });

    // --- FAVORITOS (Delegation) ---

    DOM.flightCardsContainer?.addEventListener('click', (e) => {
        const btn = e.target.closest('.btn-favorite');
        if (btn) {
            const icon = btn.querySelector('i');
            if (icon) {
                icon.classList.toggle('fas');
                icon.classList.toggle('far');
            }
        }
    });

    // --- SLIDERS DE PREÇO ---

    if (DOM.priceSliders.length === 2) {
        const [minSlider, maxSlider] = DOM.priceSliders;
        const [minLabel, maxLabel] = DOM.priceLabels;

        minSlider.addEventListener('input', () => {
            const min = parseInt(minSlider.value);
            const max = parseInt(maxSlider.value);
            if (min > max) {
                minSlider.value = max;
                minLabel.textContent = `$${max}`;
            } else {
                minLabel.textContent = `$${min}`;
            }
        });

        maxSlider.addEventListener('input', () => {
            const min = parseInt(minSlider.value);
            const max = parseInt(maxSlider.value);
            if (max < min) {
                maxSlider.value = min;
                maxLabel.textContent = `$${min}`;
            } else {
                maxLabel.textContent = `$${max}`;
            }
        });
    }

    // --- SLIDERS DE HORÁRIO ---

    const updateTimeLabel = (val, labelElement) => {
        if (!labelElement) return;
        const hours = parseInt(val);
        const ampm = hours >= 12 && hours < 24 ? 'pm' : 'am';
        const displayHours = hours % 12 || 12;
        labelElement.textContent = hours === 24 ? '11:59pm' : `${displayHours.toString().padStart(2, '0')}:00${ampm}`;
    };

    if (DOM.timeSliders.length === 2) {
        const [minTimeSlider, maxTimeSlider] = DOM.timeSliders;
        const [minTimeLabel, maxTimeLabel] = DOM.timeLabels;

        minTimeSlider.addEventListener('input', () => {
            const min = parseInt(minTimeSlider.value);
            const max = parseInt(maxTimeSlider.value);
            if (min > max) {
                minTimeSlider.value = max;
                updateTimeLabel(max, minTimeLabel);
            } else {
                updateTimeLabel(min, minTimeLabel);
            }
        });

        maxTimeSlider.addEventListener('input', () => {
            const min = parseInt(minTimeSlider.value);
            const max = parseInt(maxTimeSlider.value);
            if (max < min) {
                maxTimeSlider.value = min;
                updateTimeLabel(min, maxTimeLabel);
            } else {
                updateTimeLabel(max, maxTimeLabel);
            }
        });
    }

    // --- NEWSLETTER ---

    DOM.newsletterForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = DOM.newsletterForm.querySelector('input[type="email"]')?.value;
        if (email) {
            alert('Obrigado por se inscrever!');
            DOM.newsletterForm.reset();
        }
    });
});

function applySort(order) {
    const sortInput = document.getElementById('sortOrderInput');
    const filterForm = document.getElementById('filterForm');
    if (sortInput && filterForm) {
        sortInput.value = order;
        filterForm.submit();
    }
}

function updateCardPrice(cardId) {
    const card = document.getElementById(cardId);
    if (!card) return;

    const checkboxes = card.querySelectorAll('.itinerary-row input[type="checkbox"]');
    const cbArr = Array.from(checkboxes);
    
    // Se todos estiverem desmarcados, marca o primeiro (Ida) por padrão
    if (cbArr.length > 0 && cbArr.every(cb => !cb.checked)) {
        cbArr[0].checked = true;
    }

    let total = 0;
    let ida = false, volta = false;
    if (cbArr[0]) ida = cbArr[0].checked;
    if (cbArr[1]) volta = cbArr[1].checked;

    cbArr.forEach(cb => {
        if (cb.checked) {
            total += parseFloat(cb.dataset.price) || 0;
        }
    });

    const priceEl = document.getElementById('price-' + cardId);
    if (priceEl) {
        priceEl.textContent = 'R$ ' + total.toFixed(2).replace('.', ',');
    }

    const link = document.getElementById('link-' + cardId);
    if (link) {
        const base = link.href.split('?')[0];
        link.href = base + '?ida=' + ida + '&volta=' + volta;
    }
}
