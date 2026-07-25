"use client";

import { useEffect, useState } from "react";
import { posters, profile, projects, reviews, updates } from "./content";

const navigation = [
  ["home", "Home"],
  ["posters", "My Posters"],
  ["projects", "Workshops & Projects"],
  ["reviews", "Literature Review"],
];

export default function Home() {
  const [active, setActive] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-20% 0px -55% 0px", threshold: [0.05, 0.3, 0.6] }
    );
    navigation.forEach(([id]) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });
    return () => observer.disconnect();
  }, []);

  const goTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <div className="site-shell">
      <aside className={menuOpen ? "sidebar is-open" : "sidebar"}>
        <button className="mobile-close" onClick={() => setMenuOpen(false)} aria-label="Close menu">
          Close
        </button>
        <div className="monogram" aria-hidden="true">NM</div>
        <nav aria-label="Main navigation">
          {navigation.map(([id, label]) => (
            <button
              key={id}
              className={active === id ? "nav-link active" : "nav-link"}
              onClick={() => goTo(id)}
            >
              {label}
            </button>
          ))}
        </nav>
        <div className="side-note">
          <span>Selected work</span>
          <span>2024—26</span>
        </div>
      </aside>

      <button className="mobile-menu" onClick={() => setMenuOpen(true)} aria-label="Open menu">
        Menu
      </button>
      {menuOpen && <button className="backdrop" aria-label="Close menu" onClick={() => setMenuOpen(false)} />}

      <main>
        <section id="home" className="hero section">
          <p className="eyebrow">{profile.eyebrow}</p>
          <h1>{profile.name}</h1>
          <div className="intro">
            <p>{profile.intro}</p>
            <p>{profile.secondary}</p>
          </div>
          <div className="contact-row">
            <a href={`mailto:${profile.email}`}>{profile.email}</a>
            <span>{profile.location}</span>
          </div>

          <div className="updates">
            <p className="section-label">Recently updated</p>
            {updates.map((item) => (
              <a href="#projects" className="update-row" key={item.title}>
                <strong>{item.title}</strong>
                <span className="dot-line" />
                <time>{item.date}</time>
              </a>
            ))}
          </div>
          <button className="text-link" onClick={() => goTo("projects")}>See selected work →</button>
        </section>

        <section id="posters" className="section content-section">
          <header className="section-heading">
            <p className="section-label">01 / Archive</p>
            <h2>My Posters</h2>
            <p>A selection of typographic and image-based experiments.</p>
          </header>
          <div className="poster-grid">
            {posters.map((poster, index) => (
              <article className="poster-card" key={poster.title}>
                <div className="poster-art" style={{ "--poster": poster.color }}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{poster.title}</strong>
                  <small>NICAT — VISUAL STUDY</small>
                </div>
                <div className="card-meta"><span>{poster.title}</span><time>{poster.year}</time></div>
              </article>
            ))}
          </div>
        </section>

        <section id="projects" className="section content-section">
          <header className="section-heading">
            <p className="section-label">02 / Selected work</p>
            <h2>Workshops &amp; Projects</h2>
            <p>Collaborative formats, visual research, and independent experiments.</p>
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
                  <time>{project.year}</time>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="reviews" className="section content-section reviews-section">
          <header className="section-heading">
            <p className="section-label">03 / Reading notes</p>
            <h2>Literature Review</h2>
            <p>Short observations from books, essays, and other materials.</p>
          </header>
          <div className="review-list">
            {reviews.map((review, index) => (
              <article className="review-row" key={review.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div><h3>{review.title}</h3><p>{review.author}</p></div>
                <p>{review.note}</p>
                <span>↗</span>
              </article>
            ))}
          </div>
          <footer>
            <p>© 2026 {profile.name}</p>
            <a href={`mailto:${profile.email}`}>Say hello ↗</a>
          </footer>
        </section>
      </main>
    </div>
  );
}

