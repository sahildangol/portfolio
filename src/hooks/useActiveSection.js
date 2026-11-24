import { useEffect, useState } from "react";

/**
 * Returns the id of the section currently "in focus": the last section whose top
 * has crossed 55% of the viewport height. "hero" is active until then.
 */
const useActiveSection = (ids) => {
  const [active, setActive] = useState(ids[0]);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const line = window.innerHeight * 0.55;
      let current = ids[0];
      for (const id of ids) {
        const el = id === "hero" ? null : document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top < line) current = id;
      }
      // At the very bottom, the last section wins even if it is short.
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      if (atBottom) current = ids[ids.length - 1];
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [ids]);

  return active;
};

export default useActiveSection;
