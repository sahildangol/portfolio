import { motion } from "framer-motion";
import sahilImg from "../assets/company/sahil.jpeg";

import { heroHighlights, profile } from "../constants";
import { container, fadeIn, item } from "../utils/motion";

const Hero = () => {
  return (
    <section className="relative w-full min-h-screen overflow-hidden pb-14 pt-32 sm:pb-20 sm:pt-28">
      <div className="relative z-10 mx-auto grid max-w-[92rem] min-h-[calc(100vh-220px)] items-center gap-12 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_420px] lg:gap-16 lg:px-10">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="max-w-4xl"
        >
      
          <motion.h1
            variants={item}
            className="mt-6 font-display text-5xl font-bold leading-[1.04] tracking-tight text-white drop-shadow-[0_14px_34px_rgba(2,8,23,0.55)] sm:text-6xl md:text-[74px] lg:text-[78px]"
          >
            <span className="bg-gradient-to-r from-[#f8fafc] via-[#d7f6ff] to-[#f8fafc] bg-clip-text text-transparent text-glow">
              {profile.name}
            </span>
            <span className="mt-3 block font-body text-[1.05rem] font-semibold tracking-[0.11em] text-white/82 sm:text-xl md:text-[26px]">
              {profile.role}
            </span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-6 max-w-3xl text-[1.02rem] leading-relaxed text-[var(--text-secondary)] sm:text-[1.1rem]"
          >
            {profile.experienceSummary}
          </motion.p>

          <motion.div variants={item} className="mt-5">
            <span className="inline-flex items-center rounded-full border border-[var(--cyan-accent)]/35 bg-[var(--cyan-accent)]/12 px-4 py-1.5 text-sm font-semibold text-[var(--cyan-accent)]">
              2+ Years Experience
            </span>
          </motion.div>

          <motion.ul
            variants={container}
            className="mt-7 flex flex-wrap gap-3 text-[0.92rem] text-[var(--text-secondary)]"
          >
            {heroHighlights.map((text) => (
              <motion.li
                key={text}
                variants={item}
                className="glass-card rounded-full border border-white/18 px-4 py-2.5 leading-[1.45] text-white/90"
              >
                <span>{text}</span>
              </motion.li>
            ))}
          </motion.ul>

          <motion.div
            variants={item}
            className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4"
          >
            <motion.a
              href={profile.cvUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary group inline-flex items-center justify-center rounded-full bg-[var(--purple-primary)] px-7 py-3.5 text-sm font-semibold text-white shadow-[0_12px_32px_rgba(255,122,89,0.34)] transition-all"
            >
              <span className="absolute inset-0 h-full w-full -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.5s_infinite]"></span>
              View CV
            </motion.a>
            <motion.a
              href="#projects"
              className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-7 py-3.5 text-sm font-semibold text-[var(--text-secondary)] transition-all hover:text-white"
            >
              View Projects
            </motion.a>
            <motion.a
              href="#contact"
              className="inline-flex items-center justify-center rounded-full border border-[var(--cyan-accent)]/35 bg-[var(--cyan-accent)]/15 px-7 py-3.5 text-sm font-semibold text-[var(--cyan-accent)] transition hover:bg-[var(--cyan-accent)]/25"
            >
              Start a Conversation
            </motion.a>
          </motion.div>
        </motion.div>

        <motion.div
          variants={fadeIn("left", "spring", 0.15, 0.9)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="relative flex w-full flex-col items-center justify-center"
        >
          <div className="glass-card relative mb-6 w-full max-w-[390px] overflow-hidden rounded-3xl border border-white/15 p-6 sm:mb-8 sm:p-7">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-[0.22em] text-white/55">
                Portfolio Identity
              </span>
              <span className="rounded-md border border-white/20 px-2 py-1 font-mono text-[10px] text-white/70">
                SD
              </span>
            </div>

            <div className="gradient-border-rotate profile-glow relative mx-auto h-[220px] w-[220px] rounded-full p-1 sm:h-[260px] sm:w-[260px]">
              <div className="group relative h-full w-full overflow-hidden rounded-full bg-[var(--bg-secondary)]">
                <div className="absolute inset-0 z-20 bg-gradient-to-tr from-[var(--purple-primary)]/20 to-[var(--cyan-accent)]/20 mix-blend-overlay transition-opacity duration-500 group-hover:opacity-0"></div>
                <img
                  src={sahilImg}
                  alt="Sahil Dangol"
                  className="relative z-10 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/profile.png";
                  }}
                />
              </div>
            </div>

            <p className="mt-5 text-center text-[0.95rem] leading-relaxed text-white/70">
              Engineer focused on production-grade AI systems, reliable APIs, and user-facing products.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-2.5 text-center">
            {profile.socialLinks.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`group inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 ${
                  link.id === "linkedin"
                    ? "border-[#0A66C2]/55 bg-[linear-gradient(120deg,rgba(10,102,194,0.36),rgba(56,189,248,0.2))] text-[#dceeff] shadow-[0_10px_24px_rgba(10,102,194,0.36)] hover:shadow-[0_14px_28px_rgba(10,102,194,0.45)]"
                    : "border-white/35 bg-[linear-gradient(120deg,rgba(255,255,255,0.18),rgba(148,163,184,0.2))] text-white shadow-[0_10px_24px_rgba(148,163,184,0.3)] hover:shadow-[0_14px_28px_rgba(148,163,184,0.38)]"
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    link.id === "linkedin" ? "bg-[#69b6ff]" : "bg-white"
                  }`}
                />
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
