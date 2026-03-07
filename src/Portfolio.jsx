import { useState, useEffect } from "react";
import emailjs from "@emailjs/browser";

const NAV_LINKS = ["About", "Skills", "Projects", "Services", "Testimonials", "Contact"];

const SKILLS = [
  { name: "React", level: 92, cat: "Frontend" },
  { name: "Vue.js", level: 80, cat: "Frontend" },
  { name: "HTML/CSS", level: 95, cat: "Frontend" },
  { name: "JavaScript", level: 90, cat: "Frontend" },
  { name: "Django", level: 88, cat: "Backend" },
  { name: "Python", level: 85, cat: "Backend" },
  { name: "PHP", level: 78, cat: "Backend" },
  { name: "Java", level: 75, cat: "Backend" },
  { name: "PostgreSQL", level: 80, cat: "Backend" },
  { name: "REST APIs", level: 87, cat: "Backend" },
  { name: "Figma", level: 93, cat: "Design" },
  { name: "Adobe XD", level: 85, cat: "Design" },
  { name: "Illustrator", level: 88, cat: "Design" },
  { name: "Photoshop", level: 82, cat: "Design" },
  { name: "Canva", level: 90, cat: "Design" },
];

const PROJECTS = [
  { title: "NexaCommerce", desc: "Full-stack e-commerce platform with Django backend, React frontend, and real-time inventory management.", tags: ["React", "Django", "PostgreSQL"], accentColor: "#00f5d4", icon: "🛒" },
  { title: "BrandForge Studio", desc: "Brand identity design system for a fintech startup — logo, UI kit, and style guide.", tags: ["Figma", "Illustrator", "UI/UX"], accentColor: "#7b2fff", icon: "🎨" },
  { title: "PulseAnalytics", desc: "Data visualization dashboard with real-time charts, Django REST API, and advanced filtering.", tags: ["React", "Django", "D3.js"], accentColor: "#ff6b35", icon: "📊" },
  { title: "ConnectSphere", desc: "Social networking web app with messaging, notifications, and AI-powered content feeds.", tags: ["React", "Django", "WebSockets"], accentColor: "#00cfff", icon: "🌐" },
  { title: "MotionMark", desc: "Animated marketing site with scroll-triggered visuals, custom illustrations, and CMS integration.", tags: ["HTML/CSS", "GSAP", "Figma"], accentColor: "#f72585", icon: "✨" },
  { title: "TaskFlow Pro", desc: "Project management SaaS with Kanban boards, team roles, and Django-powered REST backend.", tags: ["React", "Django", "PostgreSQL"], accentColor: "#06d6a0", icon: "📋" },
];

const SERVICES = [
  { icon: "⚡", title: "Full Stack Development", desc: "End-to-end web apps built with React & Django — from database architecture to pixel-perfect UI.", price: "From $500" },
  { icon: "🎨", title: "Brand Identity Design", desc: "Logo, color systems, typography, and brand guidelines that make your business unforgettable.", price: "From $200" },
  { icon: "🖥️", title: "UI/UX Design", desc: "Wireframes, prototypes, and production-ready Figma designs that users love to interact with.", price: "From $300" },
  { icon: "🔧", title: "API Development", desc: "Robust, scalable Django REST APIs, third-party integrations, and backend architecture.", price: "From $400" },
];

const TESTIMONIALS = [
  { name: "Sarah Kamau", role: "CEO, TechVentures KE", text: "Teddy delivered a stunning brand identity and a fully functional web app in record time. Truly a rare talent who bridges design and engineering seamlessly.", avatar: "SK" },
  { name: "James Omondi", role: "Founder, NexaRetail", text: "Our e-commerce platform exceeded every expectation. Clean code, beautiful UI, and excellent communication throughout the project.", avatar: "JO" },
  { name: "Amira Hassan", role: "Product Manager, DataSync", text: "The dashboard Teddy built transformed how our team interacts with data. Exceptional attention to detail and a deep understanding of user needs.", avatar: "AH" },
];

// ─── SVG Icons ────────────────────────────────────────────────────────────────
const IconEmail = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
);
const IconPhone = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 11a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.61 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.72 6.72l.97-.87a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);
const IconGithub = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/>
  </svg>
);
const IconLocation = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar({ active }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const scrollTo = (id) => document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: "smooth" });

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, height: 70,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 2rem",
      background: scrolled ? "rgba(5,5,20,0.95)" : "transparent",
      backdropFilter: scrolled ? "blur(20px)" : "none",
      borderBottom: scrolled ? "1px solid rgba(0,245,212,0.08)" : "none",
      transition: "all 0.4s ease",
    }}>
      <span style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 900, fontSize: "1.25rem", letterSpacing: "4px", color: "#00f5d4" }}>
        DT<span style={{ color: "#fff" }}>.</span>
      </span>
      <div className="hidden md:flex items-center gap-8">
        {NAV_LINKS.map(link => (
          <button key={link} onClick={() => scrollTo(link)}
            style={{
              fontFamily: "'Montserrat',sans-serif", fontSize: "0.65rem", letterSpacing: "3px",
              textTransform: "uppercase", background: "transparent", border: "none",
              borderBottom: active === link.toLowerCase() ? "1px solid #00f5d4" : "1px solid transparent",
              color: active === link.toLowerCase() ? "#00f5d4" : "rgba(255,255,255,0.5)",
              cursor: "pointer", paddingBottom: 2, transition: "all 0.3s",
            }}>
            {link}
          </button>
        ))}
      </div>
      {/* Hire Me — opens email */}
      <a href="mailto:teddy.dande4@gmail.com?subject=Hire%20Enquiry%20-%20Dande%20Teddy&body=Hi%20Teddy%2C%0A%0AI%20would%20like%20to%20hire%20you%20for..."
        style={{
          fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: "0.65rem",
          letterSpacing: "2px", textTransform: "uppercase", padding: "9px 20px",
          color: "#00f5d4", border: "1px solid #00f5d4", textDecoration: "none",
          transition: "all 0.3s", display: "inline-block",
        }}
        onMouseEnter={e => { e.currentTarget.style.background = "#00f5d4"; e.currentTarget.style.color = "#050514"; }}
        onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#00f5d4"; }}>
        HIRE ME
      </a>
    </nav>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  const [typed, setTyped] = useState("");
  const roles = ["Full Stack Developer", "Graphic Designer", "UI/UX Designer", "Brand Strategist"];
  const [roleIdx, setRoleIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = roles[roleIdx];
    const timeout = setTimeout(() => {
      if (!deleting) {
        if (charIdx < current.length) { setTyped(current.slice(0, charIdx + 1)); setCharIdx(c => c + 1); }
        else setTimeout(() => setDeleting(true), 1800);
      } else {
        if (charIdx > 0) { setTyped(current.slice(0, charIdx - 1)); setCharIdx(c => c - 1); }
        else { setDeleting(false); setRoleIdx(i => (i + 1) % roles.length); }
      }
    }, deleting ? 40 : 80);
    return () => clearTimeout(timeout);
  }, [charIdx, deleting, roleIdx]);

  return (
    <section id="about" style={{ position: "relative", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "0 1.5rem", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(0,245,212,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(0,245,212,0.04) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
      <div style={{ position: "absolute", width: 400, height: 400, borderRadius: "50%", left: -100, top: 80, background: "radial-gradient(circle,rgba(123,47,255,0.18) 0%,transparent 70%)", filter: "blur(40px)" }} />
      <div style={{ position: "absolute", width: 320, height: 320, borderRadius: "50%", right: -60, bottom: 80, background: "radial-gradient(circle,rgba(0,207,255,0.14) 0%,transparent 70%)", filter: "blur(40px)" }} />

      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 16px", marginBottom: 32, fontFamily: "'Montserrat',sans-serif", fontSize: "0.65rem", letterSpacing: "3px", textTransform: "uppercase", color: "#00f5d4", border: "1px solid rgba(0,245,212,0.3)", background: "rgba(0,245,212,0.05)" }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#00f5d4", animation: "pulse 2s infinite", display: "inline-block" }} />
          AVAILABLE FOR WORK
        </div>

        <h1 style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 900, fontSize: "clamp(2.8rem,7vw,5.5rem)", lineHeight: 1.05, marginBottom: 12, letterSpacing: "-1px" }}>
          <span style={{ color: "#fff" }}>DANDE</span><br />
          <span style={{ background: "linear-gradient(135deg,#00f5d4,#7b2fff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>TEDDY</span>
        </h1>

        <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "clamp(1rem,2.5vw,1.4rem)", color: "#00cfff", minHeight: 32, marginBottom: 32, letterSpacing: 1 }}>
          {typed}<span style={{ color: "#00f5d4", animation: "blink 1s infinite" }}>|</span>
        </div>

        <p style={{ maxWidth: 560, fontFamily: "'Montserrat',sans-serif", fontSize: "0.9rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.8, marginBottom: 40 }}>
          Nairobi-based creative technologist crafting immersive digital experiences — where pixel-perfect design meets robust engineering.
        </p>

        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
          <button onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
            style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: "0.65rem", letterSpacing: "2px", textTransform: "uppercase", padding: "14px 32px", background: "linear-gradient(135deg,#00f5d4,#00cfff)", color: "#050514", border: "none", cursor: "pointer", transition: "all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,245,212,0.3)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}>
            VIEW WORK
          </button>
          <a href="https://github.com/ablecrew" target="_blank" rel="noopener noreferrer"
            style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "0.65rem", letterSpacing: "2px", textTransform: "uppercase", padding: "14px 32px", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8, transition: "all 0.3s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#00f5d4"; e.currentTarget.style.color = "#00f5d4"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; e.currentTarget.style.color = "#fff"; }}>
            <IconGithub /> GITHUB
          </a>
        </div>

        <div style={{ display: "flex", gap: 48, justifyContent: "center", marginTop: 80, flexWrap: "wrap" }}>
          {[["50+", "Projects"], ["3+", "Years Exp."], ["30+", "Clients"], ["100%", "Satisfaction"]].map(([num, label]) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 900, fontSize: "1.8rem", color: "#00f5d4" }}>{num}</div>
              <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "0.6rem", letterSpacing: "2px", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginTop: 4 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────
function SectionHeader({ label, title, accent }) {
  return (
    <div style={{ textAlign: "center", marginBottom: "4rem" }}>
      <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "0.6rem", letterSpacing: "4px", textTransform: "uppercase", color: "#00f5d4", marginBottom: 16 }}>— {label} —</div>
      <h2 style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 900, fontSize: "clamp(2rem,4vw,3rem)", letterSpacing: "-0.5px", margin: 0 }}>
        <span style={{ color: "#fff" }}>{title} </span>
        <span style={{ background: "linear-gradient(135deg,#00f5d4,#7b2fff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{accent}</span>
      </h2>
    </div>
  );
}

// ─── Skills ───────────────────────────────────────────────────────────────────
function Skills() {
  const [activecat, setActivecat] = useState("All");
  const cats = ["All", "Frontend", "Backend", "Design"];
  const filtered = activecat === "All" ? SKILLS : SKILLS.filter(s => s.cat === activecat);
  const catColors = { Frontend: "#00f5d4", Backend: "#7b2fff", Design: "#f72585" };

  return (
    <section id="skills" style={{ background: "rgba(255,255,255,0.01)", padding: "8rem 0" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 1.5rem" }}>
        <SectionHeader label="EXPERTISE" title="Skills &" accent="Arsenal" />

        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 56, flexWrap: "wrap" }}>
          {cats.map(cat => (
            <button key={cat} onClick={() => setActivecat(cat)}
              style={{
                fontFamily: "'Montserrat',sans-serif", fontSize: "0.65rem", letterSpacing: "2px",
                textTransform: "uppercase", padding: "10px 24px", borderRadius: 999,
                border: `1px solid ${activecat === cat ? (catColors[cat] || "#00f5d4") : "rgba(255,255,255,0.12)"}`,
                background: activecat === cat ? `${catColors[cat] || "#00f5d4"}18` : "transparent",
                color: activecat === cat ? (catColors[cat] || "#00f5d4") : "rgba(255,255,255,0.45)",
                boxShadow: activecat === cat ? `0 0 20px ${catColors[cat] || "#00f5d4"}25` : "none",
                cursor: "pointer", transition: "all 0.3s",
              }}>
              {cat}
            </button>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 16 }}>
          {filtered.map(skill => {
            const color = catColors[skill.cat] || "#00f5d4";
            return (
              <div key={skill.name}
                style={{ padding: "1.5rem", border: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)", transition: "all 0.3s", position: "relative", overflow: "hidden" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = `${color}55`; e.currentTarget.style.background = `${color}07`; e.currentTarget.querySelector(".accent-line").style.opacity = "1"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.background = "rgba(255,255,255,0.02)"; e.currentTarget.querySelector(".accent-line").style.opacity = "0"; }}>
                <div className="accent-line" style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg,transparent,${color},transparent)`, opacity: 0, transition: "opacity 0.3s" }} />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                  <div>
                    <div style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 700, color: "#fff", fontSize: "0.9rem" }}>{skill.name}</div>
                    <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "0.6rem", letterSpacing: "2px", textTransform: "uppercase", color: `${color}99`, marginTop: 4 }}>{skill.cat}</div>
                  </div>
                  <span style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 900, fontSize: "1.2rem", color }}>{skill.level}%</span>
                </div>
                <div style={{ height: 4, borderRadius: 4, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
                  <div style={{ height: "100%", borderRadius: 4, width: `${skill.level}%`, background: `linear-gradient(90deg,${color},${color}88)`, transition: "width 1s ease" }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── Projects ─────────────────────────────────────────────────────────────────
function Projects() {
  const [hovered, setHovered] = useState(null);
  return (
    <section id="projects" style={{ padding: "8rem 1.5rem" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <SectionHeader label="PORTFOLIO" title="Featured" accent="Projects" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: 20 }}>
          {PROJECTS.map((proj, i) => (
            <div key={proj.title}
              style={{
                position: "relative", display: "flex", flexDirection: "column", padding: "2rem",
                border: `1px solid ${hovered === i ? proj.accentColor + "55" : "rgba(255,255,255,0.07)"}`,
                background: hovered === i ? `${proj.accentColor}08` : "rgba(255,255,255,0.02)",
                transform: hovered === i ? "translateY(-4px)" : "none",
                boxShadow: hovered === i ? `0 20px 40px ${proj.accentColor}18` : "none",
                transition: "all 0.3s", overflow: "hidden",
              }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg,transparent,${proj.accentColor},transparent)`, opacity: hovered === i ? 1 : 0, transition: "opacity 0.3s" }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                <span style={{ fontSize: "2.2rem" }}>{proj.icon}</span>
                <span style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 900, fontSize: "0.7rem", letterSpacing: "2px", color: `${proj.accentColor}55` }}>0{i + 1}</span>
              </div>
              <h3 style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 700, color: "#fff", fontSize: "1rem", letterSpacing: 1, marginBottom: 12 }}>{proj.title}</h3>
              <p style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "0.85rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.7, marginBottom: 24, flexGrow: 1 }}>{proj.desc}</p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {proj.tags.map(tag => (
                  <span key={tag} style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "0.6rem", letterSpacing: "1px", textTransform: "uppercase", padding: "4px 10px", border: `1px solid ${proj.accentColor}44`, color: proj.accentColor, background: `${proj.accentColor}0d` }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Services ─────────────────────────────────────────────────────────────────
function Services() {
  return (
    <section id="services" style={{ background: "rgba(255,255,255,0.01)", padding: "8rem 1.5rem" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <SectionHeader label="OFFERINGS" title="What I" accent="Deliver" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 20 }}>
          {SERVICES.map((svc, i) => (
            <div key={svc.title}
              style={{ position: "relative", padding: "2rem", display: "flex", flexDirection: "column", gap: 16, border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)", transition: "all 0.3s", overflow: "hidden" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(0,245,212,0.3)"; e.currentTarget.style.background = "rgba(0,245,212,0.04)"; e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.querySelector(".svc-line").style.opacity = "1"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.background = "rgba(255,255,255,0.02)"; e.currentTarget.style.transform = "none"; e.currentTarget.querySelector(".svc-line").style.opacity = "0"; }}>
              <div className="svc-line" style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg,transparent,#00f5d4,transparent)", opacity: 0, transition: "opacity 0.3s" }} />
              <div style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 900, fontSize: "0.6rem", letterSpacing: "2px", color: "rgba(0,245,212,0.25)" }}>0{i + 1}</div>
              <span style={{ fontSize: "2rem" }}>{svc.icon}</span>
              <h3 style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 700, color: "#fff", fontSize: "0.9rem", letterSpacing: 1 }}>{svc.title}</h3>
              <p style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "0.82rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.7, flexGrow: 1 }}>{svc.desc}</p>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <span style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 900, fontSize: "0.85rem", color: "#00f5d4" }}>{svc.price}</span>
                <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "1rem" }}>→</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials ─────────────────────────────────────────────────────────────
function Testimonials() {
  return (
    <section id="testimonials" style={{ padding: "8rem 1.5rem" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <SectionHeader label="SOCIAL PROOF" title="Client" accent="Voices" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 20 }}>
          {TESTIMONIALS.map((t) => (
            <div key={t.name}
              style={{ position: "relative", padding: "2rem", display: "flex", flexDirection: "column", border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)", transition: "all 0.3s", overflow: "hidden" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(0,245,212,0.25)"; e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.querySelector(".t-line").style.opacity = "1"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.transform = "none"; e.currentTarget.querySelector(".t-line").style.opacity = "0"; }}>
              <div className="t-line" style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg,transparent,#00f5d4,transparent)", opacity: 0, transition: "opacity 0.3s" }} />
              <div style={{ display: "flex", gap: 4, marginBottom: 20 }}>
                {[...Array(5)].map((_, s) => <span key={s} style={{ color: "#00f5d4", fontSize: "0.75rem" }}>★</span>)}
              </div>
              <p style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "0.85rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.8, fontStyle: "italic", flexGrow: 1, marginBottom: 24 }}>"{t.text}"</p>
              <div style={{ display: "flex", alignItems: "center", gap: 12, paddingTop: 20, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Montserrat',sans-serif", fontSize: "0.65rem", fontWeight: 900, color: "#050514", flexShrink: 0, background: "linear-gradient(135deg,#00f5d4,#7b2fff)" }}>{t.avatar}</div>
                <div>
                  <div style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 700, color: "#fff", fontSize: "0.75rem", letterSpacing: 1 }}>{t.name}</div>
                  <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "0.7rem", color: "rgba(255,255,255,0.4)", marginTop: 2 }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Contact ──────────────────────────────────────────────────────────────────
function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(null);

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.message) {
      setStatus("error:Please fill in all fields.");
      return;
    }
    setLoading(true);
    setStatus("");
    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          from_name: form.name,
          from_email: form.email,
          message: form.message,
          to_email: "teddy.dande4@gmail.com",
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );
      setStatus("success:Message sent! I'll get back to you within 24 hours.");
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      console.error("EmailJS error:", err);
      setStatus("error:Failed to send. Please email teddy.dande4@gmail.com directly.");
    }
    setLoading(false);
  };

  const isSuccess = status.startsWith("success:");
  const statusMsg = status.replace(/^(success|error):/, "");

  const contactItems = [
    { icon: <IconEmail />, label: "Email", value: "teddy.dande4@gmail.com", href: "mailto:teddy.dande4@gmail.com", color: "#00f5d4" },
    { icon: <IconPhone />, label: "Phone", value: "+254 707 528 980", href: "tel:+254707528980", color: "#7b2fff" },
    { icon: <IconGithub />, label: "GitHub", value: "github.com/ablecrew", href: "https://github.com/ablecrew", color: "#00cfff" },
    { icon: <IconLocation />, label: "Location", value: "Nairobi, Kenya", href: "https://maps.google.com/?q=Nairobi,Kenya", color: "#f72585" },
  ];

  const inputBase = {
    width: "100%", boxSizing: "border-box",
    padding: "14px 16px",
    fontFamily: "'Montserrat',sans-serif", fontSize: "0.88rem",
    color: "#fff", outline: "none",
    background: "rgba(255,255,255,0.03)",
    transition: "all 0.3s",
  };

  return (
    <section id="contact" style={{ background: "rgba(255,255,255,0.01)", padding: "8rem 1.5rem" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <SectionHeader label="GET IN TOUCH" title="Let's Build" accent="Together" />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: 48, alignItems: "start" }} className="contact-grid">

          {/* ── Left panel ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            <p style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "0.9rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.8 }}>
              Have a project in mind? I'd love to hear about it. Reach out and let's create something remarkable together.
            </p>

            {/* Contact cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {contactItems.map(({ icon, label, value, href, color }) => (
                <a key={label} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer"
                  style={{ display: "flex", alignItems: "center", gap: 16, padding: "14px 18px", border: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)", textDecoration: "none", transition: "all 0.3s", position: "relative", overflow: "hidden" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = `${color}55`; e.currentTarget.style.background = `${color}08`; e.currentTarget.style.transform = "translateX(4px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.background = "rgba(255,255,255,0.02)"; e.currentTarget.style.transform = "none"; }}>
                  {/* Left color bar */}
                  <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: color, borderRadius: "0 2px 2px 0" }} />
                  <div style={{ width: 40, height: 40, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color, background: `${color}15`, border: `1px solid ${color}30`, flexShrink: 0 }}>
                    {icon}
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "0.6rem", letterSpacing: "2px", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: 3 }}>{label}</div>
                    <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "0.85rem", fontWeight: 600, color }}>{value}</div>
                  </div>
                  <div style={{ marginLeft: "auto", color: "rgba(255,255,255,0.2)", fontSize: "0.8rem" }}>→</div>
                </a>
              ))}
            </div>

            {/* Availability */}
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "12px 20px", border: "1px solid rgba(0,245,212,0.2)", background: "rgba(0,245,212,0.05)", alignSelf: "flex-start" }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#00f5d4", animation: "pulse 2s infinite", display: "inline-block" }} />
              <span style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "0.65rem", letterSpacing: "2px", textTransform: "uppercase", color: "#00f5d4" }}>Open to new projects</span>
            </div>
          </div>

          {/* ── Right: Form ── */}
          <div style={{ padding: "2.5rem", border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)", position: "relative", overflow: "hidden" }}>
            {/* Decorative top gradient */}
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg,transparent,#00f5d4,#7b2fff,transparent)" }} />

            <div style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 700, color: "#fff", fontSize: "1rem", letterSpacing: 1, marginBottom: 28 }}>
              Send a Message
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {/* Name & Email row */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }} className="form-row">
                {[
                  { key: "name", label: "Your Name", type: "text", ph: "John Doe" },
                  { key: "email", label: "Email Address", type: "email", ph: "john@example.com" },
                ].map(({ key, label, type, ph }) => (
                  <div key={key}>
                    <label style={{ display: "block", fontFamily: "'Montserrat',sans-serif", fontSize: "0.6rem", letterSpacing: "2px", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: 8 }}>{label}</label>
                    <input type={type} value={form[key]} placeholder={ph}
                      onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                      onFocus={() => setFocused(key)}
                      onBlur={() => setFocused(null)}
                      style={{ ...inputBase, border: `1px solid ${focused === key ? "rgba(0,245,212,0.5)" : "rgba(255,255,255,0.08)"}`, boxShadow: focused === key ? "0 0 0 3px rgba(0,245,212,0.08)" : "none" }} />
                  </div>
                ))}
              </div>

              {/* Message */}
              <div>
                <label style={{ display: "block", fontFamily: "'Montserrat',sans-serif", fontSize: "0.6rem", letterSpacing: "2px", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: 8 }}>Message</label>
                <textarea rows={6} value={form.message} placeholder="Tell me about your project, timeline, and budget..."
                  onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  onFocus={() => setFocused("message")}
                  onBlur={() => setFocused(null)}
                  style={{ ...inputBase, resize: "vertical", border: `1px solid ${focused === "message" ? "rgba(0,245,212,0.5)" : "rgba(255,255,255,0.08)"}`, boxShadow: focused === "message" ? "0 0 0 3px rgba(0,245,212,0.08)" : "none" }} />
              </div>

              {/* Submit */}
              <button onClick={handleSubmit} disabled={loading}
                style={{
                  width: "100%", padding: "16px", border: "none", cursor: loading ? "wait" : "pointer",
                  fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: "0.7rem",
                  letterSpacing: "2px", textTransform: "uppercase",
                  background: loading ? "rgba(0,245,212,0.3)" : "linear-gradient(135deg,#00f5d4,#00cfff)",
                  color: "#050514", transition: "all 0.3s", position: "relative", overflow: "hidden",
                }}
                onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,245,212,0.3)"; }}}
                onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}>
                {loading ? (
                  <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: "spin 1s linear infinite" }}>
                      <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                    </svg>
                    TRANSMITTING...
                  </span>
                ) : "SEND MESSAGE →"}
              </button>

              {/* Status */}
              {status && (
                <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 16px", borderRadius: 2, background: isSuccess ? "rgba(0,245,212,0.08)" : "rgba(248,113,113,0.08)", border: `1px solid ${isSuccess ? "rgba(0,245,212,0.2)" : "rgba(248,113,113,0.2)"}` }}>
                  <span style={{ fontSize: "1rem" }}>{isSuccess ? "✓" : "✗"}</span>
                  <span style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "0.82rem", color: isSuccess ? "#00f5d4" : "#f87171" }}>{statusMsg}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ borderTop: "1px solid rgba(255,255,255,0.05)", background: "#050514" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "4rem 1.5rem 2.5rem" }}>
        {/* Top 3-col grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr", gap: 40, marginBottom: "3rem", paddingBottom: "3rem", borderBottom: "1px solid rgba(255,255,255,0.05)" }} className="footer-grid">

          {/* Brand */}
          <div>
            <div style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 900, fontSize: "1.4rem", letterSpacing: "4px", color: "#00f5d4", marginBottom: 12 }}>
              DT<span style={{ color: "#fff" }}>.</span>
            </div>
            <p style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "0.8rem", color: "rgba(255,255,255,0.4)", lineHeight: 1.8, maxWidth: 220 }}>
              Full Stack Developer &amp; Graphic Designer crafting digital experiences from Nairobi, Kenya.
            </p>
            {/* Social row */}
            <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
              {[
                { icon: <IconGithub />, href: "https://github.com/ablecrew" },
                { icon: <IconEmail />, href: "mailto:teddy.dande4@gmail.com" },
                { icon: <IconPhone />, href: "tel:+254707528980" },
              ].map(({ icon, href }, i) => (
                <a key={i} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer"
                  style={{ width: 36, height: 36, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.4)", textDecoration: "none", transition: "all 0.3s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#00f5d4"; e.currentTarget.style.color = "#00f5d4"; e.currentTarget.style.background = "rgba(0,245,212,0.08)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "rgba(255,255,255,0.4)"; e.currentTarget.style.background = "transparent"; }}>
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "0.6rem", letterSpacing: "3px", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: 20 }}>Quick Links</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {NAV_LINKS.map(link => (
                <button key={link}
                  onClick={() => document.getElementById(link.toLowerCase())?.scrollIntoView({ behavior: "smooth" })}
                  style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "0.8rem", color: "rgba(255,255,255,0.4)", background: "none", border: "none", cursor: "pointer", textAlign: "left", padding: 0, transition: "color 0.2s", width: "fit-content" }}
                  onMouseEnter={e => e.currentTarget.style.color = "#00f5d4"}
                  onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.4)"}>
                  {link}
                </button>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "0.6rem", letterSpacing: "3px", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: 20 }}>Contact</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                ["teddy.dande4@gmail.com", "mailto:teddy.dande4@gmail.com"],
                ["+254 707 528 980", "tel:+254707528980"],
                ["github.com/ablecrew", "https://github.com/ablecrew"],
                ["Nairobi, Kenya", "https://maps.google.com/?q=Nairobi,Kenya"],
              ].map(([val, href]) => (
                <a key={val} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer"
                  style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "0.8rem", color: "rgba(255,255,255,0.4)", textDecoration: "none", transition: "color 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.color = "#00f5d4"}
                  onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.4)"}>
                  {val}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "0.7rem", letterSpacing: "1px", color: "rgba(255,255,255,0.2)" }}>
            © 2026 Dande Teddy — All rights reserved.
          </div>
          <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "0.7rem", color: "rgba(255,255,255,0.2)" }}>
            Crafted with precision in <span style={{ color: "#00f5d4" }}>Nairobi, Kenya</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function Portfolio() {
  const [activeSection, setActiveSection] = useState("about");

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.id); }),
      { threshold: 0.3 }
    );
    NAV_LINKS.forEach(link => {
      const el = document.getElementById(link.toLowerCase());
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div style={{ background: "#050514", color: "#fff", minHeight: "100vh", fontFamily: "'Montserrat',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&display=swap');
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #050514; }
        ::-webkit-scrollbar-thumb { background: #00f5d4; border-radius: 2px; }
        input, textarea { font-family: 'Montserrat', sans-serif; }
        input::placeholder, textarea::placeholder { color: rgba(255,255,255,0.2); }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }

        /* Responsive */
        @media (max-width: 768px) {
          .contact-grid { grid-template-columns: 1fr !important; }
          .footer-grid { grid-template-columns: 1fr !important; }
          .form-row { grid-template-columns: 1fr !important; }
        }
      `}</style>
      <Navbar active={activeSection} />
      <Hero />
      <Skills />
      <Projects />
      <Services />
      <Testimonials />
      <Contact />
      <Footer />
    </div>
  );
}