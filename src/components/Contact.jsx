import { useState } from "react";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";

import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { textVariant } from "../utils/motion";
import { contactInfo } from "../constants";

const field =
  "rounded-xl border border-line bg-mist px-4 py-3 text-base text-ink outline-none transition placeholder:text-muted/60 focus:border-violet focus:bg-white";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus("sending");
    emailjs
      .send(
        "service_bdnuyyf",
        "template_k80a008",
        {
          from_name: form.name,
          to_name: "Sahil",
          from_email: form.email,
          to_email: contactInfo.email,
          message: form.message,
        },
        "laoHISU5t80X4h04C",
      )
      .then(
        () => {
          setStatus("sent");
          setForm({ name: "", email: "", message: "" });
        },
        (error) => {
          console.error(error);
          setStatus("error");
        },
      );
  };

  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText}>Contact</p>
        <h2 className={`${styles.sectionHeadText} mt-3`}>{contactInfo.heading}</h2>
        <p className="mt-5 max-w-xl text-[1.05rem] text-ink-2">{contactInfo.description}</p>
        <a href={`mailto:${contactInfo.email}`} className="mt-2 inline-block font-medium text-violet underline-offset-4 hover:underline">
          {contactInfo.email}
        </a>
      </motion.div>

      <form id="contact-form" onSubmit={handleSubmit} className="card mt-10 grid max-w-2xl gap-4 p-5 sm:grid-cols-2 sm:p-7">
        <label className="flex flex-col gap-2 text-sm font-medium text-ink">
          Name
          <input type="text" name="name" value={form.name} onChange={handleChange} autoComplete="name" required className={field} />
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium text-ink">
          Email
          <input type="email" name="email" value={form.email} onChange={handleChange} autoComplete="email" required className={field} />
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium text-ink sm:col-span-2">
          Message
          <textarea
            rows={5}
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="A role, a project, or just hello"
            required
            className={`${field} resize-none`}
          />
        </label>
        <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
          <button
            type="submit"
            disabled={status === "sending"}
            className="btn btn-ink disabled:opacity-60"
          >
            {status === "sending" ? "Sending…" : "Send message"}
          </button>
          <p role="status" className="text-sm">
            {status === "sent" && <span className="text-[#2f7d4f]">Thanks! I'll get back to you soon.</span>}
            {status === "error" && (
              <span className="text-[#b4442c]">Something went wrong. Please email me directly.</span>
            )}
          </p>
        </div>
      </form>
    </>
  );
};

export default SectionWrapper(Contact, "contact");
