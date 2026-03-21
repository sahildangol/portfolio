import { motion } from "framer-motion";
import { SectionWrapper } from "../hoc";
import { skillGroups } from "../constants";
import { container, item, textVariant } from "../utils/motion";
import { styles } from "../styles";

const Tech = () => {
  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText}>Capabilities</p>
        <h2 className={styles.sectionHeadText}>Technical Stack.</h2>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="mt-10 grid gap-6 md:grid-cols-3"
      >
        {skillGroups.map((group) => (
          <motion.div
            key={group.id}
            variants={item}
            whileHover={{ y: -6 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            className="glass-card rounded-2xl p-6"
          >
            <h3 className="text-white font-display text-lg sm:text-xl font-medium">
              {group.title}
            </h3>
            <div className="mt-6 flex flex-wrap gap-3">
              {group.items.map((skill, index) => {
                let badgeColor =
                  "text-[var(--purple-primary)] bg-[var(--purple-primary)]/10 border-[var(--purple-primary)]/20";
                if (skill.level === "Advanced")
                  badgeColor =
                    "text-[var(--cyan-accent)] bg-[var(--cyan-accent)]/10 border-[var(--cyan-accent)]/20";
                if (skill.level === "Intermediate")
                  badgeColor =
                    "text-[var(--blue-accent)] bg-[var(--blue-accent)]/10 border-[var(--blue-accent)]/20";

                return (
                  <div
                    key={`${group.id}-${index}`}
                    className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 py-2 pl-4 pr-2 text-sm sm:text-base text-[var(--text-primary)] transition-colors hover:border-white/20 hover:bg-white/10 shadow-sm"
                  >
                    <span>{skill.name}</span>
                    <span
                      className={`text-[10px] tracking-wider uppercase font-medium px-2 py-0.5 rounded-full border ${badgeColor}`}
                    >
                      {skill.level}
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </>
  );
};

export default SectionWrapper(Tech, "skills");
