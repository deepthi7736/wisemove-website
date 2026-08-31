/* =========================================================
   WISEMOVE
   MAIN JAVASCRIPT
========================================================= */

document.addEventListener("DOMContentLoaded", () => {


  /* =======================================================
     THEME TOGGLE
  ======================================================= */

  const themeToggle =
    document.getElementById("themeToggle");

  const savedTheme =
    localStorage.getItem("wisemove-theme");


  if (savedTheme === "light" || savedTheme === "dark") {

    document.documentElement.dataset.theme =
      savedTheme;

  } else {

    document.documentElement.dataset.theme =
      "dark";

  }


  themeToggle?.addEventListener("click", () => {

    const currentTheme =
      document.documentElement.dataset.theme ||
      "dark";

    const nextTheme =
      currentTheme === "dark"
        ? "light"
        : "dark";


    document.documentElement.dataset.theme =
      nextTheme;


    localStorage.setItem(
      "wisemove-theme",
      nextTheme
    );

  });



  /* =======================================================
     MOBILE MENU
  ======================================================= */

  const navBurger =
    document.getElementById("navBurger");

  const mobileMenu =
    document.getElementById("mobileMenu");


  navBurger?.addEventListener("click", () => {

    const isOpen =
      mobileMenu?.classList.toggle("open");


    navBurger.setAttribute(
      "aria-expanded",
      isOpen ? "true" : "false"
    );

  });


  mobileMenu
    ?.querySelectorAll("a")
    .forEach((link) => {

      link.addEventListener("click", () => {

        mobileMenu.classList.remove("open");

        navBurger?.setAttribute(
          "aria-expanded",
          "false"
        );

      });

    });



  /* =======================================================
     FAQ ACCORDION
  ======================================================= */

  const faqItems =
    document.querySelectorAll(".faq-item");


  faqItems.forEach((item) => {

    const question =
      item.querySelector(".faq-q");


    question?.addEventListener("click", () => {

      const wasOpen =
        item.classList.contains("open");


      /* Close other FAQ items */

      faqItems.forEach((otherItem) => {

        otherItem.classList.remove("open");

      });


      /* Toggle selected item */

      if (!wasOpen) {

        item.classList.add("open");

      }

    });

  });



  /* =======================================================
     SMOOTH INTERNAL LINKS
  ======================================================= */

  document
    .querySelectorAll('a[href^="#"]')
    .forEach((link) => {

      link.addEventListener("click", (event) => {

        const targetId =
          link.getAttribute("href");


        if (
          !targetId ||
          targetId === "#"
        ) {

          return;

        }


        const target =
          document.querySelector(targetId);


        if (!target) {

          return;

        }


        event.preventDefault();


        target.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });

      });

    });



  /* =======================================================
     SCROLL REVEAL
  ======================================================= */

  const revealElements =
    document.querySelectorAll(
      ".section, .final-cta, footer"
    );


  if ("IntersectionObserver" in window) {

    const observer =
      new IntersectionObserver(
        (entries) => {

          entries.forEach((entry) => {

            if (entry.isIntersecting) {

              entry.target.classList.add(
                "visible"
              );

              observer.unobserve(
                entry.target
              );

            }

          });

        },
        {
          threshold: 0.08
        }
      );


    revealElements.forEach((element) => {

      observer.observe(element);

    });

  } else {

    revealElements.forEach((element) => {

      element.classList.add("visible");

    });

  }



  /* =======================================================
     HERO CARD MOUSE MOVEMENT
  ======================================================= */

  const hero =
    document.querySelector(".hero");

  const heroCard =
    document.querySelector(".hero-product-card");


  if (
    hero &&
    heroCard &&
    window.matchMedia("(pointer:fine)").matches
  ) {

    hero.addEventListener(
      "mousemove",
      (event) => {

        const rect =
          hero.getBoundingClientRect();


        const x =
          (event.clientX - rect.left)
          / rect.width;


        const y =
          (event.clientY - rect.top)
          / rect.height;


        const rotateY =
          (x - 0.5) * 8;


        const rotateX =
          (0.5 - y) * 5;


        heroCard.style.transform =
          `perspective(1200px)
           rotateY(${rotateY}deg)
           rotateX(${rotateX}deg)`;

      }
    );


    hero.addEventListener(
      "mouseleave",
      () => {

        heroCard.style.transform =
          "perspective(1200px) rotateY(-7deg) rotateX(3deg)";

      }
    );

  }



  /* =======================================================
     NAVBAR SCROLL EFFECT
  ======================================================= */

  const navbar =
    document.querySelector(".nav-float");


  const updateNavbar =
    () => {

      if (!navbar) {
        return;
      }


      if (window.scrollY > 40) {

        navbar.classList.add(
          "scrolled"
        );

      } else {

        navbar.classList.remove(
          "scrolled"
        );

      }

    };


  window.addEventListener(
    "scroll",
    updateNavbar,
    { passive: true }
  );


  updateNavbar();



  /* =======================================================
     PREVENT BROKEN IMAGE LOOK
  ======================================================= */

  document
    .querySelectorAll("img")
    .forEach((image) => {

      image.addEventListener(
        "error",
        () => {

          image.style.display =
            "none";

        }
      );

    });

});
