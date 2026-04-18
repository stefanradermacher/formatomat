let lastFocusedElement = null;
let currentModal       = null;

export function openModal(modalEl) {
    if (!modalEl) return;
    lastFocusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    currentModal = modalEl;
    currentModal.classList.add("is-open");
    currentModal.setAttribute("aria-hidden", "false");
    const focusTarget = currentModal.querySelector(".modal-close") || currentModal.querySelector(".modal-dialog");
    focusTarget?.focus?.();
    document.addEventListener("keydown", trapFocus);
}

export function closeModal() {
    if (!currentModal) return;
    currentModal.classList.remove("is-open");
    currentModal.setAttribute("aria-hidden", "true");
    document.removeEventListener("keydown", trapFocus);
    lastFocusedElement?.focus?.();
    currentModal = null;
}

function trapFocus(event) {
    const focusable = Array.from(
        currentModal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
    ).filter((el) => !el.disabled);

    if (focusable.length === 0) {
        if (event.key === "Escape") closeModal();
        return;
    }

    const first = focusable[0];
    const last  = focusable[focusable.length - 1];

    if (event.key === "Tab") {
        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
        }
    }
    if (event.key === "Escape") closeModal();
}
