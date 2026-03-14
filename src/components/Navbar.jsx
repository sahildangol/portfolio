import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { styles } from "../styles";
import { navLinks, profile } from "../constants";
import { brandLogo, menu, close } from "../assets";

const Navbar = () => {
  const [active, setActive] = useState("");
  const [toggle, setToggle] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      if (scrollTop > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`${styles.paddingX} fixed top-0 z-30 w-full transition ${
        scrolled ? "bg-stealth-900/80 backdrop-blur" : "bg-transparent"
      }`}
      aria-label="Primary"
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between py-5">
        <Link
          to="/"
          className="flex items-center gap-4"
          onClick={() => {
            setActive("");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          <img
            src={brandLogo}
            alt={`${profile.name} logo`}
            className="h-12 w-12 rounded-2xl object-contain"
          />
          <p className="text-white text-xl font-display font-semibold tracking-wide">
            {profile.name}
          </p>
        </Link>

        <ul className="hidden list-none items-center gap-8 sm:flex">
          {navLinks.map((nav) => (
            <li
              key={nav.id}
              className={`text-sm font-medium transition ${
                active === nav.title ? "text-white" : "text-white/60"
              } hover:text-white`}
            >
              <a
                href={`#${nav.id}`}
                onClick={() => setActive(nav.title)}
                aria-current={active === nav.title ? "page" : undefined}
              >
                {nav.title}
              </a>
            </li>
          ))}
        </ul>

        <div className="sm:hidden flex flex-1 justify-end items-center">
          <button
            type="button"
            className="rounded-full border border-white/10 p-2"
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

          <div
            id="mobile-menu"
            className={`${
              !toggle ? "hidden" : "flex"
            } glass-card absolute top-20 right-4 min-w-[180px] flex-col gap-4 rounded-2xl p-6`}
          >
            {navLinks.map((nav) => (
              <a
                key={nav.id}
                href={`#${nav.id}`}
                className="text-sm font-medium text-white/70 hover:text-white"
                onClick={() => {
                  setToggle(false);
                  setActive(nav.title);
                }}
              >
                {nav.title}
              </a>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
