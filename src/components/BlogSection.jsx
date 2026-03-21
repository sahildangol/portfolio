import { motion } from "framer-motion";
import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { textVariant, fadeIn } from "../utils/motion";

const categories = ["AI/ML", "Full-Stack", "Project Breakdowns"];

const posts = [
  {
    id: "post-1",
    title: "Deploying RAG Architecture Effectively",
    category: "AI/ML",
    date: "Coming Soon",
    readTime: "5 min read",
    excerpt:
      "Looking deeply into the retrieval-augmented generation structure, focusing on vector searching and prompt injections...",
  },
  {
    id: "post-2",
    title: "Scaling Next.js Applications",
    category: "Full-Stack",
    date: "Coming Soon",
    readTime: "4 min read",
    excerpt:
      "Best practices and learned lessons while building and migrating high-traffic applications...",
  },
];

const BlogSection = () => {
  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText}>My Thoughts</p>
        <h2 className={styles.sectionHeadText}>Articles & Insights.</h2>
      </motion.div>

      <div className="mt-8 flex flex-wrap gap-2 mb-8">
        {categories.map((cat, index) => (
          <span
            key={index}
            className="px-4 py-1.5 rounded-full border border-white/10 text-xs text-white/70 bg-white/5 hover:bg-white/10 transition cursor-default"
          >
            {cat}
          </span>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {posts.map((post, index) => (
          <motion.article
            key={post.id}
            variants={fadeIn("up", "spring", index * 0.4, 0.75)}
            className="glass-card p-6 sm:p-8 rounded-2xl hover-card flex flex-col justify-between border-l-4 border-l-violet-500"
          >
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] tracking-widest uppercase text-violet-300 font-semibold">
                  {post.category}
                </span>
                <span className="text-[10px] text-white/50">
                  {post.readTime}
                </span>
              </div>
              <h3 className="text-xl text-white font-display mb-3 group-hover:text-violet-200 transition">
                {post.title}
              </h3>
              <p className="text-sm text-white/60 leading-relaxed max-w-sm mb-6">
                {post.excerpt}
              </p>
            </div>
            <div className="flex justify-between items-center mt-auto border-t border-white/10 pt-4">
              <span className="text-xs text-white/40">{post.date}</span>
              <button className="text-xs font-medium text-white hover:text-violet-300 transition">
                Read Article →
              </button>
            </div>
          </motion.article>
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(BlogSection, "blog");
