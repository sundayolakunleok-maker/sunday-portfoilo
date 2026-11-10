import { useState, type FormEvent } from 'react';
import { 
  Mail, 
  MessageSquare, 
  Linkedin, 
  Youtube, 
  ExternalLink, 
  CheckCircle2, 
  Send, 
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function Contact() {
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    subject: '', 
    message: '',
    honeypot: '' // Anti-spam trap field
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    // Spam honeypot detection
    if (formData.honeypot) {
      console.warn('Bot submission blocked.');
      setSent(true);
      return;
    }

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setError('Please complete all required fields.');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Save to Firestore messages collection for Admin Dashboard
      await addDoc(collection(db, 'messages'), {
        name: formData.name.trim(),
        email: formData.email.trim(),
        subject: formData.subject.trim() || 'General Portfolio Inquiry',
        message: formData.message.trim(),
        status: 'unread',
        createdAt: serverTimestamp()
      });

      // 2. Clear state and show confirmation
      setSent(true);
      setFormData({ name: '', email: '', subject: '', message: '', honeypot: '' });
    } catch (err: any) {
      console.warn('Could not save to Firestore directly, opening email fallback:', err);
      // Fallback: mailto link
      const mailtoUrl = `mailto:sundayolakunleok@gmail.com?subject=${encodeURIComponent(
        formData.subject || `Inquiry from ${formData.name}`
      )}&body=${encodeURIComponent(
        `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
      )}`;
      window.location.href = mailtoUrl;
      setSent(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="container px-6 mx-auto scroll-mt-24">
      <div className="rounded-3xl bg-blue-600 p-8 md:p-16 text-white shadow-2xl shadow-blue-500/20 overflow-hidden relative">
        {/* Abstract background lighting */}
        <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-blue-400/20 blur-3xl pointer-events-none" />
        
        <div className="relative z-10 grid gap-12 lg:grid-cols-2 items-start">
          
          {/* Left Column: Direct Contact Info */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
              <Mail className="h-4 w-4" /> Direct Communication
            </div>
            
            <h2 className="mt-4 text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
              Let's Discuss Your Data & Software Engineering Needs
            </h2>
            <p className="mt-4 text-lg text-blue-100 leading-relaxed">
              Available for full-time roles, contract consulting, business intelligence dashboarding, enterprise ERP architecture, and academic collaborations.
            </p>
            
            <div className="mt-8 space-y-4">
              
              {/* Email */}
              <div className="flex items-center gap-4 p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 backdrop-blur shrink-0">
                  <Mail className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-xs font-medium text-blue-200 uppercase tracking-wider">Official Email</p>
                  <a href="mailto:sundayolakunleok@gmail.com" className="text-base font-bold text-white hover:underline">
                    sundayolakunleok@gmail.com
                  </a>
                </div>
              </div>
              
              {/* WhatsApp */}
              <div className="flex items-center gap-4 p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 backdrop-blur shrink-0">
                  <MessageSquare className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-blue-200 uppercase tracking-wider">WhatsApp Direct Message</p>
                  <a 
                    href="https://wa.me/2347035672890" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-base font-bold text-white hover:underline flex items-center gap-2"
                  >
                    +234 703 567 2890
                    <span className="rounded-full bg-emerald-500/80 px-2 py-0.5 text-[10px] font-bold text-white">Online</span>
                  </a>
                </div>
              </div>

              {/* LinkedIn */}
              <div className="flex items-center gap-4 p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 backdrop-blur shrink-0">
                  <Linkedin className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-xs font-medium text-blue-200 uppercase tracking-wider">LinkedIn Network</p>
                  <a 
                    href="https://www.linkedin.com/in/okegbemi-sunday-578b0975" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-base font-bold text-white hover:underline inline-flex items-center gap-1.5"
                  >
                    Connect on LinkedIn <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>

              {/* YouTube */}
              <div className="flex items-center gap-4 p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 backdrop-blur shrink-0">
                  <Youtube className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-xs font-medium text-blue-200 uppercase tracking-wider">Official YouTube Channel</p>
                  <a 
                    href="https://www.youtube.com/@OLAKUNLEokegbemi" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-base font-bold text-white hover:underline inline-flex items-center gap-1.5"
                  >
                    Olakunle Data <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>

            </div>

            {/* Direct WhatsApp Call to Action Button */}
            <div className="mt-8">
              <a
                href="https://wa.me/2347035672890?text=Hello%20Sunday,%20I%20reviewed%20your%20portfolio%20and%20would%20like%20to%20discuss%20a%20project."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-6 py-3.5 text-sm font-extrabold text-white shadow-xl hover:bg-emerald-600 transition-all hover:scale-105"
              >
                <MessageSquare className="h-5 w-5 fill-white" />
                Chat Directly on WhatsApp
              </a>
            </div>
          </div>
          
          {/* Right Column: Interactive Contact Form */}
          <div className="rounded-3xl bg-white/10 p-8 backdrop-blur-md ring-1 ring-white/20 shadow-xl">
            <h3 className="text-2xl font-bold mb-2">Send an Instant Message</h3>
            <p className="text-xs text-blue-100 mb-6">
              Messages are routed securely into Sunday's central administrative inbox.
            </p>

            {error && (
              <div className="mb-4 flex items-center gap-2 rounded-xl bg-red-500/20 border border-red-300 p-3 text-xs text-white">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {sent ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-400 text-blue-900 mb-4 shadow-lg">
                  <CheckCircle2 className="h-10 w-10" />
                </div>
                <h4 className="text-2xl font-black">Message Sent Successfully!</h4>
                <p className="mt-2 text-blue-100 max-w-sm text-sm leading-relaxed">
                  Thank you! Your inquiry has been securely logged in Sunday Okegbemi's central administrative inbox. You will receive a response shortly.
                </p>
                <button
                  onClick={() => setSent(false)}
                  className="mt-6 rounded-xl bg-white px-6 py-2.5 text-xs font-bold text-blue-600 transition hover:bg-blue-50 cursor-pointer"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Honeypot hidden input for anti-spam */}
                <input
                  type="text"
                  name="_gotcha"
                  value={formData.honeypot}
                  onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                  style={{ display: 'none' }}
                  tabIndex={-1}
                  autoComplete="off"
                />

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-blue-100 mb-1">
                      Your Name *
                    </label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-2.5 text-sm text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50" 
                      placeholder="e.g. Dr. Alex Morgan" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-blue-100 mb-1">
                      Email Address *
                    </label>
                    <input 
                      type="email" 
                      required
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-2.5 text-sm text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50" 
                      placeholder="alex@organization.com" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-blue-100 mb-1">
                    Subject / Topic
                  </label>
                  <input 
                    type="text" 
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                    className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-2.5 text-sm text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50" 
                    placeholder="e.g. Data Analytics Project Inquiry / MIT 624 Discussion" 
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-blue-100 mb-1">
                    Message Details *
                  </label>
                  <textarea 
                    rows={4} 
                    required
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-2.5 text-sm text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50" 
                    placeholder="Describe your project, timelines, or questions..."
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3.5 text-sm font-bold text-blue-600 transition-all hover:bg-blue-50 shadow-lg cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin text-blue-600" />
                      Submitting Message...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 text-blue-600" />
                      Send Secure Message
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
