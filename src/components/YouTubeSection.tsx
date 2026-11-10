import { useState, useEffect } from 'react';
import { Youtube, ExternalLink, Play, CheckCircle2, Video, ArrowRight } from 'lucide-react';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { VideoItem } from '../pages/Admin';

export default function YouTubeSection() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [activeModalVideo, setActiveModalVideo] = useState<VideoItem | null>(null);

  // Default featured videos fallback
  const defaultVideos: VideoItem[] = [
    {
      id: 'default-1',
      title: 'MIT 624 Discussion 1: AI-Powered Software Development Journey',
      description: 'Recorded 2-minute video presentation covering career goals, AI coding agents, and enterprise software modernizations.',
      youtubeUrl: 'https://www.youtube.com/@OLAKUNLEokegbemi',
      videoId: '',
      thumbnailUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800',
      platform: 'both',
      category: 'MIT 624 Academic',
      status: 'published',
      isFeatured: true
    },
    {
      id: 'default-2',
      title: 'Enterprise Manufacturing ERP Suite Architecture & Database Engine',
      description: 'Comprehensive walkthrough of full-stack Python Flask manufacturing suite with production order tracking and inventory.',
      youtubeUrl: 'https://www.youtube.com/@OLAKUNLEokegbemi',
      videoId: '',
      thumbnailUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800',
      platform: 'portfolio',
      category: 'Software Engineering',
      status: 'published',
      isFeatured: true
    },
    {
      id: 'default-3',
      title: 'Sales & Profit Financial Intelligence Dashboard Walkthrough',
      description: 'Power BI & Excel commercial margin audit analyzing four fiscal years of retail transaction data.',
      youtubeUrl: 'https://www.youtube.com/@OLAKUNLEokegbemi',
      videoId: '',
      thumbnailUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
      platform: 'portfolio',
      category: 'Data Analytics',
      status: 'published',
      isFeatured: true
    }
  ];

  useEffect(() => {
    async function loadPublishedVideos() {
      try {
        const q = query(
          collection(db, 'videos'),
          where('status', '==', 'published')
        );
        const snap = await getDocs(q);
        if (!snap.empty) {
          const items: VideoItem[] = snap.docs.map(d => ({
            id: d.id,
            ...(d.data() as any)
          }));
          setVideos(items);
        } else {
          setVideos(defaultVideos);
        }
      } catch (e) {
        setVideos(defaultVideos);
      }
    }
    loadPublishedVideos();
  }, []);

  const displayedVideos = videos.length > 0 ? videos : defaultVideos;

  const handleVideoClick = (vid: VideoItem) => {
    if (vid.youtubeUrl) {
      window.open(vid.youtubeUrl, '_blank', 'noopener,noreferrer');
    } else {
      window.open('https://www.youtube.com/@OLAKUNLEokegbemi', '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <section id="youtube" className="container px-6 mx-auto scroll-mt-24">
      {/* Outer Banner Card */}
      <div className="rounded-3xl border border-slate-200/90 bg-gradient-to-b from-white via-slate-50 to-red-50/20 p-8 md:p-12 shadow-sm dark:border-slate-800 dark:from-slate-900 dark:via-slate-900/80 dark:to-red-950/20">
        
        {/* Channel Branding & Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-600 text-white shadow-xl shadow-red-600/30">
              <Youtube className="h-9 w-9" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white sm:text-3xl tracking-tight">
                  Olakunle Data
                </h2>
                <span className="flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-bold text-red-700 dark:bg-red-900/40 dark:text-red-300">
                  <CheckCircle2 className="h-3 w-3" /> Official Channel
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                Academic presentations, AI software demos, and data intelligence video walkthroughs by Sunday Okegbemi.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="https://www.youtube.com/@OLAKUNLEokegbemi?sub_confirmation=1"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-red-600/20 hover:bg-red-700 transition-all hover:scale-105"
            >
              <Youtube className="h-4 w-4" />
              Subscribe to Channel
            </a>
            <a
              href="https://www.youtube.com/@OLAKUNLEokegbemi"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold text-slate-800 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              Visit Channel <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        {/* Videos Gallery Grid */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Video className="h-5 w-5 text-red-600" />
              Featured Video Presentations & Demonstrations
            </h3>
            <span className="text-xs text-slate-500">
              Click any video card to stream on YouTube
            </span>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {displayedVideos.map((vid) => (
              <div
                key={vid.id}
                onClick={() => handleVideoClick(vid)}
                className="group cursor-pointer rounded-2xl border border-slate-200/90 bg-white dark:border-slate-800 dark:bg-slate-900 overflow-hidden shadow-sm hover:shadow-xl hover:border-red-500 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Thumbnail Container */}
                  <div className="relative aspect-video w-full bg-slate-950 overflow-hidden">
                    <img
                      src={vid.thumbnailUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800'}
                      alt={vid.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                    />

                    {/* Dark gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

                    {/* Category pill */}
                    <span className="absolute top-3 left-3 rounded-full bg-slate-900/80 px-2.5 py-0.5 text-[10px] font-bold text-white backdrop-blur-md">
                      {vid.category || 'Presentation'}
                    </span>

                    {/* Center Play Button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600/90 text-white shadow-lg shadow-red-600/40 group-hover:scale-110 group-hover:bg-red-600 transition-all">
                        <Play className="h-5 w-5 fill-white ml-0.5" />
                      </div>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5">
                    <h4 className="font-bold text-slate-900 dark:text-white text-base group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors line-clamp-2">
                      {vid.title}
                    </h4>
                    {vid.description && (
                      <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {vid.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Footer Action */}
                <div className="px-5 pb-5 pt-2 flex items-center justify-between text-xs font-bold text-red-600 dark:text-red-400">
                  <span className="flex items-center gap-1 group-hover:underline">
                    Watch on YouTube
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <Youtube className="h-4 w-4 opacity-75" />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
