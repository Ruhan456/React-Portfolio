import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import ResumeLinks from "./ResumeLinks";
import { profile } from "./portfolioData";

const focusAreas = ["Software", "Firmware", "Automation", "Mechanical Design"];

function Hero() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="hero-section" id="home">
      <motion.div
        className="hero-intro"
        initial={reduceMotion ? false : { opacity: 0, y: 24 }}
        animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: "easeOut" }}
      >
        <p className="eyebrow">Mechatronics Engineering / University of Waterloo</p>
        <h1>{profile.name}</h1>
        <p className="hero-lede">
          I build practical systems across software, firmware, automation, and mechanical design.
          My work usually sits where code meets hardware and where ideas need to survive real use.
        </p>

        <div className="hero-chip-row" aria-label="Focus areas">
          {focusAreas.map((area, index) => (
            <motion.span
              key={area}
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.18 + index * 0.06 }}
            >
              {area}
            </motion.span>
          ))}
        </div>

        <div className="hero-actions">
          <a className="primary-button" href="#showcase">
            View Projects
          </a>
          <a className="secondary-button" href={`mailto:${profile.email}`}>
            Contact
          </a>
          <a className="icon-link" href={profile.github} target="_blank" rel="noopener noreferrer">
            <img src="/images/github.png" alt="" />
            GitHub
          </a>
          <a className="icon-link" href={profile.linkedin} target="_blank" rel="noopener noreferrer">
            <img src="/images/linkedin.png" alt="" />
            LinkedIn
          </a>
        </div>

        <ResumeLinks />
      </motion.div>
    </section>
  );
}

export default Hero;
