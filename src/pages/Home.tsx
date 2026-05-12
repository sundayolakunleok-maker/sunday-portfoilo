import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { db } from '../lib/firebase';
import { collection, query, orderBy, getDocs, doc, getDocFromServer } from 'firebase/firestore';
import Hero from '../components/Hero';
import About from '../components/About';
import Skills from '../components/Skills';
import Projects from '../components/Projects';
import Experience from '../components/Experience';
import Contact from '../components/Contact';

export default function Home() {
  useEffect(() => {
    async function testConnection() {
      try {
        // Just a test to ensure Firebase is reachable
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error: any) {
        if (error.message?.includes('offline')) {
          console.error("Firebase is offline. Check your configuration.");
        }
      }
    }
    testConnection();
  }, []);

  return (
    <div className="flex flex-col gap-20 pb-20">
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Experience />
      <Contact />
    </div>
  );
}
