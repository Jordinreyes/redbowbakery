
function toggleSection(button) {
    // Solo funciona en mobile
    if (window.innerWidth >= 768) {
        return;
    }

    const content = button.nextElementSibling;
    const icon = button.querySelector("i");

    if (content.classList.contains("hidden-section")) {
        // ABRIR
        content.classList.remove("hidden-section");

        content.style.maxHeight = content.scrollHeight + "px";

        icon.classList.remove("bi-chevron-down");
        icon.classList.add("bi-chevron-up");

    } else {
        // CERRAR
        content.style.maxHeight = content.scrollHeight + "px";

        requestAnimationFrame(() => {
            content.style.maxHeight = "0px";
        });

        content.classList.add("hidden-section");

        icon.classList.remove("bi-chevron-up");
        icon.classList.add("bi-chevron-down");
    }
}
