import React, { useEffect, useRef, useState } from "react";
import "./ExpandableText.css";

/**
 * Props:
 * - text: string
 * - maxLinesBeforeToggle: number (default 5)
 * - collapsedLines: number (default 2)
 */
export default function ExpandableText({
  text,
  maxLinesBeforeToggle = 5,
  collapsedLines = 2,
}) {
  const ref = useRef(null);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [showToggle, setShowToggle] = useState(false);
  const [lineHeight, setLineHeight] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) {
      setShowToggle(false);
      return;
    }

    // Temporarily remove clamp styles to measure natural height
    const prevWebkitClamp = el.style.webkitLineClamp;
    const prevMaxHeight = el.style.maxHeight;
    const prevOverflow = el.style.overflow;

    el.style.webkitLineClamp = "unset";
    el.style.maxHeight = "none";
    el.style.overflow = "visible";

    const computed = window.getComputedStyle(el);
    // computed.lineHeight can be "normal", so parseFloat may return NaN -> fallback to 0
    const lh = parseFloat(computed.lineHeight) || 0;
    const scrollH = el.scrollHeight || 0;
    const lines = lh > 0 ? Math.round(scrollH / lh) : 0;

    setLineHeight(lh);
    setShowToggle(lines > maxLinesBeforeToggle);

    // restore
    el.style.webkitLineClamp = prevWebkitClamp;
    el.style.maxHeight = prevMaxHeight;
    el.style.overflow = prevOverflow;
  }, [text, maxLinesBeforeToggle]);

  return (
    <div className="expandable-text-wrapper">
      <div
        ref={ref}
        className={`expandable-text ${isCollapsed ? "collapsed" : "expanded"}`}
        style={
          isCollapsed
            ? {
                maxHeight: lineHeight ? `${lineHeight * collapsedLines}px` : undefined,
                overflow: "hidden",
              }
            : {}
        }
      >
        {text}
      </div>

      {showToggle && (
        <button
          className="expandable-toggle"
          aria-expanded={!isCollapsed}
          onClick={() => setIsCollapsed((s) => !s)}
        >
          {isCollapsed ? "ver mais" : "ver menos"}
        </button>
      )}
    </div>
  );
}
