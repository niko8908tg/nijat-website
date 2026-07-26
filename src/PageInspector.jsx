import { useEffect, useRef, useState } from "react";

const ACCENT = "#ff9100";
const SNAPSHOT_SELECTOR = [
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "p",
  "li",
  "blockquote",
  "pre",
  "figure",
  "img",
  "picture",
  "video",
  "iframe",
  "svg",
  "canvas",
  "button",
  "input",
  "textarea",
  "[role='button']",
].join(",");

const MEDIA_ELEMENTS = new Set([
  "FIGURE",
  "IMG",
  "PICTURE",
  "VIDEO",
  "IFRAME",
  "SVG",
  "CANVAS",
]);

const ACCENT_ELEMENTS = new Set(["BUTTON", "INPUT", "TEXTAREA"]);

const BASE_OPACITY = {
  text: 0.35,
  media: 0.15,
  accent: 0.6,
};

const SCAN_OPACITY = {
  text: 0.72,
  media: 0.42,
  accent: 1,
};

function getElementKind(element) {
  if (MEDIA_ELEMENTS.has(element.tagName)) return "media";
  if (
    ACCENT_ELEMENTS.has(element.tagName) ||
    element.getAttribute("role") === "button"
  ) {
    return "accent";
  }
  return "text";
}

function getTextRectangles(element) {
  const range = document.createRange();
  range.selectNodeContents(element);
  const rectangles = Array.from(range.getClientRects());
  return rectangles.length > 0 ? rectangles.slice(0, 200) : [element.getBoundingClientRect()];
}

function collectSnapshot() {
  const page = document.querySelector("main > *");
  if (!page) return [];

  const elements = Array.from(page.querySelectorAll(SNAPSHOT_SELECTOR));
  const elementSet = new Set(elements);
  const items = [];

  elements.forEach((element) => {
    let parent = element.parentElement;
    let nestedInsideSelectedElement = false;

    while (parent && parent !== page) {
      if (elementSet.has(parent)) {
        nestedInsideSelectedElement = true;
        break;
      }
      parent = parent.parentElement;
    }

    if (nestedInsideSelectedElement) return;

    const kind = getElementKind(element);
    const rectangles =
      kind === "text"
        ? getTextRectangles(element)
        : [element.getBoundingClientRect()];

    rectangles.forEach((rectangle) => {
      if (
        rectangle.width < 2 ||
        rectangle.height < 2
      ) {
        return;
      }

      items.push({
        left: rectangle.left + window.scrollX,
        top: rectangle.top + window.scrollY,
        width: rectangle.width,
        height: rectangle.height,
        kind,
      });
    });
  });

  return items.slice(0, 1500);
}

function drawSnapshot(canvas, preview, items, color, opacity) {
  if (!canvas || !preview) return;

  const context = canvas.getContext("2d");
  if (!context) return;

  const width = preview.clientWidth;
  const height = preview.clientHeight;
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  const scaleX = width / window.innerWidth;
  const scaleY = height / window.innerHeight;

  canvas.width = Math.max(1, Math.round(width * pixelRatio));
  canvas.height = Math.max(1, Math.round(height * pixelRatio));
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  context.clearRect(0, 0, width, height);
  context.fillStyle = color;

  items.forEach((item) => {
    const left = (item.left - window.scrollX) * scaleX;
    const top = (item.top - window.scrollY) * scaleY;
    const itemWidth = Math.max(0.65, item.width * scaleX);
    const itemHeight = Math.max(0.65, item.height * scaleY);

    if (
      left + itemWidth < 0 ||
      left > width ||
      top + itemHeight < 0 ||
      top > height
    ) {
      return;
    }

    context.globalAlpha = opacity[item.kind];
    context.fillRect(left, top, itemWidth, itemHeight);
  });

  context.globalAlpha = 1;
}

function elementLabel(element) {
  const ariaLabel = element.getAttribute("aria-label");
  if (ariaLabel) return ariaLabel;

  const heading = element.matches("h1, h2, h3")
    ? element
    : element.querySelector(":scope > h1, :scope > h2, :scope > h3");

  if (heading?.textContent?.trim()) {
    return heading.textContent.trim().slice(0, 36);
  }

  const className =
    typeof element.className === "string"
      ? element.className.split(" ").find(Boolean)
      : "";

  return className || element.tagName.toLowerCase();
}

function collectInspectionTargets() {
  const page = document.querySelector("main > *");
  if (!page) return [];

  const candidates = new Set([page]);
  Array.from(page.children).forEach((element) => candidates.add(element));

  if (page.children.length === 1) {
    Array.from(page.firstElementChild?.children ?? []).forEach((element) =>
      candidates.add(element),
    );
  }

  page
    .querySelectorAll("section, article, header")
    .forEach((element) => candidates.add(element));

  return Array.from(candidates)
    .map((element, index) => {
      const rectangle = element.getBoundingClientRect();
      return {
        id: `${index}-${elementLabel(element)}`,
        label: elementLabel(element),
        top: rectangle.top,
        left: rectangle.left,
        width: rectangle.width,
        height: rectangle.height,
        visible:
          rectangle.width > 40 &&
          rectangle.height > 24 &&
          rectangle.bottom > 0 &&
          rectangle.top < window.innerHeight,
      };
    })
    .filter((target) => target.visible)
    .slice(0, 24);
}

export default function PageInspector({ pageKey }) {
  const previewRef = useRef(null);
  const baseCanvasRef = useRef(null);
  const accentCanvasRef = useRef(null);
  const snapshotRef = useRef([]);
  const frameRef = useRef(0);
  const [isInspecting, setIsInspecting] = useState(false);
  const [targets, setTargets] = useState([]);

  useEffect(() => {
    const redraw = () => {
      frameRef.current = 0;
      drawSnapshot(
        baseCanvasRef.current,
        previewRef.current,
        snapshotRef.current,
        "#ffffff",
        BASE_OPACITY,
      );
      drawSnapshot(
        accentCanvasRef.current,
        previewRef.current,
        snapshotRef.current,
        ACCENT,
        SCAN_OPACITY,
      );
    };

    const scheduleRedraw = () => {
      if (frameRef.current) return;
      frameRef.current = window.requestAnimationFrame(redraw);
    };

    const rebuild = () => {
      snapshotRef.current = collectSnapshot();
      scheduleRedraw();
    };

    rebuild();
    const delayedRebuilds = [
      window.setTimeout(rebuild, 250),
      window.setTimeout(rebuild, 1000),
    ];
    const resizeObserver = new ResizeObserver(rebuild);
    resizeObserver.observe(document.body);

    window.addEventListener("scroll", scheduleRedraw, { passive: true });
    window.addEventListener("resize", rebuild, { passive: true });

    return () => {
      if (frameRef.current) window.cancelAnimationFrame(frameRef.current);
      delayedRebuilds.forEach((timer) => window.clearTimeout(timer));
      resizeObserver.disconnect();
      window.removeEventListener("scroll", scheduleRedraw);
      window.removeEventListener("resize", rebuild);
    };
  }, [pageKey]);

  useEffect(() => {
    if (!isInspecting) {
      setTargets([]);
      return undefined;
    }

    let frame = 0;
    const updateTargets = () => {
      frame = 0;
      setTargets(collectInspectionTargets());
    };
    const scheduleUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(updateTargets);
    };
    const closeWithEscape = (event) => {
      if (event.key === "Escape") setIsInspecting(false);
    };

    updateTargets();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate, { passive: true });
    window.addEventListener("keydown", closeWithEscape);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      window.removeEventListener("keydown", closeWithEscape);
    };
  }, [isInspecting, pageKey]);

  return (
    <>
      <div
        className={isInspecting ? "page-inspector is-active" : "page-inspector"}
      >
        <div className="inspector-preview" ref={previewRef} aria-hidden="true">
          <canvas ref={baseCanvasRef} />
          <div className="inspector-accent-scan">
            <div className="inspector-accent-counter">
              <canvas className="inspector-accent-map" ref={accentCanvasRef} />
            </div>
          </div>
        </div>
        <button
          className="inspector-toggle"
          type="button"
          aria-label={
            isInspecting ? "Close inspection mode" : "Inspect this page"
          }
          aria-pressed={isInspecting}
          onClick={() => setIsInspecting((current) => !current)}
        />
        <span className="inspector-tooltip" aria-hidden="true">
          {isInspecting ? "Close ×" : "Inspect ↗"}
        </span>
      </div>

      {isInspecting && (
        <div className="inspection-overlay" aria-hidden="true">
          {targets.map((target) => (
            <div
              className="inspection-outline"
              key={target.id}
              style={{
                top: target.top,
                left: target.left,
                width: target.width,
                height: target.height,
              }}
            >
              <span
                className={
                  target.top < 22
                    ? "inspection-label is-inside"
                    : "inspection-label"
                }
              >
                {target.label}
              </span>
            </div>
          ))}
          <div className="inspection-status">
            <span>Inspection mode</span>
            <span>{targets.length.toString().padStart(2, "0")} blocks · Esc</span>
          </div>
        </div>
      )}
    </>
  );
}
