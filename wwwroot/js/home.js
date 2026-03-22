/**
 * Lógica da Página Inicial (Simplificado)
 */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Cache de Elementos
    const DOM = {
        btnShowPlaces: document.querySelector('.btn-show-places'),
        bookBtns: document.querySelectorAll('.btn-book, .btn-book-white'),
        newsletterForm: document.querySelector('.newsletter-form')
    };

    // --- NAVEGAÇÃO ---

    DOM.btnShowPlaces?.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = 'hotel-listing.html';
    });

    DOM.bookBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            window.location.href = 'flight-booking.html';
        });
    });

    // --- NEWSLETTER ---

    DOM.newsletterForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = DOM.newsletterForm.querySelector('input')?.value;
        if (email) {
            alert(`Obrigado: ${email}`);
            DOM.newsletterForm.reset();
        }
    });
});
