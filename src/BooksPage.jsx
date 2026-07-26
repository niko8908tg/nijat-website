const coverModules = import.meta.glob("./assets/books/goodreads/*.jpg", {
  eager: true,
  query: "?url",
  import: "default",
});

const covers = Object.fromEntries(
  Object.entries(coverModules).map(([path, url]) => [
    path.split("/").pop().replace(".jpg", ""),
    url,
  ])
);

const books = [
  {
    id: "39286958",
    title: "Measure What Matters",
    author: "John Doerr",
    rating: 3,
    status: "currently-reading",
    reviewId: "8802282934",
  },
  {
    id: "170015",
    title:
      "Theoretical Neuroscience: Computational and Mathematical Modeling of Neural Systems",
    author: "Peter Dayan",
    rating: 4,
    status: "currently-reading",
    reviewId: "8802275011",
  },
  {
    id: "27793819",
    title: "Madonna in a Fur Coat",
    author: "Sabahattin Ali",
    rating: 5,
    year: 2026,
    reviewId: "8802279147",
  },
  {
    id: "170448",
    title: "Animal Farm",
    author: "George Orwell",
    rating: 4,
    year: 2026,
    reviewId: "8802278728",
  },
  {
    id: "61439040",
    title: "1984",
    author: "George Orwell",
    rating: 4,
    year: 2026,
    reviewId: "8802278610",
  },
  {
    id: "194746",
    title: "No Longer Human",
    author: "Osamu Dazai",
    rating: 4,
    year: 2026,
    reviewId: "8802278074",
  },
  {
    id: "12483882",
    title: "Schoolgirl",
    author: "Osamu Dazai",
    rating: 4,
    year: 2026,
    reviewId: "8802277878",
  },
  {
    id: "69571",
    title:
      "Rich Dad Poor Dad: What the Rich Teach Their Kids About Money—That the Poor and Middle Class Do Not!",
    author: "Robert T. Kiyosaki",
    rating: 4,
    year: 2025,
    reviewId: "8802273959",
  },
  {
    id: "30186948",
    title: "Think and Grow Rich",
    author: "Napoleon Hill",
    rating: 3,
    year: 2025,
    reviewId: "8802273507",
  },
  {
    id: "1303",
    title: "The 48 Laws of Power",
    author: "Robert Greene",
    rating: 4,
    year: 2025,
    reviewId: "8802273455",
  },
  {
    id: "40121378",
    title:
      "Atomic Habits: An Easy & Proven Way to Build Good Habits & Break Bad Ones",
    author: "James Clear",
    rating: 4,
    year: 2025,
    reviewId: "8802273408",
  },
  {
    id: "4865",
    title: "How to Win Friends & Influence People",
    author: "Dale Carnegie",
    rating: 5,
    year: 2025,
    reviewId: "8802273366",
  },
  {
    id: "41881472",
    title:
      "The Psychology of Money: Timeless Lessons on Wealth, Greed, and Happiness",
    author: "Morgan Housel",
    rating: 4,
    year: 2025,
    reviewId: "8802273316",
  },
  {
    id: "25744928",
    title: "Deep Work: Rules for Focused Success in a Distracted World",
    author: "Cal Newport",
    rating: 4,
    year: 2025,
    reviewId: "8802273197",
  },
  {
    id: "11029733",
    title: "İnsan Ne İle Yaşar?",
    author: "Leo Tolstoy",
    rating: 5,
    year: 2024,
    reviewId: "8802271799",
  },
  {
    id: "15823480",
    title: "Anna Karenina",
    author: "Leo Tolstoy",
    rating: 4,
    year: 2024,
    reviewId: "8802271433",
  },
  {
    id: "12857",
    title: "The Gambler",
    author: "Fyodor Dostoevsky",
    rating: 4,
    year: 2024,
    reviewId: "8802271011",
  },
  {
    id: "12505",
    title: "The Idiot",
    author: "Fyodor Dostoevsky",
    rating: 4,
    year: 2024,
    reviewId: "8802270790",
  },
  {
    id: "49455",
    title: "Notes from Underground",
    author: "Fyodor Dostoevsky",
    rating: 4,
    year: 2024,
    reviewId: "8802270678",
  },
  {
    id: "4934",
    title: "The Brothers Karamazov",
    author: "Fyodor Dostoevsky",
    rating: 4,
    year: 2024,
    reviewId: "8802270495",
  },
  {
    id: "7144",
    title: "Crime and Punishment",
    author: "Fyodor Dostoevsky",
    rating: 5,
    year: 2024,
    reviewId: "8802270357",
  },
];

function BookCard({ book }) {
  const bookUrl = `https://www.goodreads.com/book/show/${book.id}`;
  const filledStars = "★".repeat(book.rating);
  const emptyStars = "☆".repeat(5 - book.rating);

  return (
    <article className="goodreads-book-card">
      <a
        className="goodreads-book-card-link"
        href={bookUrl}
        target="_blank"
        rel="noreferrer"
        aria-label={`${book.title} on Goodreads`}
      />
      <img
        className="goodreads-book-cover"
        src={covers[book.id]}
        alt={`${book.title} cover`}
      />
      <h3>{book.title}</h3>
      <p>{book.author}</p>
      <div
        className="goodreads-book-rating"
        aria-label={`${book.rating} out of 5 stars`}
      >
        <span>
          {filledStars}
          <i>{emptyStars}</i>
        </span>
      </div>
    </article>
  );
}

function BookSection({ title, items }) {
  return (
    <section className="goodreads-book-section">
      <h2>
        {title} <span>· {items.length} books</span>
      </h2>
      <div className="goodreads-book-grid">
        {items.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </section>
  );
}

export default function BooksPage() {
  const currentlyReading = books.filter(
    (book) => book.status === "currently-reading"
  );

  return (
    <section className="page books-page" aria-label="Books">
      <div className="books-content">
        <header className="books-heading">
          <h1>Books</h1>
          <p>
            What I&apos;ve been reading.{" "}
            <a
              href="https://www.goodreads.com/user/show/202969002-nijat-mahmudov"
              target="_blank"
              rel="noreferrer"
            >
              Goodreads ↗
            </a>
          </p>
        </header>

        <BookSection title="Currently reading" items={currentlyReading} />
        {[2026, 2025, 2024].map((year) => (
          <BookSection
            key={year}
            title={year}
            items={books.filter((book) => book.year === year)}
          />
        ))}
      </div>
    </section>
  );
}
