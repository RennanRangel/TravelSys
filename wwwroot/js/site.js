// Placeholder file - no custom JavaScript needed
console.log('Site.js loaded');

function confirmDeleteAccount() {
    if (confirm('Deseja realmente excluir sua conta? Esta ação é permanente e todos os seus dados serão perdidos.')) {
        document.getElementById('deleteAccountForm').submit();
    }
}
