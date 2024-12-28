import React from 'react';

function Navbar({ toggleTheme, isDarkMode }) {
    return (
        <nav className="navbar">
            <h1>Ruhan Bhavsar</h1>
            <div className="links">
                <a href="#home">About Me</a>
                <a href="#projects-title">Projects</a>
                <a href="#skills">Skills</a>
                <a href="#contact">Contact</a>
                <button onClick={toggleTheme} className="theme-toggle-btn">
                    {isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
                </button>
            </div>
        </nav>
    );
}

export default Navbar;
