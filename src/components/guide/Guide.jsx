import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { guideChat, guideLines, guideSteps, profile, tourSections } from "../../constants";
import { answer } from "../../lib/answers";
import useActiveSection from "../../hooks/useActiveSection";
import { scrollToSection } from "../../lib/scroll";
import { setSfxEnabled, sfx, sfxEnabled } from "../../lib/sfx";

const GuideStage = lazy(() => import("./GuideStage"));
import GuideChat from "./GuideChat";
import { LogoMark } from "../brand/Logo";

const useMedia = (query) => {
  const [match, setMatch] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setMatch(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, [query]);
  return match;
};

const hasWebGL = () => {
  try {
    const c = document.createElement("canvas");
    return Boolean(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
};

const announceLanded = () => {
  if (window.__guideLanded) return;
  window.__guideLanded = true;
  window.dispatchEvent(new Event("guide:landed"));
};

const clock = () => performance.now() / 1000;

const goToContact = () => {
  scrollToSection("contact");
  setTimeout(() => document.querySelector('#contact-form input[name="name"]')?.focus({ preventScroll: true }), 1300);
};

/**
 * The 3D guide: descends into the hero, walks to each section, points at the content, talks
 * (a short line in a bubble beside his head), and invites visitors to message Sahil.
 */
export default function Guide() {
  const section = useActiveSection(tourSections);
  const isMobile = useMedia("(max-width: 1023px)");
  const reducedMotion = useMedia("(prefers-reduced-motion: reduce)");
  const [webgl] = useState(hasWebGL);
  const [failed, setFailed] = useState(false);
  const [landed, setLanded] = useState(false);
  const [gesture, setGesture] = useState(null);
  const [say, setSay] = useState(null); // { text, cta, id }
  const [talking, setTalking] = useState(false);
  const [sound, setSound] = useState(sfxEnabled);
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);
  const [asked, setAsked] = useState([]);
  const hideTimer = useRef(0);
  const chatOpenRef = useRef(false);
  chatOpenRef.current = chatOpen;
  const talkTimer = useRef(0);

  const speak = useCallback((text, { cta = false } = {}) => {
    clearTimeout(hideTimer.current);
    clearTimeout(talkTimer.current);
    setSay({ text, cta, id: clock() });
    setTalking(true);
    talkTimer.current = setTimeout(() => setTalking(false), Math.min(600 + text.length * 45, 3200));
    sfx.pop();
  }, []);

  useEffect(
    () => () => {
      clearTimeout(hideTimer.current);
      clearTimeout(talkTimer.current);
    },
    [],
  );

  // Without a 3D guide (or with reduced motion) the hero reveals immediately.
  useEffect(() => {
    if (!webgl || failed || reducedMotion) announceLanded();
  }, [webgl, failed, reducedMotion]);

  // Each new section: he nods, says a line about it, and (at Contact) asks for a message.
  const step = guideSteps.find((s) => s.section === section) || guideSteps[0];
  const lastSection = useRef(section);
  useEffect(() => {
    if (!landed || lastSection.current === section) return;
    lastSection.current = section;
    sfx.whoosh();
    if (section === "hero") {
      setSay(null);
      return;
    }
    setGesture({ type: step.cta ? "wave" : "nod", at: clock() + 0.5 });
    if (step.say && !chatOpenRef.current) speak(step.say, { cta: step.cta });
  }, [section, landed, step, speak]);

  const onLanded = () => {
    setLanded(true);
    announceLanded();
    sfx.chime();
    setGesture({ type: "wave", at: clock() });
    if (section === "hero") speak(guideLines.greeting);
  };

  const openChat = () => {
    clearTimeout(hideTimer.current);
    setSay(null);
    setChatOpen(true);
    setMessages((m) => (m.length ? m : [{ from: "guide", text: guideChat.intro }]));
    setGesture({ type: "wave", at: clock() });
    sfx.pop();
  };

  // A question from the visitor: show it, "type" for a moment, answer, and walk to the section.
  const ask = (question) => {
    if (!chatOpenRef.current) openChat();
    setAsked((a) => [...a, question]);
    setMessages((m) => [...m, { from: "you", text: question }]);
    setTyping(true);
    setTimeout(() => {
      const res = answer(question);
      setTyping(false);
      setMessages((m) => [...m, { from: "guide", text: res.answer, cta: res.cta }]);
      setTalking(true);
      clearTimeout(talkTimer.current);
      talkTimer.current = setTimeout(() => setTalking(false), Math.min(600 + res.answer.length * 40, 3600));
      setGesture({ type: res.id === "hello" || res.id === "thanks" ? "wave" : "nod", at: clock() });
      sfx.pop();
      if (res.go && res.go !== section) setTimeout(() => scrollToSection(res.go), 450);
    }, 650);
  };

  const onCta = (kind) => {
    if (kind === "cv") window.open(profile.cvUrl, "_blank", "noopener");
    if (kind === "contact") {
      if (isMobile) setChatOpen(false);
      goToContact();
    }
  };

  const onClick = () => openChat();

  const toggleSound = () => {
    const next = !sound;
    setSfxEnabled(next);
    setSound(next);
    if (next) sfx.pop();
  };

  const suggestions = (guideChat.suggestions[section] || guideChat.suggestions.hero).filter((q) => !asked.includes(q));
  const pose = section === "hero" && !landed ? "descend" : step.pose;
  // On phones the guide belongs to the hero only, so it never sits on top of the content.
  const hidden = isMobile && section !== "hero";

  const show3d = webgl && !failed;

  return (
    <>
      {show3d && (
        <div className="guide-layer" aria-hidden="true" style={{ opacity: hidden ? 0 : 1 }}>
          <Suspense fallback={null}>
            <GuideStage
              section={section}
              pose={pose}
              gesture={gesture}
              talking={talking}
              isMobile={isMobile}
              reducedMotion={reducedMotion}
              paused={hidden}
              onLanded={onLanded}
              onClick={onClick}
              onFail={() => setFailed(true)}
            />
          </Suspense>
        </div>
      )}

      {/* What he says: a small bubble beside his head */}
      <AnimatePresence>
        {say && !hidden && !chatOpen && (
          <motion.div
            key={say.id}
            role="status"
            initial={{ opacity: 0, scale: 0.9, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ type: "spring", stiffness: 380, damping: 26 }}
            className="guide-say"
          >
            <div className="mb-2 flex items-center gap-2">
              <LogoMark size={20} />
              <span className="flex-1 text-xs font-bold text-ink">Sahil</span>
              <button
                type="button"
                onClick={() => setSay(null)}
                className="-mr-1.5 -mt-1 grid h-7 w-7 place-items-center rounded-full text-muted transition hover:bg-mist hover:text-ink"
                aria-label="Close message"
              >
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
                  <path d="M6 6l12 12M18 6 6 18" />
                </svg>
              </button>
            </div>
            <p>{say.text}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {say.cta && (
                <button type="button" onClick={goToContact} className="btn btn-grad !px-3.5 !py-1.5 !text-[0.78rem]">
                  Message me →
                </button>
              )}
              {suggestions.slice(0, say.cta ? 1 : 2).map((q) => (
                <button key={q} type="button" onClick={() => ask(q)} className="chat-chip">
                  {q}
                </button>
              ))}
            </div>
            <button type="button" onClick={openChat} className="mt-2.5 text-xs font-semibold text-violet hover:underline">
              Open chat →
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {chatOpen && (
          <GuideChat
            messages={messages}
            typing={typing}
            suggestions={suggestions}
            onAsk={ask}
            onClose={() => setChatOpen(false)}
            onCta={onCta}
          />
        )}
      </AnimatePresence>

      {!chatOpen && (
        <button type="button" onClick={openChat} className="chat-launcher" aria-label="Ask Sahil anything">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-sky" />
          </span>
          <span className="chat-launcher-label">Ask Sahil anything</span>
          <svg className="chat-launcher-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" />
          </svg>
        </button>
      )}

      <button
        type="button"
        onClick={toggleSound}
        className="sound-toggle"
        aria-pressed={sound}
        aria-label={sound ? "Turn sound effects off" : "Turn sound effects on"}
        title={sound ? "Sound on" : "Sound off"}
      >
        <svg
          viewBox="0 0 24 24"
          width="18"
          height="18"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M11 5 6 9H3v6h3l5 4V5z" />
          {sound ? (
            <>
              <path d="M15.5 8.5a5 5 0 0 1 0 7" />
              <path d="M18.5 5.5a9 9 0 0 1 0 13" />
            </>
          ) : (
            <path d="m16 9 5 6m0-6-5 6" />
          )}
        </svg>
      </button>
    </>
  );
}
