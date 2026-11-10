import { BarChart2, Linkedin, Mail, Smartphone, GraduationCap, Github, BookOpen, Code2, Award, FileText } from 'lucide-react';
import { profile } from '../data';

interface FooterProps {
  onNavigateCourse?: () => void;
}

export default function Footer({ onNavigateCourse }: FooterProps) {
  return (
    <footer className="border-t border-slate-200 bg-white pt-16 pb-8 dark:border-slate-800 dark:bg-slate-950">
      <div className="container px-6 mx-auto">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm shadow-blue-500/20">
                <BarChart2 className="h-5 w-5" />
              </div>
              <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                Sunday<span className="text-blue-600">.</span>Data
              </span>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              Transforming raw organizational data into actionable strategic insights & building full-stack software management systems across FMCG, Banking, Healthcare, and Education.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400">
              <GraduationCap className="h-4 w-4" />
              <span>MIT 624 Academic Course Portfolio Integrated</span>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Navigation
            </h4>
            <ul className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li><a href="#home" className="hover:text-blue-600 dark:hover:text-white transition">Home</a></li>
              <li><a href="#about" className="hover:text-blue-600 dark:hover:text-white transition">About Me</a></li>
              <li><a href="#skills" className="hover:text-blue-600 dark:hover:text-white transition">Skills & Tools</a></li>
              <li><a href="#projects" className="hover:text-blue-600 dark:hover:text-white transition">Data Analytics</a></li>
              <li><a href="#software" className="hover:text-blue-600 dark:hover:text-white transition">Software Systems</a></li>
            </ul>
          </div>

          {/* Academic & Professional */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Academic & Career
            </h4>
            <ul className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <a 
                  href="/mit-624" 
                  onClick={(e) => {
                    if (onNavigateCourse) {
                      e.preventDefault();
                      onNavigateCourse();
                    }
                  }}
                  className="font-semibold text-blue-600 hover:underline dark:text-blue-400 inline-flex items-center gap-1.5"
                >
                  <GraduationCap className="h-3.5 w-3.5" />
                  MIT 624 Course
                </a>
              </li>
              <li><a href="#academic" className="hover:text-blue-600 dark:hover:text-white transition">Program Portfolio</a></li>
              <li><a href="#certifications" className="hover:text-blue-600 dark:hover:text-white transition">Certifications</a></li>
              <li><a href="#resume" className="hover:text-blue-600 dark:hover:text-white transition">Resume / CV</a></li>
              <li><a href="#contact" className="hover:text-blue-600 dark:hover:text-white transition">Contact / Hire Me</a></li>
            </ul>
          </div>
          
          {/* Connect & Socials */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Connect & Profiles
            </h4>
            <div className="mt-4 flex flex-wrap gap-2.5">
              <a 
                href={profile.github} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-900 hover:text-white transition dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-white dark:hover:text-slate-900"
                title="GitHub Profile"
              >
                <Github className="h-4 w-4" />
              </a>
              <a 
                href={profile.mediumProfile} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-700 hover:bg-blue-600 hover:text-white transition dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-blue-600"
                title="Medium Articles"
              >
                <BookOpen className="h-4 w-4" />
              </a>
              <a 
                href={profile.linkedin} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-700 hover:bg-blue-600 hover:text-white transition dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-blue-600"
                title="LinkedIn Profile"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a 
                href={`mailto:${profile.email}`} 
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-700 hover:bg-blue-600 hover:text-white transition dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-blue-600"
                title="Send Email"
              >
                <Mail className="h-4 w-4" />
              </a>
              <a 
                href={`https://wa.me/${profile.whatsapp.replace('+', '')}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-700 hover:bg-emerald-600 hover:text-white transition dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-emerald-600"
                title="WhatsApp Direct"
              >
                <Smartphone className="h-4 w-4" />
              </a>
            </div>
            <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
              Open to remote, contract, and full-time analytics & engineering engagements.
            </p>
          </div>
        </div>
        
        <div className="mt-16 border-t border-slate-100 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:border-slate-800">
          <p>© {new Date().getFullYear()} Sunday Okegbemi. All rights reserved.</p>
          <p>Data Analytics • Software Development • MIT 624 Academic Portfolio</p>
        </div>
      </div>
    </footer>
  );
}
