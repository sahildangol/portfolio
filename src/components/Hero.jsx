import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import sahilImg from "../assets/company/sahil.jpeg";

import { styles } from "../styles";
import { heroHighlights, insightCards, profile } from "../constants";
import { container, item } from "../utils/motion";

const TypingText = ({ text }) => {
  const [displayText, setDisplayText] = useState("");
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setDisplayText(text.slice(0, index));
      index++;
      if (index > text.length) clearInterval(interval);
    }, 50);
    return () => clearInterval(interval);
  }, [text]);

  return <span>{displayText}</span>;
};

const Hero = () => {
  return (
    <section className="relative w-full min-h-screen pt-24 pb-8 sm:pt-[80px] sm:pb-[120px] overflow-hidden">
      <div
        className={`relative z-10 max-w-7xl mx-auto px-6 sm:px-12 grid gap-16 lg:gap-24 lg:grid-cols-[1fr_400px] items-start pt-4 sm:pt-12 min-h-[calc(100vh-200px)]`}
      >
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <motion.div variants={item} className="mb-6 flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-accent"></span>
            </span>
            <span className="text-sm font-medium tracking-wider text-[#10ff9f] uppercase drop-shadow-[0_0_10px_rgba(16,255,159,0.8)]">
              Available for Hire
            </span>
          </motion.div>
          <motion.p
            variants={item}
            className="text-xs sm:text-sm uppercase tracking-[0.45em] text-white/60 h-6"
          >
            <TypingText text="Full-Stack + AI Engineering" />
          </motion.p>
          <motion.h1
            variants={item}
            className="font-display font-bold text-5xl sm:text-6xl md:text-[72px] leading-[1.1] tracking-tight mt-4 drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]"
          >
            {profile.name.split(" ")[0]}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-[#F8FAFC] to-[#A78BFA]">
              {profile.name.split(" ").slice(1).join(" ")}
            </span>
          </motion.h1>
          <motion.p
            variants={item}
            className="mt-6 text-lg sm:text-xl text-[var(--text-secondary)] font-body max-w-2xl leading-[1.7]"
          >
            {profile.tagline}
          </motion.p>
          <motion.ul
            variants={container}
            className="mt-8 grid gap-4 sm:grid-cols-2 text-sm text-[var(--text-secondary)]"
          >
            {heroHighlights.map((text) => (
              <motion.li
                key={text}
                variants={item}
                className={`glass-card hover-card rounded-xl px-4 py-3 leading-[1.7] flex items-center gap-3 ${
                  text.includes("2+ years")
                    ? "font-medium text-[var(--cyan-accent)]"
                    : ""
                }`}
              >
                <div className="h-2 w-2 rounded-full bg-[var(--purple-primary)] flex-shrink-0" />
                {text}
              </motion.li>
            ))}
          </motion.ul>

          <motion.div
            variants={item}
            className="mt-10 flex flex-wrap gap-4 items-center"
          >
            <motion.a
              href={profile.cvUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex items-center justify-center rounded-full bg-[var(--purple-primary)] text-white px-8 py-3.5 text-sm font-semibold shadow-[0_0_20px_rgba(167,139,250,0.3)] transition-all overflow-hidden relative group"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></span>
              View CV
            </motion.a>
            <motion.a
              href="#projects"
              className="btn-secondary inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 backdrop-blur-md px-8 py-3.5 text-sm font-semibold text-[var(--text-secondary)] hover:text-white transition-all shadow-sm"
            >
              View Projects
            </motion.a>
            <motion.a
              href="#contact"
              className="group inline-flex items-center justify-center rounded-full bg-[var(--green-accent)] text-[#0A0E1A] px-8 py-3.5 text-sm font-bold hover:bg-[#10b981] transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)]"
            >
              Contact Me
            </motion.a>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95, rotate: 2 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1], delay: 0.4 }}
          className="relative flex flex-col items-center justify-center w-full"
        >
          {/* 400x400 Circular Photo Container with rotating border */}
          <div className="relative w-[240px] h-[240px] sm:w-[320px] sm:h-[320px] rounded-full gradient-border-rotate profile-glow z-10 p-1 flex-shrink-0 mb-6 lg:mb-12">
            <div className="w-full h-full rounded-full overflow-hidden bg-[var(--bg-secondary)] relative group">
              <div className="absolute inset-0 bg-gradient-to-tr from-[var(--purple-primary)]/20 to-[var(--cyan-accent)]/20 mix-blend-overlay group-hover:opacity-0 transition-opacity duration-500 z-20"></div>
              <img
                src={sahilImg}
                alt="Sahil Dangol"
                className="w-full h-full object-cover relative z-10 transition-transform duration-700 group-hover:scale-110"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/profile.png";
                }}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2 text-center lg:text-left justify-center lg:justify-start">
            {profile.socialLinks.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-white/15 px-4 py-2 text-xs sm:text-sm shadow-sm text-white/70 transition hover:text-white hover:bg-white/5"
              >
                {link.label}
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
