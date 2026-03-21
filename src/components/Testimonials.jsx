import { motion } from "framer-motion";
import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { textVariant, fadeIn } from "../utils/motion";

const testimonials = [
  {
    id: "test-1",
    name: "John Doe",
    title: "Senior Engineer",
    company: "Tech Corp",
    image: "",
    text: "Sahil's ability to architect scalable systems while keeping product goals in mind is exceptional.",
  },
  {
    id: "test-2",
    name: "Jane Smith",
    title: "Product Manager",
    company: "Innovate AI",
    image: "",
    text: "Working with Sahil guarantees a delivery that is not only on time but also extremely reliable and maintainable.",
  },
];

const Testimonials = () => {
  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText}>What Others Say</p>
        <h2 className={styles.sectionHeadText}>Testimonials.</h2>
      </motion.div>

      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={testimonial.id}
            variants={fadeIn("", "spring", index * 0.3, 0.75)}
            className="glass-card rounded-2xl p-8 flex flex-col justify-between hover-card border border-white/5"
          >
            <p className="text-white/80 text-sm italic leading-relaxed mb-6">
              "{testimonial.text}"
            </p>
            <div className="flex items-center gap-4 mt-auto">
              <div className="w-12 h-12 rounded-full border border-violet-500/30 overflow-hidden bg-white/5 flex items-center justify-center">
                {testimonial.image ? (
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <span className="text-white/40 text-xs text-center font-bold">
                    {testimonial.name[0]}
                  </span>
                )}
              </div>
              <div>
                <h4 className="text-white text-sm font-semibold">
                  {testimonial.name}
                </h4>
                <p className="text-white/50 text-xs">
                  {testimonial.title} @{" "}
                  <span className="text-violet-300">{testimonial.company}</span>
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(Testimonials, "testimonials");
