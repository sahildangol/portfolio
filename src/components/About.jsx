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
        viewport={{ once: true, amount: 0.2 }}
        className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4"
      >
        {services.map((service) => (
          <motion.div
            key={service.id}
            variants={item}
            whileHover={{ y: -6 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            className="glass-card rounded-2xl p-6"
          >
            <img
              src={service.icon}
              alt={service.title}
              className="h-10 w-10 object-contain"
            />
            <h3 className="mt-4 text-white font-display text-lg">
              {service.title}
            </h3>
          </motion.div>
        ))}
      </motion.div>

    </>
  );
};

export default SectionWrapper(About, "about");
