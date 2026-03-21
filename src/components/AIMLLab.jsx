import { motion } from "framer-motion";

import { lab } from "../constants";
import { container, item, textVariant } from "../utils/motion";
import { styles } from "../styles";
import { SectionWrapper } from "../hoc";

const AIMLLab = () => {
  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText}>{lab.subtitle}</p>
        <h2 className={styles.sectionHeadText}>{lab.title}</h2>
      </motion.div>

      <div className="mt-12 flex flex-col lg:flex-row gap-8">
        <div className="glass-card hover-card rounded-3xl p-8 sm:p-10 flex-1 flex flex-col justify-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-tr from-[var(--purple-primary)]/10 to-[var(--cyan-accent)]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

          <div className="relative z-10">
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--blue-accent)]/30 bg-[var(--blue-accent)]/10 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-[var(--blue-accent)] mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--blue-accent)] animate-pulse"></span>
              Applied AI/ML Research
            </span>

            <h3 className="text-[var(--text-primary)] font-display text-3xl sm:text-4xl leading-tight font-bold">
              Forecasting Models, RAG, & Deployment
            </h3>

            <p className="mt-6 text-[var(--text-secondary)] text-[15px] sm:text-base leading-[1.8]">
              {lab.description}
            </p>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-6">
          <motion.ul
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="grid gap-6 sm:grid-cols-2"
          >
            {lab.highlights.map((highlight) => (
              <motion.li
                key={highlight.id}
                variants={item}
                className="glass-card rounded-2xl p-6 hover-card border border-white/5 transition-colors hover:border-[var(--purple-primary)]/30 flex flex-col"
              >
                <h4 className="text-[var(--text-primary)] font-semibold text-lg">
                  {highlight.title}
                </h4>
                <p className="mt-3 text-[var(--text-tertiary)] text-sm leading-relaxed flex-grow">
                  {highlight.description}
                </p>
              </motion.li>
            ))}
          </motion.ul>

          <div className="grid gap-6 sm:grid-cols-3">
            {lab.cards.map((card) => (
              <div
                key={card.id}
                className="rounded-2xl border border-white/5 bg-[var(--bg-primary)]/50 p-6 flex flex-col items-center justify-center text-center transition hover:bg-white/5"
              >
                <p className="text-[10px] font-mono tracking-widest uppercase text-white/40 mb-2">
                  {card.title}
                </p>
                <p className="text-[var(--cyan-accent)] font-display text-2xl sm:text-3xl font-bold">
                  {card.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default SectionWrapper(AIMLLab, "lab");
