/**
 * Gerenciamento de Pagamento de Voo (Simplificado e Eficiente)
 */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Cache de Elementos
    const DOM = {
        opcoesPagamento: document.querySelector('.checkout-pagamento'),
        listaCartoes: document.querySelector('.lista-cartoes'),
        btnNovoCartao: document.querySelector('#addNewCardBtn'),
        modalCartao: document.querySelector('#addCardModal'),
        fecharModal: document.querySelector('.modal-sistema__fechar'),
        totalDisplay: document.querySelector('#totalPriceDisplay'),
        paymentTypeInput: document.querySelector('#selectedPaymentType'),
        formFinal: document.querySelector('.form-pagamento-final'),
        btnFinalizar: document.querySelector('.btn-acao--primario')
    };


    // --- FUNÇÕES DE LÓGICA ---

    const handleSelecaoPagamento = (elemento) => {
        DOM.opcoesPagamento.querySelectorAll('.checkout-pagamento__item').forEach(c => {
            c.classList.remove('checkout-pagamento__item--selecionado');
        });

        elemento.classList.add('checkout-pagamento__item--selecionado');
        const radio = elemento.querySelector('input[type="radio"]');
        if (radio) radio.checked = true;

        const valorRaw = elemento.dataset.amount;
        if (valorRaw && DOM.totalDisplay) {
            const valor = parseFloat(valorRaw.replace(',', '.'));
            if (!isNaN(valor)) {
                DOM.totalDisplay.textContent = `$${valor.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
            }
        }

        if (DOM.paymentTypeInput) {
            DOM.paymentTypeInput.value = elemento.dataset.type;
        }
    };

    const handleSelecaoCartao = (elemento) => {
        DOM.listaCartoes.querySelectorAll('.cartao-salvo').forEach(c => {
            c.classList.remove('cartao-salvo--selecionado');
        });
        elemento.classList.add('cartao-salvo--selecionado');
    };

    const toggleModal = (mostrar) => {
        const classe = 'modal-sistema--ativo';
        mostrar ? DOM.modalCartao?.classList.add(classe) : DOM.modalCartao?.classList.remove(classe);
    };

    const handleSubmissao = (e) => {
        const btn = DOM.btnFinalizar;
        if (!btn || btn.classList.contains('btn-acao--loading')) {
            e.preventDefault();
            return;
        }
        btn.classList.add('btn-acao--loading');
        btn.disabled = true;
    };

    // --- REGISTRO DE EVENTOS (Delegation) ---

    DOM.opcoesPagamento?.addEventListener('click', (e) => {
        const item = e.target.closest('.checkout-pagamento__item');
        if (item) handleSelecaoPagamento(item);
    });

    DOM.listaCartoes?.addEventListener('click', (e) => {
        if (e.target.closest('.cartao-salvo__deletar')) return;
        const card = e.target.closest('.cartao-salvo');
        if (card) handleSelecaoCartao(card);
    });

    DOM.btnNovoCartao?.addEventListener('click', () => toggleModal(true));
    DOM.fecharModal?.addEventListener('click', () => toggleModal(false));

    window.addEventListener('click', (e) => {
        if (e.target === DOM.modalCartao) toggleModal(false);
    });

    DOM.formFinal?.addEventListener('submit', handleSubmissao);
});

function selectPlan(type) {
    document.querySelectorAll('.plan-option').forEach(opt => opt.classList.remove('selected'));
    const planEl = document.getElementById('plan-' + type);
    if (planEl) planEl.classList.add('selected');
    const paymentTypeInput = document.getElementById('paymentTypeInput');
    if (paymentTypeInput) paymentTypeInput.value = type;
}

function openAddCardModal() {
    const modal = document.getElementById('addCardModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeAddCardModal() {
    const modal = document.getElementById('addCardModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}
