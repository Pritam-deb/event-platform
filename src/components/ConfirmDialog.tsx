"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useId, useMemo, useRef } from "react";

type Props = {
  open: boolean;
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isConfirming?: boolean;
  disableClose?: boolean;
  errorMessage?: string | null;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
};

function getFocusableElements(root: HTMLElement) {
  const selector = [
    "a[href]",
    "button:not([disabled])",
    "input:not([disabled])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    "[tabindex]:not([tabindex='-1'])",
  ].join(",");

  return Array.from(root.querySelectorAll<HTMLElement>(selector)).filter(
    (el) => !el.hasAttribute("disabled") && el.tabIndex !== -1
  );
}

export function ConfirmDialog({
  open,
  title = "Confirm deletion",
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  isConfirming = false,
  disableClose = false,
  errorMessage,
  onConfirm,
  onCancel,
}: Props) {
  const titleId = useId();
  const descriptionId = useId();
  const errorId = useId();
  const panelRef = useRef<HTMLDivElement | null>(null);
  const cancelButtonRef = useRef<HTMLButtonElement | null>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  const ariaDescribedBy = useMemo(() => {
    const ids = [descriptionId];
    if (errorMessage) ids.push(errorId);
    return ids.join(" ");
  }, [descriptionId, errorId, errorMessage]);

  useEffect(() => {
    if (!open) return;

    previousActiveElement.current =
      document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusTimer = window.setTimeout(() => {
      cancelButtonRef.current?.focus();
    }, 0);

    const onKeyDown = (e: KeyboardEvent) => {
      if (!panelRef.current) return;

      if (e.key === "Escape") {
        if (disableClose || isConfirming) return;
        e.preventDefault();
        onCancel();
        return;
      }

      if (e.key !== "Tab") return;

      const focusable = getFocusableElements(panelRef.current);
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (e.shiftKey) {
        if (active === first || !panelRef.current.contains(active)) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (active === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
      previousActiveElement.current?.focus?.();
    };
  }, [disableClose, isConfirming, onCancel, open]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onPointerDown={(e) => {
              if (e.target !== e.currentTarget) return;
              if (disableClose || isConfirming) return;
              onCancel();
            }}
          />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={ariaDescribedBy}
            className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#0B1221]/95 p-5 text-white shadow-2xl shadow-black/50"
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            onPointerDown={(e) => e.stopPropagation()}
          >
            <div className="text-sm font-semibold" id={titleId}>
              {title}
            </div>
            <div className="mt-2 text-sm text-white/65" id={descriptionId}>
              {message}
            </div>

            {errorMessage ? (
              <div
                id={errorId}
                role="alert"
                className="mt-4 rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-sm text-rose-100"
              >
                {errorMessage}
              </div>
            ) : null}

            <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                ref={cancelButtonRef}
                type="button"
                disabled={isConfirming}
                onClick={() => {
                  if (disableClose || isConfirming) return;
                  onCancel();
                }}
                className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/80 hover:bg-white/10 disabled:opacity-60"
              >
                {cancelLabel}
              </button>

              <button
                type="button"
                onClick={() => onConfirm()}
                disabled={isConfirming}
                className="inline-flex items-center justify-center rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-rose-600/20 hover:bg-rose-500 disabled:opacity-60"
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
