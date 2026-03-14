import { motion } from "framer-motion";
import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { featuredProjects } from "../constants";
import { textVariant } from "../utils/motion";

const Works = () => {
  const loopProjects = [...featuredProjects, ...featuredProjects];

  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText}>Featured Projects</p>
        <h2 className={styles.sectionHeadText}>Project Stream.</h2>
      </motion.div>

      <div className="mt-8 overflow-hidden rounded-3xl">
        <div className="carousel-track flex w-max gap-4 sm:gap-6">
          {loopProjects.map((project, index) => (
            <article
              key={`${project.id}-${index}`}
              className="relative min-h-[280px] w-[85vw] max-w-[620px] md:w-[46vw] lg:w-[44vw] overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8"
            >
              <div
                className={`absolute inset-0 opacity-70 bg-gradient-to-br ${project.accent}`}
                aria-hidden="true"
              />
              <div className="relative z-10 flex h-full flex-col justify-between">
                <div className="space-y-3">
                  <p className="text-xs uppercase tracking-[0.35em] text-white/60">
                    {project.subtitle}
                  </p>
                  <h3 className="text-2xl sm:text-3xl text-white font-display">
                    {project.title}
                  </h3>
                </div>

                <div className="mt-6 flex flex-wrap gap-2 text-xs text-white/75">
                  {project.metrics.map((metric, metricIndex) => (
                    <span
                      key={`${project.id}-metric-${metricIndex}`}
                      className="rounded-full border border-white/20 px-3 py-1 font-mono"
                    >
                      {metric}
                    </span>
                  ))}
                </div>

                <div className="mt-4">
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex rounded-full border border-white/20 px-3 py-1.5 text-xs font-medium text-white/85 transition hover:text-white"
                  >
                    Open Project Link
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </>
  );
};

export default SectionWrapper(Works, "projects");
