/* =========================================================
   WISEMOVE — MAIN JAVASCRIPT
   Clean, defensive, matches corrected index.html
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    /* =====================================================
       01. MOBILE MENU
       ===================================================== */

    const menuToggle = document.querySelector("#menuToggle");
    const mobileMenu = document.querySelector("#mobileMenu");

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener("click", () => {
            const isOpen = mobileMenu.classList.toggle("is-open");

            menuToggle.setAttribute(
                "aria-expanded",
                isOpen ? "true" : "false"
            );

            mobileMenu.setAttribute(
                "aria-hidden",
                isOpen ? "false" : "true"
            );

            document.body.classList.toggle("menu-open", isOpen);
        });

        /* Close mobile menu when clicking a link */
        const mobileLinks = mobileMenu.querySelectorAll("a");

        mobileLinks.forEach((link) => {
            link.addEventListener("click", () => {
                mobileMenu.classList.remove("is-open");

                menuToggle.setAttribute("aria-expanded", "false");
                mobileMenu.setAttribute("aria-hidden", "true");

                document.body.classList.remove("menu-open");
            });
        });
    }


    /* =====================================================
       02. HEADER SCROLL EFFECT
       ===================================================== */

    const header = document.querySelector(".site-header");

    if (header) {
        const updateHeader = () => {
            if (window.scrollY > 30) {
                header.classList.add("scrolled");
            } else {
                header.classList.remove("scrolled");
            }
        };

        updateHeader();

        window.addEventListener(
            "scroll",
            updateHeader,
            { passive: true }
        );
    }


    /* =====================================================
       03. SMOOTH SCROLL
       ===================================================== */

    const anchorLinks = document.querySelectorAll(
        'a[href^="#"]'
    );

    anchorLinks.forEach((link) => {
        link.addEventListener("click", (event) => {
            const targetId = link.getAttribute("href");

            if (!targetId || targetId === "#") {
                return;
            }

            const target = document.querySelector(targetId);

            if (!target) {
                return;
            }

            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        });
    });


    /* =====================================================
       04. REVEAL ANIMATIONS
       ===================================================== */

    const revealElements = document.querySelectorAll(
        ".reveal, .fade-up, .animate-on-scroll"
    );

    if ("IntersectionObserver" in window) {
        const revealObserver = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) {
                        return;
                    }

                    entry.target.classList.add("visible");

                    observer.unobserve(entry.target);
                });
            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -40px 0px",
            }
        );

        revealElements.forEach((element) => {
            revealObserver.observe(element);
        });
    } else {
        revealElements.forEach((element) => {
            element.classList.add("visible");
        });
    }


    /* =====================================================
       05. HERO MOUSE PARALLAX
       ===================================================== */

    const hero = document.querySelector(".hero");
    const heroVisual = document.querySelector(".hero-visual");

    if (
        hero &&
        heroVisual &&
        window.matchMedia("(pointer: fine)").matches
    ) {
        hero.addEventListener("mousemove", (event) => {
            const rect = hero.getBoundingClientRect();

            const x =
                (event.clientX - rect.left) /
                rect.width -
                0.5;

            const y =
                (event.clientY - rect.top) /
                rect.height -
                0.5;

            heroVisual.style.transform = `
                translate3d(
                    ${x * 12}px,
                    ${y * 12}px,
                    0
                )
            `;
        });

        hero.addEventListener("mouseleave", () => {
            heroVisual.style.transform =
                "translate3d(0, 0, 0)";
        });
    }


    /* =====================================================
       06. MAGNETIC BUTTON EFFECT
       ===================================================== */

    const magneticElements = document.querySelectorAll(
        ".magnetic, .btn-magnetic"
    );

    if (window.matchMedia("(pointer: fine)").matches) {
        magneticElements.forEach((element) => {
            element.addEventListener("mousemove", (event) => {
                const rect =
                    element.getBoundingClientRect();

                const x =
                    event.clientX -
                    (rect.left + rect.width / 2);

                const y =
                    event.clientY -
                    (rect.top + rect.height / 2);

                element.style.transform = `
                    translate(
                        ${x * 0.12}px,
                        ${y * 0.12}px
                    )
                `;
            });

            element.addEventListener("mouseleave", () => {
                element.style.transform =
                    "translate(0, 0)";
            });
        });
    }


    /* =====================================================
       07. PRODUCT CARD HOVER
       ===================================================== */

    const productCards = document.querySelectorAll(
        ".prod-preview-card"
    );

    if (window.matchMedia("(pointer: fine)").matches) {
        productCards.forEach((card) => {
            card.addEventListener("mousemove", (event) => {
                const rect =
                    card.getBoundingClientRect();

                const rotateX =
                    ((event.clientY - rect.top) /
                        rect.height -
                        0.5) *
                    -5;

                const rotateY =
                    ((event.clientX - rect.left) /
                        rect.width -
                        0.5) *
                    5;

                card.style.transform = `
                    perspective(900px)
                    rotateX(${rotateX}deg)
                    rotateY(${rotateY}deg)
                    translateY(-4px)
                `;
            });

            card.addEventListener("mouseleave", () => {
                card.style.transform =
                    "perspective(900px) rotateX(0) rotateY(0) translateY(0)";
            });
        });
    }


    /* =====================================================
       08. CURRENT YEAR
       ===================================================== */

    const yearElements =
        document.querySelectorAll("[data-year]");

    yearElements.forEach((element) => {
        element.textContent =
            new Date().getFullYear();
    });


    /* =====================================================
       09. ESCAPE KEY
       ===================================================== */

    document.addEventListener("keydown", (event) => {
        if (event.key !== "Escape") {
            return;
        }

        if (mobileMenu && menuToggle) {
            mobileMenu.classList.remove("is-open");

            menuToggle.setAttribute(
                "aria-expanded",
                "false"
            );

            mobileMenu.setAttribute(
                "aria-hidden",
                "true"
            );

            document.body.classList.remove("menu-open");
        }
    });


    /* =====================================================
       10. RESIZE HANDLING
       ===================================================== */

    window.addEventListener("resize", () => {
        if (
            window.innerWidth > 900 &&
            mobileMenu &&
            menuToggle
        ) {
            mobileMenu.classList.remove("is-open");

            menuToggle.setAttribute(
                "aria-expanded",
                "false"
            );

            mobileMenu.setAttribute(
                "aria-hidden",
                "true"
            );

            document.body.classList.remove("menu-open");
        }
    });


    /* =====================================================
       11. PAGE LOADED
       ===================================================== */

    document.documentElement.classList.add(
        "js-ready"
    );
});
