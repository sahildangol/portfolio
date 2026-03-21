import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import Lenis from "lenis";
import {
  About,
  AIMLLab,
  Contact,
  Education,
  Experience,
  FocusTabs,
  Hero,
  Navbar,
  Tech,
  Works,
  StarsCanvas,
  CaseStudies,
  Testimonials,
  BlogSection,
} from "./components";

const App = () => {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.05,
      smoothWheel: true,
      smoothTouch: false,
    });

    let rafId;
    const raf = (time) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    const handleAnchorClick = (event) => {
      const anchor = event.target.closest("a[href^='#']");
      if (!anchor) {
        return;
      }

      const hash = anchor.getAttribute("href");
      if (!hash || hash === "#") {
        return;
      }

      const target = document.querySelector(hash);
      if (!target) {
        return;
      }

      event.preventDefault();
      lenis.scrollTo(target, {
        offset: -90,
        duration: 1,
      });
    };

    document.addEventListener("click", handleAnchorClick);

    return () => {
      document.removeEventListener("click", handleAnchorClick);
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return (
    <BrowserRouter>
      <div className="stealth-bg min-h-screen text-white">
        <a href="#main" className="sr-only focus:not-sr-only">
          Skip to main content
        </a>
        <Navbar />
        <main id="main" className="relative z-10">
          <Hero />
          <About />
          <Education />
          <FocusTabs />
          <Experience />
          <Works />
          <CaseStudies />
          <AIMLLab />
          <Tech />
          <Testimonials />
          <BlogSection />
          <div className="relative z-0">
            <Contact />
            <StarsCanvas />
          </div>
          <footer className="w-full text-center py-6 text-white/40 text-sm glass-card border-none rounded-none mt-10">
            <p>
              Last updated:{" "}
              {new Date().toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </p>
          </footer>
        </main>
      </div>
    </BrowserRouter>
  );
};

export default App;
