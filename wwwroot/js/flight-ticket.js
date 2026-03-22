/**
 * Gerenciador de Bilhetes de Voo (Simplificado)
 */
document.addEventListener('DOMContentLoaded', () => {
    const DOM = {
        botaoDownload: document.querySelector('.btn-download'),
        botaoCompartilhar: document.querySelector('.btn-icon')
    };

    const config = {
        tituloVoo: 'Flight Ticket - Golobe',
        mensagemCompartilhamento: 'Confira meu voo para Istambul!'
    };

    const baixarCartaoEmbarque = () => {
        alert('Baixando cartão de embarque...');
    };

    const copiarLinkParaTransferencia = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            alert('Link da passagem copiado para a área de transferência!');
        } catch (erro) {
            alert('Não foi possível copiar o link automaticamente.');
        }
    };

    const compartilharVoo = async () => {
        const dados = {
            title: config.tituloVoo,
            text: config.mensagemCompartilhamento,
            url: window.location.href
        };

        try {
            if (navigator.share) {
                await navigator.share(dados);
            } else {
                await copiarLinkParaTransferencia();
            }
        } catch (erro) {
            if (erro.name !== 'AbortError') {
                await copiarLinkParaTransferencia();
            }
        }
    };

    DOM.botaoDownload?.addEventListener('click', baixarCartaoEmbarque);
    DOM.botaoCompartilhar?.addEventListener('click', compartilharVoo);
});
