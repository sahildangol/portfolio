// Shared handle to the Lenis instance so the guide can scroll the page smoothly.
let lenis = null;

export const setLenis = (instance) => {
  lenis = instance;
};

export const scrollToSection = (id) => {
  const target = id === "hero" ? 0 : document.getElementById(id);
  if (target === null) return;
  if (lenis) {
    lenis.scrollTo(target, { offset: id === "hero" ? 0 : -90, duration: 1.2 });
  } else if (target === 0) {
    window.scrollTo({ top: 0, behavior: "smooth" });
  } else {
    target.scrollIntoView({ behavior: "smooth" });
  }
};
