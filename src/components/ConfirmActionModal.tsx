import { useEffect, useRef, useState } from "react";

interface ConfirmActionModalProps {
  open: boolean;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmActionModal = ({
  open,
  title,
  description,
  confirmText = "Remove",
  cancelText = "Cancel",
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmActionModalProps) => {
  const [visible, setVisible] = useState(false);
  const cancelButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!open) {
      setVisible(false);
      return;
    }

    const frame = window.requestAnimationFrame(() => setVisible(true));
    return () => window.cancelAnimationFrame(frame);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    cancelButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (!isLoading) onCancel();
        return;
      }

      if (event.key === "Enter") {
        event.preventDefault();
        if (!isLoading) onConfirm();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, isLoading, onCancel, onConfirm]);

  if (!open) return null;

  return (
    <div
      className={`fixed inset-0 z-[1000] flex items-center justify-center p-4 transition-opacity duration-200 ${
        visible ? "opacity-100" : "opacity-0"
      } bg-slate-950/45 backdrop-blur-sm`}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isLoading) {
          onCancel();
        }
      }}
      aria-hidden={false}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        aria-describedby="confirm-modal-description"
        className={`w-full max-w-md rounded-2xl bg-white p-6 md:p-7 shadow-2xl border border-slate-200 transition-all duration-200 ${
          visible ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        <h2 id="confirm-modal-title" className="text-xl md:text-2xl font-bold text-slate-900">
          {title}
        </h2>

        {description ? (
          <p id="confirm-modal-description" className="mt-2 text-sm md:text-base text-slate-600">
            {description}
          </p>
        ) : null}

        <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5">
          <button
            ref={cancelButtonRef}
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="inline-flex items-center justify-center rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed transition-colors min-w-[112px]"
          >
            {isLoading ? "Removing..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmActionModal;