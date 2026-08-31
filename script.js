/* ==========================================================================
   WISEMOVE CONSULTANCY — MAIN JAVASCRIPT
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {

  document.documentElement.classList.add("js");


  /* ========================================================================
     ELEMENTS
     ======================================================================== */

  const html = document.documentElement;
  const body = document.body;

  const themeToggle =
    document.getElementById("themeToggle");

  const navBurger =
    document.getElementById("navBurger");

  const mobileMenu =
    document.getElementById("mobileMenu");

  const consultationModal =
    document.getElementById("consultationModal");

  const closeConsultation =
    document.getElementById("closeConsultation");

  const consultationBackdrop =
    consultationModal
      ? consultationModal.querySelector(".consultation-backdrop")
      : null;

  const consultationForm =
    document.getElementById("consultationForm");

  const contactForm =
    document.getElementById("contactForm");

  const currentYear =
    document.getElementById("currentYear");


  /* ========================================================================
     YEAR
     ======================================================================== */

  if (currentYear) {

    currentYear.textContent =
      new Date().getFullYear();
  }


  /* ========================================================================
     THEME
     ======================================================================== */

  function setTheme(theme) {

    html.setAttribute(
      "data-theme",
      theme
    );

    localStorage.setItem(
      "wisemove-theme",
      theme
    );
  }


  if (themeToggle) {

    themeToggle.addEventListener(
      "click",
      () => {

        const currentTheme =
          html.getAttribute("data-theme") ||
          "dark";

        const newTheme =
          currentTheme === "dark"
            ? "light"
            : "dark";

        setTheme(newTheme);
      }
    );
  }


  /* ========================================================================
     MOBILE NAVIGATION
     ======================================================================== */

  function openMobileMenu() {

    if (!mobileMenu) return;

    mobileMenu.classList.add("open");

    mobileMenu.setAttribute(
      "aria-hidden",
      "false"
    );

    if (navBurger) {

      navBurger.setAttribute(
        "aria-expanded",
        "true"
      );
    }
  }


  function closeMobileMenu() {

    if (!mobileMenu) return;

    mobileMenu.classList.remove("open");

    mobileMenu.setAttribute(
      "aria-hidden",
      "true"
    );

    if (navBurger) {

      navBurger.setAttribute(
        "aria-expanded",
        "false"
      );
    }
  }


  if (navBurger) {

    navBurger.addEventListener(
      "click",
      () => {

        const isOpen =
          mobileMenu &&
          mobileMenu.classList.contains("open");

        if (isOpen) {

          closeMobileMenu();

        } else {

          openMobileMenu();
        }
      }
    );
  }


  if (mobileMenu) {

    mobileMenu
      .querySelectorAll("a")
      .forEach(link => {

        link.addEventListener(
          "click",
          closeMobileMenu
        );
      });
  }


  /* ========================================================================
     CONSULTATION MODAL
     ======================================================================== */

  let lastFocusedElement = null;


  function openConsultation() {

    if (!consultationModal) return;

    lastFocusedElement =
      document.activeElement;

    closeMobileMenu();

    consultationModal.classList.add("open");

    consultationModal.setAttribute(
      "aria-hidden",
      "false"
    );

    body.classList.add("modal-open");

    window.setTimeout(() => {

      if (closeConsultation) {

        closeConsultation.focus();
      }

    }, 100);
  }


  function closeConsultationModal() {

    if (!consultationModal) return;

    consultationModal.classList.remove("open");

    consultationModal.setAttribute(
      "aria-hidden",
      "true"
    );

    body.classList.remove("modal-open");

    if (
      lastFocusedElement &&
      typeof lastFocusedElement.focus === "function"
    ) {

      window.setTimeout(() => {

        lastFocusedElement.focus();

      }, 100);
    }
  }


  /* OPEN MODAL BUTTONS */

  document
    .querySelectorAll("[data-open-consultation]")
    .forEach(button => {

      button.addEventListener(
        "click",
        event => {

          event.preventDefault();

          openConsultation();
        }
      );
    });


  /* CLOSE BUTTON */

  if (closeConsultation) {

    closeConsultation.addEventListener(
      "click",
      closeConsultationModal
    );
  }


  /* CLICK BACKDROP */

  if (consultationBackdrop) {

    consultationBackdrop.addEventListener(
      "click",
      closeConsultationModal
    );
  }


  /* ESCAPE */

  document.addEventListener(
    "keydown",
    event => {

      if (
        event.key === "Escape" &&
        consultationModal &&
        consultationModal.classList.contains("open")
      ) {

        closeConsultationModal();
      }

    }
  );


  /* ========================================================================
     SIMPLE FOCUS TRAP
     ======================================================================== */

  document.addEventListener(
    "keydown",
    event => {

      if (
        event.key !== "Tab" ||
        !consultationModal ||
        !consultationModal.classList.contains("open")
      ) {

        return;
      }

      const focusable =
        consultationModal.querySelectorAll(
          'button, input, textarea, select, a[href]'
        );

      if (!focusable.length) return;

      const first =
        focusable[0];

      const last =
        focusable[focusable.length - 1];

      if (
        event.shiftKey &&
        document.activeElement === first
      ) {

        event.preventDefault();

        last.focus();

      } else if (
        !event.shiftKey &&
        document.activeElement === last
      ) {

        event.preventDefault();

        first.focus();
      }
    }
  );


  /* ========================================================================
     REVEAL ANIMATIONS
     ======================================================================== */

  const revealElements =
    document.querySelectorAll(
      ".reveal-fade, .reveal-line"
    );


  if ("IntersectionObserver" in window) {

    const revealObserver =
      new IntersectionObserver(
        entries => {

          entries.forEach(entry => {

            if (!entry.isIntersecting) {
              return;
            }

            entry.target.classList.add("in");

            revealObserver.unobserve(
              entry.target
            );
          });

        },
        {
          threshold: 0.12,
          rootMargin: "0px 0px -40px 0px"
        }
      );


    revealElements.forEach(element => {

      revealObserver.observe(element);

    });

  } else {

    revealElements.forEach(element => {

      element.classList.add("in");

    });
  }


  /* ========================================================================
     CONTACT FORM
     ======================================================================== */

  function validateEmail(email) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      email
    );
  }


  function setFormStatus(
    element,
    message,
    type
  ) {

    if (!element) return;

    element.textContent = message;

    element.className =
      "form-status " + (type || "");
  }


  if (contactForm) {

    contactForm.addEventListener(
      "submit",
      event => {

        event.preventDefault();


        const name =
          document
            .getElementById("contactName")
            ?.value.trim();

        const email =
          document
            .getElementById("contactEmail")
            ?.value.trim();

        const phone =
          document
            .getElementById("contactPhone")
            ?.value.trim();

        const subject =
          document
            .getElementById("contactSubject")
            ?.value.trim();

        const message =
          document
            .getElementById("contactMessage")
            ?.value.trim();

        const status =
          document.getElementById(
            "contactFormStatus"
          );

        const submit =
          document.getElementById(
            "contactSubmit"
          );


        /* VALIDATION */

        if (!name) {

          setFormStatus(
            status,
            "Please enter your name.",
            "error"
          );

          document
            .getElementById("contactName")
            ?.focus();

          return;
        }


        if (
          !email ||
          !validateEmail(email)
        ) {

          setFormStatus(
            status,
            "Please enter a valid email address.",
            "error"
          );

          document
            .getElementById("contactEmail")
            ?.focus();

          return;
        }


        if (!phone) {

          setFormStatus(
            status,
            "Please enter your phone number.",
            "error"
          );

          document
            .getElementById("contactPhone")
            ?.focus();

          return;
        }


        if (!subject) {

          setFormStatus(
            status,
            "Please enter a subject.",
            "error"
          );

          document
            .getElementById("contactSubject")
            ?.focus();

          return;
        }


        if (!message) {

          setFormStatus(
            status,
            "Please enter your message.",
            "error"
          );

          document
            .getElementById("contactMessage")
            ?.focus();

          return;
        }


        /* SUBMIT STATE */

        if (submit) {

          submit.disabled = true;

          submit.innerHTML =
            `
              <span>Sending...</span>
              <span>...</span>
            `;
        }


        /*
         * FRONT-END DEMO SUCCESS
         *
         * Connect this section to your backend/API/email
         * service when the backend is ready.
         */

        window.setTimeout(() => {

          setFormStatus(
            status,
            "Thank you. Your message has been received.",
            "success"
          );

          contactForm.reset();

          if (submit) {

            submit.disabled = false;

            submit.innerHTML =
              `
                <span class="submit-text">
                  Send Message
                </span>

                <span
                  class="submit-arrow"
                  aria-hidden="true"
                >
                  →
                </span>
              `;
          }

        }, 700);

      }
    );
  }


  /* ========================================================================
     CONSULTATION FORM
     ======================================================================== */

  if (consultationForm) {

    consultationForm.addEventListener(
      "submit",
      event => {

        event.preventDefault();


        const name =
          document
            .getElementById("consultName")
            ?.value.trim();

        const phone =
          document
            .getElementById("consultPhone")
            ?.value.trim();

        const email =
          document
            .getElementById("consultEmail")
            ?.value.trim();

        const status =
          document.getElementById(
            "consultationStatus"
          );

        const submit =
          document.getElementById(
            "consultationSubmit"
          );


        /* VALIDATION */

        if (!name) {

          setFormStatus(
            status,
            "Please enter your name.",
            "error"
          );

          document
            .getElementById("consultName")
            ?.focus();

          return;
        }


        if (!phone) {

          setFormStatus(
            status,
            "Please enter your phone number.",
            "error"
          );

          document
            .getElementById("consultPhone")
            ?.focus();

          return;
        }


        if (
          !email ||
          !validateEmail(email)
        ) {

          setFormStatus(
            status,
            "Please enter a valid email address.",
            "error"
          );

          document
            .getElementById("consultEmail")
            ?.focus();

          return;
        }


        /* SUBMIT */

        if (submit) {

          submit.disabled = true;

          submit.innerHTML =
            `
              <span>Submitting...</span>
              <span>...</span>
            `;
        }


        /*
         * FRONT-END DEMO SUCCESS
         *
         * Connect this to your backend/API/email service.
         */

        window.setTimeout(() => {

          setFormStatus(
            status,
            "Thank you. We'll contact you shortly.",
            "success"
          );


          consultationForm.reset();


          if (submit) {

            submit.disabled = false;

            submit.innerHTML =
              `
                <span>
                  Book Consultation
                </span>

                <span>
                  ↗
                </span>
              `;
          }


          /*
           * Keep the success message visible briefly,
           * then close the modal.
           */

          window.setTimeout(() => {

            closeConsultationModal();

            if (status) {

              status.textContent = "";

              status.className =
                "form-status";
            }

          }, 1800);

        }, 700);

      }
    );
  }


  /* ========================================================================
     SET MINIMUM CONSULTATION DATE
     ======================================================================== */

  const consultationDate =
    document.getElementById(
      "consultDate"
    );

  if (consultationDate) {

    const today =
      new Date();

    const year =
      today.getFullYear();

    const month =
      String(
        today.getMonth() + 1
      ).padStart(2, "0");

    const day =
      String(
        today.getDate()
      ).padStart(2, "0");

    consultationDate.min =
      `${year}-${month}-${day}`;
  }


  /* ========================================================================
     SMOOTH ANCHOR LINKS
     ======================================================================== */

  document
    .querySelectorAll(
      'a[href^="#"]'
    )
    .forEach(anchor => {

      anchor.addEventListener(
        "click",
        event => {

          const href =
            anchor.getAttribute("href");

          if (
            !href ||
            href === "#"
          ) {

            return;
          }

          const target =
            document.querySelector(href);

          if (!target) return;

          event.preventDefault();

          target.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });

        }
      );

    });


  /* ========================================================================
     WINDOW RESIZE
     ======================================================================== */

  window.addEventListener(
    "resize",
    () => {

      if (
        window.innerWidth > 900
      ) {

        closeMobileMenu();
      }

    }
  );

});
