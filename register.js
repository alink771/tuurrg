const form = document.querySelector("#registerForm");

if (form) {
  // Находим элементы
  const username = document.querySelector("#username");
  const email = document.querySelector("#email");
  const password = document.querySelector("#password");
  const confirm = document.querySelector("#confirm");
  const terms = document.querySelector("#terms");

  const usernameError = document.querySelector("#usernameError");
  const emailError = document.querySelector("#emailError");
  const passwordError = document.querySelector("#passwordError");
  const confirmError = document.querySelector("#confirmError");
  const termsError = document.querySelector("#termsError");

  const submitBtn = document.querySelector("#submitBtn");
  
  // Элементы для заданий
  const strengthFill = document.querySelector("#strengthFill");
  const strengthText = document.querySelector("#strengthText");
  const successModal = document.querySelector("#successModal");
  const modalClose = document.querySelector("#modalClose");

  // ============================================
  // ЗАДАНИЕ 5: Валидация (Базовые функции)
  // ============================================
  const validateUsername = (value) => {
    const t = value.trim();
    if (t === "") return { valid: false, message: "Введите имя" };
    if (t.length < 3) return { valid: false, message: "Минимум 3 символа" };
    if (t.length > 20) return { valid: false, message: "Максимум 20 символов" };
    if (!/^[a-zA-Z0-9_]+$/.test(t)) return { valid: false, message: "Только латиница, цифры и _" };
    return { valid: true, message: "" };
  };

  const validateEmail = (value) => {
    const t = value.trim();
    if (t === "") return { valid: false, message: "Введите email" };
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t)) return { valid: false, message: "Неверный формат" };
    return { valid: true, message: "" };
  };

  const validatePassword = (value) => {
    if (value === "") return { valid: false, message: "Введите пароль" };
    if (value.length < 8) return { valid: false, message: "Минимум 8 символов" };
    if (!/[a-zA-Z]/.test(value)) return { valid: false, message: "Добавьте букву" };
    if (!/\d/.test(value)) return { valid: false, message: "Добавьте цифру" };
    return { valid: true, message: "" };
  };

  const validateConfirm = (value) => {
    if (value === "") return { valid: false, message: "Повторите пароль" };
    if (value !== password.value) return { valid: false, message: "Пароли не совпадают" };
    return { valid: true, message: "" };
  };

  const validateTerms = () => {
    if (!terms.checked) return { valid: false, message: "Отметьте согласие" };
    return { valid: true, message: "" };
  };

  // ============================================
  // Функции показа состояния
  // ============================================
  const showError = (input, errorElement, message) => {
    input.classList.add("error");
    input.classList.remove("success");
    errorElement.textContent = message;
  };

  const showSuccess = (input, errorElement) => {
    input.classList.remove("error");
    input.classList.add("success");
    errorElement.textContent = "";
  };

  const validateSingleField = (input, errorElement, validator) => {
    const result = validator(input.value);
    if (result.valid) showSuccess(input, errorElement);
    else showError(input, errorElement, result.message);
    return result.valid;
  };

  // ============================================
  // ЗАДАНИЕ 5: Проверка всей формы (без вывода ошибок)
  // ============================================
  const checkAllFieldsValid = () => {
    const r1 = validateUsername(username.value).valid;
    const r2 = validateEmail(email.value).valid;
    const r3 = validatePassword(password.value).valid;
    const r4 = validateConfirm(confirm.value).valid;
    const r5 = validateTerms().valid;
    return r1 && r2 && r3 && r4 && r5;
  };

  const updateSubmitState = () => {
    submitBtn.disabled = !checkAllFieldsValid();
  };
  // ============================================
  // ЗАДАНИЕ 3: Сила пароля
  // ============================================
  const checkStrength = (value) => {
    let strength = 0;
    if (value.length >= 8) strength++;
    if (/[a-z]/.test(value) && /[A-Z]/.test(value)) strength++;
    if (/\d/.test(value)) strength++;
    if (/[^a-zA-Z0-9]/.test(value)) strength++;
    return strength; // от 0 до 4
  };

  const levels = [
    { width: "0%", color: "#eee", text: "Введите пароль" },
    { width: "25%", color: "#e74c3c", text: "Очень слабый" },
    { width: "50%", color: "#f39c12", text: "Слабый" },
    { width: "75%", color: "#3498db", text: "Средний" },
    { width: "100%", color: "#27ae60", text: "Сильный" }
  ];

  const updateStrength = (value) => {
    const strength = checkStrength(value);
    const level = levels[strength];
    strengthFill.style.width = level.width;
    strengthFill.style.background = level.color;
    strengthText.textContent = value === "" ? "Введите пароль" : level.text;
    strengthText.style.color = value === "" ? "#999" : level.color;
  };

  password.addEventListener("input", (e) => {
    updateStrength(e.target.value);
  });

  // ============================================
  // ЗАДАНИЕ 4: Сохранение черновика
  // ============================================
  const saveDraft = () => {
    const draft = { username: username.value, email: email.value };
    try { localStorage.setItem("registerDraft", JSON.stringify(draft)); } catch (e) {}
  };

  const loadDraft = () => {
    try {
      const saved = localStorage.getItem("registerDraft");
      if (!saved) return;
      const draft = JSON.parse(saved);
      username.value = draft.username || "";
      email.value = draft.email || "";
    } catch (e) {}
  };

  username.addEventListener("input", saveDraft);
  email.addEventListener("input", saveDraft);
  loadDraft();

  // ============================================
  // ЗАДАНИЕ 5: Мягкая валидация (touched + blur)
  // ============================================
  let touched = { username: false, email: false, password: false, confirm: false };

  const attachSoftValidation = (input, errorEl, validator, fieldName) => {
    // При уходе из поля — проверяем и ставим флаг
    input.addEventListener("blur", () => {
      touched[fieldName] = true;
      validateSingleField(input, errorEl, validator);
      updateSubmitState();
    });

    // При вводе — проверяем, только если уже "трогали"
    input.addEventListener("input", () => {
      if (touched[fieldName]) {
        validateSingleField(input, errorEl, validator);
      }
      updateSubmitState();
    });
  };

  attachSoftValidation(username, usernameError, validateUsername, "username");
  attachSoftValidation(email, emailError, validateEmail, "email");
  attachSoftValidation(password, passwordError, validatePassword, "password");
  attachSoftValidation(confirm, confirmError, validateConfirm, "confirm");

  terms.addEventListener("change", () => {
    if (terms.checked) termsError.textContent = "";
    else termsError.textContent = "Отметьте согласие";
    updateSubmitState();
  });

  // ============================================
  // ЗАДАНИЕ 6: Модальное окно
  // ============================================
  const showModal = () => successModal.classList.add("active");
  const hideModal = () => successModal.classList.remove("active");

  modalClose.addEventListener("click", hideModal);
  successModal.addEventListener("click", (e) => {
    if (e.target === successModal) hideModal();
  });

  // ============================================
  // ЗАДАНИЕ 7: Отправка с лоадером
  // ============================================
  const setLoading = (isLoading) => {
    if (isLoading) {
      submitBtn.classList.add("loading");
      submitBtn.disabled = true;
    } else {
      submitBtn.classList.remove("loading");
      submitBtn.disabled = false;
    }
  };

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!checkAllFieldsValid()) return;

    setLoading(true);

    // Имитация запроса на сервер (2 секунды)
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setLoading(false);
    showModal();
    form.reset();
    updateStrength(""); // Сброс шкалы
    submitBtn.disabled = true;
    
    // Очистка
    [username, email, password, confirm].forEach((input) => input.classList.remove("success"));
    try { localStorage.removeItem("registerDraft"); } catch (e) {}
  });

  // Показ/скрытие пароля
  const togglePasswordBtn = document.querySelector("#togglePasswordBtn");
  const toggleConfirmBtn = document.querySelector("#toggleConfirmBtn");

  togglePasswordBtn.addEventListener("click", () => {
    const type = password.getAttribute("type") === "password" ? "text" : "password";
    password.setAttribute("type", type);
    togglePasswordBtn.textContent = type === "password" ? "👁" : "🙈";
  });

  toggleConfirmBtn.addEventListener("click", () => {
    const type = confirm.getAttribute("type") === "password" ? "text" : "password";
    confirm.setAttribute("type", type);
    toggleConfirmBtn.textContent = type === "password" ? "👁" : "🙈";
  });
}