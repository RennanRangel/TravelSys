// Auth utility functions

// Check if user is logged in
function isLoggedIn() {
    const userData = localStorage.getItem('userData');
    if (!userData) return false;

    try {
        const user = JSON.parse(userData);
        return user.loggedIn === true;
    } catch (e) {
        return false;
    }
}

// Get user data
function getUserData() {
    const userData = localStorage.getItem('userData');
    if (!userData) return null;

    try {
        return JSON.parse(userData);
    } catch (e) {
        return null;
    }
}

// Check if user is admin
function isAdmin() {
    const userData = getUserData();
    if (!userData || !userData.loggedIn) return false;

    // Admin credentials
    const adminEmail = 'admin@gmail.com';

    return userData.email === adminEmail;
}

// Logout function
function logout() {
    localStorage.removeItem('userData');
    window.location.href = '/Account/Login';
}

// Update header based on login status
function updateHeader() {
    const userData = getUserData();
    const headerActions = document.querySelector('.header-actions');

    if (!headerActions) return;

    if (userData && userData.loggedIn) {
        // User is logged in - show name and logout button
        const displayName = userData.firstName && userData.lastName
            ? `${userData.firstName} ${userData.lastName}`
            : userData.email;

        headerActions.innerHTML = `
            <div class="user-info">
                <span class="user-email">${displayName}</span>
                <button onclick="logout()" class="btn-logout">Logout</button>
            </div>
        `;
    } else {
        // User is not logged in - show login and signup buttons
        headerActions.innerHTML = `
            <a href="/Account/Login" class="login-link">Login</a>
            <a href="/Account/Signup" class="signup-btn">Sign up</a>
        `;
    }
}

// Update profile dropdown elements
function updateProfileDropdown() {
    const userData = getUserData();

    if (!userData || !userData.loggedIn) return;

    // Format: "FirstName L."
    const shortName = userData.firstName && userData.lastName
        ? `${userData.firstName} ${userData.lastName.charAt(0)}.`
        : 'User';

    // Format: "FirstName LastName."
    const fullName = userData.firstName && userData.lastName
        ? `${userData.firstName} ${userData.lastName}.`
        : userData.email;

    // Update user profile span (John D.)
    const userProfileSpan = document.querySelector('.user-profile span');
    if (userProfileSpan) {
        userProfileSpan.textContent = shortName;
    }

    // Update dropdown header h4 (John Doe.)
    const dropdownHeaderName = document.querySelector('.dropdown-header h4');
    if (dropdownHeaderName) {
        dropdownHeaderName.textContent = fullName;
    }

    // Add Admin Panel link if user is admin
    if (isAdmin()) {
        addAdminPanelLink();
    }
}

// Add Admin Panel link to dropdown menu
function addAdminPanelLink() {
    // Find the first dropdown menu (the one with My account, Payments, Settings)
    const firstDropdownMenu = document.querySelector('.profile-dropdown .dropdown-menu');

    if (!firstDropdownMenu) return;

    // Check if admin link already exists
    const existingAdminLink = firstDropdownMenu.querySelector('a[href="/Admin"]');
    if (existingAdminLink) return;

    // Create admin panel link
    const adminLi = document.createElement('li');
    adminLi.innerHTML = '<a href="/Admin"><i class="fas fa-user-shield"></i> Admin Panel</a>';

    // Add it as the first item in the menu
    firstDropdownMenu.insertBefore(adminLi, firstDropdownMenu.firstChild);
}


// Protect page - redirect to login if not logged in
function protectPage() {
    if (!isLoggedIn()) {
        window.location.href = '/Account/Login';
    }
}

// Protect admin page - redirect to login if not admin
function protectAdminPage() {
    if (!isLoggedIn()) {
        alert('Please login to access the admin panel');
        window.location.href = '/Account/Login';
        return;
    }

    if (!isAdmin()) {
        alert('Access denied. Admin privileges required.');
        window.location.href = '/';
        return;
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    updateHeader();
    updateProfileDropdown();
});

