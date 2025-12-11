// Function to handle payment selection
window.selectPayment = function (type) {
    // Update radio buttons
    const radios = document.getElementsByName('paymentType');
    radios.forEach(radio => {
        if (radio.value === type) {
            radio.checked = true;
        }
    });

    // Update visual state
    // Reset all circles
    const fullCircle = document.getElementById('radio-full');
    const partCircle = document.getElementById('radio-part');

    if (fullCircle) fullCircle.classList.remove('selected');
    if (partCircle) partCircle.classList.remove('selected');

    // Select the clicked one
    const selectedCircle = document.getElementById('radio-' + type);
    if (selectedCircle) {
        selectedCircle.classList.add('selected');
    }
}

document.addEventListener('DOMContentLoaded', function () {
    // Login Form
    const loginForm = document.querySelector('.login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const phone = this.querySelector('.phone-input').value;
            if (phone) {
                console.log('Login with phone:', phone);
                // Simulate verification and redirect
                alert('Verification code sent to ' + phone + '. Redirecting to payment...');
                // window.location.href = 'flight-payment.html'; // Removed to prevent redirect during demo
            } else {
                alert('Please enter your phone number');
            }
        });
    }

    // Social Login Buttons
    const socialBtns = document.querySelectorAll('.btn-social');
    socialBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            alert('Social login functionality would open here.');
        });
    });

    // Email Login Button
    const emailBtn = document.querySelector('.btn-email-login');
    if (emailBtn) {
        emailBtn.addEventListener('click', function () {
            alert('Email login form would open here.');
        });
    }

    // Newsletter Form
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            if (email) {
                console.log('Newsletter subscription:', email);
                alert('Thank you for subscribing!');
                this.reset();
            }
        });
    }
});
