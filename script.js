const programme = document.querySelector(".programme");
const sections = document.querySelectorAll(".day");
const navigationLinks = document.querySelectorAll(".days-navigation__link");

function setActiveNavigation(sectionId) {
  navigationLinks.forEach((link) => {
    const isActive = link.dataset.section === sectionId;

    link.classList.toggle("active", isActive);

    if (isActive) {
      link.setAttribute("aria-current", "true");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

const observerOptions = {
  root: programme,
  threshold: 0.55,
};

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      setActiveNavigation(entry.target.id);
    }
  });
}, observerOptions);

sections.forEach((section) => {
  sectionObserver.observe(section);
});

navigationLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();

    const targetId = link.getAttribute("href");
    const targetSection = document.querySelector(targetId);

    if (!targetSection) {
      return;
    }

    targetSection.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  });
});
