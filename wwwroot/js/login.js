// Login page carousel functionality
const images = [
    'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&h=1600&fit=crop',
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&h=1600&fit=crop',
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&h=1600&fit=crop'
];

let currentImageIndex = 0;
const imageElement = document.querySelector('.login-right img');
const indicators = document.querySelectorAll('.indicator');

if (imageElement && indicators.length > 0) {
    // Function to change image
    function changeImage(index) {
        currentImageIndex = index;
        imageElement.src = images[currentImageIndex];

        // Update indicators
        indicators.forEach((indicator, i) => {
            if (i === currentImageIndex) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
    }

    // Add click event to indicators
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            changeImage(index);
        });
    });

    // Auto-change image every 5 seconds
    setInterval(() => {
        currentImageIndex = (currentImageIndex + 1) % images.length;
        changeImage(currentImageIndex);
    }, 5000);
}

// Toggle password visibility
const togglePassword = document.querySelector('.toggle-password');
const passwordInput = document.getElementById('password');

if (togglePassword && passwordInput) {
    togglePassword.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);

        const icon = togglePassword.querySelector('i');
        if (type === 'password') {
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
      }
    });
}
