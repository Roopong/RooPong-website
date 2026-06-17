const header = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const navLinks = document.querySelectorAll(".site-nav a");
const lightbox = document.querySelector(".lightbox");
const lightboxImage = document.querySelector(".lightbox-image");
const lightboxClose = document.querySelector(".lightbox-close");
const lightboxPrev = document.querySelector(".lightbox-prev");
const lightboxNext = document.querySelector(".lightbox-next");
const lightboxTriggers = Array.from(document.querySelectorAll(".lightbox-trigger"));
let lightboxIndex = 0;
let touchStartX = 0;

function updateHeaderState() {
    if (!header) {
        return;
    }

    header.classList.toggle("is-scrolled", window.scrollY > 24);
}

if (navToggle && siteNav) {
    navToggle.addEventListener("click", () => {
        const isOpen = siteNav.classList.toggle("is-open");
        navToggle.setAttribute("aria-expanded", String(isOpen));
    });
}

navLinks.forEach((link) => {
    link.addEventListener("click", () => {
        if (siteNav && navToggle) {
            siteNav.classList.remove("is-open");
            navToggle.setAttribute("aria-expanded", "false");
        }
    });
});

function resetDesktopNav() {
    if (!siteNav || !navToggle || !window.matchMedia("(min-width: 769px)").matches) {
        return;
    }

    siteNav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
}

function showLightboxImage(index) {
    if (!lightboxImage || !lightboxTriggers.length) {
        return;
    }

    lightboxIndex = (index + lightboxTriggers.length) % lightboxTriggers.length;
    const trigger = lightboxTriggers[lightboxIndex];
    lightboxImage.src = trigger.dataset.lightboxSrc;
    lightboxImage.alt = trigger.dataset.lightboxAlt || "";
}

function openLightbox(index) {
    if (!lightbox) {
        return;
    }

    showLightboxImage(index);
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    lightboxClose?.focus();
}

function closeLightbox() {
    if (!lightbox) {
        return;
    }

    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
}

function showPrevLightboxImage() {
    showLightboxImage(lightboxIndex - 1);
}

function showNextLightboxImage() {
    showLightboxImage(lightboxIndex + 1);
}

lightboxTriggers.forEach((trigger, index) => {
    trigger.addEventListener("click", () => openLightbox(index));
});

lightboxClose?.addEventListener("click", closeLightbox);
lightboxPrev?.addEventListener("click", showPrevLightboxImage);
lightboxNext?.addEventListener("click", showNextLightboxImage);

lightbox?.addEventListener("click", (event) => {
    if (event.target === lightbox) {
        closeLightbox();
    }
});

lightbox?.addEventListener("touchstart", (event) => {
    touchStartX = event.changedTouches[0].clientX;
});

lightbox?.addEventListener("touchend", (event) => {
    const touchEndX = event.changedTouches[0].clientX;
    const swipeDistance = touchEndX - touchStartX;

    if (Math.abs(swipeDistance) < 48) {
        return;
    }

    if (swipeDistance > 0) {
        showPrevLightboxImage();
        return;
    }

    showNextLightboxImage();
});

document.addEventListener("keydown", (event) => {
    if (!lightbox?.classList.contains("is-open")) {
        return;
    }

    if (event.key === "Escape") {
        closeLightbox();
    }

    if (event.key === "ArrowLeft") {
        showPrevLightboxImage();
    }

    if (event.key === "ArrowRight") {
        showNextLightboxImage();
    }
});

window.addEventListener("scroll", updateHeaderState);
window.addEventListener("resize", resetDesktopNav);
updateHeaderState();
resetDesktopNav();
