import { useState, useEffect, useRef } from 'react';
import { 
  Menu, 
  X, 
  BarChart2, 
  ChevronDown, 
  GraduationCap, 
  Code2, 
  Building2, 
  Activity, 
  Award, 
  FileText, 
  Mail, 
  ArrowUpRight,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  Youtube
} from 'lucide-react';
import { cn } from '../lib/utils';
import ThemeToggle from './ThemeToggle';
import { profile } from '../data';

interface NavbarProps {
  currentPage?: 'home' | 'mit-624' | 'login' | 'admin';
  onNavigateHome?: () => void;
  onNavigateCourse?: () => void;
  onNavigateAdmin?: () => void;
}

export default function Navbar({
  currentPage = 'home',
  onNavigateHome,
  onNavigateCourse,
  onNavigateAdmin
}: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Dropdown states for Desktop
  const [analyticsDropdownOpen, setAnalyticsDropdownOpen] = useState(false);
  const [softwareDropdownOpen, setSoftwareDropdownOpen] = useState(false);

  // Mobile Accordion states
  const [mobileAnalyticsOpen, setMobileAnalyticsOpen] = useState(false);
  const [mobileSoftwareOpen, setMobileSoftwareOpen] = useState(false);

  const analyticsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const softwareTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (href: string) => {
    setIsMobileMenuOpen(false);
    setAnalyticsDropdownOpen(false);
    setSoftwareDropdownOpen(false);

    if (currentPage === 'mit-624') {
      if (onNavigateHome) onNavigateHome();
      setTimeout(() => {
        const id = href.replace('#', '');
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 120);
    } else {
      const id = href.replace('#', '');
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const analyticsSubLinks = [
    { title: "Sales Dashboard", desc: "Farme Structure Limited revenue tracking", href: "#sales-dashboard" },
    { title: "Sales & Profit Analysis", desc: "Heinz commercial margin audit", href: "#sales-profit-analysis" },
    { title: "Category Performance", desc: "B2B funnel & conversion pipeline", href: "#category-performance" },
    { title: "Hospital Feedback Automation", desc: "Patient satisfaction automation", href: "#hospital-feedback-automation" },
    { title: "Logistics Tracking System", desc: "Route & fleet delivery optimization", href: "#logistics-tracking" },
  ];

  const softwareSubLinks = [
    { title: "Business Applications", desc: "Mfg ERP & E-Commerce monitoring", href: "#software", icon: Building2 },
    { title: "School Management Systems", desc: "Adunola College offline portal", href: "#software", icon: GraduationCap },
    { title: "Healthcare Applications", desc: "Hospital clinical operations ERP", href: "#software", icon: Activity },
    { title: "All Software Systems", desc: "View full software showcase", href: "#software", icon: Code2 },
  ];

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      isScrolled ? "bg-white/90 backdrop-blur-md shadow-sm dark:bg-slate-950/90 py-3 border-b border-slate-200/60 dark:border-slate-800/60" : "bg-white/40 dark:bg-slate-950/40 backdrop-blur-xs py-4"
    )}>
      {/* Top Banner Accent */}
      <div className="container px-6 mx-auto flex items-center justify-between">
        
        {/* Brand Logo */}
        <a 
          href="/" 
          onClick={(e) => {
            if (onNavigateHome) {
              e.preventDefault();
              onNavigateHome();
            }
          }}
          className="flex items-center gap-2.5 group cursor-pointer"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white transition-all group-hover:scale-105 shadow-md shadow-blue-500/20">
            <BarChart2 className="h-5 w-5" />
          </div>
          <div>
            <div className="text-lg font-black tracking-tight text-slate-900 dark:text-white leading-none">
              Sunday<span className="text-blue-600 font-black">.</span>Data
            </div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Analytics & Software
            </div>
          </div>
        </a>

        {/* Desktop Navigation Menu (Inspired by aglobalcampus.online layout) */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {/* Home */}
          <a
            href="#home"
            onClick={() => handleLinkClick('#home')}
            className="rounded-lg px-3 py-2 text-xs font-bold text-slate-700 hover:text-blue-600 dark:text-slate-300 dark:hover:text-white transition"
          >
            Home
          </a>

          {/* About Me */}
          <a
            href="#about"
            onClick={() => handleLinkClick('#about')}
            className="rounded-lg px-3 py-2 text-xs font-bold text-slate-700 hover:text-blue-600 dark:text-slate-300 dark:hover:text-white transition"
          >
            About Me
          </a>

          {/* Skills */}
          <a
            href="#skills"
            onClick={() => handleLinkClick('#skills')}
            className="rounded-lg px-3 py-2 text-xs font-bold text-slate-700 hover:text-blue-600 dark:text-slate-300 dark:hover:text-white transition"
          >
            Skills
          </a>

          {/* Data Analytics Dropdown */}
          <div 
            className="relative"
            onMouseEnter={() => {
              if (analyticsTimeoutRef.current) clearTimeout(analyticsTimeoutRef.current);
              setAnalyticsDropdownOpen(true);
            }}
            onMouseLeave={() => {
              analyticsTimeoutRef.current = setTimeout(() => setAnalyticsDropdownOpen(false), 200);
            }}
          >
            <button
              onClick={() => handleLinkClick('#projects')}
              className={cn(
                "flex items-center gap-1 rounded-lg px-3 py-2 text-xs font-bold transition cursor-pointer",
                analyticsDropdownOpen 
                  ? "text-blue-600 bg-blue-50 dark:bg-slate-800 dark:text-blue-400" 
                  : "text-slate-700 hover:text-blue-600 dark:text-slate-300 dark:hover:text-white"
              )}
            >
              <span>Data Analytics</span>
              <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", analyticsDropdownOpen ? "rotate-180" : "")} />
            </button>

            {/* Dropdown Menu */}
            {analyticsDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-72 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-800 dark:bg-slate-900 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-800 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Verified Case Studies
                </div>
                {analyticsSubLinks.map((item, i) => (
                  <a
                    key={i}
                    href={item.href}
                    onClick={() => handleLinkClick(item.href)}
                    className="group block rounded-xl p-2.5 transition hover:bg-slate-50 dark:hover:bg-slate-800/80"
                  >
                    <div className="text-xs font-bold text-slate-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                      {item.title}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                      {item.desc}
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Software Development Dropdown */}
          <div 
            className="relative"
            onMouseEnter={() => {
              if (softwareTimeoutRef.current) clearTimeout(softwareTimeoutRef.current);
              setSoftwareDropdownOpen(true);
            }}
            onMouseLeave={() => {
              softwareTimeoutRef.current = setTimeout(() => setSoftwareDropdownOpen(false), 200);
            }}
          >
            <button
              onClick={() => handleLinkClick('#software')}
              className={cn(
                "flex items-center gap-1 rounded-lg px-3 py-2 text-xs font-bold transition cursor-pointer",
                softwareDropdownOpen 
                  ? "text-indigo-600 bg-indigo-50 dark:bg-slate-800 dark:text-indigo-400" 
                  : "text-slate-700 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-white"
              )}
            >
              <span>Software Development</span>
              <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", softwareDropdownOpen ? "rotate-180" : "")} />
            </button>

            {/* Dropdown Menu */}
            {softwareDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-80 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-800 dark:bg-slate-900 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-800 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Applications & Systems
                </div>
                {softwareSubLinks.map((item, i) => (
                  <a
                    key={i}
                    href={item.href}
                    onClick={() => handleLinkClick(item.href)}
                    className="group flex items-start gap-3 rounded-xl p-2.5 transition hover:bg-slate-50 dark:hover:bg-slate-800/80"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition">
                      <item.icon className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
                        {item.title}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                        {item.desc}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Academic Portfolio / MIT 624 */}
          <a
            href="/mit-624"
            onClick={(e) => {
              if (onNavigateCourse) {
                e.preventDefault();
                onNavigateCourse();
              }
            }}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold transition",
              currentPage === 'mit-624'
                ? "bg-blue-600 text-white"
                : "text-blue-700 bg-blue-50/80 hover:bg-blue-600 hover:text-white dark:bg-blue-950/40 dark:text-blue-300 dark:hover:bg-blue-600 dark:hover:text-white"
            )}
          >
            <GraduationCap className="h-3.5 w-3.5" />
            <span>MIT 624</span>
          </a>

          {/* Certifications */}
          <a
            href="#certifications"
            onClick={() => handleLinkClick('#certifications')}
            className="rounded-lg px-3 py-2 text-xs font-bold text-slate-700 hover:text-blue-600 dark:text-slate-300 dark:hover:text-white transition"
          >
            Certifications
          </a>

          {/* Resume */}
          <a
            href="#resume"
            onClick={() => handleLinkClick('#resume')}
            className="rounded-lg px-3 py-2 text-xs font-bold text-slate-700 hover:text-blue-600 dark:text-slate-300 dark:hover:text-white transition"
          >
            Resume
          </a>
        </nav>

        {/* Right CTA Actions (Inspired by reference site) */}
        <div className="hidden lg:flex items-center gap-2.5">
          <ThemeToggle />

          {/* YouTube Channel Link */}
          <a
            href="https://www.youtube.com/@OLAKUNLEokegbemi"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-700 hover:text-red-600 hover:bg-red-50 dark:bg-slate-900 dark:text-slate-300 dark:hover:text-red-400 dark:hover:bg-slate-800 transition"
            title="Official YouTube: Olakunle Data"
          >
            <Youtube className="h-4 w-4" />
          </a>

          {/* Admin Portal Button */}
          <a
            href="/login"
            onClick={(e) => {
              if (onNavigateAdmin) {
                e.preventDefault();
                onNavigateAdmin();
              }
            }}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:text-blue-600 hover:border-blue-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:text-white transition cursor-pointer"
            title="Admin Control Centre"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />
            <span>Admin</span>
          </a>
          
          <a
            href="#contact"
            onClick={() => handleLinkClick('#contact')}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition active:scale-95 cursor-pointer"
          >
            <Mail className="h-3.5 w-3.5" />
            <span>Contact Me</span>
          </a>
        </div>

        {/* Mobile Hamburger & Actions */}
        <div className="flex items-center gap-2.5 lg:hidden">
          <ThemeToggle />
          <button 
            className="rounded-xl border border-slate-200 bg-white p-2 text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer (Accordion Style) */}
      {isMobileMenuOpen && (
        <div className="lg:hidden max-h-[85vh] overflow-y-auto bg-white/98 backdrop-blur-xl border-b border-slate-200 px-6 py-6 shadow-2xl dark:bg-slate-950/98 dark:border-slate-800 space-y-4">
          {/* Quick Academic Badge */}
          <a
            href="/mit-624"
            onClick={(e) => {
              setIsMobileMenuOpen(false);
              if (onNavigateCourse) {
                e.preventDefault();
                onNavigateCourse();
              }
            }}
            className="flex items-center justify-between rounded-2xl bg-blue-50 p-4 font-bold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300"
          >
            <div className="flex items-center gap-3">
              <GraduationCap className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-bold">MIT 624 Academic Course</p>
                <p className="text-xs font-normal text-slate-500 dark:text-slate-400">AI-Powered Software Development</p>
              </div>
            </div>
            <ArrowUpRight className="h-4 w-4" />
          </a>

          {/* Standard Nav Links */}
          <div className="space-y-1 pt-2">
            <a
              href="#home"
              onClick={() => handleLinkClick('#home')}
              className="block rounded-xl px-3 py-2 text-sm font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Home
            </a>

            <a
              href="#about"
              onClick={() => handleLinkClick('#about')}
              className="block rounded-xl px-3 py-2 text-sm font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              About Me
            </a>

            <a
              href="#skills"
              onClick={() => handleLinkClick('#skills')}
              className="block rounded-xl px-3 py-2 text-sm font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Skills & Tools
            </a>

            {/* Mobile Data Analytics Accordion */}
            <div className="border-t border-slate-100 dark:border-slate-800 pt-2">
              <button
                onClick={() => setMobileAnalyticsOpen(!mobileAnalyticsOpen)}
                className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <span>Data Analytics Projects</span>
                <ChevronDown className={cn("h-4 w-4 transition-transform", mobileAnalyticsOpen ? "rotate-180" : "")} />
              </button>
              {mobileAnalyticsOpen && (
                <div className="ml-3 space-y-1 pt-1 pb-2 border-l-2 border-blue-500 pl-3">
                  {analyticsSubLinks.map((item, i) => (
                    <a
                      key={i}
                      href={item.href}
                      onClick={() => handleLinkClick(item.href)}
                      className="block py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-white"
                    >
                      {item.title}
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Software Development Accordion */}
            <div className="border-t border-slate-100 dark:border-slate-800 pt-2">
              <button
                onClick={() => setMobileSoftwareOpen(!mobileSoftwareOpen)}
                className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <span>Software Development</span>
                <ChevronDown className={cn("h-4 w-4 transition-transform", mobileSoftwareOpen ? "rotate-180" : "")} />
              </button>
              {mobileSoftwareOpen && (
                <div className="ml-3 space-y-1 pt-1 pb-2 border-l-2 border-indigo-500 pl-3">
                  {softwareSubLinks.map((item, i) => (
                    <a
                      key={i}
                      href={item.href}
                      onClick={() => handleLinkClick(item.href)}
                      className="block py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white"
                    >
                      {item.title}
                    </a>
                  ))}
                </div>
              )}
            </div>

            <a
              href="#certifications"
              onClick={() => handleLinkClick('#certifications')}
              className="block rounded-xl px-3 py-2 text-sm font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Certifications
            </a>

            <a
              href="#resume"
              onClick={() => handleLinkClick('#resume')}
              className="block rounded-xl px-3 py-2 text-sm font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Resume / CV
            </a>

            <a
              href="#youtube"
              onClick={() => handleLinkClick('#youtube')}
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
            >
              <Youtube className="h-4 w-4" />
              YouTube: Olakunle Data
            </a>

            <a
              href="/login"
              onClick={(e) => {
                setIsMobileMenuOpen(false);
                if (onNavigateAdmin) {
                  e.preventDefault();
                  onNavigateAdmin();
                }
              }}
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800"
            >
              <ShieldCheck className="h-4 w-4" />
              Admin Control Centre
            </a>

            <a
              href="#contact"
              onClick={() => handleLinkClick('#contact')}
              className="block rounded-xl px-3 py-2 text-sm font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800"
            >
              Contact Me / Hire Me
            </a>
          </div>

          {currentPage === 'mit-624' && (
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  if (onNavigateHome) onNavigateHome();
                }}
                className="flex items-center gap-2 text-sm font-bold text-blue-600 dark:text-blue-400"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Main Portfolio
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
