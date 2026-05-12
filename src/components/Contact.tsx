import { motion } from 'motion/react';
import { Mail, Phone, MessageSquare, Linkedin, ExternalLink } from 'lucide-react';

export default function Contact() {
  return (
    <section id="contact" className="container px-6 mx-auto scroll-mt-20">
      <div className="rounded-3xl bg-blue-600 p-8 md:p-16 text-white shadow-2xl shadow-blue-500/20 overflow-hidden relative">
        {/* Abstract background */}
        <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-blue-400/20 blur-3xl" />
        
        <div className="relative z-10 grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-4xl font-bold tracking-tight">Interested in working with me? Let's talk!</h2>
            <p className="mt-6 text-xl text-blue-100 leading-relaxed">
              I'm available for remote, freelance work, or part-time roles. Let's discuss how my 
              data analysis expertise can bring value to your project.
            </p>
            
            <div className="mt-10 space-y-6">
               <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 backdrop-blur">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-200">Email Me</p>
                    <p className="text-lg font-semibold">sundayolakunleok@gmail.com</p>
                  </div>
               </div>
               
               <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 backdrop-blur">
                    <MessageSquare className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-200">WhatsApp</p>
                    <p className="text-lg font-semibold">+2347035672890</p>
                  </div>
               </div>

               <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 backdrop-blur">
                    <Linkedin className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-200">LinkedIn</p>
                    <a 
                      href="https://www.linkedin.com/in/okegbemi-sunday-578b0975" 
                      target="_blank" 
                      className="text-lg font-semibold decoration-white underline-offset-4 hover:underline inline-flex items-center gap-1"
                    >
                      Connect with me <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
               </div>
            </div>
          </div>
          
          <div className="rounded-2xl bg-white/10 p-8 backdrop-blur-md ring-1 ring-white/20">
            <h3 className="text-2xl font-bold mb-6">Send a Message</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-blue-100 mb-1">Your Name</label>
                <input type="text" className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-100 mb-1">Email Address</label>
                <input type="email" className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50" placeholder="john@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-100 mb-1">Message</label>
                <textarea rows={4} className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50" placeholder="Your project details..." />
              </div>
              <button disabled className="w-full rounded-xl bg-white px-8 py-4 text-lg font-bold text-blue-600 transition-all hover:bg-blue-50">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
