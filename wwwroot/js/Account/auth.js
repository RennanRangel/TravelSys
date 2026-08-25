
const isLoggedIn = () => {
    try {
        const userData = localStorage.getItem('userData');
        if (!userData) return false;
        return JSON.parse(userData).loggedIn === true;
    } catch (e) {
        return false;
    }
};

const getUserData = () => {
    try {
        const userData = localStorage.getItem('userData');
        return userData ? JSON.parse(userData) : null;
    } catch (e) {
        return null;
    }
};

const isAdmin = () => {
    const user = getUserData();
    return user?.loggedIn && user.email === 'admin@gmail.com';
};

const logout = () => {
    localStorage.removeItem('userData');
    window.location.href = '/Account/Login';
};

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

const initPasswordToggles = () => {
    document.querySelectorAll('.toggle-password').forEach(button => {
        button.addEventListener('click', function() {
            const input = this.previousElementSibling;
            const icon = this.querySelector('i');
            
            if (input.type === "password") {
                input.type = "text";
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = "password";
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });
};

document.addEventListener('DOMContentLoaded', () => {
    updateHeader();
    updateProfileDropdown();
    initPasswordToggles();
});
