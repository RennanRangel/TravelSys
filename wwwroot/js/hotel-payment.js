/**
 * Gerenciamento de Pagamento de Hotel (Simplificado e Eficiente)
 */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Cache de Elementos (querySelector para consistência)
    const DOM = {
        containerCheckout: document.querySelector('.checkout-pagamento'),
        listaCartoes: document.querySelector('.lista-cartoes'),
        btnAdicionarCartao: document.querySelector('#addNewCardBtn'),
        modal: document.querySelector('#addCardModal'),
        fecharModal: document.querySelector('.modal-sistema__fechar'),
        displayPreco: document.querySelector('#totalPriceDisplay'),
        inputTipoPagamento: document.querySelector('#selectedPaymentType'),
        formFinalizar: document.querySelector('.form-pagamento-final'),
        btnSubmeter: document.querySelector('.btn-acao--primario')
    };

    if (!DOM.containerCheckout && !DOM.listaCartoes) return;

    // --- FUNÇÕES DE LÓGICA ---

    const handleSelecaoPagamento = (elemento) => {
        // Limpar estados anteriores
        DOM.containerCheckout.querySelectorAll('.checkout-pagamento__item').forEach(el => {
            el.classList.remove('checkout-pagamento__item--selecionado');
        });

        // Ativar seleção atual
        elemento.classList.add('checkout-pagamento__item--selecionado');
        const radio = elemento.querySelector('input[type="radio"]');
        if (radio) radio.checked = true;

        // Atualizar Preço (Parsing seguro)
        const valorRaw = elemento.dataset.amount;
        if (valorRaw && DOM.displayPreco) {
            const valor = parseFloat(valorRaw.replace(',', '.'));
            if (!isNaN(valor)) {
                DOM.displayPreco.textContent = `$${valor.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
            }
        }

        if (DOM.inputTipoPagamento) {
            DOM.inputTipoPagamento.value = elemento.dataset.type;
        }
    };

    const handleSelecaoCartao = (elemento) => {
        DOM.listaCartoes.querySelectorAll('.cartao-salvo').forEach(c => {
            c.classList.remove('cartao-salvo--selecionado');
        });
        elemento.classList.add('cartao-salvo--selecionado');
    };

    const toggleModal = (exibir) => {
        const classeAtiva = 'modal-sistema--ativo';
        exibir ? DOM.modal?.classList.add(classeAtiva) : DOM.modal?.classList.remove(classeAtiva);
    };

    const handleSubmissao = (e) => {
        const btn = DOM.btnSubmeter;
        if (!btn || btn.classList.contains('btn-acao--loading')) {
            e.preventDefault();
            return;
        }
        btn.classList.add('btn-acao--loading');
        btn.disabled = true;
    };

    // --- REGISTRO DE EVENTOS (Delegation) ---

    DOM.containerCheckout?.addEventListener('click', (e) => {
        const item = e.target.closest('.checkout-pagamento__item');
        if (item) handleSelecaoPagamento(item);
    });

    DOM.listaCartoes?.addEventListener('click', (e) => {
        if (e.target.closest('.cartao-salvo__deletar')) return;
        const card = e.target.closest('.cartao-salvo');
        if (card) handleSelecaoCartao(card);
    });

    DOM.btnAdicionarCartao?.addEventListener('click', () => toggleModal(true));
    DOM.fecharModal?.addEventListener('click', () => toggleModal(false));

    window.addEventListener('click', (e) => {
        if (e.target === DOM.modal) toggleModal(false);
    });

    DOM.formFinalizar?.addEventListener('submit', handleSubmissao);
});
