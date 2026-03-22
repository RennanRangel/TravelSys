/**
 * Gerenciamento de Bilhete de Hotel (Simplificado)
 */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Cache de Elementos
    const DOM = {
        btnDownload: document.querySelector('.btn-download'),
        btnShare: document.querySelector('.btn-icon')
    };

    // --- DOWNLOAD ---

    DOM.btnDownload?.addEventListener('click', () => {
        alert('Baixando reserva do hotel...');
    });

    // --- COMPARTILHAMENTO ---

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
