import { motion } from "framer-motion";

import { about } from "../constants";
import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { textVariant } from "../utils/motion";

const Education = () => {
  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText}>Academic Background</p>
        <h2 className={styles.sectionHeadText}>Education.</h2>
      </motion.div>

      <div className="mt-16 grid gap-16 md:gap-20">
        {about.credentials.map((credential) => {
          const isPrimary = credential.id === "education";

          return (
            <div
              key={credential.id}
              className={`glass-card hover-card rounded-3xl border p-8 sm:p-10 transition-all ${
                isPrimary
                  ? "border-[var(--blue-accent)]/30 shadow-[0_0_30px_rgba(59,130,246,0.1)] relative overflow-hidden"
                  : "border-white/5"
              }`}
            >
              {isPrimary && (
                <div className="absolute top-0 right-0 p-4">
                  <span className="inline-flex rounded-full border border-[var(--cyan-accent)]/30 bg-[var(--cyan-accent)]/10 px-3 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--cyan-accent)]">
                    Current Degree
                  </span>
                </div>
              )}
              {isPrimary && (
                <p className="text-[10px] uppercase tracking-[0.28em] text-cyan-100/90">
                  Education
                </p>
              )}

              <p
                className={`text-xs uppercase tracking-[0.3em] ${
                  isPrimary ? "text-cyan-200" : "text-white/50"
                }`}
              >
                {credential.title}
              </p>
              <p
                className={`mt-4 font-display font-medium ${
                  isPrimary
                    ? "text-2xl sm:text-3xl text-[var(--text-primary)]"
                    : "text-xl sm:text-2xl text-[var(--text-primary)]"
                }`}
              >
                {credential.name}
              </p>
              {credential.description && (
                <p
                  className={`mt-4 text-[15px] leading-[1.7] max-w-2xl ${
                    isPrimary
                      ? "text-[var(--text-secondary)]"
                      : "text-[var(--text-tertiary)]"
                  }`}
                >
                  {credential.description}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default SectionWrapper(Education, "education");
