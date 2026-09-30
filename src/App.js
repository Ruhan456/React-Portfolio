import React, { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Showcase from "./components/Showcase";
import Experience from "./components/Experience";
import Skills from "./components/Skills";
import Contact from "./components/Contact";
import ProjectDetail from "./components/ProjectDetail";
import PicturesPage from "./components/PicturesPage";
import "./App.css";

function PortfolioHome() {
  return (
    <>
      <Hero />
      <Showcase />
      <Experience />
      <Skills />
      <Contact />
    </>
  );
}

function ScrollToHash() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      window.setTimeout(() => {
        const target = document.querySelector(location.hash);
        if (target) {
          const navbarHeight = document.querySelector("nav")?.offsetHeight || 0;
          window.scrollTo({
            top: target.getBoundingClientRect().top + window.scrollY - navbarHeight,
            behavior: "smooth",
          });
        }
      }, 80);
      return;
    }

    window.scrollTo({ top: 0, behavior: "auto" });
  }, [location.pathname, location.hash]);

  return null;
}

function AppShell() {
  const [darkMode, setDarkMode] = useState(true);

  const toggleTheme = () => {
    setDarkMode((currentMode) => !currentMode);
  };

  useEffect(() => {
    document.body.className = darkMode ? "dark" : "light";
  }, [darkMode]);

  return (
    <div className={`App ${darkMode ? "dark" : "light"}`}>
      <Navbar toggleTheme={toggleTheme} isDarkMode={darkMode} />
      <main>
        <Routes>
          <Route path="/" element={<PortfolioHome />} />
          <Route path="/projects/:slug" element={<ProjectDetail />} />
          <Route path="/pictures" element={<PicturesPage isDarkMode={darkMode} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToHash />
      <AppShell />
    </BrowserRouter>
  );
}

export default App;
