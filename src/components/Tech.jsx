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
            <h3 className="text-white font-display text-lg">{group.title}</h3>
            <ul className="mt-4 space-y-2 text-sm text-white/70">
              {group.items.map((skill, index) => (
                <li
                  key={`${group.id}-${index}`}
                  className="flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
                    <span>{skill.name}</span>
                  </div>
                  <span className="text-xs text-violet-300 bg-violet-500/10 px-2 py-0.5 rounded-full border border-violet-500/20">
                    {skill.level}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </motion.div>
    </>
  );
};

export default SectionWrapper(Tech, "skills");
