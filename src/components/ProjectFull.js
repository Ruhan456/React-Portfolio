import React, { useState } from 'react';
import projects from './projectsData';
import './Projects.css';

function Projects() {
    const [selectedProject, setSelectedProject] = useState(null);

    const openProject = (project) => {
        setSelectedProject(project);
    };

    const closeProject = () => {
        setSelectedProject(null);
    };

    return (
        <section id="projects" className="projects">
            <h2 id="projects-title">My Projects</h2>
            <div className="project-list">
                {projects.map((project) => (
                    <div key={project.id} className="project-card" onClick={() => openProject(project)}>
                        <img src={project.image} alt={project.title} className="project-image" />
                        <h3>{project.title}</h3>
                        <p>{project.description}</p>
                        <p><strong>Skills:</strong> {project.skills.join(', ')}</p>
                        <a href={project.link} target="_blank" rel="noopener noreferrer" className="project-link">
                            View Project
                        </a>
                    </div>
                ))}
            </div>
            {selectedProject && (
                <div className="project-modal" onClick={closeProject}>
                    <div className="project-modal-content" onClick={(e) => e.stopPropagation()}>
                        <span className="close-button" onClick={closeProject}>&times;</span>
                        <h2>{selectedProject.title}</h2>
                        <img src={selectedProject.image} alt={selectedProject.title} className="modal-image" />
                        <p>{selectedProject.description}</p>
                        <p><strong>Skills:</strong> {selectedProject.skills.join(', ')}</p>
                        {selectedProject.video && (
                            <video width="100%" height="auto" controls>
                                <source src={selectedProject.video} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        )}
                        <a href={selectedProject.link} target="_blank" rel="noopener noreferrer" className="project-link">
                            Visit Project
                        </a>
                    </div>
                </div>
            )}
        </section>
    );
}

export default Projects;
