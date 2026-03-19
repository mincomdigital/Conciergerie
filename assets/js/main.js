const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

const revealEls = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window && revealEls.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  revealEls.forEach((el) => observer.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add("visible"));
}

const yearEl = document.querySelector("#year");
if (yearEl) {
  yearEl.textContent = String(new Date().getFullYear());
}

document.querySelectorAll(".faq-item").forEach((item) => {
  const button = item.querySelector(".faq-question");
  const answer = item.querySelector(".faq-answer");
  if (!button || !answer) return;

  button.addEventListener("click", () => {
    const isOpen = item.classList.toggle("open");
    button.setAttribute("aria-expanded", String(isOpen));
    answer.style.maxHeight = isOpen ? `${answer.scrollHeight + 20}px` : "0";
  });
});

const contactForm = document.querySelector("#contactForm");
if (contactForm) {
  const status = document.querySelector("#formStatus");
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(contactForm);
    const requiredFields = ["fullName", "email", "phone", "city", "properties", "message"];
    const isMissing = requiredFields.some((field) => !String(formData.get(field) || "").trim());

    if (isMissing) {
      if (status) {
        status.textContent = "Merci de remplir tous les champs obligatoires.";
        status.className = "form-status error";
      }
      return;
    }

    if (status) {
      status.textContent = "Merci, votre demande a bien ete envoyee. Nous revenons vers vous sous 24h.";
      status.className = "form-status success";
    }

    contactForm.reset();
  });
}
