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
        "service_dvaev9l",
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
        <p className={styles.sectionSubText}>{contactInfo.sectionLabel}</p>
        <h3 className={styles.sectionHeadText}>{contactInfo.heading}</h3>
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
            <span className="text-white font-medium mb-3 text-base">
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
              className="rounded-xl border border-white/10 bg-white/5 px-5 py-4 text-base text-white outline-none placeholder:text-white/40 focus:border-violet-300/70"
            />
          </label>
          <label className="flex flex-col sm:col-span-1">
            <span className="text-white font-medium mb-3 text-base">
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
              className="rounded-xl border border-white/10 bg-white/5 px-5 py-4 text-base text-white outline-none placeholder:text-white/40 focus:border-violet-300/70"
            />
          </label>
          <label className="flex flex-col sm:col-span-2">
            <span className="text-white font-medium mb-3 text-base">
              Your Message
            </span>
            <textarea
              rows={6}
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Tell me about your project, role, or collaboration idea"
              required
              className="min-h-44 rounded-xl border border-white/10 bg-white/5 px-5 py-4 text-base text-white outline-none placeholder:text-white/40 focus:border-violet-300/70"
            />
          </label>

          <motion.button
            type="submit"
            className="sm:col-span-2 bg-violet-300 text-stealth-900 py-3.5 px-10 rounded-xl outline-none w-fit font-semibold shadow-glow text-base"
            whileHover={{ y: -2 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            {loading ? "Sending..." : "Send"}
          </motion.button>
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
