import React, { useState } from "react";
import { motion } from "framer-motion";
import PageIntro, { useReveal } from "./shared/PageIntro";
import { profile } from "../components/portfolioData";
import "./ResumePage.css";

const resumes = profile.resumes.map((resume) => {
  const name = resume.label.replace(/\s*resume$/i, "");
  return {
    ...resume,
    name,
    id: name.toLowerCase(),
    fileName: resume.href.split("/").pop(),
  };
});

function ResumePage() {
  const [selectedId, setSelectedId] = useState(resumes[0]?.id);
  const selected = resumes.find((resume) => resume.id === selectedId) || resumes[0];
  const listMotion = useReveal(0.2);
  const previewMotion = useReveal(0.3);

  return (
    <main className="page resume-page">
      <PageIntro
        title="Resume"
        lede={`Three versions of the same engineer: ${resumes
          .map((resume) => resume.name.toLowerCase())
          .join(", ")
          .replace(/, ([^,]*)$/, " and $1")}. Pick the one that fits the role.`}
      />

      <div className="page-body resume-layout">
        <motion.ul className="resume-choices" aria-label="Resume versions" {...listMotion}>
          {resumes.map((resume) => {
            const isSelected = resume.id === selected.id;
            return (
              <li key={resume.id} className={`resume-choice${isSelected ? " resume-choice--selected" : ""}`}>
                <h2 className="resume-choice__title">
                  <button
                    type="button"
                    className="resume-choice__select"
                    aria-pressed={isSelected}
                    onClick={() => setSelectedId(resume.id)}
                  >
                    {resume.name}
                  </button>
                </h2>
                <p className="resume-choice__note">For {resume.name.toLowerCase()} roles, as a PDF.</p>
                <div className="pill-row">
                  <a
                    className={`pill${isSelected ? " pill--accent" : ""}`}
                    href={resume.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open PDF<span className="visually-hidden"> of the {resume.label} in a new tab</span>
                  </a>
                  <a className="pill" href={resume.href} download={resume.fileName}>
                    Download<span className="visually-hidden"> the {resume.label}</span>
                  </a>
                </div>
              </li>
            );
          })}
        </motion.ul>

        <motion.figure className="resume-preview" {...previewMotion}>
          <iframe
            key={selected.href}
            src={`${selected.href}#view=FitH&toolbar=0`}
            title={`${selected.label} preview`}
          />
          <figcaption className="meta">
            Previewing the {selected.label.toLowerCase()}.
          </figcaption>
        </motion.figure>
      </div>
    </main>
  );
}

export default ResumePage;
