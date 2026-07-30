import { useEffect, useState } from "react";
import { books, goals, literatureCategories, posters, profile, projects, quests, researchDetailFPGA, reviews, updates } from "./content";
import GlobeCard from "./GlobeCard";
import TravelMap from "./TravelMap";
import TrainingPage from "./TrainingPage";
import BooksPage from "./BooksPage";
import CurlyCursor from "./CurlyCursor";
import PageInspector from "./PageInspector";
import AsciiBackdrop from "./AsciiBackdrop";
import brandLogo from "./assets/blacknici-mask.png";

const pages = [
  ["home", "Home"],
  ["now", "Now"],
  ["research", "Research"],
  ["projects", "Projects"],
  ["reviews", "Literature Review"],
  ["cv", "CV"],
  ["map", "Map"],
  ["tools", "Tools"],
  ["training", "Training"],
  ["stuff", "Stuff"],
];

const pageIds = new Set([...pages.map(([id]) => id), "posters", "books", "goals"]);

function getPageFromHash() {
  const page = window.location.hash.replace("#/", "");
  return pageIds.has(page) ? page : "home";
}

function Icon({ name }) {
  if (name === "x") {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4l14 16M19 4 5 20" /></svg>;
  }
  if (name === "instagram") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="4" y="4" width="16" height="16" rx="4" />
        <circle cx="12" cy="12" r="3.5" />
        <circle className="icon-fill" cx="17.5" cy="6.8" r="1" />
      </svg>
    );
  }
  if (name === "bookmark") {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path className="icon-fill" d="M5 3h14v19l-7-4-7 4V3Z" /></svg>;
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 17a2 2 0 0 1 2 2M5 11a8 8 0 0 1 8 8M5 5a14 14 0 0 1 14 14" />
    </svg>
  );
}

function HomePage({ navigate }) {
  return (
    <section className="home-page page">
      <div className="home-content">
        <div className="home-intro">
          <div className="home-intro-text">
            <h1>{profile.name}</h1>
            <div className="intro-copy">
              <p>
                I’m a digital hardware engineer who got hooked on computational neuroscience. I spend my time designing FPGA accelerators and studying spiking neural networks, trying to bridge the gap between silicon architectures and biological intelligence.
              </p>
              <p>
                Right now, I'm working as a research intern at Imperial College London, focusing on hybrid neural network models. Before this, my work was centered on embedded neuromorphic firmware, real-time event-driven pipelines, and neural signal processing.
              </p>
              <p>
                When I’m not debugging timing violations or reading up on neural modeling, you’ll probably find me swimming, running, playing football, or climbing the trophy road in Clash Royale.
              </p>
            </div>

            <div id="social" className="contact-row">
              <a className="contact-plain-link" href="#social"><Icon name="instagram" /><span>Instagram</span></a>
              <span className="separator">·</span>
              <a className="contact-plain-link" href={`mailto:${profile.email}`}>{profile.email}</a>
              <a href={`mailto:${profile.email}`}>Send a message</a>
            </div>
          </div>
          <AsciiBackdrop />
        </div>

        <section className="home-block updates">
          <p className="section-label">Recently updated</p>
          {updates.map((item) => (
            <button className="update-row" onClick={() => navigate(item.targetPage || "projects")} key={item.title}>
              <strong>{item.title}</strong>
              <span className="dot-line" />
              <time>{item.date}</time>
            </button>
          ))}
          <button className="text-link" onClick={() => navigate("projects")}>All projects &amp; posts →</button>
        </section>

        <div className="home-columns home-block">
          <section className="training" onClick={() => navigate("training")} style={{ cursor: "pointer" }}>
            <p className="section-label">Latest training</p>
            <div className="activity-card">
              <span className="activity-icon" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M13.49 5.48c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm-3.6 13.9l1-4.4 2.1 2v6h2v-7.5l-2.1-2 .6-3c1.3 1.5 3.3 2.5 5.5 2.5v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1l-5.2 2.2v4.7h2v-3.4l1.8-.7-1.6 8.1-4.9-1-.4 2 7 1.4z" />
                </svg>
              </span>
              <div>
                <strong>Zone 3 Run <em style={{ fontStyle: "normal", color: "#eab308", fontWeight: 700 }}>Z3</em></strong>
                <p>Mon, Jul 27 · Run · 38m · 6.1km · 472 cal</p>
              </div>
              <span className="activity-arrow" onClick={(e) => { e.stopPropagation(); navigate("training"); }}>→</span>
            </div>
          </section>

          <section className="reading">
            <p className="section-label">2026 reading</p>
            <div className="book-strip">
              {books.map((book) => (
                <article className="book" key={book.title} onClick={() => navigate("books")} style={{ cursor: "pointer" }}>
                  <img src={book.cover} alt="" />
                  <p>{book.title}</p>
                </article>
              ))}
            </div>
            <button className="text-link" onClick={() => navigate("books")}>All books →</button>
          </section>
        </div>

        <section className="home-block goals">
          <p className="section-label">2026 goals</p>
          <div className="goal-list">
            {goals.map((goal) => (
              <span key={goal} onClick={() => navigate("goals")} style={{ cursor: "pointer" }}>
                {goal}
              </span>
            ))}
          </div>
          <button className="muted-link" onClick={() => navigate("goals")}>View all goals →</button>
        </section>

        <section className="home-block quests">
          <p className="section-label">Completed side quests</p>
          <div className="quest-list">
            {quests.map((quest) => (
              <div className="quest" key={quest.title}>
                <span className="check">✓</span>
                <span>{quest.title}</span>
                <time>{quest.date}</time>
              </div>
            ))}
          </div>
        </section>

        <div className="home-block home-globe">
          <p className="globe-current-label">Current Location</p>
          <GlobeCard />
        </div>
      </div>
    </section>
  );
}

function ResearchDetailPage({ detail, onBack }) {
  if (!detail || !detail.sections) return null;
  const { sections } = detail;

  return (
    <section className="page content-section research-detail-page">
      <div style={{ width: "100%", maxWidth: "896px", margin: "0 auto" }}>
        <button
          onClick={onBack}
          style={{
            background: "none",
            border: "none",
            color: "var(--muted)",
            fontSize: "14px",
            cursor: "pointer",
            marginBottom: "32px",
            padding: 0,
            display: "inline-flex",
            alignItems: "center",
            gap: "6px"
          }}
        >
          ← Back to Research
        </button>

        <header className="research-detail-header" style={{ marginBottom: "40px" }}>
          <span className="paper-badge" style={{ color: "#707070", fontSize: "13px", letterSpacing: ".05em", textTransform: "uppercase" }}>
            {detail.type} · {detail.year}
          </span>
          <h1 style={{ fontSize: "32px", fontWeight: "600", color: "#f0f0f0", margin: "12px 0 8px", lineHeight: "1.25" }}>
            {detail.title}
          </h1>
          <h2 style={{ fontSize: "18px", fontWeight: "500", color: "#a0a0a0", margin: "0 0 20px", lineHeight: "1.4" }}>
            {detail.subtitle}
          </h2>
          <div style={{ color: "#a0a0a0", fontSize: "14px", lineHeight: "1.6", display: "flex", flexWrap: "wrap", gap: "24px", borderTop: "1px solid #2a2a2a", borderBottom: "1px solid #2a2a2a", padding: "14px 0" }}>
            <div><strong style={{ color: "#d0d0d0" }}>Location:</strong> {detail.location}</div>
            <div><strong style={{ color: "#d0d0d0" }}>Hardware Platform:</strong> {detail.hardware}</div>
          </div>
        </header>

        <div className="research-detail-content" style={{ display: "flex", flexDirection: "column", gap: "36px", color: "#b0b0b0", fontSize: "15px", lineHeight: "1.65" }}>
          {sections.problem && (
            <div className="research-detail-section">
              <h3 style={{ fontSize: "20px", fontWeight: "600", color: "#e0e0e0", margin: "0 0 12px", borderBottom: "1px solid #303030", paddingBottom: "8px" }}>
                {sections.problem.title}
              </h3>
              {sections.problem.paragraphs.map((p, i) => (
                <p key={i} style={{ margin: i === 0 ? 0 : "12px 0 0" }}>{p}</p>
              ))}
            </div>
          )}

          {sections.hypothesis && (
            <div className="research-detail-section">
              <h3 style={{ fontSize: "20px", fontWeight: "600", color: "#e0e0e0", margin: "0 0 12px", borderBottom: "1px solid #303030", paddingBottom: "8px" }}>
                {sections.hypothesis.title}
              </h3>
              {sections.hypothesis.paragraphs.map((p, i) => (
                <p key={i} style={{ margin: i === 0 ? 0 : "12px 0 0" }}>{p}</p>
              ))}
              {sections.hypothesis.bulletPoints && (
                <ul style={{ listStyle: "none", padding: 0, margin: "16px 0 0", display: "flex", flexDirection: "column", gap: "10px" }}>
                  {sections.hypothesis.bulletPoints.map((bp, idx) => (
                    <li key={idx} style={{ paddingLeft: "16px", borderLeft: "2px solid #404040", color: "#d0d0d0" }}>
                      {bp}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {sections.architecture && (
            <div className="research-detail-section">
              <h3 style={{ fontSize: "20px", fontWeight: "600", color: "#e0e0e0", margin: "0 0 12px", borderBottom: "1px solid #303030", paddingBottom: "8px" }}>
                {sections.architecture.title}
              </h3>
              <p style={{ margin: "0 0 16px" }}>{sections.architecture.intro}</p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "16px" }}>
                {sections.architecture.items.map((item, idx) => (
                  <li key={idx} style={{ paddingLeft: "16px", borderLeft: "2px solid #404040" }}>
                    <strong style={{ color: "#e0e0e0", display: "block", marginBottom: "4px" }}>
                      {item.heading}
                    </strong>
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {sections.findings && (
            <div className="research-detail-section">
              <h3 style={{ fontSize: "20px", fontWeight: "600", color: "#e0e0e0", margin: "0 0 12px", borderBottom: "1px solid #303030", paddingBottom: "8px" }}>
                {sections.findings.title}
              </h3>
              <p style={{ margin: "0 0 16px" }}>{sections.findings.intro}</p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "16px" }}>
                {sections.findings.items.map((item, idx) => (
                  <li key={idx} style={{ paddingLeft: "16px", borderLeft: "2px solid #404040" }}>
                    <strong style={{ color: "#e0e0e0", display: "block", marginBottom: "4px" }}>
                      {item.heading}
                    </strong>
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {sections.abstract && (
            <div className="research-detail-section">
              <h3 style={{ fontSize: "20px", fontWeight: "600", color: "#e0e0e0", margin: "0 0 12px", borderBottom: "1px solid #303030", paddingBottom: "8px" }}>
                {sections.abstract.title}
              </h3>
              {sections.abstract.paragraphs.map((p, i) => (
                <p key={i} style={{ margin: i === 0 ? 0 : "12px 0 0", fontStyle: "italic", color: "#b0b0b0" }}>{p}</p>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function ResearchPage() {
  const [selectedResearch, setSelectedResearch] = useState(null);

  if (selectedResearch) {
    return <ResearchDetailPage detail={selectedResearch} onBack={() => setSelectedResearch(null)} />;
  }

  return (
    <section className="page content-section research-page">
      <header className="section-heading">
        <h2>Research</h2>
      </header>

      <div className="research-intro-copy">
        <p>
          Okay I know this has been said a lot, but hear me out. The thing that&apos;s kept me hooked for years is how the brain turns a thought into an actual movement. Like billions of neurons are firing at each other and somehow that turns into something as simple as lifting a finger, and I just want to understand that whole chain and then actually build something that recreates it.
        </p>
        <p>
          So far most of my work has been on the engineering side, building spiking hardware and neuromorphic systems, but I&apos;ve been trying to grow the neuroscience side of me too, since I don’t want to build brain-inspired systems without really understanding the brain first. That in-between space is where I want to keep working, moving back and forth between the two instead of settling into just one.
        </p>
        <p>
          Going forward I want my research to focus on decoding neural activity, especially motor signals, and connecting that directly to how we design low-power neuromorphic systems. I want my master&apos;s to be built around this same direction too, so I can keep growing both sides at the same time.
        </p>
        <p>
          What I want to get out of all this, long term, is pretty simple. I want someone using a prosthetic hand, or someone with a neurological condition, to be able to control a device in a way that feels natural and doesn&apos;t wear them out. That&apos;s the whole point for me, and I hope one day this work actually reaches the people who need it.
        </p>
      </div>

      <div className="research-posters-section">
        <header className="section-heading">
          <h2>My Posters</h2>
        </header>

        <div className="poster-grid">
          <article
            className="poster-card"
            onClick={() => setSelectedResearch(researchDetailFPGA)}
            style={{ cursor: "pointer" }}
          >
            <div className="poster-art" style={{ "--poster": "#bf4d31", "--arrow-hover": "#606060" }}>
              <span className="poster-num">01</span>
              <strong>FPGA-Based Biosignal Processing</strong>
              <p className="poster-art-desc">
                Design of a custom SystemVerilog LIF-SNN accelerator on Xilinx Zynq with dual-port BRAM and 64-channel EEG/EMG spike encoding.
              </p>
              <span className="poster-card-arrow">↗</span>
            </div>
            <div className="card-meta">
              <span>Undergraduate Thesis</span>
              <time>2026</time>
            </div>
          </article>

          <article className="poster-card">
            <div className="poster-art" style={{ "--poster": "#2d5a43", "--arrow-hover": "#606060" }}>
              <span className="poster-num">02</span>
              <strong>Upcoming in Master</strong>
              <p className="poster-art-desc">
                Hopefully, once I start my Master&apos;s at the program I want, I&apos;ll be filling this spot with my thesis work.
              </p>
              <span className="poster-card-arrow">↗</span>
            </div>
            <div className="card-meta">
              <span>Master&apos;s Thesis</span>
              <time>2026+</time>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

function ProjectsPage() {
  return (
    <section className="page content-section projects-section">
      <header className="section-heading">
        <h2>Projects</h2>
        <p style={{ color: "#999999", fontWeight: "300", fontSize: "15px", lineHeight: "1.65", maxWidth: "680px", margin: "14px 0 0" }}>
          A collection of projects I&apos;ve built over the last few years.
        </p>
      </header>
      <div className="project-list">
        {projects.map((project) => (
          <article className="project-row" key={project.title}>
            <span className="project-number">{project.number}</span>
            <div>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
            </div>
            <div className="project-meta">
              <span>{project.kind}</span>
              <span className="project-year-arrow">
                <time>{project.year}</time>
                <span className="project-arrow">↗</span>
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function PaperDetailPage({ paper, onBack }) {
  if (!paper || !paper.details) return null;
  const { details } = paper;

  return (
    <section className="page content-section paper-detail-page">
      <div style={{ width: "100%", maxWidth: "896px", margin: "0 auto" }}>
        <button
          onClick={onBack}
          style={{
            background: "none",
            border: "none",
            color: "var(--muted)",
            fontSize: "14px",
            cursor: "pointer",
            marginBottom: "32px",
            padding: 0,
            display: "inline-flex",
            alignItems: "center",
            gap: "6px"
          }}
        >
          ← Back to Literature Review
        </button>

        <header className="paper-detail-header" style={{ marginBottom: "40px" }}>
          <span className="paper-badge" style={{ color: "#707070", fontSize: "13px", letterSpacing: ".05em", textTransform: "uppercase" }}>
            {paper.kind} · {paper.year}
          </span>
          <h1 style={{ fontSize: "32px", fontWeight: "600", color: "#f0f0f0", margin: "12px 0 16px", lineHeight: "1.25" }}>
            {paper.title}
          </h1>
          <div style={{ color: "#a0a0a0", fontSize: "14px", lineHeight: "1.6", marginBottom: "20px" }}>
            <p style={{ margin: "0 0 4px" }}><strong>Authors:</strong> {paper.authors}</p>
            <p style={{ margin: 0 }}><strong>Publication:</strong> {paper.publication}</p>
          </div>
          <a
            href={paper.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-inline-link"
            style={{ fontSize: "14px", display: "inline-flex", alignItems: "center", gap: "6px" }}
          >
            Open Source Page ↗
          </a>
        </header>

        <div className="paper-detail-content" style={{ display: "flex", flexDirection: "column", gap: "36px", color: "#b0b0b0", fontSize: "15px", lineHeight: "1.65" }}>
          {details.whyReading && (
            <div className="paper-detail-section">
              <h2 style={{ fontSize: "20px", fontWeight: "600", color: "#e0e0e0", margin: "0 0 12px", borderBottom: "1px solid #303030", paddingBottom: "8px" }}>
                Why am I reading this?
              </h2>
              <p style={{ margin: 0 }}>{details.whyReading}</p>
            </div>
          )}

          {details.concepts && details.concepts.length > 0 && (
            <div className="paper-detail-section">
              <h2 style={{ fontSize: "20px", fontWeight: "600", color: "#e0e0e0", margin: "0 0 16px", borderBottom: "1px solid #303030", paddingBottom: "8px" }}>
                Main Concepts &amp; Takeaways
              </h2>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "16px" }}>
                {details.concepts.map((concept, idx) => (
                  <li key={idx} style={{ paddingLeft: "16px", borderLeft: "2px solid #404040" }}>
                    <strong style={{ color: "#e0e0e0", display: "block", marginBottom: "4px" }}>
                      {concept.heading}
                    </strong>
                    <span>{concept.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {details.connection && (
            <div className="paper-detail-section">
              <h2 style={{ fontSize: "20px", fontWeight: "600", color: "#e0e0e0", margin: "0 0 12px", borderBottom: "1px solid #303030", paddingBottom: "8px" }}>
                Connection to My Work
              </h2>
              <p style={{ margin: 0 }}>{details.connection}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function ReviewsPage() {
  const [selectedPaper, setSelectedPaper] = useState(null);

  if (selectedPaper) {
    return <PaperDetailPage paper={selectedPaper} onBack={() => setSelectedPaper(null)} />;
  }

  return (
    <section className="page content-section reviews-section">
      <header className="section-heading">
        <h2>Literature Review</h2>
        <p style={{ color: "#999999", fontWeight: "300", fontSize: "15px", lineHeight: "1.65", maxWidth: "680px", margin: "14px 0 0" }}>
          My notes and personal synthesis of foundational papers and textbooks in computational neuroscience, SNN algorithms, and neuromorphic engineering. Reading these helps me make sure the digital hardware accelerators and decoding pipelines I design are actually grounded in biological principles.
        </p>
      </header>

      {literatureCategories.map((category) => (
        <div className="literature-category-block" key={category.title}>
          <header className="literature-category-header">
            <h3>{category.title}</h3>
            <p>{category.subtitle}</p>
          </header>
          <div className="literature-paper-list">
            {category.papers.map((item) => (
              <article
                className="literature-paper-row"
                key={item.title}
                onClick={() => item.details && setSelectedPaper(item)}
                style={{ cursor: item.details ? "pointer" : "default" }}
              >
                <span className="literature-bullet">•</span>
                <div>
                  <h3>
                    <span style={{ color: "inherit", textDecoration: "none" }}>
                      {item.title}
                    </span>
                  </h3>
                </div>
                <div className="project-meta" style={{ justifyContent: "flex-end" }}>
                  <span className="project-year-arrow">
                    <time>{item.year}</time>
                    <span
                      className="project-arrow"
                      style={{ textDecoration: "none", cursor: "pointer" }}
                    >
                      ↗
                    </span>
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}

function CvPage() {
  return (
    <section className="page cv-page" aria-label="Curriculum Vitae">
      <article className="cv-content">
        <header className="cv-heading">
          <h1>Curriculum Vitae</h1>
          <p>
            Electrical Engineering Student &amp; Computational Neuroscience / Neuromorphic Hardware Researcher.
          </p>
        </header>

        <section className="cv-section">
          <h2>Education</h2>
          <div className="cv-item">
            <div className="cv-item-header">
              <h3>Istanbul Technical University</h3>
              <time>Jun 2021 — Jun 2026</time>
            </div>
            <p className="cv-org">B.Sc. in Electrical Engineering — Istanbul, Türkiye</p>
            <p>GPA: 3.30 / 4.00 · Class Rank: Top 10% of class.</p>
          </div>
        </section>

        <section className="cv-section">
          <h2>Research &amp; Professional Experience</h2>
          <div className="cv-item">
            <div className="cv-item-header">
              <h3>Imperial College London</h3>
              <time>May 2026 — Present</time>
            </div>
            <p className="cv-org">Summer Intern, Kozlov Lab, Department of Bioengineering — London, UK</p>
            <p>Developing a hybrid CNN–ViT architecture with a differentiable gating layer for CIFAR-10, achieving 89.1% test accuracy outperforming baseline models.</p>
          </div>
          <div className="cv-item">
            <div className="cv-item-header">
              <h3>Armes Neuroengineering</h3>
              <time>Jun 2025 — Aug 2025</time>
            </div>
            <p className="cv-org">Embedded Systems Engineer Intern — Istanbul, Türkiye</p>
            <p>Profiled and optimized embedded C firmware interfacing with neuromorphic silicon, reducing host-to-chip command latency by 38%.</p>
          </div>
          <div className="cv-item">
            <div className="cv-item-header">
              <h3>Max Planck Institute for Human Cognitive and Brain Sciences</h3>
              <time>Jun 2024 — Sep 2024</time>
            </div>
            <p className="cv-org">Research Intern, Neural Data Science Group — Leipzig, Germany</p>
            <p>Developed a modular, physics-informed MRI simulation pipeline generating multi-coil k-space data and quantitative maps with B0/B1 inhomogeneities.</p>
          </div>
          <div className="cv-item">
            <div className="cv-item-header">
              <h3>ITU VLSI CAD Design Laboratory</h3>
              <time>Dec 2023 — May 2024</time>
            </div>
            <p className="cv-org">Undergraduate Research Assistant — Istanbul, Türkiye</p>
            <p>Designed a real-time SystemVerilog FPGA pipeline on Xilinx Zynq for 128×128 DVS gesture recognition with 16-bit fixed-point inference.</p>
          </div>
          <div className="cv-item">
            <div className="cv-item-header">
              <h3>Analog Devices</h3>
              <time>Jun 2023 — Aug 2023</time>
            </div>
            <p className="cv-org">Digital Design / FPGA Engineering Intern — Istanbul, Türkiye</p>
            <p>Redesigned timing-critical FPGA/SoC datapaths using asynchronous Sutherland micropipelines, boosting maximum operating frequency from 480 MHz to over 800 MHz (67% speedup).</p>
          </div>
        </section>

        <section className="cv-section">
          <h2>Technical Skills &amp; Languages</h2>
          <div className="cv-skills-grid">
            <div>
              <h4>Hardware Design &amp; EDA</h4>
              <p>RTL Design, SystemVerilog / Verilog, FPGA Acceleration (Xilinx Zynq), AXI4-Stream, Synopsys VCS / DC / PT</p>
            </div>
            <div>
              <h4>Neuromorphic &amp; Software</h4>
              <p>SNNs (Loihi 2), Event Cameras (DVS / AER), Python (PyTorch), C, RISC-V Assembly</p>
            </div>
            <div>
              <h4>Languages</h4>
              <p>Azerbaijani (Native), Turkish (Native / Fluent), English (Fluent)</p>
            </div>
          </div>
        </section>

        <hr />
        <footer>
          <p>© 2026 {profile.name}</p>
          <a href={`mailto:${profile.email}`}>Contact via Email ↗</a>
        </footer>
      </article>
    </section>
  );
}

function NowPage() {
  return (
    <section className="page now-page">
      <article className="now-content">
        <h1>What I&apos;m Doing Now</h1>
        <p>
          <em>
            This is a{" "}
            <a href="https://nownownow.com/about" target="_blank" rel="noreferrer">
              now page
            </a>
            , inspired by Derek Sivers.
          </em>
        </p>
        <p>Currently in: 🇬🇧 London, United Kingdom</p>

        <h3>Research Internship at Imperial</h3>
        <p>
          Most of my time right now goes into my internship at the Department of Bioengineering,
          Imperial College London. I&apos;m working on hybrid neural network architectures,
          specifically combining convolutional and transformer-based models for classification tasks.
          It&apos;s been a great way to get closer to computational neuroscience from the software side
          while keeping my hardware instincts sharp.
        </p>

        <h3>Preparing My NSC Application</h3>
        <p>
          I&apos;m applying to the MSc Neural Systems and Computation program at UZH and ETH Zürich.
          Been reading a lot about INI&apos;s research, reached out to a few professors, and had some
          really good conversations. Still figuring out exactly where I fit in, but the more I dig
          into it, the more it makes sense.
        </p>

        <h3>Reading</h3>
        <p>
          Working through theoretical neuroscience material to bridge my hardware background with
          the biological side of things. The gap between silicon and biology is smaller than
          you&apos;d think, yet also much larger.
        </p>

        <h3>Training</h3>
        <p>
          This year, I&apos;m focusing on speed, mobility, endurance, and strength.
          Check out my <a href="#training">Training</a> and{" "}
          <a href="#home">2026 Goals</a>.
        </p>

        <hr />
        <p><em>Last updated: July 2026</em></p>
      </article>
    </section>
  );
}

const stuffLinks = [
  ["books", "Books", "What I’ve been reading"],
  ["tools", "Tools", "Hardware and gear I use daily"],
  ["goals", "2026 Goals", "What I want to accomplish this year"],
];

const goals2026 = [
  "Box for 3+ months",
  "Graduate",
  "Earn a 3.3+ GPA",
  "Get an internship",
  "Earn $2,000+/month",
  "Win a State Scholarship",
  "Choose a good university for my master's",
  "Keep going to the gym",
  "Stick to my routine 60% of the time",
  "Visit one new country",
  "Buy a watch",
  "Finish 5+ books",
  "Finish Deep Work",
  "Remember birthdays",
];

const toolSections = [
  {
    title: "Workstation",
    items: [
      ["iPhone 15", "Everyday phone and camera"],
      ['MacBook Air 13" M2', "Main machine for study and personal work"],
      ["DELL G15", "Work computer"],
    ],
  },
  {
    title: "Technical Stack",
    items: [
      ["Fragment", "Interface structure and layout"],
      ["SvelteKit", "Web application framework"],
      ["THREE.js", "Interactive 3D experiences"],
      ["Vite", "Development and build tooling"],
      ["Loihi 2", "On-chip SNN inference"],
      ["Verilog/SystemVerilog", "FPGA RTL and accelerator design"],
      ["Synopsys VCS/DC/PT", "Simulation, synthesis, and timing"],
      ["Python", "ML pipelines and research tooling"],
      ["C", "Embedded firmware and device interfaces"],
      ["RISC-V Assembly", "Low-level embedded programming"],
      ["Tcl", "EDA workflow automation"],
    ],
  },
  {
    title: "Running & Training",
    items: [
      ["Altra Running Shoes", "Zero-drop because I want strong calves and it feels natural"],
      ["Adidas Adizero Boston", "Because they feel fast"],
      ["Garmin Fenix 7 Pro", "Love this thing"],
    ],
  },
];

function ToolRow({ name, description }) {
  return (
    <div className={`tool-row${description ? "" : " tool-row--solo"}`}>
      <strong>{name}</strong>
      <span className="tool-dot-line" aria-hidden="true" />
      {description && <span>{description}</span>}
    </div>
  );
}

function ToolsPage({ navigate }) {
  return (
    <section className="page tools-page">
      <div className="tools-content">
        <header className="tools-heading">
          <h1>Tools I Use</h1>
          <p>Hardware, software, and gear that I rely on daily.</p>
        </header>

        <div className="tool-sections">
          {toolSections.map((section) => (
            <section className="tool-section" key={section.title}>
              <h2>{section.title}</h2>
              {section.description && <p>{section.description}</p>}
              <div className="tool-list">
                {section.items.map(([name, description]) => (
                  <ToolRow name={name} description={description} key={name} />
                ))}
              </div>
              {section.link && (
                <button className="tool-photo-link" onClick={() => navigate("posters")} type="button">
                  See my photos →
                </button>
              )}
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}

function StuffPage({ navigate }) {
  return (
    <section className="page stuff-page">
      <div className="stuff-content">
        <header className="stuff-heading">
          <h1>Stuff</h1>
          <p>Other things I’m into.</p>
        </header>

        <div className="stuff-links">
          {stuffLinks.map(([page, title, description]) => (
            <button
              className="stuff-row"
              key={title}
              onClick={() => navigate(page)}
              type="button"
            >
              <strong>{title}</strong>
              <span className="stuff-dot-line" aria-hidden="true" />
              <span>{description}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function GoalsPage() {
  return (
    <section className="page goals-page">
      <div className="goals-content">
        <header className="goals-heading">
          <h1>2026 Goals</h1>
          <p>Study, work, health and life goals for the year</p>
          <p>8/14 completed</p>
        </header>

        <div className="goals-grid">
          {goals2026.map((goal) => {
            const completed = [
              "Finish Deep Work",
              "Win a State Scholarship",
              "Keep going to the gym",
              "Stick to my routine 60% of the time",
              "Visit one new country",
              "Graduate",
              "Earn a 3.3+ GPA",
              "Get an internship",
            ].includes(goal);

            return (
              <div
                className={completed ? "goal-cell is-completed" : "goal-cell"}
                key={goal}
              >
                <span>{goal}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function PlaceholderPage({ title }) {
  return (
    <section className="page placeholder-page">
      <p className="section-label">Archive / Coming soon</p>
      <h2>{title}</h2>
      <p>This page is ready for your content.</p>
    </section>
  );
}

export default function App() {
  const [activePage, setActivePage] = useState(getPageFromHash);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onHashChange = () => setActivePage(getPageFromHash());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const navigate = (page) => {
    window.location.hash = `/${page}`;
    setActivePage(page);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  return (
    <div className="site-shell">
      <CurlyCursor />
      <PageInspector pageKey={activePage} />
      <aside className={menuOpen ? "sidebar is-open" : "sidebar"}>
        <button className="mobile-close" onClick={() => setMenuOpen(false)} aria-label="Close menu">Close</button>
        <button className="monogram" onClick={() => navigate("home")} aria-label="Nijat Mahmudov - Go to homepage" type="button">
          <img src={brandLogo} alt="" />
        </button>
        <nav aria-label="Main navigation">
          {pages.map(([id, label]) => {
            const isActive =
              activePage === id ||
              (["books", "goals"].includes(activePage) && id === "stuff") ||
              (activePage === "posters" && id === "research");

            return (
              <button key={id} className={isActive ? "nav-link active" : "nav-link"} onClick={() => navigate(id)}>
                {label}
              </button>
            );
          })}
        </nav>
        <div className="side-note"><span>Selected work</span><span>2024—26</span></div>
      </aside>

      <button className="mobile-menu" onClick={() => setMenuOpen(true)} aria-label="Open menu">Menu</button>
      {menuOpen && <button className="backdrop" aria-label="Close menu" onClick={() => setMenuOpen(false)} />}

      <main>
        {activePage === "home" && <HomePage navigate={navigate} />}
        {activePage === "now" && <NowPage />}
        {activePage === "map" && <TravelMap />}
        {activePage === "training" && <TrainingPage />}
        {activePage === "books" && <BooksPage />}
        {activePage === "goals" && <GoalsPage />}
        {activePage === "tools" && <ToolsPage navigate={navigate} />}
        {activePage === "stuff" && <StuffPage navigate={navigate} />}
        {(activePage === "research" || activePage === "posters") && <ResearchPage />}
        {activePage === "projects" && <ProjectsPage />}
        {activePage === "reviews" && <ReviewsPage />}
        {activePage === "cv" && <CvPage />}
        {!["home", "now", "map", "training", "books", "goals", "tools", "stuff", "research", "posters", "projects", "reviews", "cv"].includes(activePage) && (
          <PlaceholderPage title={pages.find(([id]) => id === activePage)?.[1] ?? "Page"} />
        )}
      </main>
    </div>
  );
}
