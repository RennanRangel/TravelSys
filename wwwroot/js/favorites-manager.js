/**
 * Gerenciamento de Favoritos (Voo e Hotel)
 */
const FavoritesManager = {
    initButtons: function() {
        const favoriteBtns = document.querySelectorAll('.favorite-btn, .heart-btn');
        favoriteBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                btn.classList.toggle('active');
                
                const icon = btn.querySelector('i');
                if (icon) {
                    if (btn.classList.contains('active')) {
                        icon.classList.remove('fa-regular');
                        icon.classList.add('fa-solid');
                    } else {
                        icon.classList.remove('fa-solid');
                        icon.classList.add('fa-regular');
                    }
                }
            });
        });
    }
};

// Auto-inicialização global
document.addEventListener('DOMContentLoaded', () => {
    FavoritesManager.initButtons();
});
