"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useTextareaResize } from "@/hooks/use-textarea-resize";
import { Send } from "lucide-react";
import React, { createContext, useContext } from "react";

const ChatInputContext = createContext({});

/**
 * Context provider and container for chat input controls.
 *
 * Provides a shared context (value, onChange, onSubmit, loading, onStop, variant, rows)
 * to descendant ChatInputTextArea and ChatInputSubmit components and renders a styled
 * wrapper whose base layout depends on `variant`.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children - Child elements (typically ChatInputTextArea and ChatInputSubmit).
 * @param {string} [props.className] - Additional CSS classes appended to the container.
 * @param {"default"|"unstyled"} [props.variant="default"] - Visual variant: "default" applies the bordered, vertical layout; "unstyled" uses a horizontal gap layout.
 * @param {string} [props.value] - Controlled input value surfaced to context consumers.
 * @param {(next: string) => void} [props.onChange] - Change handler surfaced to context consumers.
 * @param {() => void} [props.onSubmit] - Submit handler surfaced to context consumers; used by textarea Enter-to-submit and submit button.
 * @param {boolean} [props.loading] - When true, consumers may render a loading/stop state (e.g., ChatInputSubmit shows a Stop button).
 * @param {() => void} [props.onStop] - Handler invoked to stop a running submission; used when `loading` is true.
 * @param {number} [props.rows=1] - Minimum number of textarea rows surfaced to context consumers.
 * @returns {JSX.Element} The provider-wrapped container element.
 */
function ChatInput({
  children,
  className,
  variant = "default",
  value,
  onChange,
  onSubmit,
  loading,
  onStop,
  rows = 1,
}) {
  const contextValue = {
    value,
    onChange,
    onSubmit,
    loading,
    onStop,
    variant,
    rows,
  };

  return (
    <ChatInputContext.Provider value={contextValue}>
      <div
        className={cn(
          variant === "default" &&
            "flex flex-col items-end w-full p-2 rounded-2xl border border-input bg-transparent focus-within:ring-1 focus-within:ring-ring focus-within:outline-none",
          variant === "unstyled" && "flex items-start gap-2 w-full",
          className,
        )}
      >
        {children}
      </div>
    </ChatInputContext.Provider>
  );
}

ChatInput.displayName = "ChatInput";

/**
 * A textarea input for chat that auto-resizes and supports Enter-to-submit.
 *
 * Reads `value`, `onChange`, `onSubmit`, `rows`, and `variant` from props if provided,
 * otherwise falls back to the ChatInput context. The `variant` prop maps the context
 * "default" to this component's "unstyled" presentation.
 *
 * Behavior:
 * - Automatically resizes to fit content via useTextareaResize.
 * - Pressing Enter (without Shift) prevents the default newline and calls `onSubmit`
 *   if an `onSubmit` handler is available and the current value is a non-empty string.
 *
 * @param {function} [onSubmit] - Handler invoked when Enter (without Shift) is pressed and input is non-empty.
 * @param {string} [value] - Controlled value for the textarea.
 * @param {function} [onChange] - Change handler for the textarea.
 * @param {string} [className] - Additional CSS classes applied to the textarea.
 * @param {"default"|"unstyled"} [variant] - Visual variant; when omitted, derived from context.
 * @param {number} [rows] - Minimum number of rows for the textarea (defaults to 1).
 */
function ChatInputTextArea({
  onSubmit: onSubmitProp,
  value: valueProp,
  onChange: onChangeProp,
  className,
  variant: variantProp,
  rows: rowsProp,
  ...props
}) {
  const context = useContext(ChatInputContext);
  const value = valueProp ?? context.value ?? "";
  const onChange = onChangeProp ?? context.onChange;
  const onSubmit = onSubmitProp ?? context.onSubmit;
  const rows = rowsProp ?? context.rows ?? 1;

  const variant = variantProp ?? (context.variant === "default" ? "unstyled" : "default");

  const textareaRef = useTextareaResize(value, rows);
  const handleKeyDown = (e) => {
    if (!onSubmit) return;
    if (e.key === "Enter" && !e.shiftKey) {
      if (typeof value !== "string" || value.trim().length === 0) return;
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <Textarea
      ref={textareaRef}
      {...props}
      value={value}
      onChange={onChange}
      onKeyDown={handleKeyDown}
      className={cn(
        "max-h-[400px] min-h-0 resize-none overflow-x-hidden",
        variant === "unstyled" &&
          "border-none focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none",
        className,
      )}
      rows={rows}
    />
  );
}

ChatInputTextArea.displayName = "ChatInputTextArea";

/**
 * Render a submit control for the chat input: a Stop button when loading (and `onStop` is supplied), otherwise a Send button that triggers submit.
 *
 * Reads fallback values from the surrounding ChatInputContext when props are not provided:
 * - uses `loadingProp` or `context.loading`
 * - uses `onStopProp` or `context.onStop`
 * - uses `onSubmitProp` or `context.onSubmit`
 * The Send button is disabled when the current context value is not a non-empty string.
 *
 * @param {Function} [onSubmitProp] - Optional submit handler override. Called when the Send button is clicked and input is not empty.
 * @param {boolean} [loadingProp] - Optional loading override. When true and an `onStop` handler is available a Stop button is shown instead of Send.
 * @param {Function} [onStopProp] - Optional stop handler override. Called when the Stop button is clicked.
 * @param {string} [className] - Additional CSS class names applied to the rendered Button.
 * @param {...any} [props] - Additional props forwarded to the underlying Button.
 * @returns {JSX.Element} A Button element: either a Stop icon button or a Send icon button.
 */
function ChatInputSubmit({
  onSubmit: onSubmitProp,
  loading: loadingProp,
  onStop: onStopProp,
  className,
  ...props
}) {
  const context = useContext(ChatInputContext);
  const loading = loadingProp ?? context.loading;
  const onStop = onStopProp ?? context.onStop;
  const onSubmit = onSubmitProp ?? context.onSubmit;

  if (loading && onStop) {
    return (
      <Button onClick={onStop} className={cn(className)} {...props}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-label="Stop"
        >
          <title>Stop</title>
          <rect x="6" y="6" width="12" height="12" />
        </svg>
      </Button>
    );
  }

  const isDisabled = typeof context.value !== "string" || context.value.trim().length === 0;

  return (
    <Button
      className={cn(className)}
      disabled={isDisabled}
      onClick={(event) => {
        event.preventDefault();
        if (!isDisabled) onSubmit?.();
      }}
      {...props}
    >
      <Send className="h-4 w-4" />
    </Button>
  );
}

ChatInputSubmit.displayName = "ChatInputSubmit";

export { ChatInput, ChatInputTextArea, ChatInputSubmit };


