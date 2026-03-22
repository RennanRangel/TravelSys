/**
 * Gerenciamento de Conta (Arquitetura Simplificada e Eficiente)
 */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Cache de Elementos (querySelector Universal)
    const DOM = {
        tabBtns: document.querySelectorAll('.tab-btn'),
        tabContents: document.querySelectorAll('.tab-content'),
        subTabBtns: document.querySelectorAll('.sub-tab-btn'),
        subTabContents: document.querySelectorAll('.sub-tab-content'),
        uploadCoverBtn: document.querySelector('.btn-upload-cover'),
        uploadCoverInput: document.querySelector('#upload-cover'),
        coverImageDisplay: document.querySelector('#cover-image-display'),
        editPicBtn: document.querySelector('.btn-edit-pic'),
        uploadProfileInput: document.querySelector('#upload-profile'),
        profilePicDisplay: document.querySelector('#profile-pic-display'),
        changeBtns: document.querySelectorAll('.btn-change'),
        addEmailBtn: document.querySelector('.btn-add-email'),
        newsletterForm: document.querySelector('.newsletter-form'),
        accountFirstName: document.querySelector('#account-firstname'),
        accountLastName: document.querySelector('#account-lastname'),
        accountEmail: document.querySelector('#account-email'),
        accountPhone: document.querySelector('#account-phone'),
        addCardBox: document.querySelector('.add-card-box'),
        addCardModal: document.querySelector('#addCardModal'),
        closeCardModalBtn: document.querySelector('.btn-close-modal'),
        paymentGrid: document.querySelector('.payment-methods-grid'),
        addCardForm: document.querySelector('.add-card-form')
    };

    // --- FUNÇÕES DE AUXÍLIO ---

    const updateHeaders = (userData) => {
        const fullName = `${userData.firstName} ${userData.lastName}`;
        const headerProfileName = document.querySelector('.user-profile span');
        const dropdownName = document.querySelector('.user-info h4');
        const profileHeaderName = document.querySelector('.user-name');
        const profileHeaderEmail = document.querySelector('.user-email');

        if (headerProfileName) headerProfileName.textContent = userData.firstName;
        if (dropdownName) dropdownName.textContent = fullName;
        if (profileHeaderName) profileHeaderName.textContent = fullName;
        if (profileHeaderEmail) profileHeaderEmail.textContent = userData.email;
    };

    const addCardToUI = (card) => {
        const cardElement = document.createElement('div');
        cardElement.className = 'payment-card';
        cardElement.innerHTML = `
            <div class="card-top">
                <span class="card-number">${card.number}</span>
                <button class="btn-delete-card"><i class="fas fa-trash-alt"></i></button>
            </div>
            <div class="card-bottom">
                <div class="card-info">
                    <span class="label">Valid Thru</span>
                    <span class="value">${card.exp}</span>
                </div>
                <div class="card-brand">
                    <i class="fab fa-cc-${card.type}"></i>
                </div>
            </div>
        `;
        if (DOM.paymentGrid && DOM.addCardBox) {
            DOM.paymentGrid.insertBefore(cardElement, DOM.addCardBox);
        }
    };

    const saveCardToStorage = (card) => {
        let cards = JSON.parse(localStorage.getItem('userCards')) || [];
        cards.push(card);
        localStorage.setItem('userCards', JSON.stringify(cards));
    };

    const removeCardFromStorage = (cardNumber) => {
        let cards = JSON.parse(localStorage.getItem('userCards')) || [];
        cards = cards.filter(c => c.number !== cardNumber);
        localStorage.setItem('userCards', JSON.stringify(cards));
    };

    const loadCards = () => {
        const cards = JSON.parse(localStorage.getItem('userCards')) || [];
        cards.forEach(card => addCardToUI(card));
    };

    // --- LÓGICA DE ABAS ---

    DOM.tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            DOM.tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            DOM.tabContents.forEach(content => content.classList.remove('active'));
            
            const tabId = btn.getAttribute('data-tab');
            const targetContent = document.querySelector(`#${tabId}`);
            if (targetContent) targetContent.classList.add('active');
        });
    });

    DOM.subTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            DOM.subTabBtns.forEach(b => b.classList.remove('active'));
            DOM.subTabContents.forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            
            const subTabId = btn.getAttribute('data-subtab');
            const targetSubContent = document.querySelector(`#${subTabId}`);
            if (targetSubContent) targetSubContent.classList.add('active');
        });
    });

    // --- UPLOADS DE IMAGEM ---

    if (DOM.uploadCoverBtn && DOM.uploadCoverInput) {
        DOM.uploadCoverBtn.addEventListener('click', () => DOM.uploadCoverInput.click());
        DOM.uploadCoverInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const imageUrl = event.target.result;
                    if (DOM.coverImageDisplay) DOM.coverImageDisplay.style.backgroundImage = `url('${imageUrl}')`;
                    localStorage.setItem('userCover', imageUrl);
                };
                reader.readAsDataURL(file);
            }
        });
    }

    if (DOM.editPicBtn && DOM.uploadProfileInput) {
        DOM.editPicBtn.addEventListener('click', () => DOM.uploadProfileInput.click());
        DOM.uploadProfileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const imageUrl = event.target.result;
                    if (DOM.profilePicDisplay) DOM.profilePicDisplay.src = imageUrl;
                    localStorage.setItem('userProfilePic', imageUrl);
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Carregar imagens salvas
    const savedCover = localStorage.getItem('userCover');
    if (savedCover && DOM.coverImageDisplay) DOM.coverImageDisplay.style.backgroundImage = `url('${savedCover}')`;
    const savedProfilePic = localStorage.getItem('userProfilePic');
    if (savedProfilePic && DOM.profilePicDisplay) DOM.profilePicDisplay.src = savedProfilePic;

    // --- EDIÇÃO INLINE DE DETALHES ---

    DOM.changeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const field = btn.getAttribute('data-field');
            const row = btn.closest('.detail-row');
            const valueElement = row.querySelector('.value');
            const isEditing = btn.classList.contains('editing');

            if (!isEditing) {
                const currentValue = valueElement.textContent;
                let inputType = 'text';
                if (field === 'email') inputType = 'email';
                if (field === 'password') inputType = 'password';
                if (field === 'phone') inputType = 'tel';

                const input = document.createElement('input');
                input.type = inputType;
                input.value = field === 'password' ? '' : currentValue;
                input.className = 'edit-input';
                if (field === 'password') input.placeholder = 'Nova senha';

                valueElement.innerHTML = '';
                valueElement.appendChild(input);
                input.focus();

                btn.innerHTML = '<i class="fas fa-check"></i> Salvar';
                btn.classList.add('editing');
            } else {
                const input = valueElement.querySelector('input');
                const newValue = input.value.trim();

                if (!newValue && field !== 'password') {
                    alert('O campo não pode estar vazio');
                    return;
                }

                if (field === 'password' && !newValue) {
                    valueElement.textContent = '************';
                    btn.innerHTML = '<i class="far fa-edit"></i> Alterar';
                    btn.classList.remove('editing');
                    return;
                }

                // Atualizar Storage
                const registeredUser = localStorage.getItem('registeredUser');
                if (registeredUser) {
                    const userData = JSON.parse(registeredUser);
                    userData[field] = newValue;
                    localStorage.setItem('registeredUser', JSON.stringify(userData));

                    valueElement.textContent = field === 'password' ? '************' : newValue;
                    if (field === 'firstName' || field === 'lastName') updateHeaders(userData);
                }

                btn.innerHTML = '<i class="far fa-edit"></i> Alterar';
                btn.classList.remove('editing');
            }
        });
    });

    // --- GESTÃO DE CARTÕES ---

    if (DOM.addCardBox && DOM.addCardModal) {
        DOM.addCardBox.addEventListener('click', () => DOM.addCardModal.classList.add('active'));
    }

    if (DOM.closeCardModalBtn && DOM.addCardModal) {
        DOM.closeCardModalBtn.addEventListener('click', () => DOM.addCardModal.classList.remove('active'));
    }

    DOM.addCardModal?.addEventListener('click', (e) => {
        if (e.target === DOM.addCardModal) DOM.addCardModal.classList.remove('active');
    });

    if (DOM.paymentGrid) {
        DOM.paymentGrid.addEventListener('click', (e) => {
            const deleteBtn = e.target.closest('.btn-delete-card');
            if (deleteBtn) {
                const card = deleteBtn.closest('.payment-card');
                if (card) {
                    const cardNumber = card.querySelector('.card-number').textContent;
                    if (confirm('Tem certeza que deseja excluir este cartão?')) {
                        card.remove();
                        removeCardFromStorage(cardNumber);
                    }
                }
            }
        });
    }

    if (DOM.addCardForm) {
        DOM.addCardForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const numberInput = DOM.addCardForm.querySelector('input[placeholder="4321 4321 4321 4321"]');
            const expInput = DOM.addCardForm.querySelector('input[placeholder="02/27"]');
            
            const newCard = {
                number: numberInput.value || '**** **** **** 0000',
                exp: expInput.value || '00/00',
                type: 'visa'
            };

            addCardToUI(newCard);
            saveCardToStorage(newCard);
            DOM.addCardModal.classList.remove('active');
            DOM.addCardForm.reset();
        });
    }

    // --- INICIALIZAÇÃO ---

    loadCards();
    const registeredUser = localStorage.getItem('registeredUser');
    if (registeredUser) {
        const userData = JSON.parse(registeredUser);
        updateHeaders(userData);
        if (DOM.accountFirstName) DOM.accountFirstName.textContent = userData.firstName;
        if (DOM.accountLastName) DOM.accountLastName.textContent = userData.lastName;
        if (DOM.accountEmail) DOM.accountEmail.textContent = userData.email;
        if (DOM.accountPhone) DOM.accountPhone.textContent = userData.phone;
    }
});
