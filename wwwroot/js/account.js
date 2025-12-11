document.addEventListener('DOMContentLoaded', () => {
    // Tab switching functionality
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            tabBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');

            // Hide all tab contents
            tabContents.forEach(content => content.classList.remove('active'));

            // Show target tab content
            const tabId = btn.getAttribute('data-tab');
            const targetContent = document.getElementById(tabId);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });

    // Sub-tab switching logic
    const subTabBtns = document.querySelectorAll('.sub-tab-btn');
    const subTabContents = document.querySelectorAll('.sub-tab-content');

    subTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all sub-tab buttons and contents
            subTabBtns.forEach(b => b.classList.remove('active'));
            subTabContents.forEach(c => c.classList.remove('active'));

            // Add active class to clicked button
            btn.classList.add('active');

            // Show corresponding content
            const subTabId = btn.getAttribute('data-subtab');
            const targetSubContent = document.getElementById(subTabId);
            if (targetSubContent) {
                targetSubContent.classList.add('active');
            }
        });
    });

    // Upload cover functionality
    const uploadCoverBtn = document.querySelector('.btn-upload-cover');
    const uploadCoverInput = document.getElementById('upload-cover');
    const coverImageDisplay = document.getElementById('cover-image-display');

    if (uploadCoverBtn && uploadCoverInput) {
        uploadCoverBtn.addEventListener('click', () => {
            uploadCoverInput.click();
        });

        uploadCoverInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const imageUrl = event.target.result;
                    coverImageDisplay.style.backgroundImage = `url('${imageUrl}')`;
                    localStorage.setItem('userCover', imageUrl);
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Load saved cover
    const savedCover = localStorage.getItem('userCover');
    if (savedCover && coverImageDisplay) {
        coverImageDisplay.style.backgroundImage = `url('${savedCover}')`;
    }

    // Edit profile pic functionality
    const editPicBtn = document.querySelector('.btn-edit-pic');
    const uploadProfileInput = document.getElementById('upload-profile');
    const profilePicDisplay = document.getElementById('profile-pic-display');

    if (editPicBtn && uploadProfileInput) {
        editPicBtn.addEventListener('click', () => {
            uploadProfileInput.click();
        });

        uploadProfileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const imageUrl = event.target.result;
                    profilePicDisplay.src = imageUrl;
                    localStorage.setItem('userProfilePic', imageUrl);
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Load saved profile pic
    const savedProfilePic = localStorage.getItem('userProfilePic');
    if (savedProfilePic && profilePicDisplay) {
        profilePicDisplay.src = savedProfilePic;
    }

    // Change buttons (Inline Edit Logic)
    const changeBtns = document.querySelectorAll('.btn-change');
    changeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const field = btn.getAttribute('data-field');
            const row = btn.closest('.detail-row');
            const valueElement = row.querySelector('.value');
            const isEditing = btn.classList.contains('editing');

            if (!isEditing) {
                // Start Editing
                const currentValue = valueElement.textContent;
                let inputType = 'text';
                if (field === 'email') inputType = 'email';
                if (field === 'password') inputType = 'password';
                if (field === 'phone') inputType = 'tel';

                // Create input
                const input = document.createElement('input');
                input.type = inputType;
                input.value = field === 'password' ? '' : currentValue; // Don't show masked password
                input.className = 'edit-input';
                if (field === 'password') input.placeholder = 'New password';

                // Replace text with input
                valueElement.innerHTML = '';
                valueElement.appendChild(input);
                input.focus();

                // Change button to Save
                btn.innerHTML = '<i class="fas fa-check"></i> Save';
                btn.classList.add('editing');
            } else {
                // Save Changes
                const input = valueElement.querySelector('input');
                const newValue = input.value.trim();

                if (!newValue && field !== 'password') {
                    alert('Field cannot be empty');
                    return;
                }

                // If password is empty, don't update it
                if (field === 'password' && !newValue) {
                    // Revert to masked
                    valueElement.textContent = '************';
                    btn.innerHTML = '<i class="far fa-edit"></i> Change';
                    btn.classList.remove('editing');
                    return;
                }

                // Update localStorage
                const registeredUser = localStorage.getItem('registeredUser');
                if (registeredUser) {
                    const userData = JSON.parse(registeredUser);
                    userData[field] = newValue;
                    localStorage.setItem('registeredUser', JSON.stringify(userData));

                    // Update UI
                    if (field === 'password') {
                        valueElement.textContent = '************';
                    } else {
                        valueElement.textContent = newValue;
                    }

                    // Update Headers if name changed
                    if (field === 'firstName' || field === 'lastName') {
                        updateHeaders(userData);
                    }
                }

                // Reset button
                btn.innerHTML = '<i class="far fa-edit"></i> Change';
                btn.classList.remove('editing');
            }
        });
    });

    // Add email button
    const addEmailBtn = document.querySelector('.btn-add-email');
    if (addEmailBtn) {
        addEmailBtn.addEventListener('click', () => {
            alert('Add email functionality would open here.');
        });
    }

    // Newsletter form
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = newsletterForm.querySelector('input[type="email"]').value;
            if (email) {
                alert('Thank you for subscribing!');
                newsletterForm.reset();
            }
        });
    }

    // Load user data from localStorage
    const registeredUser = localStorage.getItem('registeredUser');
    if (registeredUser) {
        const userData = JSON.parse(registeredUser);
        updateHeaders(userData);

        // Update Account Details Tab
        const accountFirstName = document.getElementById('account-firstname');
        const accountLastName = document.getElementById('account-lastname');
        const accountEmail = document.getElementById('account-email');
        const accountPhone = document.getElementById('account-phone');

        if (accountFirstName) accountFirstName.textContent = userData.firstName;
        if (accountLastName) accountLastName.textContent = userData.lastName;
        if (accountEmail) accountEmail.textContent = userData.email;
        if (accountPhone) accountPhone.textContent = userData.phone;
    }
    // Add Card Modal Logic
    const addCardBox = document.querySelector('.add-card-box');
    const addCardModal = document.getElementById('addCardModal');
    const closeCardModalBtn = document.querySelector('.btn-close-modal');

    if (addCardBox && addCardModal) {
        addCardBox.addEventListener('click', () => {
            addCardModal.classList.add('active');
        });
    }

    if (closeCardModalBtn && addCardModal) {
        closeCardModalBtn.addEventListener('click', () => {
            addCardModal.classList.remove('active');
        });
    }

    // Close modal when clicking outside
    if (addCardModal) {
        addCardModal.addEventListener('click', (e) => {
            if (e.target === addCardModal) {
                addCardModal.classList.remove('active');
            }
        });
    }

    // Card Management (Add & Delete)
    const paymentGrid = document.querySelector('.payment-methods-grid');
    const addCardForm = document.querySelector('.add-card-form');

    // Load Cards from LocalStorage
    loadCards();

    // Delete Card (Event Delegation)
    if (paymentGrid) {
        paymentGrid.addEventListener('click', (e) => {
            const deleteBtn = e.target.closest('.btn-delete-card');
            if (deleteBtn) {
                const card = deleteBtn.closest('.payment-card');
                if (card) {
                    const cardNumber = card.querySelector('.card-number').textContent;
                    if (confirm('Are you sure you want to delete this card?')) {
                        card.remove();
                        removeCardFromStorage(cardNumber);
                    }
                }
            }
        });
    }

    // Add Card
    if (addCardForm) {
        addCardForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Get values
            const numberInput = addCardForm.querySelector('input[placeholder="4321 4321 4321 4321"]');
            const expInput = addCardForm.querySelector('input[placeholder="02/27"]');
            const cvcInput = addCardForm.querySelector('input[placeholder="123"]');
            const nameInput = addCardForm.querySelector('input[placeholder="John Doe"]');

            const cardNumber = numberInput.value || '**** **** **** 0000';
            const expDate = expInput.value || '00/00';
            const cardType = 'visa'; // Default for now

            const newCard = {
                number: cardNumber,
                exp: expDate,
                type: cardType
            };

            // Add to UI
            addCardToUI(newCard);

            // Save to Storage
            saveCardToStorage(newCard);

            // Close Modal & Reset
            addCardModal.classList.remove('active');
            addCardForm.reset();
        });
    }

    function addCardToUI(card) {
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

        // Insert before the "Add Card" box
        const addCardBox = document.querySelector('.add-card-box');
        paymentGrid.insertBefore(cardElement, addCardBox);
    }

    function saveCardToStorage(card) {
        let cards = JSON.parse(localStorage.getItem('userCards')) || [];
        cards.push(card);
        localStorage.setItem('userCards', JSON.stringify(cards));
    }

    function removeCardFromStorage(cardNumber) {
        let cards = JSON.parse(localStorage.getItem('userCards')) || [];
        cards = cards.filter(c => c.number !== cardNumber);
        localStorage.setItem('userCards', JSON.stringify(cards));
    }

    function loadCards() {
        const cards = JSON.parse(localStorage.getItem('userCards')) || [];
        // Clear existing static cards (except the add box) if we want to rely solely on storage,
        // but for now let's just append saved ones or keep the static one as a "demo".
        // To avoid duplicates if the static one is also in storage, we might want to clear.
        // For this implementation, I'll just add the stored ones.
        cards.forEach(card => addCardToUI(card));
    }
});

function updateHeaders(userData) {
    const fullName = `${userData.firstName} ${userData.lastName}`;

    // Update Header User Name
    const headerProfileName = document.querySelector('.user-profile span');
    if (headerProfileName) headerProfileName.textContent = userData.firstName;

    // Update Dropdown User Info
    const dropdownName = document.querySelector('.user-info h4');
    if (dropdownName) dropdownName.textContent = fullName;

    // Update Profile Header
    const profileHeaderName = document.querySelector('.user-name');
    const profileHeaderEmail = document.querySelector('.user-email');
    if (profileHeaderName) profileHeaderName.textContent = fullName;
    if (profileHeaderEmail) profileHeaderEmail.textContent = userData.email;
}
