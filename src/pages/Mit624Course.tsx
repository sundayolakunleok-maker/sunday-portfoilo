import { useState, type FormEvent } from 'react';
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
  Clock, 
  AlertCircle, 
  ArrowLeft, 
  Camera, 
  Share2, 
  Sparkles,
  Code2,
  Image as ImageIcon,
  Send,
  UserCheck,
  Building2,
  Layers
} from 'lucide-react';
import { mit624CourseInfo, courseActivities, type CourseActivity } from '../courseData';

interface Mit624CourseProps {
  onBackToHome?: () => void;
}

export default function Mit624Course({ onBackToHome }: Mit624CourseProps) {
  // Local state initialized with courseActivities from courseData
  const [activities, setActivities] = useState<CourseActivity[]>(courseActivities);
  const [discussion1InputUrl, setDiscussion1InputUrl] = useState(courseActivities[0]?.youtubeUrl || '');
  const [activeYoutubeUrl, setActiveYoutubeUrl] = useState(courseActivities[0]?.youtubeUrl || '');
  
  // Interactive Peer Feedback state for Discussion 1
  const [peerFeedbackList, setPeerFeedbackList] = useState([
    {
      author: "Peer Reviewer (Classmate)",
      date: "Active Course Term",
      comment: "Excellent alignment between your 5+ years in data analytics and modern enterprise software modernization. The autonomous AI coding agent workflow is a strong direction."
    }
  ]);
  const [newFeedbackName, setNewFeedbackName] = useState('');
  const [newFeedbackText, setNewFeedbackText] = useState('');

  // Extract YouTube ID helper
  const getYouTubeEmbedUrl = (url?: string) => {
    if (!url) return null;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
  };

  const handleApplyVideoUrl = (e: FormEvent) => {
    e.preventDefault();
    setActiveYoutubeUrl(discussion1InputUrl.trim());
    setActivities(prev => prev.map((act, idx) => idx === 0 ? { ...act, youtubeUrl: discussion1InputUrl.trim() } : act));
  };

  const handleAddPeerFeedback = (e: FormEvent) => {
    e.preventDefault();
    if (!newFeedbackText.trim()) return;
    setPeerFeedbackList(prev => [
      ...prev,
      {
        author: newFeedbackName.trim() || "Peer Reviewer",
        date: "Just now",
        comment: newFeedbackText.trim()
      }
    ]);
    setNewFeedbackName('');
    setNewFeedbackText('');
  };

  const handleUpdateStatus = (id: string, newStatus: 'Not Started' | 'In Progress' | 'Completed') => {
    setActivities(prev => prev.map(act => act.id === id ? { ...act, status: newStatus } : act));
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

            {/* Card 4 - Full Span or Span 2 */}
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

        {/* 5. Course Progress Tracker */}
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

        {/* 3 & 4. Course Activities and Submission Sections (Exact Order) */}
        <section className="mt-14 space-y-12">
          <div className="border-b border-slate-200 pb-4 dark:border-slate-800">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
              Course Activities & Submission Records
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Chronological coursework, multimedia presentations, repository artifacts, and academic deliverables.
            </p>
          </div>

          {/* Activity 1: Discussion 1 */}
          <article id="discussion-1" className="scroll-mt-24 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 dark:border-slate-800 dark:bg-slate-900">
            {/* Header */}
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

              {/* Status Selector dropdown */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500 font-medium">Update Status:</span>
                <select
                  value={activities[0].status}
                  onChange={(e) => handleUpdateStatus('discussion-1', e.target.value as any)}
                  className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 font-semibold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  <option value="Not Started">Not Started</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
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
                    href="https://eclectic-malabi-7933bf.netlify.app/mit-624"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400"
                  >
                    https://eclectic-malabi-7933bf.netlify.app/mit-624
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>

              {/* 4. Highlighted Subsection: My Technology Future and AI Development Goals */}
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
                        <span>YouTube video link slot (Public/Unlisted)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Video Embed Section with Configurable Placeholder */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
                    <Video className="h-5 w-5 text-red-600" />
                    One-to-Two-Minute Recorded Video Presentation
                  </h4>
                  <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Camera className="h-3.5 w-3.5 text-blue-600" /> Camera On Requirement
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
                      YouTube Video Link Placeholder
                    </h5>
                    <p className="mx-auto mt-2 max-w-lg text-sm text-slate-600 dark:text-slate-400">
                      Record your 1–2 minute presentation with your camera on, upload it as <strong>Public</strong> or <strong>Unlisted</strong> to YouTube, and paste your URL below to embed the video directly.
                    </p>
                    
                    {/* Inline video link setter */}
                    <form onSubmit={handleApplyVideoUrl} className="mx-auto mt-5 flex max-w-md flex-col gap-2 sm:flex-row">
                      <input
                        type="url"
                        placeholder="https://www.youtube.com/watch?v=..."
                        value={discussion1InputUrl}
                        onChange={(e) => setDiscussion1InputUrl(e.target.value)}
                        className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                      />
                      <button
                        type="submit"
                        className="rounded-xl bg-red-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700"
                      >
                        Embed Video
                      </button>
                    </form>
                    <p className="mt-2 text-xs text-slate-400">
                      You can also permanently save your video link inside <code className="rounded bg-slate-200 px-1 py-0.5 text-slate-800 dark:bg-slate-800 dark:text-slate-200">src/courseData.ts</code>.
                    </p>
                  </div>
                )}
              </div>

              {/* Space for Peer Feedback and Responses */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 dark:border-slate-800 dark:bg-slate-800/30">
                <div className="flex items-center justify-between">
                  <h4 className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
                    <MessageSquare className="h-5 w-5 text-blue-600" />
                    Peer Response & Feedback Area
                  </h4>
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {peerFeedbackList.length} Response(s)
                  </span>
                </div>

                <div className="mt-4 space-y-3">
                  {peerFeedbackList.map((item, idx) => (
                    <div key={idx} className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-700/60 dark:bg-slate-800">
                      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                        <span className="font-bold text-slate-800 dark:text-slate-200">{item.author}</span>
                        <span>{item.date}</span>
                      </div>
                      <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
                        {item.comment}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Add Feedback Input */}
                <form onSubmit={handleAddPeerFeedback} className="mt-5 space-y-3">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <input
                      type="text"
                      placeholder="Your Name (Peer Reviewer)"
                      value={newFeedbackName}
                      onChange={(e) => setNewFeedbackName(e.target.value)}
                      className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 shadow-2xs focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>
                  <div className="flex gap-2">
                    <textarea
                      rows={2}
                      placeholder="Add peer critique, questions, or responses for Discussion 1..."
                      value={newFeedbackText}
                      onChange={(e) => setNewFeedbackText(e.target.value)}
                      className="flex-1 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 shadow-2xs focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-95"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                </form>
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

              <select
                value={activities[1].status}
                onChange={(e) => handleUpdateStatus('task-1', e.target.value as any)}
                className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                <option value="Not Started">Not Started</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div className="mt-6 space-y-6">
              {/* Assignment Description Space */}
              <div className="rounded-2xl bg-slate-50 p-5 dark:bg-slate-800/40">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <FileText className="h-4 w-4 text-blue-600" />
                  Assignment Description
                </h4>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 italic">
                  [Space reserved for instructor's assignment description, learning objectives, and grading rubric for Task 1.]
                </p>
              </div>

              {/* Practical Work and Implementation Space */}
              <div className="rounded-2xl bg-slate-50 p-5 dark:bg-slate-800/40">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Code2 className="h-4 w-4 text-indigo-600" />
                  Practical Work & Implementation
                </h4>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 italic">
                  [Detailed notes on implementation methodology, architecture diagrams, and software engineering processes will be documented here upon completion of Task 1.]
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
                      Screenshot Placeholder 1
                    </p>
                    <span className="text-[11px] text-slate-400">UI / System Output</span>
                  </div>
                  <div className="flex h-44 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/60 p-4 text-center dark:border-slate-800 dark:bg-slate-800/30">
                    <Code2 className="h-8 w-8 text-slate-300 dark:text-slate-600" />
                    <p className="mt-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
                      Screenshot Placeholder 2
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
                  <span className="text-xs font-medium text-slate-400 italic">Ready to link</span>
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
                  <span className="text-xs font-medium text-slate-400 italic">Ready to link</span>
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

              <select
                value={activities[2].status}
                onChange={(e) => handleUpdateStatus('discussion-3', e.target.value as any)}
                className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                <option value="Not Started">Not Started</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div className="mt-6 space-y-6">
              <div className="rounded-2xl bg-slate-50 p-5 dark:bg-slate-800/40">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-blue-600" />
                  Discussion Topic and Instructions
                </h4>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 italic">
                  [Space reserved for Discussion 3 prompts, case study materials, and instructor guidelines.]
                </p>
              </div>

              {/* Video or Artifact Space */}
              <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/60 p-6 text-center dark:border-slate-800 dark:bg-slate-800/30">
                <Youtube className="mx-auto h-8 w-8 text-red-500" />
                <h5 className="mt-2 text-sm font-bold text-slate-900 dark:text-white">
                  Recorded Video or Completed Project Artifact Space
                </h5>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  YouTube video link and artifact download URL placeholder for Discussion 3.
                </p>
              </div>

              {/* Peer Feedback Space */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5 dark:border-slate-800 dark:bg-slate-800/30">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-blue-600" />
                  Peer Feedback and Responses Space
                </h4>
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 italic">
                  [Peer review responses, faculty comments, and academic discussions for Discussion 3 will be maintained here.]
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

              <select
                value={activities[3].status}
                onChange={(e) => handleUpdateStatus('task-2', e.target.value as any)}
                className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                <option value="Not Started">Not Started</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div className="mt-6 space-y-6">
              <div className="rounded-2xl bg-slate-50 p-5 dark:bg-slate-800/40">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Assignment Description</h4>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 italic">
                  [Space reserved for Task 2 instructions and system requirements.]
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-5 dark:bg-slate-800/40">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Practical Implementation</h4>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 italic">
                  [Practical engineering notes and implementation walkthrough will be recorded here.]
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
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 italic">Pending assignment launch</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-800">
                  <p className="text-xs font-bold text-slate-400 uppercase">Final Submission</p>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 italic">Pending submission upload</p>
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

              <select
                value={activities[4].status}
                onChange={(e) => handleUpdateStatus('discussion-5', e.target.value as any)}
                className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                <option value="Not Started">Not Started</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div className="mt-6 space-y-6">
              <div className="rounded-2xl bg-slate-50 p-5 dark:bg-slate-800/40">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Discussion Topic and Instructions</h4>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 italic">
                  [Space reserved for Discussion 5 prompts and presentation criteria.]
                </p>
              </div>

              <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/60 p-6 text-center dark:border-slate-800 dark:bg-slate-800/30">
                <Youtube className="mx-auto h-8 w-8 text-red-500" />
                <h5 className="mt-2 text-sm font-bold text-slate-900 dark:text-white">
                  Recorded Presentation or Completed Project Space
                </h5>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  YouTube video and document link placeholder.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5 dark:border-slate-800 dark:bg-slate-800/30">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Peer Feedback and Responses</h4>
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 italic">
                  [Collaborative commentary and peer responses will be hosted here.]
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

              <select
                value={activities[5].status}
                onChange={(e) => handleUpdateStatus('task-3', e.target.value as any)}
                className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                <option value="Not Started">Not Started</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div className="mt-6 space-y-6">
              <div className="rounded-2xl bg-slate-50 p-5 dark:bg-slate-800/40">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Assignment Description</h4>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 italic">
                  [Space reserved for Task 3 instructions from the academic curriculum.]
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-5 dark:bg-slate-800/40">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Practical Implementation</h4>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 italic">
                  [Implementation evidence, testing outputs, and deployment notes.]
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
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 italic">Ready for repo link</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-800">
                  <p className="text-xs font-bold text-slate-400 uppercase">Final Submission Link</p>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 italic">Ready for document link</p>
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

              <select
                value={activities[6].status}
                onChange={(e) => handleUpdateStatus('discussion-7', e.target.value as any)}
                className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                <option value="Not Started">Not Started</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div className="mt-6 space-y-6">
              <div className="rounded-2xl bg-slate-50 p-5 dark:bg-slate-800/40">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Discussion Topic and Instructions</h4>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 italic">
                  [Space reserved for Discussion 7 topics and instructions.]
                </p>
              </div>

              <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/60 p-6 text-center dark:border-slate-800 dark:bg-slate-800/30">
                <Youtube className="mx-auto h-8 w-8 text-red-500" />
                <h5 className="mt-2 text-sm font-bold text-slate-900 dark:text-white">
                  Recorded Video or Completed Project Artifact
                </h5>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  YouTube video link and artifact link space for Discussion 7.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5 dark:border-slate-800 dark:bg-slate-800/30">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Peer Feedback and Responses</h4>
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 italic">
                  [Peer responses and collaborative feedback space.]
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

              <select
                value={activities[7].status}
                onChange={(e) => handleUpdateStatus('task-4', e.target.value as any)}
                className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                <option value="Not Started">Not Started</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div className="mt-6 space-y-6">
              <div className="rounded-2xl bg-slate-50 p-5 dark:bg-slate-800/40">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Assignment Description</h4>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 italic">
                  [Space reserved for Task 4 capstone instructions and project evaluation rubric.]
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-5 dark:bg-slate-800/40">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Practical Implementation</h4>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 italic">
                  [Full capstone implementation documentation and architecture specifications.]
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
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 italic">Ready for final repository URL</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-800">
                  <p className="text-xs font-bold text-slate-400 uppercase">Final Submission Link</p>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 italic">Ready for submission document link</p>
                </div>
              </div>
            </div>
          </article>
        </section>

      </div>
    </div>
  );
}
