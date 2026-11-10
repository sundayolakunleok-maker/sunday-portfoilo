import React, { useState, useEffect } from 'react';
import { auth, db, handleFirestoreError, OperationType } from '../lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, addDoc, serverTimestamp, query, orderBy, getDocs, deleteDoc, doc, updateDoc, setDoc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, LogOut, Layout, Image as ImageIcon, User, Save } from 'lucide-react';

export default function Admin() {
  const [user, setUser] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [profile, setProfile] = useState({
    name: 'Sunday Okegbemi',
    title: 'Professional Data Analyst',
    bio: 'Turning Raw Data into Clear Insights. Helping businesses optimize processes through data-driven decision-making.',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
    email: 'sundayolakunleok@gmail.com',
    whatsapp: '+2347035672890'
  });
  const [isAdding, setIsAdding] = useState(false);
  const [newProject, setNewProject] = useState({
    title: '',
    typeOfWork: '',
    tools: '',
    problem: '',
    solution: '',
    recommendation: '',
    imageUrl: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser(u);
        fetchProjects();
        fetchProfile();
      } else {
        navigate('/login');
      }
    });
    return unsubscribe;
  }, [navigate]);

  async function fetchProjects() {
    const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    setProjects(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  }

  async function fetchProfile() {
    const docRef = doc(db, 'profile', 'main');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setProfile(docSnap.data() as any);
    }
  }

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await setDoc(doc(db, 'profile', 'main'), profile);
      alert('Profile updated successfully!');
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'profile');
    }
  };

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'projects'), {
        ...newProject,
        createdAt: serverTimestamp(),
      });
      setIsAdding(false);
      setNewProject({ title: '', typeOfWork: '', tools: '', problem: '', solution: '', recommendation: '', imageUrl: '' });
      fetchProjects();
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'projects');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      await deleteDoc(doc(db, 'projects', id));
      fetchProjects();
    }
  };

  if (!user) return <div className="flex h-96 items-center justify-center">Loading...</div>;

  return (
    <div className="container px-6 py-24 mx-auto">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-3xl font-bold dark:text-white">Admin Dashboard</h1>
          <p className="text-slate-600 dark:text-slate-400">Welcome, {user.displayName || user.email}</p>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2 font-semibold text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400">
          <LogOut className="h-4 w-4" /> Logout
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-12">
          {/* Profile Section */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold dark:text-white flex items-center gap-2">
                <User className="h-6 w-6" /> Profile Settings
              </h2>
            </div>
            <form onSubmit={handleSaveProfile} className="space-y-6 rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium mb-1">Display Name</label>
                  <input value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} className="w-full rounded-xl border border-slate-200 px-4 py-2 dark:bg-slate-800 dark:border-slate-700" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Headline</label>
                  <input value={profile.title} onChange={e => setProfile({...profile, title: e.target.value})} className="w-full rounded-xl border border-slate-200 px-4 py-2 dark:bg-slate-800 dark:border-slate-700" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Photo URL</label>
                <input value={profile.photoUrl} onChange={e => setProfile({...profile, photoUrl: e.target.value})} className="w-full rounded-xl border border-slate-200 px-4 py-2 dark:bg-slate-800 dark:border-slate-700" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Bio Summary</label>
                <textarea rows={3} value={profile.bio} onChange={e => setProfile({...profile, bio: e.target.value})} className="w-full rounded-xl border border-slate-200 px-4 py-2 dark:bg-slate-800 dark:border-slate-700" />
              </div>
              <button type="submit" className="flex items-center justify-center gap-2 w-full rounded-xl bg-blue-600 py-3 font-bold text-white hover:bg-blue-700">
                <Save className="h-5 w-5" /> Save Profile Info
              </button>
            </form>
          </section>

          {/* Projects Section */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold dark:text-white">Project Management</h2>
              <button 
                onClick={() => setIsAdding(!isAdding)}
                className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
              >
                {isAdding ? 'Cancel' : <><Plus className="h-4 w-4" /> Add New Project</>}
              </button>
            </div>

            {isAdding && (
              <form onSubmit={handleAddProject} className="mb-12 space-y-6 rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium mb-1">Project Title</label>
                    <input required value={newProject.title} onChange={e => setNewProject({...newProject, title: e.target.value})} className="w-full rounded-xl border border-slate-200 px-4 py-2 dark:bg-slate-800 dark:border-slate-700" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Type of Work</label>
                    <input required placeholder="e.g. Business Analysis" value={newProject.typeOfWork} onChange={e => setNewProject({...newProject, typeOfWork: e.target.value})} className="w-full rounded-xl border border-slate-200 px-4 py-2 dark:bg-slate-800 dark:border-slate-700" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Tools Used</label>
                  <input required placeholder="Excel, Python, SQL" value={newProject.tools} onChange={e => setNewProject({...newProject, tools: e.target.value})} className="w-full rounded-xl border border-slate-200 px-4 py-2 dark:bg-slate-800 dark:border-slate-700" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Screenshot URL</label>
                  <input placeholder="https://..." value={newProject.imageUrl} onChange={e => setNewProject({...newProject, imageUrl: e.target.value})} className="w-full rounded-xl border border-slate-200 px-4 py-2 dark:bg-slate-800 dark:border-slate-700" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Problem Statement</label>
                  <textarea required rows={3} value={newProject.problem} onChange={e => setNewProject({...newProject, problem: e.target.value})} className="w-full rounded-xl border border-slate-200 px-4 py-2 dark:bg-slate-800 dark:border-slate-700" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Applied Solution</label>
                  <textarea required rows={3} value={newProject.solution} onChange={e => setNewProject({...newProject, solution: e.target.value})} className="w-full rounded-xl border border-slate-200 px-4 py-2 dark:bg-slate-800 dark:border-slate-700" />
                </div>
                <button type="submit" className="w-full rounded-xl bg-blue-600 py-3 font-bold text-white hover:bg-blue-700">Publish Project</button>
              </form>
            )}

            <div className="space-y-4">
              {projects.map(project => (
                <div key={project.id} className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 overflow-hidden rounded-lg bg-slate-100">
                        {project.imageUrl ? <img src={project.imageUrl} className="h-full w-full object-cover" /> : <ImageIcon className="h-full w-full p-3 text-slate-400" />}
                    </div>
                    <div>
                      <h3 className="font-bold dark:text-white">{project.title}</h3>
                      <p className="text-sm text-slate-500">{project.typeOfWork}</p>
                    </div>
                  </div>
                  <button onClick={() => handleDelete(project.id)} className="text-red-500 hover:text-red-600 p-2">
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-6">
           <div className="rounded-2xl bg-indigo-600 p-6 text-white shadow-xl">
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                <Layout className="h-5 w-5" /> Portfolio Stats
              </h3>
              <div className="mt-4 grid grid-cols-2 gap-4">
                 <div className="rounded-xl bg-white/10 p-3">
                   <p className="text-xs uppercase opacity-70">Projects</p>
                   <p className="text-2xl font-bold">{projects.length}</p>
                 </div>
                 <div className="rounded-xl bg-white/10 p-3">
                   <p className="text-xs uppercase opacity-70">Status</p>
                   <p className="text-2xl font-bold">Online</p>
                 </div>
              </div>
           </div>
           
           <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:bg-slate-900 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-sm">
             <h4 className="font-bold text-slate-900 dark:text-white mb-2 uppercase tracking-wider text-xs">How to use</h4>
             <p className="mb-4">1. Update your bio and photo in the Profile settings.</p>
             <p>2. Add your projects one by one. Use image URLs for screenshots. They will appear immediately on your home page.</p>
           </div>
        </div>
      </div>
    </div>
  );
}

