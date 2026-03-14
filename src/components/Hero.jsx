import { motion } from "framer-motion";

import { styles } from "../styles";
import { heroHighlights, insightCards, profile } from "../constants";
import { container, item } from "../utils/motion";

const Hero = () => {
  return (
    <section className="relative w-full min-h-screen overflow-hidden">
      <div
        className="absolute inset-0 stealth-grid opacity-15"
        aria-hidden="true"
      />
      <div
        className={`relative z-10 max-w-7xl mx-auto ${styles.paddingX} pt-28 pb-16 lg:pt-34 grid gap-12 lg:grid-cols-[1.1fr_0.9fr] items-center`}
      >
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.p
            variants={item}
            className="text-xs sm:text-sm uppercase tracking-[0.45em] text-white/60"
          >
            Full-Stack + AI Engineering
          </motion.p>
          <motion.h1 variants={item} className={`${styles.heroHeadText} mt-4`}>
            {profile.name.split(" ")[0]}{" "}
            <span className="text-violet-300 text-glow">
              {profile.name.split(" ").slice(1).join(" ")}
            </span>
          </motion.h1>
          <motion.p variants={item} className={`${styles.heroSubText} mt-6`}>
            {profile.role}
          </motion.p>
          <motion.ul
            variants={container}
            className="mt-8 grid gap-3 sm:grid-cols-2 text-sm text-white/80"
          >
            {heroHighlights.map((text) => (
              <motion.li
                key={text}
                variants={item}
                className={`glass-card rounded-xl px-4 py-3 leading-relaxed ${
                  text.includes("2+ years") ? "font-bold text-white" : ""
                }`}
              >
                {text}
              </motion.li>
            ))}
          </motion.ul>

          <motion.div variants={item} className="mt-10 flex flex-wrap gap-4">
            <motion.a
              href={profile.cvUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-white text-stealth-900 px-6 py-3 text-sm font-semibold shadow-glow"
              whileHover={{ y: -2 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              View CV
            </motion.a>
            <motion.a
              href="#projects"
              className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white/80 hover:text-white"
              whileHover={{ y: -2 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              View Projects
            </motion.a>
            <motion.a
              href="#contact"
              className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white/80 hover:text-white"
              whileHover={{ y: -2 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              Contact Me
            </motion.a>
          </motion.div>
        </motion.div>

        <div className="relative">
          <div className="glass-card rounded-3xl p-6 sm:p-8">
            <p className="text-sm text-white/60 uppercase tracking-[0.3em]">
              Key Highlights
            </p>
            <div className="mt-6 grid gap-4">
              {insightCards.map((card) => (
                <div
                  key={card.id}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-white font-display">{card.title}</p>
                    <span className="rounded-full border border-violet-300/45 px-2 py-1 text-[10px] font-mono tracking-[0.2em] text-violet-200">
                      {card.badge}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {profile.socialLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-white/15 px-3 py-1.5 text-xs text-white/70 transition hover:text-white"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
