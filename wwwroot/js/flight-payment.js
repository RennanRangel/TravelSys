document.addEventListener('DOMContentLoaded', function () {
    const modal = document.getElementById('addCardModal');
    const openBtn = document.getElementById('addNewCardBtn');
    const closeBtn = document.querySelector('.close-modal');
    const addCardForm = document.querySelector('.add-card-form');

    if (openBtn) {
        openBtn.addEventListener('click', function () {
            modal.classList.add('active');
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', function () {
            modal.classList.remove('active');
        });
    }

    window.addEventListener('click', function (e) {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });

    const paymentOptions = document.querySelectorAll('.payment-card');
    const totalPriceDisplay = document.getElementById('totalPriceDisplay');
    const selectedPaymentTypeInput = document.getElementById('selectedPaymentType');

    paymentOptions.forEach(option => {
        option.addEventListener('click', function () {
            paymentOptions.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');

            const radio = this.querySelector('input[type="radio"]');
            if (radio) radio.checked = true;

            const amount = this.getAttribute('data-amount');
            if (amount && totalPriceDisplay) {
                const cleanAmount = amount.replace(',', '.');
                const parsedAmount = parseFloat(cleanAmount);
                if (!isNaN(parsedAmount)) {
                    totalPriceDisplay.textContent = '$' + parsedAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                }
            }

            const type = this.getAttribute('data-type');
            if (type && selectedPaymentTypeInput) {
                selectedPaymentTypeInput.value = type;
            }
        });
    });

    const savedCards = document.querySelectorAll('.saved-card');
    savedCards.forEach(card => {
        card.addEventListener('click', function () {
            savedCards.forEach(c => c.classList.remove('selected'));
            this.classList.add('selected');
        });
    });
});
