document.addEventListener('DOMContentLoaded', () => {
    
    const DOM = {
        btnDownload: document.querySelector('.btn-download'),
        btnShare: document.querySelector('.btn-icon')
    };


    DOM.btnDownload?.addEventListener('click', () => {
        alert('Baixando reserva do hotel...');
    });


    DOM.btnShare?.addEventListener('click', () => {
        if (navigator.share) {
            navigator.share({
                title: 'Reserva de Hotel - CVK Park Bosphorus',
                text: 'Confira minha reserva!',
                url: window.location.href
            }).catch(console.error);
        } else {
            alert('URL copiada para a área de transferência!');
        }
    });
});
