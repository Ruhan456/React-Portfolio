import { experiences, profile, projects } from "../components/portfolioData";

export const homeCards = [
  {
    id: "work",
    title: "Work",
    blurb: `${projects.length} projects across software, firmware and mechanical design.`,
    to: "/work",
    image: "/images/portfolio/thumbnails/robotic-hand.jpg",
  },
  {
    id: "experience",
    title: "Experience",
    blurb: `${experiences.length} roles, from solar car firmware to motor control.`,
    to: "/experience",
    image: "/images/MidSun.webp",
  },
  {
    id: "about",
    title: "About",
    blurb: "Mechatronics Engineering at the University of Waterloo.",
    to: "/about",
  },
  {
    id: "skills",
    title: "Skills",
    blurb: "Languages, hardware and tools I use day to day.",
    to: "/skills",
  },
  {
    id: "places",
    title: "Places",
    blurb: "Where I have studied and worked, on a globe.",
    to: "/places",
  },
  {
    id: "resume",
    title: "Resume",
    blurb: `${profile.resumes.length} versions: software, firmware and mechanical.`,
    to: "/resume",
  },
  {
    id: "contact",
    title: "Contact",
    blurb: profile.email,
    to: "/contact",
  },
];
