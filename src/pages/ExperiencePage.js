import React, { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import CardCarousel from "../carousel/CardCarousel";
import { experiences } from "../components/portfolioData";
import "./ExperiencePage.css";

const hues = {
  onsemi: 150,
  "MPI Morheat": 46,
  Vexos: 204,
  "Midnight Sun Solar Car Team": 22,
};

const tintFor = (experience) => `hsl(${hues[experience.company] ?? 24} 30% 21%)`;

const layoutTransition = { type: "spring", stiffness: 380, damping: 38, mass: 0.9 };

function Mark({ experience, size = "large" }) {
  return (
    <span className={`experience-mark experience-mark--${size}`} aria-hidden="true">
      {experience.logo ? (
        <img src={experience.logo} alt="" draggable="false" />
      ) : (
        <span className="experience-mark__badge">{experience.badge}</span>
      )}
    </span>
  );
}

function ExperienceCard({ experience, index, hidden }) {
  return (
    <motion.span
      className={`experience-card${hidden ? " is-lifted" : ""}`}
      layoutId={hidden ? undefined : `experience-${index}`}
      transition={layoutTransition}
      style={{ borderRadius: 10 }}
    >
      <span className="experience-card__head">
        <span className="experience-card__company">{experience.company}</span>
        <span className="experience-card__role">{experience.role}</span>
      </span>
      <Mark experience={experience} />
      <span className="experience-card__highlights">
        {experience.highlights.slice(0, 2).map((highlight) => (
          <span key={highlight} className="experience-card__highlight">
            {highlight}
          </span>
        ))}
      </span>
      <span className="experience-card__foot">
        <span>{experience.location}</span>
        <span>{experience.period}</span>
      </span>
    </motion.span>
  );
}

function ExperienceOverlay({ experience, index, onClose }) {
  const panelRef = useRef(null);
  const closeRef = useRef(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    closeRef.current?.focus({ preventScroll: true });

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;
      const focusable = panelRef.current.querySelectorAll(
        'button, [href], [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const lastNode = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        lastNode.focus();
      } else if (!event.shiftKey && document.activeElement === lastNode) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div className="experience-overlay">
      <motion.div
        className="experience-overlay__scrim"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.3 }}
        onClick={onClose}
      />
      <motion.div
        ref={panelRef}
        className="experience-overlay__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="experience-overlay-title"
        layoutId={`experience-${index}`}
        transition={reduceMotion ? { duration: 0 } : layoutTransition}
        style={{ "--card-tint": tintFor(experience), borderRadius: 10 }}
      >
        <motion.div
          className="experience-overlay__content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: reduceMotion ? 0 : 0.12, duration: 0.25 } }}
          exit={{ opacity: 0, transition: { duration: 0.1 } }}
        >
          <div className="experience-overlay__top">
            <Mark experience={experience} size="small" />
            <button
              ref={closeRef}
              type="button"
              className="experience-overlay__close"
              onClick={onClose}
              aria-label="Close"
            >
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <path d="m4 4 8 8M12 4l-8 8" />
              </svg>
            </button>
          </div>
          <h2 id="experience-overlay-title">{experience.company}</h2>
          <p className="experience-overlay__role">{experience.role}</p>
          <p className="experience-overlay__meta">
            {experience.period}, {experience.location}
          </p>
          <ul className="experience-overlay__list">
            {experience.highlights.map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>
        </motion.div>
      </motion.div>
    </div>
  );
}

function ExperiencePage() {
  const [openIndex, setOpenIndex] = useState(null);
  const returnFocusRef = useRef(null);

  const open = useCallback((experience, index) => {
    returnFocusRef.current = document.activeElement;
    setOpenIndex(index);
  }, []);

  const close = useCallback(() => setOpenIndex(null), []);

  return (
    <main className="experience-page">
      <header className="experience-page__intro">
        <h1>Experience</h1>
        <p>Internships and team roles across firmware, automation and manufacturing.</p>
      </header>

      <CardCarousel
        className="experience-page__carousel"
        label="Experience"
        items={experiences}
        getKey={(experience) => experience.company}
        getItemLabel={(experience) => `${experience.company}, ${experience.role}`}
        getTint={tintFor}
        openLabel="Show details"
        onOpen={open}
        renderCard={(experience, { index }) => (
          <ExperienceCard experience={experience} index={index} hidden={openIndex === index} />
        )}
      />

      <AnimatePresence
        onExitComplete={() => {
          returnFocusRef.current?.focus?.({ preventScroll: true });
          returnFocusRef.current = null;
        }}
      >
        {openIndex !== null && (
          <ExperienceOverlay
            key="overlay"
            experience={experiences[openIndex]}
            index={openIndex}
            onClose={close}
          />
        )}
      </AnimatePresence>
    </main>
  );
}

export default ExperiencePage;
