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

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="glass-card rounded-3xl p-6 sm:p-8">
          <p className="text-sm uppercase tracking-[0.3em] text-white/50">
            Applied AI/ML
          </p>
          <h3 className="mt-4 text-white font-display text-2xl">
            Forecasting Models, RAG , and Deployment
          </h3>
          <p className="mt-4 text-white/70 leading-relaxed">
            {lab.description}
          </p>
          <motion.ul
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="mt-6 grid gap-3 text-sm text-white/70"
          >
            {lab.highlights.map((highlight) => (
              <motion.li
                key={highlight.id}
                variants={item}
                className="rounded-xl border border-white/10 bg-white/5 p-4"
              >
                <p className="text-white font-medium">{highlight.title}</p>
                <p className="mt-1 text-white/60">{highlight.description}</p>
              </motion.li>
            ))}
          </motion.ul>
        </div>

        <div className="space-y-6">
          {lab.cards.map((card) => (
            <div key={card.id} className="glass-card rounded-2xl p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-white/50">
                {card.title}
              </p>
              <p className="mt-3 text-white font-display text-lg">
                {card.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default SectionWrapper(AIMLLab, "lab");
