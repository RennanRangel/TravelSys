document.addEventListener('DOMContentLoaded', function() {
    const editBtns = document.querySelectorAll('.edit-admin-btn');
    editBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            document.getElementById('edit-userId').value = this.dataset.id;
            document.getElementById('edit-firstName').value = this.dataset.firstname;
            document.getElementById('edit-lastName').value = this.dataset.lastname;
            document.getElementById('edit-email').value = this.dataset.email;
            document.getElementById('edit-phone').value = this.dataset.phone;
            document.getElementById('edit-role').value = this.dataset.role;
        });
    });
});
