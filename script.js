// ===============================================
// ПЕРЕКЛЮЧАТЕЛЬ ТЕМЫ
// ===============================================
const themeBtn = document.querySelector("#themeBtn");
if (themeBtn) {
  function getSavedTheme() {
    try { return localStorage.getItem("theme"); } catch (e) { return null; }
  }
  function saveTheme(theme) {
    try { localStorage.setItem("theme", theme); } catch (e) {}
  }
  const savedTheme = getSavedTheme();
  if (savedTheme === "dark") document.body.classList.add("dark");

  themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    saveTheme(document.body.classList.contains("dark") ? "dark" : "light");
  });
}

// ===============================================
// КНОПКА «НАВЕРХ»
// ===============================================
const scrollTopBtn = document.querySelector("#scrollTopBtn");
if (scrollTopBtn) {
  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) scrollTopBtn.classList.add("visible");
    else scrollTopBtn.classList.remove("visible");
  });
  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// ===============================================
// ФИЛЬТР КАРТОЧЕК
// ===============================================
const filterButtons = document.querySelectorAll(".filter-btn");
const cards = document.querySelectorAll(".card");
const filterCount = document.querySelector("#filterCount");

if (cards.length > 0) {
  function filterCards(category) {
    let visibleCount = 0;
    cards.forEach((card) => {
      if (category === "all" || card.dataset.category === category) {
        card.classList.remove("card-hidden");
        visibleCount++;
      } else {
        card.classList.add("card-hidden");
      }
    });
    if (filterCount) filterCount.textContent = visibleCount;
  }

  filterCards("all");

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
      filterCards(button.dataset.filter);
    });
  });
}

// ===============================================
// БУРГЕР-МЕНЮ
// ===============================================
const burgerBtn = document.querySelector("#burgerBtn");
const mobileNav = document.querySelector("#mobileNav");
const overlay = document.querySelector("#overlay");

if (burgerBtn && mobileNav && overlay) {
  function openMenu() {
    mobileNav.classList.add("open");
    burgerBtn.classList.add("active");
    overlay.classList.add("active");
    document.body.style.overflow = "hidden";
  }
  function closeMenu() {
    mobileNav.classList.remove("open");
    burgerBtn.classList.remove("active");
    overlay.classList.remove("active");
    document.body.style.overflow = "";
  }

  burgerBtn.addEventListener("click", () => {
    if (mobileNav.classList.contains("open")) closeMenu();
    else openMenu();
  });

  mobileNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  overlay.addEventListener("click", closeMenu);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && mobileNav.classList.contains("open")) {
      closeMenu();
    }
  });
}