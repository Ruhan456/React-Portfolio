import React, { useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { projects } from "./portfolioData";

const filters = [
  { label: "Software + Firmware", value: "software" },
  { label: "Mechanical + Manufacturing", value: "mechanical" },
];

const validFilters = filters.map((filter) => filter.value);

const projectGridVariants = {
  enter: (direction) => ({
    opacity: 0,
    x: direction > 0 ? 90 : -90,
  }),
  center: {
    opacity: 1,
    x: 0,
  },
  exit: (direction) => ({
    opacity: 0,
    x: direction > 0 ? -90 : 90,
  }),
};

function Showcase() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const [slideDirection, setSlideDirection] = useState(1);
  const requestedCategory = searchParams.get("category");
  const activeFilter = validFilters.includes(requestedCategory) ? requestedCategory : "software";
  const visibleProjects = projects.filter((project) => project.discipline === activeFilter);

  const switchFilter = (filter) => {
    if (filter === activeFilter) {
      return;
    }

    setSlideDirection(validFilters.indexOf(filter) > validFilters.indexOf(activeFilter) ? 1 : -1);

    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("category", filter);
    navigate(
      {
        pathname: location.pathname,
        search: `?${nextParams.toString()}`,
        hash: location.hash,
      },
      { replace: true, preventScrollReset: true }
    );
  };

  return (
    <section className="section-shell showcase-section" id="showcase">
      <div className="section-heading">
        <p className="eyebrow">Selected Work</p>
        <h2>Engineering builds across code and hardware.</h2>
        <p>
          Explore software, firmware, automation, and mechanical projects with the context,
          tools, and measured results behind each build.
        </p>
      </div>

      <div className="segmented-control" aria-label="Project category">
        <span className={`segmented-indicator ${activeFilter}`} aria-hidden="true" />
        {filters.map((filter) => (
          <button
            className={activeFilter === filter.value ? "active" : ""}
            key={filter.value}
            onClick={() => switchFilter(filter.value)}
            type="button"
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className="project-grid-window">
        <AnimatePresence initial={false} mode="wait" custom={slideDirection}>
          <motion.div
            animate={reduceMotion ? undefined : "center"}
            className="project-grid"
            custom={slideDirection}
            exit={reduceMotion ? undefined : "exit"}
            initial={reduceMotion ? false : "enter"}
            key={activeFilter}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            variants={projectGridVariants}
          >
            {visibleProjects.map((project, index) => {
              const thumbnail = project.thumbnail || project.image;
              const thumbnailFit = project.thumbnail ? "cover" : project.featuredImageFit || "cover";
              const cardText = project.summary || project.overview;
              const truncatedText =
                cardText && cardText.length > 140
                  ? `${cardText.substring(0, 140).trim()}...`
                  : cardText;

              return (
                <motion.div
                  className="project-card-shell"
                  key={project.id}
                  initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                  animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                  transition={{ duration: 0.16, delay: index * 0.018 }}
                >
                  <Link
                    className="project-card-link"
                    to={`/projects/${project.slug}`}
                    state={{ fromCategory: activeFilter }}
                  >
                    <span className="project-image-frame">
                      <img
                        className={`project-card-image ${thumbnailFit === "contain" ? "contain" : "cover"}`}
                        src={thumbnail}
                        alt={project.title}
                      />
                    </span>
                    <span className="project-card-copy">
                      <span className="project-type-row">
                        <span className="project-type">{project.type}</span>
                        {project.links.length > 0 && <span className="github-indicator">GitHub</span>}
                      </span>
                      <strong>{project.title}</strong>
                      <small>{truncatedText}</small>
                      <span className="tool-list compact">
                        {project.tools.slice(0, 4).map((tool) => (
                          <span key={tool}>{tool}</span>
                        ))}
                      </span>
                      <span className="open-project">Open case study</span>
                    </span>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

export default Showcase;
