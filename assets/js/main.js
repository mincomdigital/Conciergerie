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

const themeToggleButtons = document.querySelectorAll("[data-theme-toggle]");
if (themeToggleButtons.length) {
  const themeStorageKey = "cledor-theme";
  const getStoredTheme = () => {
    try {
      return localStorage.getItem(themeStorageKey);
    } catch (_error) {
      return null;
    }
  };

  const detectTheme = () => {
    const stored = getStoredTheme();
    if (stored === "dark" || stored === "light") return stored;
    const supportsMatchMedia = typeof window.matchMedia === "function";
    return supportsMatchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  };

  const applyTheme = (theme) => {
    document.body.dataset.theme = theme;
    const isDark = theme === "dark";
    themeToggleButtons.forEach((button) => {
      const label = button.querySelector("[data-theme-toggle-label]");
      if (label) label.textContent = isDark ? "Mode clair" : "Mode sombre";
      button.setAttribute("aria-label", isDark ? "Activer le mode clair" : "Activer le mode sombre");
    });
  };

  const saveTheme = (theme) => {
    try {
      localStorage.setItem(themeStorageKey, theme);
    } catch (_error) {
      // Ignore local storage errors.
    }
  };

  applyTheme(detectTheme());

  themeToggleButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const nextTheme = document.body.dataset.theme === "dark" ? "light" : "dark";
      applyTheme(nextTheme);
      saveTheme(nextTheme);
    });
  });
}

const parallaxLayers = document.querySelectorAll(".parallax-layer");
const reduceMotionQuery = typeof window.matchMedia === "function"
  ? window.matchMedia("(prefers-reduced-motion: reduce)")
  : null;

if (parallaxLayers.length && !(reduceMotionQuery && reduceMotionQuery.matches)) {
  let ticking = false;

  const updateParallax = () => {
    const scrollY = window.scrollY || window.pageYOffset;
    parallaxLayers.forEach((layer) => {
      const speed = Number(layer.dataset.parallaxSpeed || "0.08");
      const shift = scrollY * speed;
      layer.style.transform = `translate3d(0, ${shift}px, 0)`;
    });
    ticking = false;
  };

  const requestUpdate = () => {
    if (ticking) return;
    window.requestAnimationFrame(updateParallax);
    ticking = true;
  };

  window.addEventListener("scroll", requestUpdate, { passive: true });
  updateParallax();
}

const journeyPlanner = document.querySelector("#journeyPlanner");
if (journeyPlanner) {
  const stepEls = Array.from(journeyPlanner.querySelectorAll(".journey-step"));
  const prevBtn = document.querySelector("#journeyPrev");
  const nextBtn = document.querySelector("#journeyNext");
  const progressBar = document.querySelector("#journeyProgressBar");
  const summaryTitle = document.querySelector("#journeyTitle");
  const summaryText = document.querySelector("#journeyText");
  const badgesWrap = document.querySelector("#journeyBadges");
  const ctaLink = document.querySelector("#journeyCta");

  let stepIndex = 0;
  const journeyState = {
    city: "",
    property: "",
    goal: "",
    start: ""
  };

  const labelByField = {
    city: "Zone",
    property: "Bien",
    goal: "Objectif",
    start: "Demarrage"
  };

  const getPack = () => {
    if (journeyState.property === "Portfolio" || journeyState.goal === "Deleguer completement") {
      return "Collection";
    }
    if (journeyState.goal === "Maximiser les revenus" || journeyState.goal === "Gagner du temps") {
      return "Signature";
    }
    return "Essentiel";
  };

  const renderBadges = () => {
    const activeItems = Object.entries(journeyState).filter((item) => item[1]);
    if (!badgesWrap) return;
    if (!activeItems.length) {
      badgesWrap.innerHTML = "<span>Mission en cours</span>";
      return;
    }
    badgesWrap.innerHTML = activeItems
      .map((item) => `<span>${labelByField[item[0]]}: ${item[1]}</span>`)
      .join("");
  };

  const updateSummary = (isDone) => {
    const pack = getPack();
    if (!summaryTitle || !summaryText) return;
    if (!isDone) {
      summaryTitle.textContent = "Debloquez votre recommandation";
      summaryText.textContent = "Completez les missions pour recevoir un plan sur mesure et une proposition adaptee a votre bien.";
      renderBadges();
      return;
    }
    summaryTitle.textContent = `Plan recommande: ${pack}`;
    summaryText.textContent = `Pour un bien ${journeyState.property || "locatif"} en ${journeyState.city || "metropole rouennaise"}, axe "${journeyState.goal || "performance"}", nous suggerons un lancement ${journeyState.start || "prochainement"} avec un potentiel de progression de 20% a 35%.`;
    renderBadges();
  };

  const updateProgress = () => {
    if (!progressBar) return;
    const currentStep = stepEls[stepIndex];
    const field = currentStep ? currentStep.dataset.field : "";
    const isAnswered = field ? Boolean(journeyState[field]) : false;
    const progress = ((stepIndex + (isAnswered ? 1 : 0)) / stepEls.length) * 100;
    progressBar.style.width = `${Math.max(progress, 0)}%`;
  };

  const renderStep = () => {
    stepEls.forEach((step, index) => {
      step.classList.toggle("is-active", index === stepIndex);
      if (index !== stepIndex) return;
      const field = step.dataset.field;
      const selected = journeyState[field] || "";
      step.querySelectorAll(".journey-option").forEach((option) => {
        option.classList.toggle("selected", option.dataset.value === selected);
      });
    });

    const field = stepEls[stepIndex].dataset.field;
    const hasSelection = Boolean(journeyState[field]);

    if (prevBtn) prevBtn.disabled = stepIndex === 0;
    if (nextBtn) {
      nextBtn.disabled = !hasSelection;
      nextBtn.textContent = stepIndex === stepEls.length - 1 ? "Terminer" : "Suivant";
    }

    updateProgress();
    updateSummary(false);
  };

  const persistJourney = () => {
    const payload = {
      ...journeyState,
      recommendedPack: getPack(),
      savedAt: new Date().toISOString()
    };
    localStorage.setItem("conciergerieJourney", JSON.stringify(payload));
  };

  const finishJourney = () => {
    persistJourney();
    updateSummary(true);
    if (progressBar) progressBar.style.width = "100%";
    if (nextBtn) {
      nextBtn.disabled = true;
      nextBtn.textContent = "Termine";
    }
    if (ctaLink) {
      const params = new URLSearchParams({
        from: "parcours",
        city: journeyState.city,
        property: journeyState.property
      });
      ctaLink.href = `contact.html?${params.toString()}`;
    }
  };

  journeyPlanner.querySelectorAll(".journey-option").forEach((option) => {
    option.addEventListener("click", () => {
      const step = option.closest(".journey-step");
      if (!step) return;
      const field = step.dataset.field;
      if (!field) return;
      journeyState[field] = String(option.dataset.value || "");
      step.querySelectorAll(".journey-option").forEach((btn) => btn.classList.remove("selected"));
      option.classList.add("selected");
      if (nextBtn) nextBtn.disabled = false;
      updateProgress();
      renderBadges();
    });
  });

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      if (stepIndex > 0) {
        stepIndex -= 1;
        renderStep();
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      const field = stepEls[stepIndex].dataset.field;
      if (!journeyState[field]) return;
      if (stepIndex < stepEls.length - 1) {
        stepIndex += 1;
        renderStep();
        return;
      }
      finishJourney();
    });
  }

  renderStep();
}

const simNights = document.querySelector("#simNights");
const simPrice = document.querySelector("#simPrice");
if (simNights && simPrice) {
  const simNightsValue = document.querySelector("#simNightsValue");
  const simPriceValue = document.querySelector("#simPriceValue");
  const simCurrent = document.querySelector("#simCurrent");
  const simOptimized = document.querySelector("#simOptimized");
  const simGain = document.querySelector("#simGain");

  const formatCurrency = (value) => `${Math.round(value).toLocaleString("fr-FR")} EUR`;

  const updateSimulator = () => {
    const nights = Number(simNights.value);
    const price = Number(simPrice.value);
    const current = nights * price;
    const optimized = current * 1.27;
    const gain = optimized - current;

    if (simNightsValue) simNightsValue.textContent = String(nights);
    if (simPriceValue) simPriceValue.textContent = String(price);
    if (simCurrent) simCurrent.textContent = formatCurrency(current);
    if (simOptimized) simOptimized.textContent = formatCurrency(optimized);
    if (simGain) simGain.textContent = `+${formatCurrency(gain)}`;
  };

  simNights.addEventListener("input", updateSimulator);
  simPrice.addEventListener("input", updateSimulator);
  updateSimulator();
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
  const cityField = document.querySelector("#city");
  const propertiesField = document.querySelector("#properties");
  const messageField = document.querySelector("#message");
  const submitButton = contactForm.querySelector("button[type='submit']");
  const emailConfig = window.CLE_DOR_EMAIL_CONFIG || {};

  const mapPropertyToCount = (property) => {
    if (property === "Portfolio") return "2 a 3 logements";
    return "1 logement";
  };

  const setStatus = (message, type) => {
    if (!status) return;
    status.textContent = message;
    status.className = `form-status ${type}`;
  };

  const sendLeadEmail = async (payload) => {
    const provider = String(emailConfig.provider || "none").toLowerCase();

    if (provider === "none") {
      return { configured: false, delivered: false };
    }

    if (provider === "formsubmit") {
      const recipient = String(emailConfig.recipient || "").trim();
      const endpoint = String(emailConfig.endpoint || "").trim()
        || (recipient ? `https://formsubmit.co/ajax/${encodeURIComponent(recipient)}` : "");
      if (!endpoint) {
        throw new Error("Configuration FormSubmit incomplete.");
      }

      const formPayload = {
        _subject: emailConfig.subject || "Nouvelle demande depuis Cle d'Or Conciergerie",
        _captcha: "false",
        name: payload.fullName,
        email: payload.email,
        phone: payload.phone,
        city: payload.city,
        properties: payload.properties,
        message: payload.message
      };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formPayload)
      });

      const json = await response.json().catch(() => null);
      if (!response.ok || (json && json.success === false)) {
        throw new Error("Echec d'envoi vers FormSubmit.");
      }

      return { configured: true, delivered: true };
    }

    if (provider === "formspree") {
      const endpoint = String(emailConfig.formspreeEndpoint || emailConfig.endpoint || "").trim();
      if (!endpoint) {
        throw new Error("Configuration Formspree incomplete.");
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error("Echec d'envoi vers Formspree.");
      }

      return { configured: true, delivered: true };
    }

    if (provider === "web3forms") {
      const accessKey = String(emailConfig.accessKey || "").trim();
      if (!accessKey) {
        throw new Error("Configuration Web3Forms incomplete.");
      }

      const formPayload = {
        access_key: accessKey,
        subject: emailConfig.subject || "Nouvelle demande depuis Cle d'Or Conciergerie",
        from_name: payload.fullName,
        email: payload.email,
        phone: payload.phone,
        city: payload.city,
        properties: payload.properties,
        message: payload.message
      };

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(formPayload)
      });

      const json = await response.json();
      if (!response.ok || json.success !== true) {
        throw new Error("Echec d'envoi vers Web3Forms.");
      }

      return { configured: true, delivered: true };
    }

    throw new Error("Provider email non supporte.");
  };

  const preloadJourney = () => {
    const raw = localStorage.getItem("conciergerieJourney");
    if (!raw) return;
    try {
      const journey = JSON.parse(raw);
      if (cityField && !cityField.value && journey.city) {
        cityField.value = journey.city;
      }
      if (propertiesField && !propertiesField.value && journey.property) {
        const mapped = mapPropertyToCount(journey.property);
        Array.from(propertiesField.options).forEach((opt) => {
          if (opt.textContent.trim() === mapped) {
            propertiesField.value = opt.value || mapped;
          }
        });
      }
      if (messageField && !messageField.value) {
        const autoMessage = [
          "Bonjour,",
          "je viens de terminer le parcours express du site.",
          `Zone: ${journey.city || "metropole rouennaise"}.`,
          `Type de bien: ${journey.property || "non precise"}.`,
          `Objectif: ${journey.goal || "optimiser la location"}.`,
          `Demarrage souhaite: ${journey.start || "des que possible"}.`,
          `Formule recommandee: ${journey.recommendedPack || "Signature"}.`
        ].join(" ");
        messageField.value = autoMessage;
      }
      if (status) {
        setStatus("Parcours detecte: vos informations ont ete pre-remplies.", "info");
      }
    } catch (_error) {
      // Ignore invalid local storage payload.
    }
  };

  preloadJourney();

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(contactForm);
    const requiredFields = ["fullName", "email", "phone", "city", "properties", "message"];
    const isMissing = requiredFields.some((field) => !String(formData.get(field) || "").trim());

    if (isMissing) {
      setStatus("Merci de remplir tous les champs obligatoires.", "error");
      return;
    }

    const payload = {
      fullName: String(formData.get("fullName") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      phone: String(formData.get("phone") || "").trim(),
      city: String(formData.get("city") || "").trim(),
      properties: String(formData.get("properties") || "").trim(),
      message: String(formData.get("message") || "").trim()
    };

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Envoi en cours...";
    }

    try {
      const result = await sendLeadEmail(payload);
      if (result.configured && result.delivered) {
        setStatus("Parfait, votre demande a bien ete envoyee par email. Nous revenons vers vous sous 24h.", "success");
      } else {
        setStatus("Mode demo actif: configurez l'envoi email dans assets/js/email-config.js pour recevoir les demandes.", "info");
      }
      contactForm.reset();
    } catch (_error) {
      setStatus("Une erreur est survenue pendant l'envoi. Verifiez la configuration email.", "error");
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = "Recevoir mon estimation";
      }
    }
  });
}
