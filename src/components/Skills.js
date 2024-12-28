import React from 'react';
import skill from './SkillData';
import './Skills.css';

function Skills() {
    return (
        <section id="skills" className="skills">
            <h2 id = "skills-title">Technical Skills</h2>
            <div className="project-list">
                {skill.map((skill) => (
                    <div key={skill.id} className="skill-card">
                            <img
                                src={skill.image}
                                alt={skill.title}
                                className="skill-image"
                            />
                    </div>
                ))}
            </div>
        </section>
    );
}

export default Skills;
