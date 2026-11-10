import { useState, type FormEvent } from 'react';
import { Mail, MessageSquare, Linkedin, ExternalLink, CheckCircle } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const mailtoUrl = `mailto:sundayolakunleok@gmail.com?subject=${encodeURIComponent(
      `Project Inquiry from ${formData.name || 'Portfolio Visitor'}`
    )}&body=${encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
    )}`;
    window.location.href = mailtoUrl;
    setSent(true);
  };

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
                    <a href="mailto:sundayolakunleok@gmail.com" className="text-lg font-semibold hover:underline">sundayolakunleok@gmail.com</a>
                  </div>
               </div>
               
               <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 backdrop-blur">
                    <MessageSquare className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-200">WhatsApp</p>
                    <a href="https://wa.me/2347035672890" target="_blank" rel="noopener noreferrer" className="text-lg font-semibold hover:underline">+2347035672890</a>
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
                      rel="noopener noreferrer"
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
            {sent ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <CheckCircle className="h-16 w-16 text-emerald-300 mb-4 animate-bounce" />
                <h4 className="text-xl font-bold">Email Client Opened!</h4>
                <p className="mt-2 text-blue-100 max-w-sm">
                  Your default email client has been opened with your message. You can also reach me directly at sundayolakunleok@gmail.com or via WhatsApp.
                </p>
                <button
                  onClick={() => setSent(false)}
                  className="mt-6 rounded-xl bg-white px-6 py-2 text-sm font-bold text-blue-600 transition hover:bg-blue-50"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-blue-100 mb-1">Your Name</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50" 
                    placeholder="John Doe" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-100 mb-1">Email Address</label>
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50" 
                    placeholder="john@example.com" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-100 mb-1">Message</label>
                  <textarea 
                    rows={4} 
                    required
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50" 
                    placeholder="Your project details or inquiry..." 
                  />
                </div>
                <button 
                  type="submit" 
                  className="w-full cursor-pointer rounded-xl bg-white px-8 py-4 text-lg font-bold text-blue-600 transition-all hover:bg-blue-50 shadow-md active:scale-95"
                >
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
