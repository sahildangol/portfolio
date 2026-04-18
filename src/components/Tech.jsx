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
        <p className="mt-4 max-w-4xl text-[0.98rem] leading-relaxed text-white/70 sm:text-[1.05rem]">
          Core tools used in production work.
        </p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4"
      >
        {skillGroups.map((group) => (
          <motion.div
            key={group.id}
            variants={item}
            whileHover={{ y: -6 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            className="glass-card rounded-2xl border border-white/10 p-6 sm:p-7"
          >
            <h3 className="text-white font-display text-xl sm:text-2xl font-medium">
              {group.title}
            </h3>
            <div className="mt-6 flex flex-wrap gap-3">
              {group.items.map((skill, index) => {
                let badgeColor =
                  "text-[var(--purple-primary)] bg-[var(--purple-primary)]/12 border-[var(--purple-primary)]/28";
                if (skill.level === "Advanced")
                  badgeColor =
                    "text-[var(--cyan-accent)] bg-[var(--cyan-accent)]/12 border-[var(--cyan-accent)]/28";
                if (skill.level === "Intermediate")
                  badgeColor =
                    "text-[var(--blue-accent)] bg-[var(--blue-accent)]/12 border-[var(--blue-accent)]/28";

                return (
                  <div
                    key={`${group.id}-${index}`}
                    className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 py-2.5 pl-3.5 pr-2 text-[0.92rem] text-[var(--text-primary)] transition-colors hover:border-white/20 hover:bg-white/10"
                  >
                    <span>{skill.name}</span>
                    <span
                      className={`rounded-full border px-2 py-0.5 text-[11px] font-medium uppercase tracking-wider ${badgeColor}`}
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
