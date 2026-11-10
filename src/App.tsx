/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import Home from './pages/Home';
import Mit624Course from './pages/Mit624Course';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

export default function App() {
  const getInitialPage = (): 'home' | 'mit-624' => {
    if (typeof window === 'undefined') return 'home';
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    if (path.includes('mit-624') || hash.includes('mit-624')) {
      return 'mit-624';
    }
    return 'home';
  };

  const [currentPage, setCurrentPage] = useState<'home' | 'mit-624'>(getInitialPage);

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path.includes('mit-624') || hash.includes('mit-624')) {
        setCurrentPage('mit-624');
      } else {
        setCurrentPage('home');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (page: 'home' | 'mit-624', sectionId?: string) => {
    setCurrentPage(page);
    const targetUrl = page === 'mit-624' ? '/mit-624' : '/';
    window.history.pushState({}, '', sectionId ? `${targetUrl}#${sectionId}` : targetUrl);
    if (!sectionId) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 60);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-100 dark:bg-slate-950 dark:text-slate-100">
      <Navbar
        currentPage={currentPage}
        onNavigateHome={() => navigateTo('home')}
        onNavigateCourse={() => navigateTo('mit-624')}
      />
      <main>
        {currentPage === 'mit-624' ? (
          <Mit624Course onBackToHome={() => navigateTo('home')} />
        ) : (
          <Home onNavigateToCourse={() => navigateTo('mit-624')} />
        )}
      </main>
      <Footer onNavigateCourse={() => navigateTo('mit-624')} />
    </div>
  );
}
