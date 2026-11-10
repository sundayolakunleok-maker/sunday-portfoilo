import { useEffect } from 'react';
import { X, ZoomIn, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';

interface ImageLightboxProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  caption?: string;
  title?: string;
  onPrev?: () => void;
  onNext?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;
}

export default function ImageLightbox({
  isOpen,
  onClose,
  imageUrl,
  caption,
  title,
  onPrev,
  onNext,
  hasPrev,
  hasNext
}: ImageLightboxProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && onPrev && hasPrev) onPrev();
      if (e.key === 'ArrowRight' && onNext && hasNext) onNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, onPrev, onNext, hasPrev, hasNext]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md transition-all">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 cursor-pointer" 
        onClick={onClose} 
        aria-label="Close lightbox"
      />

      {/* Main Container */}
      <div className="relative z-10 flex max-h-[92vh] max-w-6xl flex-col items-center justify-center overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl">
        {/* Top Header */}
        <div className="flex w-full items-center justify-between border-b border-slate-800/80 bg-slate-950/80 px-6 py-4">
          <div className="flex items-center gap-2">
            <ZoomIn className="h-4 w-4 text-blue-400" />
            <span className="text-sm font-bold text-white tracking-wide">
              {title || "Screenshot Preview"}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={imageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-700 hover:text-white transition"
            >
              Open Original
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
            <button
              onClick={onClose}
              className="rounded-lg bg-slate-800 p-1.5 text-slate-400 hover:bg-slate-700 hover:text-white transition"
              aria-label="Close preview"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Image Display Area */}
        <div className="relative flex items-center justify-center p-3 sm:p-6 bg-slate-950/40 max-h-[75vh] w-full overflow-auto">
          {hasPrev && onPrev && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPrev();
              }}
              className="absolute left-4 z-20 rounded-full bg-slate-900/80 p-2.5 text-white shadow-lg backdrop-blur-sm hover:bg-blue-600 transition"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          )}

          <img
            src={imageUrl}
            alt={caption || title || "Project Screenshot"}
            className="max-h-[68vh] w-auto max-w-full rounded-xl object-contain shadow-lg"
          />

          {hasNext && onNext && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onNext();
              }}
              className="absolute right-4 z-20 rounded-full bg-slate-900/80 p-2.5 text-white shadow-lg backdrop-blur-sm hover:bg-blue-600 transition"
              aria-label="Next image"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          )}
        </div>

        {/* Caption Footer */}
        {caption && (
          <div className="w-full border-t border-slate-800 bg-slate-950 px-6 py-3.5 text-center text-xs sm:text-sm font-medium text-slate-300">
            {caption}
          </div>
        )}
      </div>
    </div>
  );
}
