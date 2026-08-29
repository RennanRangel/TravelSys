document.addEventListener("DOMContentLoaded", function () {
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
  initDropdown("userDropdownBtnJadoo", "userDropdownMenuJadoo");
  initDropdown("userDropdownBtn", "userDropdownMenu");
  document.addEventListener("click", function () {
    document.querySelectorAll(".user-dropdown.open").forEach(function (el) {
      el.classList.remove("open");
    });
  });
});
