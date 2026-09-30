import React from 'react';
import { motion } from "framer-motion";
import { skillGroups } from "./portfolioData";

function Skills() {
    return (
        <section id="skills" className="section-shell skills-section">
            <div className="section-heading">
                <p className="eyebrow">Skills</p>
                <h2>Grouped by the way the work actually gets built.</h2>
            </div>
            <div className="skill-grid">
                {skillGroups.map((group, index) => (
                    <motion.article
                        className="skill-card"
                        key={group.title}
                        initial={{ opacity: 0, y: 18 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.4 }}
                        transition={{ duration: 0.4, delay: index * 0.06 }}
                    >
                        <h3>{group.title}</h3>
                        <div className="tool-list">
                            {group.skills.map((skill) => (
                                <span key={skill}>{skill}</span>
                            ))}
                        </div>
                    </motion.article>
                ))}
            </div>
        </section>
    );
}

export default Skills;
