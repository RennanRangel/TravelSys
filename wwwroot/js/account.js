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

            // Remove active from all buttons and panels
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanels.forEach(p => p.classList.remove('active'));
            
            // Add active to current
            btn.classList.add('active');
            const target = document.getElementById(targetId);
            if (target) target.classList.add('active');
        });
    });

    // 2. Sub-tab switching (Tickets/Bookings)
    const subTabBtns = document.querySelectorAll('.sub-tab-btn');
    const ticketContainers = document.querySelectorAll('.ticket-list-container');

    subTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-subtarget');
            if (!targetId) return;

            // Remove active from all sub-btns and containers
            subTabBtns.forEach(b => b.classList.remove('active'));
            ticketContainers.forEach(l => l.classList.remove('active-sub'));
            
            btn.classList.add('active');
            const target = document.getElementById(targetId);
            if (target) target.classList.add('active-sub');
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

    // 6. Inline Editing Logic
    const detailRows = document.querySelectorAll('.detail-row');
    
    detailRows.forEach(row => {
        const changeBtn = row.querySelector('.btn-change');
        if (!changeBtn) return;

        const saveBtn = row.querySelector('.btn-save-inline');
        const cancelBtn = row.querySelector('.btn-cancel-inline');
        const editActions = row.querySelector('.edit-actions');
        const valueDisplay = row.querySelector('.value-display');
        const editInputsArea = row.querySelector('.edit-inputs');

        changeBtn.addEventListener('click', () => {
            // Enter edit mode
            changeBtn.classList.add('d-none');
            editActions.classList.remove('d-none');
            valueDisplay.classList.add('d-none');
            editInputsArea.classList.remove('d-none');
        });

        cancelBtn.addEventListener('click', () => {
            // Exit edit mode without saving
            changeBtn.classList.remove('d-none');
            editActions.classList.add('d-none');
            valueDisplay.classList.remove('d-none');
            editInputsArea.classList.add('d-none');
        });

        if (saveBtn) {
            saveBtn.addEventListener('click', async () => {
                    const data = {};
                    const firstName = row.querySelector('.first-name');
                    if (firstName) data.firstName = firstName.value;
                    
                    const lastName = row.querySelector('.last-name');
                    if (lastName) data.lastName = lastName.value;
                    
                    const emailInput = row.querySelector('.user-email');
                    if (emailInput) data.email = emailInput.value;
                    
                    const currentPass = row.querySelector('.current-password');
                    if (currentPass) data.currentPassword = currentPass.value;
                    
                    const newPass = row.querySelector('.new-password');
                    if (newPass) data.newPassword = newPass.value;

                try {
                    const response = await fetch('/Account/UpdateProfile', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'RequestVerificationToken': document.querySelector('input[name="__RequestVerificationToken"]')?.value || ''
                        },
                        body: JSON.stringify(data)
                    });

                    if (!response.ok) {
                        const errorText = await response.text();
                        console.error('Server error:', errorText);
                        alert('Server error: ' + response.status);
                        return;
                    }

                    const result = await response.json();
                    if (result.success) {
                        location.reload(); 
                    } else {
                        alert('Error updating profile: ' + result.message);
                    }
                } catch (error) {
                    console.error('Network or Parsing error:', error);
                    alert('An error occurred. Check the console for details.');
                }
            });
        }
    });

    // --- Booking Dropdown Logic (Event Delegation) ---
    document.addEventListener('click', (e) => {
        const toggleBtn = e.target.closest('.btn-options-toggle');
        
        if (toggleBtn) {
            e.stopPropagation();
            const currentMenu = toggleBtn.nextElementSibling;
            
            // Close all other menus
            document.querySelectorAll('.options-menu').forEach(m => {
                if (m !== currentMenu) m.classList.add('d-none');
            });
            
            currentMenu.classList.toggle('d-none');
        } else {
            // Close all menus when clicking anywhere else
            document.querySelectorAll('.options-menu').forEach(m => m.classList.add('d-none'));
        }
    });

    // --- Delete Bookings Logic ---
    const deleteBookingBtns = document.querySelectorAll('.btn-delete-booking-ajax');
    deleteBookingBtns.forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.preventDefault();
            const type = btn.dataset.type;
            const id = btn.dataset.id;
            
            if (!confirm('Deseja realmente excluir esta compra?')) return;
            
            const endpoint = type === 'flight' ? '/Account/DeleteFlightBooking' : '/Account/DeleteStayBooking';
            
            try {
                const response = await fetch(`${endpoint}?id=${id}`, {
                    method: 'POST',
                    headers: {
                        'RequestVerificationToken': document.querySelector('input[name="__RequestVerificationToken"]')?.value || ''
                    }
                });
                
                const result = await response.json();
                if (result.success) {
                    btn.closest('.booking-ticket-card')?.remove();
                } else {
                    alert(result.message || 'Erro ao excluir');
                }
            } catch (err) {
                console.error(err);
                alert('An error occurred.');
            }
        });
    });
});
