import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Linkedin, ArrowRight } from 'lucide-react';
import { db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function Hero() {
  const [profile, setProfile] = useState({
    name: 'SUNDAY OKEGBEMI',
    title: 'Professional Data Analyst',
    bio: 'Turning Raw Data into Clear Insights. Helping businesses optimize processes through data-driven decision-making.',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400'
  });

  useEffect(() => {
    async function fetchProfile() {
      const docRef = doc(db, 'profile', 'main');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProfile(docSnap.data() as any);
      }
    }
    fetchProfile();
  }, []);

  return (
    <section id="home" className="relative flex min-h-[90vh] items-center justify-center overflow-hidden pt-20">
      {/* Background Decals */}
      <div className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />
      
      <div className="container relative z-10 px-6 mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block rounded-full bg-blue-100 px-4 py-1.5 text-sm font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
            {profile.title}
          </span>
          <div className="mt-10 flex justify-center">
            <div className="relative h-48 w-48 overflow-hidden rounded-full border-4 border-white shadow-2xl ring-4 ring-blue-500/20 dark:border-slate-800">
               <img 
                 src={profile.photoUrl} 
                 alt={profile.name} 
                 className="h-full w-full object-cover"
               />
            </div>
          </div>
          <h1 className="mt-6 text-5xl font-bold tracking-tight text-slate-900 sm:text-7xl dark:text-white uppercase">
            {profile.name}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-xl leading-8 text-slate-600 dark:text-slate-400">
            {profile.bio}
          </p>
          
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6">
            <a
              href="#projects"
              className="group flex items-center gap-2 rounded-xl bg-slate-900 px-8 py-4 text-lg font-semibold text-white transition-all hover:bg-slate-800 hover:shadow-lg dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
            >
              View My Work
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#contact"
              className="rounded-xl border border-slate-200 bg-white px-8 py-4 text-lg font-semibold text-slate-900 transition-all hover:bg-slate-50 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800"
            >
              Contact Me
            </a>
          </div>
          
          <div className="mt-12 flex items-center justify-center gap-8 text-slate-500 dark:text-slate-500">
             <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                <span>Nigeria</span>
             </div>
             <div className="hidden h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-700 md:block" />
             <div className="flex items-center gap-2">
                <Linkedin className="h-5 w-5" />
                <span>LinkedIn</span>
             </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

