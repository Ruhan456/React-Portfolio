import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import PageIntro, { useReveal } from "./shared/PageIntro";
import { experiences, profile } from "../components/portfolioData";
import "./AboutPage.css";

const focusAreas = [
  {
    title: "Software",
    body: "Full-stack web tools and applications in React, Flask and Python.",
  },
  {
    title: "Firmware",
    body: "Embedded C and C++ on STM32 and ESP32, validated with hardware-in-the-loop tests.",
  },
  {
    title: "Automation",
    body: "Configurators, test frameworks and machines that take repetitive work off people.",
  },
  {
    title: "Mechanical Design",
    body: "SolidWorks and AutoCAD parts, fixtures and production equipment, built and fabricated.",
  },
];

function joinNames(items) {
  if (items.length <= 1) {
    return items.join("");
  }
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

function AboutPage() {
  const [current, ...previous] = experiences;
  const bodyMotion = useReveal(0.2);
  const asideMotion = useReveal(0.28);
  const isOngoing = (item) => /present/i.test(item.period);
  const pastRoles = previous.filter((item) => !isOngoing(item)).map((item) => `${item.role} at ${item.company}`);
  const ongoingRoles = previous.filter(isOngoing).map((item) => `a ${item.role} with the ${item.company}`);

  return (
    <main className="page about-page">
      <PageIntro
        title="Code meets hardware."
        lede={`${profile.name} studies Mechatronics Engineering at the University of Waterloo and builds across software, firmware, automation and mechanical design.`}
      />

      <div className="page-body about-layout">
        <motion.section className="about-story" aria-labelledby="about-story-title" {...bodyMotion}>
          <h2 id="about-story-title" className="section-title">
            Practical systems that survive real use.
          </h2>
          <p>
            I build practical systems across software, firmware, automation, and mechanical
            design. From motor-control validation and vehicle firmware to production tooling and
            full-stack applications, my work sits where code meets hardware and ideas have to
            survive real use.
          </p>
          <p>
            Right now I am an {current.role} at {current.company}.
            {pastRoles.length > 0 && ` Before that I worked as ${joinNames(pastRoles)}.`}
            {ongoingRoles.length > 0 && ` Alongside school I am also ${joinNames(ongoingRoles)}.`}
          </p>
          <p>I am based in {profile.location}.</p>
        </motion.section>

        <motion.aside className="about-aside" {...asideMotion}>
          <section className="about-now" aria-labelledby="about-now-title">
            <h2 id="about-now-title">Now</h2>
            <p className="about-now__role">{current.role}</p>
            <p>
              {current.company}, {current.location}
            </p>
            <p className="meta">{current.period}</p>
            {current.highlights?.[0] && <p className="about-now__note">{current.highlights[0]}</p>}
          </section>

          <section className="about-links" aria-labelledby="about-links-title">
            <h2 id="about-links-title">Find me</h2>
            <ul>
              <li>
                <a className="text-link" href={profile.github} target="_blank" rel="noopener noreferrer">
                  GitHub
                </a>
              </li>
              <li>
                <a className="text-link" href={profile.linkedin} target="_blank" rel="noopener noreferrer">
                  LinkedIn
                </a>
              </li>
              <li>
                <a className="text-link" href={`mailto:${profile.email}`}>
                  {profile.email}
                </a>
              </li>
            </ul>
            <Link className="pill pill--accent" to="/resume">
              Read the resume
            </Link>
          </section>
        </motion.aside>
      </div>

      <section className="page-section about-focus" aria-labelledby="about-focus-title">
        <h2 id="about-focus-title" className="section-title">
          Focus
        </h2>
        <ul className="about-focus__list">
          {focusAreas.map((area) => (
            <li key={area.title}>
              <h3>{area.title}</h3>
              <p>{area.body}</p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

export default AboutPage;
