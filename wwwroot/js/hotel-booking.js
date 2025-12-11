// Payment option selection
function selectPaymentOption(element) {
    document.querySelectorAll('.payment-card').forEach(card => {
        card.classList.remove('selected');
        const circle = card.querySelector('.radio-circle');
        if (circle) {
            circle.classList.remove('selected');
            const inner = circle.querySelector('.inner-circle');
            if (inner) inner.remove();
        }
    });

    element.classList.add('selected');
    const circle = element.querySelector('.radio-circle');
    if (circle) {
        circle.classList.add('selected');
        if (!circle.querySelector('.inner-circle')) {
            const innerCircle = document.createElement('div');
            innerCircle.className = 'inner-circle';
            circle.appendChild(innerCircle);
        }
    }

    const radio = element.querySelector('input[type="radio"]');
    if (radio) radio.checked = true;
}

// Card selection
function selectCard(element) {
    document.querySelectorAll('.saved-card').forEach(card => {
        card.classList.remove('selected');
        const circle = card.querySelector('.radio-circle');
        if (circle) {
            circle.classList.remove('selected');
            const inner = circle.querySelector('.inner-circle');
            if (inner) inner.remove();
        }
    });

    element.classList.add('selected');
    const circle = element.querySelector('.radio-circle');
    if (circle) {
        circle.classList.add('selected');
        if (!circle.querySelector('.inner-circle')) {
            const innerCircle = document.createElement('div');
            innerCircle.className = 'inner-circle';
            circle.appendChild(innerCircle);
        }
    }
}

// Modal functionality
const addNewCardBtn = document.getElementById('addNewCardBtn');
const modal = document.getElementById('addCardModal');
const closeModalBtn = document.querySelector('.close-modal');

if (addNewCardBtn) {
    addNewCardBtn.addEventListener('click', () => {
        modal.classList.add('active');
    });
}

if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
        modal.classList.remove('active');
    });
}

if (modal) {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
}

// Form submission
const addCardForm = document.querySelector('.add-card-form');
if (addCardForm) {
    addCardForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Simulate processing
        const btn = addCardForm.querySelector('.btn-add-card');
        const originalText = btn.innerText;
        btn.innerText = 'Processing...';

        setTimeout(() => {
            alert('Payment successful!');
            window.location.href = 'hotel-ticket.html';
        }, 1500);
    });
}

// Newsletter form
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = newsletterForm.querySelector('input[type="email"]').value;
        if (email) {
            alert('Thank you for subscribing!');
            newsletterForm.reset();
        }
    });
}

// Payment card click handlers
document.querySelectorAll('.payment-card').forEach(card => {
    card.addEventListener('click', function () {
        selectPaymentOption(this);
    });
});

// Saved card click handlers
document.querySelectorAll('.saved-card').forEach(card => {
    card.addEventListener('click', function () {
        selectCard(this);
    });
});
