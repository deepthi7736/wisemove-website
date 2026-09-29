/* =========================================================
   WISEMOVE WEBSITE SCRIPT
   ========================================================= */

/* =========================================================
   CONFIGURATION
   ========================================================= */

const API_BASE_URL = "http://localhost:5000";


/* =========================================================
   THEME TOGGLE
   ========================================================= */

(function setupTheme() {
  const root = document.documentElement;
  const themeToggle = document.querySelector("[data-theme-toggle]");

  if (!themeToggle) return;

  function updateThemeIcon() {
    const currentTheme = root.getAttribute("data-theme");

    const sunIcon = themeToggle.querySelector(".i-sun");
    const moonIcon = themeToggle.querySelector(".i-moon");

    if (sunIcon) {
      sunIcon.style.display = currentTheme === "dark" ? "block" : "none";
    }

    if (moonIcon) {
      moonIcon.style.display = currentTheme === "light" ? "block" : "none";
    }

    themeToggle.setAttribute(
      "aria-label",
      currentTheme === "dark"
        ? "Switch to light theme"
        : "Switch to dark theme"
    );
  }

  updateThemeIcon();

  themeToggle.addEventListener("click", function () {
    const currentTheme = root.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";

    root.setAttribute("data-theme", newTheme);

    try {
      localStorage.setItem("wisemove-theme", newTheme);
    } catch (error) {
      console.warn("Could not save theme preference:", error);
    }

    updateThemeIcon();
  });
})();


/* =========================================================
   MOBILE MENU
   ========================================================= */

(function setupMobileMenu() {
  const menuToggle = document.querySelector("[data-menu-toggle]");
  const mobileMenu = document.getElementById("mobileMenu");

  if (!menuToggle || !mobileMenu) return;

  function openMenu() {
    mobileMenu.hidden = false;

    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "Close menu");

    document.body.classList.add("menu-open");
  }

  function closeMenu() {
    mobileMenu.hidden = true;

    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open menu");

    document.body.classList.remove("menu-open");
  }

  menuToggle.addEventListener("click", function () {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";

    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Close menu when a navigation link is clicked
  mobileMenu.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      closeMenu();
    });
  });

  // Close menu when Escape is pressed
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  // Close menu if window becomes desktop size
  window.addEventListener("resize", function () {
    if (window.innerWidth > 900) {
      closeMenu();
    }
  });
})();


/* =========================================================
   CONTACT MODAL
   ========================================================= */

(function setupModal() {
  const modal = document.getElementById("contactModal");

  if (!modal) return;

  const openButtons = document.querySelectorAll("[data-modal-open]");
  const closeButtons = modal.querySelectorAll("[data-modal-close]");

  function openModal() {
    modal.hidden = false;
    modal.setAttribute("aria-hidden", "false");

    document.body.classList.add("modal-open");

    // Focus first input
    const firstInput = modal.querySelector("input");

    if (firstInput) {
      setTimeout(function () {
        firstInput.focus();
      }, 50);
    }
  }

  function closeModal() {
    modal.hidden = true;
    modal.setAttribute("aria-hidden", "true");

    document.body.classList.remove("modal-open");
  }

  openButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      openModal();
    });
  });

  closeButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      closeModal();
    });
  });

  // Close modal with Escape
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && !modal.hidden) {
      closeModal();
    }
  });

  // Prevent clicking inside panel from closing modal
  const modalPanel = modal.querySelector(".modal-panel");

  if (modalPanel) {
    modalPanel.addEventListener("click", function (event) {
      event.stopPropagation();
    });
  }
})();


/* =========================================================
   FAQ ACCORDION
   ========================================================= */

(function setupFAQ() {
  const faqButtons = document.querySelectorAll(".faq-q");

  if (!faqButtons.length) return;

  faqButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const isExpanded =
        button.getAttribute("aria-expanded") === "true";

      const answerId = button.getAttribute("aria-controls");
      const answer = document.getElementById(answerId);

      // Close all other FAQ items
      faqButtons.forEach(function (otherButton) {
        if (otherButton !== button) {
          otherButton.setAttribute("aria-expanded", "false");

          const otherAnswerId =
            otherButton.getAttribute("aria-controls");

          const otherAnswer =
            document.getElementById(otherAnswerId);

          if (otherAnswer) {
            otherAnswer.style.maxHeight = null;
          }
        }
      });

      // Toggle current item
      button.setAttribute(
        "aria-expanded",
        isExpanded ? "false" : "true"
      );

      if (answer) {
        if (isExpanded) {
          answer.style.maxHeight = null;
        } else {
          answer.style.maxHeight = answer.scrollHeight + "px";
        }
      }
    });
  });
})();


/* =========================================================
   SCROLL REVEAL
   ========================================================= */

(function setupReveal() {
  const revealElements = document.querySelectorAll(".reveal");

  if (!revealElements.length) return;

  // If browser does not support IntersectionObserver,
  // simply show all elements.
  if (!("IntersectionObserver" in window)) {
    revealElements.forEach(function (element) {
      element.classList.add("is-visible");
    });

    return;
  }

  const observer = new IntersectionObserver(
    function (entries, observerInstance) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");

          observerInstance.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12
    }
  );

  revealElements.forEach(function (element) {
    observer.observe(element);
  });
})();


/* =========================================================
   COPYRIGHT YEAR
   ========================================================= */

(function setupYear() {
  const yearElements = document.querySelectorAll("[data-year]");

  const currentYear = new Date().getFullYear();

  yearElements.forEach(function (element) {
    element.textContent = currentYear;
  });
})();


/* =========================================================
   ENQUIRY FORM
   ========================================================= */

(function setupEnquiryForms() {
  const forms = document.querySelectorAll("[data-enquiry-form]");

  if (!forms.length) return;

  forms.forEach(function (form) {
    form.addEventListener("submit", async function (event) {
      event.preventDefault();

      const statusElement =
        form.querySelector("[data-form-status]");

      const submitButton =
        form.querySelector('button[type="submit"]');

      if (!submitButton) return;

      /* ---------------------------------------------
         Get form values
         --------------------------------------------- */

      const formData = new FormData(form);

      const name = (formData.get("name") || "").trim();
      const email = (formData.get("email") || "").trim();
      const company = (formData.get("company") || "").trim();
      const phone = (formData.get("phone") || "").trim();
      const subject = (formData.get("subject") || "").trim();
      const message = (formData.get("message") || "").trim();


      /* ---------------------------------------------
         Validate required fields
         --------------------------------------------- */

      if (!name) {
        showFormError(
          form,
          statusElement,
          "Please enter your name."
        );

        const nameInput = form.querySelector('[name="name"]');

        if (nameInput) {
          nameInput.focus();
        }

        return;
      }

      if (!email) {
        showFormError(
          form,
          statusElement,
          "Please enter your email address."
        );

        const emailInput = form.querySelector('[name="email"]');

        if (emailInput) {
          emailInput.focus();
        }

        return;
      }

      if (!isValidEmail(email)) {
        showFormError(
          form,
          statusElement,
          "Please enter a valid email address."
        );

        const emailInput = form.querySelector('[name="email"]');

        if (emailInput) {
          emailInput.focus();
        }

        return;
      }

      if (!message) {
        showFormError(
          form,
          statusElement,
          "Please enter your message."
        );

        const messageInput =
          form.querySelector('[name="message"]');

        if (messageInput) {
          messageInput.focus();
        }

        return;
      }


      /* ---------------------------------------------
         Prepare API data
         --------------------------------------------- */

      const enquiryData = {
        name: name,
        email: email,
        company: company,
        phone: phone,
        subject: subject,
        message: message
      };


      /* ---------------------------------------------
         Disable submit button
         --------------------------------------------- */

      const originalButtonHTML = submitButton.innerHTML;

      submitButton.disabled = true;

      submitButton.innerHTML = "Sending...";

      if (statusElement) {
        statusElement.textContent =
          "Sending your enquiry...";
        statusElement.classList.remove("form-error");
        statusElement.classList.add("form-loading");
      }


      /* ---------------------------------------------
         Send to Node.js backend
         --------------------------------------------- */

      try {
        const response = await fetch(
          `${API_BASE_URL}/api/enquiries`,
          {
            method: "POST",

            headers: {
              "Content-Type": "application/json"
            },

            body: JSON.stringify(enquiryData)
          }
        );


        /* ---------------------------------------------
           Parse response
           --------------------------------------------- */

        let result;

        try {
          result = await response.json();
        } catch (jsonError) {
          result = null;
        }


        /* ---------------------------------------------
           Handle API error
           --------------------------------------------- */

        if (!response.ok) {
          throw new Error(
            result?.message ||
            "Unable to submit enquiry."
          );
        }


        /* ---------------------------------------------
           Success
           --------------------------------------------- */

        console.log(
          "Enquiry submitted successfully:",
          result
        );

        if (statusElement) {
          statusElement.textContent =
            "Thank you! Your enquiry has been submitted successfully.";

          statusElement.classList.remove(
            "form-error",
            "form-loading"
          );

          statusElement.classList.add("form-success");
        }

        // Clear form
        form.reset();


        /* ---------------------------------------------
           If this is the modal form, close modal
           after successful submission
           --------------------------------------------- */

        const modal =
          form.closest(".modal");

        if (modal) {
          setTimeout(function () {
            modal.hidden = true;
            modal.setAttribute(
              "aria-hidden",
              "true"
            );

            document.body.classList.remove(
              "modal-open"
            );
          }, 1800);
        }

      } catch (error) {

        console.error(
          "Enquiry submission failed:",
          error
        );


        /* ---------------------------------------------
           Error message
           --------------------------------------------- */

        if (statusElement) {
          statusElement.textContent =
            "Something went wrong while submitting your enquiry. Please try again.";

          statusElement.classList.remove(
            "form-success",
            "form-loading"
          );

          statusElement.classList.add("form-error");
        }

      } finally {

        /* ---------------------------------------------
           Re-enable button
           --------------------------------------------- */

        submitButton.disabled = false;

        submitButton.innerHTML =
          originalButtonHTML;
      }
    });
  });


  /* ===================================================
     HELPER FUNCTIONS
     =================================================== */

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }


  function showFormError(
    form,
    statusElement,
    message
  ) {
    if (!statusElement) return;

    statusElement.textContent = message;

    statusElement.classList.remove(
      "form-success",
      "form-loading"
    );

    statusElement.classList.add("form-error");
  }
})();


/* =========================================================
   PAGE LOAD
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {
  console.log("WiseMove website loaded.");
});