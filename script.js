/* =========================================================
   WISEMOVE
   MAIN JAVASCRIPT
========================================================= */


/* =========================================================
   ELEMENTS
========================================================= */

const body = document.body;

const themeToggle =
  document.getElementById("themeToggle");

const burger =
  document.getElementById("navBurger");

const mobileMenu =
  document.getElementById("mobileMenu");


/* =========================================================
   THEME
========================================================= */

const savedTheme =
  localStorage.getItem("wisemove-theme");


if (savedTheme) {
  body.dataset.theme = savedTheme;
}


themeToggle?.addEventListener(
  "click",
  () => {

    const newTheme =
      body.dataset.theme === "light"
        ? "dark"
        : "light";

    body.dataset.theme = newTheme;

    localStorage.setItem(
      "wisemove-theme",
      newTheme
    );

  }
);


/* =========================================================
   MOBILE MENU
========================================================= */

burger?.addEventListener(
  "click",
  () => {

    const isOpen =
      mobileMenu.classList.toggle("open");

    burger.setAttribute(
      "aria-expanded",
      isOpen
    );

  }
);


/* Close mobile menu after clicking a link */

mobileMenu
  ?.querySelectorAll("a")
  .forEach(
    (link) => {

      link.addEventListener(
        "click",
        () => {

          mobileMenu.classList.remove("open");

          burger.setAttribute(
            "aria-expanded",
            "false"
          );

        }
      );

    }
  );


/* =========================================================
   SCROLL REVEAL
========================================================= */

const observer =
  new IntersectionObserver(
    (entries) => {

      entries.forEach(
        (entry) => {

          if (entry.isIntersecting) {

            entry.target.classList.add(
              "visible"
            );

            observer.unobserve(
              entry.target
            );

          }

        }
      );

    },
    {
      threshold: 0.12
    }
  );


document
  .querySelectorAll(".reveal")
  .forEach(
    (element) => {

      observer.observe(element);

    }
  );


/* =========================================================
   SMOOTH ANCHOR SCROLL
========================================================= */

document
  .querySelectorAll('a[href^="#"]')
  .forEach(
    (link) => {

      link.addEventListener(
        "click",
        (event) => {

          const target =
            document.querySelector(
              link.getAttribute("href")
            );

          if (!target) {
            return;
          }

          event.preventDefault();

          target.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });

        }
      );

    }
  );
