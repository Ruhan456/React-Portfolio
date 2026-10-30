import React from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import PageIntro, { useReveal } from "./shared/PageIntro";
import { projects } from "../components/portfolioData";
import "./ProjectPage.css";

const DISCIPLINE_LABELS = {
  software: "Software",
  mechanical: "Mechanical",
};

function ProjectPage() {
  const { slug } = useParams();
  const index = projects.findIndex((item) => item.slug === slug);
  const project = projects[index];
  const metaMotion = useReveal(0.18);
  const mediaMotion = useReveal(0.26);

  if (!project) {
    return <Navigate to="/work" replace />;
  }

  const previous = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];
  const backTo = `/work?project=${project.slug}`;
  const extraPhotos = (project.gallery || []).filter((photo) => photo !== project.image);
  const fit = project.featuredImageFit === "contain" ? "contain" : "cover";

  return (
    <main className="page project-page" key={project.slug}>
      <PageIntro
        title={project.title}
        lede={project.overview}
        backTo={backTo}
        backLabel="Back to projects"
        size="large"
      >
        <motion.div className="project-page__meta" {...metaMotion}>
          <p>
            {project.type}
            <span className="project-page__discipline">
              {DISCIPLINE_LABELS[project.discipline] || project.discipline}
            </span>
          </p>
          {project.links.length > 0 && (
            <div className="pill-row">
              {project.links.map((link, linkIndex) => (
                <a
                  className={`pill${linkIndex === 0 ? " pill--accent" : ""}`}
                  href={link.href}
                  key={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View on {link.label}
                </a>
              ))}
            </div>
          )}
        </motion.div>
      </PageIntro>

      <motion.figure className={`project-page__media project-page__media--${fit}`} {...mediaMotion}>
        <img src={project.image} alt={`${project.title}, main view`} />
      </motion.figure>

      <section className="project-page__impact" aria-labelledby="project-impact-title">
        <h2 id="project-impact-title" className="visually-hidden">
          Impact
        </h2>
        <p>{project.impact}</p>
      </section>

      <div className="project-page__body">
        <div className="project-page__sections">
          {project.sections.map((section) => (
            <section className="project-page__section" key={section.title}>
              <h2>{section.title}</h2>
              <p>{section.body}</p>
            </section>
          ))}
        </div>

        <aside className="project-page__tools" aria-labelledby="project-tools-title">
          <h2 id="project-tools-title">Tools</h2>
          <ul>
            {project.tools.map((tool) => (
              <li key={tool}>{tool}</li>
            ))}
          </ul>
        </aside>
      </div>

      {extraPhotos.length > 0 && (
        <section className="project-page__gallery" aria-labelledby="project-gallery-title">
          <h2 id="project-gallery-title" className="section-title">
            More from the build
          </h2>
          <div className="project-page__gallery-grid">
            {extraPhotos.map((photo, photoIndex) => (
              <figure key={photo}>
                <img src={photo} alt={`${project.title}, view ${photoIndex + 2}`} loading="lazy" />
              </figure>
            ))}
          </div>
        </section>
      )}

      <nav className="project-page__pager" aria-label="More projects">
        <Link className="project-page__pager-link" to={`/work/${previous.slug}`}>
          <span className="meta">Previous project</span>
          <span className="project-page__pager-title">{previous.title}</span>
        </Link>
        <Link className="project-page__pager-link project-page__pager-link--next" to={`/work/${next.slug}`}>
          <span className="meta">Next project</span>
          <span className="project-page__pager-title">{next.title}</span>
        </Link>
      </nav>

      <p className="project-page__back">
        <Link className="text-link" to={backTo}>
          Back to all projects
        </Link>
      </p>
    </main>
  );
}

export default ProjectPage;
