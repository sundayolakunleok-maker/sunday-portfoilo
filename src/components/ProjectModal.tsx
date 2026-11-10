import { useEffect, useState } from 'react';
import { 
  X, 
  ExternalLink, 
  Github, 
  BookOpen, 
  CheckCircle2, 
  Layers, 
  Target, 
  Compass, 
  TrendingUp, 
  Code2, 
  Calendar,
  Building2,
  ZoomIn
} from 'lucide-react';
import type { AnalyticsProject, SoftwareApplication } from '../data';
import ImageLightbox from './ImageLightbox';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: AnalyticsProject | SoftwareApplication | null;
  type: 'analytics' | 'software';
}

export default function ProjectModal({
  isOpen,
  onClose,
  project,
  type
}: ProjectModalProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && lightboxIndex === null) onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, lightboxIndex]);

  if (!isOpen || !project) return null;

  const isAnalytics = type === 'analytics';
  const analyticsItem = isAnalytics ? (project as AnalyticsProject) : null;
  const softwareItem = !isAnalytics ? (project as SoftwareApplication) : null;

  const gallery = project.gallery || [];
  const currentLightboxImage = lightboxIndex !== null ? gallery[lightboxIndex] : null;

  return (
    <>
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/80 p-4 sm:p-6 backdrop-blur-md overflow-y-auto">
        <div 
          className="fixed inset-0 cursor-pointer" 
          onClick={onClose} 
          aria-label="Close modal backdrop" 
        />

        <div className="relative z-10 my-auto flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
          {/* Header */}
          <div className="flex items-start justify-between border-b border-slate-100 bg-slate-50/60 p-6 dark:border-slate-800 dark:bg-slate-950/60">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-lg bg-blue-600 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-sm">
                  {isAnalytics ? analyticsItem?.typeOfWork : softwareItem?.categoryLabel}
                </span>
                {softwareItem?.statusBadge && (
                  <span className="rounded-lg bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                    ● {softwareItem.statusBadge}
                  </span>
                )}
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Client / Context: {project.client}
                </span>
              </div>
              <h2 className="mt-2 text-2xl font-extrabold text-slate-900 sm:text-3xl dark:text-white">
                {project.title}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="rounded-xl bg-slate-100 p-2 text-slate-500 hover:bg-slate-200 hover:text-slate-900 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white transition"
              aria-label="Close modal"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Scrollable Content Body */}
          <div className="overflow-y-auto p-6 sm:p-8 space-y-8">
            {/* Visual Demonstration Gallery */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                <ZoomIn className="h-4 w-4 text-blue-600" />
                Screenshots & Visual Demonstrations (Click to Enlarge)
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {gallery.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => setLightboxIndex(idx)}
                    className="group relative cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-sm transition-all hover:scale-[1.01] hover:border-blue-500 hover:shadow-md dark:border-slate-800 dark:bg-slate-950"
                  >
                    <div className="aspect-video w-full overflow-hidden bg-slate-900">
                      <img
                        src={item.url}
                        alt={item.caption}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-3 bg-white/90 dark:bg-slate-900/90 border-t border-slate-100 dark:border-slate-800">
                      <p className="text-xs text-slate-600 dark:text-slate-300 font-medium line-clamp-2">
                        {item.caption}
                      </p>
                      <span className="mt-1 text-[11px] font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                        <ZoomIn className="h-3 w-3" /> View in Lightbox
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Outcomes / Metrics (If Analytics) */}
            {isAnalytics && analyticsItem?.keyMetrics && (
              <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-6 dark:border-blue-900/30 dark:bg-blue-950/20">
                <h3 className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300 mb-4 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Key Quantifiable Metrics & Business Outcomes
                </h3>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {analyticsItem.keyMetrics.map((metric, i) => (
                    <div key={i} className="rounded-xl bg-white p-3.5 shadow-2xs dark:bg-slate-900">
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{metric.label}</p>
                      <p className="mt-1 text-xl font-extrabold text-blue-600 dark:text-blue-400">{metric.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Problem Statement */}
            <div className="rounded-2xl border border-amber-200/80 bg-amber-50/40 p-6 dark:border-amber-900/40 dark:bg-amber-950/20">
              <h3 className="text-sm font-bold text-amber-900 dark:text-amber-300 flex items-center gap-2">
                <Target className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                Problem Statement & Organizational Challenge
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                {project.problem}
              </p>
            </div>

            {/* Objectives / Key Modules */}
            {isAnalytics && analyticsItem?.objectives && (
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  Project Objectives & Deliverables
                </h3>
                <div className="grid gap-2.5 sm:grid-cols-2">
                  {analyticsItem.objectives.map((obj, i) => (
                    <div key={i} className="flex items-start gap-2.5 rounded-xl border border-slate-200/70 bg-slate-50/60 p-3.5 text-xs text-slate-700 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-300">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-[11px] font-bold text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                        {i + 1}
                      </span>
                      <span>{obj}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Software Features (If Software) */}
            {!isAnalytics && softwareItem?.features && (
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
                  <Layers className="h-4 w-4 text-indigo-600" />
                  System Modules & Verified Features
                </h3>
                <div className="grid gap-2.5 sm:grid-cols-2">
                  {softwareItem.features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-2.5 rounded-xl border border-slate-200/70 bg-slate-50/60 p-3.5 text-xs text-slate-700 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-300">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Methodology & Approach (If Analytics) */}
            {isAnalytics && analyticsItem?.methodology && (
              <div className="rounded-2xl bg-slate-50 p-6 dark:bg-slate-800/40">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Compass className="h-4 w-4 text-blue-600" />
                  Methodology & Analytical Pipeline
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  {analyticsItem.methodology}
                </p>
              </div>
            )}

            {/* Findings & Business Impact (If Analytics) */}
            {isAnalytics && analyticsItem?.findings && (
              <div className="rounded-2xl bg-emerald-50/40 border border-emerald-200/60 p-6 dark:border-emerald-900/40 dark:bg-emerald-950/20">
                <h3 className="text-sm font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-emerald-600" />
                  Key Analytical Findings & Business Impact
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                  {analyticsItem.findings}
                </p>
              </div>
            )}

            {/* Tools & Technologies */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-2">
                <Code2 className="h-4 w-4 text-blue-600" />
                Verified Tools & Technologies Used
              </h3>
              <div className="flex flex-wrap gap-2">
                {(isAnalytics ? analyticsItem?.tools : softwareItem?.technologies)?.map((tech, i) => (
                  <span
                    key={i}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Action Links */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 bg-slate-50/80 p-6 dark:border-slate-800 dark:bg-slate-950/80">
            <div className="flex flex-wrap items-center gap-3">
              {isAnalytics && analyticsItem?.mediumUrl && (
                <a
                  href={analyticsItem.mediumUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 transition"
                >
                  <BookOpen className="h-4 w-4" />
                  Read Full Documentation on Medium
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}

              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition"
                >
                  <Github className="h-4 w-4" />
                  View GitHub Profile / Repository
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}

              {!isAnalytics && softwareItem?.codeFile && (
                <a
                  href={softwareItem.codeFile}
                  download
                  className="inline-flex items-center gap-2 rounded-xl border border-blue-300 bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-700 hover:bg-blue-100 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300 transition"
                >
                  <Code2 className="h-4 w-4" />
                  Download Flask Source (app.py)
                </a>
              )}
            </div>

            <button
              onClick={onClose}
              className="rounded-xl border border-slate-200 bg-white px-6 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 transition"
            >
              Close Details
            </button>
          </div>
        </div>
      </div>

      {/* Lightbox for gallery viewing */}
      {currentLightboxImage && (
        <ImageLightbox
          isOpen={lightboxIndex !== null}
          onClose={() => setLightboxIndex(null)}
          imageUrl={currentLightboxImage.url}
          caption={currentLightboxImage.caption}
          title={project.title}
          hasPrev={lightboxIndex > 0}
          hasNext={lightboxIndex < gallery.length - 1}
          onPrev={() => setLightboxIndex(prev => (prev !== null && prev > 0 ? prev - 1 : prev))}
          onNext={() => setLightboxIndex(prev => (prev !== null && prev < gallery.length - 1 ? prev + 1 : prev))}
        />
      )}
    </>
  );
}
