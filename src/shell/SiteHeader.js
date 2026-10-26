import React from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { profile } from "../components/portfolioData";
import "./SiteHeader.css";

const links = [
  { to: "/work", label: "Work" },
  { to: "/experience", label: "Experience" },
  { to: "/about", label: "About" },
];

function SiteHeader() {
  const { pathname } = useLocation();

  return (
    <header className={`site-header${pathname === "/" ? " site-header--home" : ""}`}>
      <Link className="site-header__wordmark" to="/">
        {profile.name}
      </Link>
      <nav className="site-header__links" aria-label="Main">
        {links.map((link) => (
          <NavLink key={link.to} to={link.to}>
            {link.label}
          </NavLink>
        ))}
        <NavLink className="site-header__action" to="/contact">
          Contact
        </NavLink>
      </nav>
    </header>
  );
}

export default SiteHeader;
