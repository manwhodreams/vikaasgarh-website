/* ============================================================
   PARTIAL LOADER
============================================================ */

async function loadPartial(elementId, file) {

    const element =
        document.getElementById(elementId);

    if (!element) return;


    try {

        const response =
            await fetch(file);


        if (!response.ok) {

            throw new Error(
                `Failed to load ${file}`
            );
        }


        element.innerHTML =
            await response.text();


    } catch (error) {

        console.error(error);
    }
}


/* ============================================================
   ACTIVE NAVIGATION
============================================================ */

function setActiveNavigation() {

    let currentPath =
        window.location.pathname;


    if (currentPath === "/index.html") {

        currentPath = "/";
    }


    const navigationLinks =
        document.querySelectorAll(
            ".header-navigation a"
        );


    navigationLinks.forEach((link) => {

        let linkPath =
            new URL(
                link.href,
                window.location.origin
            ).pathname;


        if (linkPath === "/index.html") {

            linkPath = "/";
        }


        link.classList.toggle(
            "active",
            linkPath === currentPath
        );
    });
}


/* ============================================================
   LANGUAGE SWITCHER
============================================================ */

function initializeLanguageSwitcher() {

    const languageButtons =
        document.querySelectorAll(
            ".language-switcher button"
        );


    function setLanguage(language) {

        languageButtons.forEach((button) => {

            const isActive =
                button.dataset.language ===
                language;


            button.classList.toggle(
                "active",
                isActive
            );


            button.setAttribute(
                "aria-pressed",
                isActive
                    ? "true"
                    : "false"
            );
        });


        document
            .querySelectorAll(
                "[data-en][data-hi]"
            )
            .forEach((element) => {

                const translation =
                    element.dataset[
                        language
                    ];


                if (translation) {

                    element.textContent =
                        translation;

                    return;
                }


                /*
                   English remains the fallback
                   while Hindi translations
                   are empty.
                */

                if (language === "hi") {

                    element.textContent =
                        element.dataset.en;
                }
            });


        document.documentElement.lang =
            language === "hi"
                ? "hi"
                : "en";
    }


    languageButtons.forEach((button) => {

        button.addEventListener(
            "click",
            () => {

                setLanguage(
                    button.dataset.language
                );
            }
        );
    });


    /*
       English is the default language.
    */

    setLanguage("en");
}


/* ============================================================
   RESPONSIVE FULLSCREEN HEADER
============================================================ */

function initializeResponsiveHeader() {

    const menuToggle =
        document.querySelector(
            ".mobile-menu-toggle"
        );


    const menuClose =
        document.querySelector(
            ".mobile-menu-close"
        );


    const menuPanel =
        document.getElementById(
            "site-mobile-menu"
        );


    /*
       CSS and JavaScript use the
       same 1024px breakpoint.
    */

    const responsiveBreakpoint =
        window.matchMedia(
            "(max-width: 64rem)"
        );


    if (
        !menuToggle ||
        !menuClose ||
        !menuPanel
    ) {
        return;
    }


    let previouslyFocusedElement =
        null;


    /* ========================================================
       OPEN MENU
    ======================================================== */

    function openMenu() {

        if (
            !responsiveBreakpoint.matches
        ) {
            return;
        }


        previouslyFocusedElement =
            document.activeElement;


        menuPanel.classList.add(
            "is-open"
        );


        document.body.classList.add(
            "mobile-menu-open"
        );


        menuToggle.setAttribute(
            "aria-expanded",
            "true"
        );


        menuPanel.setAttribute(
            "aria-hidden",
            "false"
        );


        window.requestAnimationFrame(
            () => {

                menuClose.focus();
            }
        );
    }


    /* ========================================================
       CLOSE MENU
    ======================================================== */

    function closeMenu(
        restoreFocus = true
    ) {

        menuPanel.classList.remove(
            "is-open"
        );


        document.body.classList.remove(
            "mobile-menu-open"
        );


        menuToggle.setAttribute(
            "aria-expanded",
            "false"
        );


        if (
            responsiveBreakpoint.matches
        ) {

            menuPanel.setAttribute(
                "aria-hidden",
                "true"
            );
        }


        if (
            restoreFocus &&
            previouslyFocusedElement
        ) {

            previouslyFocusedElement.focus();

            previouslyFocusedElement =
                null;
        }
    }


    /* ========================================================
       SYNCHRONIZE RESPONSIVE STATE
    ======================================================== */

    function synchronizeHeader() {

        /*
           Responsive mode.
        */

        if (
            responsiveBreakpoint.matches
        ) {

            if (
                !menuPanel.classList.contains(
                    "is-open"
                )
            ) {

                menuPanel.setAttribute(
                    "aria-hidden",
                    "true"
                );
            }


            return;
        }


        /*
           Desktop mode.
        */

        closeMenu(false);


        menuPanel.removeAttribute(
            "aria-hidden"
        );
    }


    /* ========================================================
       KEYBOARD FOCUS TRAP
    ======================================================== */

    function trapMenuFocus(event) {

        if (
            event.key !== "Tab" ||
            !menuPanel.classList.contains(
                "is-open"
            )
        ) {
            return;
        }


        const focusableElements =
            menuPanel.querySelectorAll(
                [
                    "a[href]",
                    "button:not([disabled])",
                    "input:not([disabled])",
                    "select:not([disabled])",
                    "textarea:not([disabled])",
                    "[tabindex]:not([tabindex='-1'])"
                ].join(",")
            );


        if (
            !focusableElements.length
        ) {
            return;
        }


        const firstElement =
            focusableElements[0];


        const lastElement =
            focusableElements[
                focusableElements.length - 1
            ];


        /*
           Shift + Tab on the first item.
        */

        if (
            event.shiftKey &&
            document.activeElement ===
                firstElement
        ) {

            event.preventDefault();

            lastElement.focus();

            return;
        }


        /*
           Tab on the last item.
        */

        if (
            !event.shiftKey &&
            document.activeElement ===
                lastElement
        ) {

            event.preventDefault();

            firstElement.focus();
        }
    }


    /* ========================================================
       HAMBURGER
    ======================================================== */

    menuToggle.addEventListener(
        "click",
        openMenu
    );


    /* ========================================================
       CLOSE BUTTON
    ======================================================== */

    menuClose.addEventListener(
        "click",
        () => {

            closeMenu();
        }
    );


    /* ========================================================
       NAVIGATION LINKS
       Close menu after selection
    ======================================================== */

    menuPanel
        .querySelectorAll(
            ".header-navigation a"
        )
        .forEach((link) => {

            link.addEventListener(
                "click",
                () => {

                    closeMenu(false);
                }
            );
        });


    /* ========================================================
       KEYBOARD EVENTS
    ======================================================== */

    document.addEventListener(
        "keydown",
        (event) => {

            /*
               Escape closes menu.
            */

            if (
                event.key === "Escape" &&
                menuPanel.classList.contains(
                    "is-open"
                )
            ) {

                closeMenu();

                return;
            }


            trapMenuFocus(event);
        }
    );


    /* ========================================================
       BREAKPOINT CHANGES
    ======================================================== */

    if (
        typeof responsiveBreakpoint
            .addEventListener ===
        "function"
    ) {

        responsiveBreakpoint
            .addEventListener(
                "change",
                synchronizeHeader
            );

    } else {

        /*
           Legacy fallback.
        */

        responsiveBreakpoint
            .addListener(
                synchronizeHeader
            );
    }


    /* ========================================================
       INITIAL STATE
    ======================================================== */

    synchronizeHeader();
}


/* ============================================================
   PAGE INITIALIZATION
============================================================ */

document.addEventListener(
    "DOMContentLoaded",
    async () => {


        /* Utility Bar */

        await loadPartial(
            "utility-bar",
            "/partials/utility-bar.html"
        );


        /* Header */

        await loadPartial(
            "header",
            "/partials/header.html"
        );


        /* Footer */

        await loadPartial(
            "footer",
            "/partials/footer.html"
        );


        /* Global Components */

        setActiveNavigation();

        initializeLanguageSwitcher();

        initializeResponsiveHeader();

    }
);