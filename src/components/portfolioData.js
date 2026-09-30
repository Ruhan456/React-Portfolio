export const profile = {
  name: "Ruhan Bhavsar",
  role: "Mechatronics Engineering student building automation, firmware, mechanical systems, and software tools.",
  location: "Waterloo, Ontario",
  email: "r5bhavsa@uwaterloo.ca",
  github: "https://github.com/Ruhan456",
  linkedin: "https://www.linkedin.com/in/ruhan-bhavsar-43a074292/",
  resumes: [
    {
      label: "Software Resume",
      href: "/resumes/RuhanBhavsarSWResume.pdf",
    },
    {
      label: "Mechanical Resume",
      href: "/resumes/RuhanBhavsarResume.pdf",
    },
  ],
};

export const projects = [
  {
    id: "heater-configurator",
    slug: "heater-configuration-tools",
    title: "Heater Configuration and Drawing Automation Tools",
    discipline: "software",
    type: "Industrial web tools",
    summary:
      "React configurators for flange, screwplug, and PTFE heaters that automate drawing generation and electrical design checks.",
    overview:
      "A collection of engineering web tools developed to automate product configuration, technical drawing generation, and electrical calculations for custom industrial heaters.",
    sections: [
      {
        title: "Configurator development",
        body: "Built three React-based configuration platforms for flange, screwplug, and PTFE heaters, translating user-defined design inputs into structured product configurations.",
      },
      {
        title: "Automated drawing generation",
        body: "Developed drawing-generation logic to automatically produce custom visual specifications from selected design parameters, enabling faster creation of customer proposal materials.",
      },
      {
        title: "Engineering utility tools",
        body: "Created a web-based resistance calculator for single-phase and three-phase heater systems to support electrical design checks and streamline engineering calculations during product selection.",
      },
    ],
    impact: "Reduced custom drawing generation from about 20 minutes to 1 minute.",
    tools: ["React", "JavaScript", "Engineering calculations", "Drawing automation"],
    image: "/images/portfolio/portfolio-07.png",
    thumbnail: "/images/portfolio/thumbnails/heater-configurator.jpg",
    gallery: ["/images/portfolio/portfolio-07.png"],
    featuredImageFit: "contain",
    links: [],
  },
  {
    id: "natural-disaster",
    slug: "natural-disaster-severity-mapping",
    title: "Natural Disaster Severity Mapping System",
    discipline: "software",
    type: "Full-stack AI platform",
    summary:
      "A React, Flask, MongoDB, and PyTorch disaster map for image upload, geolocation tagging, and AI-assisted severity classification.",
    overview:
      "A full-stack disaster response platform developed to analyze earthquake aftermath imagery and visualize disaster severity through an interactive geospatial interface.",
    sections: [
      {
        title: "AI-based severity classification",
        body: "Trained a ResNet34 image classification model using FastAI and PyTorch to analyze uploaded post-disaster images and estimate event severity from visual conditions.",
      },
      {
        title: "Interactive mapping and frontend development",
        body: "Built the user-facing application in React using React Router, TailwindCSS, and Mapbox, enabling image upload, geolocation tagging, and interactive visualization of earthquake events.",
      },
      {
        title: "Backend and platform infrastructure",
        body: "Developed a Flask-based backend with user authentication and API routing, with MongoDB used to manage user accounts and disaster event data.",
      },
    ],
    impact: "Trained a ResNet34 model to reach 95% accuracy on an 8,500-image dataset.",
    tools: ["React", "Flask", "MongoDB", "Mapbox", "PyTorch", "FastAI"],
    image: "/images/MapPhoto.jpg",
    thumbnail: "/images/portfolio/thumbnails/natural-disaster.jpg",
    gallery: ["/images/MapPhoto.jpg", "/images/portfolio/portfolio-10.png"],
    featuredImageFit: "cover",
    links: [
      {
        label: "GitHub",
        href: "https://github.com/Ruhan456/Natural-Disaster-Severity-Mapping",
      },
    ],
  },
  {
    id: "robotic-hand",
    slug: "robotic-hand",
    title: "Robotic Hand",
    discipline: "software",
    type: "Computer vision and embedded control",
    summary:
      "A 3D-printed robotic hand that translates live MediaPipe finger tracking into ESP32-controlled servo motion.",
    overview:
      "A robotic hand designed to replicate human finger motion through real-time vision-based gesture tracking and servo actuation.",
    sections: [
      {
        title: "Mechanical and actuation design",
        body: "Designed and 3D printed a robotic hand featuring six servo-driven fingers, with the mechanical structure optimized for controlled finger articulation and repeatable movement.",
      },
      {
        title: "Computer vision and motion tracking",
        body: "Developed a Python-based hand tracking system using MediaPipe to detect finger positions and classify states such as open, closed, and intermediate in real time.",
      },
      {
        title: "Embedded control and system integration",
        body: "Integrated the vision system with an ESP32-based control architecture to transmit finger position data and actuate the robotic hand in real time.",
      },
    ],
    impact: "Reached 45 ms end-to-end gesture-to-motion latency.",
    tools: ["Python", "MediaPipe", "ESP32", "PySerial", "3D printing"],
    image: "/images/portfolio/portfolio-08.png",
    thumbnail: "/images/portfolio/thumbnails/robotic-hand.jpg",
    gallery: ["/images/portfolio/portfolio-08.png"],
    featuredImageFit: "contain",
    links: [
      {
        label: "GitHub",
        href: "https://github.com/Ruhan456/Robotic-Hand",
      },
    ],
  },
  {
    id: "rescue-robot",
    slug: "rescue-robot",
    title: "Rescue Robot",
    discipline: "software",
    type: "Autonomous robotics",
    summary:
      "An EV3 rescue robot using DFS route planning, RobotC navigation, and mechanical pickup/drop-off for autonomous supply delivery.",
    overview:
      "An autonomous rescue delivery robot developed to transport supply packages efficiently through a constrained course environment with minimal travel time.",
    sections: [
      {
        title: "Autonomous path planning",
        body: "Implemented a depth-first search algorithm in C++ to evaluate navigation routes and determine efficient paths between pickup and delivery locations.",
      },
      {
        title: "Embedded navigation and control",
        body: "Programmed the robot in RobotC using motor encoders and sensor feedback to execute autonomous movement, navigate around obstacles, and perform repeatable path-following behavior.",
      },
      {
        title: "Mechanical system design",
        body: "Integrated the navigation, sensing, and mechanical subsystems into a complete rescue platform that reduced task completion time through optimized route planning and autonomous execution.",
      },
    ],
    impact: "Reduced task completion time by roughly 70% through route planning and autonomous execution.",
    tools: ["C++", "RobotC", "Lego EV3", "AutoCAD", "SolidWorks"],
    image: "/images/RescueBot.jpg",
    thumbnail: "/images/portfolio/thumbnails/rescue-robot.jpg",
    gallery: ["/images/RescueBot.jpg", "/images/portfolio/portfolio-09.png"],
    featuredImageFit: "cover",
    links: [
      {
        label: "GitHub",
        href: "https://github.com/AumkarMali/RescueRobot",
      },
    ],
  },
  {
    id: "emergency-responder",
    slug: "emergency-responder-bot",
    title: "Arduino Emergency Responder Bot",
    discipline: "software",
    type: "Hardware-connected web app",
    summary:
      "A Flask web app connected to Arduino hardware that ranks reported incidents by severity and displays prioritized emergency responses.",
    overview:
      "A web-to-hardware emergency response prototype that combines form input, severity ranking, and Arduino-connected physical output.",
    sections: [
      {
        title: "Reporting interface",
        body: "Built a web form for reporting crimes and emergencies with severity factors like victims, condition, and incident type.",
      },
      {
        title: "Hardware bridge",
        body: "Used PySerial to communicate between the Flask application and Arduino microcontroller output.",
      },
      {
        title: "Prioritization logic",
        body: "Designed the ranking logic to help surface urgent situations faster in a simple emergency response workflow.",
      },
    ],
    impact: "Connected web reporting, prioritization logic, and physical hardware output in one system.",
    tools: ["Python", "Flask", "Arduino", "PySerial", "HTML", "CSS", "JavaScript"],
    image: "/images/CrimeResponder.png",
    thumbnail: "/images/portfolio/thumbnails/emergency-responder.jpg",
    gallery: ["/images/CrimeResponder.png"],
    featuredImageFit: "contain",
    links: [
      {
        label: "GitHub",
        href: "https://github.com/Ruhan456/Emergency-Responder",
      },
    ],
  },
  {
    id: "label-cutter",
    slug: "automated-label-cutter",
    title: "Automated Label Cutter",
    discipline: "mechanical",
    type: "Low-cost production automation",
    summary:
      "A low-cost three-axis label cutter using stepper motors, 3D-printed parts, and STM32 control to reduce repetitive manual cutting.",
    overview:
      "A low-cost automated three-axis label cutting system developed to improve consistency, automate repetitive labor, and provide a compact alternative to manual processing.",
    sections: [
      {
        title: "Mechanical and motion system design",
        body: "Designed a three-axis motion system using stepper motors and custom 3D-printed components to control label positioning and cutting movement with repeatable accuracy.",
      },
      {
        title: "Embedded control development",
        body: "Programmed an STM32 microcontroller in C++ to coordinate motor movement and automate the cutting sequence for reliable multi-axis operation.",
      },
      {
        title: "Manufacturing impact",
        body: "Developed the system with a total cost under $500, providing a low-cost automation solution that reduced manual labor by approximately 5-10 hours per week.",
      },
    ],
    impact: "Built under $500 and saved 5-10 hours of manual labor per week.",
    tools: ["STM32", "C++", "Stepper motors", "3D printing", "Motion systems"],
    image: "/images/portfolio/portfolio-02.png",
    thumbnail: "/images/portfolio/thumbnails/label-cutter.jpg",
    gallery: ["/images/portfolio/portfolio-02.png"],
    featuredImageFit: "contain",
    links: [],
  },
  {
    id: "plate-roller",
    slug: "aluminum-plate-bending-roller",
    title: "Aluminum Plate Bending Roller",
    discipline: "mechanical",
    type: "Manufacturing equipment",
    summary:
      "A screw-driven plate bending roller fabricated from laser-cut steel to improve heater plate forming speed and repeatability.",
    overview:
      "A custom aluminum plate bending roller designed and fabricated to improve repeatable forming, reduce operator effort, and accommodate different heater plate curvature requirements.",
    sections: [
      {
        title: "Mechanical design and development",
        body: "Designed a screw-driven roller adjustment system that allows the top roller to move vertically, changing effective bending geometry and enabling formation of different plate radii.",
      },
      {
        title: "Manufacturing and fabrication",
        body: "Produced the structural and mechanical components using laser-cut steel parts, with each cut path customized in AutoCAD to meet design and assembly requirements.",
      },
      {
        title: "Production improvement",
        body: "Implemented the roller to improve plate forming accuracy, reduce manual labor, and significantly increase production speed compared to the previous forming method.",
      },
    ],
    impact: "Reduced forming time from 20 minutes to 5 minutes per plate.",
    tools: ["AutoCAD", "Laser-cut steel", "Welding", "Mechanical design"],
    image: "/images/portfolio/portfolio-03.png",
    thumbnail: "/images/portfolio/thumbnails/plate-roller.jpg",
    gallery: ["/images/portfolio/portfolio-03.png"],
    featuredImageFit: "contain",
    links: [],
  },
  {
    id: "rework-nozzle",
    slug: "rework-nozzle-redesign",
    title: "Rework Nozzle Redesign",
    discipline: "mechanical",
    type: "Design for manufacturing",
    summary:
      "An SMT rework nozzle redesign for local machining, controlled revision history, and shorter supplier lead times.",
    overview:
      "A rework nozzle redesign completed to improve cost, manufacturability, and sourcing flexibility for SMT manufacturing tooling.",
    sections: [
      {
        title: "Design for manufacturing",
        body: "Redesigned the nozzle in SolidWorks with a focus on preserving functional performance while modifying the geometry to better suit local machining processes.",
      },
      {
        title: "Engineering documentation and revision control",
        body: "Used SolidWorks PDM to manage design revisions and maintain controlled documentation throughout the redesign and implementation process.",
      },
      {
        title: "Measured production impact",
        body: "Reduced supplier lead time from approximately 6 weeks to 1 week and lowered per-unit cost by about $700, improving part availability for production.",
      },
    ],
    impact: "Cut supplier lead time from 6 weeks to 1 week and saved about $700 per unit.",
    tools: ["SolidWorks", "SolidWorks PDM", "DFM", "Technical documentation"],
    image: "/images/portfolio/portfolio-04.png",
    thumbnail: "/images/portfolio/thumbnails/rework-nozzle.jpg",
    gallery: ["/images/portfolio/portfolio-04.png"],
    featuredImageFit: "contain",
    links: [],
  },
  {
    id: "hand-crank",
    slug: "replacement-hand-crank",
    title: "Replacement Hand Crank",
    discipline: "mechanical",
    type: "Rapid production support",
    summary:
      "A SolidWorks-modeled, 3D-printed hand crank matched to SMT equipment interfaces to restore function quickly.",
    overview:
      "A custom replacement hand crank developed for SMT production equipment to restore functionality and reduce the cost and delay of sourcing replacement parts.",
    sections: [
      {
        title: "Part design and compatibility",
        body: "Designed the crank in SolidWorks to match existing machine interfaces and ensure reliable fit and operation within the production environment.",
      },
      {
        title: "Rapid prototyping",
        body: "Fabricated the component using 3D printing to enable fast iteration, low-cost production, and rapid deployment as a practical replacement for damaged components.",
      },
      {
        title: "Operational impact",
        body: "Provided a durable and cost-effective alternative to supplier replacements, helping reduce production interruptions and improve equipment availability on the shop floor.",
      },
    ],
    impact: "Reduced downtime and avoided slow supplier replacement cycles.",
    tools: ["SolidWorks", "3D printing", "Prototyping", "Machine interfaces"],
    image: "/images/portfolio/portfolio-05.png",
    thumbnail: "/images/portfolio/thumbnails/hand-crank.jpg",
    gallery: ["/images/portfolio/portfolio-05.png"],
    featuredImageFit: "contain",
    links: [],
  },
];

export const experiences = [
  {
    company: "MPI Morheat",
    role: "Engineering Intern",
    period: "Jan 2026 - Apr 2026",
    location: "Toronto, ON",
    badge: "MM",
    logo: "/images/MPI.webp",
    highlights: [
      "Built React configurators and drawing automation tools for custom heater proposals.",
      "Developed an STM32-based automated label cutter for low-cost production automation.",
      "Designed and fabricated plate-forming equipment for repeatable heater manufacturing.",
    ],
  },
  {
    company: "Vexos",
    role: "Engineering Intern",
    period: "May 2025 - Aug 2025",
    location: "Markham, ON",
    badge: "VX",
    logo: "/images/Vexos.webp",
    highlights: [
      "Redesigned SMT tooling in SolidWorks and SolidWorks PDM for local machining.",
      "Built manufacturing tools with Python, CAD, and 3D printing to reduce equipment downtime.",
      "Created process tooling and documentation that improved operator consistency.",
    ],
  },
  {
    company: "Midnight Sun Solar Car Team",
    role: "Firmware Developer",
    period: "Sept 2024 - Present",
    location: "Waterloo, ON",
    badge: "MS",
    logo: "/images/MidSun.webp",
    highlights: [
      "Maintained embedded firmware across vehicle microcontrollers.",
      "Built Pytest-based hardware-in-the-loop testing to validate firmware on vehicle hardware.",
      "Worked with C, Python, SCons, Vagrant, and Git-based embedded workflows.",
    ],
  },
];

export const places = [
  {
    id: "waterloo",
    name: "Waterloo",
    label: "University of Waterloo",
    category: "School",
    note: "Where I am studying Mechatronics Engineering and building with the Midnight Sun Solar Car Team.",
    lat: 43.4643,
    lng: -80.5204,
    // Add photos with paths like "/images/my-waterloo-photo.jpg". Leave empty when you do not have photos yet.
    photos: [],
  },
  {
    id: "toronto",
    name: "Toronto",
    label: "MPI Morheat",
    category: "Work",
    note: "Industrial heater automation, configurator tools, fabrication, and production equipment work.",
    lat: 43.6532,
    lng: -79.3832,
    photos: [],
  },
  {
    id: "markham",
    name: "Markham",
    label: "Vexos",
    category: "Work",
    note: "Manufacturing tooling, DFM, SolidWorks PDM, process documentation, and production support.",
    lat: 43.8561,
    lng: -79.337,
    photos: [],
  },
];

export const skillGroups = [
  {
    title: "Software",
    skills: ["React", "Flask", "Node.js", "TypeScript", "Python", "SQL", "MongoDB"],
  },
  {
    title: "Embedded",
    skills: ["C", "C++", "STM32", "ESP32", "Arduino", "ADCs", "PySerial", "SCons"],
  },
  {
    title: "Mechanical",
    skills: ["SolidWorks", "AutoCAD", "SolidWorks PDM", "3D printing", "Fixture design", "Prototyping"],
  },
  {
    title: "Tools",
    skills: ["Git", "Linux", "Docker", "Vagrant", "Excel", "Bambu Studio"],
  },
];
