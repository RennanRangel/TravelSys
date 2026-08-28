document.addEventListener("DOMContentLoaded", function () {

  // Função genérica para inicializar um dropdown
  function initDropdown(btnId, menuId, wrapperId) {
    const btn = document.getElementById(btnId);
    const menu = document.getElementById(menuId);
    if (!btn || !menu) return;
    const wrapper = btn.closest(".user-dropdown");

    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      wrapper.classList.toggle("open");
    });
  }

  // Inicializa os dois dropdowns (home/jadoo e hotéis/voos)
  initDropdown("userDropdownBtnJadoo", "userDropdownMenuJadoo");
  initDropdown("userDropdownBtn", "userDropdownMenu");

  // Fecha qualquer dropdown ao clicar fora
  document.addEventListener("click", function () {
    document.querySelectorAll(".user-dropdown.open").forEach(function (el) {
      el.classList.remove("open");
    });
  });

});
