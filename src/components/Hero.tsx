import { motion } from 'motion/react';
import { ArrowRight, MapPin, Linkedin, GraduationCap, Github, BookOpen, Code2, Sparkles, CheckCircle2 } from 'lucide-react';
import { profile } from '../data';

export default function Hero() {
  return (
    <section id="home" className="relative flex min-h-[92vh] items-center justify-center overflow-hidden pt-28 pb-16">
      {/* Background Decals */}
      <div className="absolute top-1/4 left-1/4 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
      
      <div className="container relative z-10 px-6 mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Top Credentials Pill */}
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-blue-50/80 px-4 py-1.5 text-xs font-bold text-blue-700 shadow-2xs backdrop-blur-sm dark:border-blue-900/50 dark:bg-blue-950/40 dark:text-blue-300">
            <Sparkles className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
            <span>{profile.title} • 5+ Years Industry Practice</span>
          </div>

          {/* Profile Photo */}
          <div className="mt-8 flex justify-center">
            <div className="relative h-44 w-44 sm:h-52 sm:w-52 overflow-hidden rounded-full border-4 border-white shadow-2xl ring-4 ring-blue-500/20 dark:border-slate-800">
               <img 
                 src={profile.photoUrl} 
                 alt={profile.name} 
                 className="h-full w-full object-cover"
               />
               <div className="absolute inset-0 rounded-full ring-1 ring-inset ring-black/10" />
            </div>
          </div>

          {/* Name & Tagline */}
          <h1 className="mt-6 text-4xl font-black tracking-tight text-slate-900 sm:text-6xl dark:text-white uppercase">
            {profile.name}
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-base sm:text-lg font-semibold text-blue-600 dark:text-blue-400">
            {profile.tagline}
          </p>

          <p className="mx-auto mt-4 max-w-2xl text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-300">
            {profile.bio}
          </p>
          
          {/* Action Buttons */}
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <a
              href="#projects"
              className="group flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3.5 text-sm font-bold text-white shadow-md hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 transition active:scale-95"
            >
              Explore Data Projects
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>

            <a
              href="#software"
              className="flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50/80 px-6 py-3.5 text-sm font-bold text-indigo-700 shadow-2xs hover:bg-indigo-600 hover:text-white dark:border-indigo-900/50 dark:bg-indigo-950/40 dark:text-indigo-300 dark:hover:bg-indigo-600 dark:hover:text-white transition active:scale-95"
            >
              <Code2 className="h-4 w-4" />
              Software Systems
            </a>

            <a
              href="/mit-624"
              className="flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50/80 px-6 py-3.5 text-sm font-bold text-blue-700 shadow-2xs hover:bg-blue-600 hover:text-white dark:border-blue-900/50 dark:bg-blue-950/40 dark:text-blue-300 dark:hover:bg-blue-600 dark:hover:text-white transition active:scale-95"
            >
              <GraduationCap className="h-4 w-4" />
              MIT 624 Academic
            </a>

            <a
              href="#contact"
              className="rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-bold text-slate-800 shadow-2xs hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800 transition active:scale-95"
            >
              Contact Me
            </a>
          </div>
          
          {/* Quick Social & Location Badges */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-5 sm:gap-8 text-xs font-semibold text-slate-600 dark:text-slate-400">
             <div className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-blue-600" />
                <span>{profile.location}</span>
             </div>

             <a
               href={profile.github}
               target="_blank"
               rel="noopener noreferrer"
               className="flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-white transition"
             >
                <Github className="h-4 w-4" />
                <span>GitHub Profile</span>
             </a>

             <a
               href={profile.mediumProfile}
               target="_blank"
               rel="noopener noreferrer"
               className="flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-white transition"
             >
                <BookOpen className="h-4 w-4 text-blue-600" />
                <span>Medium Articles</span>
             </a>

             <a
               href={profile.linkedin}
               target="_blank"
               rel="noopener noreferrer"
               className="flex items-center gap-1.5 hover:text-blue-600 dark:hover:text-blue-400 transition"
             >
                <Linkedin className="h-4 w-4 text-blue-600" />
                <span>LinkedIn</span>
             </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
