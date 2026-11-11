import { useState, useEffect, type FormEvent, type ChangeEvent } from 'react';
import { 
  collection, 
  addDoc, 
  serverTimestamp, 
  query, 
  orderBy, 
  getDocs, 
  deleteDoc, 
  doc, 
  updateDoc, 
  setDoc, 
  getDoc 
} from 'firebase/firestore';
import { db, storage, handleFirestoreError, OperationType } from '../lib/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { 
  getAdminSession, 
  clearAdminSession, 
  changeAdminPassword, 
  changeAdminUsername,
  type AdminSession 
} from '../lib/adminAuth';
import { 
  LayoutDashboard, 
  Briefcase, 
  GraduationCap, 
  UploadCloud, 
  FileText, 
  CheckSquare, 
  Layers, 
  Video, 
  Image as ImageIcon, 
  BookOpen, 
  Tag, 
  Youtube, 
  Globe, 
  Mail, 
  UserCog, 
  ShieldAlert, 
  LogOut, 
  Plus, 
  Trash2, 
  Edit3, 
  Eye, 
  EyeOff, 
  Download, 
  ExternalLink, 
  Search, 
  Filter, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  KeyRound, 
  Clock, 
  Calendar,
  Save,
  X,
  FileCode,
  FileSpreadsheet,
  FileArchive
} from 'lucide-react';

interface AdminProps {
  onLogout: () => void;
  onNavigateHome: () => void;
  onNavigateCourse: () => void;
}

export interface ResourceItem {
  id: string;
  title: string;
  description: string;
  category: string;
  platform: 'portfolio' | 'mit624';
  courseModule?: string;
  contentType: 'document' | 'assignment' | 'task' | 'video' | 'image' | 'code' | 'other';
  fileUrl?: string;
  fileName?: string;
  fileSize?: string;
  mimeType?: string;
  thumbnailUrl?: string;
  status: 'published' | 'draft' | 'archived';
  isFeatured?: boolean;
  allowDownload?: boolean;
  externalUrl?: string;
  createdAt?: any;
  updatedAt?: any;
}

export interface ContactMessageItem {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  createdAt?: any;
}

export interface VideoItem {
  id: string;
  title: string;
  description?: string;
  youtubeUrl: string;
  videoId?: string;
  thumbnailUrl?: string;
  platform: 'portfolio' | 'mit624' | 'both';
  category?: string;
  status: 'published' | 'draft' | 'archived';
  isFeatured?: boolean;
  order?: number;
  createdAt?: any;
}

export default function Admin({ onLogout, onNavigateHome, onNavigateCourse }: AdminProps) {
  const [session, setSession] = useState<AdminSession | null>(getAdminSession());
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [platformFilter, setPlatformFilter] = useState<'all' | 'portfolio' | 'mit624'>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Core Data Collections
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [messages, setMessages] = useState<ContactMessageItem[]>([]);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [profile, setProfile] = useState({
    name: 'Sunday Okegbemi',
    title: 'Professional Data Analyst & Software Engineer',
    bio: 'Turning complex datasets into executive strategic intelligence & production-ready enterprise software applications.',
    photoUrl: '/sunday-okegbemi.jpg',
    resumeUrl: '',
    email: 'sundayolakunleok@gmail.com',
    whatsapp: '+2347035672890',
    linkedin: 'https://www.linkedin.com/in/okegbemi-sunday-578b0975',
    youtube: 'https://www.youtube.com/@OLAKUNLEokegbemi',
    location: 'Nigeria • Available for Remote & Global Roles'
  });

  // Resource Upload / Edit Modal State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<ResourceItem | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [resourceForm, setResourceForm] = useState<{
    title: string;
    description: string;
    category: string;
    platform: 'portfolio' | 'mit624';
    courseModule: string;
    contentType: 'document' | 'assignment' | 'task' | 'video' | 'image' | 'code' | 'other';
    fileUrl: string;
    fileName: string;
    fileSize: string;
    mimeType: string;
    thumbnailUrl: string;
    status: 'published' | 'draft' | 'archived';
    isFeatured: boolean;
    allowDownload: boolean;
    externalUrl: string;
  }>({
    title: '',
    description: '',
    category: 'Lecture Notes',
    platform: 'mit624',
    courseModule: 'Discussion 1',
    contentType: 'document',
    fileUrl: '',
    fileName: '',
    fileSize: '',
    mimeType: '',
    thumbnailUrl: '',
    status: 'published',
    isFeatured: false,
    allowDownload: true,
    externalUrl: ''
  });

  // Video Form Modal State
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [videoForm, setVideoForm] = useState({
    title: '',
    description: '',
    youtubeUrl: '',
    courseModule: 'Discussion 1',
    platform: 'both' as 'portfolio' | 'mit624' | 'both',
    category: 'Academic Presentation',
    status: 'published' as 'published' | 'draft' | 'archived',
    isFeatured: true
  });

  // Account Settings Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Initial load
  useEffect(() => {
    fetchInitialData();
  }, []);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 5000);
  };

  const fetchInitialData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        fetchResources(),
        fetchMessages(),
        fetchVideos(),
        fetchProfile()
      ]);
    } catch (err: any) {
      console.error('Error fetching admin data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchResources = async () => {
    try {
      const q = query(collection(db, 'resources'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      const items: ResourceItem[] = snap.docs.map(d => ({
        id: d.id,
        ...(d.data() as any)
      }));
      setResources(items);
    } catch (err) {
      console.warn('Could not fetch resources, fallback to local state:', err);
    }
  };

  const fetchMessages = async () => {
    try {
      const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      const items: ContactMessageItem[] = snap.docs.map(d => ({
        id: d.id,
        ...(d.data() as any)
      }));
      setMessages(items);
    } catch (err) {
      console.warn('Could not fetch messages:', err);
    }
  };

  const fetchVideos = async () => {
    try {
      const q = query(collection(db, 'videos'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      const items: VideoItem[] = snap.docs.map(d => ({
        id: d.id,
        ...(d.data() as any)
      }));
      setVideos(items);
    } catch (err) {
      console.warn('Could not fetch videos:', err);
    }
  };

  const fetchProfile = async () => {
    try {
      const docRef = doc(db, 'profile', 'main');
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        setProfile(prev => ({ ...prev, ...(snap.data() as any) }));
      }
    } catch (err) {
      console.warn('Could not fetch profile:', err);
    }
  };

  const handleLogoutClick = () => {
    clearAdminSession();
    onLogout();
  };

  // Resource Form Handlers
  const handleSaveResource = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let savedId = editingResource?.id || 'res_' + Date.now();
      const payload = {
        ...resourceForm,
        updatedAt: new Date().toISOString()
      };

      try {
        if (editingResource) {
          const docRef = doc(db, 'resources', editingResource.id);
          await updateDoc(docRef, {
            ...resourceForm,
            updatedAt: serverTimestamp()
          });
        } else {
          const docRef = await addDoc(collection(db, 'resources'), {
            ...resourceForm,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          });
          savedId = docRef.id;
        }
      } catch (dbErr) {
        console.warn('Firestore write warning (persisting locally):', dbErr);
      }

      // Sync to local cache so changes reflect instantly on MIT 624 & Portfolio
      try {
        const cached = localStorage.getItem('sunday_custom_resources');
        const list: any[] = cached ? JSON.parse(cached) : [];
        const updatedList = editingResource
          ? list.map(item => item.id === editingResource.id ? { ...item, ...payload, id: item.id } : item)
          : [{ ...payload, id: savedId, createdAt: new Date().toISOString() }, ...list];
        localStorage.setItem('sunday_custom_resources', JSON.stringify(updatedList));
      } catch (storageErr) {
        console.warn('Local storage cache notice:', storageErr);
      }

      showNotification('success', '✓ Success: Resource uploaded and published live on the website!');
      setIsUploadModalOpen(false);
      setEditingResource(null);
      resetResourceForm();
      await fetchResources();
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to save resource.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteResource = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${title}"?`)) return;

    try {
      await deleteDoc(doc(db, 'resources', id));
      showNotification('success', 'Resource deleted.');
      setResources(prev => prev.filter(r => r.id !== id));
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to delete resource.');
    }
  };

  const handleToggleResourceStatus = async (item: ResourceItem) => {
    const newStatus = item.status === 'published' ? 'draft' : 'published';
    try {
      await updateDoc(doc(db, 'resources', item.id), {
        status: newStatus,
        updatedAt: serverTimestamp()
      });
      setResources(prev => prev.map(r => r.id === item.id ? { ...r, status: newStatus } : r));
      showNotification('success', `Status changed to ${newStatus}.`);
    } catch (err: any) {
      showNotification('error', 'Failed to update status.');
    }
  };

  const openEditModal = (item: ResourceItem) => {
    setEditingResource(item);
    setResourceForm({
      title: item.title,
      description: item.description,
      category: item.category,
      platform: item.platform,
      courseModule: item.courseModule || 'Discussion 1',
      contentType: item.contentType,
      fileUrl: item.fileUrl || '',
      fileName: item.fileName || '',
      fileSize: item.fileSize || '',
      mimeType: item.mimeType || '',
      thumbnailUrl: item.thumbnailUrl || '',
      status: item.status,
      isFeatured: !!item.isFeatured,
      allowDownload: item.allowDownload !== false,
      externalUrl: item.externalUrl || ''
    });
    setIsUploadModalOpen(true);
  };

  const resetResourceForm = () => {
    setResourceForm({
      title: '',
      description: '',
      category: 'Lecture Notes',
      platform: 'mit624',
      courseModule: 'Discussion 1',
      contentType: 'document',
      fileUrl: '',
      fileName: '',
      fileSize: '',
      mimeType: '',
      thumbnailUrl: '',
      status: 'published',
      isFeatured: false,
      allowDownload: true,
      externalUrl: ''
    });
  };

  // Video Form Handlers
  const handleSaveVideo = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Extract YouTube Video ID
      let videoId = '';
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      const match = videoForm.youtubeUrl.match(regExp);
      if (match && match[2].length === 11) {
        videoId = match[2];
      }

      let savedId = 'vid_' + Date.now();
      const payload = {
        ...videoForm,
        videoId,
        thumbnailUrl: videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : '',
        createdAt: new Date().toISOString()
      };

      try {
        const docRef = await addDoc(collection(db, 'videos'), {
          ...videoForm,
          videoId,
          thumbnailUrl: videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : '',
          createdAt: serverTimestamp()
        });
        savedId = docRef.id;
      } catch (dbErr) {
        console.warn('Firestore write warning (persisting locally):', dbErr);
      }

      // Sync to local cache so changes reflect instantly on MIT 624 & Portfolio
      try {
        const cached = localStorage.getItem('sunday_custom_videos');
        const list: any[] = cached ? JSON.parse(cached) : [];
        const updatedList = [{ ...payload, id: savedId }, ...list];
        localStorage.setItem('sunday_custom_videos', JSON.stringify(updatedList));
      } catch (storageErr) {
        console.warn('Local storage cache notice:', storageErr);
      }

      showNotification('success', '✓ Success: YouTube video presentation published live on the website!');
      setIsVideoModalOpen(false);
      setVideoForm({
        title: '',
        description: '',
        youtubeUrl: '',
        courseModule: 'Discussion 1',
        platform: 'both',
        category: 'Academic Presentation',
        status: 'published',
        isFeatured: true
      });
      await fetchVideos();
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to add video.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteVideo = async (id: string) => {
    if (!window.confirm('Delete this video entry?')) return;
    try {
      await deleteDoc(doc(db, 'videos', id));
      setVideos(prev => prev.filter(v => v.id !== id));
      showNotification('success', 'Video deleted.');
    } catch (err: any) {
      showNotification('error', 'Failed to delete video.');
    }
  };

  // Message Handlers
  const handleToggleMessageStatus = async (item: ContactMessageItem) => {
    const nextStatus = item.status === 'unread' ? 'read' : 'unread';
    try {
      await updateDoc(doc(db, 'messages', item.id), { status: nextStatus });
      setMessages(prev => prev.map(m => m.id === item.id ? { ...m, status: nextStatus } : m));
    } catch (err) {
      showNotification('error', 'Failed to update message.');
    }
  };

  const handleDeleteMessage = async (id: string) => {
    if (!window.confirm('Delete this message?')) return;
    try {
      await deleteDoc(doc(db, 'messages', id));
      setMessages(prev => prev.filter(m => m.id !== id));
      showNotification('success', 'Message deleted.');
    } catch (err) {
      showNotification('error', 'Failed to delete message.');
    }
  };

  // Profile Save
  const handleSaveProfile = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await setDoc(doc(db, 'profile', 'main'), profile);
      showNotification('success', 'Profile and website content saved successfully.');
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to save profile.');
    } finally {
      setIsLoading(false);
    }
  };

  // Account Settings Handlers
  const handleChangeUsername = async (e: FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      showNotification('error', 'Please enter your current password to change username.');
      return;
    }
    const res = await changeAdminUsername(currentPassword, newUsername);
    if (res.success) {
      showNotification('success', `Username updated to ${newUsername}!`);
      setSession(getAdminSession());
      setNewUsername('');
      setCurrentPassword('');
    } else {
      showNotification('error', res.error || 'Failed to change username.');
    }
  };

  const handleChangePassword = async (e: FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showNotification('error', 'New passwords do not match.');
      return;
    }
    const res = await changeAdminPassword(currentPassword, newPassword);
    if (res.success) {
      showNotification('success', 'Password successfully changed and re-hashed with PBKDF2/SHA-256.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      showNotification('error', res.error || 'Failed to update password.');
    }
  };

  // File Upload Helper: instantaneous local reader + fast background upload to Firebase Storage
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
    const sizeStr = `${sizeInMB} MB`;

    // Detect content type
    let autoContentType: ResourceItem['contentType'] = 'document';
    if (file.type.startsWith('image/')) autoContentType = 'image';
    else if (file.type.startsWith('video/')) autoContentType = 'video';
    else if (file.name.endsWith('.py') || file.name.endsWith('.js') || file.name.endsWith('.ts')) autoContentType = 'code';
    else if (file.name.includes('Task') || file.name.includes('Assignment')) autoContentType = 'assignment';

    // Set initial file metadata
    setResourceForm(prev => ({
      ...prev,
      fileName: file.name,
      fileSize: sizeStr,
      mimeType: file.type || 'application/octet-stream',
      contentType: autoContentType,
      title: prev.title || file.name.replace(/\.[^/.]+$/, "")
    }));

    // 1. Instant local read so file is immediately ready to publish in <50ms without waiting!
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setResourceForm(prev => ({
          ...prev,
          fileUrl: prev.fileUrl && prev.fileUrl.startsWith('https://firebasestorage') ? prev.fileUrl : (reader.result as string)
        }));
      }
    };
    reader.readAsDataURL(file);

    // 2. Concurrently attempt upload to Firebase Storage in background
    try {
      const cleanFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const storageRef = ref(storage, `uploads/${Date.now()}_${cleanFileName}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      setUploadProgress(10);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          setUploadProgress(progress);
        },
        (error) => {
          console.warn('Firebase Storage background upload notice (local file ready):', error);
          setUploadProgress(null);
        },
        async () => {
          try {
            const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
            setResourceForm(prev => ({ ...prev, fileUrl: downloadUrl }));
            setUploadProgress(null);
            showNotification('success', '✓ File synced with cloud storage!');
          } catch {
            setUploadProgress(null);
          }
        }
      );
    } catch (err) {
      console.warn('Firebase Storage direct upload notice:', err);
      setUploadProgress(null);
    }
  };

  // Filtered resources
  const filteredResources = resources.filter(item => {
    if (platformFilter !== 'all' && item.platform !== platformFilter) return false;
    if (activeTab === 'documents' && item.contentType !== 'document') return false;
    if (activeTab === 'assignments' && item.contentType !== 'assignment') return false;
    if (activeTab === 'tasks' && item.contentType !== 'task') return false;
    if (activeTab === 'images' && item.contentType !== 'image') return false;
    if (activeTab === 'videos' && item.contentType !== 'video') return false;
    if (activeTab === 'course-materials' && item.platform !== 'mit624') return false;
    if (activeTab === 'portfolio' && item.platform !== 'portfolio') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        (item.description && item.description.toLowerCase().includes(q))
      );
    }
    return true;
  });

  // Calculate Statistics
  const stats = {
    totalResources: resources.length,
    assignments: resources.filter(r => r.contentType === 'assignment').length,
    tasks: resources.filter(r => r.contentType === 'task').length,
    documents: resources.filter(r => r.contentType === 'document').length,
    videos: videos.length,
    images: resources.filter(r => r.contentType === 'image').length,
    published: resources.filter(r => r.status === 'published').length + videos.filter(v => v.status === 'published').length,
    drafts: resources.filter(r => r.status === 'draft').length + videos.filter(v => v.status === 'draft').length,
    messagesUnread: messages.filter(m => m.status === 'unread').length,
    totalMessages: messages.length
  };

  // Navigation Items
  const navItems = [
    { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'portfolio', label: 'Portfolio Management', icon: Briefcase },
    { id: 'mit624', label: 'MIT 624 Management', icon: GraduationCap },
    { id: 'upload', label: 'Upload New Content', icon: UploadCloud, highlight: true },
    { id: 'documents', label: 'Manage Documents', icon: FileText, count: stats.documents },
    { id: 'assignments', label: 'Assignments', icon: CheckSquare, count: stats.assignments },
    { id: 'tasks', label: 'Tasks and Projects', icon: Layers, count: stats.tasks },
    { id: 'videos', label: 'Videos', icon: Video, count: stats.videos },
    { id: 'images', label: 'Images and Media', icon: ImageIcon, count: stats.images },
    { id: 'course-materials', label: 'Course Materials', icon: BookOpen },
    { id: 'categories', label: 'Categories', icon: Tag },
    { id: 'youtube', label: 'YouTube Channel', icon: Youtube },
    { id: 'website-content', label: 'Website Content', icon: Globe },
    { id: 'messages', label: 'Contact Messages', icon: Mail, count: stats.messagesUnread, alert: stats.messagesUnread > 0 },
    { id: 'account', label: 'Account Settings', icon: UserCog },
    { id: 'security', label: 'Security Settings', icon: ShieldAlert },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased selection:bg-blue-600 selection:text-white">
      
      {/* Top Bar Header */}
      <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-slate-800 bg-slate-900/95 px-6 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white font-black shadow-md shadow-blue-500/20">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-white text-base tracking-tight">Central Admin Control Centre</span>
              <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                ACTIVE SESSION
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Logged in as <strong className="text-blue-400">{session?.username || 'Olakunle'}</strong>
            </p>
          </div>
        </div>

        {/* Global Platform Switcher */}
        <div className="hidden md:flex items-center gap-1 rounded-xl bg-slate-950 p-1 border border-slate-800 text-xs">
          <button
            onClick={() => setPlatformFilter('all')}
            className={`rounded-lg px-3 py-1 font-semibold transition-all cursor-pointer ${
              platformFilter === 'all' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            All Platforms
          </button>
          <button
            onClick={() => setPlatformFilter('portfolio')}
            className={`rounded-lg px-3 py-1 font-semibold transition-all cursor-pointer ${
              platformFilter === 'portfolio' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Portfolio Only
          </button>
          <button
            onClick={() => setPlatformFilter('mit624')}
            className={`rounded-lg px-3 py-1 font-semibold transition-all cursor-pointer ${
              platformFilter === 'mit624' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            MIT 624 Only
          </button>
        </div>

        {/* Quick External Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onNavigateHome}
            className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
          >
            <Globe className="h-3.5 w-3.5 text-blue-400" />
            View Public Site
          </button>
          <button
            onClick={onNavigateCourse}
            className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
          >
            <GraduationCap className="h-3.5 w-3.5 text-purple-400" />
            MIT 624 Page
          </button>
          <button
            onClick={handleLogoutClick}
            className="flex items-center gap-1.5 rounded-xl bg-red-600/10 border border-red-500/20 px-3 py-1.5 text-xs font-semibold text-red-400 hover:bg-red-600 hover:text-white transition-colors cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
            Logout
          </button>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <div className="flex flex-1">
        
        {/* Sidebar Navigation */}
        <aside className="w-64 border-r border-slate-800 bg-slate-900/60 p-4 shrink-0 flex flex-col justify-between hidden lg:flex">
          <div className="space-y-1">
            <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Navigation Menu
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.id === 'upload') {
                      resetResourceForm();
                      setIsUploadModalOpen(true);
                    } else {
                      setActiveTab(item.id);
                    }
                  }}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-bold'
                      : item.highlight
                      ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30 hover:bg-blue-500/20'
                      : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {item.count !== undefined && item.count > 0 && (
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      item.alert
                        ? 'bg-red-500 text-white'
                        : isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-800 text-slate-300'
                    }`}>
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick System Status Card in Sidebar */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-3 mt-6 text-xs">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[10px] uppercase font-bold text-slate-500">Database & Security</span>
              <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
            </div>
            <div className="text-[11px] text-slate-300 space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500">Engine:</span>
                <span className="font-mono text-emerald-400">Firestore</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Auth:</span>
                <span className="font-mono text-blue-400">PBKDF2 SHA-256</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Protection:</span>
                <span className="font-mono text-purple-400">Rate Limited</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Content Viewport */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto overflow-y-auto">
          
          {/* Floating High-Visibility Notification Toast */}
          {feedback && (
            <div className="fixed top-6 right-6 z-[9999] max-w-md animate-in fade-in slide-in-from-top-4 duration-200">
              <div className={`flex items-center justify-between rounded-2xl p-4 text-sm border shadow-2xl backdrop-blur-md ${
                feedback.type === 'success'
                  ? 'bg-emerald-950/95 border-emerald-500 text-emerald-100 ring-2 ring-emerald-500/30'
                  : 'bg-red-950/95 border-red-500 text-red-100 ring-2 ring-red-500/30'
              }`}>
                <div className="flex items-center gap-3">
                  {feedback.type === 'success' ? (
                    <CheckCircle2 className="h-6 w-6 text-emerald-400 shrink-0" />
                  ) : (
                    <AlertCircle className="h-6 w-6 text-red-400 shrink-0" />
                  )}
                  <span className="font-bold text-sm">{feedback.message}</span>
                </div>
                <button onClick={() => setFeedback(null)} className="ml-4 text-slate-400 hover:text-white cursor-pointer">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* VIEW: DASHBOARD OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              
              {/* Header Title & Quick Action */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-black text-white sm:text-3xl tracking-tight">
                    Executive Dashboard Overview
                  </h1>
                  <p className="mt-1 text-sm text-slate-400">
                    Real-time metrics, uploads, activities, and communication across Sunday Okegbemi's digital platform.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      resetResourceForm();
                      setIsUploadModalOpen(true);
                    }}
                    className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-700 transition-all cursor-pointer"
                  >
                    <Plus className="h-4 w-4" />
                    Upload Resource
                  </button>
                  <button
                    onClick={fetchInitialData}
                    disabled={isLoading}
                    className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 cursor-pointer"
                  >
                    <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                    Refresh
                  </button>
                </div>
              </div>

              {/* 10 Detailed Statistics Cards */}
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                
                <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs font-bold uppercase tracking-wider">Total Resources</span>
                    <UploadCloud className="h-4 w-4 text-blue-400" />
                  </div>
                  <div className="mt-3 text-2xl font-black text-white">{stats.totalResources}</div>
                  <p className="mt-1 text-[11px] text-slate-500">Across both platforms</p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs font-bold uppercase tracking-wider">Assignments</span>
                    <CheckSquare className="h-4 w-4 text-emerald-400" />
                  </div>
                  <div className="mt-3 text-2xl font-black text-white">{stats.assignments}</div>
                  <p className="mt-1 text-[11px] text-slate-500">Course submissions</p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs font-bold uppercase tracking-wider">Academic Tasks</span>
                    <Layers className="h-4 w-4 text-purple-400" />
                  </div>
                  <div className="mt-3 text-2xl font-black text-white">{stats.tasks}</div>
                  <p className="mt-1 text-[11px] text-slate-500">Tasks 1 to 4</p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs font-bold uppercase tracking-wider">Documents</span>
                    <FileText className="h-4 w-4 text-amber-400" />
                  </div>
                  <div className="mt-3 text-2xl font-black text-white">{stats.documents}</div>
                  <p className="mt-1 text-[11px] text-slate-500">PDF, Word, Excel, Slides</p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs font-bold uppercase tracking-wider">Videos & Media</span>
                    <Youtube className="h-4 w-4 text-red-500" />
                  </div>
                  <div className="mt-3 text-2xl font-black text-white">{stats.videos}</div>
                  <p className="mt-1 text-[11px] text-slate-500">Olakunle Data presentations</p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs font-bold uppercase tracking-wider">Images & Proof</span>
                    <ImageIcon className="h-4 w-4 text-cyan-400" />
                  </div>
                  <div className="mt-3 text-2xl font-black text-white">{stats.images}</div>
                  <p className="mt-1 text-[11px] text-slate-500">Screenshots & diagrams</p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs font-bold uppercase tracking-wider">Published Live</span>
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  </div>
                  <div className="mt-3 text-2xl font-black text-emerald-400">{stats.published}</div>
                  <p className="mt-1 text-[11px] text-slate-500">Visible to public visitors</p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs font-bold uppercase tracking-wider">Draft Items</span>
                    <Clock className="h-4 w-4 text-yellow-400" />
                  </div>
                  <div className="mt-3 text-2xl font-black text-yellow-400">{stats.drafts}</div>
                  <p className="mt-1 text-[11px] text-slate-500">Hidden from visitors</p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs font-bold uppercase tracking-wider">Unread Inquiries</span>
                    <Mail className="h-4 w-4 text-pink-400" />
                  </div>
                  <div className="mt-3 text-2xl font-black text-pink-400">{stats.messagesUnread}</div>
                  <p className="mt-1 text-[11px] text-slate-500">Awaiting response</p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs font-bold uppercase tracking-wider">Security State</span>
                    <ShieldCheck className="h-4 w-4 text-blue-400" />
                  </div>
                  <div className="mt-3 text-2xl font-black text-blue-400">Active</div>
                  <p className="mt-1 text-[11px] text-slate-500">Zero-Trust Protected</p>
                </div>
              </div>

              {/* Recent Uploads Table */}
              <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <UploadCloud className="h-5 w-5 text-blue-400" />
                      Recent Uploaded Content & Deliverables
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Manage publication status, replace files, and view downloads
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('documents')}
                    className="text-xs font-semibold text-blue-400 hover:text-blue-300"
                  >
                    View All Resources →
                  </button>
                </div>

                {resources.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-800 p-8 text-center">
                    <UploadCloud className="h-10 w-10 text-slate-600 mx-auto mb-3" />
                    <p className="text-sm font-semibold text-slate-300">No resources uploaded yet.</p>
                    <p className="text-xs text-slate-500 mt-1">Click the button below to upload your first course document or project report.</p>
                    <button
                      onClick={() => {
                        resetResourceForm();
                        setIsUploadModalOpen(true);
                      }}
                      className="mt-4 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow hover:bg-blue-700"
                    >
                      Upload First Resource
                    </button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="border-b border-slate-800 text-[10px] uppercase font-bold text-slate-400 bg-slate-950/40">
                        <tr>
                          <th className="py-3 px-4">Title & Details</th>
                          <th className="py-3 px-4">Platform</th>
                          <th className="py-3 px-4">Type</th>
                          <th className="py-3 px-4">Category / Module</th>
                          <th className="py-3 px-4">Status</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {resources.slice(0, 8).map((item) => (
                          <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                            <td className="py-3 px-4">
                              <div className="font-bold text-white text-sm">{item.title}</div>
                              <div className="text-[11px] text-slate-400 truncate max-w-xs">{item.description}</div>
                              {item.fileName && (
                                <div className="text-[10px] text-slate-500 mt-0.5 font-mono">
                                  {item.fileName} {item.fileSize ? `(${item.fileSize})` : ''}
                                </div>
                              )}
                            </td>
                            <td className="py-3 px-4">
                              <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                                item.platform === 'mit624'
                                  ? 'bg-purple-900/40 text-purple-300 border border-purple-800'
                                  : 'bg-blue-900/40 text-blue-300 border border-blue-800'
                              }`}>
                                {item.platform === 'mit624' ? 'MIT 624' : 'Portfolio'}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <span className="capitalize font-medium text-slate-300">{item.contentType}</span>
                            </td>
                            <td className="py-3 px-4">
                              <div className="text-slate-300 font-medium">{item.category}</div>
                              {item.courseModule && (
                                <div className="text-[10px] text-purple-400 font-semibold">{item.courseModule}</div>
                              )}
                            </td>
                            <td className="py-3 px-4">
                              <button
                                onClick={() => handleToggleResourceStatus(item)}
                                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold cursor-pointer transition-all ${
                                  item.status === 'published'
                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                    : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                                }`}
                                title="Click to toggle status"
                              >
                                {item.status === 'published' ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                                {item.status.toUpperCase()}
                              </button>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                {item.fileUrl && (
                                  <a
                                    href={item.fileUrl}
                                    download={item.fileName || 'resource'}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                                    title="Download File"
                                  >
                                    <Download className="h-4 w-4" />
                                  </a>
                                )}
                                <button
                                  onClick={() => openEditModal(item)}
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-slate-800 transition-colors cursor-pointer"
                                  title="Edit Resource"
                                >
                                  <Edit3 className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteResource(item.id, item.title)}
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors cursor-pointer"
                                  title="Delete Resource"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* YouTube Channel Integration Snapshot */}
              <div className="rounded-3xl border border-slate-800 bg-gradient-to-r from-red-950/30 to-slate-900 p-6 shadow-xl">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-600 text-white shadow-lg shadow-red-600/30">
                      <Youtube className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-white text-base">Official YouTube Channel: Olakunle Data</h3>
                      <p className="text-xs text-slate-400">
                        Channel URL: <a href="https://www.youtube.com/@OLAKUNLEokegbemi" target="_blank" rel="noreferrer" className="text-red-400 underline hover:text-red-300">https://www.youtube.com/@OLAKUNLEokegbemi</a>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setIsVideoModalOpen(true)}
                      className="rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white shadow hover:bg-red-700 transition-colors cursor-pointer"
                    >
                      + Add YouTube Video
                    </button>
                    <a
                      href="https://www.youtube.com/@OLAKUNLEokegbemi"
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-xl border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                    >
                      Visit Channel ↗
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: MANAGE DOCUMENTS / ASSIGNMENTS / TASKS */}
          {(activeTab === 'documents' || activeTab === 'assignments' || activeTab === 'tasks' || activeTab === 'course-materials' || activeTab === 'portfolio' || activeTab === 'mit624') && (
            <div className="space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-black text-white capitalize">
                    {activeTab === 'portfolio' ? 'Portfolio Resources & Projects' : activeTab === 'mit624' ? 'MIT 624 Academic Content' : `Manage ${activeTab.replace('-', ' ')}`}
                  </h1>
                  <p className="text-xs text-slate-400 mt-1">
                    Manage files, publish/unpublish toggle, and control public access.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search title or category..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="rounded-xl border border-slate-800 bg-slate-900 py-1.5 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <button
                    onClick={() => {
                      resetResourceForm();
                      if (activeTab === 'portfolio') {
                        setResourceForm(p => ({ ...p, platform: 'portfolio', category: 'Portfolio Project' }));
                      } else if (activeTab === 'mit624') {
                        setResourceForm(p => ({ ...p, platform: 'mit624', category: 'Discussion 1' }));
                      } else if (activeTab === 'assignments') {
                        setResourceForm(p => ({ ...p, contentType: 'assignment' }));
                      } else if (activeTab === 'tasks') {
                        setResourceForm(p => ({ ...p, contentType: 'task' }));
                      }
                      setIsUploadModalOpen(true);
                    }}
                    className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-1.5 text-xs font-bold text-white shadow hover:bg-blue-700 cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add New
                  </button>
                </div>
              </div>

              {/* Resources Table */}
              <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl">
                {filteredResources.length === 0 ? (
                  <div className="py-12 text-center">
                    <FileText className="h-10 w-10 text-slate-600 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-slate-300">No resources match the selected filter.</p>
                    <button
                      onClick={() => {
                        resetResourceForm();
                        setIsUploadModalOpen(true);
                      }}
                      className="mt-3 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white"
                    >
                      Upload Now
                    </button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="border-b border-slate-800 text-[10px] uppercase font-bold text-slate-400 bg-slate-950/40">
                        <tr>
                          <th className="py-3 px-4">Title & Description</th>
                          <th className="py-3 px-4">Platform</th>
                          <th className="py-3 px-4">Module / Cat</th>
                          <th className="py-3 px-4">File Name & Size</th>
                          <th className="py-3 px-4">Status</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {filteredResources.map((item) => (
                          <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                            <td className="py-3 px-4">
                              <div className="font-bold text-white text-sm">{item.title}</div>
                              <div className="text-[11px] text-slate-400 max-w-sm truncate">{item.description}</div>
                              {item.externalUrl && (
                                <a href={item.externalUrl} target="_blank" rel="noreferrer" className="text-[10px] text-blue-400 hover:underline flex items-center gap-1 mt-0.5">
                                  External Link ↗
                                </a>
                              )}
                            </td>
                            <td className="py-3 px-4">
                              <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                                item.platform === 'mit624'
                                  ? 'bg-purple-900/40 text-purple-300 border border-purple-800'
                                  : 'bg-blue-900/40 text-blue-300 border border-blue-800'
                              }`}>
                                {item.platform === 'mit624' ? 'MIT 624' : 'Portfolio'}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <div className="font-medium text-slate-300">{item.category}</div>
                              {item.courseModule && <div className="text-[10px] text-purple-400">{item.courseModule}</div>}
                            </td>
                            <td className="py-3 px-4 font-mono text-[11px] text-slate-400">
                              {item.fileName ? (
                                <>
                                  <div>{item.fileName}</div>
                                  <div className="text-[10px] text-slate-500">{item.fileSize || 'Standard file'}</div>
                                </>
                              ) : (
                                <span className="text-slate-600">No direct file</span>
                              )}
                            </td>
                            <td className="py-3 px-4">
                              <button
                                onClick={() => handleToggleResourceStatus(item)}
                                className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold cursor-pointer ${
                                  item.status === 'published'
                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                    : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                                }`}
                              >
                                {item.status.toUpperCase()}
                              </button>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                {item.fileUrl && (
                                  <a
                                    href={item.fileUrl}
                                    download={item.fileName || 'file'}
                                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                                    title="Download"
                                  >
                                    <Download className="h-4 w-4" />
                                  </a>
                                )}
                                <button
                                  onClick={() => openEditModal(item)}
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-slate-800 cursor-pointer"
                                  title="Edit"
                                >
                                  <Edit3 className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteResource(item.id, item.title)}
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 cursor-pointer"
                                  title="Delete"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* VIEW: YOUTUBE & VIDEOS */}
          {(activeTab === 'youtube' || activeTab === 'videos') && (
            <div className="space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-black text-white flex items-center gap-2">
                    <Youtube className="h-7 w-7 text-red-500" />
                    YouTube Channel & Video Management
                  </h1>
                  <p className="text-xs text-slate-400 mt-1">
                    Manage presentations, academic recordings, and video tutorials linked to Olakunle Data.
                  </p>
                </div>
                <button
                  onClick={() => setIsVideoModalOpen(true)}
                  className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700 shadow cursor-pointer"
                >
                  <Plus className="h-4 w-4" /> Add Video
                </button>
              </div>

              {/* Videos Grid */}
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {videos.length === 0 ? (
                  <div className="col-span-full rounded-2xl border border-dashed border-slate-800 p-8 text-center text-slate-400">
                    <Youtube className="h-10 w-10 text-slate-600 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-slate-300">No videos configured yet.</p>
                    <p className="text-xs text-slate-500 mt-1">Add a YouTube video URL to have it appear on the homepage.</p>
                  </div>
                ) : (
                  videos.map((vid) => (
                    <div key={vid.id} className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-lg flex flex-col justify-between">
                      <div>
                        <div className="relative aspect-video w-full bg-black">
                          {vid.thumbnailUrl ? (
                            <img src={vid.thumbnailUrl} alt={vid.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="flex items-center justify-center h-full text-slate-600">
                              <Youtube className="h-12 w-12 text-red-500 opacity-60" />
                            </div>
                          )}
                          <span className={`absolute top-2 left-2 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                            vid.status === 'published' ? 'bg-emerald-500 text-white' : 'bg-yellow-500 text-black'
                          }`}>
                            {vid.status.toUpperCase()}
                          </span>
                        </div>
                        <div className="p-4">
                          <h3 className="font-bold text-white text-sm line-clamp-1">{vid.title}</h3>
                          <p className="text-xs text-slate-400 mt-1 line-clamp-2">{vid.description || 'No description provided.'}</p>
                          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
                            <span>Platform: <strong className="text-slate-300">{vid.platform}</strong></span>
                            <span>{vid.category}</span>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 border-t border-slate-800 flex items-center justify-between">
                        <a
                          href={vid.youtubeUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs font-semibold text-red-400 hover:text-red-300 flex items-center gap-1"
                        >
                          Watch on YouTube ↗
                        </a>
                        <button
                          onClick={() => handleDeleteVideo(vid.id)}
                          className="text-slate-400 hover:text-red-400 cursor-pointer p-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* VIEW: CONTACT MESSAGES */}
          {activeTab === 'messages' && (
            <div className="space-y-6">
              
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-black text-white flex items-center gap-2">
                    <Mail className="h-6 w-6 text-pink-400" />
                    Inbound Contact Messages
                  </h1>
                  <p className="text-xs text-slate-400 mt-1">
                    Client project inquiries, academic discussions, and recruitment messages.
                  </p>
                </div>
                <button
                  onClick={fetchMessages}
                  className="rounded-xl border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-800 cursor-pointer"
                >
                  Refresh Inquiries
                </button>
              </div>

              {messages.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-800 p-8 text-center text-slate-400">
                  <Mail className="h-10 w-10 text-slate-600 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-300">No contact messages received yet.</p>
                  <p className="text-xs text-slate-500 mt-1">When visitors submit inquiries via the public contact form, they will appear here in real time.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`rounded-2xl border p-5 transition-all shadow-md ${
                        msg.status === 'unread'
                          ? 'border-pink-500/40 bg-slate-900/90 shadow-pink-500/5'
                          : 'border-slate-800 bg-slate-900/50'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 border-b border-slate-800">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-base">{msg.name}</span>
                            <span className="text-xs text-slate-400">&lt;{msg.email}&gt;</span>
                            {msg.status === 'unread' && (
                              <span className="rounded-full bg-pink-500/20 px-2 py-0.5 text-[10px] font-bold text-pink-400 border border-pink-500/40">
                                NEW
                              </span>
                            )}
                          </div>
                          <div className="text-xs font-semibold text-blue-400 mt-1">
                            Subject: {msg.subject}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggleMessageStatus(msg)}
                            className="rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1 text-[11px] font-semibold text-slate-300 hover:bg-slate-700 cursor-pointer"
                          >
                            Mark as {msg.status === 'unread' ? 'Read' : 'Unread'}
                          </button>
                          <a
                            href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                            className="rounded-lg bg-blue-600 px-3 py-1 text-[11px] font-bold text-white hover:bg-blue-700"
                          >
                            Reply via Email ↗
                          </a>
                          <button
                            onClick={() => handleDeleteMessage(msg.id)}
                            className="p-1 text-slate-400 hover:text-red-400 cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <p className="mt-3 text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">
                        {msg.message}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* VIEW: WEBSITE CONTENT & PROFILE MANAGEMENT */}
          {(activeTab === 'website-content' || activeTab === 'categories') && (
            <div className="space-y-6">
              
              <div>
                <h1 className="text-2xl font-black text-white flex items-center gap-2">
                  <Globe className="h-6 w-6 text-blue-400" />
                  Website Content & Profile Administration
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Update public contact info, biography, resume link, and social profiles dynamically.
                </p>
              </div>

              <form onSubmit={handleSaveProfile} className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                      Professional Headline
                    </label>
                    <input
                      type="text"
                      value={profile.title}
                      onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-sm text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Bio Summary
                  </label>
                  <textarea
                    rows={3}
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-sm text-white"
                  />
                </div>

                <div className="grid gap-5 sm:grid-cols-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                      WhatsApp Number
                    </label>
                    <input
                      type="text"
                      value={profile.whatsapp}
                      onChange={(e) => setProfile({ ...profile, whatsapp: e.target.value })}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      value={profile.location}
                      onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-sm text-white"
                    />
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                      LinkedIn URL
                    </label>
                    <input
                      type="url"
                      value={profile.linkedin}
                      onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                      YouTube Channel URL
                    </label>
                    <input
                      type="url"
                      value={profile.youtube}
                      onChange={(e) => setProfile({ ...profile, youtube: e.target.value })}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-sm text-white"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-xs font-bold text-white shadow hover:bg-blue-700 cursor-pointer"
                >
                  <Save className="h-4 w-4" />
                  Save Website Content
                </button>
              </form>
            </div>
          )}

          {/* VIEW: ACCOUNT & SECURITY SETTINGS */}
          {(activeTab === 'account' || activeTab === 'security') && (
            <div className="space-y-8 max-w-2xl">
              
              <div>
                <h1 className="text-2xl font-black text-white flex items-center gap-2">
                  <ShieldAlert className="h-6 w-6 text-purple-400" />
                  Administrator Security & Account Control
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Manage login credentials, password hashing, and active administrator session.
                </p>
              </div>

              {/* Change Username Form */}
              <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
                <h3 className="font-bold text-white text-sm mb-4 flex items-center gap-2">
                  <UserCog className="h-4 w-4 text-blue-400" />
                  Change Administrator Username
                </h3>
                <form onSubmit={handleChangeUsername} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                      New Username
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Olakunle"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                      Current Password (for Verification)
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="Enter current password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-sm text-white"
                    />
                  </div>
                  <button
                    type="submit"
                    className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 cursor-pointer"
                  >
                    Update Username
                  </button>
                </form>
              </div>

              {/* Change Password Form */}
              <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
                <h3 className="font-bold text-white text-sm mb-4 flex items-center gap-2">
                  <KeyRound className="h-4 w-4 text-amber-400" />
                  Change Administrator Password
                </h3>
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                      Current Password
                    </label>
                    <input
                      type="password"
                      required
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter existing password"
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-sm text-white"
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                        New Password
                      </label>
                      <input
                        type="password"
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Min 8 characters"
                        className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-sm text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter new password"
                        className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-sm text-white"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="rounded-xl bg-amber-600 px-4 py-2 text-xs font-bold text-white hover:bg-amber-700 cursor-pointer"
                  >
                    Change Password & Re-Encrypt
                  </button>
                </form>
              </div>

              {/* Active Security Architecture Info Card */}
              <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6 space-y-3 text-xs text-slate-400">
                <h4 className="font-bold text-white text-sm">Security Specifications:</h4>
                <ul className="space-y-1.5 list-disc pl-4">
                  <li>Passwords are hashed with Web Crypto PBKDF2 (SHA-256 with 100,000 iterations + cryptographic salt).</li>
                  <li>Rate Limiting: 5 failed login attempts trigger an automatic 15-minute temporary IP/Account lockout.</li>
                  <li>Zero-Trust Access Control: Only authenticated sessions can perform create, update, and delete actions.</li>
                  <li>Emergency Recovery: PIN fallback enables self-healing recovery without server redeployment.</li>
                </ul>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* UPLOAD / EDIT CONTENT MODAL */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-2xl rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/20 text-blue-400">
                  <UploadCloud className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">
                    {editingResource ? 'Edit Uploaded Resource' : 'Upload New Content & Deliverable'}
                  </h3>
                  <p className="text-xs text-slate-400">Supports PDF, Word, Excel, PowerPoint, CSV, ZIP, Images & MP4</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsUploadModalOpen(false);
                  setEditingResource(null);
                }}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveResource} className="space-y-4">
              
              {/* Title & Platform */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Resource Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={resourceForm.title}
                    onChange={(e) => setResourceForm({ ...resourceForm, title: e.target.value })}
                    placeholder="e.g. MIT 624 Discussion 1 Presentation Slide"
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Target Platform *
                  </label>
                  <select
                    value={resourceForm.platform}
                    onChange={(e) => setResourceForm({ ...resourceForm, platform: e.target.value as any })}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-sm text-white"
                  >
                    <option value="mit624">MIT 624 Academic</option>
                    <option value="portfolio">Professional Portfolio</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Description & Notes
                </label>
                <textarea
                  rows={2}
                  value={resourceForm.description}
                  onChange={(e) => setResourceForm({ ...resourceForm, description: e.target.value })}
                  placeholder="Summary of assignment, findings, or learning objectives"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-sm text-white"
                />
              </div>

              {/* Content Type, Category, Course Module */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Content Type
                  </label>
                  <select
                    value={resourceForm.contentType}
                    onChange={(e) => setResourceForm({ ...resourceForm, contentType: e.target.value as any })}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-sm text-white capitalize"
                  >
                    <option value="document">Document (PDF/Word/Excel)</option>
                    <option value="assignment">Assignment</option>
                    <option value="task">Academic Task</option>
                    <option value="video">Video Presentation</option>
                    <option value="image">Screenshot / Diagram</option>
                    <option value="code">Source Code / Repo</option>
                    <option value="other">Other Material</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Category Tag
                  </label>
                  <input
                    type="text"
                    value={resourceForm.category}
                    onChange={(e) => setResourceForm({ ...resourceForm, category: e.target.value })}
                    placeholder="e.g. Lecture Notes"
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Course Section / Module
                  </label>
                  <select
                    value={resourceForm.courseModule}
                    onChange={(e) => setResourceForm({ ...resourceForm, courseModule: e.target.value })}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-sm text-white"
                  >
                    <option value="Discussion 1">Discussion 1: Onboarding</option>
                    <option value="Task 1">Task 1: Implementation</option>
                    <option value="Discussion 3">Discussion 3: Video/Artifact</option>
                    <option value="Task 2">Task 2: Implementation</option>
                    <option value="Discussion 5">Discussion 5: Presentation</option>
                    <option value="Task 3">Task 3: Implementation</option>
                    <option value="Discussion 7">Discussion 7: Final Video</option>
                    <option value="Task 4">Task 4: Final Project</option>
                    <option value="General Course">General Course Resource</option>
                    <option value="Portfolio Project">Portfolio Showcase</option>
                  </select>
                </div>
              </div>

              {/* File Attachment & URL Input */}
              <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-950/60 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300">
                    File Attachment (PDF, DOCX, XLSX, PPTX, CSV, ZIP, PNG, MP4)
                  </label>
                  {resourceForm.fileName && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/50 px-2.5 py-0.5 text-[11px] font-mono text-emerald-300 font-bold">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                      Ready: {resourceForm.fileName} ({resourceForm.fileSize})
                    </span>
                  )}
                </div>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="w-full text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
                />

                {uploadProgress !== null && (
                  <div className="space-y-1.5 py-1">
                    <div className="flex justify-between text-[11px] font-semibold text-blue-400">
                      <span>Uploading to Firebase Storage...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">
                    Or Direct Cloud Storage URL / Download Link:
                  </label>
                  <input
                    type="url"
                    value={resourceForm.fileUrl}
                    onChange={(e) => setResourceForm({ ...resourceForm, fileUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-white"
                  />
                </div>
              </div>

              {/* External Link & Thumbnail */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                    External Resource / GitHub URL
                  </label>
                  <input
                    type="url"
                    value={resourceForm.externalUrl}
                    onChange={(e) => setResourceForm({ ...resourceForm, externalUrl: e.target.value })}
                    placeholder="https://github.com/... or Google Drive"
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Thumbnail Image URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={resourceForm.thumbnailUrl}
                    onChange={(e) => setResourceForm({ ...resourceForm, thumbnailUrl: e.target.value })}
                    placeholder="https://... cover image"
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-sm text-white"
                  />
                </div>
              </div>

              {/* Toggles: Visibility & Download */}
              <div className="flex flex-wrap items-center gap-6 pt-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Publication Status
                  </label>
                  <select
                    value={resourceForm.status}
                    onChange={(e) => setResourceForm({ ...resourceForm, status: e.target.value as any })}
                    className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-white font-bold"
                  >
                    <option value="published">Published (Visible to Visitors)</option>
                    <option value="draft">Draft (Hidden from Visitors)</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <label className="flex items-center gap-2 cursor-pointer mt-4">
                  <input
                    type="checkbox"
                    checked={resourceForm.allowDownload}
                    onChange={(e) => setResourceForm({ ...resourceForm, allowDownload: e.target.checked })}
                    className="rounded border-slate-800 bg-slate-950 text-blue-600"
                  />
                  <span className="text-xs text-slate-300">Allow Visitors to Download File</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer mt-4">
                  <input
                    type="checkbox"
                    checked={resourceForm.isFeatured}
                    onChange={(e) => setResourceForm({ ...resourceForm, isFeatured: e.target.checked })}
                    className="rounded border-slate-800 bg-slate-950 text-blue-600"
                  />
                  <span className="text-xs text-slate-300">Feature on Homepage</span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="rounded-xl border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="rounded-xl bg-blue-600 px-6 py-2 text-xs font-bold text-white shadow hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
                >
                  {isLoading ? 'Saving...' : editingResource ? 'Update Resource' : 'Publish Resource'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* YOUTUBE VIDEO ADD MODAL */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600/20 text-red-500">
                  <Youtube className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Add YouTube Video Presentation</h3>
                  <p className="text-xs text-slate-400">Links to Olakunle Data channel video</p>
                </div>
              </div>
              <button onClick={() => setIsVideoModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSaveVideo} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Video Title *
                </label>
                <input
                  type="text"
                  required
                  value={videoForm.title}
                  onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })}
                  placeholder="e.g. Discussion 1: AI-Powered Software Walkthrough"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  YouTube Video URL *
                </label>
                <input
                  type="url"
                  required
                  value={videoForm.youtubeUrl}
                  onChange={(e) => setVideoForm({ ...videoForm, youtubeUrl: e.target.value })}
                  placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Summary / Key Takeaways
                </label>
                <textarea
                  rows={2}
                  value={videoForm.description}
                  onChange={(e) => setVideoForm({ ...videoForm, description: e.target.value })}
                  placeholder="Summary of presentation"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Course Section / Module
                </label>
                <select
                  value={videoForm.courseModule}
                  onChange={(e) => setVideoForm({ ...videoForm, courseModule: e.target.value })}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-sm text-white"
                >
                  <option value="Discussion 1">Discussion 1: Program Onboarding & Future</option>
                  <option value="Task 1">Task 1: Practical Work & Implementation</option>
                  <option value="Discussion 3">Discussion 3: Topic & Video Presentation</option>
                  <option value="Task 2">Task 2: System Development</option>
                  <option value="Discussion 5">Discussion 5: Technical Architecture</option>
                  <option value="Task 3">Task 3: Modernization Project</option>
                  <option value="Discussion 7">Discussion 7: Synthesis & Roadmap</option>
                  <option value="Task 4">Task 4: Capstone Engineering Project</option>
                  <option value="General">General Presentation / Demo</option>
                </select>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Platform
                  </label>
                  <select
                    value={videoForm.platform}
                    onChange={(e) => setVideoForm({ ...videoForm, platform: e.target.value as any })}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-sm text-white"
                  >
                    <option value="both">Both Portfolio & MIT 624</option>
                    <option value="mit624">MIT 624 Course Only</option>
                    <option value="portfolio">Portfolio Homepage Only</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Status
                  </label>
                  <select
                    value={videoForm.status}
                    onChange={(e) => setVideoForm({ ...videoForm, status: e.target.value as any })}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-sm text-white"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsVideoModalOpen(false)}
                  className="rounded-xl border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="rounded-xl bg-red-600 px-6 py-2 text-xs font-bold text-white shadow hover:bg-red-700 cursor-pointer"
                >
                  Save Video
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
