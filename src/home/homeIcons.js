import React from "react";

const paths = {
  work: (
    <>
      <path d="M12 2.8 20 7.4v9.2l-8 4.6-8-4.6V7.4z" />
      <circle cx="12" cy="12" r="3.4" />
    </>
  ),
  experience: (
    <>
      <rect x="3" y="7.5" width="18" height="12" rx="1.5" />
      <path d="M8.5 7.5V5.2c0-.7.5-1.2 1.2-1.2h4.6c.7 0 1.2.5 1.2 1.2v2.3M3 12.5h18" />
    </>
  ),
  about: (
    <>
      <circle cx="12" cy="8.2" r="3.7" />
      <path d="M4.5 20.5c.9-3.9 3.8-6.2 7.5-6.2s6.6 2.3 7.5 6.2" />
    </>
  ),
  skills: (
    <>
      <rect x="6.5" y="6.5" width="11" height="11" rx="1.2" />
      <rect x="10" y="10" width="4" height="4" />
      <path d="M9.5 3v3.5M14.5 3v3.5M9.5 17.5V21M14.5 17.5V21M3 9.5h3.5M3 14.5h3.5M17.5 9.5H21M17.5 14.5H21" />
    </>
  ),
  places: (
    <>
      <circle cx="12" cy="12" r="8.6" />
      <ellipse cx="12" cy="12" rx="3.6" ry="8.6" />
      <path d="M3.6 9.2h16.8M3.6 14.8h16.8" />
    </>
  ),
  resume: (
    <>
      <path d="M6 3h8.5L19 7.5V21H6z" />
      <path d="M14.5 3v4.5H19M9 12h7M9 15.5h7M9 9h3" />
    </>
  ),
  contact: (
    <>
      <rect x="3" y="5.5" width="18" height="13" rx="1.5" />
      <path d="m3.6 6.4 8.4 6.6 8.4-6.6" />
    </>
  ),
};

export function CardIcon({ id, className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {paths[id]}
    </svg>
  );
}

export function ArrowIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M7 17 17 7M8.5 7H17v8.5" />
    </svg>
  );
}
