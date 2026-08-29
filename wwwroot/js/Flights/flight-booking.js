document.addEventListener("DOMContentLoaded", () => {
  const DOM = {
    loginForm: document.querySelector(".login-form"),
    socialBtns: document.querySelectorAll(".btn-social"),
    emailBtn: document.querySelector(".btn-email-login"),
    formNewsletter: document.querySelector(".newsletter-form"),
    radios: document.querySelectorAll('input[name="paymentType"]'),
  };

  window.selectPayment = (type) => {
    DOM.radios.forEach((r) => {
      if (r.value === type) r.checked = true;
    });
    const full = document.querySelector("#radio-full");
    const part = document.querySelector("#radio-part");
    if (full) full.classList.toggle("selected", type === "full");
    if (part) part.classList.toggle("selected", type === "part");
  };

  DOM.loginForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const phone = DOM.loginForm.querySelector(".phone-input")?.value;
    if (phone) {
      alert(`Código enviado para ${phone}. Redirecionando...`);
    } else {
      alert("Por favor, insira seu telefone");
    }
  });

  DOM.socialBtns.forEach((btn) => {
    btn.addEventListener("click", () =>
      alert("Funcionalidade de login social abriria aqui."),
    );
  });

  DOM.emailBtn?.addEventListener("click", () =>
    alert("Formulário de e-mail abriria aqui."),
  );

  DOM.formNewsletter?.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Obrigado por se inscrever!");
    DOM.formNewsletter.reset();
  });
});
