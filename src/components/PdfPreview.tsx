import { useEffect, useMemo, useRef, useState } from "react";
import { FileText, X } from "lucide-react";
import { GlobalWorkerOptions, getDocument } from "pdfjs-dist";
import pdfWorkerSrc from "pdfjs-dist/build/pdf.worker.min.mjs?url";

GlobalWorkerOptions.workerSrc = pdfWorkerSrc;

interface PdfPreviewProps {
  url: string;
  title?: string;
  className?: string;
  openInNewTab?: boolean;
}

const PdfPreview = ({
  url,
  title = "Property Document",
  className = "",
  openInNewTab = false,
}: PdfPreviewProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [isInView, setIsInView] = useState(false);
  const [isRendering, setIsRendering] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  const pdfUrl = useMemo(() => String(url || "").trim(), [url]);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry?.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "120px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isInView || !pdfUrl) return;

    let cancelled = false;
    let renderTask: { cancel?: () => void; promise?: Promise<void> } | null = null;

    const renderPreview = async () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      try {
        setIsRendering(true);
        setHasError(false);

        const loadingTask = getDocument({
          url: pdfUrl,
          withCredentials: false,
        });

        const pdf = await loadingTask.promise;
        if (cancelled) return;

        const page = await pdf.getPage(1);
        if (cancelled) return;

        const context = canvas.getContext("2d");
        if (!context) throw new Error("Canvas not supported");

        const baseViewport = page.getViewport({ scale: 1 });
        const targetWidth = canvas.parentElement?.clientWidth || 250;
        const scale = targetWidth / baseViewport.width;
        const viewport = page.getViewport({ scale });

        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);

        renderTask = page.render({ canvas, canvasContext: context, viewport });
        await renderTask.promise;

        if (cancelled) return;
      } catch (error) {
        if (!cancelled) {
          setHasError(true);
        }
      } finally {
        if (!cancelled) {
          setIsRendering(false);
        }
      }
    };

    renderPreview();

    return () => {
      cancelled = true;
      if (renderTask?.cancel) {
        renderTask.cancel();
      }
    };
  }, [isInView, pdfUrl]);

  if (!pdfUrl) return null;

  return (
    <>
      <div
        ref={containerRef}
        className={`w-full max-w-[250px] h-[250px] relative rounded-xl overflow-hidden bg-[#f5f5f5] cursor-pointer border border-blue-200 ${className}`}
        onClick={() => {
          if (openInNewTab) {
            window.open(pdfUrl, "_blank", "noopener,noreferrer");
            return;
          }
          setIsViewerOpen(true);
        }}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            if (openInNewTab) {
              window.open(pdfUrl, "_blank", "noopener,noreferrer");
              return;
            }
            setIsViewerOpen(true);
          }
        }}
        aria-label={`Open ${title}`}
      >
        {hasError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 gap-2">
            <FileText className="w-10 h-10" />
            <span className="text-xs font-medium">Preview not available</span>
          </div>
        ) : (
          <canvas ref={canvasRef} className="w-full h-full object-contain block" />
        )}

        {isRendering && !hasError ? (
          <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100" />
        ) : null}

        <div className="absolute bottom-0 w-full bg-black/60 text-white text-center px-2 py-2 text-sm">
          View Document
        </div>
      </div>

      {!openInNewTab && isViewerOpen ? (
        <div className="fixed inset-0 z-[80] bg-black/70 p-4 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl h-[90vh] overflow-hidden border border-slate-200">
            <div className="h-12 px-4 border-b border-slate-200 flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-800 truncate">{title}</p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.open(pdfUrl, "_blank", "noopener,noreferrer")}
                  className="px-3 py-1.5 text-xs rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50"
                >
                  Open in New Tab
                </button>
                <button
                  type="button"
                  onClick={() => setIsViewerOpen(false)}
                  className="p-1.5 rounded-md hover:bg-slate-100 text-slate-700"
                  aria-label="Close PDF viewer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            <iframe
              src={pdfUrl}
              title={title}
              className="w-full h-[calc(90vh-48px)]"
            />
          </div>
        </div>
      ) : null}
    </>
  );
};

export default PdfPreview;
