import React from "react";
import { Link, Navigate, useLocation, useParams } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { projects } from "./portfolioData";

function ProjectDetail() {
  const { slug } = useParams();
  const location = useLocation();
  const reduceMotion = useReducedMotion();
  const project = projects.find((item) => item.slug === slug);

  if (!project) {
    return <Navigate to="/" replace />;
  }

  const fromCategory = location.state?.fromCategory || project.discipline;
  const backPath = `/?category=${fromCategory}#showcase`;

  return (
    <article className="project-page">
      <motion.header
        className="project-page-hero"
        initial={reduceMotion ? false : { opacity: 0, y: 18 }}
        animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <Link className="back-link" to={backPath}>
          Back to projects
        </Link>
        <p className="eyebrow">{project.type}</p>
        <h1>{project.title}</h1>
        <p>{project.overview}</p>
        <div className="project-page-actions">
          {project.links.map((link) => (
            <a
              className="primary-button"
              href={link.href}
              key={link.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {link.label}
            </a>
          ))}
          {project.links.length === 0 && <span className="case-study-label">Case study project</span>}
        </div>
      </motion.header>

      <section className="project-page-media">
        <img
          className={project.featuredImageFit === "contain" ? "contain" : "cover"}
          src={project.image}
          alt={project.title}
        />
      </section>

      <section className="project-page-grid">
        <aside className="project-page-sidebar">
          <div className="impact-callout">{project.impact}</div>
          <div className="tool-list">
            {project.tools.map((tool) => (
              <span key={tool}>{tool}</span>
            ))}
          </div>
        </aside>

        <div className="project-page-sections">
          {project.sections.map((section) => (
            <section className="project-writeup-card" key={section.title}>
              <h2>{section.title}</h2>
              <p>{section.body}</p>
            </section>
          ))}
        </div>
      </section>

      <section className="project-gallery-section">
        <div className="section-heading">
          <p className="eyebrow">Gallery</p>
          <h2>Photos and stills</h2>
        </div>
        <div className="project-detail-gallery">
          {project.gallery.map((image) => (
            <img key={image} src={image} alt="" />
          ))}
        </div>
      </section>
    </article>
  );
}

export default ProjectDetail;
