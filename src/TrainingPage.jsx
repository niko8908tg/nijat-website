import { useEffect, useMemo, useRef, useState } from "react";
import trainingReference from "../Training _ Pedro Araújo.html?raw";
import trainingReferenceStyles from "../Training _ Pedro Araújo_files/_slug_.1PXzLZaY.css?raw";
import trainingFontStyles from "../Training _ Pedro Araújo_files/css2?raw";

const FRAME_MESSAGE = "nicat-training-frame-height";

function createTrainingDocument() {
  const remoteAssets = trainingReference
    .replace(
      /<script[^>]+src="\.\/Training _ Pedro Araújo_files\/[^"]+"[^>]*><\/script>/g,
      ""
    )
    .replace(
      /<link[^>]+(?:href="\.\/Training _ Pedro Araújo_files\/[^"]+"|href="chrome-extension:\/\/[^"]+")[^>]*>/g,
      ""
    )
    .replaceAll('component-url="/_astro/', 'component-url="https://araujo.zip/_astro/')
    .replaceAll('renderer-url="/_astro/', 'renderer-url="https://araujo.zip/_astro/')
    .replaceAll('src="/_astro/', 'src="https://araujo.zip/_astro/')
    .replaceAll('href="/_astro/', 'href="https://araujo.zip/_astro/');

  const frameStyles = `
    <style>
      ${trainingFontStyles}
      ${trainingReferenceStyles}

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

      .font-mono {
        font-family: "Space Grotesk", sans-serif !important;
        font-weight: 500;
      }

      .font-bold,
      .font-semibold {
        font-family: "Space Grotesk", sans-serif !important;
        font-weight: 700 !important;
      }

      body::-webkit-scrollbar {
        display: none;
      }
    </style>
  `;

  const frameSetup = `
    <script type="module">
      const frameMessage = "${FRAME_MESSAGE}";

      function prepareTrainingPage() {
        const trainingIsland = document.querySelector(
          'astro-island[component-url*="/Training."]'
        );
        const pageRoot = trainingIsland?.closest(
          ".min-h-screen.overflow-x-hidden"
        );

        if (!pageRoot) {
          window.setTimeout(prepareTrainingPage, 30);
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
        window.setTimeout(reportHeight, 250);
        window.setTimeout(reportHeight, 1200);
      }

      prepareTrainingPage();
    </script>
  `;

  return remoteAssets
    .replace("</head>", `${frameStyles}</head>`)
    .replace("</body>", `${frameSetup}</body>`);
}

export default function TrainingPage() {
  const frameRef = useRef(null);
  const [height, setHeight] = useState(900);
  const source = useMemo(createTrainingDocument, []);

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
    <section className="page training-page" aria-label="2026 Training">
      <iframe
        ref={frameRef}
        className="training-reference-frame"
        title="2026 Training"
        srcDoc={source}
        style={{ height }}
        scrolling="no"
      />
    </section>
  );
}
