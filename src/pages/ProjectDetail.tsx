import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { ArrowLeft, Layers, Calendar, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProject() {
      // Fallback for static projects for demo if needed
      const staticProjectsList: any = {
        '1': {
          title: 'Sales Dashboard',
          typeOfWork: 'Business Analysis',
          tools: 'Excel, Power BI',
          problem: 'Lack of performance tracking of sales base on region and revenue. Incomplete sale report base on Product and revenue and missing data by category.',
          solution: 'Rebuild sale Data: Create a product master table containing product, category, salesperson’s, Region, Revenue, Quantity base on month and days. Data Cleaning: Fix formula errors, convert text values to numeric format, and remove special symbols such as currency signs. Build a Sales Dashboard: Use tools like Power BI or Excel dashboards to track key sales metrics.',
          recommendation: 'Improve Data Management System by adopting structured databases instead of manual spreadsheets.',
          imageUrl: 'https://images.unsplash.com/photo-1551288049-bbda38a5f850?auto=format&fit=crop&q=80&w=1200'
        },
        '2': {
          title: 'Sales & Profit Analysis',
          typeOfWork: 'Business Analysis',
          tools: 'Excel, Power BI',
          problem: 'Lack of Profit Tracking: The dataset does not clearly show profit or profit margin, which limits profitability analysis. Incomplete Product Information: Product categories or pricing details may be missing, making it difficult to analyze product performance.',
          solution: 'Rebuild Product Category Data: Create a product master table containing product ID, category, cost, and selling price. Data Cleaning: Fix formula errors, convert text values to numeric format, and remove special symbols such as currency signs. Build a Sales Dashboard: Use tools like Power BI or Excel dashboards to track key sales metrics.',
          recommendation: 'Improve Data Management System by adopting structured databases instead of manual spreadsheets.',
          imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200'
        },
        '3': {
          title: 'Sales & Profit Dashboard',
          typeOfWork: 'Business Analysis',
          tools: 'Excel',
          problem: 'Lack of sale tracking: The dataset does not clearly show sale tracking by category or top sale of the company per customer. Top state sale: To determine top sale by categories in a state and top customer.',
          solution: 'Rebuild sale Category Data: Create a sale master table containing customer name, state, category, sub category, product, sale, quantity, and price. Data Cleaning: Fix formula errors, convert text values to numeric format, and remove special symbols such as currency signs. Build a Sales & Profit Dashboard with category Use tools like Excel dashboards to track key sales metrics.',
          recommendation: 'Improve Data Management System by adopting a state supervisor monitoring daily report.',
          imageUrl: 'https://images.unsplash.com/photo-1543286386-713bdd548da4?auto=format&fit=crop&q=80&w=1200'
        },
        '4': {
          title: 'Automated feedback of a hospital',
          typeOfWork: 'Medical Analysis',
          tools: 'Excel, Python',
          problem: 'Lack of tracking performance of staff: there complain inefficient and performance of staff by the patient. Reduce in patient: Due to the problem the patient are reducing in daily base and effect the hospital growth.',
          solution: 'Building an automatic form for the hospital to get the feedback of complain from the patient both In-patient and Out-patient. Make the data goes across all the department in the hospital, include the doctors and nurse for proper analysis. Building a full hospital system for proper monitoring of all staff and patient booking.',
          recommendation: 'Improve the hospital System build an offline app for proper monitoring for the directors and for operation system.',
          imageUrl: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&q=80&w=1200'
        },
        '5': {
          title: 'Logistics Tracking of Delivery',
          typeOfWork: 'Logistics Analysis',
          tools: 'Excel, Python, Power BI',
          problem: 'Lack of tracking delivery of customer: inefficiency and performance of delivery staff. Problem with logistics operation data and provide actionable insights to improve efficiency and reduce operational costs.',
          solution: 'Conducted a comprehensive logistics data analysis focused on delivery optimization, fuel cost reduction, warehouse efficiency, and customer satisfaction improvement using Python, SQL, Power Bi, and Excel. Generated actionable insights that improved operational efficiency and reduced logistics costs. Implemented delivery tracking and notification system: to reduced customer complaints and Improved customer satisfaction.',
          recommendation: 'Introduce driver training programs on time management, Customer service and Created a driver KPI dashboard and delivery tracking and notification system.',
          imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=1200'
        },
        '6': {
          title: 'Monitoring the finance of E-Commerce',
          typeOfWork: 'Business Analysis',
          tools: 'Excel, Python, Power BI, SQL',
          problem: 'Improper account monitoring, cause lack of account balance for the company. Lack of customer database generate.',
          solution: 'Carryout a full financial analysis on all the department together with the audit team. Creating and automated Excel sheet for all the department for proper accountability. Creating stages of approver for all the department to monitor the finance.',
          recommendation: 'Develop an automated finance web app integrated with the company website for accountability and be monitor by the shareholder.',
          imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=1200'
        }
      };

      if (id && staticProjectsList[id]) {
        setProject(staticProjectsList[id]);
        setLoading(false);
        return;
      }

      const docRef = doc(db, 'projects', id!);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProject(docSnap.data());
      }
      setLoading(false);
    }
    fetchProject();
  }, [id]);

  if (loading) return <div className="h-screen flex items-center justify-center">Loading project details...</div>;
  if (!project) return <div className="h-screen flex flex-col items-center justify-center gap-4">
    <p>Project not found.</p>
    <Link to="/" className="text-blue-600">Back to home</Link>
  </div>;

  return (
    <div className="pt-32 pb-24">
      <div className="container px-6 mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Portfolio
        </Link>
        
        <div className="grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl dark:text-white">
                {project.title}
              </h1>
              <div className="mt-4 flex flex-wrap gap-4 text-slate-500 dark:text-slate-400">
                 <div className="flex items-center gap-2">
                   <Layers className="h-5 w-5 text-blue-600" />
                   <span className="font-semibold text-slate-900 dark:text-white">{project.typeOfWork}</span>
                 </div>
                 <div className="flex items-center gap-2 border-l border-slate-200 pl-4 dark:border-slate-800">
                    <span className="text-sm">Tools: {project.tools}</span>
                 </div>
              </div>
              
              <div className="mt-10 overflow-hidden rounded-3xl shadow-2xl">
                 <img src={project.imageUrl || 'https://images.unsplash.com/photo-1551288049-bbda38a5f850?auto=format&fit=crop&q=80&w=1200'} alt={project.title} className="w-full object-cover" />
              </div>
              
              <div className="mt-12 space-y-12">
                 <section>
                    <h2 className="text-2xl font-bold dark:text-white flex items-center gap-2">
                       <ChevronRight className="h-6 w-6 text-blue-600" /> The Problem
                    </h2>
                    <p className="mt-4 text-lg leading-relaxed text-slate-600 dark:text-slate-400">
                       {project.problem}
                    </p>
                 </section>
                 <section>
                    <h2 className="text-2xl font-bold dark:text-white flex items-center gap-2">
                       <ChevronRight className="h-6 w-6 text-blue-600" /> The Solution
                    </h2>
                    <p className="mt-4 text-lg leading-relaxed text-slate-600 dark:text-slate-400 whitespace-pre-line">
                       {project.solution}
                    </p>
                 </section>
                 {project.recommendation && (
                   <section className="rounded-2xl bg-blue-50 p-8 dark:bg-blue-900/10 dark:border dark:border-blue-500/20">
                      <h2 className="text-xl font-bold text-blue-900 dark:text-blue-300">Key Recommendation</h2>
                      <p className="mt-3 text-blue-800 dark:text-blue-400 italic">
                         "{project.recommendation}"
                      </p>
                   </section>
                 )}
              </div>
            </motion.div>
          </div>
          
          <div className="space-y-8">
             <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:bg-slate-900 dark:border-slate-800">
                <h3 className="font-bold dark:text-white mb-4">Project Highlights</h3>
                <ul className="space-y-4">
                   <li className="flex gap-3 text-sm">
                      <div className="h-5 w-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 dark:bg-blue-900/30">✓</div>
                      <span className="text-slate-600 dark:text-slate-400">Data cleaning & transformation</span>
                   </li>
                   <li className="flex gap-3 text-sm">
                      <div className="h-5 w-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 dark:bg-blue-900/30">✓</div>
                      <span className="text-slate-600 dark:text-slate-400">Advanced diagnostic analytics</span>
                   </li>
                   <li className="flex gap-3 text-sm">
                      <div className="h-5 w-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 dark:bg-blue-900/30">✓</div>
                      <span className="text-slate-600 dark:text-slate-400">Stakeholder reporting</span>
                   </li>
                </ul>
             </div>
             
             <div className="rounded-2xl bg-slate-900 p-8 text-white">
                <h3 className="text-xl font-bold mb-4">Ready to discuss a project?</h3>
                <p className="text-slate-400 mb-6">Let's connect and see how I can help with your data needs.</p>
                <Link to="/#contact" className="inline-flex w-full items-center justify-center rounded-xl bg-blue-600 py-3 font-bold hover:bg-blue-700">
                   Get in touch
                </Link>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
