import { useEffect, useMemo, useRef, useState } from "react";
import booksReference from "./references/books/page.html?raw";
import booksReferenceStyles from "./references/books/reference.css?raw";
import booksFontStyles from "./references/books/font.css?raw";
import contentCover from "./assets/books/highlight-cover.jpg";

const coverModules = import.meta.glob("./assets/books/covers/*.jpg", {
  eager: true,
  query: "?url",
  import: "default",
});

const FRAME_MESSAGE = "nicat-books-frame-height";

function replaceSavedCoverPaths(html) {
  let result = html.replaceAll("./Books _ Pedro Araújo_files/content", contentCover);

  Object.entries(coverModules).forEach(([path, url]) => {
    const filename = path.split("/").pop();
    result = result.replaceAll(`./Books _ Pedro Araújo_files/${filename}`, url);
  });

  return result;
}

function createBooksDocument() {
  const cleanedReference = replaceSavedCoverPaths(booksReference)
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(
      /<link[^>]+(?:href="\.\/Books _ Pedro Araújo_files\/[^"]+"|href="chrome-extension:\/\/[^"]+")[^>]*>/g,
      ""
    );

  const frameStyles = `
    <style>
      ${booksFontStyles}
      ${booksReferenceStyles}

      html.dark,
      html.dark body {
        background: #191919 !important;
      }

      html,
      body {
        --font-mono: "Space Grotesk", sans-serif;
        min-width: 0 !important;
        overflow-x: hidden !important;
        scrollbar-width: none;
      }

      body::-webkit-scrollbar {
        display: none;
      }
    </style>
  `;

  const frameSetup = `
    <script>
      (() => {
        const frameMessage = "${FRAME_MESSAGE}";

        function prepareBooksPage() {
          const booksIsland = document.querySelector(
            'astro-island[component-url*="/Books."]'
          );
          const pageRoot = booksIsland?.closest(
            ".min-h-screen.overflow-x-hidden"
          );

          if (!pageRoot) {
            window.setTimeout(prepareBooksPage, 30);
            return;
          }

          document.documentElement.classList.add("dark");
          document.body.replaceChildren(pageRoot);

          const reportHeight = () => {
            const height = Math.ceil(
              Math.max(
                pageRoot.scrollHeight,
                pageRoot.getBoundingClientRect().height,
                document.documentElement.scrollHeight
              )
            );
            window.parent.postMessage({ type: frameMessage, height }, "*");
          };

          new ResizeObserver(reportHeight).observe(pageRoot);
          window.addEventListener("resize", reportHeight);

          window.addEventListener(
            "wheel",
            (event) => {
              window.parent.scrollBy({
                top: event.deltaY,
                left: event.deltaX,
                behavior: "auto"
              });
              event.preventDefault();
            },
            { passive: false }
          );

          let previousTouchY = null;
          window.addEventListener(
            "touchstart",
            (event) => {
              previousTouchY = event.touches[0]?.clientY ?? null;
            },
            { passive: true }
          );
          window.addEventListener(
            "touchmove",
            (event) => {
              const currentTouchY = event.touches[0]?.clientY;
              if (previousTouchY === null || currentTouchY === undefined) return;
              window.parent.scrollBy(0, previousTouchY - currentTouchY);
              previousTouchY = currentTouchY;
              event.preventDefault();
            },
            { passive: false }
          );
          window.addEventListener("touchend", () => {
            previousTouchY = null;
          });

          window.setTimeout(reportHeight, 0);
          window.setTimeout(reportHeight, 300);
          window.setTimeout(reportHeight, 1200);
        }

        prepareBooksPage();
      })();
    </script>
  `;

  return cleanedReference
    .replace("</head>", `${frameStyles}</head>`)
    .replace("</body>", `${frameSetup}</body>`);
}

export default function BooksPage() {
  const frameRef = useRef(null);
  const [height, setHeight] = useState(1000);
  const source = useMemo(createBooksDocument, []);

  useEffect(() => {
    const receiveHeight = (event) => {
      if (event.source !== frameRef.current?.contentWindow) return;
      if (event.data?.type !== FRAME_MESSAGE) return;

      const nextHeight = Number(event.data.height);
      if (Number.isFinite(nextHeight) && nextHeight > 500) {
        setHeight(nextHeight);
      }
    };

    window.addEventListener("message", receiveHeight);
    return () => window.removeEventListener("message", receiveHeight);
  }, []);

  return (
    <section className="page books-page" aria-label="Books">
      <iframe
        ref={frameRef}
        className="books-reference-frame"
        title="Books"
        srcDoc={source}
        style={{ height }}
        scrolling="no"
      />
    </section>
  );
}
