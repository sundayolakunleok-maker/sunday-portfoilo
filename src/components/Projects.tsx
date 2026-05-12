import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ExternalLink, Layers, Search, Info } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';

interface Project {
  id: string;
  title: string;
  typeOfWork: string;
  tools: string;
  problem: string;
  solution: string;
  imageUrl: string;
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // Static initial projects if DB is empty
  const staticProjects = [
    {
      id: '1',
      title: 'Sales Dashboard',
      typeOfWork: 'Business Analysis',
      tools: 'Excel, Power BI',
      problem: 'Lack of tracking salesperson performance based on region and revenue. Incomplete sale reports and missing category data.',
      solution: 'Rebuilt sale data master tables, performed data cleaning (removing symbols, fixing formats), and developed an interactive dashboard to track key metrics.',
      imageUrl: 'https://images.unsplash.com/photo-1551288049-bbda38a5f850?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: '2',
      title: 'Sales & Profit Analysis',
      typeOfWork: 'Business Analysis',
      tools: 'Excel, Power BI',
      problem: 'Lack of profit tracking and incomplete product info, making it difficult to analyze margins and performance.',
      solution: 'Created a product master table with cost and price, cleaned numeric formats, and built a dedicated Sales and Profit dashboard.',
      imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: '3',
      title: 'Sales & Profit Dashboard',
      typeOfWork: 'Business Analysis',
      tools: 'Excel',
      problem: 'Lack of sale tracking by category and customer. Difficulty in determining top states and customer contributions.',
      solution: 'Built a sale master table including customer and state data, and created an Excel-based Sales & Profit category dashboard.',
      imageUrl: 'https://images.unsplash.com/photo-1543286386-713bdd548da4?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: '4',
      title: 'Hospital Feedback Automation',
      typeOfWork: 'Medical Analysis',
      tools: 'Excel, Python',
      problem: 'Inefficient tracking of staff performance and patient complaints leading to declining patient volume.',
      solution: 'Built an automated feedback form for In-patients and Out-patients, synchronized across hospital departments for proper analysis.',
      imageUrl: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&q=80&w=800'
    },
    {
       id: '5',
       title: 'Logistics Tracking System',
       typeOfWork: 'Logistics Analysis',
       tools: 'Excel, Python, Power BI',
       problem: 'Inefficiency in delivery staff performance and lack of tracking for customer delivery and operational costs.',
       solution: 'Conducted analysis on delivery optimization/fuel cost using Python. Implemented a tracking system that reduced customer complaints.',
       imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: '6',
      title: 'E-Commerce Finance Monitoring',
      typeOfWork: 'Business Analysis',
      tools: 'Excel, Python, Power BI, SQL',
      problem: 'Improper account monitoring causing lack of balance clarity and missing customer database generation.',
      solution: 'Performed full financial analysis across departments, automated Excel sheets for audit teams, and created approval stages for finance monitoring.',
      imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=800'
    }
  ];

  useEffect(() => {
    async function fetchProjects() {
      try {
        const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Project[];
        setProjects(data.length > 0 ? data : staticProjects);
      } catch (error) {
        console.error("Error fetching projects:", error);
        setProjects(staticProjects);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  return (
    <section id="projects" className="container px-6 mx-auto scroll-mt-20">
      <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">PROJECT SHOWCASE</h2>
          <p className="mt-4 text-slate-600 dark:text-slate-400">
            A selection of my recent analytical projects and business solutions.
          </p>
        </div>
      </div>

      <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            transition={{ delay: index * 0.1 }}
            className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800"
          >
            <div className="relative aspect-video overflow-hidden">
              <img
                src={project.imageUrl}
                alt={project.title}
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
              />
              <div className="absolute top-4 left-4">
                 <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-blue-600 backdrop-blur dark:bg-slate-900/90">
                    {project.typeOfWork}
                 </span>
              </div>
            </div>
            
            <div className="flex flex-1 flex-col p-6">
              <h3 className="text-xl font-bold dark:text-white">{project.title}</h3>
              <div className="mt-2 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                 <Layers className="h-4 w-4" />
                 <span>{project.tools}</span>
              </div>
              <p className="mt-4 line-clamp-3 text-slate-600 dark:text-slate-400">
                {project.problem}
              </p>
              
              <div className="mt-auto pt-6">
                <a
                  href={`/project/${project.id}`}
                  className="inline-flex items-center gap-2 font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  View Details
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
