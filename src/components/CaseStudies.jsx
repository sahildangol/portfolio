import { motion } from "framer-motion";
import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { textVariant, fadeIn } from "../utils/motion";

const caseStudies = [
  {
    id: "case-1",
    title: "Coming Soon: High-Frequency Data Pipeline",
    problem: "Processing 1M+ events/min without data loss.",
    approach: "Decoupled ingestion with Kafka and batch processing.",
    solution: "A scalable microservice architecture.",
    results: "99.99% uptime, 50% reduction in processing cost.",
    learnings: "Monitoring at the ingestion layer is critical.",
  },
];

const CaseStudies = () => {
  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText}>Deep Dives</p>
        <h2 className={styles.sectionHeadText}>Case Studies.</h2>
      </motion.div>

      <div className="mt-12 flex flex-col gap-10">
        {caseStudies.map((study, index) => (
          <motion.div
            key={study.id}
            variants={fadeIn("up", "spring", index * 0.5, 0.75)}
            className="glass-card rounded-3xl p-8 sm:p-12 border border-white/10 hover-card"
          >
            <h3 className="text-3xl font-display text-white mb-6">
              {study.title}
            </h3>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h4 className="text-violet-300 font-semibold tracking-wider text-sm mb-2">
                    PROBLEM
                  </h4>
                  <p className="text-white/70 text-sm leading-relaxed">
                    {study.problem}
                  </p>
                </div>
                <div>
                  <h4 className="text-violet-300 font-semibold tracking-wider text-sm mb-2">
                    APPROACH
                  </h4>
                  <p className="text-white/70 text-sm leading-relaxed">
                    {study.approach}
                  </p>
                </div>
                <div>
                  <h4 className="text-violet-300 font-semibold tracking-wider text-sm mb-2">
                    SOLUTION
                  </h4>
                  <p className="text-white/70 text-sm leading-relaxed">
                    {study.solution}
                  </p>
                </div>
              </div>

              <div className="space-y-6 md:pl-8 md:border-l border-white/10">
                <div>
                  <h4 className="text-emerald-400 font-semibold tracking-wider text-sm mb-2">
                    RESULTS
                  </h4>
                  <p className="text-white/80 text-sm leading-relaxed font-medium">
                    {study.results}
                  </p>
                </div>
                <div>
                  <h4 className="text-sky-400 font-semibold tracking-wider text-sm mb-2">
                    LEARNINGS
                  </h4>
                  <p className="text-white/70 text-sm leading-relaxed">
                    {study.learnings}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
        {caseStudies.length === 0 && (
          <p className="text-white/50 italic text-sm">
            Case studies are currently being documented. Please check back
            later.
          </p>
        )}
      </div>
    </>
  );
};

export default SectionWrapper(CaseStudies, "case-studies");
