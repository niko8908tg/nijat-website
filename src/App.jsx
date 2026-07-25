import { useEffect, useState } from "react";
import { books, goals, posters, profile, projects, quests, reviews, updates } from "./content";

const pages = [
  ["home", "Home"],
  ["posters", "My Posters"],
  ["projects", "Workshops & Projects"],
  ["reviews", "Literature Review"],
];

function getPageFromHash() {
  const page = window.location.hash.replace("#/", "");
  return pages.some(([id]) => id === page) ? page : "home";
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
      <div className="home-intro">
        <h1>{profile.name}</h1>
        <div className="intro-copy">
          <p>{profile.intro}</p>
          <p>{profile.secondary}</p>
          <p>{profile.current}</p>
        </div>

        <div id="social" className="contact-row">
          <a href="#social"><Icon name="x" /><span>X</span></a>
          <a href="#social"><Icon name="instagram" /><span>Instagram</span></a>
          <a href="#social"><Icon name="bookmark" /><span>Substack</span></a>
          <a href="#social"><Icon name="rss" /><span>RSS</span></a>
          <span className="separator">·</span>
          <a href={`mailto:${profile.email}`}>{profile.email}</a>
          <a href={`mailto:${profile.email}`}>Send a message</a>
        </div>
      </div>

      <section className="home-block updates">
        <p className="section-label">Recently updated</p>
        {updates.map((item) => (
          <button className="update-row" onClick={() => navigate("projects")} key={item.title}>
            <strong>{item.title}</strong>
            <span className="dot-line" />
            <time>{item.date}</time>
          </button>
        ))}
        <button className="text-link" onClick={() => navigate("projects")}>All posts →</button>
      </section>

      <div className="home-columns home-block">
        <section className="training">
          <p className="section-label">Latest training</p>
          <div className="activity-card">
            <span className="activity-icon" aria-hidden="true">♟</span>
            <div>
              <strong>Pool Swim <em>Z2</em></strong>
              <p>Thu, Jul 23 · Pool Swim · 0m</p>
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
          <button className="text-link" onClick={() => navigate("reviews")}>All books →</button>
        </section>
      </div>

      <section className="home-block goals">
        <p className="section-label">2026 goals</p>
        <div className="goal-list">
          {goals.map((goal) => <span key={goal}>{goal}</span>)}
        </div>
        <a className="muted-link" href="#goals">View all goals →</a>
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
    </section>
  );
}

function PostersPage() {
  return (
    <section className="page content-section">
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
  );
}

function ProjectsPage() {
  return (
    <section className="page content-section">
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
            <div className="project-meta"><span>{project.kind}</span><time>{project.year}</time></div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ReviewsPage() {
  return (
    <section className="page content-section reviews-section">
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
      <footer><p>© 2026 {profile.name}</p><a href={`mailto:${profile.email}`}>Say hello ↗</a></footer>
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
      <aside className={menuOpen ? "sidebar is-open" : "sidebar"}>
        <button className="mobile-close" onClick={() => setMenuOpen(false)} aria-label="Close menu">Close</button>
        <div className="monogram" aria-hidden="true">NM</div>
        <nav aria-label="Main navigation">
          {pages.map(([id, label]) => (
            <button key={id} className={activePage === id ? "nav-link active" : "nav-link"} onClick={() => navigate(id)}>
              {label}
            </button>
          ))}
        </nav>
        <div className="side-note"><span>Selected work</span><span>2024—26</span></div>
      </aside>

      <button className="mobile-menu" onClick={() => setMenuOpen(true)} aria-label="Open menu">Menu</button>
      {menuOpen && <button className="backdrop" aria-label="Close menu" onClick={() => setMenuOpen(false)} />}

      <main>
        {activePage === "home" && <HomePage navigate={navigate} />}
        {activePage === "posters" && <PostersPage />}
        {activePage === "projects" && <ProjectsPage />}
        {activePage === "reviews" && <ReviewsPage />}
      </main>
    </div>
  );
}
