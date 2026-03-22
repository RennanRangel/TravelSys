/**
 * Utilitários de Autenticação (Arquitetura Simplificada)
 * Mantém funções globais para compatibilidade com o projeto.
 */

// 1. Verificação de Login
const isLoggedIn = () => {
    try {
        const userData = localStorage.getItem('userData');
        if (!userData) return false;
        return JSON.parse(userData).loggedIn === true;
    } catch (e) {
        return false;
    }
};

// 2. Recuperação de Dados
const getUserData = () => {
    try {
        const userData = localStorage.getItem('userData');
        return userData ? JSON.parse(userData) : null;
    } catch (e) {
        return null;
    }
};

// 3. Verificação Admin
const isAdmin = () => {
    const user = getUserData();
    return user?.loggedIn && user.email === 'admin@gmail.com';
};

// 4. Logout
const logout = () => {
    localStorage.removeItem('userData');
    window.location.href = '/Account/Login';
};

// 5. Atualização de Cabeçalho (DOM Cache Local)
const updateHeader = () => {
    const headerActions = document.querySelector('.header-actions');
    if (!headerActions) return;

    const user = getUserData();
    if (user?.loggedIn) {
        const displayName = (user.firstName && user.lastName) 
            ? `${user.firstName} ${user.lastName}` 
            : user.email;

        headerActions.innerHTML = `
            <div class="user-info">
                <span class="user-email">${displayName}</span>
                <button onclick="logout()" class="btn-logout">Sair</button>
            </div>
        `;
    } else {
        headerActions.innerHTML = `
            <a href="/Account/Login" class="login-link">Login</a>
            <a href="/Account/Signup" class="signup-btn">Cadastrar</a>
        `;
    }
};

// 6. Atualização de Dropdown
const updateProfileDropdown = () => {
    const user = getUserData();
    if (!user?.loggedIn) return;

    const shortName = (user.firstName && user.lastName)
        ? `${user.firstName} ${user.lastName.charAt(0)}.`
        : 'Usuário';

    const fullName = (user.firstName && user.lastName)
        ? `${user.firstName} ${user.lastName}.`
        : user.email;

    const DOM = {
        profileSpan: document.querySelector('.user-profile span'),
        headerName: document.querySelector('.dropdown-header h4'),
        menu: document.querySelector('.profile-dropdown .dropdown-menu')
    };

    if (DOM.profileSpan) DOM.profileSpan.textContent = shortName;
    if (DOM.headerName) DOM.headerName.textContent = fullName;

    if (isAdmin() && DOM.menu) {
        const existingAdminLink = DOM.menu.querySelector('a[href="/Admin"]');
        if (!existingAdminLink) {
            const adminLi = document.createElement('li');
            adminLi.innerHTML = '<a href="/Admin"><i class="fas fa-user-shield"></i> Painel Admin</a>';
            DOM.menu.insertBefore(adminLi, DOM.menu.firstChild);
        }
    }
};

// 7. Proteção de Páginas
const protectPage = () => {
    if (!isLoggedIn()) window.location.href = '/Account/Login';
};

const protectAdminPage = () => {
    if (!isLoggedIn()) {
        alert('Por favor, faça login para acessar o painel admin');
        window.location.href = '/Account/Login';
        return;
    }
    if (!isAdmin()) {
        alert('Acesso negado. Privilégios de admin necessários.');
        window.location.href = '/';
    }
};

// 8. Inicialização
document.addEventListener('DOMContentLoaded', () => {
    updateHeader();
    updateProfileDropdown();
});
