/* =========================================================
   WiseMove Consultancy
   Main JavaScript
   ========================================================= */


/* ---------------------------------------------------------
   THEME
--------------------------------------------------------- */

const body = document.body;
const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");

const moonIcon = `
  <path d="M21 12.79A9 9 0 1 1 11.21 3
           7 7 0 0 0 9.79 9.79z"></path>
`;

const sunIcon = `
  <circle cx="12" cy="12" r="4"></circle>
  <path d="M12 2v2"></path>
  <path d="M12 20v2"></path>
  <path d="M4.93 4.93l1.41 1.41"></path>
  <path d="M17.66 17.66l1.41 1.41"></path>
  <path d="M2 12h2"></path>
  <path d="M20 12h2"></path>
  <path d="M6.34 17.66l-1.41 1.41"></path>
  <path d="M19.07 4.93l-1.41 1.41"></path>
`;

function setTheme(theme) {
  body.setAttribute("data-theme", theme);

  localStorage.setItem("wisemove-theme", theme);

  if (themeIcon) {
    themeIcon.innerHTML =
      theme === "dark" ? sunIcon : moonIcon;
  }

  if (themeToggle) {
    themeToggle.setAttribute(
      "aria-label",
      theme === "dark"
        ? "Switch to light theme"
        : "Switch to dark theme"
    );
  }
}

function getInitialTheme() {
  const savedTheme =
    localStorage.getItem("wisemove-theme");

  if (
    savedTheme === "dark" ||
    savedTheme === "light"
  ) {
    return savedTheme;
  }

  return "dark";
}

setTheme(getInitialTheme());

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const currentTheme =
      body.getAttribute("data-theme");

    const nextTheme =
      currentTheme === "dark"
        ? "light"
        : "dark";

    setTheme(nextTheme);
  });
}


/* ---------------------------------------------------------
   TERMINAL HERO ANIMATION
--------------------------------------------------------- */

const termBody =
  document.getElementById("termBody");

const terminalLines = [
  {
    type: "prompt",
    text: "$ wisemove init product-studio"
  },
  {
    type: "muted",
    text: "→ loading product strategy..."
  },
  {
    type: "ok",
    text: "✓ strategy ready"
  },
  {
    type: "muted",
    text: "→ loading design system..."
  },
  {
    type: "ok",
    text: "✓ interface ready"
  },
  {
    type: "muted",
    text: "→ deploying Getvia..."
  },
  {
    type: "ok",
    text: "✓ getvia.in is live"
  },
  {
    type: "muted",
    text: "→ deploying VASHQ..."
  },
  {
    type: "ok",
    text: "✓ VASHQ is live"
  },
  {
    type: "prompt",
    text: "$ status"
  },
  {
    type: "ok",
    text: "✓ building smarter digital products"
  }
];

function getTerminalClass(type) {
  if (type === "prompt") {
    return "term-prompt";
  }

  if (type === "ok") {
    return "term-ok";
  }

  if (type === "muted") {
    return "term-muted";
  }

  return "";
}

async function runTerminal() {
  if (!termBody) {
    return;
  }

  termBody.innerHTML = "";

  for (const line of terminalLines) {
    const lineElement =
      document.createElement("div");

    lineElement.className =
      `term-line ${getTerminalClass(line.type)}`;

    termBody.appendChild(lineElement);

    await typeText(
      lineElement,
      line.text,
      line.type === "prompt" ? 28 : 18
    );

    await wait(180);
  }

  const cursor =
    document.createElement("span");

  cursor.className = "cursor";

  const finalLine =
    document.createElement("div");

  finalLine.className =
    "term-line term-prompt";

  finalLine.textContent = "$ ";

  finalLine.appendChild(cursor);

  termBody.appendChild(finalLine);
}

function typeText(
  element,
  text,
  speed = 20
) {
  return new Promise((resolve) => {
    let index = 0;

    function typeCharacter() {
      if (index >= text.length) {
        resolve();
        return;
      }

      element.textContent +=
        text.charAt(index);

      index += 1;

      setTimeout(
        typeCharacter,
        speed
      );
    }

    typeCharacter();
  });
}

function wait(ms) {
  return new Promise((resolve) =>
    setTimeout(resolve, ms)
  );
}

const reducedMotion =
  window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

if (reducedMotion) {
  if (termBody) {
    termBody.innerHTML =
      terminalLines
        .map(
          (line) =>
            `<div class="term-line ${getTerminalClass(
              line.type
            )}">${line.text}</div>`
        )
        .join("") +
      `
        <div class="term-line term-prompt">
          $ <span class="cursor"></span>
        </div>
      `;
  }
} else {
  runTerminal();
}


/* ---------------------------------------------------------
   REVEAL ON SCROLL
--------------------------------------------------------- */

const revealElements =
  document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const revealObserver =
    new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add("in");

          observer.unobserve(
            entry.target
          );
        });
      },
      {
        threshold: 0.1,
        rootMargin:
          "0px 0px -50px 0px"
      }
    );

  revealElements.forEach((element) => {
    revealObserver.observe(element);
  });
} else {
  revealElements.forEach((element) => {
    element.classList.add("in");
  });
}


/* ---------------------------------------------------------
   FAQ
--------------------------------------------------------- */

const faqItems =
  document.querySelectorAll(".faq-item");

faqItems.forEach((item) => {
  const button =
    item.querySelector(".faq-q");

  const answer =
    item.querySelector(".faq-a");

  if (!button || !answer) {
    return;
  }

  button.setAttribute(
    "aria-expanded",
    "false"
  );

  button.addEventListener("click", () => {
    const isOpen =
      item.classList.contains("open");

    faqItems.forEach((otherItem) => {
      const otherButton =
        otherItem.querySelector(".faq-q");

      const otherAnswer =
        otherItem.querySelector(".faq-a");

      otherItem.classList.remove("open");

      if (otherAnswer) {
        otherAnswer.style.maxHeight = null;
      }

      if (otherButton) {
        otherButton.setAttribute(
          "aria-expanded",
          "false"
        );
      }
    });

    if (!isOpen) {
      item.classList.add("open");

      answer.style.maxHeight =
        `${answer.scrollHeight}px`;

      button.setAttribute(
        "aria-expanded",
        "true"
      );
    }
  });
});


/* ---------------------------------------------------------
   MOBILE NAVIGATION
--------------------------------------------------------- */

const navBurger =
  document.getElementById("navBurger");

const navLinks =
  document.querySelector(".nav-links");

if (navBurger && navLinks) {
  navBurger.addEventListener(
    "click",
    () => {
      const isOpen =
        navLinks.classList.toggle(
          "mobile-open"
        );

      navBurger.setAttribute(
        "aria-expanded",
        String(isOpen)
      );

      navBurger.textContent =
        isOpen ? "✕" : "☰";
    }
  );

  navLinks
    .querySelectorAll("a")
    .forEach((link) => {
      link.addEventListener(
        "click",
        () => {
          navLinks.classList.remove(
            "mobile-open"
          );

          navBurger.setAttribute(
            "aria-expanded",
            "false"
          );

          navBurger.textContent =
            "☰";
        }
      );
    });
}


/* ---------------------------------------------------------
   SMOOTH INTERNAL LINKS
--------------------------------------------------------- */

document
  .querySelectorAll(
    'a[href^="#"]'
  )
  .forEach((link) => {
    link.addEventListener(
      "click",
      (event) => {
        const href =
          link.getAttribute("href");

        if (
          !href ||
          href === "#"
        ) {
          return;
        }

        const target =
          document.querySelector(href);

        if (!target) {
          return;
        }

        event.preventDefault();

        target.scrollIntoView({
          behavior:
            reducedMotion
              ? "auto"
              : "smooth",
          block: "start"
        });
      }
    );
  });


/* ---------------------------------------------------------
   HEADER SCROLL EFFECT
--------------------------------------------------------- */

const header =
  document.querySelector("header");

function updateHeader() {
  if (!header) {
    return;
  }

  if (window.scrollY > 20) {
    header.style.boxShadow =
      "0 12px 35px rgba(0,0,0,0.12)";
  } else {
    header.style.boxShadow =
      "none";
  }
}

window.addEventListener(
  "scroll",
  updateHeader,
  {
    passive: true
  }
);

updateHeader();


/* ---------------------------------------------------------
   CONTACT FORM
--------------------------------------------------------- */

const contactForm =
  document.getElementById(
    "contactForm"
  );

if (contactForm) {
  contactForm.addEventListener(
    "submit",
    (event) => {
      event.preventDefault();

      const button =
        contactForm.querySelector(
          ".form-submit"
        );

      const name =
        document
          .getElementById("fname")
          ?.value.trim() || "";

      const email =
        document
          .getElementById("femail")
          ?.value.trim() || "";

      const phone =
        document
          .getElementById("fphone")
          ?.value.trim() || "";

      const subject =
        document
          .getElementById("fsubject")
          ?.value.trim() ||
        "New WiseMove Project Enquiry";

      const message =
        document
          .getElementById("fmessage")
          ?.value.trim() || "";

      if (!name || !email || !message) {
        return;
      }

      const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailPattern.test(email)) {
        const emailInput =
          document.getElementById(
            "femail"
          );

        emailInput?.focus();

        return;
      }

      const emailBody = `
Name: ${name}
Email: ${email}
Phone: ${phone || "Not provided"}

Message:
${message}
      `.trim();

      const mailtoURL =
        `mailto:info@wisemoveconsultancy.com` +
        `?subject=${encodeURIComponent(
          subject
        )}` +
        `&body=${encodeURIComponent(
          emailBody
        )}`;

      if (button) {
        button.disabled = true;
        button.textContent =
          "Opening email app...";
      }

      window.location.href =
        mailtoURL;

      setTimeout(() => {
        if (button) {
          button.disabled = false;
          button.textContent =
            "Send Message";
        }
      }, 1800);
    }
  );
}


/* ---------------------------------------------------------
   EXTERNAL LINK SECURITY
--------------------------------------------------------- */

document
  .querySelectorAll(
    'a[target="_blank"]'
  )
  .forEach((link) => {
    if (!link.rel.includes("noopener")) {
      link.rel += " noopener";
    }

    if (!link.rel.includes("noreferrer")) {
      link.rel += " noreferrer";
    }
  });


/* ---------------------------------------------------------
   CURRENT YEAR
--------------------------------------------------------- */

const footerCopyright =
  document.querySelector(
    ".footer-bottom span"
  );

if (footerCopyright) {
  footerCopyright.textContent =
    `© ${new Date().getFullYear()} WiseMove Consultancy — All rights reserved`;
}
