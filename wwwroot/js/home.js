// JS/home.js

document.addEventListener('DOMContentLoaded', () => {
    // Search Form Navigation
    const showPlacesBtn = document.querySelector('.btn-show-places');

    if (showPlacesBtn) {
        showPlacesBtn.addEventListener('click', (e) => {
            e.preventDefault();
            // Assuming this button is for "Stays" as per the design context (bed icon in destination)
            // But it could be context dependent. For now, linking to hotel-listing.
            window.location.href = 'hotel-listing.html';
        });
    }

    // Book Flight Buttons
    const bookButtons = document.querySelectorAll('.btn-book, .btn-book-white');
    bookButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            window.location.href = 'flight-booking.html';
        });
    });

    // Newsletter Subscription
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = newsletterForm.querySelector('input').value;
            if (email) {
                alert(`Thank you for subscribing with ${email}!`);
                newsletterForm.reset();
            }
        });
    }
});
