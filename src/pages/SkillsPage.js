import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import PageIntro, { useReveal } from "./shared/PageIntro";
import { projects, skillGroups } from "../components/portfolioData";
import "./SkillsPage.css";

function projectsUsing(skill) {
  const needle = skill.toLowerCase();
  return projects.filter((project) => project.tools.some((tool) => tool.toLowerCase() === needle));
}

function SkillGroup({ group, index }) {
  const motionProps = useReveal(0.16 + index * 0.06);
  const titleId = `skill-group-${group.title.toLowerCase()}`;

  return (
    <motion.section className="skill-group" aria-labelledby={titleId} {...motionProps}>
      <h2 id={titleId} className="skill-group__title">
        {group.title}
      </h2>
      <ul className="skill-group__list">
        {group.skills.map((skill) => {
          const used = projectsUsing(skill);
          return (
            <li key={skill}>
              <span className="skill-group__skill">{skill}</span>
              {used.length > 0 && (
                <span className="skill-group__used">
                  Used in{" "}
                  {used.map((project, usedIndex) => (
                    <React.Fragment key={project.slug}>
                      {usedIndex > 0 && ", "}
                      <Link to={`/work/${project.slug}`}>{project.title}</Link>
                    </React.Fragment>
                  ))}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </motion.section>
  );
}

function SkillsPage() {
  const total = skillGroups.reduce((sum, group) => sum + group.skills.length, 0);

  return (
    <main className="page skills-page">
      <PageIntro
        title="Skills"
        lede={`${total} languages, chips and tools across software, embedded, mechanical work and the kit that holds it together.`}
      />
      <div className="page-body skills-groups">
        {skillGroups.map((group, index) => (
          <SkillGroup group={group} index={index} key={group.title} />
        ))}
      </div>
    </main>
  );
}

export default SkillsPage;
