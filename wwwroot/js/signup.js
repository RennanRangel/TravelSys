// ========================================
// SIGNUP PAGE - JavaScript
// ========================================

document.addEventListener('DOMContentLoaded', function () {

    // ========================================
    // 1. CAROUSEL DE IMAGENS
    // ========================================
    const images = [
        'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&h=1600&fit=crop',
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&h=1600&fit=crop',
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&h=1600&fit=crop'
    ];

    let currentImageIndex = 0;
    const imageElement = document.querySelector('.signup-left img');
    const indicators = document.querySelectorAll('.indicator');

    function changeImage(index) {
        if (!imageElement) return;

        currentImageIndex = index;
        imageElement.src = images[currentImageIndex];

        indicators.forEach((indicator, i) => {
            indicator.classList.toggle('active', i === currentImageIndex);
        });
    }

    // Click nos indicadores
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => changeImage(index));
    });

    // Auto-rotate a cada 5 segundos
    if (imageElement) {
        setInterval(() => {
            currentImageIndex = (currentImageIndex + 1) % images.length;
            changeImage(currentImageIndex);
        }, 5000);
    }

    // ========================================
    // 2. TOGGLE DE VISIBILIDADE DA SENHA
    // ========================================
    const togglePasswordButtons = document.querySelectorAll('.toggle-password');

    togglePasswordButtons.forEach(button => {
        button.addEventListener('click', function () {
            const passwordInput = this.previousElementSibling;
            const icon = this.querySelector('i');

            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            } else {
                passwordInput.type = 'password';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            }
        });
    });

    // ========================================
    // 3. VALIDAÇÃO DO FORMULÁRIO (CLIENT-SIDE)
    // ========================================
    const signupForm = document.querySelector('.signup-form');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');

    if (signupForm) {
        signupForm.addEventListener('submit', function (e) {
            const password = passwordInput ? passwordInput.value : '';
            const confirmPassword = confirmPasswordInput ? confirmPasswordInput.value : '';

            // Validar se as senhas coincidem
            if (password !== confirmPassword) {
                e.preventDefault();
                alert('As senhas não coincidem!');
                return false;
            }

            // Validar tamanho mínimo da senha
            if (password.length < 6) {
                e.preventDefault();
                alert('A senha deve ter pelo menos 6 caracteres!');
                return false;
            }

            // Formulário válido - deixar o ASP.NET processar
            return true;
        });
    }

});
