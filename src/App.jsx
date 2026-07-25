import { useEffect, useState } from "react";
import { books, goals, posters, profile, projects, quests, reviews, updates } from "./content";

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
        <section id="home" className="home-page section">
          <div className="home-intro">
            <h1>{profile.name}</h1>
            <div className="intro-copy">
              <p>{profile.intro}</p>
              <p>{profile.secondary}</p>
              <p>{profile.current}</p>
            </div>
            <div className="contact-row">
              <a href="#social">X</a>
              <a href="#social">Instagram</a>
              <a href="#social">LinkedIn</a>
              <span className="separator">·</span>
              <a href={`mailto:${profile.email}`}>{profile.email}</a>
              <a href={`mailto:${profile.email}`}>Send a message</a>
            </div>
          </div>

          <section className="home-block updates">
            <p className="section-label">Recently updated</p>
            {updates.map((item) => (
              <button className="update-row" onClick={() => goTo("projects")} key={item.title}>
                <strong>{item.title}</strong>
                <span className="dot-line" />
                <time>{item.date}</time>
              </button>
            ))}
            <button className="text-link" onClick={() => goTo("projects")}>All posts →</button>
          </section>

          <div className="home-columns home-block">
            <section className="training">
              <p className="section-label">Latest activity</p>
              <div className="activity-card">
                <span className="activity-icon" aria-hidden="true">✦</span>
                <div>
                  <strong>Current project <em>02</em></strong>
                  <p>Sat, Jul 25 · Visual research · Ongoing</p>
                </div>
                <span className="activity-arrow">→</span>
              </div>
            </section>

            <section className="reading">
              <p className="section-label">2026 reading</p>
              <div className="book-strip">
                {books.map((book) => (
                  <article className="book" key={book.title}>
                    <img src={book.cover} alt="" />
                    <p>{book.title}</p>
                  </article>
                ))}
              </div>
              <button className="text-link" onClick={() => goTo("reviews")}>All books →</button>
            </section>
          </div>

          <section className="home-block goals">
            <p className="section-label">2026 goals</p>
            <div className="goal-list">
              {goals.map((goal) => <span key={goal}>{goal}</span>)}
            </div>
            <a className="muted-link" href="#quests">View all goals →</a>
          </section>

          <section id="quests" className="home-block quests">
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
