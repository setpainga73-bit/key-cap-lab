// Keycap Lab - Authentication (Login & Register)
(() => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  document.addEventListener("DOMContentLoaded", () => {
    initPasswordToggles();
    initLoginForm();
    initRegisterForm();
  });

  function initPasswordToggles() {
    document.querySelectorAll("[data-password-toggle]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const targetId = btn.dataset.passwordToggle;
        const input = document.getElementById(targetId);
        const icon = btn.querySelector("i");
        if (!input) return;

        const isPassword = input.type === "password";
        input.type = isPassword ? "text" : "password";

        if (icon) {
          icon.classList.toggle("fa-eye", !isPassword);
          icon.classList.toggle("fa-eye-slash", isPassword);
        }
      });
    });
  }

  function initLoginForm() {
    const form = document.getElementById("login-form");
    if (!form) return;

    const emailInput = document.getElementById("login-email");
    const passwordInput = document.getElementById("login-password");
    const formError = document.getElementById("login-form-error");

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = emailInput?.value.trim() || "";
      const password = passwordInput?.value.trim() || "";

      let error = "";
      if (!email) {
        error = "Please enter your email address.";
        emailInput?.focus();
      } else if (!emailRegex.test(email)) {
        error = "Please enter a valid email address.";
        emailInput?.focus();
      } else if (!password) {
        error = "Please enter your password.";
        passwordInput?.focus();
      }

      if (error) {
        if (formError) {
          formError.textContent = error;
          formError.classList.remove("hidden");
        }
        return;
      }

      // Demo login success
      try {
        localStorage.setItem(
          "keycap-lab-demo-user",
          JSON.stringify({
            email,
            name: email.split("@")[0].replace(/[._]/g, " "),
          }),
        );
        localStorage.setItem("keycap-lab-authenticated", "true");
        window.location.href = "./account.html";
      } catch {
        if (formError) {
          formError.textContent = "Unable to start session in this browser.";
          formError.classList.remove("hidden");
        }
      }
    });
  }

  function initRegisterForm() {
    const form = document.getElementById("register-form");
    if (!form) return;

    const nameInput = document.getElementById("register-name");
    const emailInput = document.getElementById("register-email");
    const passwordInput = document.getElementById("register-password");
    const confirmInput = document.getElementById("register-confirm");
    const termsInput = document.getElementById("register-terms");
    const formError = document.getElementById("register-form-error");

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = nameInput?.value.trim() || "";
      const email = emailInput?.value.trim() || "";
      const password = passwordInput?.value || "";
      const confirm = confirmInput?.value || "";
      const terms = termsInput?.checked || false;

      let error = "";
      if (!name) {
        error = "Please enter your full name.";
        nameInput?.focus();
      } else if (!email || !emailRegex.test(email)) {
        error = "Please enter a valid email address.";
        emailInput?.focus();
      } else if (password.length < 8) {
        error = "Password must be at least 8 characters long.";
        passwordInput?.focus();
      } else if (!/\d/.test(password)) {
        error = "Password must contain at least one number.";
        passwordInput?.focus();
      } else if (password !== confirm) {
        error = "Passwords do not match.";
        confirmInput?.focus();
      } else if (!terms) {
        error = "You must agree to the Terms of Service.";
        termsInput?.focus();
      }

      if (error) {
        if (formError) {
          formError.textContent = error;
          formError.classList.remove("hidden");
        }
        return;
      }

      // Demo register success
      try {
        localStorage.setItem(
          "keycap-lab-demo-user",
          JSON.stringify({ name, email }),
        );
        localStorage.setItem("keycap-lab-authenticated", "true");
        window.location.href = "./account.html";
      } catch {
        if (formError) {
          formError.textContent = "Unable to create account in this browser.";
          formError.classList.remove("hidden");
        }
      }
    });
  }
})();
