document.addEventListener("DOMContentLoaded", () => {
  const loginBox = document.getElementById("login-box");
  const protectedContent = document.getElementById("protected-content");
  const passwordInput = document.getElementById("password-input");
  const loginBtn = document.getElementById("login-btn");
  const logoutBtn = document.getElementById("logout-btn");
  const message = document.getElementById("message");
  const spinner = document.getElementById("spinner");
  const showPasswordBtn = document.getElementById("show-password");
  const themeToggle = document.getElementById("theme-toggle");

  // === THEME TOGGLE ===
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    document.body.classList.add(savedTheme);
  } else {
    // Default to system preference
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.add("light");
    }
  }

  function updateThemeIcon() {
    themeToggle.textContent = document.body.classList.contains("dark") ? "🌞" : "🌗";
  }

  updateThemeIcon();

  themeToggle.addEventListener("click", () => {
    if (document.body.classList.contains("dark")) {
      document.body.classList.replace("dark", "light");
      localStorage.setItem("theme", "light");
    } else {
      document.body.classList.replace("light", "dark");
      localStorage.setItem("theme", "dark");
    }
    updateThemeIcon();
  });

  // === SHOW / HIDE PASSWORD ===
  showPasswordBtn.addEventListener("click", () => {
    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      showPasswordBtn.textContent = "🙈";
    } else {
      passwordInput.type = "password";
      showPasswordBtn.textContent = "👁️";
    }
  });

  // === LOGIN LOGIC ===
  async function handleLogin() {
    const password = passwordInput.value.trim();
    if (!password) {
      message.textContent = "Please enter a password.";
      return;
    }

    message.textContent = "";
    spinner.hidden = false;
    loginBtn.disabled = true;

    try {
      const derived = await deriveKeyBase64(password);

      if (derived === STORED_DERIVED_KEY_BASE64) {
        loginBox.classList.remove("visible");
        loginBox.classList.add("hidden");

        setTimeout(() => {
          loginBox.style.display = "none";
          protectedContent.style.display = "block";
          requestAnimationFrame(() => {
            protectedContent.classList.remove("hidden");
            protectedContent.classList.add("visible");
          });
        }, 500);
      } else {
        message.textContent = "❌ Incorrect password.";
      }
    } catch (err) {
      console.error(err);
      message.textContent = "⚠️ Error during verification.";
    } finally {
      spinner.hidden = true;
      loginBtn.disabled = false;
      passwordInput.value = "";
    }
  }

  loginBtn.addEventListener("click", handleLogin);
  passwordInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") handleLogin();
  });

  logoutBtn.addEventListener("click", () => {
    protectedContent.classList.remove("visible");
    protectedContent.classList.add("hidden");

    setTimeout(() => {
      protectedContent.style.display = "none";
      loginBox.style.display = "block";
      requestAnimationFrame(() => {
        loginBox.classList.remove("hidden");
        loginBox.classList.add("visible");
      });
    }, 500);
  });
});
