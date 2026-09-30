import React, { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { experiences } from "./portfolioData";

function Experience() {
  const [openId, setOpenId] = useState(experiences[0].company);
  const reduceMotion = useReducedMotion();

  return (
    <section className="section-shell experience-section" id="experience">
      <div className="section-heading">
        <p className="eyebrow">Experience</p>
        <h2>Production internships, firmware work, and engineering teams.</h2>
      </div>

      <div className="experience-list">
        {experiences.map((experience, index) => {
          const isOpen = openId === experience.company;

          return (
            <motion.article
              className={`experience-card ${isOpen ? "open" : ""}`}
              key={experience.company}
              initial={reduceMotion ? false : { opacity: 0, y: 14 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.35, delay: index * 0.06 }}
            >
              <button
                className="experience-toggle"
                type="button"
                aria-expanded={isOpen}
                aria-controls={`experience-${index}`}
                onClick={() => setOpenId(isOpen ? null : experience.company)}
              >
                <span className="experience-badge">
                  {experience.logo ? (
                    <img src={experience.logo} alt="" aria-hidden="true" />
                  ) : (
                    experience.badge
                  )}
                </span>
                <span className="experience-title-block">
                  <strong>{experience.role}</strong>
                  <small>{experience.company}</small>
                </span>
                <span className="experience-date">{experience.period}</span>
                <span className="chevron" aria-hidden="true" />
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    className="experience-details"
                    id={`experience-${index}`}
                    initial={reduceMotion ? false : { height: 0, opacity: 0 }}
                    animate={reduceMotion ? undefined : { height: "auto", opacity: 1 }}
                    exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="experience-details-inner">
                      <p>{experience.location}</p>
                      <ul>
                        {experience.highlights.map((highlight) => (
                          <li key={highlight}>{highlight}</li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}

export default Experience;
