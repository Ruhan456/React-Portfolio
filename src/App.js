import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import Home from "./components/Home";
import Skills from "./components/Skills"
import Footer from "./components/footer"
import "./App.css";

function App() {
    const [darkMode, setDarkMode] = useState(true);

    const toggleTheme = () => {
        setDarkMode(!darkMode);
    };

    useEffect(() => {
        document.body.className = darkMode ? "dark" : "light";
    }, [darkMode]);

    return (
        <div className={`App ${darkMode ? "dark" : "light"}`}>
            <Navbar toggleTheme={toggleTheme} isDarkMode={darkMode} />
            <div className="main-content">
                <div id="Home">
                    <Home darkMode={darkMode} />
                </div>
                <hr className="section-divider" id="project-line" />
                <div id="projects">
                    <Projects />
                </div>
                <hr className="section-divider" />
                <div id="Skills">
                    <Skills />
                </div>
                <hr className="section-divider" />
                <div id="contact">
                    <Contact />
                </div>
                <hr className="foot"/>
                <Footer />

            </div>
        </div>
    );
}

export default App;
