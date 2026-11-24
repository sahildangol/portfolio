import { motion } from "framer-motion";

import { profile } from "../constants";

const ease = [0.22, 0.61, 0.36, 1];
// Quick, staggered entrance that starts as soon as the page paints.
const line = (delay) => ({
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.1 + delay, ease } },
});

/**
 * Opening screen: name and role on the left, the guide descends onto the stage on the right.
 * The text appears straight away; it doesn't wait for the guide.
 */
const Hero = () => {

  return (
    <section id="hero" className="relative h-[100svh] min-h-[640px] w-full overflow-hidden">
      <div className="hero-bg" aria-hidden="true" />
      <div className="hero-stage" aria-hidden="true" />

      <div className="relative mx-auto flex h-full max-w-[96rem] flex-col justify-end px-5 pb-20 sm:px-8 lg:justify-center lg:px-12 lg:pb-0">
        <motion.div initial="hidden" animate="show" className="lg:max-w-[50vw]">
          <motion.p variants={line(0)} className="font-mono text-xs uppercase tracking-[0.3em] text-violet sm:text-sm">
            Hello, I'm
          </motion.p>

          <h1 className="hero-name mt-3 text-[3.6rem] sm:text-[5.5rem] lg:text-[clamp(4.5rem,7.2vw,8.5rem)]">
            <motion.span variants={line(0.05)} className="block">
              Sahil
            </motion.span>
            <motion.span variants={line(0.1)} className="block">
              Dangol<span className="text-sky">.</span>
            </motion.span>
          </h1>

          <motion.div variants={line(0.18)} className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="font-display text-xl font-bold uppercase tracking-[0.12em] text-grad sm:text-2xl">AI Engineer</span>
            <span className="hidden h-5 w-px bg-line sm:block" aria-hidden="true" />
            <span className="text-sm font-semibold text-ink-2 sm:text-base">{profile.specialties.join(" · ")}</span>
          </motion.div>

          <motion.p variants={line(0.24)} className="mt-4 max-w-lg text-base leading-relaxed text-muted sm:text-lg">
            {profile.tagline}
          </motion.p>

          <motion.div variants={line(0.3)} className="mt-8 flex flex-wrap gap-3">
            <a href="#engineering" className="btn btn-grad">
              Explore my work
            </a>
            <a href={profile.cvUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ink">
              View CV
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
