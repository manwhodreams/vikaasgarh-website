async function loadComponent(id, file) {
    const element = document.getElementById(id);

    if (!element) {
        console.warn(`Element #${id} not found.`);
        return;
    }

    try {
        const response = await fetch(file);

        if (!response.ok) {
            throw new Error(`Failed to load ${file}`);
        }

        element.innerHTML = await response.text();
    } catch (error) {
        console.error(error);
    }
}

function setActiveNavigation() {
    let currentPath = window.location.pathname;

    if (currentPath === "/") {
        currentPath = "/index.html";
    }
    const navigationLinks = document.querySelectorAll(".header-navigation a");

    navigationLinks.forEach((link) => {
        const linkPath = new URL(link.href).pathname;

        if (currentPath === linkPath) {
            link.classList.add("active");
        }
    });
}

function renderFaqs() {
    const faqSection = document.getElementById("faq-section");

    if (!faqSection || typeof faqData === "undefined") return;

    const panels = faqSection.querySelectorAll(".faq-panel");

    panels.forEach((panel) => {
        const panelName = panel.getAttribute("data-panel");
        const faqs = faqData[panelName]
            .filter((faq) => faq.active)
            .sort((a, b) => a.order - b.order);

        if (!faqs || faqs.length === 0) return;

        panel.innerHTML = faqs
            .map((faq, index) => {
                return `
                    <div class="faq-item ${index === 0 ? "active" : ""}">
                        <button type="button" class="faq-question">
                            <span>${faq.question}</span>
                            <span class="faq-icon"></span>
                        </button>

                        <div class="faq-answer" style="display: ${index === 0 ? "block" : "none"};">
                            <p>${faq.answer}</p>
                        </div>
                    </div>
                `;
            })
            .join("");
    });
}

function initializeFaqSection() {
    const faqSection = document.getElementById("faq-section");

    if (!faqSection) return;

    const filterButtons = faqSection.querySelectorAll(".faq-filter-btn");
    const panels = faqSection.querySelectorAll(".faq-panel");

    function closeAllFaqs(panel) {
        const items = panel.querySelectorAll(".faq-item");

        items.forEach((item) => {
            item.classList.remove("active");

            const answer = item.querySelector(".faq-answer");

            if (answer) {
                answer.style.display = "none";
            }
        });
    }

    function openFaq(item) {
        item.classList.add("active");

        const answer = item.querySelector(".faq-answer");

        if (answer) {
            answer.style.display = "block";
        }
    }

    function activatePanel(tabName) {
        panels.forEach((panel) => {
            const isTarget = panel.getAttribute("data-panel") === tabName;

            panel.classList.toggle("active", isTarget);

            if (isTarget) {
                closeAllFaqs(panel);

                const firstItem = panel.querySelector(".faq-item");

                if (firstItem) {
                    openFaq(firstItem);
                }
            }
        });

        filterButtons.forEach((button) => {
            button.classList.toggle(
                "active",
                button.getAttribute("data-tab") === tabName
            );
        });
    }

    filterButtons.forEach((button) => {
        button.addEventListener("click", function () {
            activatePanel(this.getAttribute("data-tab"));
        });
    });

    faqSection.addEventListener("click", function (event) {
        const question = event.target.closest(".faq-question");

        if (!question) return;

        const item = question.closest(".faq-item");
        const panel = question.closest(".faq-panel");

        if (!item || !panel || !panel.classList.contains("active")) return;

        const alreadyOpen = item.classList.contains("active");

        closeAllFaqs(panel);

        if (!alreadyOpen) {
            openFaq(item);
        }
    });

    const firstActiveButton =
        faqSection.querySelector(".faq-filter-btn.active") || filterButtons[0];

    if (firstActiveButton) {
        activatePanel(firstActiveButton.getAttribute("data-tab"));
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    await loadComponent("utility-bar", "/Components/utility-bar.html");
    await loadComponent("header", "/Components/header.html");
    await loadComponent('contact-cta', '/Components/contact-cta.html');
    await loadComponent("footer", "/Components/footer.html");

    setActiveNavigation();
    renderFaqs();
    initializeFaqSection();
});