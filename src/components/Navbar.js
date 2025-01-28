import React from 'react';

function Navbar({ toggleTheme, isDarkMode }) {
    // Function to handle smooth scroll with offset
    const handleScrollToSection = (event, targetId) => {
    event.preventDefault();
    
    const section = document.getElementById(targetId);
    const navbarHeight = document.querySelector('nav').offsetHeight; // Adjust for navbar height

    // Scroll to the section with an offset for the navbar height
        window.scrollTo({
            top: section.offsetTop - navbarHeight,
            behavior: 'smooth'
        });
    };

    return (
        <nav className="navbar">
            <h1>Ruhan Bhavsar</h1>
            <div className="links">
            <a href="#home" onClick={(e) => handleScrollToSection(e, 'home')}>About me</a>
            <a href="#projects" onClick={(e) => handleScrollToSection(e, 'projects')}>Projects</a>
                <a href="#skills" onClick={(e) => handleScrollToSection(e, 'skills')}>Skills</a>
                <a href="#contact" onClick={(e) => handleScrollToSection(e, 'contact')}>Contact</a>
                <button onClick={toggleTheme} className="theme-toggle-btn">
                    {isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
                </button>
            </div>
        </nav>
    );
}

export default Navbar;
