"use client";

import { useLayoutEffect, useRef } from "react";

export function useTextareaResize(value, rows = 1) {
  const textareaRef = useRef(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional
  useLayoutEffect(() => {
    const textArea = textareaRef.current;
    if (textArea) {
      const computedStyle = window.getComputedStyle(textArea);
      const lineHeight = Number.parseInt(computedStyle.lineHeight, 10) || 20;
      const padding =
        Number.parseInt(computedStyle.paddingTop, 10) +
        Number.parseInt(computedStyle.paddingBottom, 10);

      const minHeight = lineHeight * rows + padding;
      const MAX_HEIGHT_PX = 200; // cap to keep page from scrolling

      // Reset then measure
      textArea.style.height = "0px";
      const contentHeight = Math.max(textArea.scrollHeight, minHeight);

      // Cap height and toggle internal scroll
      const nextHeight = Math.min(contentHeight + 2, MAX_HEIGHT_PX);
      textArea.style.height = `${nextHeight}px`;
      textArea.style.overflowY = contentHeight + 2 > MAX_HEIGHT_PX ? "auto" : "hidden";
    }
  }, [textareaRef, value, rows]);

  return textareaRef;
}


