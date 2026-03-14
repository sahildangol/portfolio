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

      <div className="mt-8 space-y-5">
        {about.credentials.map((credential) => {
          const isPrimary = credential.id === "education";

          return (
            <div
              key={credential.id}
              className={`glass-card rounded-2xl border p-6 transition ${
                isPrimary
                  ? "border-cyan-300/55 bg-cyan-500/10 shadow-glow"
                  : "border-white/10"
              }`}
            >
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
                className={`mt-3 font-display ${
                  isPrimary ? "text-xl text-white" : "text-white"
                }`}
              >
                {credential.name}
              </p>
              {credential.description && (
                <p
                  className={`mt-2 text-sm ${
                    isPrimary ? "text-white/85" : "text-white/65"
                  }`}
                >
                  {credential.description}
                </p>
              )}

              {isPrimary && (
                <span className="mt-4 inline-flex rounded-full border border-cyan-200/50 bg-cyan-300/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-100">
                  Current Degree
                </span>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default SectionWrapper(Education, "education");
