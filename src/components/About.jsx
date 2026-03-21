import { motion } from "framer-motion";

import { styles } from "../styles";
import { about, services } from "../constants";
import { SectionWrapper } from "../hoc";
import { container, item, textVariant } from "../utils/motion";

const About = () => {
  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText}>About Me</p>
        <h2 className={styles.sectionHeadText}>{about.heading}</h2>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="mt-16 grid gap-10 md:grid-cols-2"
      >
        {services.map((service) => (
          <motion.article
            key={service.title}
            variants={item}
            className="glass-card hover-card rounded-3xl p-8 flex flex-col justify-between group overflow-hidden relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--purple-primary)]/10 to-[var(--cyan-accent)]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-0"></div>

            <div className="relative z-10 w-full">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center overflow-hidden mb-6 shadow-glow transition-transform duration-300 group-hover:scale-110">
                <img
                  src={service.icon}
                  alt={service.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>

              <h3 className="text-white text-xl sm:text-2xl font-display font-semibold">
                {service.title}
              </h3>
            </div>

            <div className="relative z-10 mt-4 overflow-hidden h-full">
              <p className="text-[var(--text-secondary)] text-[15px] leading-[1.7] transform transition-transform duration-300">
                {service.description}
              </p>
            </div>
          </motion.article>
        ))}
      </motion.div>
    </>
  );
};

export default SectionWrapper(About, "about");
