import React, { useState, useEffect } from 'react';
import projects from './projectsData';
import { motion, AnimatePresence } from 'framer-motion'; // If you don't have framer-motion, you can remove these imports
import './Projects.css';

function Projects() {
    const [selectedProject, setSelectedProject] = useState(null);
    const [theme, setTheme] = useState('light');

    // Function to detect the current theme
    const detectTheme = () => {
        if (document.body.classList.contains('dark')) {
            setTheme('dark');
        } else {
            setTheme('light');
        }
    };

    useEffect(() => {
        detectTheme(); // Set initial theme
        
        // Observer for theme changes
        const observer = new MutationObserver(detectTheme);
        observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
        
        return () => observer.disconnect();
    }, []);

    const openProject = (project) => {
        setSelectedProject(project);
        // Prevent scrolling when modal is open
        document.body.style.overflow = 'hidden';
    };

    const closeProject = () => {
        setSelectedProject(null);
        // Re-enable scrolling
        document.body.style.overflow = 'auto';
    };

    // Handle clicking outside the modal to close
    const handleModalBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            closeProject();
        }
    };

    return (
        <section id="projects" className="projects container">
            <h2 id="projects-title">My Projects</h2>
            
            <div className="project-list">
                {projects.map((project) => (
                    <motion.div
                        key={project.id}
                        className="project-card"
                        onClick={() => openProject(project)}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        whileHover={{ y: -10 }}
                    >
                        <div className="project-image-container">
                            <img 
                                src={project.image} 
                                alt={project.title} 
                                className="project-image" 
                            />
                        </div>
                        
                        <div className="project-content">
                            <h3>{project.title}</h3>
                            <p className="description">
                                {project.description.length > 120 
                                    ? `${project.description.substring(0, 120)}...` 
                                    : project.description}
                            </p>
                            
                            <div className="project-skills">
                                {project.skills && project.skills.slice(0, 3).map((skill, index) => (
                                    <span key={index} className="project-skill">{skill}</span>
                                ))}
                                {project.skills && project.skills.length > 3 && (
                                    <span className="project-skill">+{project.skills.length - 3}</span>
                                )}
                            </div>
                            
                            <div className="project-footer">
                                <a
                                    href={project.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="project-link"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    View Project →
                                </a>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Enhanced Project Modal/Popup */}
            <AnimatePresence>
                {selectedProject && (
                    <motion.div
                        className={`fullscreen-popup ${theme === 'dark' ? 'dark-mode' : 'light-mode'}`}
                        onClick={handleModalBackdropClick}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <motion.div 
                            className="popup-content"
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 50, opacity: 0 }}
                            transition={{ type: "spring", damping: 25 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <span className="close-btn" onClick={closeProject}>
                                &times;
                            </span>
                            
                            <h2>{selectedProject.title}</h2>
                            
                            <div className="popup-body">
                                <div>
                                    <img
                                        src={selectedProject.image}
                                        alt={selectedProject.title}
                                        className="popup-image"
                                    />
                                    
                                    {selectedProject.video && (
                                        <video controls className="popup-video">
                                            <source src={selectedProject.video} type="video/mp4" />
                                            Your browser does not support the video tag.
                                        </video>
                                    )}
                                </div>

                                <div className="popup-info">
                                    <p>{selectedProject.description}</p>
                                    
                                    {selectedProject.skills && (
                                        <div className="popup-skills">
                                            <h3>Technologies Used</h3>
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
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}

export default Projects;