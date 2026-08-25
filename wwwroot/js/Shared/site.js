document.addEventListener("DOMContentLoaded", function () {
  // Garante que o menu do usuário comece fechado ao carregar a página
  const userMenu = document.querySelector(".dropdown-menu");
  if (userMenu) {
    userMenu.classList.remove("show");
  }
});
