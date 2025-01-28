import React, { useState, useEffect } from 'react';
import projects from './projectsData';
import './Projects.css';

function Projects() {
    const [selectedProject, setSelectedProject] = useState(null);
    const [theme, setTheme] = useState('light'); // Default to light mode

    // Function to detect the current theme correctly
    const detectTheme = () => {
        if (document.body.classList.contains('dark')) {
            setTheme('dark');
        } else {
            setTheme('light');
        }
    };

    useEffect(() => {
        detectTheme(); // Set the initial theme on load

        // Observe changes to the `body` class to detect theme changes
        const observer = new MutationObserver(detectTheme);
        observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

        return () => observer.disconnect();
    }, []);

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
                    <div
                        key={project.id}
                        className="project-card"
                        onClick={() => openProject(project)}
                    >
                        <img src={project.image} alt={project.title} className="project-image" />
                        <h3>{project.title}</h3>
                        <p>{project.description}</p>

                        {/* Display skills on the project card */}
                        {project.skills && (
                            <div className="popup-skills">
                                <h3>Skills Used:</h3>
                                <ul>
                                    {project.skills.map((skill, index) => (
                                        <li key={index}>{skill}</li>
                                    ))}
                                </ul>
                        </div>
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

            {/* Popup (Now Correctly Themed) */}
            {selectedProject && (
                <div className={`fullscreen-popup ${theme === 'dark' ? 'dark-mode' : 'light-mode'}`}>
                    <div className="popup-content">
                        <span className="close-btn" onClick={closeProject}>
                            &times;
                        </span>
                        <h2>{selectedProject.title}</h2>

                        <div className="popup-body">
                            <img
                                src={selectedProject.image}
                                alt={selectedProject.title}
                                className="popup-image"
                            />

                            <div className="popup-info">
                                <p>{selectedProject.description}</p>

                                {selectedProject.video && (
                                    <video width="100%" controls className="popup-video">
                                        <source src={selectedProject.video} type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                )}

                                {selectedProject.skills && (
                                    <div className="popup-skills">
                                        <h3>Skills Used:</h3>
                                        <ul>
                                            {selectedProject.skills.map((skill, index) => (
                                                <li key={index}>{skill}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                <a
                                    href={selectedProject.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="popup-link"
                                >
                                    View Live Project
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section> 
    );
}

export default Projects;
