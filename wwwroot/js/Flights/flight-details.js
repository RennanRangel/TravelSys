document.addEventListener('DOMContentLoaded', () => {
    
    const DOM = {
        favoriteBtn: document.querySelector('.btn-icon.favorite'),
        shareBtn: document.querySelector('.btn-icon.share'),
    };

    // Heart toggle
    DOM.favoriteBtn?.addEventListener('click', () => {
        const icon = DOM.favoriteBtn.querySelector('i');
        if (icon) {
            const isSaved = icon.classList.contains('fas');
            icon.classList.toggle('fas', !isSaved);
            icon.classList.toggle('far', isSaved);
            icon.style.color = isSaved ? '' : '#ff385c';
        }
    });

    // Share button simulation
    DOM.shareBtn?.addEventListener('click', () => {
        if (navigator.share) {
            navigator.share({
                title: document.title,
                url: window.location.href
            }).catch(() => {});
        } else {
            // Fallback copy to clipboard
            navigator.clipboard.writeText(window.location.href).then(() => {
                alert('Link do voo copiado para a área de transferência!');
            });
        }
    });
});

// Updates dynamic price based on selected cabin class and round trip multiplier
function updateFlightPrice(baseVal, name, className, multiplier) {
    const priceDisplay = document.getElementById('flight-price-display');
    const titleDisplay = document.getElementById('features-title-display');
    const classInput = document.getElementById('flightClassInput');
    
    const finalPrice = parseFloat(baseVal) * (multiplier || 1);
    
    if (priceDisplay) {
        priceDisplay.innerHTML = 'R$ ' + finalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    if (titleDisplay) {
        titleDisplay.innerHTML = name;
    }
    if (classInput) {
        classInput.value = className;
    }
}
