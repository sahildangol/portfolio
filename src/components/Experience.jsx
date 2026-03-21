import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import { motion } from "framer-motion";
import "react-vertical-timeline-component/style.min.css";
import { styles } from "../styles";
import { experiences } from "../constants";
import { SectionWrapper } from "../hoc";
import { textVariant } from "../utils/motion";

const ExperienceCard = ({ experience }) => (
  <VerticalTimelineElement
    className="vertical-timeline-element--work group"
    contentStyle={{
      background: "var(--bg-secondary)",
      color: "var(--text-primary)",
      border: "1px solid rgba(255,255,255,0.05)",
      boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
      borderRadius: "24px",
    }}
    contentArrowStyle={{ borderRight: "7px solid var(--bg-secondary)" }}
    date={experience.date}
    iconStyle={{ background: experience.iconBg }}
    icon={
      <div className="flex justify-center items-center w-full h-full">
        <img
          src={experience.icon}
          alt={experience.company_name}
          className="w-[60%] h-[60%] object-contain"
        />
      </div>
    }
  >
    <div>
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h3 className="text-[var(--text-primary)] text-xl sm:text-2xl font-display font-semibold group-hover:text-[var(--cyan-accent)] transition-colors">
          {experience.title}
        </h3>
        {experience.title.includes("Current") && (
          <span className="inline-flex rounded-full border border-[var(--green-accent)]/30 bg-[var(--green-accent)]/10 px-2.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--green-accent)]">
            Current
          </span>
        )}
      </div>
      <a
        href={experience.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[var(--purple-primary)] text-[15px] font-medium mt-1 inline-block"
      >
        {experience.company_name}
      </a>
    </div>
    <ul className="mt-6 list-disc ml-5 space-y-3">
      {experience.points.map((point, index) => (
        <li
          key={`${experience.id}-point-${index}`}
          className="text-[var(--text-secondary)] text-[14px] leading-[1.7] pl-1"
        >
          {point}
        </li>
      ))}
    </ul>
  </VerticalTimelineElement>
);
const Experience = () => {
  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText}>Career Timeline</p>
        <h2 className={styles.sectionHeadText}>Professional Experience.</h2>
      </motion.div>
      <div className="mt-20 flex flex-col">
        <VerticalTimeline>
          {experiences.map((experience) => (
            <ExperienceCard key={experience.id} experience={experience} />
          ))}
        </VerticalTimeline>
      </div>
    </>
  );
};

export default SectionWrapper(Experience, "experience");
