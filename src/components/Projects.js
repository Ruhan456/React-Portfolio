import React from 'react';
import projects from './projectsData';
import './Projects.css';

function Projects() {
    return (
        <section id="projects" className="projects">
            <h2 id = "projects-title">My Projects</h2>
            <div className="project-list">
                {projects.map((project) => (
                    <div key={project.id} className="project-card">
                    <img src={project.image} alt={project.title} className="project-image" />
                    <h3>{project.title}</h3>
                    <p>{project.description}</p>
                    {project.video && (
                        <video width="100%" height="auto" controls className="project-video">
                            <source src={project.video} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    )}
                    <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="project-link"
                    >
                        View Project
                    </a>
                </div>
                ))}
            </div>
        </section>
    );
}

export default Projects;
