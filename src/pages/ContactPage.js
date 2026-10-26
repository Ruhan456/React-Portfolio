import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";
import PageIntro, { useReveal } from "./shared/PageIntro";
import { profile } from "../components/portfolioData";
import "./ContactPage.css";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const EMPTY_FORM = { name: "", email: "", message: "" };

function validate(values) {
  const errors = {};
  if (!values.name.trim()) {
    errors.name = "Tell me your name.";
  }
  if (!values.email.trim()) {
    errors.email = "Add an email so I can reply.";
  } else if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = "That email address does not look complete.";
  }
  if (!values.message.trim()) {
    errors.message = "Write a short message.";
  }
  return errors;
}

function Field({ id, label, error, children }) {
  return (
    <div className={`contact-field${error ? " contact-field--invalid" : ""}`}>
      <label htmlFor={id}>{label}</label>
      {children}
      {error && (
        <p className="contact-field__error" id={`${id}-error`}>
          {error}
        </p>
      )}
    </div>
  );
}

function ContactPage() {
  const [values, setValues] = useState(EMPTY_FORM);
  const [attempted, setAttempted] = useState(false);
  const [status, setStatus] = useState("idle");
  const [submitError, setSubmitError] = useState("");
  const [lastSent, setLastSent] = useState(EMPTY_FORM);
  const emailMotion = useReveal(0.2);
  const formMotion = useReveal(0.28);

  const errors = validate(values);
  const visibleError = (field) => (attempted ? errors[field] : undefined);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    if (status === "success" || status === "error") {
      setStatus("idle");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setAttempted(true);

    if (Object.keys(errors).length > 0) {
      const firstInvalid = ["name", "email", "message"].find((field) => errors[field]);
      document.getElementById(`contact-${firstInvalid}`)?.focus();
      return;
    }

    setStatus("sending");
    setSubmitError("");

    const serviceId = process.env.REACT_APP_EMAILJS_SERVICE_ID || "service_13kmb0r";
    const templateId = process.env.REACT_APP_EMAILJS_TEMPLATE_ID || "template_0g4516c";
    const publicKey = process.env.REACT_APP_EMAILJS_PUBLIC_KEY || "o9FE-bOAjK7sOSzAZ";
    const name = values.name.trim();
    const email = values.email.trim();
    const templateParams = {
      name,
      email,
      from_name: name,
      from_email: email,
      reply_to: email,
      to_email: profile.email,
      to_name: profile.name,
      message: values.message,
    };

    setLastSent(values);

    try {
      await emailjs.send(serviceId, templateId, templateParams, { publicKey });
      setValues(EMPTY_FORM);
      setAttempted(false);
      setStatus("success");
    } catch (error) {
      setStatus("error");
      setSubmitError(error?.text || error?.message || "EmailJS rejected this request.");
    }
  };

  const isSending = status === "sending";
  const fallbackHref = `mailto:${profile.email}?subject=${encodeURIComponent(
    `Portfolio contact from ${lastSent.name || "visitor"}`
  )}&body=${encodeURIComponent(lastSent.message)}`;

  const describedBy = (field) => (visibleError(field) ? `contact-${field}-error` : undefined);

  return (
    <main className="page contact-page">
      <PageIntro
        title="Let’s build useful systems."
        lede="Reach out for software, firmware, automation, manufacturing, or hybrid engineering roles."
      />

      <motion.section className="page-body contact-direct" aria-labelledby="contact-direct-title" {...emailMotion}>
        <h2 id="contact-direct-title" className="visually-hidden">
          Email
        </h2>
        <a className="contact-email" href={`mailto:${profile.email}`}>
          {profile.email}
        </a>
        <ul className="contact-elsewhere">
          <li>
            <a className="pill" href={profile.github} target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
          </li>
          <li>
            <a className="pill" href={profile.linkedin} target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
          </li>
          <li>
            <Link className="pill" to="/resume">
              Resume
            </Link>
          </li>
        </ul>
      </motion.section>

      <motion.section className="contact-form-section" aria-labelledby="contact-form-title" {...formMotion}>
        <div className="contact-form-section__intro">
          <h2 id="contact-form-title" className="section-title">
            Or send a message.
          </h2>
          <p>It goes straight to {profile.email}, so a reply comes from there.</p>
          <p className="meta">Based in {profile.location}.</p>
        </div>

        <form className="contact-form" onSubmit={handleSubmit} noValidate>
          <div className="contact-form__row">
            <Field id="contact-name" label="Name" error={visibleError("name")}>
              <input
                id="contact-name"
                name="name"
                type="text"
                autoComplete="name"
                value={values.name}
                onChange={handleChange}
                aria-invalid={Boolean(visibleError("name"))}
                aria-describedby={describedBy("name")}
                required
              />
            </Field>
            <Field id="contact-email" label="Email" error={visibleError("email")}>
              <input
                id="contact-email"
                name="email"
                type="email"
                autoComplete="email"
                inputMode="email"
                value={values.email}
                onChange={handleChange}
                aria-invalid={Boolean(visibleError("email"))}
                aria-describedby={describedBy("email")}
                required
              />
            </Field>
          </div>
          <Field id="contact-message" label="Message" error={visibleError("message")}>
            <textarea
              id="contact-message"
              name="message"
              rows="6"
              value={values.message}
              onChange={handleChange}
              aria-invalid={Boolean(visibleError("message"))}
              aria-describedby={describedBy("message")}
              required
            />
          </Field>

          <div className="contact-form__actions">
            <button className="pill pill--accent contact-form__submit" type="submit" disabled={isSending}>
              {isSending ? "Sending…" : "Send message"}
            </button>

            <div className="contact-form__status" aria-live="polite">
              {status === "success" && (
                <p className="contact-form__success" role="status">
                  Message sent. Thanks, I will get back to you soon.
                </p>
              )}
            </div>
          </div>

          {status === "error" && (
            <div className="contact-form__error" role="alert">
              <p>
                The message did not send. Email me directly at{" "}
                <a className="text-link" href={fallbackHref}>
                  {profile.email}
                </a>
                .
              </p>
              {submitError && <p className="meta">{submitError}</p>}
            </div>
          )}
        </form>
      </motion.section>
    </main>
  );
}

export default ContactPage;
