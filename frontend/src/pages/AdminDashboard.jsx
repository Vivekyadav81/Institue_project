import React, { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, Layout, Image as ImageIcon, LogOut, Upload, Pencil, BookOpen, Book, User, ChevronDown, CheckCircle2, AlertCircle, LayoutGrid, List, Menu, X, Users, Mail, Calendar, MessageSquare, Phone, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('slides');
  const [slides, setSlides] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [slideTitle, setSlideTitle] = useState('');
  const [slideSubtitle, setSlideSubtitle] = useState('');
  const [slideFile, setSlideFile] = useState(null);
  const [slidePreview, setSlidePreview] = useState(null);
  
  const [galleryCaption, setGalleryCaption] = useState('');
  const [galleryCategory, setGalleryCategory] = useState('');
  const [galleryFile, setGalleryFile] = useState(null);
  const [galleryPreview, setGalleryPreview] = useState(null);

  const [activities, setActivities] = useState([]);
  const [activityCaption, setActivityCaption] = useState('');
  const [activityFile, setActivityFile] = useState(null);
  const [activityPreview, setActivityPreview] = useState(null);
  const activityFileRef = useRef(null);
  
  const [faculty, setFaculty] = useState([]);
  const [facultyName, setFacultyName] = useState('');
  const [facultyQual, setFacultyQual] = useState('');
  const [facultyExp, setFacultyExp] = useState('');
  const [facultyDisplayMode, setFacultyDisplayMode] = useState('cover');
  const [facultyZoom, setFacultyZoom] = useState(1);
  const [facultyOffsetX, setFacultyOffsetX] = useState(0);
  const [facultyOffsetY, setFacultyOffsetY] = useState(0);
  const [facultyFile, setFacultyFile] = useState(null);
  const [facultyPreview, setFacultyPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const [settings, setSettings] = useState({});
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

  const [classesList, setClassesList] = useState([]);
  const [classTitle, setClassTitle] = useState('');
  const [classSubtitle, setClassSubtitle] = useState('');
  const [classDesc, setClassDesc] = useState('');
  const [classIcon, setClassIcon] = useState('BookOpen');
  const [editingClass, setEditingClass] = useState(null); // {id, title, ...}

  const [coursesList, setCoursesList] = useState([]);
  const [courseName, setCourseName] = useState('');
  const [courseLevel, setCourseLevel] = useState('');
  const [courseSubjects, setCourseSubjects] = useState('');
  const [courseDuration, setCourseDuration] = useState('');
  const [courseTiming, setCourseTiming] = useState('');
  const [courseColor, setCourseColor] = useState('blue');
  const [editingCourse, setEditingCourse] = useState(null);
  const [ctaBadge, setCtaBadge] = useState('');
  const [ctaTitle, setCtaTitle] = useState('');
  const [ctaDesc, setCtaDesc] = useState('');
  const [registrations, setRegistrations] = useState([]);
  const [inquiries, setInquiries] = useState([]);

  const [editingFaculty, setEditingFaculty] = useState(null);

  // Edit state for slides
  const [editingSlide, setEditingSlide] = useState(null); // {id, title, subtitle}
  const [editSlideFile, setEditSlideFile] = useState(null);
  const editSlideFileRef = useRef(null);

  // Edit state for gallery
  const [editingGallery, setEditingGallery] = useState(null); // {id, caption, category, image_url}
  const [editGalleryFile, setEditGalleryFile] = useState(null);
  const editGalleryFileRef = useRef(null);

  // Edit state for activities
  const [editingActivity, setEditingActivity] = useState(null); // {id, caption, image_url}
  const [editActivityFile, setEditActivityFile] = useState(null);
  const editActivityFileRef = useRef(null);

  const slideFileRef = useRef(null);
  const galleryFileRef = useRef(null);
  const facultyFileRef = useRef(null);
  const logoFileRef = useRef(null);
  const profileRef = useRef(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [courseViewMode, setCourseViewMode] = useState('grid');
  const [classesViewMode, setClassesViewMode] = useState('grid');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [confirmModal, setConfirmModal] = useState({ show: false, message: '', title: 'Confirm', confirmLabel: 'Confirm', onConfirm: null });
  const navigate = useNavigate();

  const showNotification = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
  };
  
  const requestConfirm = (message, action, title = 'Confirm Delete', label = 'Delete') => {
    setConfirmModal({
      show: true,
      message,
      title,
      confirmLabel: label,
      onConfirm: () => {
        action();
        setConfirmModal({ show: false, message: '', title: 'Confirm', confirmLabel: 'Confirm', onConfirm: null });
      }
    });
  };

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!localStorage.getItem('adminToken')) {
      navigate('/admin/login');
    }
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    const token = localStorage.getItem('adminToken');
    const headers = { 'Authorization': `Bearer ${token}` };
    try {
      const sRes = await fetch('/api/slides', { headers });
      const sData = await sRes.json();
      if (Array.isArray(sData)) setSlides(sData);

      const gRes = await fetch('/api/gallery', { headers });
      const gData = await gRes.json();
      if (Array.isArray(gData)) setGallery(gData);

      const fRes = await fetch('/api/faculty', { headers });
      const fData = await fRes.json();
      if (Array.isArray(fData)) setFaculty(fData);

      const aRes = await fetch('/api/activities', { headers });
      const aData = await aRes.json();
      if (Array.isArray(aData)) setActivities(aData);

      const setRes = await fetch('/api/settings', { headers });
      const setData = await setRes.json();
      if (setData && !setData.message) {
        setSettings(setData);
        setCtaBadge(setData.cta_badge || '');
        setCtaTitle(setData.cta_title || '');
        setCtaDesc(setData.cta_description || '');
      }

      const cRes = await fetch('/api/classes', { headers });
      const cData = await cRes.json();
      if (Array.isArray(cData)) setClassesList(cData);

      const coRes = await fetch('/api/courses', { headers });
      const coData = await coRes.json();
      if (Array.isArray(coData)) setCoursesList(coData);

      const regRes = await fetch('/api/register', { headers });
      const regData = await regRes.json();
      if (Array.isArray(regData)) setRegistrations(regData);

      const inqRes = await fetch('/api/inquiry', { headers });
      const inqData = await inqRes.json();
      if (Array.isArray(inqData)) setInquiries(inqData);
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const handleSlideFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (slidePreview) URL.revokeObjectURL(slidePreview);
      setSlideFile(file);
      setSlidePreview(URL.createObjectURL(file));
    }
  };

  const handleGalleryFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (galleryPreview) URL.revokeObjectURL(galleryPreview);
      setGalleryFile(file);
      setGalleryPreview(URL.createObjectURL(file));
    }
  };

  const handleFacultyFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (facultyPreview && typeof facultyPreview === 'string' && facultyPreview.startsWith('blob:')) {
        URL.revokeObjectURL(facultyPreview);
      }
      setFacultyFile(file);
      setFacultyPreview(URL.createObjectURL(file));
    }
  };

  const handleLogoFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (logoPreview) URL.revokeObjectURL(logoPreview);
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const addSlide = async (e) => {
    e.preventDefault();
    if (!slideFile) return showNotification('Please select an image file', 'error');
    const formData = new FormData();
    formData.append('image', slideFile);
    formData.append('title', slideTitle);
    formData.append('subtitle', slideSubtitle);
    try {
      const res = await fetch('/api/slides', { method: 'POST', body: formData });
      if (res.ok) {
        showNotification('Slide added successfully!');
        setSlideTitle(''); setSlideSubtitle(''); setSlideFile(null); setSlidePreview(null);
        if (slideFileRef.current) slideFileRef.current.value = '';
        fetchData();
      } else {
        showNotification('Failed to add slide', 'error');
      }
    } catch (err) { 
      showNotification('Connection error', 'error');
    }
  };

  const deleteSlide = (id) => {
    requestConfirm('Delete this slide?', async () => {
      try {
        const res = await fetch(`/api/slides/${id}`, { method: 'DELETE' });
        if (res.ok) {
          showNotification('Slide deleted');
          fetchData();
        } else {
          showNotification('Failed to delete slide', 'error');
        }
      } catch (err) { showNotification('Connection error', 'error'); }
    });
  };

  const addGalleryImage = async (e) => {
    e.preventDefault();
    if (!galleryFile) return showNotification('Please select an image file', 'error');
    const formData = new FormData();
    formData.append('image', galleryFile);
    formData.append('caption', galleryCaption);
    formData.append('category', galleryCategory);
    try {
      const res = await fetch('/api/gallery', { method: 'POST', body: formData });
      if (res.ok) {
        showNotification('Image added to gallery!');
        setGalleryCaption(''); setGalleryCategory(''); setGalleryFile(null); setGalleryPreview(null);
        if (galleryFileRef.current) galleryFileRef.current.value = '';
        fetchData();
      } else {
        showNotification('Failed to add image', 'error');
      }
    } catch (err) { showNotification('Connection error', 'error'); }
  };

  const deleteGalleryImage = (id) => {
    requestConfirm('Delete this image?', async () => {
      try {
        const res = await fetch(`/api/gallery/${id}`, { method: 'DELETE' });
        if (res.ok) {
          showNotification('Image removed from gallery');
          fetchData();
        } else {
          showNotification('Failed to delete image', 'error');
        }
      } catch (err) { showNotification('Connection error', 'error'); }
    });
  };

  const updateSlide = async (e) => {
    e.preventDefault();
    if (!editingSlide) return;
    const formData = new FormData();
    formData.append('title', editingSlide.title);
    formData.append('subtitle', editingSlide.subtitle);
    if (editSlideFile) formData.append('image', editSlideFile);
    try {
      const res = await fetch(`/api/slides/${editingSlide.id}`, { method: 'PUT', body: formData });
      if (res.ok) {
        showNotification('Slide updated!');
        setEditingSlide(null); setEditSlideFile(null);
        if (editSlideFileRef.current) editSlideFileRef.current.value = '';
        fetchData();
      } else {
        showNotification('Update failed', 'error');
      }
    } catch (err) { showNotification('Connection error', 'error'); }
  };

  const updateGalleryImage = async (e) => {
    e.preventDefault();
    if (!editingGallery) return;
    const formData = new FormData();
    formData.append('caption', editingGallery.caption);
    formData.append('category', editingGallery.category);
    if (editGalleryFile) formData.append('image', editGalleryFile);
    try {
      const res = await fetch(`/api/gallery/${editingGallery.id}`, { method: 'PUT', body: formData });
      if (res.ok) {
        showNotification('Gallery image updated!');
        setEditingGallery(null); setEditGalleryFile(null);
        if (editGalleryFileRef.current) editGalleryFileRef.current.value = '';
        fetchData();
      } else {
        showNotification('Update failed', 'error');
      }
    } catch (err) { showNotification('Connection error', 'error'); }
  };

  const updateActivity = async (e) => {
    e.preventDefault();
    if (!editingActivity) return;
    const formData = new FormData();
    formData.append('caption', editingActivity.caption);
    if (editActivityFile) formData.append('image', editActivityFile);
    try {
      const res = await fetch(`/api/activities/${editingActivity.id}`, { method: 'PUT', body: formData });
      if (res.ok) {
        showNotification('Activity updated!');
        setEditingActivity(null); setEditActivityFile(null);
        if (editActivityFileRef.current) editActivityFileRef.current.value = '';
        fetchData();
      } else {
        showNotification('Update failed', 'error');
      }
    } catch (err) { showNotification('Connection error', 'error'); }
  };

  const addActivity = async (e) => {
    e.preventDefault();
    if (!activityFile) return showNotification('Please select an image file', 'error');
    const formData = new FormData();
    formData.append('image', activityFile);
    formData.append('caption', activityCaption);
    try {
      const res = await fetch('/api/activities', { method: 'POST', body: formData });
      if (res.ok) {
        showNotification('Activity added!');
        setActivityCaption(''); setActivityFile(null); setActivityPreview(null);
        if (activityFileRef.current) activityFileRef.current.value = '';
        fetchData();
      } else {
        const err = await res.json().catch(() => ({}));
        showNotification(err.message || 'Upload failed', 'error');
      }
    } catch (err) {
      showNotification('Connection error', 'error');
    }
  };


  const deleteActivity = (id) => {
    requestConfirm('Delete this activity image?', async () => {
      try {
        const res = await fetch(`/api/activities/${id}`, { method: 'DELETE' });
        if (res.ok) {
          showNotification('Activity deleted');
          fetchData();
        } else {
          showNotification('Delete failed', 'error');
        }
      } catch (err) { showNotification('Connection error', 'error'); }
    });
  };

  const handleSubmitFaculty = async (e) => {
    e.preventDefault();
    if (!facultyName) return showNotification('Name is required', 'error');
    const formData = new FormData();
    if (facultyFile) formData.append('image', facultyFile);
    formData.append('name', facultyName);
    formData.append('qualification', facultyQual);
    formData.append('experience', facultyExp);
    formData.append('display_mode', facultyDisplayMode);
    formData.append('zoom', facultyZoom);
    formData.append('offset_x', facultyOffsetX);
    formData.append('offset_y', facultyOffsetY);

    const url = editingFaculty 
      ? `/api/faculty/${editingFaculty}` 
      : '/api/faculty';
    const method = editingFaculty ? 'PUT' : 'POST';

    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(url, { 
        method, 
        body: formData,
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Action failed (Check DB connection)');
      
      showNotification(editingFaculty ? 'Member updated!' : 'Member added!');
      setFacultyName(''); setFacultyQual(''); setFacultyExp(''); setFacultyDisplayMode('cover'); 
      setFacultyZoom(1); setFacultyOffsetX(0); setFacultyOffsetY(0);
      setFacultyFile(null); setFacultyPreview(null);
      setEditingFaculty(null);
      if (facultyFileRef.current) facultyFileRef.current.value = '';
      fetchData();
    } catch (err) { 
      showNotification(err.message || 'Operation failed', 'error');
    }
  };

  const startEditFaculty = (member) => {
    setEditingFaculty(member.id);
    setFacultyName(member.name);
    setFacultyQual(member.qualification);
    setFacultyExp(member.experience);
    setFacultyDisplayMode(member.display_mode || 'cover');
    setFacultyZoom(member.zoom || 1);
    setFacultyOffsetX(member.offset_x || 0);
    setFacultyOffsetY(member.offset_y || 0);
    setFacultyPreview(member.image);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteFaculty = (id) => {
    requestConfirm('Delete this faculty member?', async () => {
      try {
        const res = await fetch(`/api/faculty/${id}`, { 
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
        });
        if (res.ok) {
          showNotification('Faculty member deleted');
          fetchData();
        } else {
          showNotification('Failed to delete member', 'error');
        }
      } catch (err) { 
        showNotification('Connection error', 'error');
      }
    });
  };

  const handleDragStart = (e) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleDragMove = (e) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    
    // Sensitivity adjustment based on zoom
    const sensitivity = 0.5 / facultyZoom;
    setFacultyOffsetX(prev => prev + dx * sensitivity);
    setFacultyOffsetY(prev => prev + dy * sensitivity);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleDragEnd = () => setIsDragging(false);

  const updateLogo = async (e) => {
    e.preventDefault();
    if (!logoFile) return showNotification('Please select a logo file', 'error');
    const formData = new FormData();
    formData.append('logo', logoFile);
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch('/api/settings/logo', { 
        method: 'POST', 
        body: formData,
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        showNotification('Logo updated successfully!');
        setLogoFile(null); setLogoPreview(null);
        if (logoFileRef.current) logoFileRef.current.value = '';
        fetchData();
      } else {
        showNotification('Logo update failed', 'error');
      }
    } catch (err) { showNotification('Connection error', 'error'); }
  };

  const updateCtaSettings = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          settings: {
            cta_badge: ctaBadge,
            cta_title: ctaTitle,
            cta_description: ctaDesc
          }
        })
      });
      if (res.ok) {
        showNotification('CTA settings updated successfully!');
        fetchData();
      } else {
        showNotification('Failed to update CTA settings', 'error');
      }
    } catch (err) { showNotification('Connection error', 'error'); }
  };

  const addClass = async (e) => {
    e.preventDefault();
    if (!classTitle) return showNotification('Title is required', 'error');
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch('/api/classes', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title: classTitle, subtitle: classSubtitle, description: classDesc, icon: classIcon })
      });
      if (res.ok) {
        showNotification('Class added!');
        setClassTitle(''); setClassSubtitle(''); setClassDesc(''); setClassIcon('BookOpen');
        fetchData();
      } else {
        showNotification('Failed to add class', 'error');
      }
    } catch (err) { showNotification('Connection error', 'error'); }
  };

  const deleteClass = (id) => {
    requestConfirm('Delete this class?', async () => {
      const token = localStorage.getItem('adminToken');
      try {
        const res = await fetch(`/api/classes/${id}`, { 
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          showNotification('Class deleted');
          fetchData();
        } else {
          showNotification('Delete failed', 'error');
        }
      } catch (err) { showNotification('Connection error', 'error'); }
    });
  };

  const updateClass = async (e) => {
    e.preventDefault();
    if (!editingClass) return;
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`/api/classes/${editingClass.id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editingClass)
      });
      if (res.ok) {
        showNotification('Class updated!');
        setEditingClass(null);
        fetchData();
      } else {
        showNotification('Update failed', 'error');
      }
    } catch (err) { showNotification('Connection error', 'error'); }
  };

  const addCourse = async (e) => {
    e.preventDefault();
    if (!courseName) return showNotification('Name is required', 'error');
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch('/api/courses', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: courseName, class_level: courseLevel, subjects: courseSubjects, duration: courseDuration, timing: courseTiming, color: courseColor })
      });
      if (res.ok) {
        showNotification('Course added!');
        setCourseName(''); setCourseLevel(''); setCourseSubjects(''); setCourseDuration(''); setCourseTiming(''); setCourseColor('blue');
        fetchData();
      } else {
        showNotification('Failed to add course', 'error');
      }
    } catch (err) { showNotification('Connection error', 'error'); }
  };

  const deleteCourse = (id) => {
    requestConfirm('Delete this course?', async () => {
      const token = localStorage.getItem('adminToken');
      try {
        const res = await fetch(`/api/courses/${id}`, { 
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          showNotification('Course deleted');
          fetchData();
        } else {
          showNotification('Delete failed', 'error');
        }
      } catch (err) { showNotification('Connection error', 'error'); }
    });
  };

  const deleteRegistration = (id) => {
    requestConfirm('Delete this registration?', async () => {
      const token = localStorage.getItem('adminToken');
      try {
        const res = await fetch(`/api/register/${id}`, { 
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          showNotification('Registration deleted');
          fetchData();
        } else {
          showNotification('Delete failed', 'error');
        }
      } catch (err) { showNotification('Connection error', 'error'); }
    });
  };

  const deleteInquiry = (id) => {
    requestConfirm('Delete this inquiry?', async () => {
      const token = localStorage.getItem('adminToken');
      try {
        const res = await fetch(`/api/inquiry/${id}`, { 
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          showNotification('Inquiry deleted');
          fetchData();
        } else {
          showNotification('Delete failed', 'error');
        }
      } catch (err) { showNotification('Connection error', 'error'); }
    });
  };

  const updateCourse = async (e) => {
    e.preventDefault();
    if (!editingCourse) return;
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`/api/courses/${editingCourse.id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editingCourse)
      });
      if (res.ok) {
        showNotification('Course updated!');
        setEditingCourse(null);
        fetchData();
      } else {
        showNotification('Update failed', 'error');
      }
    } catch (err) { showNotification('Connection error', 'error'); }
  };

  return (
    <div className="h-screen bg-slate-50 flex overflow-hidden">
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/80 z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 bottom-0 w-72 bg-slate-900 text-white flex flex-col z-50 transition-transform duration-300 md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="relative flex flex-col items-center justify-center border-b border-white/5 pt-2 pb-14 px-2 overflow-hidden mb-2">
          <img 
            src={settings.logo_url || '/logo-transparent.png'} 
            alt="xyz Classes" 
            className="w-full max-w-[240px] h-auto object-contain drop-shadow-2xl transition-transform hover:scale-105 -mt-6" 
          />
          
          <div className="absolute left-6 bottom-4 z-10">
            <span className="text-xl md:text-2xl font-black tracking-tighter uppercase italic text-white/90 drop-shadow-md">Admin<span className="text-red-500">Pro</span></span>
          </div>

          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden absolute right-4 top-4 p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 z-20"
          >
            <X size={20} />
          </button>
        </div>
        <nav className="flex-grow p-4 space-y-2 mt-4 overflow-y-auto custom-scrollbar">
          <button 
            onClick={() => { setActiveTab('slides'); setIsSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-6 py-4 rounded-xl transition-all ${activeTab === 'slides' ? 'bg-red-600 shadow-lg shadow-red-600/20' : 'hover:bg-slate-800/50'}`}
          >
            <Layout size={20} /> Manage Slides
          </button>
          <button 
            onClick={() => { setActiveTab('gallery'); setIsSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-6 py-4 rounded-xl transition-all ${activeTab === 'gallery' ? 'bg-red-600 shadow-lg shadow-red-600/20' : 'hover:bg-slate-800/50'}`}
          >
            <ImageIcon size={20} /> Manage Gallery
          </button>
          <button 
            onClick={() => { setActiveTab('activities'); setIsSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-6 py-4 rounded-xl transition-all ${activeTab === 'activities' ? 'bg-red-600 shadow-lg shadow-red-600/20' : 'hover:bg-slate-800/50'}`}
          >
            <ImageIcon size={20} /> Activities
          </button>
          <button 
            onClick={() => { setActiveTab('faculty'); setIsSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-6 py-4 rounded-xl transition-all ${activeTab === 'faculty' ? 'bg-red-600 shadow-lg shadow-red-600/20' : 'hover:bg-slate-800/50'}`}
          >
            <Layout size={20} /> Manage Faculty
          </button>
          <button 
            onClick={() => { setActiveTab('classes'); setIsSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-6 py-4 rounded-xl transition-all ${activeTab === 'classes' ? 'bg-red-600 shadow-lg shadow-red-600/20' : 'hover:bg-slate-800/50'}`}
          >
            <BookOpen size={20} /> Classes Offered
          </button>
          <button 
            onClick={() => { setActiveTab('courses'); setIsSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-6 py-4 rounded-xl transition-all ${activeTab === 'courses' ? 'bg-red-600 shadow-lg shadow-red-600/20' : 'hover:bg-slate-800/50'}`}
          >
            <Book size={20} /> Manage Courses
          </button>
          <button 
            onClick={() => { setActiveTab('registrations'); setIsSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-6 py-4 rounded-xl transition-all ${activeTab === 'registrations' ? 'bg-red-600 shadow-lg shadow-red-600/20' : 'hover:bg-slate-800/50'}`}
          >
            <Users size={20} /> Registrations
          </button>
          <button 
            onClick={() => { setActiveTab('inquiries'); setIsSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-6 py-4 rounded-xl transition-all ${activeTab === 'inquiries' ? 'bg-red-600 shadow-lg shadow-red-600/20' : 'hover:bg-slate-800/50'}`}
          >
            <Mail size={20} /> Inquiries
          </button>
          <button 
            onClick={() => { setActiveTab('settings'); setIsSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-6 py-4 rounded-xl transition-all ${activeTab === 'settings' ? 'bg-red-600 shadow-lg shadow-red-600/20' : 'hover:bg-slate-800/50'}`}
          >
            <Layout size={20} /> Site Settings
          </button>
        </nav>
      </aside>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.9 }}
            className={`fixed bottom-10 right-10 px-6 py-4 rounded-2xl shadow-2xl font-bold flex items-center gap-3 z-[100] border-l-8 ${
              toast.type === 'error' 
                ? 'bg-white text-red-600 border-red-500' 
                : 'bg-white text-emerald-600 border-emerald-500'
            }`}
          >
            {toast.type === 'error' ? (
              <AlertCircle size={24} className="text-red-500" />
            ) : (
              <CheckCircle2 size={24} className="text-emerald-500" />
            )}
            <div className="flex flex-col">
              <span className="text-xs uppercase tracking-widest text-slate-400 font-black">{toast.type === 'error' ? 'Error' : 'Success'}</span>
              <span className="text-slate-900">{toast.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-grow ml-0 md:ml-72 p-4 md:p-10 overflow-y-auto relative">
        {/* Top Header with Profile */}
        <div className="flex justify-between items-center mb-6 sticky top-0 z-30 bg-transparent py-2 -mx-4 px-4 md:mx-0 md:px-0 rounded-b-2xl md:rounded-none">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="md:hidden p-3 bg-white border border-slate-100 rounded-xl shadow-sm active:scale-95 transition-all text-slate-600"
          >
            <Menu size={24} />
          </button>
          <div className="relative ml-auto" ref={profileRef}>
            <button 
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="flex items-center gap-3 bg-white border border-slate-100 p-2 pr-4 rounded-2xl shadow-sm hover:shadow-md transition-all group"
            >
              <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white group-hover:bg-red-600 transition-colors">
                <User size={20} />
              </div>
              <div className="text-left hidden md:block">
                <p className="text-sm font-black text-slate-900 uppercase tracking-wide">Administrator</p>
              </div>
              <ChevronDown size={16} className={`text-slate-400 transition-transform ${showProfileDropdown ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {showProfileDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 z-50 overflow-hidden"
                >
                  <div className="px-4 py-3 mb-2 border-b border-slate-50">
                    <p className="text-xs font-medium text-slate-400">Signed in as</p>
                    <p className="text-sm font-bold text-slate-900 truncate">info@mastermindclassesmbd.com</p>
                  </div>
                  <button 
                    onClick={() => requestConfirm('Are you sure you want to end your session?', handleLogout, 'Confirm Logout', 'Logout')}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 font-bold hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={18} /> Logout Session
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {activeTab === 'slides' ? (
          <div>
            <div className="flex justify-between items-center mb-10">
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">Image Slider</h1>
              <span className="bg-sky-100 text-sky-700 px-4 py-2 rounded-full text-sm font-bold">{slides.length} Slides Active</span>
            </div>

            {/* Add Slide Form */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 mb-10">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Plus className="text-red-600" /> Add New Slide
              </h2>
              <form onSubmit={addSlide} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="text" placeholder="Title" value={slideTitle} onChange={e => setSlideTitle(e.target.value)}
                    className="bg-slate-50 border border-slate-200 p-4 rounded-xl outline-none focus:ring-2 focus:ring-red-600" />
                  <input type="text" placeholder="Subtitle" value={slideSubtitle} onChange={e => setSlideSubtitle(e.target.value)}
                    className="bg-slate-50 border border-slate-200 p-4 rounded-xl outline-none focus:ring-2 focus:ring-red-600" />
                </div>
                <div className="flex flex-col md:flex-row items-center gap-4">
                  <label className="flex-grow cursor-pointer w-full">
                    <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${slidePreview ? 'border-green-400 bg-green-50' : 'border-slate-300 hover:border-red-400 hover:bg-red-50'}`}>
                      <Upload className="mx-auto mb-2 text-slate-400" size={32} />
                      <p className="text-sm font-bold text-slate-600">{slideFile ? slideFile.name : 'Click to choose image from device'}</p>
                      <p className="text-xs text-slate-400 mt-1">JPG, PNG, WEBP supported</p>
                    </div>
                    <input type="file" accept="image/*" onChange={handleSlideFileChange} ref={slideFileRef} className="hidden" />
                  </label>
                  {slidePreview && <img src={slidePreview} alt="Preview" className="w-32 h-20 object-cover rounded-xl border-2 border-green-400" />}
                  <button type="submit" className="w-full md:w-auto md:flex-1 bg-slate-900 text-white font-bold rounded-xl hover:bg-black transition-all px-8 py-4 whitespace-nowrap">Add Slide</button>
                </div>
              </form>
            </div>

            {/* Slides List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array.isArray(slides) && slides.map(slide => (
                <div key={slide.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100">
                  <div className="h-48 relative overflow-hidden">
                    <img src={editingSlide?.id === slide.id && editSlideFile ? URL.createObjectURL(editSlideFile) : slide.image_url} className="w-full h-full object-cover" alt="" />
                    <div className="absolute top-4 right-4 flex gap-2">
                      <button onClick={() => setEditingSlide(editingSlide?.id === slide.id ? null : { id: slide.id, title: slide.title || '', subtitle: slide.subtitle || '' })}
                        className="bg-amber-500 text-white p-2.5 rounded-xl shadow-lg hover:bg-amber-600 transition-colors">
                        <Pencil size={18} />
                      </button>
                      <button onClick={() => deleteSlide(slide.id)} className="bg-red-600 text-white p-2.5 rounded-xl shadow-lg hover:bg-red-700 transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  {editingSlide?.id === slide.id ? (
                    <form onSubmit={updateSlide} className="p-5 space-y-3 border-t border-slate-100 bg-amber-50">
                      <input type="text" placeholder="Title" value={editingSlide.title}
                        onChange={e => setEditingSlide(s => ({ ...s, title: e.target.value }))}
                        className="w-full bg-white border border-slate-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-amber-400 text-sm" />
                      <input type="text" placeholder="Subtitle" value={editingSlide.subtitle}
                        onChange={e => setEditingSlide(s => ({ ...s, subtitle: e.target.value }))}
                        className="w-full bg-white border border-slate-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-amber-400 text-sm" />
                      <label className="block cursor-pointer">
                        <div className="border border-dashed border-slate-300 rounded-xl p-3 text-center text-xs text-slate-500 hover:border-amber-400 hover:bg-amber-50 transition-all">
                          {editSlideFile ? editSlideFile.name : '📷 Replace image (optional)'}
                        </div>
                        <input type="file" accept="image/*" ref={editSlideFileRef} onChange={e => setEditSlideFile(e.target.files[0] || null)} className="hidden" />
                      </label>
                      <div className="flex gap-2">
                        <button type="submit" className="flex-1 bg-amber-500 text-white font-bold rounded-xl py-2.5 text-sm hover:bg-amber-600 transition-colors">Save Changes</button>
                        <button type="button" onClick={() => { setEditingSlide(null); setEditSlideFile(null); }} className="flex-1 bg-slate-200 text-slate-700 font-bold rounded-xl py-2.5 text-sm hover:bg-slate-300 transition-colors">Cancel</button>
                      </div>
                    </form>
                  ) : (
                    <div className="p-6">
                      <h3 className="font-bold text-lg text-slate-900">{slide.title || 'Untitled Slide'}</h3>
                      <p className="text-slate-500 text-sm mt-2">{slide.subtitle || 'No subtitle'}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : activeTab === 'gallery' ? (
          <div>
            <div className="flex justify-between items-center mb-10">
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">Photo Gallery</h1>
              <span className="bg-amber-100 text-amber-700 px-4 py-2 rounded-full text-sm font-bold">{gallery.length} Images</span>
            </div>

            {/* Add Gallery Form */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 mb-10">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Plus className="text-red-600" /> Upload Media
              </h2>
              <form onSubmit={addGalleryImage} className="space-y-4">
                <div className="flex flex-col md:flex-row items-center gap-4">
                  <label className="flex-grow cursor-pointer w-full">
                    <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${galleryPreview ? 'border-green-400 bg-green-50' : 'border-slate-300 hover:border-red-400 hover:bg-red-50'}`}>
                      <Upload className="mx-auto mb-2 text-slate-400" size={32} />
                      <p className="text-sm font-bold text-slate-600">{galleryFile ? galleryFile.name : 'Click to choose media from device'}</p>
                      <p className="text-xs text-slate-400 mt-1">JPG, PNG, MP4, WEBM supported</p>
                    </div>
                    <input type="file" accept="image/*,video/*" onChange={handleGalleryFileChange} ref={galleryFileRef} className="hidden" />
                  </label>
                  {galleryPreview && (
                    galleryFile?.type.startsWith('video/') ? (
                      <video src={galleryPreview} className="w-40 h-28 object-cover rounded-xl border-2 border-green-400 shadow-sm" muted playsInline />
                    ) : (
                      <img src={galleryPreview} alt="Preview" className="w-40 h-28 object-cover rounded-xl border-2 border-green-400 shadow-sm" />
                    )
                  )}
                  <button type="submit" className="bg-slate-900 text-white font-bold rounded-xl hover:bg-black transition-all px-8 py-6 whitespace-nowrap w-full md:w-auto h-full">Upload Media</button>
                </div>
              </form>
            </div>

            {/* Gallery List */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {Array.isArray(gallery) && gallery.map(item => (
                <div key={item.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100 group">
                  <div className="relative">
                    {(editingGallery?.id === item.id && editGalleryFile) ? (
                      editGalleryFile.type.startsWith('video/') ? (
                        <video src={URL.createObjectURL(editGalleryFile)} className="w-full aspect-square object-cover" muted playsInline />
                      ) : (
                        <img src={URL.createObjectURL(editGalleryFile)} className="w-full aspect-square object-cover" alt="Preview" />
                      )
                    ) : (
                      item.media_type === 'video' ? (
                        <video src={item.image_url} className="w-full aspect-square object-cover" muted playsInline />
                      ) : (
                        <img src={item.image_url} className="w-full aspect-square object-cover" alt="Gallery item" />
                      )
                    )}
                    <div className="absolute top-2 right-2 flex gap-1.5 opacity-100 transition-opacity">
                      <button onClick={() => setEditingGallery(editingGallery?.id === item.id ? null : { id: item.id, caption: item.caption || '', category: item.category || '', image_url: item.image_url })}
                        className="bg-amber-500 text-white p-1.5 rounded-lg hover:bg-amber-600 transition-colors">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => deleteGalleryImage(item.id)} className="bg-red-600/90 text-white p-1.5 rounded-lg hover:bg-red-700 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  {editingGallery?.id === item.id && (
                    <form onSubmit={updateGalleryImage} className="p-3 space-y-2 bg-amber-50 border-t border-slate-100">
                      <input type="text" placeholder="Caption" value={editingGallery.caption}
                        onChange={e => setEditingGallery(g => ({ ...g, caption: e.target.value }))}
                        className="w-full bg-white border border-slate-200 p-2 rounded-lg outline-none text-xs focus:ring-2 focus:ring-amber-400" />
                      <input type="text" placeholder="Category" value={editingGallery.category}
                        onChange={e => setEditingGallery(g => ({ ...g, category: e.target.value }))}
                        className="w-full bg-white border border-slate-200 p-2 rounded-lg outline-none text-xs focus:ring-2 focus:ring-amber-400" />
                      <label className="block cursor-pointer">
                        <div className="border border-dashed border-slate-300 rounded-lg p-2 text-center text-xs text-slate-500 hover:border-amber-400 transition-all">
                          {editGalleryFile ? editGalleryFile.name : '📷 Replace media (optional)'}
                        </div>
                        <input type="file" accept="image/*,video/*" ref={editGalleryFileRef} onChange={e => setEditGalleryFile(e.target.files[0] || null)} className="hidden" />
                      </label>
                      <div className="flex gap-1.5">
                        <button type="submit" className="flex-1 bg-amber-500 text-white font-bold rounded-lg py-1.5 text-xs hover:bg-amber-600">Save</button>
                        <button type="button" onClick={() => { setEditingGallery(null); setEditGalleryFile(null); }} className="flex-1 bg-slate-200 text-slate-700 font-bold rounded-lg py-1.5 text-xs hover:bg-slate-300">Cancel</button>
                      </div>
                    </form>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : activeTab === 'activities' ? (
          <div>
            <div className="flex justify-between items-center mb-10">
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">Activities</h1>
              <span className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-bold">{activities.length} Images</span>
            </div>

            {/* Add Activity Form */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 mb-10">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Plus className="text-red-600" /> Upload Activity Photo
              </h2>
              <form onSubmit={addActivity} className="space-y-4">
                <input
                  type="text"
                  placeholder="Event Label e.g. Annual Day, Science Fair (optional)"
                  value={activityCaption}
                  onChange={e => setActivityCaption(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl outline-none focus:ring-2 focus:ring-red-600"
                />
                <div className="flex flex-col md:flex-row items-center gap-4">
                  <label className="flex-grow cursor-pointer w-full">
                    <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${activityPreview ? 'border-green-400 bg-green-50' : 'border-slate-300 hover:border-red-400 hover:bg-red-50'}`}>
                      <Upload className="mx-auto mb-2 text-slate-400" size={32} />
                      <p className="text-sm font-bold text-slate-600">{activityFile ? activityFile.name : 'Click to choose image from device'}</p>
                      <p className="text-xs text-slate-400 mt-1">JPG, PNG, WEBP supported</p>
                    </div>
                    <input type="file" accept="image/*" onChange={e => { const f = e.target.files[0]; if(f){ setActivityFile(f); setActivityPreview(URL.createObjectURL(f)); } }} ref={activityFileRef} className="hidden" />
                  </label>
                  {activityPreview && <img src={activityPreview} alt="Preview" className="w-40 h-28 object-cover rounded-xl border-2 border-green-400 shadow-sm" />}
                  <button type="submit" className="bg-slate-900 text-white font-bold rounded-xl hover:bg-black transition-all px-8 py-6 whitespace-nowrap w-full md:w-auto h-full">Upload Photo</button>
                </div>
              </form>
            </div>

            {/* Activities Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {Array.isArray(activities) && activities.map(item => (
                <div key={item.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100 group">
                  <div className="relative">
                    <img src={editingActivity?.id === item.id && editActivityFile ? URL.createObjectURL(editActivityFile) : item.image_url} className="w-full aspect-square object-cover" alt={item.caption || 'Activity'} />
                    <div className="absolute top-2 right-2 flex gap-1.5 opacity-100 transition-opacity">
                      <button onClick={() => setEditingActivity(editingActivity?.id === item.id ? null : { id: item.id, caption: item.caption || '', image_url: item.image_url })}
                        className="bg-amber-500 text-white p-1.5 rounded-lg hover:bg-amber-600 transition-colors">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => deleteActivity(item.id)} className="bg-red-600/90 text-white p-1.5 rounded-lg hover:bg-red-700 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  {item.caption && !editingActivity?.id === item.id && (
                    <p className="px-2 py-1.5 text-xs font-semibold text-slate-600 truncate">{item.caption}</p>
                  )}
                  {editingActivity?.id === item.id && (
                    <form onSubmit={updateActivity} className="p-3 space-y-2 bg-amber-50 border-t border-slate-100">
                      <input type="text" placeholder="Event Label" value={editingActivity.caption}
                        onChange={e => setEditingActivity(a => ({ ...a, caption: e.target.value }))}
                        className="w-full bg-white border border-slate-200 p-2 rounded-lg outline-none text-xs focus:ring-2 focus:ring-amber-400" />
                      <label className="block cursor-pointer">
                        <div className="border border-dashed border-slate-300 rounded-lg p-2 text-center text-xs text-slate-500 hover:border-amber-400 transition-all">
                          {editActivityFile ? editActivityFile.name : '📷 Replace image (optional)'}
                        </div>
                        <input type="file" accept="image/*" ref={editActivityFileRef} onChange={e => setEditActivityFile(e.target.files[0] || null)} className="hidden" />
                      </label>
                      <div className="flex gap-1.5">
                        <button type="submit" className="flex-1 bg-amber-500 text-white font-bold rounded-lg py-1.5 text-xs hover:bg-amber-600">Save</button>
                        <button type="button" onClick={() => { setEditingActivity(null); setEditActivityFile(null); }} className="flex-1 bg-slate-200 text-slate-700 font-bold rounded-lg py-1.5 text-xs hover:bg-slate-300">Cancel</button>
                      </div>
                    </form>
                  )}
                </div>
              ))}

            </div>
          </div>
        ) : activeTab === 'faculty' ? (
          <div>
            <div className="flex justify-between items-center mb-10">
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">Faculty Management</h1>
              <span className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-bold">{faculty.length} Members</span>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 mb-10">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Plus className="text-red-600" /> {editingFaculty ? 'Edit Faculty Member' : 'Add Faculty Member'}
              </h2>
              <form onSubmit={handleSubmitFaculty} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <input type="text" placeholder="Name" value={facultyName} onChange={e => setFacultyName(e.target.value)} required
                    className="bg-slate-50 border border-slate-200 p-4 rounded-xl outline-none focus:ring-2 focus:ring-red-600" />
                  <input type="text" placeholder="Qualification" value={facultyQual} onChange={e => setFacultyQual(e.target.value)}
                    className="bg-slate-50 border border-slate-200 p-4 rounded-xl outline-none focus:ring-2 focus:ring-red-600" />
                  <input type="text" placeholder="Experience" value={facultyExp} onChange={e => setFacultyExp(e.target.value)}
                    className="bg-slate-50 border border-slate-200 p-4 rounded-xl outline-none focus:ring-2 focus:ring-red-600" />
                  <div className="flex flex-col">
                    <label className="text-xs font-bold text-slate-400 mb-1 ml-1 uppercase tracking-wider">Image Fit</label>
                    <select 
                      value={facultyDisplayMode} 
                      onChange={e => setFacultyDisplayMode(e.target.value)}
                      className="bg-slate-50 border border-slate-200 p-4 rounded-xl outline-none focus:ring-2 focus:ring-red-600 appearance-none cursor-pointer"
                    >
                      <option value="cover">Cover (Fill & Crop)</option>
                      <option value="contain">Contain (Full Image)</option>
                    </select>
                  </div>
                </div>

                {facultyPreview && (
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-slate-700">Image Adjustment</h3>
                      <button type="button" onClick={() => { setFacultyZoom(1); setFacultyOffsetX(0); setFacultyOffsetY(0); }} 
                        className="text-xs font-bold text-red-600 hover:text-red-700 uppercase">Reset</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-bold text-slate-500 uppercase">
                          <span>Zoom Level</span>
                          <span>{facultyZoom.toFixed(1)}x</span>
                        </div>
                        <input type="range" min="1" max="5" step="0.1" value={facultyZoom} onChange={e => setFacultyZoom(parseFloat(e.target.value))} 
                          className="w-full accent-red-600 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer" />
                        <p className="text-[10px] text-slate-400 font-medium italic">Tip: Drag the image in the preview box to move it.</p>
                      </div>
                      <div className="flex flex-col sm:flex-row items-center gap-6">
                        <div 
                          className={`w-40 h-40 overflow-hidden rounded-xl border-4 shadow-xl bg-white flex items-center justify-center cursor-move select-none ${isDragging ? 'border-red-500 scale-95' : 'border-white'}`}
                          onMouseDown={handleDragStart}
                          onMouseMove={handleDragMove}
                          onMouseUp={handleDragEnd}
                          onMouseLeave={handleDragEnd}
                        >
                          <img 
                            src={facultyPreview} 
                            alt="Preview" 
                            draggable="false"
                            style={{ transform: `scale(${facultyZoom}) translate(${facultyOffsetX}%, ${facultyOffsetY}%)` }}
                            className={`w-full h-full pointer-events-none ${facultyDisplayMode === 'contain' ? 'object-contain' : 'object-cover'}`} 
                          />
                        </div>
                        <div className="text-xs text-slate-400 font-bold space-y-1">
                          <div>X: {Math.round(facultyOffsetX)}%</div>
                          <div>Y: {Math.round(facultyOffsetY)}%</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-4">
                  <label className="flex-grow cursor-pointer">
                    <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${facultyPreview ? 'border-green-400 bg-green-50' : 'border-slate-300 hover:border-red-400 hover:bg-red-50'}`}>
                      <Upload className="mx-auto mb-2 text-slate-400" size={32} />
                      <p className="text-sm font-bold text-slate-600">{facultyFile ? facultyFile.name : 'Click to choose image (optional)'}</p>
                    </div>
                    <input type="file" accept="image/*" onChange={handleFacultyFileChange} ref={facultyFileRef} className="hidden" />
                  </label>
                  <button type="submit" className="bg-slate-900 text-white font-bold rounded-xl hover:bg-black transition-all px-8 py-4 whitespace-nowrap h-full min-h-[64px]">
                    {editingFaculty ? 'Update Member' : 'Add Faculty'}
                  </button>
                  {editingFaculty && (
                    <button type="button" onClick={() => { setEditingFaculty(null); setFacultyName(''); setFacultyQual(''); setFacultyExp(''); setFacultyDisplayMode('cover'); setFacultyZoom(1); setFacultyOffsetX(0); setFacultyOffsetY(0); setFacultyFile(null); setFacultyPreview(null); }} 
                      className="bg-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-300 transition-all px-8 py-4">Cancel</button>
                  )}
                </div>
              </form>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.isArray(faculty) && faculty.map(member => (
                <div key={member.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 relative group">
                  <div className="h-48 relative overflow-hidden bg-slate-100 flex items-center justify-center">
                    {member.image ? (
                      <img 
                        src={member.image} 
                        style={{ transform: `scale(${member.zoom || 1}) translate(${member.offset_x || 0}%, ${member.offset_y || 0}%)` }}
                        className={`w-full h-full ${member.display_mode === 'contain' ? 'object-contain p-2' : 'object-cover'}`} 
                        alt={member.name} 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300"><ImageIcon size={48} /></div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg text-slate-900 truncate">{member.name}</h3>
                    <p className="text-slate-500 text-sm mt-1 truncate">{member.qualification}</p>
                  </div>
                  <div className="absolute top-2 right-2 flex gap-2 opacity-100 transition-opacity">
                    <button onClick={() => startEditFaculty(member)} className="bg-amber-500 text-white p-2 rounded-lg hover:bg-amber-600 transition-colors">
                      <Pencil size={16} />
                    </button>
                    <button onClick={() => deleteFaculty(member.id)} className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : activeTab === 'classes' ? (
          <div>
            <div className="flex justify-between items-center mb-10">
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">Classes Offered</h1>
              <span className="bg-sky-100 text-sky-700 px-4 py-2 rounded-full text-sm font-bold">{classesList.length} Classes</span>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 mb-10">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Plus className="text-red-600" /> Add New Class
              </h2>
              <form onSubmit={addClass} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="text" placeholder="Title (e.g. Classes V – VIII)" value={classTitle} onChange={e => setClassTitle(e.target.value)} required
                    className="bg-slate-50 border border-slate-200 p-4 rounded-xl outline-none focus:ring-2 focus:ring-red-600" />
                  <input type="text" placeholder="Subtitle (e.g. All Subjects)" value={classSubtitle} onChange={e => setClassSubtitle(e.target.value)}
                    className="bg-slate-50 border border-slate-200 p-4 rounded-xl outline-none focus:ring-2 focus:ring-red-600" />
                  <textarea placeholder="Description" value={classDesc} onChange={e => setClassDesc(e.target.value)} rows="3"
                    className="bg-slate-50 border border-slate-200 p-4 rounded-xl outline-none focus:ring-2 focus:ring-red-600 md:col-span-2 resize-none"></textarea>
                  <div className="flex flex-col">
                    <label className="text-xs font-bold text-slate-400 mb-1 ml-1 uppercase tracking-wider">Select Icon</label>
                    <select value={classIcon} onChange={e => setClassIcon(e.target.value)} className="bg-slate-50 border border-slate-200 p-4 rounded-xl outline-none focus:ring-2 focus:ring-red-600 appearance-none cursor-pointer">
                      <option value="BookOpen">Book</option>
                      <option value="Target">Target</option>
                      <option value="Users">Users</option>
                      <option value="Award">Award</option>
                    </select>
                  </div>
                </div>
                <button type="submit" className="w-full md:w-auto bg-slate-900 text-white font-bold rounded-xl hover:bg-black transition-all px-8 py-4 whitespace-nowrap">Add Class</button>
              </form>
            </div>

            <div className="flex justify-end mb-4">
              <div className="flex items-center gap-1 bg-white p-1 rounded-2xl border border-slate-200 shadow-sm">
                <button 
                  onClick={() => setClassesViewMode('grid')}
                  className={`p-2 rounded-xl transition-all ${classesViewMode === 'grid' ? 'bg-sky-50 text-sky-600' : 'text-slate-400 hover:text-slate-600'}`}
                  title="Grid View"
                >
                  <LayoutGrid size={18} />
                </button>
                <button 
                  onClick={() => setClassesViewMode('list')}
                  className={`p-2 rounded-xl transition-all ${classesViewMode === 'list' ? 'bg-sky-50 text-sky-600' : 'text-slate-400 hover:text-slate-600'}`}
                  title="Row View"
                >
                  <List size={18} />
                </button>
              </div>
            </div>

            <div className={classesViewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
              {Array.isArray(classesList) && classesList.map(item => (
                <div key={item.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100">
                  {editingClass?.id === item.id ? (
                    <form onSubmit={updateClass} className="p-6 space-y-3 bg-amber-50">
                      <input type="text" placeholder="Title" value={editingClass.title} onChange={e => setEditingClass(c => ({ ...c, title: e.target.value }))} className="w-full bg-white border border-slate-200 p-3 rounded-xl outline-none text-sm focus:ring-2 focus:ring-amber-400" required />
                      <input type="text" placeholder="Subtitle" value={editingClass.subtitle} onChange={e => setEditingClass(c => ({ ...c, subtitle: e.target.value }))} className="w-full bg-white border border-slate-200 p-3 rounded-xl outline-none text-sm focus:ring-2 focus:ring-amber-400" />
                      <textarea placeholder="Description" value={editingClass.description} onChange={e => setEditingClass(c => ({ ...c, description: e.target.value }))} className="w-full bg-white border border-slate-200 p-3 rounded-xl outline-none text-sm focus:ring-2 focus:ring-amber-400 resize-none" rows="3"></textarea>
                      <select value={editingClass.icon} onChange={e => setEditingClass(c => ({ ...c, icon: e.target.value }))} className="w-full bg-white border border-slate-200 p-3 rounded-xl outline-none text-sm focus:ring-2 focus:ring-amber-400">
                        <option value="BookOpen">Book</option>
                        <option value="Target">Target</option>
                        <option value="Users">Users</option>
                        <option value="Award">Award</option>
                      </select>
                      <div className="flex gap-2 pt-2">
                        <button type="submit" className="flex-1 bg-amber-500 text-white font-bold rounded-xl py-2.5 text-sm hover:bg-amber-600 transition-colors">Save</button>
                        <button type="button" onClick={() => setEditingClass(null)} className="flex-1 bg-slate-200 text-slate-700 font-bold rounded-xl py-2.5 text-sm hover:bg-slate-300 transition-colors">Cancel</button>
                      </div>
                    </form>
                  ) : classesViewMode === 'grid' ? (
                    <div className="p-8 relative group">
                      <div className="absolute top-4 right-4 flex gap-2 opacity-100 transition-opacity">
                        <button onClick={() => setEditingClass(item)} className="bg-amber-500 text-white p-2 rounded-xl hover:bg-amber-600 transition-colors"><Pencil size={16} /></button>
                        <button onClick={() => deleteClass(item.id)} className="bg-red-600 text-white p-2 rounded-xl hover:bg-red-700 transition-colors"><Trash2 size={16} /></button>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{item.title}</h3>
                      <p className="text-indigo-600 font-semibold mb-4">{item.subtitle}</p>
                      <p className="text-gray-600 mb-6 text-sm line-clamp-3 leading-relaxed">{item.description}</p>
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-lg w-fit">
                        <BookOpen size={14} className="text-sky-500" /> {item.icon}
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 flex items-center justify-between group relative overflow-hidden">
                      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-sky-500" />
                      <div className="flex items-center gap-6 flex-1 min-w-0 ml-2">
                        <div className="w-12 h-12 rounded-xl bg-sky-500 flex items-center justify-center text-white shrink-0 shadow-lg">
                          <BookOpen size={24} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-3">
                            <h3 className="font-bold text-slate-900 truncate text-lg">{item.title}</h3>
                            <span className="text-[10px] font-black bg-sky-100 text-sky-700 px-2 py-0.5 rounded-md uppercase whitespace-nowrap">{item.subtitle}</span>
                          </div>
                          <p className="text-xs text-slate-500 font-medium truncate max-w-2xl mt-0.5">{item.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 pr-2 opacity-100 transition-all">
                        <button onClick={() => setEditingClass(item)} className="p-2.5 rounded-xl bg-amber-50 text-amber-600 hover:bg-amber-600 hover:text-white transition-all shadow-sm">
                          <Pencil size={18} />
                        </button>
                        <button onClick={() => deleteClass(item.id)} className="p-2.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all shadow-sm">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : activeTab === 'courses' ? (
          <div>
            <div className="flex justify-between items-center mb-10">
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">Manage Courses</h1>
              <span className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-bold">{coursesList.length} Courses</span>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 mb-10">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Plus className="text-red-600" /> Add New Course
              </h2>
              <form onSubmit={addCourse} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <input type="text" placeholder="Course Name (e.g. Foundation Batch)" value={courseName} onChange={e => setCourseName(e.target.value)} required
                    className="bg-slate-50 border border-slate-200 p-4 rounded-xl outline-none focus:ring-2 focus:ring-red-600" />
                  <input type="text" placeholder="Class Level (e.g. Classes V – VIII)" value={courseLevel} onChange={e => setCourseLevel(e.target.value)}
                    className="bg-slate-50 border border-slate-200 p-4 rounded-xl outline-none focus:ring-2 focus:ring-red-600" />
                  <div className="flex flex-col">
                    <label className="text-[10px] font-bold text-slate-400 ml-1 uppercase mb-1">Theme Color</label>
                    <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 p-3 rounded-xl focus-within:ring-2 focus-within:ring-red-600">
                      <input 
                        type="color" 
                        value={courseColor.startsWith('#') ? courseColor : '#2563eb'} 
                        onChange={e => setCourseColor(e.target.value)} 
                        className="w-8 h-8 rounded cursor-pointer border-0 p-0 bg-transparent"
                      />
                      <span className="text-sm font-semibold text-slate-700 uppercase">{courseColor.startsWith('#') ? courseColor : '#2563eb'}</span>
                    </div>
                  </div>
                  <input type="text" placeholder="Subjects (Comma separated)" value={courseSubjects} onChange={e => setCourseSubjects(e.target.value)}
                    className="bg-slate-50 border border-slate-200 p-4 rounded-xl outline-none focus:ring-2 focus:ring-red-600 lg:col-span-3" />
                  <input type="text" placeholder="Duration (e.g. 1 Year Program)" value={courseDuration} onChange={e => setCourseDuration(e.target.value)}
                    className="bg-slate-50 border border-slate-200 p-4 rounded-xl outline-none focus:ring-2 focus:ring-red-600 lg:col-span-1" />
                  <input type="text" placeholder="Timing (e.g. Evening Batches)" value={courseTiming} onChange={e => setCourseTiming(e.target.value)}
                    className="bg-slate-50 border border-slate-200 p-4 rounded-xl outline-none focus:ring-2 focus:ring-red-600 lg:col-span-2" />
                </div>
                <button type="submit" className="w-full md:w-auto bg-slate-900 text-white font-bold rounded-xl hover:bg-black transition-all px-8 py-4 whitespace-nowrap mt-2">Add Course</button>
              </form>
            </div>

            <div className="flex justify-end mb-4">
              <div className="flex items-center gap-1 bg-white p-1 rounded-2xl border border-slate-200 shadow-sm">
                <button 
                  onClick={() => setCourseViewMode('grid')}
                  className={`p-2 rounded-xl transition-all ${courseViewMode === 'grid' ? 'bg-slate-100 text-red-600' : 'text-slate-400 hover:text-slate-600'}`}
                  title="Grid View"
                >
                  <LayoutGrid size={18} />
                </button>
                <button 
                  onClick={() => setCourseViewMode('list')}
                  className={`p-2 rounded-xl transition-all ${courseViewMode === 'list' ? 'bg-slate-100 text-red-600' : 'text-slate-400 hover:text-slate-600'}`}
                  title="Row View"
                >
                  <List size={18} />
                </button>
              </div>
            </div>
            <div className={courseViewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 gap-6" : "space-y-4"}>
              {Array.isArray(coursesList) && coursesList.map(item => (
                <div key={item.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100">
                  {editingCourse?.id === item.id ? (
                    <form onSubmit={updateCourse} className="p-6 space-y-3 bg-amber-50">
                      <input type="text" placeholder="Course Name" value={editingCourse.name} onChange={e => setEditingCourse(c => ({ ...c, name: e.target.value }))} className="w-full bg-white border border-slate-200 p-3 rounded-xl outline-none text-sm focus:ring-2 focus:ring-amber-400" required />
                      <input type="text" placeholder="Class Level" value={editingCourse.class_level} onChange={e => setEditingCourse(c => ({ ...c, class_level: e.target.value }))} className="w-full bg-white border border-slate-200 p-3 rounded-xl outline-none text-sm focus:ring-2 focus:ring-amber-400" />
                      <input type="text" placeholder="Subjects (Comma separated)" value={editingCourse.subjects} onChange={e => setEditingCourse(c => ({ ...c, subjects: e.target.value }))} className="w-full bg-white border border-slate-200 p-3 rounded-xl outline-none text-sm focus:ring-2 focus:ring-amber-400" />
                      <div className="flex gap-2">
                        <input type="text" placeholder="Duration" value={editingCourse.duration} onChange={e => setEditingCourse(c => ({ ...c, duration: e.target.value }))} className="w-1/2 bg-white border border-slate-200 p-3 rounded-xl outline-none text-sm focus:ring-2 focus:ring-amber-400" />
                        <input type="text" placeholder="Timing" value={editingCourse.timing} onChange={e => setEditingCourse(c => ({ ...c, timing: e.target.value }))} className="w-1/2 bg-white border border-slate-200 p-3 rounded-xl outline-none text-sm focus:ring-2 focus:ring-amber-400" />
                      </div>
                      <div className="flex items-center gap-3 w-full bg-white border border-slate-200 p-2 rounded-xl focus-within:ring-2 focus-within:ring-amber-400">
                        <label className="text-xs font-bold text-slate-500 uppercase">Theme Color:</label>
                        <input 
                          type="color" 
                          value={editingCourse.color?.startsWith('#') ? editingCourse.color : '#2563eb'} 
                          onChange={e => setEditingCourse(c => ({ ...c, color: e.target.value }))} 
                          className="w-8 h-6 rounded cursor-pointer border-0 p-0 bg-transparent ml-auto"
                        />
                      </div>
                      <div className="flex gap-2 pt-2">
                        <button type="submit" className="flex-1 bg-amber-500 text-white font-bold rounded-xl py-2.5 text-sm hover:bg-amber-600 transition-colors">Save</button>
                        <button type="button" onClick={() => setEditingCourse(null)} className="flex-1 bg-slate-200 text-slate-700 font-bold rounded-xl py-2.5 text-sm hover:bg-slate-300 transition-colors">Cancel</button>
                      </div>
                    </form>
                  ) : courseViewMode === 'grid' ? (
                    <div className="p-8 relative group">
                      <div className="absolute top-4 right-4 flex gap-2 opacity-100 transition-opacity">
                        <button onClick={() => setEditingCourse(item)} className="bg-amber-500 text-white p-2 rounded-xl hover:bg-amber-600 transition-colors"><Pencil size={16} /></button>
                        <button onClick={() => deleteCourse(item.id)} className="bg-red-600 text-white p-2 rounded-xl hover:bg-red-700 transition-colors"><Trash2 size={16} /></button>
                      </div>
                      <div 
                        className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-3 border"
                        style={{ 
                          backgroundColor: item.color?.startsWith('#') ? `${item.color}15` : undefined,
                          color: item.color?.startsWith('#') ? item.color : undefined,
                          borderColor: item.color?.startsWith('#') ? `${item.color}30` : undefined
                        }}
                      >
                        Theme: {item.color}
                      </div>
                      <h3 className="text-3xl font-black text-slate-900 mb-2 truncate">{item.name}</h3>
                      <p className="text-indigo-600 font-bold mb-6 text-sm uppercase tracking-widest">{item.class_level}</p>
                      <div className="space-y-4">
                        <div className="flex gap-4 border-t border-slate-50 pt-4">
                          <div className="flex-1">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Subjects</p>
                            <p className="text-sm font-medium text-slate-600 line-clamp-2 leading-relaxed">{item.subjects}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 border-t border-slate-50 pt-4">
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Duration</p>
                            <p className="text-sm font-bold text-slate-900 capitalize italic">{item.duration}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Timing</p>
                            <p className="text-sm font-bold text-slate-900 capitalize italic">{item.timing}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 flex items-center justify-between group relative overflow-hidden">
                      {/* Color strip on the left */}
                      <div 
                        className="absolute left-0 top-0 bottom-0 w-1.5"
                        style={{ backgroundColor: item.color?.startsWith('#') ? item.color : '#2563eb' }}
                      />
                      
                      <div className="flex items-center gap-6 flex-1 min-w-0 ml-2">
                        <div 
                          className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shrink-0"
                          style={{ backgroundColor: item.color?.startsWith('#') ? item.color : '#2563eb' }}
                        >
                          {String(item.name).charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-3">
                            <h3 className="font-bold text-slate-900 truncate text-lg">{item.name}</h3>
                            <span className="text-[10px] font-black bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md uppercase">{item.class_level}</span>
                          </div>
                          <p className="text-xs text-slate-500 font-medium truncate max-w-md mt-0.5">
                            <span className="font-bold text-slate-400">Subjects:</span> {item.subjects}
                          </p>
                        </div>
                        <div className="hidden lg:flex items-center gap-8 px-8 border-x border-slate-100">
                          <div>
                            <p className="text-[10px] font-black text-slate-300 uppercase">Duration</p>
                            <p className="text-xs font-bold text-slate-600">{item.duration}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-slate-300 uppercase">Timing</p>
                            <p className="text-xs font-bold text-slate-600">{item.timing}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pr-2 opacity-100 transition-all">
                        <button onClick={() => setEditingCourse(item)} className="p-2.5 rounded-xl bg-amber-50 text-amber-600 hover:bg-amber-600 hover:text-white transition-all shadow-sm">
                          <Pencil size={18} />
                        </button>
                        <button onClick={() => deleteCourse(item.id)} className="p-2.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all shadow-sm">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : activeTab === 'registrations' ? (
          <div>
            <div className="flex justify-between items-center mb-10">
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">Student Registrations</h1>
              <span className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-bold">{registrations.length} Total</span>
            </div>

            <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="p-4 text-xs font-black text-slate-400 uppercase tracking-widest">Student / Parent</th>
                      <th className="p-4 text-xs font-black text-slate-400 uppercase tracking-widest">Contact / Address</th>
                      <th className="p-4 text-xs font-black text-slate-400 uppercase tracking-widest">Course / Class</th>
                      <th className="p-4 text-xs font-black text-slate-400 uppercase tracking-widest">Type</th>
                      <th className="p-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {registrations.length > 0 ? registrations.map((reg) => (
                      <tr key={reg.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="p-4">
                          <div className="font-bold text-slate-900">{reg.student_name}</div>
                          <div className="text-xs text-slate-500 font-medium">S/O, D/O {reg.parent_name}</div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-1.5 text-sm font-bold text-slate-700">
                            <Phone size={14} className="text-emerald-500" /> {reg.phone_number}
                          </div>
                          <div className="text-xs text-slate-400 truncate max-w-[200px]">{reg.address}</div>
                        </td>
                        <td className="p-4">
                          <div className="text-sm font-bold text-slate-800">{reg.competitive_exam || reg.class || 'General'}</div>
                          <div className="text-xs text-slate-500">{reg.stream}</div>
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${
                            reg.registration_type === 'online' ? 'bg-sky-100 text-sky-700' : 'bg-amber-100 text-amber-700'
                          }`}>
                            {reg.registration_type}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button onClick={() => deleteRegistration(reg.id)} className="p-2 text-slate-300 hover:text-red-600 transition-colors">
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="5" className="p-10 text-center text-slate-400 font-medium italic">No registrations found yet</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : activeTab === 'inquiries' ? (
          <div>
            <div className="flex justify-between items-center mb-10">
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">Website Inquiries</h1>
              <span className="bg-sky-100 text-sky-700 px-4 py-2 rounded-full text-sm font-bold">{inquiries.length} Total</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {inquiries.length > 0 ? inquiries.map((inq) => (
                <div key={inq.id} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 relative group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-sky-50 rounded-2xl flex items-center justify-center text-sky-600">
                        <MessageSquare size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900">{inq.name}</h3>
                        <p className="text-xs font-bold text-slate-400 flex items-center gap-1">
                          <Phone size={12} /> {inq.phone}
                        </p>
                      </div>
                    </div>
                    <button onClick={() => deleteInquiry(inq.id)} className="p-2 text-slate-300 hover:text-red-600 transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-4 text-sm text-slate-600 leading-relaxed italic border border-slate-100">
                    "{inq.message}"
                  </div>
                  <div className="mt-4 flex justify-end">
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-1">
                      <Calendar size={10} /> {new Date(inq.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              )) : (
                <div className="col-span-full bg-white rounded-3xl p-10 text-center text-slate-400 border-2 border-dashed border-slate-100 font-medium italic">
                  No inquiries received yet
                </div>
              )}
            </div>
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-10">
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">Site Settings</h1>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 max-w-2xl mb-8">
              <h2 className="text-xl font-bold mb-6">Website Logo</h2>
              <div className="flex items-start gap-8">
                <div className="w-48 h-48 bg-slate-100 rounded-2xl flex items-center justify-center border border-slate-200 relative overflow-hidden">
                  <img src={settings.logo_url || '/logo-transparent.png'} alt="Current Logo" className="w-full h-full object-contain p-4" />
                </div>
                <div className="flex-1">
                  <form onSubmit={updateLogo} className="space-y-4">
                    <label className="block cursor-pointer">
                      <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${logoPreview ? 'border-green-400 bg-green-50' : 'border-slate-300 hover:border-red-400 hover:bg-red-50'}`}>
                        <Upload className="mx-auto mb-2 text-slate-400" size={32} />
                        <p className="text-sm font-bold text-slate-600">{logoFile ? logoFile.name : 'Select new logo image'}</p>
                        <p className="text-xs text-slate-400 mt-1">Recommended: Transparent PNG, square or max 512x512 px</p>
                      </div>
                      <input type="file" accept="image/*" onChange={handleLogoFileChange} ref={logoFileRef} className="hidden" />
                    </label>
                    <button type="submit" disabled={!logoFile} className="w-full bg-slate-900 text-white font-bold rounded-xl hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed transition-all px-8 py-4">
                      Update Logo
                    </button>
                  </form>
                </div>
              </div>
            </div>
 
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 max-w-2xl">
              <h2 className="text-xl font-bold mb-6">Home CTA Section (Competitive Courses)</h2>
              <form onSubmit={updateCtaSettings} className="space-y-6">
                <div>
                  <label className="block text-sm font-black text-slate-400 uppercase tracking-widest mb-2">Badge Text</label>
                  <input 
                    type="text" 
                    value={ctaBadge} 
                    onChange={e => setCtaBadge(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl outline-none focus:ring-2 focus:ring-red-600 font-bold"
                    placeholder="e.g. Specialized Coaching"
                  />
                </div>
                <div>
                  <label className="block text-sm font-black text-slate-400 uppercase tracking-widest mb-2">Main Title</label>
                  <input 
                    type="text" 
                    value={ctaTitle} 
                    onChange={e => setCtaTitle(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl outline-none focus:ring-2 focus:ring-red-600 font-bold"
                    placeholder="e.g. Preparing for CTET or CUET?"
                  />
                </div>
                <div>
                  <label className="block text-sm font-black text-slate-400 uppercase tracking-widest mb-2">Description</label>
                  <textarea 
                    value={ctaDesc} 
                    onChange={e => setCtaDesc(e.target.value)}
                    rows={4}
                    className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl outline-none focus:ring-2 focus:ring-red-600 font-medium"
                    placeholder="Enter description text..."
                  />
                </div>
                <button type="submit" className="w-full bg-slate-900 text-white font-bold rounded-xl hover:bg-black transition-all px-8 py-4 shadow-lg shadow-slate-200">
                  Save CTA Settings
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
      
      {/* Custom Confirmation Modal */}
      <AnimatePresence>
        {confirmModal.show && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setConfirmModal({ ...confirmModal, show: false })}
              className="absolute inset-0 bg-slate-900/80"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-slate-100 text-center"
            >
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                {confirmModal.confirmLabel === 'Logout' ? (
                  <LogOut size={40} className="text-red-500 ml-1" />
                ) : (
                  <Trash2 size={40} className="text-red-500" />
                )}
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">{confirmModal.title}</h3>
              <p className="text-slate-500 mb-8 font-medium">{confirmModal.message}</p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setConfirmModal({ ...confirmModal, show: false })}
                  className="flex-1 px-6 py-4 rounded-2xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmModal.onConfirm}
                  className="flex-1 px-6 py-4 rounded-2xl bg-red-600 text-white font-bold hover:bg-red-700 shadow-lg shadow-red-600/20 transition-all hover:-translate-y-0.5"
                >
                  {confirmModal.confirmLabel}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
