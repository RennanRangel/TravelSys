/**
 * Gerenciamento de Conta
 */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Tab switching (Main)
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-content-panel');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            if (!targetId) return;

            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanels.forEach(p => p.style.display = 'none');
            
            btn.classList.add('active');
            const target = document.getElementById(targetId);
            if (target) target.style.display = 'block';
        });
    });

    // 2. Sub-tab switching (Tickets/Bookings)
    const subTabBtns = document.querySelectorAll('.sub-tab-btn');
    const ticketContainers = document.querySelectorAll('.ticket-list-container');

    subTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-subtarget');
            if (!targetId) return;

            subTabBtns.forEach(b => b.classList.remove('active'));
            ticketContainers.forEach(l => l.style.display = 'none');
            
            btn.classList.add('active');
            const target = document.getElementById(targetId);
            if (target) target.style.display = 'flex';
        });
    });

    // 3. Modal Logic (Add Card)
    const addCardModal = document.getElementById('add-card-modal');
    const openModalBtn = document.getElementById('open-add-card');
    const closeModalBtn = document.getElementById('close-add-card');

    if (addCardModal && openModalBtn && closeModalBtn) {
        openModalBtn.addEventListener('click', () => {
            addCardModal.style.display = 'flex';
            setTimeout(() => addCardModal.classList.add('active'), 10);
        });

        closeModalBtn.addEventListener('click', () => {
            addCardModal.classList.remove('active');
            setTimeout(() => addCardModal.style.display = 'none', 300);
        });

        addCardModal.addEventListener('click', (e) => {
            if (e.target === addCardModal) {
                closeModalBtn.click();
            }
        });
    }

    // 4. Handle URL Hash for direct tab access
    const handleHash = () => {
        const hash = window.location.hash;
        if (hash === '#payments') {
            const btn = document.querySelector('.tab-btn[data-target="payment-tab"]');
            if (btn) btn.click();
        }
    };
    handleHash();

    // 5. Profile Image Upload handling (if elements exist)
    const uploadCoverBtn = document.querySelector('.btn-upload-cover');
    const uploadCoverInput = document.querySelector('#upload-cover');
    const coverImageDisplay = document.querySelector('#cover-image-display');

    if (uploadCoverBtn && uploadCoverInput) {
        uploadCoverBtn.addEventListener('click', () => uploadCoverInput.click());
        uploadCoverInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    if (coverImageDisplay) coverImageDisplay.style.backgroundImage = `url('${event.target.result}')`;
                };
                reader.readAsDataURL(file);
            }
        });
    }

    const editPicBtn = document.querySelector('.btn-edit-pic');
    const uploadProfileInput = document.querySelector('#upload-profile');
    const profilePicDisplay = document.querySelector('#profile-pic-display');

    if (editPicBtn && uploadProfileInput) {
        editPicBtn.addEventListener('click', () => uploadProfileInput.click());
        uploadProfileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    if (profilePicDisplay) profilePicDisplay.src = event.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
    }
});
