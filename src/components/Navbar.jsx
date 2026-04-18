import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { styles } from "../styles";
import { navLinks, profile } from "../constants";
import { menu, close } from "../assets";

const Navbar = () => {
  const [active, setActive] = useState("");
  const [toggle, setToggle] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const syncActiveFromHash = () => {
      const hash = window.location.hash.replace("#", "");
      const current = navLinks.find((link) => link.id === hash);
      if (current) {
        setActive(current.title);
      }
    };

    syncActiveFromHash();
    window.addEventListener("hashchange", syncActiveFromHash);

    return () => window.removeEventListener("hashchange", syncActiveFromHash);
  }, []);

  return (
    <nav
      className={`${styles.paddingX} fixed top-0 z-40 w-full transition-all duration-500 ${
        scrolled ? "pt-3" : "pt-5"
      }`}
      aria-label="Primary"
    >
      <div
        className={`mx-auto w-full max-w-[92rem] rounded-2xl border transition-all duration-500 ${
          scrolled
            ? "border-white/15 bg-[rgba(5,8,15,0.8)] backdrop-blur-xl shadow-[0_20px_45px_rgba(2,8,23,0.4)]"
            : "border-white/10 bg-[rgba(5,8,15,0.45)] backdrop-blur-md"
        }`}
      >
        <div className="flex w-full items-center justify-between px-4 py-3 sm:px-6">
          <Link
            to="/"
            className="flex items-center gap-3 sm:gap-4"
            onClick={() => {
              setActive("");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/20 bg-gradient-to-br from-[var(--orange-accent)]/30 via-[var(--purple-primary)]/40 to-[var(--blue-accent)]/40 font-display text-sm font-bold tracking-[0.16em] text-white">
              SD
            </span>
            <span className="leading-tight">
              <span className="block font-display text-sm font-semibold text-white sm:text-base">
                {profile.name}
              </span>
              <span className="block text-[10px] uppercase tracking-[0.22em] text-white/55 sm:text-[11px]">
                {profile.role}
              </span>
            </span>
          </Link>

          <ul className="hidden list-none items-center gap-2 md:flex">
            {navLinks.map((nav) => {
              const isActive = active === nav.title;

              return (
                <li key={nav.id}>
                  <a
                    href={`#${nav.id}`}
                    onClick={() => setActive(nav.title)}
                    aria-current={isActive ? "page" : undefined}
                    className={`inline-flex rounded-full px-4 py-2 text-sm font-medium transition ${
                      isActive
                        ? "bg-white text-[#0a1425]"
                        : "text-white/70 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {nav.title}
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="hidden md:flex">
            <a
              href="#contact"
              className="inline-flex rounded-full border border-[var(--cyan-accent)]/40 bg-[var(--cyan-accent)]/15 px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--cyan-accent)] transition hover:border-[var(--cyan-accent)] hover:bg-[var(--cyan-accent)]/25"
            >
              Let's Talk
            </a>
          </div>

          <div className="flex flex-1 items-center justify-end md:hidden">
            <button
              type="button"
              className="rounded-xl border border-white/20 p-2.5"
              onClick={() => setToggle(!toggle)}
              aria-label="Toggle navigation"
              aria-expanded={toggle}
              aria-controls="mobile-menu"
            >
              <img
                src={toggle ? close : menu}
                alt=""
                className="h-5 w-5 object-contain"
              />
            </button>
          </div>
        </div>

        <div
          id="mobile-menu"
          className={`${
            !toggle ? "hidden" : "flex"
          } flex-col gap-2 border-t border-white/10 px-4 pb-4 pt-3 md:hidden`}
        >
          {navLinks.map((nav) => (
            <a
              key={nav.id}
              href={`#${nav.id}`}
              className="rounded-xl px-3 py-2 text-sm font-medium text-white/75 hover:bg-white/10 hover:text-white"
              onClick={() => {
                setToggle(false);
                setActive(nav.title);
              }}
            >
              {nav.title}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setToggle(false)}
            className="mt-2 rounded-xl border border-[var(--cyan-accent)]/35 bg-[var(--cyan-accent)]/15 px-3 py-2 text-center text-xs font-semibold uppercase tracking-[0.2em] text-[var(--cyan-accent)]"
          >
            Let's Talk
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
