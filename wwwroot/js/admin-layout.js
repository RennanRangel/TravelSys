
document.addEventListener('DOMContentLoaded', function () {
    const sidebar = document.getElementById('admin-sidebar');
    const main = document.getElementById('admin-main');

    if (!sidebar || !main) return;

    sidebar.addEventListener('mouseenter', function () {
        sidebar.classList.remove('collapsed');
        main.classList.remove('expanded');
    });

    sidebar.addEventListener('mouseleave', function () {
        sidebar.classList.add('collapsed');
        main.classList.add('expanded');
    });
});
