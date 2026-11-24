import { useEffect, useState } from "react";

import { navLinks, profile } from "../constants";
import { scrollToSection } from "../lib/scroll";
import Logo from "./brand/Logo";

/** Transparent at the top, frosted white once you scroll. */
const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const light = false; // the hero is light, so the bar always uses dark text

  return (
    <nav
      aria-label="Primary"
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ${
        scrolled || open ? "border-b border-line bg-white/80 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-[96rem] items-center justify-between px-5 py-4 sm:px-8 lg:px-12">
        <button
          type="button"
          onClick={() => scrollToSection("hero")}
          className="rounded-xl"
          aria-label={`${profile.name}, back to top`}
        >
          <Logo size={34} />
        </button>

        <ul className="hidden items-center gap-8 md:flex">
          {navLinks.map((nav) => (
            <li key={nav.id}>
              <a
                href={`#${nav.id}`}
                className={`text-sm font-semibold transition ${light ? "text-white/85 hover:text-white" : "text-muted hover:text-ink"}`}
              >
                {nav.title}
              </a>
            </li>
          ))}
        </ul>

        <a href="#contact" className={`btn hidden !py-2.5 md:inline-flex ${light ? "btn-glass" : "btn-grad"}`}>
          Let's talk
        </a>

        <button
          type="button"
          className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle navigation"
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          <span className={`h-0.5 w-6 transition ${light ? "bg-white" : "bg-ink"} ${open ? "translate-y-1 rotate-45" : ""}`} />
          <span className={`h-0.5 w-6 transition ${light ? "bg-white" : "bg-ink"} ${open ? "-translate-y-1 -rotate-45" : ""}`} />
        </button>
      </div>

      <div id="mobile-menu" className={`${open ? "flex" : "hidden"} flex-col px-5 pb-5 pt-2 md:hidden`}>
        {navLinks.map((nav) => (
          <a key={nav.id} href={`#${nav.id}`} onClick={() => setOpen(false)} className="py-2.5 text-base font-semibold text-ink">
            {nav.title}
          </a>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
