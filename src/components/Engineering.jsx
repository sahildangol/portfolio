import { motion } from "framer-motion";

import { styles } from "../styles";
import { engineering } from "../constants";

const ACCENTS = {
  violet: { hex: "#4F46E5", grad: "linear-gradient(135deg,#4F46E5,#818CF8)" },
  sky: { hex: "#0284C7", grad: "linear-gradient(135deg,#0284C7,#38BDF8)" },
  teal: { hex: "#0D9488", grad: "linear-gradient(135deg,#0D9488,#2DD4BF)" },
};

const rise = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 0.61, 0.36, 1] } },
};

/* ---------- Section ---------- */

const Engineering = () => (
  <section className="relative overflow-hidden">
    <motion.div
      id="engineering"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      variants={rise}
      className={`${styles.padding} guide-pad relative mx-auto max-w-[96rem] pb-6`}
    >
      <p className={styles.sectionSubText}>{engineering.kicker}</p>
      <h2 className="mt-4 font-display text-[3rem] font-extrabold leading-[0.98] tracking-tight text-ink sm:text-7xl">
        AI engineer.
        <br />
        <span className="text-grad">End to end.</span>
      </h2>
      <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-2">{engineering.intro}</p>
    </motion.div>

    {engineering.chapters.map((ch) => {
      const c = ACCENTS[ch.accent];
      return (
        <motion.article
          key={ch.id}
          id={ch.id}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          variants={{ show: { transition: { staggerChildren: 0.12 } } }}
          className={`${styles.paddingX} guide-pad relative mx-auto max-w-[96rem] py-16 sm:py-20`}
        >
          <motion.div variants={rise} className="relative flex items-baseline gap-4">
            <span className="font-display text-6xl font-extrabold leading-none sm:text-7xl" style={{ backgroundImage: c.grad, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
              {ch.number}
            </span>
            <span className="font-mono text-xs uppercase tracking-[0.24em]" style={{ color: c.hex }}>
              {ch.title}
            </span>
          </motion.div>
          <motion.h3 variants={rise} className="relative mt-4 font-display text-[2.2rem] font-bold leading-[1.05] tracking-tight sm:text-5xl">
            {ch.tagline}
          </motion.h3>
          <motion.p variants={rise} className="relative mt-5 max-w-xl text-[1.05rem] leading-relaxed text-ink-2">
            {ch.description}
          </motion.p>
          <motion.ul variants={rise} className="relative mt-7 divide-y divide-line border-y border-line">
            {ch.points.map((pt) => (
              <li key={pt} className="flex items-center gap-4 py-3.5 text-[0.98rem] font-semibold text-ink">
                <span className="h-1.5 w-6 shrink-0 rounded-full" style={{ background: c.grad }} aria-hidden="true" />
                {pt}
              </li>
            ))}
          </motion.ul>
        </motion.article>
      );
    })}

    <div className={`${styles.paddingX} guide-pad mx-auto max-w-[96rem] pb-10`}>
      <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-muted">Everyday toolbox</p>
      <ul className="mt-4 flex flex-wrap gap-2">
        {engineering.toolbox.map((t) => (
          <li key={t} className="chip">
            {t}
          </li>
        ))}
      </ul>
    </div>
  </section>
);

export default Engineering;
