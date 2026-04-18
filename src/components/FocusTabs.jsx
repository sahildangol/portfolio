import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { focusTabs } from "../constants";
import { container, item, textVariant } from "../utils/motion";
import { styles } from "../styles";
import { SectionWrapper } from "../hoc";

const FocusTabs = () => {
  const [activeId, setActiveId] = useState(focusTabs[0].id);
  const activeTab = useMemo(
    () => focusTabs.find((tab) => tab.id === activeId) || focusTabs[0],
    [activeId],
  );

  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText}>Focus Areas</p>
        <h2 className={styles.sectionHeadText}>Strategic Focus.</h2>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/70 sm:text-base">
          Core themes that shape how products are planned, built, and scaled.
        </p>
      </motion.div>

      <div className="mt-8 flex flex-wrap gap-3" role="tablist">
        {focusTabs.map((tab) => {
          const isActive = tab.id === activeId;
          return (
            <motion.button
              key={tab.id}
              type="button"
              onClick={() => setActiveId(tab.id)}
              id={`tab-${tab.id}`}
              className={`relative overflow-hidden rounded-full px-6 py-3 text-base sm:text-lg font-semibold transition ${
                isActive
                  ? "text-[#07111f]"
                  : "border border-white/20 text-white/70 hover:bg-white/5 hover:text-white"
              }`}
              role="tab"
              aria-selected={isActive}
              aria-pressed={isActive}
              aria-controls={`panel-${tab.id}`}
              whileHover={{ y: -2 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              {isActive && (
                <motion.span
                  layoutId="tab-indicator"
                  className="absolute inset-0 bg-gradient-to-r from-[var(--cyan-accent)] to-[#f8fafc]"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">{tab.label}</span>
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab.id}
          layout
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ type: "spring", stiffness: 240, damping: 28 }}
          id={`panel-${activeTab.id}`}
          role="tabpanel"
          aria-labelledby={`tab-${activeTab.id}`}
          className="glass-card mt-10 rounded-3xl border border-white/10 p-8 sm:p-10"
        >
          <motion.ul
            variants={container}
            initial="hidden"
            animate="show"
            className="grid gap-5 text-base sm:text-lg text-[var(--text-secondary)]"
          >
            {activeTab.points.map((point, index) => (
              <motion.li
                key={`${activeTab.id}-point-${index}`}
                variants={item}
                className="flex items-start gap-3"
              >
                <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[var(--cyan-accent)]/40 bg-[var(--cyan-accent)]/10 font-mono text-[10px] text-[var(--cyan-accent)]">
                  {index + 1}
                </span>
                <span>{point}</span>
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>
      </AnimatePresence>
    </>
  );
};

export default SectionWrapper(FocusTabs, "highlights");
