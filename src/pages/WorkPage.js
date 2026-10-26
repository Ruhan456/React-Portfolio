import React, { useCallback, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import CardCarousel from "../carousel/CardCarousel";
import { projects } from "../components/portfolioData";
import "./WorkPage.css";

const filters = [
  { id: "all", label: "All" },
  { id: "software", label: "Software" },
  { id: "mechanical", label: "Mechanical" },
];

const hues = {
  "heater-configurator": 24,
  "natural-disaster": 212,
  "robotic-hand": 340,
  "rescue-robot": 160,
  "emergency-responder": 262,
  "label-cutter": 44,
  "plate-roller": 196,
  "rework-nozzle": 12,
  "hand-crank": 132,
};

const tintFor = (project) => `hsl(${hues[project.id] ?? 24} 34% 22%)`;

const disciplineLabel = {
  software: "Software",
  mechanical: "Mechanical",
};

function ProjectCard({ project }) {
  return (
    <span className="project-card">
      <span className="project-card__head">
        <span className="project-card__title">{project.title}</span>
        <span className="project-card__type">{project.type}</span>
      </span>
      <span className="project-card__media">
        <img
          src={project.thumbnail || project.image}
          alt=""
          loading="lazy"
          draggable="false"
        />
      </span>
      <span className="project-card__foot">
        <span>{disciplineLabel[project.discipline]}</span>
        <span className="project-card__tools">{project.tools.slice(0, 2).join(", ")}</span>
      </span>
    </span>
  );
}

function WorkPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const requested = searchParams.get("project");

  const [filter, setFilter] = useState("all");

  const items = useMemo(
    () => (filter === "all" ? projects : projects.filter((project) => project.discipline === filter)),
    [filter]
  );

  const initialIndex = Math.max(0, items.findIndex((project) => project.slug === requested));

  const handleActive = useCallback(
    (project) => {
      setSearchParams(
        (params) => {
          if (params.get("project") === project.slug) return params;
          const next = new URLSearchParams(params);
          next.set("project", project.slug);
          return next;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  return (
    <main className="work-page">
      <header className="work-page__intro">
        <div className="work-page__heading">
          <h1>Selected work</h1>
          <p>Firmware, robotics, factory tooling and software, built at work, at school and on my own.</p>
        </div>
        <div className="work-page__filters" role="group" aria-label="Filter projects">
          {filters.map((option) => (
            <button
              key={option.id}
              type="button"
              className={filter === option.id ? "is-active" : undefined}
              aria-pressed={filter === option.id}
              onClick={() => setFilter(option.id)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </header>

      <CardCarousel
        key={filter}
        className="work-page__carousel"
        label="Projects"
        items={items}
        initialIndex={initialIndex}
        getKey={(project) => project.id}
        getItemLabel={(project) => project.title}
        getTint={tintFor}
        getTailImage={(project) => project.thumbnail}
        openLabel="Open project"
        onActiveChange={handleActive}
        onOpen={(project) => navigate(`/work/${project.slug}`)}
        renderCard={(project) => <ProjectCard project={project} />}
      />
    </main>
  );
}

export default WorkPage;
