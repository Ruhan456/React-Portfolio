import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { profile } from "./portfolioData";

function Navbar({ toggleTheme, isDarkMode }) {
  const location = useLocation();
  const navigate = useNavigate();

  const scrollToSection = (targetId) => {
    const section = document.getElementById(targetId);
    const navbarHeight = document.querySelector("nav")?.offsetHeight || 0;

    if (section) {
      window.scrollTo({
        top: section.getBoundingClientRect().top + window.scrollY - navbarHeight,
        behavior: "smooth",
      });
    }
  };

  const handleSectionNav = (event, targetId) => {
    event.preventDefault();

    if (location.pathname !== "/") {
      navigate({ pathname: "/", hash: `#${targetId}` });
      return;
    }

    scrollToSection(targetId);
  };

  return (
    <nav className="navbar">
      <a className="brand" href="/#home" onClick={(event) => handleSectionNav(event, "home")}>
        {profile.name}
      </a>
      <div className="links">
        <a href="/#showcase" onClick={(event) => handleSectionNav(event, "showcase")}>
          Work
        </a>
        <a href="/#experience" onClick={(event) => handleSectionNav(event, "experience")}>
          Experience
        </a>
        <a href="/#skills" onClick={(event) => handleSectionNav(event, "skills")}>
          Skills
        </a>
        <Link to="/pictures">Pictures</Link>
        <a href="/#contact" onClick={(event) => handleSectionNav(event, "contact")}>
          Contact
        </a>
        <button onClick={toggleTheme} className="theme-toggle-btn" type="button">
          {isDarkMode ? "Light" : "Dark"}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
