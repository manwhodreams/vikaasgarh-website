"use strict";


document.addEventListener(
    "DOMContentLoaded",
    () => {


        /* ====================================================
           CAROUSEL
        ==================================================== */

        const carousel =
            document.querySelector(
                "[data-roundtable-carousel]"
            );


        if (!carousel) {
            return;
        }


        /* ====================================================
           ELEMENTS
        ==================================================== */

        const slides =
            Array.from(
                carousel.querySelectorAll(
                    "[data-roundtable-slide]"
                )
            );


        const indicators =
            Array.from(
                carousel.querySelectorAll(
                    "[data-roundtable-indicator]"
                )
            );


        const previousButton =
            carousel.querySelector(
                "[data-roundtable-previous]"
            );


        const nextButton =
            carousel.querySelector(
                "[data-roundtable-next]"
            );


        const controls =
            carousel.querySelector(
                ".roundtable-carousel-controls"
            );


        /* ====================================================
           SETTINGS
        ==================================================== */

        const AUTOPLAY_DELAY =
            5500;


        const SWIPE_THRESHOLD =
            45;


        const reducedMotionQuery =
            window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            );


        /* ====================================================
           STATE
        ==================================================== */

        let currentIndex = 0;


        let autoplayTimer =
            null;


        let touchStartX =
            0;


        let touchEndX =
            0;


        /* ====================================================
           RESTART INDICATOR TIMER
        ==================================================== */

        const restartIndicatorAnimation =
            (indicator) => {


                if (
                    !indicator ||
                    reducedMotionQuery.matches
                ) {
                    return;
                }


                indicator.classList.remove(
                    "is-active"
                );


                /*
                   Force browser reflow so that the
                   CSS progress animation restarts.
                */

                void indicator.offsetWidth;


                indicator.classList.add(
                    "is-active"
                );

            };


        /* ====================================================
           SHOW SLIDE
        ==================================================== */

        const showSlide =
            (requestedIndex) => {


                if (!slides.length) {
                    return;
                }


                const totalSlides =
                    slides.length;


                currentIndex =
                    (
                        requestedIndex +
                        totalSlides
                    )
                    %
                    totalSlides;


                /* --------------------------------------------
                   Slides
                -------------------------------------------- */

                slides.forEach(
                    (
                        slide,
                        index
                    ) => {


                        const active =
                            index ===
                            currentIndex;


                        slide.classList.toggle(
                            "is-active",
                            active
                        );


                        slide.setAttribute(
                            "aria-hidden",
                            String(!active)
                        );

                    }
                );


                /* --------------------------------------------
                   Indicators
                -------------------------------------------- */

                indicators.forEach(
                    (
                        indicator,
                        index
                    ) => {


                        const active =
                            index ===
                            currentIndex;


                        indicator.classList.remove(
                            "is-active"
                        );


                        indicator.setAttribute(
                            "aria-current",
                            active
                                ? "true"
                                : "false"
                        );

                    }
                );


                const activeIndicator =
                    indicators[
                        currentIndex
                    ];


                if (activeIndicator) {

                    restartIndicatorAnimation(
                        activeIndicator
                    );

                }

            };


        /* ====================================================
           NEXT SLIDE
        ==================================================== */

        const showNextSlide =
            () => {


                showSlide(
                    currentIndex + 1
                );

            };


        /* ====================================================
           PREVIOUS SLIDE
        ==================================================== */

        const showPreviousSlide =
            () => {


                showSlide(
                    currentIndex - 1
                );

            };


        /* ====================================================
           STOP AUTOPLAY
        ==================================================== */

        const stopAutoplay =
            () => {


                if (
                    autoplayTimer ===
                    null
                ) {
                    return;
                }


                window.clearInterval(
                    autoplayTimer
                );


                autoplayTimer =
                    null;

            };


        /* ====================================================
           START AUTOPLAY
        ==================================================== */

        const startAutoplay =
            () => {


                stopAutoplay();


                /*
                   No autoplay when:
                   - reduced motion is enabled
                   - there is only one image
                */

                if (
                    reducedMotionQuery.matches ||
                    slides.length <= 1
                ) {
                    return;
                }


                autoplayTimer =
                    window.setInterval(
                        () => {

                            showNextSlide();

                        },
                        AUTOPLAY_DELAY
                    );

            };


        /* ====================================================
           RESET AUTOPLAY AFTER USER ACTION
        ==================================================== */

        const resetAutoplay =
            () => {


                stopAutoplay();

                startAutoplay();

            };


        /* ====================================================
           PREVIOUS BUTTON
        ==================================================== */

        if (previousButton) {

            previousButton.addEventListener(
                "click",
                () => {


                    showPreviousSlide();


                    resetAutoplay();

                }
            );

        }


        /* ====================================================
           NEXT BUTTON
        ==================================================== */

        if (nextButton) {

            nextButton.addEventListener(
                "click",
                () => {


                    showNextSlide();


                    resetAutoplay();

                }
            );

        }


        /* ====================================================
           INDICATOR BUTTONS
        ==================================================== */

        indicators.forEach(
            (
                indicator,
                index
            ) => {


                indicator.addEventListener(
                    "click",
                    () => {


                        if (
                            index ===
                            currentIndex
                        ) {

                            restartIndicatorAnimation(
                                indicator
                            );


                            resetAutoplay();


                            return;
                        }


                        showSlide(
                            index
                        );


                        resetAutoplay();

                    }
                );

            }
        );


        /* ====================================================
           KEYBOARD NAVIGATION
        ==================================================== */

        carousel.addEventListener(
            "keydown",
            (event) => {


                if (
                    event.key ===
                    "ArrowLeft"
                ) {


                    event.preventDefault();


                    showPreviousSlide();


                    resetAutoplay();

                }


                if (
                    event.key ===
                    "ArrowRight"
                ) {


                    event.preventDefault();


                    showNextSlide();


                    resetAutoplay();

                }

            }
        );


        /* ====================================================
           TOUCH / SWIPE
        ==================================================== */

        carousel.addEventListener(
            "touchstart",
            (event) => {


                if (
                    !event.changedTouches.length
                ) {
                    return;
                }


                touchStartX =
                    event.changedTouches[0]
                        .clientX;


                touchEndX =
                    touchStartX;

            },
            {
                passive: true
            }
        );


        carousel.addEventListener(
            "touchmove",
            (event) => {


                if (
                    !event.changedTouches.length
                ) {
                    return;
                }


                touchEndX =
                    event.changedTouches[0]
                        .clientX;

            },
            {
                passive: true
            }
        );


        carousel.addEventListener(
            "touchend",
            () => {


                const distance =
                    touchEndX -
                    touchStartX;


                if (
                    Math.abs(distance) <
                    SWIPE_THRESHOLD
                ) {
                    return;
                }


                /*
                   Swipe right
                */

                if (distance > 0) {

                    showPreviousSlide();

                }


                /*
                   Swipe left
                */

                else {

                    showNextSlide();

                }


                resetAutoplay();

            },
            {
                passive: true
            }
        );


        /* ====================================================
           PAUSE WHILE MOUSE IS OVER CAROUSEL
        ==================================================== */

        carousel.addEventListener(
            "mouseenter",
            () => {


                if (
                    !reducedMotionQuery.matches
                ) {
                    stopAutoplay();
                }

            }
        );


        carousel.addEventListener(
            "mouseleave",
            () => {


                startAutoplay();

            }
        );


        /* ====================================================
           PAUSE WHILE USER IS USING CONTROLS
        ==================================================== */

        carousel.addEventListener(
            "focusin",
            () => {


                stopAutoplay();

            }
        );


        carousel.addEventListener(
            "focusout",
            (event) => {


                if (
                    !carousel.contains(
                        event.relatedTarget
                    )
                ) {

                    startAutoplay();

                }

            }
        );


        /* ====================================================
           PAGE VISIBILITY
        ==================================================== */

        document.addEventListener(
            "visibilitychange",
            () => {


                if (
                    document.hidden
                ) {

                    stopAutoplay();

                }

                else {

                    startAutoplay();

                }

            }
        );


        /* ====================================================
           REDUCED MOTION CHANGE
        ==================================================== */

        const handleReducedMotion =
            () => {


                if (
                    reducedMotionQuery.matches
                ) {

                    stopAutoplay();

                }

                else {

                    showSlide(
                        currentIndex
                    );


                    startAutoplay();

                }

            };


        if (
            typeof reducedMotionQuery
                .addEventListener ===
            "function"
        ) {

            reducedMotionQuery
                .addEventListener(
                    "change",
                    handleReducedMotion
                );

        }


        /* ====================================================
           SINGLE IMAGE
        ==================================================== */

        if (
            slides.length <= 1
        ) {


            if (previousButton) {

                previousButton.hidden =
                    true;

            }


            if (nextButton) {

                nextButton.hidden =
                    true;

            }


            if (controls) {

                controls.hidden =
                    true;

            }

        }


        /* ====================================================
           INITIALISE
        ==================================================== */

        showSlide(0);


        startAutoplay();


    }
);