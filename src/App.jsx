import { useEffect, useState } from "react";
import { books, goals, posters, profile, projects, quests, reviews, updates } from "./content";
import GlobeCard from "./GlobeCard";
import TravelMap from "./TravelMap";
import TrainingPage from "./TrainingPage";
import BooksPage from "./BooksPage";
import brandLogo from "./assets/nm-logo.png";

const pages = [
  ["home", "Home"],
  ["now", "Now"],
  ["posters", "My Posters"],
  ["projects", "Projects"],
  ["reviews", "Literature Review"],
  ["map", "Map"],
  ["tools", "Tools"],
  ["training", "Training"],
  ["stuff", "Stuff"],
];

const pageIds = new Set([...pages.map(([id]) => id), "books", "goals"]);

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
        <h1>{profile.name}</h1>
        <div className="intro-copy">
          <p>{profile.intro}</p>
          <p>{profile.secondary}</p>
          <p>{profile.current}</p>
        </div>

        <div id="social" className="contact-row">
          <a href="#social"><Icon name="instagram" /><span>Instagram</span></a>
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
          <button className="text-link" onClick={() => navigate("books")}>All books →</button>
        </section>
      </div>

      <section className="home-block goals">
        <p className="section-label">2026 goals</p>
        <div className="goal-list">
          {goals.map((goal) => <span key={goal}>{goal}</span>)}
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

function NowPage() {
  return (
    <section className="page now-page">
      <article className="now-content">
        <h1>What I’m Doing Now</h1>
        <p>
          <em>
            This is a{" "}
            <a href="https://nownownow.com/about" target="_blank" rel="noreferrer">
              now page
            </a>
            , inspired by Derek Sivers.
          </em>
        </p>
        <p>Currently in: 🇵🇹 Portugal</p>

        <h3>Building Screvi</h3>
        <p>Most of my time goes into Screvi.</p>
        <p>
          I’m building it to be the best way to collect, organize, and actually
          remember your book, article and social media highlights.
        </p>
        <p>
          If you read a lot or spend a lot of time on the internet, maybe it
          could be useful to you,{" "}
          <a href="https://screvi.com/?ref=araujo.zip" target="_blank" rel="noreferrer">
            give it a try
          </a>
          .
        </p>

        <h3>Training</h3>
        <p>
          This year, I’m focusing on speed, mobility, endurance, and strength.
          Check out my <a href="#training">Training</a> and{" "}
          <a href="#home">2026 Goals</a>.
        </p>

        <hr />
        <p><em>Last updated: March 2026</em></p>
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
  "Sub 20m 5k",
  "Multi day hike",
  "100kg x5 bench press",
  "Front splits",
  "Pancake",
  "Master backstroke",
  "Painless right hip",
  "Fix click on left shoulder",
  "Solo long day hike/run",
  "Smooth handstand press",
  "Master 3 knots",
  "Pull up +45kg",
  "Ultra race",
  "5x Pistol squat",
  "Surf a proper wave",
  "Host and cook dinner for friends/family",
  "Race abroad",
  "100 Sleep score on Garmin",
  "Coffee/beer with 5 internet friends",
  "Learn to loud whistle",
  "Memorize a poem",
  "48h fast",
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
          <p>Trying to get strong, fast and flexible at the same time</p>
          <p>1/22 completed</p>
        </header>

        <div className="goals-grid">
          {goals2026.map((goal) => {
            const completed = goal === "Pull up +45kg";

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
      <aside className={menuOpen ? "sidebar is-open" : "sidebar"}>
        <button className="mobile-close" onClick={() => setMenuOpen(false)} aria-label="Close menu">Close</button>
        <div className="monogram" aria-label="Nijat Mahmud">
          <img src={brandLogo} alt="" />
          <span>NM</span>
        </div>
        <nav aria-label="Main navigation">
          {pages.map(([id, label]) => {
            const isActive =
              activePage === id ||
              (["books", "goals"].includes(activePage) && id === "stuff");

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
        {activePage === "posters" && <PostersPage />}
        {activePage === "projects" && <ProjectsPage />}
        {activePage === "reviews" && <ReviewsPage />}
        {!["home", "now", "map", "training", "books", "goals", "tools", "stuff", "posters", "projects", "reviews"].includes(activePage) && (
          <PlaceholderPage title={pages.find(([id]) => id === activePage)?.[1] ?? "Page"} />
        )}
      </main>
    </div>
  );
}
