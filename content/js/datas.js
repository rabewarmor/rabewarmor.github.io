/* ============================================================
   SITE CONTENT
   Edit everything here. terminal.js reads from this object.
   ============================================================ */
const SITE = {
  name: "Rabewar Moradi",
  handle: "rabewarmor",
  tagline: "Computer Engineering (Software Co-op) · University of Alberta",
  location: "Edmonton, AB",

  about: [
    "Computer Engineering student in the Software Co-op program at the",
    "University of Alberta, with hands-on experience across IT and OT",
    "environments in industrial settings.",
    "",
    "I like building things from the ground up — reading the datasheet and",
    "the official docs rather than reaching for a library wrapper. Most of",
    "my spare cycles go into embedded systems: ESP32 and RP2040, ESP-IDF,",
    "FreeRTOS, and the kind of fault-tolerance problems that only show up",
    "once hardware is involved."
  ],

  experience: [
    {
      title: "IT Plant Technician Intern",
      org: "Agropur",
      date: "2025",
      bullets: [
        "Supported IT and OT systems across two production facilities.",
        "Audited network infrastructure over SSH and configured VLANs.",
        "Troubleshot PLC connectivity and deployed software to plant floor systems.",
        "Responded to a Priority 1 production incident, tracing the fault to a VLAN misconfiguration."
      ]
    }
  ],

  projects: [
    {
      title: "Fault-Tolerant SCADA-Style Data Logger",
      date: "2026",
      tech: ["ESP32", "ESP-IDF", "FreeRTOS", "C"],
      link: "https://github.com/rabewarmor",
      bullets: [
        "Multi-task architecture: sensor acquisition, NVS flash writer, and a supervisor/watchdog task.",
        "Bit-banged single-wire GPIO driver for DHT11 with timing-critical read sequencing.",
        "SSD1306 OLED status display driven directly over I2C — no display library.",
        "Designed for graceful degradation: task failures are detected and recovered, not fatal."
      ]
    },
    {
      title: "Social Distribution",
      date: "2025",
      tech: ["Django", "DRF", "Python", "Heroku"],
      link: "https://github.com/rabewarmor",
      bullets: [
        "Distributed social networking platform built with a team using Django REST Framework.",
        "Implemented GitHub activity auto-posting and expanded API test coverage.",
        "Handled deployment and generated a Postman collection for the public API."
      ]
    }
  ],

  education: [
    {
      title: "BSc Computer Engineering — Software Co-op",
      org: "University of Alberta",
      date: "Expected 2027",
      bullets: [
        "Relevant coursework: Embedded Systems, Operating Systems, Risk Management."
      ]
    }
  ],

  skills: {
    "Languages":  "C, C++, Python, JavaScript, SQL",
    "Embedded":   "ESP-IDF, FreeRTOS, ESP32, RP2040, Zynq-7000, I2C, SPI, UART, GPIO",
    "IT / OT":    "VLAN configuration, SSH, network auditing, PLC troubleshooting",
    "Web":        "Django, DRF, HTML/CSS, REST APIs",
    "Tools":      "Git, Linux, Vitis, Postman"
  },

  socials: {
    "email":    { label: "rabewar@ualberta.ca",  url: "mailto:rabewar@ualberta.ca" },
    "github":   { label: "github.com/rabewarmor", url: "https://github.com/rabewarmor" },
    "linkedin": { label: "linkedin.com/in/rabewar-moradi-851544340", url: "https://linkedin.com/in/rabewar-moradi-851544340" }
  },

  resumeUrl: "content/pdf/resume.pdf",

};