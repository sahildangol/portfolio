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

            <div className="relative z-10 w-full h-full flex flex-col justify-center">
              <h3 className="text-white text-2xl sm:text-3xl font-display font-bold leading-tight relative inline-block">
                {service.title}
                <span className="block mt-4 w-12 h-1 bg-[var(--cyan-accent)] rounded-full group-hover:w-24 transition-all duration-500 ease-out"></span>
              </h3>

              <div className="mt-6">
                <p className="text-[var(--text-secondary)] text-base sm:text-lg leading-[1.8] font-light">
                  {service.description}
                </p>
              </div>
            </div>
          </motion.article>
        ))}
      </motion.div>
    </>
  );
};

export default SectionWrapper(About, "about");
