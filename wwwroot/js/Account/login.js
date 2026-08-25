document.addEventListener('DOMContentLoaded', () => {
    
    const DOM = {
        image: document.querySelector('.login-right img'),
        indicators: document.querySelectorAll('.indicator'),
        togglePassword: document.querySelector('.toggle-password'),
        passwordInput: document.querySelector('#password')
    };

    const images = [
        'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&h=1600&fit=crop',
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&h=1600&fit=crop',
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&h=1600&fit=crop'
    ];

    let currentIndex = 0;


    const changeImage = (index) => {
        if (!DOM.image) return;
        currentIndex = index;
        DOM.image.src = images[currentIndex];
        
        DOM.indicators.forEach((ind, i) => {
            ind.classList.toggle('active', i === currentIndex);
        });
    };

    if (DOM.image && DOM.indicators.length > 0) {
        DOM.indicators.forEach((ind, i) => {
            ind.addEventListener('click', () => changeImage(i));
        });

        setInterval(() => {
            currentIndex = (currentIndex + 1) % images.length;
            changeImage(currentIndex);
        }, 5000);
    }


    if (DOM.togglePassword && DOM.passwordInput) {
        DOM.togglePassword.addEventListener('click', () => {
            const isPassword = DOM.passwordInput.type === 'password';
            DOM.passwordInput.type = isPassword ? 'text' : 'password';
            
            const icon = DOM.togglePassword.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-eye', isPassword);
                icon.classList.toggle('fa-eye-slash', !isPassword);
            }
        });
    }
});
