import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import Lenis from "lenis";

import { Contact, Engineering, Experience, Hero, Navbar, Works } from "./components";
import Guide from "./components/guide/Guide";
import { setLenis } from "./lib/scroll";
import Logo from "./components/brand/Logo";

const MODEL_CREDIT = {
  title: "10 Gusion - Dimension Walker",
  url: "https://sketchfab.com/3d-models/10-gusion-dimension-walker-c4ac293b1349440f87087e96c810a42c",
  author: "itadorisenpai76",
  authorUrl: "https://sketchfab.com/itadorisenpai76",
};

const App = () => {
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.05, smoothWheel: true });
    setLenis(lenis);

    let rafId;
    const raf = (time) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    const handleAnchorClick = (event) => {
      const anchor = event.target.closest("a[href^='#']");
      if (!anchor) return;
      const hash = anchor.getAttribute("href");
      if (!hash || hash === "#") return;
      const target = document.querySelector(hash);
      if (!target) return;
      event.preventDefault();
      lenis.scrollTo(target, { offset: -90, duration: 1 });
    };

    document.addEventListener("click", handleAnchorClick);

    return () => {
      document.removeEventListener("click", handleAnchorClick);
      cancelAnimationFrame(rafId);
      setLenis(null);
      lenis.destroy();
    };
  }, []);

  return (
    <BrowserRouter>
      <div className="relative min-h-screen w-full overflow-x-hidden font-body">
        <a href="#main" className="sr-only focus:not-sr-only">
          Skip to main content
        </a>
        <Navbar />
        <Guide />
        <main id="main" className="relative z-10">
          <Hero />
          <Engineering />
          <Experience />
          <Works />
          <Contact />
          <footer className="guide-pad mx-auto max-w-[96rem] border-t border-line px-5 py-10 text-sm text-muted sm:px-8 lg:px-12">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <Logo size={30} />
              <p>© {new Date().getFullYear()} Sahil Dangol · Kathmandu</p>
            </div>
            <p className="mt-4 text-xs text-muted/80">
              Guide character based on{" "}
              <a className="underline hover:text-ink" href={MODEL_CREDIT.url} target="_blank" rel="noopener noreferrer">
                “{MODEL_CREDIT.title}”
              </a>{" "}
              by{" "}
              <a className="underline hover:text-ink" href={MODEL_CREDIT.authorUrl} target="_blank" rel="noopener noreferrer">
                {MODEL_CREDIT.author}
              </a>
              , licensed under{" "}
              <a className="underline hover:text-ink" href="http://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer">
                CC BY 4.0
              </a>
              . Modified: face and hair retextured, weapon and effects removed, re-posed and animated in code. Character design from Mobile Legends: Bang Bang © Moonton.
            </p>
          </footer>
        </main>
      </div>
    </BrowserRouter>
  );
};

export default App;
