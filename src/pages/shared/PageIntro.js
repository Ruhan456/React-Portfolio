import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import "./ui.css";
import "./PageIntro.css";

const FIELD_TAGS = new Set(["INPUT", "TEXTAREA", "SELECT"]);

function isTypingTarget(element) {
  if (!element) {
    return false;
  }
  return FIELD_TAGS.has(element.tagName) || element.isContentEditable;
}

export function useReveal(delay = 0) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return {};
  }

  return {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
  };
}

function PageIntro({
  title,
  lede,
  backTo = "/",
  backLabel = "Back to all cards",
  size = "display",
  children,
}) {
  const navigate = useNavigate();
  const titleMotion = useReveal(0.04);
  const ledeMotion = useReveal(0.12);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key !== "Escape" || event.defaultPrevented) {
        return;
      }
      if (isTypingTarget(document.activeElement)) {
        return;
      }
      navigate(backTo);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [backTo, navigate]);

  return (
    <header className="page-intro">
      <Link className="page-intro__back" to={backTo}>
        <span aria-hidden="true">←</span> {backLabel}
      </Link>
      <motion.h1 className={`page-intro__title page-intro__title--${size}`} {...titleMotion}>
        {title}
      </motion.h1>
      {lede && (
        <motion.p className="page-intro__lede" {...ledeMotion}>
          {lede}
        </motion.p>
      )}
      {children}
    </header>
  );
}

export default PageIntro;
