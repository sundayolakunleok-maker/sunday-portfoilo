import { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  BookOpen, 
  Target, 
  Compass, 
  FileCheck, 
  Youtube, 
  Github, 
  FileText, 
  ExternalLink, 
  Video, 
  MessageSquare, 
  CheckCircle2, 
  ArrowLeft, 
  Camera, 
  Share2, 
  Sparkles, 
  Code2, 
  Image as ImageIcon, 
  UserCheck, 
  Building2, 
  Layers, 
  Download, 
  ShieldCheck 
} from 'lucide-react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { mit624CourseInfo, courseActivities, type CourseActivity } from '../courseData';

interface Mit624CourseProps {
  onBackToHome?: () => void;
}

export default function Mit624Course({ onBackToHome }: Mit624CourseProps) {
  // Local course activities state initialized from courseData
  const [activities] = useState<CourseActivity[]>(courseActivities);
  
  // Real-time published academic course resources from Firestore & local storage
  const [courseResources, setCourseResources] = useState<any[]>(() => {
    try {
      const cached = localStorage.getItem('sunday_custom_resources');
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });

  // Real-time published course presentation videos from Firestore & local storage
  const [courseVideos, setCourseVideos] = useState<any[]>(() => {
    try {
      const cached = localStorage.getItem('sunday_custom_videos');
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });

  // Active YouTube video URL for Discussion 1 presentation
  const [activeYoutubeUrl, setActiveYoutubeUrl] = useState<string>(() => {
    try {
      const cachedVids = localStorage.getItem('sunday_custom_videos');
      if (cachedVids) {
        const parsed = JSON.parse(cachedVids);
        const d1Vid = parsed.find((v: any) => 
          (v.courseModule && v.courseModule.toLowerCase().includes('discussion 1')) ||
          (v.title && v.title.toLowerCase().includes('discussion 1'))
        ) || parsed[0];
        if (d1Vid?.youtubeUrl) return d1Vid.youtubeUrl;
      }
    } catch {
      // fallback
    }
    return courseActivities[0]?.youtubeUrl || '';
  });

  // Real-time listeners for instant synchronization with Admin Portal updates
  useEffect(() => {
    // 1. Subscribe to published resources
    try {
      const qRes = query(collection(db, 'resources'), orderBy('createdAt', 'desc'));
      const unsubRes = onSnapshot(qRes, (snap) => {
        const items: any[] = [];
        snap.forEach(d => {
          const data = d.data();
          if (data.status === 'published' || !data.status) {
            items.push({ id: d.id, ...data });
          }
        });
        if (items.length > 0) {
          setCourseResources(items);
          try {
            localStorage.setItem('sunday_custom_resources', JSON.stringify(items));
          } catch (e) {
            console.warn('Storage sync error', e);
          }
        }
      }, (err) => {
        console.warn('Firestore resources real-time listener notice:', err);
      });

      // 2. Subscribe to videos
      const qVid = query(collection(db, 'videos'), orderBy('createdAt', 'desc'));
      const unsubVid = onSnapshot(qVid, (snap) => {
        const vids: any[] = [];
        snap.forEach(d => {
          const data = d.data();
          if (data.status === 'published' || !data.status) {
            vids.push({ id: d.id, ...data });
          }
        });
        if (vids.length > 0) {
          setCourseVideos(vids);
          try {
            localStorage.setItem('sunday_custom_videos', JSON.stringify(vids));
          } catch (e) {
            console.warn('Storage sync error', e);
          }
          // Check for discussion 1 video
          const d1Vid = vids.find(v => 
            (v.courseModule && v.courseModule.toLowerCase().includes('discussion 1')) ||
            (v.title && v.title.toLowerCase().includes('discussion 1'))
          ) || vids[0];
          if (d1Vid?.youtubeUrl) {
            setActiveYoutubeUrl(d1Vid.youtubeUrl);
          }
        }
      }, (err) => {
        console.warn('Firestore videos real-time listener notice:', err);
      });

      return () => {
        unsubRes();
        unsubVid();
      };
    } catch (e) {
      console.warn('Firebase real-time connection notice:', e);
    }
  }, []);

  // Approved peer responses for academic display (read-only for visitors)
  const peerFeedbackList = [
    {
      author: "Peer Reviewer (Classmate)",
      date: "Active Course Term",
      comment: "Excellent alignment between your 5+ years in data analytics and modern enterprise software modernization. The autonomous AI coding agent workflow is a strong direction."
    },
    {
      author: "Faculty Reviewer",
      date: "Course Term 2026",
      comment: "Comprehensive onboarding roadmap. The bridge between analytics dashboards and full-stack software estates demonstrates advanced industry perspective."
    }
  ];

  // Helper to extract YouTube Embed URL
  const getYouTubeEmbedUrl = (url?: string) => {
    if (!url) return null;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
  };

  // Helper to filter resources by course module
  const getModuleResources = (moduleName: string) => {
    const term = moduleName.toLowerCase();
    return courseResources.filter(r => 
      (r.courseModule && r.courseModule.toLowerCase().includes(term)) ||
      (r.title && r.title.toLowerCase().includes(term))
    );
  };

  // Helper to render uploaded deliverables for a specific course module
  const renderModuleResources = (moduleName: string) => {
    const items = getModuleResources(moduleName);
    if (items.length === 0) return null;

    return (
      <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-5 dark:border-blue-900/50 dark:bg-blue-950/20">
        <div className="flex items-center justify-between mb-3">
          <h4 className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
            <FileCheck className="h-4 w-4 text-blue-600" />
            {moduleName} Uploaded Deliverables & Submissions ({items.length})
          </h4>
          <span className="text-[11px] font-bold text-blue-700 bg-blue-100 dark:bg-blue-900/50 dark:text-blue-300 px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <ShieldCheck className="h-3 w-3" /> Admin Verified
          </span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {items.map(res => (
            <div key={res.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300 capitalize">
                    {res.contentType || 'document'}
                  </span>
                  {res.fileSize && (
                    <span className="text-[10px] text-slate-400 font-mono">
                      {res.fileSize}
                    </span>
                  )}
                </div>
                <h5 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-1">{res.title}</h5>
                {res.description && (
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{res.description}</p>
                )}
                {res.fileName && (
                  <div className="mt-1.5 text-[11px] text-slate-500 font-mono line-clamp-1">
                    📁 {res.fileName}
                  </div>
                )}
              </div>
              <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                {res.fileUrl && res.allowDownload !== false ? (
                  <a
                    href={res.fileUrl}
                    download={res.fileName || `${moduleName}_Deliverable`}
                    className="font-bold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
                  >
                    <Download className="h-3.5 w-3.5" /> Download File
                  </a>
                ) : (
                  <span className="text-[11px] text-slate-400">View Online</span>
                )}
                {res.externalUrl && (
                  <a
                    href={res.externalUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold text-slate-600 dark:text-slate-300 hover:text-blue-600 inline-flex items-center gap-1"
                  >
                    External Link ↗
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const completedCount = activities.filter(a => a.status === 'Completed').length;
  const inProgressCount = activities.filter(a => a.status === 'In Progress').length;
  const notStartedCount = activities.filter(a => a.status === 'Not Started').length;

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-24 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="container mx-auto px-6 max-w-6xl">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-8 flex items-center justify-between">
          <a
            href="/"
            onClick={(e) => {
              if (onBackToHome) {
                e.preventDefault();
                onBackToHome();
              }
            }}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100 hover:text-blue-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-blue-400"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Main Portfolio
          </a>

          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <span>Portfolio</span>
            <span>/</span>
            <span className="text-blue-600 dark:text-blue-400">MIT 624 Academic Course</span>
          </div>
        </div>

        {/* 1. Page Title & Introduction Header */}
        <header className="relative overflow-hidden rounded-3xl border border-blue-100 bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/20 p-8 shadow-sm md:p-12 dark:border-slate-800 dark:from-slate-900 dark:via-slate-900/90 dark:to-slate-950">
          <div className="absolute top-0 right-0 h-64 w-64 rounded-bl-full bg-blue-500/10 blur-3xl pointer-events-none" />
          
          <div className="relative z-10 grid gap-8 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
                <GraduationCap className="h-4 w-4" />
                {mit624CourseInfo.academicInstitution}
              </div>

              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl dark:text-white">
                {mit624CourseInfo.courseCode} – {mit624CourseInfo.courseTitle}
              </h1>

              <p className="text-lg font-medium italic text-blue-600 sm:text-xl dark:text-blue-400">
                {mit624CourseInfo.pageSubtitle}
              </p>

              <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-5 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/80">
                <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300">
                  {mit624CourseInfo.introDescription}
                </p>
              </div>
            </div>

            {/* Student Profile Card */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center rounded-2xl border border-blue-200 bg-white p-6 text-center shadow-md dark:border-slate-800 dark:bg-slate-900">
              <div className="relative h-28 w-28 overflow-hidden rounded-full border-4 border-white shadow-lg ring-4 ring-blue-500/20 dark:border-slate-800">
                <img
                  src={mit624CourseInfo.studentPhoto}
                  alt={mit624CourseInfo.studentName}
                  className="h-full w-full object-cover"
                />
              </div>
              <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">
                {mit624CourseInfo.studentName}
              </h3>
              <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                {mit624CourseInfo.studentRole}
              </p>
              <div className="mt-3 flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-1 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                <Building2 className="h-3.5 w-3.5 text-blue-600" />
                <span>Modernizing Enterprise Estates</span>
              </div>
            </div>
          </div>
        </header>

        {/* 2. Course Overview Section */}
        <section className="mt-12">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Course Overview
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Core academic specifications and curriculum foundation
              </p>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {/* Card 1 */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                <GraduationCap className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                Course Identification
              </h3>
              <p className="mt-1 text-lg font-bold text-slate-900 dark:text-white">
                {mit624CourseInfo.courseCode}
              </p>
              <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                {mit624CourseInfo.courseTitle}
              </p>
            </div>

            {/* Card 2 */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                <Target className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                Course Focus
              </h3>
              <p className="mt-1 text-base font-bold text-slate-900 dark:text-white">
                {mit624CourseInfo.courseFocus}
              </p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Architectural modernization, legacy transformation, and generative AI engineering.
              </p>
            </div>

            {/* Card 3 */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                <Compass className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                Learning Approach
              </h3>
              <p className="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-200 leading-snug">
                {mit624CourseInfo.learningApproach}
              </p>
            </div>

            {/* Card 4 - Full Span */}
            <div className="sm:col-span-2 lg:col-span-3 rounded-2xl border border-blue-100 bg-blue-50/40 p-6 dark:border-blue-900/30 dark:bg-blue-950/20">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
                  <FileCheck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300">
                    Portfolio Purpose
                  </h3>
                  <p className="mt-1 text-base font-medium text-slate-800 dark:text-slate-200">
                    {mit624CourseInfo.portfolioPurpose}
                  </p>
                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                    Provides verifiable evidence of applied competencies with autonomous AI coding agents, architectural system design, recorded presentations, code repositories, and peer critique.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Course Progress Tracker */}
        <section className="mt-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div>
                <div className="flex items-center gap-2">
                  <Layers className="h-5 w-5 text-blue-600" />
                  <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                    Course Progress Tracker
                  </h2>
                </div>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Track and jump to each of the 8 course deliverables throughout the semester.
                </p>
              </div>

              {/* Status summary pill */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  <span className="h-2 w-2 rounded-full bg-slate-400" />
                  Not Started: {notStartedCount}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                  <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                  In Progress: {inProgressCount}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Completed: {completedCount}
                </span>
              </div>
            </div>

            {/* Tracker Grid */}
            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {activities.map((act) => {
                const statusStyles = {
                  'Completed': 'border-emerald-200 bg-emerald-50/40 text-emerald-900 dark:border-emerald-900/40 dark:bg-emerald-950/20 dark:text-emerald-200',
                  'In Progress': 'border-amber-200 bg-amber-50/40 text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-200 ring-2 ring-amber-400/30',
                  'Not Started': 'border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-300'
                }[act.status];

                const statusBadge = {
                  'Completed': 'bg-emerald-600 text-white',
                  'In Progress': 'bg-amber-500 text-white',
                  'Not Started': 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                }[act.status];

                return (
                  <a
                    key={act.id}
                    href={`#${act.id}`}
                    className={`group relative flex flex-col justify-between rounded-2xl border p-4 transition-all hover:scale-[1.02] hover:shadow-md ${statusStyles}`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          {act.type === 'discussion' ? 'Discussion' : 'Task'} {act.number}
                        </span>
                        <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${statusBadge}`}>
                          {act.status}
                        </span>
                      </div>
                      <h4 className="mt-2 text-sm font-bold text-slate-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400 line-clamp-1">
                        {act.title}
                      </h4>
                    </div>

                    <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-800 text-[11px] font-semibold text-blue-600 dark:text-blue-400">
                      <span>Jump to Section</span>
                      <ExternalLink className="h-3 w-3" />
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </section>

        {/* 3 & 4. Course Activities and Submission Sections */}
        <section className="mt-14 space-y-12">
          <div className="border-b border-slate-200 pb-4 dark:border-slate-800">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
              Course Activities & Submission Records
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Chronological coursework, multimedia presentations, repository artifacts, and academic deliverables.
            </p>
          </div>

          {/* Dynamic Admin-Published Course Resources Repository */}
          {courseResources.length > 0 && (
            <div className="rounded-3xl border border-purple-200/90 bg-gradient-to-r from-purple-50/60 to-blue-50/40 p-6 sm:p-8 shadow-sm dark:border-purple-900/60 dark:from-purple-950/20 dark:to-slate-900">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600 text-white shadow-md shadow-purple-600/30">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                      Published Course Materials & Live Attachments
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Real-time documents, assignment guidelines, and deliverables published from the Central Admin Control Centre.
                    </p>
                  </div>
                </div>
                <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-bold text-purple-700 dark:bg-purple-900/50 dark:text-purple-300">
                  {courseResources.length} Published
                </span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-6">
                {courseResources.map((res) => (
                  <div key={res.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="rounded-full bg-purple-100 px-2 py-0.5 text-[10px] font-bold text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                          {res.courseModule || 'General Material'}
                        </span>
                        <span className="text-[10px] font-medium text-slate-400 capitalize">
                          {res.contentType}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-1">{res.title}</h4>
                      {res.description && (
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{res.description}</p>
                      )}
                      {res.fileName && (
                        <div className="mt-2 text-[10px] text-slate-400 font-mono">
                          📁 {res.fileName} {res.fileSize ? `(${res.fileSize})` : ''}
                        </div>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                      {res.fileUrl && res.allowDownload !== false ? (
                        <a
                          href={res.fileUrl}
                          download={res.fileName || 'material'}
                          className="font-bold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
                        >
                          <Download className="h-3.5 w-3.5" /> Download File
                        </a>
                      ) : (
                        <span className="text-[11px] text-slate-400">View Online</span>
                      )}
                      {res.externalUrl && (
                        <a
                          href={res.externalUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="font-semibold text-slate-600 dark:text-slate-300 hover:text-purple-600 inline-flex items-center gap-1"
                        >
                          External Link ↗
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Activity 1: Discussion 1 */}
          <article id="discussion-1" className="scroll-mt-24 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 dark:border-slate-800 dark:bg-slate-900">
            {/* Header with verified status */}
            <div className="flex flex-col justify-between gap-4 border-b border-slate-100 pb-6 md:flex-row md:items-center dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded-lg bg-blue-600 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
                    Discussion 1
                  </span>
                  <span className="rounded-lg bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                    Status: {activities[0].status}
                  </span>
                </div>
                <h3 className="mt-3 text-2xl font-bold text-slate-900 dark:text-white">
                  Discussion 1: Program Onboarding and Your Technology Future
                </h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Course onboarding, personal technology reflection, and AI development aspirations.
                </p>
              </div>

              {/* Verified academic status */}
              <div className="flex items-center gap-2 text-xs">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  <CheckCircle2 className="h-3.5 w-3.5 text-blue-500" />
                  Verified: {activities[0].status}
                </span>
              </div>
            </div>

            {/* Discussion 1 Content Items */}
            <div className="mt-6 space-y-8">
              {/* Overview item */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 p-5 dark:bg-slate-800/40">
                  <h4 className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                    <BookOpen className="h-4 w-4 text-blue-600" />
                    Course Onboarding & Introduction
                  </h4>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                    Orientation with MIT 624 curriculum expectations, collaborative development norms, and AI-first engineering standards for enterprise environments.
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-5 dark:bg-slate-800/40">
                  <h4 className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                    <Share2 className="h-4 w-4 text-blue-600" />
                    Portfolio Presentation Link
                  </h4>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                    Live accessible URL shared with faculty and course peers:
                  </p>
                  <a
                    href="https://okegbemisunday.netlify.app/mit-624"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400"
                  >
                    https://okegbemisunday.netlify.app/mit-624
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>

              {/* Discussion 1 Uploaded Deliverables from Admin */}
              {renderModuleResources('Discussion 1')}

              {/* Highlighted Subsection: My Technology Future and AI Development Goals */}
              <div className="rounded-2xl border-2 border-blue-500/30 bg-gradient-to-br from-blue-50/50 via-white to-indigo-50/40 p-6 shadow-sm dark:border-blue-500/20 dark:from-slate-900 dark:via-slate-900/90 dark:to-blue-950/30">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                      My Technology Future and AI Development Goals
                    </h4>
                    <p className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                      Core Discussion 1 Requirements & Self-Reflection
                    </p>
                  </div>
                </div>

                <div className="mt-6 space-y-6">
                  {/* Reflection 1 */}
                  <div className="rounded-xl border border-slate-200/80 bg-white/90 p-5 dark:border-slate-800 dark:bg-slate-900/90">
                    <h5 className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                        1
                      </span>
                      Reflection: What Interests Me About the Future of Technology
                    </h5>
                    <p className="mt-2.5 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                      "Technology is entering an unprecedented era where intelligent agents and analytical data engines converge. As a Data Analyst with over 5 years of experience across FMCG, Banking, Logistics, and E-Commerce, I see that the primary bottleneck in enterprise decision-making has been the friction between raw analytical insight and production software deployment. The future of technology empowers individuals to transform multi-source business data into scalable, intelligent software systems with remarkable velocity."
                    </p>
                  </div>

                  {/* Reflection 2 */}
                  <div className="rounded-xl border border-slate-200/80 bg-white/90 p-5 dark:border-slate-800 dark:bg-slate-900/90">
                    <h5 className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                        2
                      </span>
                      What I Hope to Build with an AI Coding Agent by Course Completion
                    </h5>
                    <p className="mt-2.5 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                      "By the end of MIT 624, I aim to master autonomous AI coding agents to design, construct, test, and deploy production-grade enterprise software systems. Specifically, I intend to build autonomous data-to-dashboard modernization tools—software that takes fragmented enterprise datasets, applies automated cleaning, generates relational schemas, and deploys interactive analytical applications that non-technical business leaders can immediately leverage."
                    </p>
                  </div>

                  {/* Requirement Checklist */}
                  <div className="rounded-xl bg-blue-100/60 p-4 dark:bg-blue-950/40">
                    <p className="text-xs font-bold uppercase tracking-wider text-blue-800 dark:text-blue-300 mb-2">
                      Discussion 1 Verified Requirements Checklist:
                    </p>
                    <div className="grid gap-2 text-xs sm:grid-cols-2">
                      <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span>1–2 minute video recorded with camera on</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span>Technology future reflection documented</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span>AI coding agent building goals articulated</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span>YouTube video presentation linked & embedded</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Video Presentation Area (Controlled exclusively via Admin Portal) */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
                    <Video className="h-5 w-5 text-red-600" />
                    One-to-Two-Minute Recorded Video Presentation
                  </h4>
                  <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Camera className="h-3.5 w-3.5 text-blue-600" /> Camera On Verified
                  </span>
                </div>

                {getYouTubeEmbedUrl(activeYoutubeUrl) ? (
                  <div className="overflow-hidden rounded-2xl border border-slate-200 bg-black shadow-lg dark:border-slate-800 aspect-video w-full">
                    <iframe
                      src={getYouTubeEmbedUrl(activeYoutubeUrl)!}
                      title="Discussion 1 Video Presentation"
                      className="h-full w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/80 p-8 text-center dark:border-slate-700 dark:bg-slate-800/30">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 text-red-600 shadow-sm dark:bg-red-950/50 dark:text-red-400">
                      <Youtube className="h-8 w-8" />
                    </div>
                    <h5 className="mt-4 text-base font-bold text-slate-900 dark:text-white">
                      Official Video Presentation
                    </h5>
                    <p className="mx-auto mt-2 max-w-lg text-sm text-slate-600 dark:text-slate-400">
                      Recorded 1–2 minute video presentation with camera on. Published directly from the secure Central Admin Control Centre.
                    </p>
                    <div className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-200/70 dark:bg-slate-800 dark:text-slate-300 px-3.5 py-1.5 rounded-full">
                      <ShieldCheck className="h-3.5 w-3.5 text-blue-600" /> Managed & Published Exclusively via Admin Portal
                    </div>
                  </div>
                )}
              </div>

              {/* Space for Peer Feedback and Responses (Read-Only for Public Visitors) */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 dark:border-slate-800 dark:bg-slate-800/30">
                <div className="flex items-center justify-between">
                  <h4 className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
                    <MessageSquare className="h-5 w-5 text-blue-600" />
                    Peer Response & Academic Review
                  </h4>
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Verified Course Cohort Activity
                  </span>
                </div>

                <div className="mt-4 space-y-3">
                  {peerFeedbackList.map((item, idx) => (
                    <div key={idx} className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-700/60 dark:bg-slate-800">
                      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                        <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                          <UserCheck className="h-3.5 w-3.5 text-blue-600" />
                          {item.author}
                        </span>
                        <span>{item.date}</span>
                      </div>
                      <p className="mt-2 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                        "{item.comment}"
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </article>

          {/* Activity 2: Task 1 */}
          <article id="task-1" className="scroll-mt-24 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex flex-col justify-between gap-4 border-b border-slate-100 pb-6 md:flex-row md:items-center dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded-lg bg-indigo-600 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
                    Task 1
                  </span>
                  <span className="rounded-lg bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    Status: {activities[1].status}
                  </span>
                </div>
                <h3 className="mt-3 text-2xl font-bold text-slate-900 dark:text-white">
                  Task 1: Practical Work & Implementation
                </h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Assignment specifications, implementation repository, and deliverable artifacts.
                </p>
              </div>

              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                <CheckCircle2 className="h-3.5 w-3.5 text-indigo-500" />
                Verified: {activities[1].status}
              </span>
            </div>

            <div className="mt-6 space-y-6">
              {/* Task 1 Uploaded Deliverables from Admin */}
              {renderModuleResources('Task 1')}

              {/* Assignment Description Space */}
              <div className="rounded-2xl bg-slate-50 p-5 dark:bg-slate-800/40">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <FileText className="h-4 w-4 text-blue-600" />
                  Assignment Description
                </h4>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  Software architecture, environment setup, and practical application development using modern AI-assisted engineering tools.
                </p>
              </div>

              {/* Practical Work and Implementation Space */}
              <div className="rounded-2xl bg-slate-50 p-5 dark:bg-slate-800/40">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Code2 className="h-4 w-4 text-indigo-600" />
                  Practical Work & Implementation
                </h4>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  Implementation methodology, architecture blueprints, and enterprise engineering workflows documented upon completion of Task 1.
                </p>
              </div>

              {/* Project Screenshots Area */}
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
                  <ImageIcon className="h-4 w-4 text-emerald-600" />
                  Project Screenshots & Visual Evidence
                </h4>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex h-44 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/60 p-4 text-center dark:border-slate-800 dark:bg-slate-800/30">
                    <ImageIcon className="h-8 w-8 text-slate-300 dark:text-slate-600" />
                    <p className="mt-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
                      Screenshot Evidence 1
                    </p>
                    <span className="text-[11px] text-slate-400">UI / System Output</span>
                  </div>
                  <div className="flex h-44 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/60 p-4 text-center dark:border-slate-800 dark:bg-slate-800/30">
                    <Code2 className="h-8 w-8 text-slate-300 dark:text-slate-600" />
                    <p className="mt-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
                      Screenshot Evidence 2
                    </p>
                    <span className="text-[11px] text-slate-400">Code / Testing Artifact</span>
                  </div>
                </div>
              </div>

              {/* Links and Submission Space */}
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 text-white dark:bg-slate-700">
                      <Github className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase">Repository</p>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">Source Code / GitHub</p>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-blue-600">Admin Managed</span>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
                      <FileCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase">Deliverable</p>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">Final Document / Submission Link</p>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-blue-600">Admin Managed</span>
                </div>
              </div>
            </div>
          </article>

          {/* Activity 3: Discussion 3 */}
          <article id="discussion-3" className="scroll-mt-24 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex flex-col justify-between gap-4 border-b border-slate-100 pb-6 md:flex-row md:items-center dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded-lg bg-blue-600 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
                    Discussion 3
                  </span>
                  <span className="rounded-lg bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    Status: {activities[2].status}
                  </span>
                </div>
                <h3 className="mt-3 text-2xl font-bold text-slate-900 dark:text-white">
                  Discussion 3: Topic & Recorded Presentation
                </h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Discussion instructions, video presentation artifact, and peer review interaction.
                </p>
              </div>

              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                <CheckCircle2 className="h-3.5 w-3.5 text-blue-500" />
                Verified: {activities[2].status}
              </span>
            </div>

            <div className="mt-6 space-y-6">
              {/* Discussion 3 Uploaded Deliverables from Admin */}
              {renderModuleResources('Discussion 3')}

              <div className="rounded-2xl bg-slate-50 p-5 dark:bg-slate-800/40">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-blue-600" />
                  Discussion Topic and Instructions
                </h4>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  Prompts, case study materials, and practical AI system evaluation guidelines for Discussion 3.
                </p>
              </div>

              <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/60 p-6 text-center dark:border-slate-800 dark:bg-slate-800/30">
                <Youtube className="mx-auto h-8 w-8 text-red-500" />
                <h5 className="mt-2 text-sm font-bold text-slate-900 dark:text-white">
                  Recorded Video or Completed Project Artifact Space
                </h5>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  YouTube video presentation and artifact downloads managed and published via Admin Portal.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5 dark:border-slate-800 dark:bg-slate-800/30">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-blue-600" />
                  Peer Feedback and Responses Space
                </h4>
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                  Peer review responses, faculty comments, and academic discussions maintained here.
                </p>
              </div>
            </div>
          </article>

          {/* Activity 4: Task 2 */}
          <article id="task-2" className="scroll-mt-24 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex flex-col justify-between gap-4 border-b border-slate-100 pb-6 md:flex-row md:items-center dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded-lg bg-indigo-600 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
                    Task 2
                  </span>
                  <span className="rounded-lg bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    Status: {activities[3].status}
                  </span>
                </div>
                <h3 className="mt-3 text-2xl font-bold text-slate-900 dark:text-white">
                  Task 2: Practical Implementation
                </h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Intermediate software system implementation, architecture screenshots, and source code.
                </p>
              </div>

              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                <CheckCircle2 className="h-3.5 w-3.5 text-indigo-500" />
                Verified: {activities[3].status}
              </span>
            </div>

            <div className="mt-6 space-y-6">
              {/* Task 2 Uploaded Deliverables from Admin */}
              {renderModuleResources('Task 2')}

              <div className="rounded-2xl bg-slate-50 p-5 dark:bg-slate-800/40">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Assignment Description</h4>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  Task 2 system architecture, requirements, and full-stack software implementation notes.
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-5 dark:bg-slate-800/40">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Practical Implementation</h4>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  Engineering documentation and implementation walkthrough recorded upon completion.
                </p>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2">Project Screenshots</h4>
                <div className="h-32 flex items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/60 dark:border-slate-800 dark:bg-slate-800/30">
                  <span className="text-xs text-slate-400">Screenshots space for Task 2 deliverables</span>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-800">
                  <p className="text-xs font-bold text-slate-400 uppercase">GitHub Repository</p>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Admin Managed</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-800">
                  <p className="text-xs font-bold text-slate-400 uppercase">Final Submission</p>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Admin Managed</p>
                </div>
              </div>
            </div>
          </article>

          {/* Activity 5: Discussion 5 */}
          <article id="discussion-5" className="scroll-mt-24 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex flex-col justify-between gap-4 border-b border-slate-100 pb-6 md:flex-row md:items-center dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded-lg bg-blue-600 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
                    Discussion 5
                  </span>
                  <span className="rounded-lg bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    Status: {activities[4].status}
                  </span>
                </div>
                <h3 className="mt-3 text-2xl font-bold text-slate-900 dark:text-white">
                  Discussion 5: Advanced Topic & Recorded Presentation
                </h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Advanced software modernization presentation, video artifact, and peer response dialogue.
                </p>
              </div>

              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                <CheckCircle2 className="h-3.5 w-3.5 text-blue-500" />
                Verified: {activities[4].status}
              </span>
            </div>

            <div className="mt-6 space-y-6">
              {/* Discussion 5 Uploaded Deliverables from Admin */}
              {renderModuleResources('Discussion 5')}

              <div className="rounded-2xl bg-slate-50 p-5 dark:bg-slate-800/40">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Discussion Topic and Instructions</h4>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  Discussion 5 prompts, engineering architecture analysis, and presentation criteria.
                </p>
              </div>

              <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/60 p-6 text-center dark:border-slate-800 dark:bg-slate-800/30">
                <Youtube className="mx-auto h-8 w-8 text-red-500" />
                <h5 className="mt-2 text-sm font-bold text-slate-900 dark:text-white">
                  Recorded Presentation or Completed Project Space
                </h5>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  YouTube video presentation and deliverable document links managed from Admin Portal.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5 dark:border-slate-800 dark:bg-slate-800/30">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Peer Feedback and Responses</h4>
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                  Collaborative commentary and verified cohort peer responses.
                </p>
              </div>
            </div>
          </article>

          {/* Activity 6: Task 3 */}
          <article id="task-3" className="scroll-mt-24 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex flex-col justify-between gap-4 border-b border-slate-100 pb-6 md:flex-row md:items-center dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded-lg bg-indigo-600 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
                    Task 3
                  </span>
                  <span className="rounded-lg bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    Status: {activities[5].status}
                  </span>
                </div>
                <h3 className="mt-3 text-2xl font-bold text-slate-900 dark:text-white">
                  Task 3: Advanced Implementation & Evidence
                </h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Technical assignment execution, screenshots, evidence of work, and repository.
                </p>
              </div>

              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                <CheckCircle2 className="h-3.5 w-3.5 text-indigo-500" />
                Verified: {activities[5].status}
              </span>
            </div>

            <div className="mt-6 space-y-6">
              {/* Task 3 Uploaded Deliverables from Admin */}
              {renderModuleResources('Task 3')}

              <div className="rounded-2xl bg-slate-50 p-5 dark:bg-slate-800/40">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Assignment Description</h4>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  Advanced software system implementation, database normalization, and AI toolchain integration.
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-5 dark:bg-slate-800/40">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Practical Implementation</h4>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  Implementation evidence, testing outputs, and deployment notes.
                </p>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2">Screenshots & Evidence of Work</h4>
                <div className="h-32 flex items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/60 dark:border-slate-800 dark:bg-slate-800/30">
                  <span className="text-xs text-slate-400">Evidence of work screenshots space for Task 3</span>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-800">
                  <p className="text-xs font-bold text-slate-400 uppercase">Source Code / GitHub</p>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Admin Managed</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-800">
                  <p className="text-xs font-bold text-slate-400 uppercase">Final Submission Link</p>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Admin Managed</p>
                </div>
              </div>
            </div>
          </article>

          {/* Activity 7: Discussion 7 */}
          <article id="discussion-7" className="scroll-mt-24 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex flex-col justify-between gap-4 border-b border-slate-100 pb-6 md:flex-row md:items-center dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded-lg bg-blue-600 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
                    Discussion 7
                  </span>
                  <span className="rounded-lg bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    Status: {activities[6].status}
                  </span>
                </div>
                <h3 className="mt-3 text-2xl font-bold text-slate-900 dark:text-white">
                  Discussion 7: Video & Project Artifact Discussion
                </h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Discussion prompt, recorded presentation, artifact link, and peer responses.
                </p>
              </div>

              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                <CheckCircle2 className="h-3.5 w-3.5 text-blue-500" />
                Verified: {activities[6].status}
              </span>
            </div>

            <div className="mt-6 space-y-6">
              {/* Discussion 7 Uploaded Deliverables from Admin */}
              {renderModuleResources('Discussion 7')}

              <div className="rounded-2xl bg-slate-50 p-5 dark:bg-slate-800/40">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Discussion Topic and Instructions</h4>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  Synthesis and evaluation of AI-driven modernization patterns.
                </p>
              </div>

              <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/60 p-6 text-center dark:border-slate-800 dark:bg-slate-800/30">
                <Youtube className="mx-auto h-8 w-8 text-red-500" />
                <h5 className="mt-2 text-sm font-bold text-slate-900 dark:text-white">
                  Recorded Video or Completed Project Artifact
                </h5>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  YouTube video presentation and deliverable links managed via Admin Portal.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5 dark:border-slate-800 dark:bg-slate-800/30">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Peer Feedback and Responses</h4>
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                  Peer responses and collaborative feedback space.
                </p>
              </div>
            </div>
          </article>

          {/* Activity 8: Task 4 */}
          <article id="task-4" className="scroll-mt-24 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex flex-col justify-between gap-4 border-b border-slate-100 pb-6 md:flex-row md:items-center dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded-lg bg-indigo-600 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
                    Task 4
                  </span>
                  <span className="rounded-lg bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    Status: {activities[7].status}
                  </span>
                </div>
                <h3 className="mt-3 text-2xl font-bold text-slate-900 dark:text-white">
                  Task 4: Capstone Implementation & Final System Delivery
                </h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Culminating software delivery, production screenshots, repository, and final submission.
                </p>
              </div>

              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                <CheckCircle2 className="h-3.5 w-3.5 text-indigo-500" />
                Verified: {activities[7].status}
              </span>
            </div>

            <div className="mt-6 space-y-6">
              {/* Task 4 Uploaded Deliverables from Admin */}
              {renderModuleResources('Task 4')}

              <div className="rounded-2xl bg-slate-50 p-5 dark:bg-slate-800/40">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Assignment Description</h4>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  Task 4 capstone instructions and project evaluation rubric.
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-5 dark:bg-slate-800/40">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Practical Implementation</h4>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  Full capstone implementation documentation and architecture specifications.
                </p>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2">Final Project Screenshots</h4>
                <div className="h-36 flex items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/60 dark:border-slate-800 dark:bg-slate-800/30">
                  <span className="text-xs text-slate-400">Final production project screenshots for Task 4</span>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-800">
                  <p className="text-xs font-bold text-slate-400 uppercase">Source Code / GitHub Repository</p>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Admin Managed</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-800">
                  <p className="text-xs font-bold text-slate-400 uppercase">Final Submission Link</p>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Admin Managed</p>
                </div>
              </div>
            </div>
          </article>
        </section>

      </div>
    </div>
  );
}
