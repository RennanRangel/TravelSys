document.addEventListener('DOMContentLoaded', () => {
    
    const DOM = {
        filterHeaders: document.querySelectorAll('.filter-header'),
        sortTabs: document.querySelectorAll('.sort-tab'),
        favoriteBtns: document.querySelectorAll('.btn-favorite'),
        priceSliders: document.querySelectorAll('.price-range .range-slider'),
        priceLabels: document.querySelectorAll('.price-labels span'),
        newsletterForm: document.querySelector('.newsletter-form'),
        searchBtn: document.querySelector('.btn-search'),
        hotelCardsContainer: document.querySelector('.hotel-cards'),
        resultsInfo: document.querySelector('.results-info p')
    };


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


    DOM.hotelCardsContainer?.addEventListener('click', (e) => {
        const btn = e.target.closest('.btn-favorite');
        if (btn) {
            const icon = btn.querySelector('i');
            if (icon) {
                icon.classList.toggle('fas');
                icon.classList.toggle('far');
            }
        }
    });


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


    DOM.newsletterForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = DOM.newsletterForm.querySelector('input[type="email"]')?.value;
        if (email) {
            alert('Obrigado por se inscrever!');
            DOM.newsletterForm.reset();
        }
    });

    DOM.searchBtn?.addEventListener('click', (e) => {
        e.preventDefault();
    });
});

function applyPropertyType(type) {
    const propertyTypeInput = document.getElementById('propertyTypeInput');
    const filterForm = document.getElementById('filterForm');
    if (propertyTypeInput && filterForm) {
        var current = propertyTypeInput.value;
        if (current === type) {
            propertyTypeInput.value = ""; 
        } else {
            propertyTypeInput.value = type;
        }
        filterForm.submit();
    }
}
