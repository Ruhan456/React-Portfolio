import React from "react";
import { profile } from "./portfolioData";

function ResumeLinks() {
  return (
    <div className="resume-links" aria-label="Resume downloads">
      {profile.resumes.map((resume) => (
        <a key={resume.href} href={resume.href} target="_blank" rel="noopener noreferrer">
          {resume.label}
        </a>
      ))}
    </div>
  );
}

export default ResumeLinks;
