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
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-white/70 sm:text-[1.06rem]">
          {about.description}
        </p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        className="mt-10 grid gap-6 md:grid-cols-2"
      >
        {services.map((service) => (
          <motion.article
            key={service.title}
            variants={item}
            className="glass-card hover-card group relative overflow-hidden rounded-3xl border border-white/10 p-7 sm:p-8"
          >
            <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-br from-[var(--purple-primary)]/10 to-[var(--cyan-accent)]/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>

            <div className="relative z-10 flex h-full w-full flex-col justify-center">
              <h3 className="relative inline-block font-display text-2xl font-bold leading-tight text-white sm:text-3xl">
                {service.title}
                <span className="mt-4 block h-1 w-12 rounded-full bg-[var(--cyan-accent)] transition-all duration-500 ease-out group-hover:w-24"></span>
              </h3>

              <div className="mt-6">
                <p className="text-base leading-[1.7] text-[var(--text-secondary)] sm:text-[1.02rem]">
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
