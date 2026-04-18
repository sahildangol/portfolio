import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { featuredProjects } from "../constants";
import { textVariant } from "../utils/motion";

const Works = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);

  const goToNext = () => {
    setDirection(1);
    setActiveIndex((previous) => (previous + 1) % featuredProjects.length);
  };

  const goToPrevious = () => {
    setDirection(-1);
    setActiveIndex(
      (previous) =>
        (previous - 1 + featuredProjects.length) % featuredProjects.length,
    );
  };

  useEffect(() => {
    if (isPaused) {
      return undefined;
    }

    const timer = setInterval(() => {
      setDirection(1);
      setActiveIndex((previous) => (previous + 1) % featuredProjects.length);
    }, 5200);

    return () => clearInterval(timer);
  }, [isPaused]);

  const activeProject = featuredProjects[activeIndex];

  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText}>Featured Projects</p>
        <h2 className={styles.sectionHeadText}>Selected Engineering Projects.</h2>
     
      </motion.div>

      <div
        className="relative mt-12"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <button
          type="button"
          onClick={goToPrevious}
          aria-label="Previous project"
          className="absolute left-0 top-1/2 z-20 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-[rgba(11,19,34,0.88)] text-xl text-white shadow-[0_10px_30px_rgba(2,8,23,0.45)] backdrop-blur sm:h-12 sm:w-12 sm:text-2xl"
        >
          &lt;
        </button>

        <button
          type="button"
          onClick={goToNext}
          aria-label="Next project"
          className="absolute right-0 top-1/2 z-20 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-[rgba(11,19,34,0.88)] text-xl text-white shadow-[0_10px_30px_rgba(2,8,23,0.45)] backdrop-blur sm:h-12 sm:w-12 sm:text-2xl"
        >
          &gt;
        </button>

        <div className="mx-auto max-w-4xl px-12 sm:px-16">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.article
              key={activeProject.id}
              custom={direction}
              initial={{ opacity: 0, x: direction > 0 ? 80 : -80, scale: 0.97 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: direction > 0 ? -80 : 80, scale: 0.97 }}
              transition={{ duration: 0.45, ease: [0.22, 0.61, 0.36, 1] }}
              className="glass-card relative rounded-3xl border border-white/15 p-6 sm:p-8"
            >
              <div
                className={`absolute inset-0 rounded-3xl bg-gradient-to-br opacity-65 ${activeProject.accent}`}
                aria-hidden="true"
              />

              <div className="relative z-10">
                <div className="inline-flex rounded-full border border-white/30 bg-[rgba(5,8,15,0.5)] px-3 py-1 font-mono text-[11px] uppercase tracking-[0.2em] text-white/90">
                  {activeProject.subtitle}
                </div>

                <h3 className="mt-5 font-display text-3xl leading-tight text-white sm:text-[2.2rem]">
                  {activeProject.title}
                </h3>

                <p className="mt-4 text-[1.01rem] leading-relaxed text-white/80">
                  {activeProject.description}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {activeProject.tags.slice(0, 4).map((tag, tagIndex) => (
                    <span
                      key={`${activeProject.id}-tag-${tagIndex}`}
                      className="rounded-full border border-[var(--cyan-accent)]/30 bg-[var(--cyan-accent)]/12 px-2.5 py-1 text-[11px] font-semibold text-[var(--cyan-accent)]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-6 flex flex-wrap gap-2 text-xs text-white/85">
                  {activeProject.metrics.map((metric, metricIndex) => (
                    <span
                      key={`${activeProject.id}-metric-${metricIndex}`}
                      className="rounded-full border border-white/30 px-3 py-1 font-mono"
                    >
                      {metric}
                    </span>
                  ))}
                </div>

                <div className="mt-7 flex flex-wrap items-center gap-3">
                  {activeProject.url && (
                    <a
                      href={activeProject.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-w-[154px] items-center justify-center rounded-full border border-[var(--cyan-accent)]/45 bg-[var(--cyan-accent)] px-5 py-2.5 text-sm font-bold text-[#052129] transition hover:brightness-95"
                    >
                      Live Demo
                    </a>
                  )}

                  {activeProject.github && (
                    <a
                      href={activeProject.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-w-[154px] items-center justify-center rounded-full border border-white/30 bg-white px-5 py-2.5 text-sm font-bold text-[#0b1322] transition hover:bg-white/90"
                    >
                      GitHub Link
                    </a>
                  )}
                </div>
              </div>
            </motion.article>
          </AnimatePresence>
        </div>

        <div className="mt-4 flex justify-center gap-2">
          {featuredProjects.map((project, index) => (
            <button
              key={`${project.id}-dot`}
              type="button"
              onClick={() => {
                setDirection(index > activeIndex ? 1 : -1);
                setActiveIndex(index);
              }}
              className={`h-2.5 rounded-full transition-all ${
                activeIndex === index
                  ? "w-9 bg-[var(--cyan-accent)]"
                  : "w-2.5 bg-white/35 hover:bg-white/60"
              }`}
              aria-label={`Go to ${project.title}`}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default SectionWrapper(Works, "projects");
