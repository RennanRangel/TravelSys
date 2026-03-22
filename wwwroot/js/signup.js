/**
 * Gerenciamento de Cadastro (Carrossel & Validação)
 */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Cache de Elementos
    const DOM = {
        image: document.querySelector('.signup-left img'),
        indicators: document.querySelectorAll('.indicator'),
        toggleBtns: document.querySelectorAll('.toggle-password'),
        form: document.querySelector('.signup-form'),
        password: document.querySelector('#password'),
        confirm: document.querySelector('#confirmPassword')
    };

    const images = [
        'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&h=1600&fit=crop',
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&h=1600&fit=crop',
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&h=1600&fit=crop'
    ];

    let currentIndex = 0;

    // --- CARROSSEL ---

    const changeImage = (index) => {
        if (!DOM.image) return;
        currentIndex = index;
        DOM.image.src = images[currentIndex];
        DOM.indicators.forEach((ind, i) => ind.classList.toggle('active', i === currentIndex));
    };

    if (DOM.image && DOM.indicators.length > 0) {
        DOM.indicators.forEach((ind, i) => ind.addEventListener('click', () => changeImage(i)));
        setInterval(() => {
            currentIndex = (currentIndex + 1) % images.length;
            changeImage(currentIndex);
        }, 5000);
    }

    // --- VISIBILIDADE DA SENHA ---

    DOM.toggleBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const input = this.previousElementSibling;
            const icon = this.querySelector('i');
            if (!input || !icon) return;

            const isLocked = input.type === 'password';
            input.type = isLocked ? 'text' : 'password';
            icon.classList.toggle('fa-eye', isLocked);
            icon.classList.toggle('fa-eye-slash', !isLocked);
        });
    });

    // --- VALIDAÇÃO ---

    if (DOM.form) {
        DOM.form.addEventListener('submit', (e) => {
            const pass = DOM.password?.value || '';
            const conf = DOM.confirm?.value || '';

            if (pass !== conf) {
                e.preventDefault();
                alert('As senhas não coincidem!');
                return;
            }

            if (pass.length < 6) {
                e.preventDefault();
                alert('A senha deve ter pelo menos 6 caracteres!');
            }
        });
    }
});
