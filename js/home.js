/* ============================================================
   COMMUNITY REGISTRATION
============================================================ */

document.addEventListener("DOMContentLoaded", () => {

    /* ========================================================
       ELEMENTS
    ======================================================== */

    const modal =
        document.getElementById("community-modal");

    const successModal =
        document.getElementById("community-success-modal");

    const discardModal =
        document.getElementById("community-discard-modal");

    const form =
        document.getElementById("community-registration-form");


    if (
        !modal ||
        !successModal ||
        !discardModal ||
        !form
    ) {
        return;
    }


    const openButtons =
        document.querySelectorAll(
            "[data-community-modal-open]"
        );

    const closeButtons =
        modal.querySelectorAll(
            "[data-community-modal-close]"
        );

    const continueEditingButton =
        document.getElementById(
            "community-continue-editing"
        );

    const discardCloseButton =
        document.getElementById(
            "community-discard-close"
        );

    const discardBackdrop =
        discardModal.querySelector(
            "[data-community-discard-cancel]"
        );


    /* ========================================================
       SUCCESS MODAL ELEMENTS
    ======================================================== */

    const successCloseElements =
        successModal.querySelectorAll(
            "[data-community-success-close]"
        );

    const dashboardButton =
        document.getElementById(
            "community-dashboard-button"
        );


    const fullNameInput =
        document.getElementById(
            "community-full-name"
        );

    const phoneInput =
        document.getElementById(
            "community-phone-number"
        );

    const whatsappYes =
        document.getElementById(
            "community-whatsapp-yes"
        );

    const whatsappNo =
        document.getElementById(
            "community-whatsapp-no"
        );

    const whatsappGroup =
        document.getElementById(
            "community-whatsapp-group"
        );

    const whatsappInput =
        document.getElementById(
            "community-whatsapp-number"
        );

    const emailInput =
        document.getElementById(
            "community-email"
        );

    const policyConsent =
        document.getElementById(
            "community-policy-consent"
        );

    const contactConsent =
        document.getElementById(
            "community-contact-consent"
        );

    const submitButton =
        form.querySelector(
            ".community-form-submit"
        );

    const formStatus =
        document.getElementById(
            "community-form-status"
        );

    const honeypot =
        document.getElementById(
            "community-website"
        );


    if (
        !continueEditingButton ||
        !discardCloseButton ||
        !fullNameInput ||
        !phoneInput ||
        !whatsappYes ||
        !whatsappNo ||
        !whatsappGroup ||
        !whatsappInput ||
        !emailInput ||
        !policyConsent ||
        !contactConsent ||
        !submitButton ||
        !formStatus ||
        !honeypot
    ) {
        return;
    }


    let modalOpener = null;

    let phoneIti = null;

    let whatsappIti = null;

    let isSubmitting = false;

    let successAutoCloseTimer = null;


    /* ========================================================
       MODAL FUNCTIONS
    ======================================================== */

    function openModal(element) {

        element.hidden =
            false;

        element.classList.add(
            "is-open"
        );

        element.setAttribute(
            "aria-hidden",
            "false"
        );

        document.body.classList.add(
            "community-modal-open"
        );
    }


    function closeModal(element) {

        element.classList.remove(
            "is-open"
        );

        element.setAttribute(
            "aria-hidden",
            "true"
        );

        element.hidden =
            true;


        const anyOpen =
            modal.classList.contains("is-open") ||
            successModal.classList.contains("is-open") ||
            discardModal.classList.contains("is-open");


        if (!anyOpen) {

            document.body.classList.remove(
                "community-modal-open"
            );
        }
    }


    /* ========================================================
       INITIAL MODAL STATE
    ======================================================== */

    modal.hidden =
        true;

    successModal.hidden =
        true;

    discardModal.hidden =
        true;


    /* ========================================================
       OPEN REGISTRATION
    ======================================================== */

    function openRegistration(trigger) {

        modalOpener =
            trigger || null;


        clearAllErrors();


        openModal(
            modal
        );


        requestAnimationFrame(() => {

            fullNameInput.focus();
        });
    }


    /* ========================================================
       FORM DIRTY CHECK
    ======================================================== */

    function formHasData() {

        return Boolean(

            fullNameInput.value.trim()

            ||

            phoneInput.value.trim()

            ||

            whatsappYes.checked

            ||

            whatsappNo.checked

            ||

            whatsappInput.value.trim()

            ||

            emailInput.value.trim()

            ||

            policyConsent.checked

            ||

            contactConsent.checked
        );
    }


    /* ========================================================
       RESTORE FOCUS
    ======================================================== */

    function restoreFocus() {

        if (modalOpener) {

            modalOpener.focus();

            modalOpener =
                null;
        }
    }


    /* ========================================================
       CLOSE REQUEST
    ======================================================== */

    function requestClose() {

        if (isSubmitting) {
            return;
        }


        if (!formHasData()) {

            closeModal(
                modal
            );

            restoreFocus();

            return;
        }


        closeModal(
            modal
        );


        openModal(
            discardModal
        );


        requestAnimationFrame(() => {

            continueEditingButton.focus();
        });
    }


    /* ========================================================
       CONTINUE EDITING
    ======================================================== */

    function continueEditing() {

        closeModal(
            discardModal
        );


        openModal(
            modal
        );


        requestAnimationFrame(() => {

            fullNameInput.focus();
        });
    }


    /* ========================================================
       DISCARD & CLOSE
    ======================================================== */

    function discardAndClose() {

        closeModal(
            discardModal
        );


        closeModal(
            modal
        );


        safeResetForm();


        restoreFocus();
    }


    /* ========================================================
       SUCCESS MODAL
    ======================================================== */

    function cancelSuccessAutoClose() {

        if (successAutoCloseTimer) {

            clearTimeout(
                successAutoCloseTimer
            );

            successAutoCloseTimer =
                null;
        }
    }


    function closeSuccessModal() {

        cancelSuccessAutoClose();


        closeModal(
            successModal
        );
    }


    function startSuccessAutoClose() {

        cancelSuccessAutoClose();


        successAutoCloseTimer =
            setTimeout(() => {

                successAutoCloseTimer =
                    null;


                closeModal(
                    successModal
                );

            }, 10000);
    }


    /* ========================================================
       OPEN BUTTONS
    ======================================================== */

    openButtons.forEach(button => {

        button.addEventListener(
            "click",
            event => {

                event.preventDefault();


                openRegistration(
                    button
                );
            },
            true
        );
    });


    /* ========================================================
       X / CLOSE / REGISTRATION BACKDROP
    ======================================================== */

    closeButtons.forEach(element => {

        element.addEventListener(
            "click",
            event => {

                event.preventDefault();


                requestClose();
            },
            true
        );
    });


    /* ========================================================
       CONTINUE EDITING BUTTON
    ======================================================== */

    continueEditingButton.addEventListener(
        "click",
        event => {

            event.preventDefault();


            continueEditing();
        },
        true
    );


    /* ========================================================
       DISCARD & CLOSE BUTTON
    ======================================================== */

    discardCloseButton.addEventListener(
        "click",
        event => {

            event.preventDefault();


            discardAndClose();
        },
        true
    );


    /* ========================================================
       DISCARD BACKDROP
    ======================================================== */

    if (discardBackdrop) {

        discardBackdrop.addEventListener(
            "click",
            event => {

                event.preventDefault();


                continueEditing();
            },
            true
        );
    }


    /* ========================================================
       SUCCESS MODAL CLOSE
    ======================================================== */

    successCloseElements.forEach(element => {

        element.addEventListener(
            "click",
            event => {

                event.preventDefault();


                closeSuccessModal();
            }
        );
    });


    /* ========================================================
       DASHBOARD BUTTON
    ======================================================== */

    if (dashboardButton) {

        dashboardButton.addEventListener(
            "click",
            () => {

                cancelSuccessAutoClose();
            }
        );
    }


    /* ========================================================
       ESCAPE KEY
    ======================================================== */

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key !== "Escape" ||
                isSubmitting
            ) {
                return;
            }


            if (
                successModal.classList.contains(
                    "is-open"
                )
            ) {

                closeSuccessModal();

                return;
            }


            if (
                discardModal.classList.contains(
                    "is-open"
                )
            ) {

                continueEditing();

                return;
            }


            if (
                modal.classList.contains(
                    "is-open"
                )
            ) {

                requestClose();
            }
        }
    );


    /* ========================================================
       INTERNATIONAL PHONE INPUT
    ======================================================== */

    function initializePhoneInputs() {

        if (
            typeof window.intlTelInput !==
            "function"
        ) {

            console.error(
                "intl-tel-input has not loaded."
            );

            return;
        }


        try {

            const options = {

                initialCountry:
                    "in",

                separateDialCode:
                    true,

                countrySearch:
                    true,

                strictMode:
                    true,

                formatAsYouType:
                    true,

                placeholderNumberType:
                    "MOBILE",

                dropdownParent:
                    document.body
            };


            phoneIti =
                window.intlTelInput(
                    phoneInput,
                    options
                );


            whatsappIti =
                window.intlTelInput(
                    whatsappInput,
                    options
                );


        } catch (error) {

            console.error(
                "Telephone input initialization failed:",
                error
            );
        }
    }


    initializePhoneInputs();


    /* ========================================================
       PHONE VALIDITY
    ======================================================== */

    function isPhoneNumberValid(
        input,
        iti
    ) {

        /*
           intl-tel-input validates the number
           according to the currently selected
           country's numbering rules.

           Examples:
           India, USA, UK, UAE, etc.
        */

        if (
            iti &&
            typeof iti.isValidNumber === "function"
        ) {

            try {

                return iti.isValidNumber();

            } catch (error) {

                console.error(
                    "Phone validation failed:",
                    error
                );

                return false;
            }
        }


        /*
           If intl-tel-input is unavailable,
           do not treat the number as ready.
        */

        return false;
    }


    /* ========================================================
       ERROR HELPERS
    ======================================================== */

    function getErrorElement(fieldId) {

        return form.querySelector(
            `[data-error-for="${fieldId}"]`
        );
    }


    function setFieldError(
        field,
        message
    ) {

        field.setAttribute(
            "aria-invalid",
            "true"
        );


        const error =
            getErrorElement(
                field.id
            );


        if (error) {

            error.textContent =
                message;
        }
    }


    function clearFieldError(fieldId) {

        const field =
            document.getElementById(
                fieldId
            );


        if (field) {

            field.removeAttribute(
                "aria-invalid"
            );
        }


        const error =
            getErrorElement(
                fieldId
            );


        if (error) {

            error.textContent =
                "";
        }
    }


    function clearAllErrors() {

        form
            .querySelectorAll(
                '[aria-invalid="true"]'
            )
            .forEach(element => {

                element.removeAttribute(
                    "aria-invalid"
                );
            });


        form
            .querySelectorAll(
                ".community-form-error"
            )
            .forEach(element => {

                element.textContent =
                    "";
            });


        formStatus.textContent =
            "";
    }


    /* ========================================================
       WHATSAPP YES / NO
    ======================================================== */

    function updateWhatsAppField() {

        const differentNumber =
            whatsappNo.checked;


        whatsappGroup.hidden =
            !differentNumber;


        whatsappInput.required =
            differentNumber;


        /* ----------------------------------------------------
           WHATSAPP = NO
        ---------------------------------------------------- */

        if (differentNumber) {

            /*
               Immediately disable the submit button.

               The separate WhatsApp number must
               now become valid before the button
               can activate again.
            */

            submitButton.disabled =
                true;


            try {

                /*
                   Clear previous WhatsApp number.
                */

                if (whatsappIti) {

                    whatsappIti.setNumber(
                        ""
                    );


                    /*
                       Start with the same country
                       selected for the primary phone.
                    */

                    const country =
                        phoneIti
                            ?.getSelectedCountry()
                            ?.iso2;


                    if (country) {

                        whatsappIti.setSelectedCountry(
                            country
                        );
                    }
                }


                whatsappInput.value =
                    "";


            } catch (error) {

                whatsappInput.value =
                    "";
            }


            clearFieldError(
                "community-whatsapp-number"
            );
        }


        /* ----------------------------------------------------
           WHATSAPP = YES
        ---------------------------------------------------- */

        if (!differentNumber) {

            try {

                if (whatsappIti) {

                    whatsappIti.setNumber(
                        ""
                    );
                }


                whatsappInput.value =
                    "";


            } catch (error) {

                whatsappInput.value =
                    "";
            }


            clearFieldError(
                "community-whatsapp-number"
            );
        }


        const choiceError =
            getErrorElement(
                "community-whatsapp-availability"
            );


        if (choiceError) {

            choiceError.textContent =
                "";
        }


        updateSubmitState();
    }


    whatsappYes.addEventListener(
        "change",
        updateWhatsAppField
    );


    whatsappNo.addEventListener(
        "change",
        updateWhatsAppField
    );


    /* ========================================================
       SUBMIT BUTTON STATE
    ======================================================== */

    function updateSubmitState() {

        /* ----------------------------------------------------
           FULL NAME
        ---------------------------------------------------- */

        const nameReady =
            fullNameInput
                .value
                .trim()
                .length >= 2;


        /* ----------------------------------------------------
           PRIMARY PHONE

           Country-aware validation.
        ---------------------------------------------------- */

        const phoneReady =
            isPhoneNumberValid(
                phoneInput,
                phoneIti
            );


        /* ----------------------------------------------------
           WHATSAPP QUESTION
        ---------------------------------------------------- */

        const whatsappAnswered =
            whatsappYes.checked ||
            whatsappNo.checked;


        /* ----------------------------------------------------
           WHATSAPP NUMBER
        ---------------------------------------------------- */

        let whatsappReady =
            false;


        /*
           YES:

           Primary phone is being used as
           the WhatsApp number.

           Since phoneReady is country-aware,
           the WhatsApp requirement is also valid.
        */

        if (
            whatsappYes.checked
        ) {

            whatsappReady =
                phoneReady;
        }


        /*
           NO:

           Separate WhatsApp number must be
           valid according to its selected country.
        */

        if (
            whatsappNo.checked
        ) {

            whatsappReady =
                isPhoneNumberValid(
                    whatsappInput,
                    whatsappIti
                );
        }


        /* ----------------------------------------------------
           EMAIL
        ---------------------------------------------------- */

        const emailReady =

            emailInput
                .value
                .trim()
                .length > 0

            &&

            emailInput.validity.valid;


        /* ----------------------------------------------------
           COMPLETE FORM
        ---------------------------------------------------- */

        const formReady =

            nameReady

            &&

            phoneReady

            &&

            whatsappAnswered

            &&

            whatsappReady

            &&

            emailReady

            &&

            policyConsent.checked

            &&

            contactConsent.checked;


        submitButton.disabled =
            !formReady ||
            isSubmitting;
    }


    /* ========================================================
       NORMAL LIVE FIELD UPDATES
    ======================================================== */

    [
        fullNameInput,
        phoneInput,
        whatsappInput,
        emailInput

    ].forEach(input => {

        input.addEventListener(
            "input",
            () => {

                clearFieldError(
                    input.id
                );


                formStatus.textContent =
                    "";


                updateSubmitState();
            }
        );
    });


    /* ========================================================
       COUNTRY CHANGES
    ======================================================== */

    phoneInput.addEventListener(
        "countrychange",
        () => {

            clearFieldError(
                phoneInput.id
            );


            updateSubmitState();
        }
    );


    whatsappInput.addEventListener(
        "countrychange",
        () => {

            clearFieldError(
                whatsappInput.id
            );


            updateSubmitState();
        }
    );


    /* ========================================================
       CONSENT UPDATES
    ======================================================== */

    policyConsent.addEventListener(
        "change",
        () => {

            clearFieldError(
                policyConsent.id
            );


            updateSubmitState();
        }
    );


    contactConsent.addEventListener(
        "change",
        () => {

            clearFieldError(
                contactConsent.id
            );


            updateSubmitState();
        }
    );


    /* ========================================================
       FORM VALIDATION
    ======================================================== */

    function validateForm() {

        clearAllErrors();


        let firstInvalid =
            null;


        /* ----------------------------------------------------
           FULL NAME
        ---------------------------------------------------- */

        const fullName =
            fullNameInput
                .value
                .trim()
                .replace(
                    /\s+/g,
                    " "
                );


        if (
            fullName.length < 2
        ) {

            setFieldError(
                fullNameInput,
                "Please enter your full name."
            );


            firstInvalid ||=
                fullNameInput;
        }


        /* ----------------------------------------------------
           PRIMARY PHONE
        ---------------------------------------------------- */

        if (
            !phoneInput.value.trim()
        ) {

            setFieldError(
                phoneInput,
                "Please enter your phone number."
            );


            firstInvalid ||=
                phoneInput;


        } else if (
            !isPhoneNumberValid(
                phoneInput,
                phoneIti
            )
        ) {

            setFieldError(
                phoneInput,
                "Please enter a valid phone number for the selected country."
            );


            firstInvalid ||=
                phoneInput;
        }


        /* ----------------------------------------------------
           WHATSAPP AVAILABILITY
        ---------------------------------------------------- */

        if (
            !whatsappYes.checked &&
            !whatsappNo.checked
        ) {

            const error =
                getErrorElement(
                    "community-whatsapp-availability"
                );


            if (error) {

                error.textContent =
                    "Please select Yes or No.";
            }


            firstInvalid ||=
                whatsappYes;
        }


        /* ----------------------------------------------------
           SEPARATE WHATSAPP NUMBER
        ---------------------------------------------------- */

        if (
            whatsappNo.checked
        ) {

            if (
                !whatsappInput.value.trim()
            ) {

                setFieldError(
                    whatsappInput,
                    "Please enter your WhatsApp number."
                );


                firstInvalid ||=
                    whatsappInput;


            } else if (
                !isPhoneNumberValid(
                    whatsappInput,
                    whatsappIti
                )
            ) {

                setFieldError(
                    whatsappInput,
                    "Please enter a valid WhatsApp number for the selected country."
                );


                firstInvalid ||=
                    whatsappInput;
            }
        }


        /* ----------------------------------------------------
           EMAIL
        ---------------------------------------------------- */

        const email =
            emailInput
                .value
                .trim()
                .toLowerCase();


        if (
            !email ||
            !emailInput.validity.valid
        ) {

            setFieldError(
                emailInput,
                "Please enter a valid email address."
            );


            firstInvalid ||=
                emailInput;
        }


        /* ----------------------------------------------------
           PRIVACY + TERMS
        ---------------------------------------------------- */

        if (
            !policyConsent.checked
        ) {

            setFieldError(
                policyConsent,
                "Please agree to the Privacy Policy and Terms & Conditions."
            );


            firstInvalid ||=
                policyConsent;
        }


        /* ----------------------------------------------------
           CONTACT CONSENT
        ---------------------------------------------------- */

        if (
            !contactConsent.checked
        ) {

            setFieldError(
                contactConsent,
                "Please provide your consent to be contacted."
            );


            firstInvalid ||=
                contactConsent;
        }


        /* ----------------------------------------------------
           INVALID
        ---------------------------------------------------- */

        if (firstInvalid) {

            firstInvalid.focus();


            return null;
        }


        /* ----------------------------------------------------
           PREPARE PRIMARY PHONE
        ---------------------------------------------------- */

        const phoneE164 =
            phoneIti
                ? phoneIti.getNumber()
                : phoneInput.value.trim();


        const phoneCountry =
            phoneIti
                ?.getSelectedCountry()
                ?.iso2 || "";


        /* ----------------------------------------------------
           PREPARE WHATSAPP PHONE
        ---------------------------------------------------- */

        const whatsappE164 =
            whatsappYes.checked

                ? phoneE164

                : (
                    whatsappIti
                        ? whatsappIti.getNumber()
                        : whatsappInput.value.trim()
                );


        const whatsappCountry =
            whatsappYes.checked

                ? phoneCountry

                : (
                    whatsappIti
                        ?.getSelectedCountry()
                        ?.iso2 || ""
                );


        /* ----------------------------------------------------
           REGISTRATION DATA
        ---------------------------------------------------- */

        return {

            fullName,

            phoneE164,

            phoneCountry,

            whatsappAvailable:
                whatsappYes.checked,

            whatsappE164,

            whatsappCountry,

            email,

            policyConsent:
                true,

            contactConsent:
                true
        };
    }


    /* ========================================================
       SAFE FORM RESET
    ======================================================== */

    function safeResetForm() {

        try {

            form.reset();

        } catch (error) {

            console.error(
                "Form reset failed:",
                error
            );
        }


        whatsappGroup.hidden =
            true;


        whatsappInput.required =
            false;


        /* ----------------------------------------------------
           RESET PRIMARY PHONE
        ---------------------------------------------------- */

        try {

            if (phoneIti) {

                phoneIti.setNumber(
                    ""
                );

                phoneIti.setSelectedCountry(
                    "in"
                );
            }


            phoneInput.value =
                "";


        } catch (error) {

            phoneInput.value =
                "";
        }


        /* ----------------------------------------------------
           RESET WHATSAPP PHONE
        ---------------------------------------------------- */

        try {

            if (whatsappIti) {

                whatsappIti.setNumber(
                    ""
                );

                whatsappIti.setSelectedCountry(
                    "in"
                );
            }


            whatsappInput.value =
                "";


        } catch (error) {

            whatsappInput.value =
                "";
        }


        clearAllErrors();


        updateSubmitState();
    }


    /* ========================================================
       COMMUNITY REGISTRATION SUBMISSION
    ======================================================== */

    form.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            /* ------------------------------------------------
               PREVENT MULTIPLE SUBMISSIONS
            ------------------------------------------------ */

            if (isSubmitting) {
                return;
            }


            if (submitButton.disabled) {
                return;
            }


            /* ------------------------------------------------
               HONEYPOT
            ------------------------------------------------ */

            if (
                honeypot.value.trim()
            ) {
                return;
            }


            /* ------------------------------------------------
               VALIDATE
            ------------------------------------------------ */

            const registrationData =
                validateForm();


            if (
                !registrationData
            ) {
                return;
            }


            /* ------------------------------------------------
               SUPABASE CHECK
            ------------------------------------------------ */

            if (
                !window.vgSupabase
            ) {

                console.error(
                    "Supabase client is not available."
                );


                formStatus.textContent =
                    "Unable to submit your registration. Please try again.";


                return;
            }


            /* ------------------------------------------------
               SUBMITTING STATE
            ------------------------------------------------ */

            isSubmitting =
                true;


            const submitText =
                submitButton.querySelector(
                    "span"
                );


            const originalSubmitText =
                submitText
                    ? submitText.textContent
                    : "Join Community";


            if (submitText) {

                submitText.textContent =
                    "Submitting...";
            }


            updateSubmitState();


            formStatus.textContent =
                "";


            try {

                /* ============================================
                   INSERT INTO SUPABASE
                ============================================ */

                const {
                    error
                } =
                    await window.vgSupabase
                        .from(
                            "community_members"
                        )
                        .insert({

                            full_name:
                                registrationData.fullName,

                            phone_e164:
                                registrationData.phoneE164,

                            phone_country_iso2:
                                registrationData.phoneCountry,

                            phone_available_on_whatsapp:
                                registrationData.whatsappAvailable,

                            whatsapp_e164:
                                registrationData.whatsappE164,

                            whatsapp_country_iso2:
                                registrationData.whatsappCountry,

                            email:
                                registrationData.email,

                            policy_terms_accepted:
                                registrationData.policyConsent,

                            contact_consent:
                                registrationData.contactConsent
                        });


                /* ============================================
                   DATABASE ERROR
                ============================================ */

                if (error) {

                    console.error(
                        "Community registration failed:",
                        error
                    );


                    if (
                        error.code === "23505"
                    ) {

                        formStatus.textContent =
                            "A community registration already exists with this email address or phone number.";


                    } else {

                        formStatus.textContent =
                            "Unable to complete your registration. Please try again.";
                    }


                    return;
                }


                /* ============================================
                   SUCCESS
                ============================================ */

                closeModal(
                    modal
                );


                safeResetForm();


                openModal(
                    successModal
                );


                startSuccessAutoClose();


                modalOpener =
                    null;


            } catch (error) {

                console.error(
                    "Community registration error:",
                    error
                );


                formStatus.textContent =
                    "Unable to complete your registration. Please check your connection and try again.";


            } finally {

                /* ------------------------------------------------
                   RESTORE BUTTON
                ------------------------------------------------ */

                isSubmitting =
                    false;


                if (submitText) {

                    submitText.textContent =
                        originalSubmitText;
                }


                updateSubmitState();
            }
        }
    );


    /* ========================================================
       INITIAL STATE
    ======================================================== */

    whatsappGroup.hidden =
        true;


    whatsappInput.required =
        false;


    updateSubmitState();

});