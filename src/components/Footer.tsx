import { BarChart2, Linkedin, Mail, Smartphone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white pt-16 pb-8 dark:border-slate-800 dark:bg-slate-950">
      <div className="container px-6 mx-auto">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
                <BarChart2 className="h-5 w-5" />
              </div>
              <span className="text-lg font-bold tracking-tight dark:text-white">Sunday Okegbemi</span>
            </div>
            <p className="mt-4 max-w-sm text-slate-500 dark:text-slate-400">
              Turning raw data into clear insights. Professional data analyst helping businesses GROW through 
              data-driven strategy.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold dark:text-white">Quick Links</h4>
            <ul className="mt-4 space-y-2 text-slate-500 dark:text-slate-400">
               <li><a href="#home" className="hover:text-blue-600">Home</a></li>
               <li><a href="#about" className="hover:text-blue-600">About</a></li>
               <li><a href="#projects" className="hover:text-blue-600">Projects</a></li>
               <li><a href="#contact" className="hover:text-blue-600">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold dark:text-white">Socials</h4>
            <div className="mt-4 flex gap-4">
              <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-blue-600 hover:text-white dark:bg-slate-900">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="mailto:sundayolakunleok@gmail.com" className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-blue-600 hover:text-white dark:bg-slate-900">
                <Mail className="h-5 w-5" />
              </a>
              <a href="https://wa.me/2347035672890" className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-green-600 hover:text-white dark:bg-slate-900">
                <Smartphone className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-16 border-t border-slate-100 pt-8 text-center text-sm text-slate-500 dark:border-slate-800">
          <p>© {new Date().getFullYear()} Sunday Okegbemi. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
