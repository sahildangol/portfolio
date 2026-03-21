import { useRef, useState } from "react";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";

import { styles } from "../styles";
import { EarthCanvas } from "./canvas";
import { SectionWrapper } from "../hoc";
import { slideIn } from "../utils/motion";
import { contactInfo } from "../constants";

const Contact = () => {
  const formRef = useRef();
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { target } = e;
    const { name, value } = target;

    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    emailjs
      .send(
        "service_bdnuyyf",
        "template_k80a008",
        {
          from_name: form.name,
          to_name: "Sahil",
          from_email: form.email,
          to_email: "dangolsahil2005@gmail.com",
          message: form.message,
        },
        "laoHISU5t80X4h04C",
      )
      .then(
        () => {
          setLoading(false);
          alert("Thank you. I will get back to you as soon as possible.");

          setForm({
            name: "",
            email: "",
            message: "",
          });
        },
        (error) => {
          setLoading(false);
          console.error(error);

          alert("Ahh, something went wrong. Please try again.");
        },
      );
  };

  return (
    <div className="xl:mt-12 flex xl:flex-row flex-col-reverse gap-12 overflow-hidden items-stretch">
      <motion.div
        variants={slideIn("left", "tween", 0.2, 1)}
        className="flex-[0.95] glass-card rounded-3xl p-8 sm:p-10 lg:p-12"
      >
        <div className="flex items-center gap-4 mb-2">
          <p className={styles.sectionSubText}>{contactInfo.sectionLabel}</p>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--green-accent)]/30 bg-[var(--green-accent)]/10 px-2.5 py-0.5 text-[11px] font-medium text-[var(--green-accent)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--green-accent)] animate-pulse"></span>
            Open for Freelance
          </span>
        </div>
        <h3 className="text-[var(--text-primary)] font-display font-bold text-4xl sm:text-5xl">
          {contactInfo.heading}
        </h3>
        <p className="mt-4 max-w-2xl text-sm sm:text-base text-white/70">
          {contactInfo.description}
        </p>
        <a
          href={`mailto:${contactInfo.email}`}
          className="mt-3 inline-block text-base text-violet-300"
        >
          {contactInfo.email}
        </a>

        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-7"
        >
          <label className="flex flex-col sm:col-span-1">
            <span className="text-[var(--text-primary)] font-medium mb-3 text-base">
              Your Name
            </span>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              autoComplete="name"
              required
              className="rounded-xl border border-white/5 bg-[var(--bg-primary)]/50 px-5 py-4 text-base text-[var(--text-primary)] outline-none placeholder:text-white/30 focus:border-[var(--cyan-accent)] focus:shadow-[0_0_15px_rgba(34,211,238,0.15)] transition-all"
            />
          </label>
          <label className="flex flex-col sm:col-span-1">
            <span className="text-[var(--text-primary)] font-medium mb-3 text-base">
              Your Email
            </span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              autoComplete="email"
              required
              className="rounded-xl border border-white/5 bg-[var(--bg-primary)]/50 px-5 py-4 text-base text-[var(--text-primary)] outline-none placeholder:text-white/30 focus:border-[var(--cyan-accent)] focus:shadow-[0_0_15px_rgba(34,211,238,0.15)] transition-all"
            />
          </label>
          <label className="flex flex-col sm:col-span-2">
            <span className="text-[var(--text-primary)] font-medium mb-3 text-base">
              Your Message
            </span>
            <textarea
              rows={6}
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Tell me about your project, role, or collaboration idea"
              required
              className="resize-none min-h-44 rounded-xl border border-white/5 bg-[var(--bg-primary)]/50 px-5 py-4 text-base text-[var(--text-primary)] outline-none placeholder:text-white/30 focus:border-[var(--cyan-accent)] focus:shadow-[0_0_15px_rgba(34,211,238,0.15)] transition-all"
            />
          </label>

          <div className="sm:col-span-2 flex flex-col sm:flex-row gap-4 mt-2">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1 bg-[var(--purple-primary)] text-white py-4 px-10 rounded-xl outline-none font-semibold shadow-[0_0_20px_rgba(167,139,250,0.3)] text-base disabled:opacity-70"
            >
              {loading ? "Sending..." : "Send Message"}
            </button>

            <a
              href={`mailto:${contactInfo.email}?subject=Meeting%20Request&body=Hi%20Sahil,%0A%0AI'd%20like%20to%20schedule%20a%20meeting%20with%20you.%20Are%20you%20available%20on...`}
              className="btn-secondary flex-1 inline-flex items-center justify-center border border-[var(--cyan-accent)]/50 bg-[var(--cyan-accent)]/10 text-[var(--cyan-accent)] py-4 px-10 rounded-xl outline-none font-semibold shadow-[0_0_20px_rgba(34,211,238,0.15)] text-base transition-all hover:bg-[var(--cyan-accent)] hover:text-[#0A0E1A]"
            >
              <span className="mr-2">📅</span> Schedule a Meeting
            </a>
          </div>
        </form>
      </motion.div>

      <motion.div
        variants={slideIn("right", "tween", 0.2, 1)}
        className="xl:flex-[0.75] xl:h-auto md:h-[560px] h-[360px]"
        aria-hidden="true"
      >
        <EarthCanvas />
      </motion.div>
    </div>
  );
};

export default SectionWrapper(Contact, "contact");
