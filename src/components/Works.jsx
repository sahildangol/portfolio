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

      <div className="mt-12 overflow-hidden rounded-3xl">
        <div className="carousel-track flex w-max gap-6">
          {loopProjects.map((project, index) => (
            <article
              key={`${project.id}-${index}`}
              className="relative min-h-[420px] w-[85vw] max-w-[620px] md:w-[46vw] lg:w-[44vw] overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8 hover-card flex flex-col justify-between group"
            >
              <div
                className={`absolute inset-0 opacity-70 bg-gradient-to-br ${project.accent}`}
                aria-hidden="true"
              />
              <div className="relative z-10 flex h-full flex-col justify-between">
                <div className="space-y-4 pt-2">
                  <p className="text-xs uppercase tracking-[0.35em] text-[var(--cyan-accent)]/80 font-mono">
                    {project.subtitle}
                  </p>
                  <h3 className="text-2xl sm:text-3xl text-white font-display">
                    {project.title}
                  </h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {project.tags.map((tag, tagIndex) => (
                      <span
                        key={`${project.id}-tag-${tagIndex}`}
                        className="text-[10px] text-violet-300 bg-violet-500/10 px-2 py-0.5 rounded-full border border-violet-500/20"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
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

                <div className="mt-6 flex items-center gap-4 relative z-20">
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 backdrop-blur-md px-6 py-2.5 text-xs font-semibold text-[var(--text-primary)] hover:text-white transition-all shadow-sm"
                    >
                      View Project
                    </a>
                  )}
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
