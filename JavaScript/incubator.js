document.addEventListener("DOMContentLoaded", function () {
    const marqueeTrack = document.getElementById("incubator-hero-marquee-track");

    if (!marqueeTrack) return;

    const items = [
        "Pre-Incubation Programme",
        "Incubation Programme",
        "Capacity Building Programme",
        "Leadership Programme",
        "Management Development Programme",
        "Funding & Investment Opportunities"
    ];

    function createSet() {
        const fragment = document.createDocumentFragment();

        items.forEach((text) => {
            const entry = document.createElement("div");
            entry.className = "incubator-hero-marquee-entry";

            const item = document.createElement("div");
            item.className = "incubator-hero-marquee-item";
            item.textContent = text;

            const separator = document.createElement("div");
            separator.className = "incubator-hero-marquee-separator";

            entry.appendChild(item);
            entry.appendChild(separator);
            fragment.appendChild(entry);
        });

        return fragment;
    }

    marqueeTrack.appendChild(createSet());
    marqueeTrack.appendChild(createSet());

    requestAnimationFrame(() => {
        const totalWidth = marqueeTrack.scrollWidth / 2;
        const speed = 60;
        const duration = totalWidth / speed;

        marqueeTrack.style.animationDuration = duration + "s";
    });
});