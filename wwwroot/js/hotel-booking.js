/**
 * Gerenciamento de Reserva de Hotel (Simplificado)
 */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Cache de Elementos
    const DOM = {
        paymentCards: document.querySelectorAll('.payment-card'),
        savedCards: document.querySelectorAll('.saved-card'),
        btnNovoCartao: document.querySelector('#addNewCardBtn'),
        modal: document.querySelector('#addCardModal'),
        fecharModal: document.querySelector('.close-modal'),
        formAddCartao: document.querySelector('.add-card-form'),
        formNewsletter: document.querySelector('.newsletter-form')
    };

    // --- FUNÇÕES DE LÓGICA ---

    const removeSelection = (selector) => {
        document.querySelectorAll(selector).forEach(el => {
            el.classList.remove('selected');
            const circle = el.querySelector('.radio-circle');
            if (circle) {
                circle.classList.remove('selected');
                circle.querySelector('.inner-circle')?.remove();
            }
        });
    };

    const applySelection = (el) => {
        el.classList.add('selected');
        const circle = el.querySelector('.radio-circle');
        if (circle) {
            circle.classList.add('selected');
            if (!circle.querySelector('.inner-circle')) {
                const inner = document.createElement('div');
                inner.className = 'inner-circle';
                circle.appendChild(inner);
            }
        }
        const radio = el.querySelector('input[type="radio"]');
        if (radio) radio.checked = true;
    };

    // --- SELEÇÃO DE PAGAMENTO ---

    DOM.paymentCards.forEach(card => {
        card.addEventListener('click', () => {
            removeSelection('.payment-card');
            applySelection(card);
        });
    });

    DOM.savedCards.forEach(card => {
        card.addEventListener('click', () => {
            removeSelection('.saved-card');
            applySelection(card);
        });
    });

    // --- MODAL E FORMULÁRIO ---

    DOM.btnNovoCartao?.addEventListener('click', () => DOM.modal?.classList.add('active'));
    DOM.fecharModal?.addEventListener('click', () => DOM.modal?.classList.remove('active'));
    DOM.modal?.addEventListener('click', (e) => { if (e.target === DOM.modal) DOM.modal.classList.remove('active'); });

    DOM.formAddCartao?.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = DOM.formAddCartao.querySelector('.btn-add-card');
        if (btn) btn.textContent = 'Processando...';

        setTimeout(() => {
            alert('Pagamento realizado com sucesso!');
            window.location.href = 'hotel-ticket.html';
        }, 1500);
    });

    DOM.formNewsletter?.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Obrigado por se inscrever!');
        DOM.formNewsletter.reset();
    });
});
