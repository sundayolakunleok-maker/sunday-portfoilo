/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import Home from './pages/Home';
import Mit624Course from './pages/Mit624Course';
import Login from './pages/Login';
import Admin from './pages/Admin';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { isAdminAuthenticated } from './lib/adminAuth';

export default function App() {
  const getInitialPage = (): 'home' | 'mit-624' | 'login' | 'admin' => {
    if (typeof window === 'undefined') return 'home';
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    if (path.includes('admin') || hash.includes('admin')) {
      return isAdminAuthenticated() ? 'admin' : 'login';
    }
    if (path.includes('login') || hash.includes('login')) {
      return 'login';
    }
    if (path.includes('mit-624') || hash.includes('mit-624')) {
      return 'mit-624';
    }
    return 'home';
  };

  const [currentPage, setCurrentPage] = useState<'home' | 'mit-624' | 'login' | 'admin'>(getInitialPage);

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path.includes('admin') || hash.includes('admin')) {
        setCurrentPage(isAdminAuthenticated() ? 'admin' : 'login');
      } else if (path.includes('login') || hash.includes('login')) {
        setCurrentPage('login');
      } else if (path.includes('mit-624') || hash.includes('mit-624')) {
        setCurrentPage('mit-624');
      } else {
        setCurrentPage('home');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (page: 'home' | 'mit-624' | 'login' | 'admin', sectionId?: string) => {
    setCurrentPage(page);
    let targetUrl = '/';
    if (page === 'mit-624') targetUrl = '/mit-624';
    else if (page === 'login') targetUrl = '/login';
    else if (page === 'admin') targetUrl = '/admin';

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

  // If in Admin Dashboard view, render full-screen admin control center
  if (currentPage === 'admin') {
    if (!isAdminAuthenticated()) {
      return (
        <Login
          onLoginSuccess={() => navigateTo('admin')}
          onBackToHome={() => navigateTo('home')}
        />
      );
    }
    return (
      <Admin
        onLogout={() => navigateTo('home')}
        onNavigateHome={() => navigateTo('home')}
        onNavigateCourse={() => navigateTo('mit-624')}
      />
    );
  }

  // If in Login view, render secure admin login portal
  if (currentPage === 'login') {
    return (
      <Login
        onLoginSuccess={() => navigateTo('admin')}
        onBackToHome={() => navigateTo('home')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-100 dark:bg-slate-950 dark:text-slate-100">
      <Navbar
        currentPage={currentPage}
        onNavigateHome={() => navigateTo('home')}
        onNavigateCourse={() => navigateTo('mit-624')}
        onNavigateAdmin={() => navigateTo('login')}
      />
      <main>
        {currentPage === 'mit-624' ? (
          <Mit624Course onBackToHome={() => navigateTo('home')} />
        ) : (
          <Home onNavigateToCourse={() => navigateTo('mit-624')} />
        )}
      </main>
      <Footer 
        onNavigateCourse={() => navigateTo('mit-624')} 
        onNavigateAdmin={() => navigateTo('login')}
      />
    </div>
  );
}
