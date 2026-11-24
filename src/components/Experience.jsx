import { motion } from "framer-motion";

import { styles } from "../styles";
import { education, experiences } from "../constants";
import { SectionWrapper } from "../hoc";
import { container, item, textVariant } from "../utils/motion";

const Experience = () => (
  <>
    <motion.div variants={textVariant()}>
      <p className={styles.sectionSubText}>Experience</p>
      <h2 className={`${styles.sectionHeadText} mt-3`}>Where I've worked.</h2>
    </motion.div>

    <motion.ol
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      className="mt-12 space-y-4"
    >
      {experiences.map((exp) => {
        const current = exp.date.includes("Present");
        return (
          <motion.li key={exp.id} variants={item}>
            <article className="card p-6 sm:p-7">
              <div className="flex flex-wrap items-start gap-4">
                <img
                  src={exp.icon}
                  alt={`${exp.company_name} logo`}
                  className={`h-12 rounded-xl border border-line bg-white object-contain p-1.5 ${exp.iconWide ? "w-28" : "w-12"}`}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-semibold">{exp.title}</h3>
                    {current && (
                      <span className="rounded-full bg-[#EEF2FF] px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.16em] text-violet">
                        Now
                      </span>
                    )}
                  </div>
                  <a href={exp.url} target="_blank" rel="noopener noreferrer" className="text-sm text-muted hover:text-ink">
                    {exp.company_name}
                  </a>
                </div>
                <span className="w-full font-mono text-xs text-muted sm:w-auto">{exp.date}</span>
              </div>
              <ul className="mt-5 space-y-2.5 border-t border-line pt-5">
                {exp.points.map((point) => (
                  <li key={point} className="flex gap-3 text-[0.95rem] leading-relaxed text-ink-2">
                    <span className="mt-[0.65rem] h-1 w-1 shrink-0 rounded-full bg-violet" aria-hidden="true" />
                    {point}
                  </li>
                ))}
              </ul>
            </article>
          </motion.li>
        );
      })}
    </motion.ol>

    <motion.div variants={textVariant()} className="mt-14">
      <p className={styles.sectionSubText}>Education</p>
    </motion.div>
    <motion.ul
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      className="mt-5 grid gap-3"
    >
      {education.map((ed) => (
        <motion.li key={ed.id} variants={item}>
          <a href={ed.url} target="_blank" rel="noopener noreferrer" className="card card-hover flex items-center gap-4 p-4 sm:p-5">
            {ed.icon ? (
              <img src={ed.icon} alt={`${ed.school} logo`} className="h-11 w-11 rounded-xl border border-line bg-white object-contain p-1" />
            ) : (
              <span className="grid h-11 w-11 place-items-center rounded-xl border border-line bg-white text-violet" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 10 12 5 2 10l10 5 10-5z" />
                  <path d="M6 12v5c3 2 9 2 12 0v-5" />
                </svg>
              </span>
            )}
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-ink">{ed.title}</p>
              <p className="text-sm text-muted">{ed.school}</p>
            </div>
            {ed.date && <span className="font-mono text-xs text-muted">{ed.date}</span>}
          </a>
        </motion.li>
      ))}
    </motion.ul>
  </>
);

export default SectionWrapper(Experience, "experience");
