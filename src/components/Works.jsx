import { motion } from "framer-motion";

import { styles } from "../styles";
import { featuredProjects, profile } from "../constants";
import { SectionWrapper } from "../hoc";
import { container, item, textVariant } from "../utils/motion";

const github = profile.socialLinks.find((l) => l.id === "github");

const Works = () => (
  <>
    <motion.div variants={textVariant()}>
      <p className={styles.sectionSubText}>Projects</p>
      <h2 className={`${styles.sectionHeadText} mt-3`}>Things I've built.</h2>
    </motion.div>

    <motion.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      className="mt-12 grid gap-4 sm:grid-cols-2"
    >
      {featuredProjects.map((p) => (
        <motion.article key={p.id} variants={item} className="card card-hover flex flex-col p-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-violet">{p.subtitle}</p>
          <h3 className="mt-3 font-display text-2xl font-bold leading-tight">{p.title}</h3>
          <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{p.description}</p>
          <ul className="mt-5 flex flex-wrap gap-1.5">
            {p.tags.map((tag) => (
              <li key={tag} className="chip !text-[11px]">
                {tag}
              </li>
            ))}
          </ul>
          <div className="mt-5 flex gap-5 border-t border-line pt-4 text-sm font-semibold">
            {p.url && (
              <a href={p.url} target="_blank" rel="noopener noreferrer" className="text-ink hover:text-violet">
                See it →
              </a>
            )}
            {p.github && (
              <a href={p.github} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-ink">
                Code
              </a>
            )}
          </div>
        </motion.article>
      ))}
    </motion.div>

    {github && (
      <a
        href={github.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-block text-sm text-muted underline-offset-4 hover:text-ink hover:underline"
      >
        More on GitHub →
      </a>
    )}
  </>
);

export default SectionWrapper(Works, "projects");
