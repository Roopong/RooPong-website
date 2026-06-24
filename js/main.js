const header = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const navLinks = document.querySelectorAll(".site-nav a");
const lightbox = document.querySelector(".lightbox");
const lightboxImage = document.querySelector(".lightbox-image");
const lightboxClose = document.querySelector(".lightbox-close");
const lightboxPrev = document.querySelector(".lightbox-prev");
const lightboxNext = document.querySelector(".lightbox-next");
const lightboxMeta = document.querySelector(".lightbox-meta");
const lightboxMetaStep = document.querySelector(".lightbox-meta-step");
const lightboxMetaTitle = document.querySelector(".lightbox-meta-title");
const lightboxMetaPhoto = document.querySelector(".lightbox-meta-photo");
const lightboxMetaCopy = document.querySelector(".lightbox-meta-copy");
const lightboxTriggers = Array.from(document.querySelectorAll(".lightbox-trigger"));
let lightboxIndex = 0;
let touchStartX = 0;
const mobileNavQuery = window.matchMedia("(max-width: 768px)");
const protectionSections = {
    "elevator-lobby": { step: "01", title: "梯廳保護", copy: "施工期間維護梯廳公設完整" },
    corridor: { step: "02", title: "走道保護", copy: "施工期間維護走道環境整潔" },
    "interior-route": { step: "03", title: "室內動線", copy: "施工期間維護室內搬運動線" },
    parking: { step: "04", title: "停車格保護", copy: "施工期間維護停車格與動線" }
};

function updateHeaderState() {
    if (!header) {
        return;
    }

    header.classList.toggle("is-scrolled", window.scrollY > 24);
}

function closeMobileNav() {
    if (!siteNav || !navToggle || !mobileNavQuery.matches) {
        return;
    }

    siteNav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
}

if (navToggle && siteNav) {
    navToggle.addEventListener("click", (event) => {
        event.stopPropagation();
        const isOpen = siteNav.classList.toggle("is-open");
        navToggle.setAttribute("aria-expanded", String(isOpen));
    });
}

navLinks.forEach((link) => {
    link.addEventListener("click", closeMobileNav);
});

document.addEventListener("click", (event) => {
    if (!siteNav || !navToggle || !siteNav.classList.contains("is-open")) {
        return;
    }

    const target = event.target;
    if (!(target instanceof Node) || siteNav.contains(target) || navToggle.contains(target)) {
        return;
    }

    closeMobileNav();
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
    updateLightboxMeta(trigger);
}

function updateLightboxMeta(trigger) {
    if (!lightboxMeta || !lightboxMetaStep || !lightboxMetaTitle || !lightboxMetaPhoto || !lightboxMetaCopy) {
        return;
    }

    const imageSource = trigger.dataset.lightboxSrc || "";
    const sectionKey = Object.keys(protectionSections).find((key) => imageSource.includes(`/protection/${key}/`));
    const section = sectionKey ? protectionSections[sectionKey] : null;

    if (!section) {
        lightboxMeta.hidden = true;
        return;
    }

    const sectionImages = lightboxTriggers.filter((item) => item.dataset.lightboxSrc?.includes(`/protection/${sectionKey}/`));
    const sectionImageNumber = sectionImages.indexOf(trigger) + 1;

    lightboxMetaStep.textContent = `${section.step} / ${String(Object.keys(protectionSections).length).padStart(2, "0")}`;
    lightboxMetaTitle.textContent = section.title;
    lightboxMetaPhoto.textContent = `${sectionImageNumber} / ${sectionImages.length}`;
    lightboxMetaCopy.textContent = section.copy;
    lightboxMeta.hidden = false;
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
