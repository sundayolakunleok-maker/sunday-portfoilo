import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { GraduationCap, Award } from 'lucide-react';
import { db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function About() {
  const [bio, setBio] = useState(`I am Sunday Okegbemi, a results-driven Data Analyst with over 5 years of experience transforming complex data into actionable insights across FMCG, Banking, E-Commerce, Logistics & Procurement, and Healthcare.
  
  I specialize in turning raw data into clear reports, dashboards, and models that support smarter, data-driven decision-making in fast-paced environments. My work often involves data cleaning, exploratory analysis, and building interactive dashboards.`);

  useEffect(() => {
    async function fetchBio() {
      const docRef = doc(db, 'profile', 'main');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.bio) setBio(data.bio);
      }
    }
    fetchBio();
  }, []);

  const certifications = [
    "Certificate in Data science (UniAthena/Cambridge)",
    "Certificate in Python Programming (UniAthena/Cambridge)",
    "Certificate in Essential Excel (UniAthena/Cambridge)",
    "Certificate in Procurement Management (UniAthena)",
    "Data Labeling Job Simulation (Forage)"
  ];

  return (
    <section id="about" className="container px-6 mx-auto scroll-mt-20">
      <div className="grid gap-12 md:grid-cols-2">
        <motion.div
           whileInView={{ opacity: 1, x: 0 }}
           initial={{ opacity: 0, x: -30 }}
           transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white uppercase">About Me</h2>
          <div className="mt-6 space-y-4 text-lg leading-relaxed text-slate-600 dark:text-slate-400 whitespace-pre-line">
            <p>{bio}</p>
          </div>
          
          <div className="mt-10 flex items-start gap-4">
            <GraduationCap className="h-8 w-8 text-blue-600 shrink-0" />
            <div>
              <h3 className="text-xl font-semibold dark:text-white">Education</h3>
              <p className="mt-1 text-slate-600 dark:text-slate-400">
                B.Tech in Statistics - Ladoke Akintola University of Technology (LAUTECH)
              </p>
            </div>
          </div>
        </motion.div>
        
        <motion.div
          whileInView={{ opacity: 1, x: 0 }}
          initial={{ opacity: 0, x: 30 }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl bg-white p-8 shadow-sm dark:bg-slate-900 dark:border dark:border-slate-800"
        >
          <div className="flex items-center gap-3 mb-6">
            <Award className="h-7 w-7 text-blue-600" />
            <h3 className="text-2xl font-bold dark:text-white">Certifications</h3>
          </div>
          <ul className="space-y-4">
            {certifications.map((cert, index) => (
              <li key={index} className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                <div className="h-2 w-2 rounded-full bg-blue-500" />
                <span>{cert}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}

