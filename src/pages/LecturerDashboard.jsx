import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, BookOpen, Plus, Send, Radio, Video, ArrowLeft, Edit3, Trash2, X, Folder, Layers, LogOut, Mail } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LecturerDashboard = () => {
    const { token, logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('lessons'); // 'lessons', 'courses', or 'sale'
    const [courses, setCourses] = useState([]);
    const [lessons, setLessons] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [status, setStatus] = useState('');

    // Form states
    const [lessonData, setLessonData] = useState({
        courseId: '', title: '', description: '', type: 'video', url: '', thumbnail: '', notes: '', assignment: ''
    });
    const [courseData, setCourseData] = useState({
        title: '', description: '', thumbnail: ''
    });
    const [saleData, setSaleData] = useState({
        isVisible: true, title: '', presalePrice: 0, regularPrice: 0, expiryDate: '', amazonLink: '', selarLink: '', bookImage: ''
    });
    const [adData, setAdData] = useState({
        isVisible: true, title: '', description: '', price: 0, buttonLink: '', image: ''
    });

    useEffect(() => {
        fetchData();
    }, [token]);

    const fetchData = async () => {
        try {
            const res = await fetch('/api/academy');
            const data = await res.json();
            setCourses(data.courses);
            setLessons(data.lessons);

            const saleRes = await fetch('/api/settings/book-sale');
            const saleData = await saleRes.json();
            setSaleData(saleData);

            const adRes = await fetch('/api/settings/academy-ad');
            const adData = await adRes.json();
            setAdData(adData);
        } catch (err) {
            console.error('Fetch error:', err);
        }
    };

    const resetForms = () => {
        setEditingId(null);
        setLessonData({ courseId: '', title: '', description: '', type: 'video', url: '', thumbnail: '', notes: '', assignment: '' });
        setCourseData({ title: '', description: '', thumbnail: '' });
        setStatus('');
    };

    const handleLessonSubmit = async (e) => {
        e.preventDefault();
        setStatus(editingId ? 'Updating...' : 'Publishing...');
        const url = editingId ? `/api/lessons/${editingId}` : '/api/lessons';
        const method = editingId ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...lessonData,
                    resources: { notes: lessonData.notes, assignment: lessonData.assignment }
                })
            });
            if (res.ok) {
                setStatus(editingId ? 'Lesson Updated!' : 'Lesson Published!');
                if (!editingId) resetForms();
                fetchData();
            } else {
                const errData = await res.json();
                setStatus(errData.message || 'Operation failed.');
            }
        } catch (err) { setStatus('Connection error.'); }
    };

    const handleCourseSubmit = async (e) => {
        e.preventDefault();
        setStatus(editingId ? 'Updating...' : 'Creating...');
        const url = editingId ? `/api/courses/${editingId}` : '/api/courses';
        const method = editingId ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(courseData)
            });
            if (res.ok) {
                setStatus(editingId ? 'Course Updated!' : 'Course Created!');
                if (!editingId) resetForms();
                fetchData();
            } else {
                const errData = await res.json();
                setStatus(errData.message || 'Operation failed.');
            }
        } catch (err) { setStatus('Connection error.'); }
    };

    const handleDelete = async (type, id) => {
        if (!window.confirm(`Delete this ${type}?`)) return;
        try {
            const res = await fetch(`/api/${type === 'lesson' ? 'lessons' : 'courses'}/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                setStatus(`${type} deleted.`);
                fetchData();
                if (editingId === id) resetForms();
            } else {
                setStatus('Unauthorized deletion.');
            }
        } catch (err) { setStatus('Delete failed.'); }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const inputStyle = { padding: '1rem', background: '#fff', border: '1px solid #ddd', borderRadius: '12px', outline: 'none', fontSize: '0.95rem' };

    return (
        <div style={{ background: '#f8f9fa', minHeight: '100vh', color: '#1a1a1a', paddingBottom: '6rem' }}>
            <nav className="lecturer-nav" style={{ padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', borderBottom: '1px solid #eee', position: 'sticky', top: 0, zIndex: 100 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }} className="nav-left">
                    <Link to="/academy" className="back-link" style={{ color: '#000', textDecoration: 'none', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <ArrowLeft size={18} /> <span className="hide-tablet">Back to Academy</span>
                    </Link>
                    <div style={{ width: '1px', height: '20px', background: '#eee' }} className="nav-divider"></div>
                    <div style={{ display: 'flex', gap: '0.5rem' }} className="tab-buttons">
                        <button onClick={() => { setActiveTab('lessons'); resetForms(); }} style={{ padding: '0.6rem 1.25rem', borderRadius: '50px', border: 'none', background: activeTab === 'lessons' ? '#000' : 'transparent', color: activeTab === 'lessons' ? '#fff' : '#666', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem' }}>Lessons</button>
                        <button onClick={() => { setActiveTab('courses'); resetForms(); }} style={{ padding: '0.6rem 1.25rem', borderRadius: '50px', border: 'none', background: activeTab === 'courses' ? '#000' : 'transparent', color: activeTab === 'courses' ? '#fff' : '#666', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem' }}>Courses</button>
                        <button onClick={() => { setActiveTab('sale'); resetForms(); }} style={{ padding: '0.6rem 1.25rem', borderRadius: '50px', border: 'none', background: activeTab === 'sale' ? '#b8860b' : 'transparent', color: activeTab === 'sale' ? '#fff' : '#666', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem' }}>Sale</button>
                        <button onClick={() => { setActiveTab('ad'); resetForms(); }} style={{ padding: '0.6rem 1.25rem', borderRadius: '50px', border: 'none', background: activeTab === 'ad' ? '#d97706' : 'transparent', color: activeTab === 'ad' ? '#fff' : '#666', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem' }}>Academy Ad</button>
                        <Link to="/academy/lecturer/messages" style={{ padding: '0.6rem 1.25rem', borderRadius: '50px', textDecoration: 'none', color: '#666', fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Mail size={14} /> Messages
                        </Link>
                    </div>
                </div>
                <button onClick={handleLogout} className="logout-btn" style={{ background: 'none', border: 'none', color: '#000', opacity: 0.6, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.85rem' }}>
                    <span className="hide-tablet">Logout</span> <LogOut size={18} />
                </button>
            </nav>

            <div className="dashboard-container" style={{ maxWidth: '1100px', padding: '6rem 1rem', margin: '0 auto' }}>
                <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '4rem' }}>
                    {/* Form Column */}
                    <div className="form-card" style={{
                        background: '#fff',
                        padding: '3rem',
                        borderRadius: '30px',
                        boxShadow: '0 20px 50px rgba(0,0,0,0.03)',
                        gridColumn: 'auto'
                    }}>
                        <h2 className="section-title" style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '2.5rem' }}>
                            {activeTab === 'sale' ? 'Manage Book Sale' : activeTab === 'ad' ? 'Manage Academy Ad' : (editingId ? 'Edit' : 'Create') + ' ' + (activeTab === 'lessons' ? 'Lesson' : 'Course')}
                        </h2>

                        {activeTab === 'lessons' ? (
                            <form onSubmit={handleLessonSubmit} style={{ display: 'grid', gap: '1.5rem' }}>
                                <select value={lessonData.courseId} onChange={e => setLessonData({ ...lessonData, courseId: e.target.value })} style={inputStyle} required>
                                    <option value="">Select Parent Course</option>
                                    {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                                </select>
                                <input placeholder="Lesson Title" value={lessonData.title} onChange={e => setLessonData({ ...lessonData, title: e.target.value })} style={inputStyle} required />
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <button type="button" onClick={() => setLessonData({ ...lessonData, type: 'video' })} style={{ ...inputStyle, flex: 1, background: lessonData.type === 'video' ? 'var(--color-soar)' : '#fff', color: lessonData.type === 'video' ? '#000' : '#666', fontWeight: 700 }}>Video</button>
                                    <button type="button" onClick={() => setLessonData({ ...lessonData, type: 'audio' })} style={{ ...inputStyle, flex: 1, background: lessonData.type === 'audio' ? 'var(--color-soar)' : '#fff', color: lessonData.type === 'audio' ? '#000' : '#666', fontWeight: 700 }}>Audio</button>
                                </div>
                                <textarea placeholder="Description" rows="3" value={lessonData.description} onChange={e => setLessonData({ ...lessonData, description: e.target.value })} style={{ ...inputStyle, resize: 'none' }} required />
                                <div className="form-row-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <input placeholder="Media URL" value={lessonData.url} onChange={e => setLessonData({ ...lessonData, url: e.target.value })} style={inputStyle} required />
                                    <input placeholder="Thumbnail URL" value={lessonData.thumbnail} onChange={e => setLessonData({ ...lessonData, thumbnail: e.target.value })} style={inputStyle} required />
                                </div>
                                <div className="form-row-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <textarea placeholder="Notes" rows="3" value={lessonData.notes} onChange={e => setLessonData({ ...lessonData, notes: e.target.value })} style={{ ...inputStyle, resize: 'none' }} required />
                                    <textarea placeholder="Assignment" rows="3" value={lessonData.assignment} onChange={e => setLessonData({ ...lessonData, assignment: e.target.value })} style={{ ...inputStyle, resize: 'none' }} required />
                                </div>
                                <button type="submit" style={{ ...inputStyle, background: '#000', color: '#fff', fontWeight: 900 }}>{editingId ? 'Update Lesson' : 'Publish Lesson'}</button>
                            </form>
                        ) : activeTab === 'courses' ? (
                            <form onSubmit={handleCourseSubmit} style={{ display: 'grid', gap: '1.5rem' }}>
                                <input placeholder="Course Title" value={courseData.title} onChange={e => setCourseData({ ...courseData, title: e.target.value })} style={inputStyle} required />
                                <textarea placeholder="Course Description" rows="4" value={courseData.description} onChange={e => setCourseData({ ...courseData, description: e.target.value })} style={{ ...inputStyle, resize: 'none' }} required />
                                <input placeholder="Thumbnail URL" value={courseData.thumbnail} onChange={e => setCourseData({ ...courseData, thumbnail: e.target.value })} style={inputStyle} required />
                                <button type="submit" style={{ ...inputStyle, background: '#000', color: '#fff', fontWeight: 900 }}>{editingId ? 'Update Course' : 'Create Course'}</button>
                            </form>
                        ) : activeTab === 'sale' ? (
                            <form onSubmit={async (e) => {
                                e.preventDefault();
                                setStatus('Updating Sale...');
                                try {
                                    const res = await fetch('/api/settings/book-sale', {
                                        method: 'PUT',
                                        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                                        body: JSON.stringify(saleData)
                                    });
                                    if (res.ok) {
                                        setStatus('Sale Settings Updated!');
                                    } else {
                                        const errorData = await res.json().catch(() => ({}));
                                        console.error('Update failed:', res.status, errorData);
                                        setStatus(`Update failed: ${errorData.message || res.statusText}`);
                                    }
                                } catch (err) {
                                    console.error('Fetch error:', err);
                                    setStatus(`Error: ${err.message}`);
                                }
                            }} style={{ display: 'grid', gap: '1.25rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: '#f0f0f0', padding: '1rem', borderRadius: '12px' }}>
                                    <label style={{ fontWeight: 800, fontSize: '0.9rem' }}>Show Sale Section:</label>
                                    <input type="checkbox" checked={saleData.isVisible} onChange={e => setSaleData({ ...saleData, isVisible: e.target.checked })} style={{ width: '20px', height: '20px' }} />
                                </div>
                                <input placeholder="Book Title" value={saleData.title} onChange={e => setSaleData({ ...saleData, title: e.target.value })} style={inputStyle} required />
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <input type="number" placeholder="Presale Price (₦)" value={saleData.presalePrice} onChange={e => setSaleData({ ...saleData, presalePrice: parseInt(e.target.value) })} style={inputStyle} required />
                                    <input type="number" placeholder="Regular Price (₦)" value={saleData.regularPrice} onChange={e => setSaleData({ ...saleData, regularPrice: parseInt(e.target.value) })} style={inputStyle} required />
                                </div>
                                <div style={{ display: 'grid', gap: '0.5rem' }}>
                                    <label style={{ fontSize: '0.8rem', fontWeight: 800, opacity: 0.6 }}>SALE EXPIRY (TIMER)</label>
                                    <input type="datetime-local" value={saleData.expiryDate ? new Date(saleData.expiryDate).toISOString().slice(0, 16) : ''} onChange={e => setSaleData({ ...saleData, expiryDate: new Date(e.target.value).toISOString() })} style={inputStyle} required />
                                </div>
                                <input placeholder="Amazon Link" value={saleData.amazonLink} onChange={e => setSaleData({ ...saleData, amazonLink: e.target.value })} style={inputStyle} required />
                                <input placeholder="Selar Link" value={saleData.selarLink} onChange={e => setSaleData({ ...saleData, selarLink: e.target.value })} style={inputStyle} required />
                                <input placeholder="Book Image URL" value={saleData.bookImage} onChange={e => setSaleData({ ...saleData, bookImage: e.target.value })} style={inputStyle} required />
                                <button type="submit" style={{ ...inputStyle, background: '#b8860b', color: '#fff', fontWeight: 900 }}>Update Pre-order Sale</button>
                            </form>
                        ) : (
                            <form onSubmit={async (e) => {
                                e.preventDefault();
                                setStatus('Updating Ad...');
                                try {
                                    const res = await fetch('/api/settings/academy-ad', {
                                        method: 'PUT',
                                        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                                        body: JSON.stringify(adData)
                                    });
                                    if (res.ok) setStatus('Ad Settings Updated!');
                                    else setStatus('Update failed.');
                                } catch (err) { setStatus('Error.'); }
                            }} style={{ display: 'grid', gap: '1.25rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: '#f0f0f0', padding: '1rem', borderRadius: '12px' }}>
                                    <label style={{ fontWeight: 800, fontSize: '0.9rem' }}>Show Academy Ad:</label>
                                    <input type="checkbox" checked={adData.isVisible} onChange={e => setAdData({ ...adData, isVisible: e.target.checked })} style={{ width: '20px', height: '20px' }} />
                                </div>
                                <input placeholder="Ad Title" value={adData.title} onChange={e => setAdData({ ...adData, title: e.target.value })} style={inputStyle} required />
                                <textarea placeholder="Description" rows="4" value={adData.description} onChange={e => setAdData({ ...adData, description: e.target.value })} style={{ ...inputStyle, resize: 'none' }} required />
                                <input type="number" placeholder="Price (₦)" value={adData.price} onChange={e => setAdData({ ...adData, price: parseInt(e.target.value) })} style={inputStyle} required />
                                <input placeholder="Selar Link" value={adData.buttonLink} onChange={e => setAdData({ ...adData, buttonLink: e.target.value })} style={inputStyle} required />
                                <input placeholder="Image URL" value={adData.image} onChange={e => setAdData({ ...adData, image: e.target.value })} style={inputStyle} required />
                                <button type="submit" style={{ ...inputStyle, background: '#d97706', color: '#fff', fontWeight: 900 }}>Update Academy Ad</button>
                            </form>
                        )}
                        {status && (
                            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', marginTop: '1rem', fontWeight: 800, color: 'var(--color-soar)' }}>{status}</motion.p>
                        )}
                    </div>

                    {/* Management Column */}
                    <div className="management-card">
                        <h3 style={{ fontSize: '0.9rem', fontWeight: 900, marginBottom: '1.5rem', opacity: 0.6 }}>EXISTING {activeTab.toUpperCase()}</h3>
                        <div style={{ display: 'grid', gap: '1rem' }}>
                            {(activeTab === 'lessons' ? lessons : courses).map(item => (
                                <div key={item.id} style={{ background: '#fff', padding: '1.25rem', borderRadius: '20px', border: editingId === item.id ? '2px solid var(--color-soar)' : '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ overflow: 'hidden', paddingRight: '1rem' }}>
                                        <h4 style={{ fontSize: '0.95rem', fontWeight: 800, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{item.title}</h4>
                                        <p style={{ fontSize: '0.7rem', opacity: 0.5, fontWeight: 700 }}>{activeTab === 'lessons' ? courses.find(c => c.id === item.courseId)?.title || 'No Course' : 'Course Category'}</p>
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                                        <button onClick={() => { setEditingId(item.id); activeTab === 'lessons' ? setLessonData({ ...item, notes: item.resources.notes, assignment: item.resources.assignment }) : setCourseData(item); }} style={{ padding: '0.6rem', background: '#f0f0f0', border: 'none', borderRadius: '10px', cursor: 'pointer' }}><Edit3 size={16} /></button>
                                        <button onClick={() => handleDelete(activeTab === 'lessons' ? 'lesson' : 'course', item.id)} style={{ padding: '0.6rem', background: 'rgba(239, 68, 68, 0.1)', border: 'none', borderRadius: '10px', cursor: 'pointer', color: '#ef4444' }}><Trash2 size={16} /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                *, *::before, *::after { box-sizing: border-box; }
                
                @media (max-width: 1000px) {
                    .dashboard-grid { grid-template-columns: 1fr !important; gap: 2.5rem !important; }
                    .dashboard-container { padding: 4rem 1rem !important; }
                    .management-card { order: 2; }
                    .form-card { order: 1; }
                }

                @media (max-width: 768px) {
                    .nav-divider { display: none !important; }
                    .lecturer-nav { padding: 1rem !important; flex-direction: column; gap: 1rem; }
                    .nav-left { flex-direction: column; width: 100%; gap: 1rem !important; }
                    .tab-buttons { width: 100%; justify-content: center; overflow-x: auto; padding-bottom: 0.5rem; }
                    .hide-tablet { display: none !important; }
                    .tab-buttons button, .tab-buttons a { white-space: nowrap; }
                    .form-card { padding: 2rem 1.5rem !important; }
                    .form-row-2 { grid-template-columns: 1fr !important; }
                    .section-title { font-size: 1.5rem !important; margin-bottom: 2rem !important; }
                }
            ` }} />
        </div>
    );
};

export default LecturerDashboard;
