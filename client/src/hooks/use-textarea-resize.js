"use client";

import { useLayoutEffect, useRef } from "react";

/**
 * Returns a ref to attach to a <textarea> that automatically adjusts its height to fit content.
 *
 * The hook measures the textarea's computed `line-height` and vertical padding (falls back to a
 * 20px line height if parsing fails) and resizes the element to fit its content. Height is capped
 * at 200px; once content exceeds that cap the textarea will use internal scrolling.
 *
 * @param {*} value - Used as a change trigger (e.g., textarea value) to recompute the height.
 * @param {number} [rows=1] - Minimum number of visible text lines to preserve when empty.
 * @return {import('react').RefObject<HTMLTextAreaElement>} A ref to attach to the textarea element.
 */
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


