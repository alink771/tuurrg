const form = document.querySelector("#loginForm");

if (form) {
  const email = document.querySelector("#email");
  const password = document.querySelector("#password");
  const emailError = document.querySelector("#emailError");
  const passwordError = document.querySelector("#passwordError");
  const submitBtn = document.querySelector("#submitBtn");
  const successModal = document.querySelector("#successModal");
  const modalClose = document.querySelector("#modalClose");

  // Валидация (упрощенная для входа)
  const validateEmail = (value) => {
    if (value.trim() === "") return { valid: false, message: "Введите email" };
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) return { valid: false, message: "Неверный формат" };
    return { valid: true, message: "" };
  };

  const validatePassword = (value) => {
    if (value === "") return { valid: false, message: "Введите пароль" };
    // При входе не требуем 8 символов, просто проверяем что не пусто
    return { valid: true, message: "" };
  };

  const showError = (input, errorElement, message) => {
    input.classList.add("error");
    errorElement.textContent = message;
  };

  const showSuccess = (input, errorElement) => {
    input.classList.remove("error");
    errorElement.textContent = "";
  };

  const validateSingleField = (input, errorElement, validator) => {
    const result = validator(input.value);
    if (result.valid) showSuccess(input, errorElement);
    else showError(input, errorElement, result.message);
    return result.valid;
  };

  const checkAllValid = () => {
    return validateEmail(email.value).valid && validatePassword(password.value).valid;
  };

  const updateSubmitState = () => {
    submitBtn.disabled = !checkAllValid();
  };

  let touched = { email: false, password: false };

  const attachSoftValidation = (input, errorEl, validator, fieldName) => {
    input.addEventListener("blur", () => {
      touched[fieldName] = true;
      validateSingleField(input, errorEl, validator);
      updateSubmitState();
    });
    input.addEventListener("input", () => {
      if (touched[fieldName]) validateSingleField(input, errorEl, validator);
      updateSubmitState();
    });
  };

  attachSoftValidation(email, emailError, validateEmail, "email");
  attachSoftValidation(password, passwordError, validatePassword, "password");

  // Модалка
  const showModal = () => successModal.classList.add("active");
  const hideModal = () => successModal.classList.remove("active");
  modalClose.addEventListener("click", hideModal);
  successModal.addEventListener("click", (e) => { if (e.target === successModal) hideModal(); });

  // Отправка
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!checkAllValid()) return;

    submitBtn.classList.add("loading");
    submitBtn.disabled = true;

    // Имитация запроса
    await new Promise((resolve) => setTimeout(resolve, 1500));

    submitBtn.classList.remove("loading");
    showModal();
    form.reset();
    submitBtn.disabled = true;
  });

  // Глаз
  const togglePasswordBtn = document.querySelector("#togglePasswordBtn");
  togglePasswordBtn.addEventListener("click", () => {
    const type = password.getAttribute("type") === "password" ? "text" : "password";
    password.setAttribute("type", type);
    togglePasswordBtn.textContent = type === "password" ? "👁" : "🙈";
  });
}