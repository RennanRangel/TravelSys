/**
 * Gerenciamento de Página de Voos (Simplificado)
 */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Cache de Elementos
    const DOM = {
        tabBtns: document.querySelectorAll('.tab-btn'),
        searchForm: document.querySelector('.search-form'),
        newsletterForm: document.querySelector('.newsletter-form'),
        markers: document.querySelectorAll('.location-marker')
    };

    // --- ABAS ---

    DOM.tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            DOM.tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    // --- FORMULÁRIOS ---

    DOM.searchForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        console.log('Busca de voos submetida');
    });

    DOM.newsletterForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Obrigado por se inscrever!');
        DOM.newsletterForm.reset();
    });

    // --- ANIMAÇÃO DE MARCADORES ---

    DOM.markers.forEach((marker, i) => {
        setTimeout(() => {
            marker.style.opacity = '0';
            marker.style.transform = 'scale(0)';
            setTimeout(() => {
                marker.style.transition = 'all 0.3s ease';
                marker.style.opacity = '1';
                marker.style.transform = 'scale(1)';
            }, 100);
        }, i * 200);
    });
});
