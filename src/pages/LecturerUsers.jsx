import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, User, Mail, Shield, Trash2, Search, Filter, MoreVertical, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LecturerUsers = () => {
    const { token, logout, user: currentUser } = useAuth();
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusMsg, setStatusMsg] = useState('');
    const [activeTab, setActiveTab] = useState('STUDENT'); // STUDENT, LECTURER

    useEffect(() => {
        fetchUsers();
    }, [token]);

    const fetchUsers = async () => {
        try {
            const res = await fetch('/api/users', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setUsers(data);
            }
        } catch (error) {
            console.error('Fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateRole = async (id, newRole) => {
        if (!window.confirm(`Change user role to ${newRole}?`)) return;
        try {
            const res = await fetch(`/api/users/${id}/role`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ role: newRole })
            });

            if (res.ok) {
                setUsers(users.map(u => u.id === id ? { ...u, role: newRole } : u));
                setStatusMsg('Role updated.');
                setTimeout(() => setStatusMsg(''), 3000);
            }
        } catch (error) {
            setStatusMsg('Update failed.');
        }
    };

    const handleDeleteUser = async (id) => {
        if (id === currentUser?.id) {
            alert("You cannot delete yourself.");
            return;
        }
        if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
        try {
            const res = await fetch(`/api/users/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                setUsers(users.filter(u => u.id !== id));
                setStatusMsg('User deleted.');
                setTimeout(() => setStatusMsg(''), 3000);
            }
        } catch (error) {
            setStatusMsg('Delete failed.');
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const filteredUsers = users.filter(u => {
        // Group LECTURER and ADMIN together in the same tab
        const isLecturerOrAdmin = u.role === 'LECTURER' || u.role === 'ADMIN';
        const matchesRole = activeTab === 'LECTURER' ? isLecturerOrAdmin : u.role === 'STUDENT';

        const term = searchTerm.toLowerCase();
        const matchesSearch =
            (u.fullName || '').toLowerCase().includes(term) ||
            (u.email || '').toLowerCase().includes(term) ||
            (u.username || '').toLowerCase().includes(term);

        return matchesRole && matchesSearch;
    });

    return (
        <div style={{ background: '#f8f9fa', minHeight: '100vh', padding: '2rem' }}>
            <nav style={{ maxWidth: '1200px', margin: '0 auto 2rem auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} className="nav-users">
                <Link to="/academy/lecturer" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#000', textDecoration: 'none', fontWeight: 800 }}>
                    <ArrowLeft size={20} /> Back to Dashboard
                </Link>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 900 }}>User Management</h1>
                <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: '#000', opacity: 0.6, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.85rem' }}>
                    Logout <LogOut size={18} />
                </button>
            </nav>

            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                {statusMsg && (
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ background: '#000', color: '#fff', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', textAlign: 'center', fontWeight: 700 }}>
                        {statusMsg}
                    </motion.div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '2rem', marginBottom: '2rem' }} className="user-controls">
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button
                            onClick={() => setActiveTab('STUDENT')}
                            style={{
                                padding: '0.6rem 1.5rem',
                                borderRadius: '50px',
                                border: 'none',
                                background: activeTab === 'STUDENT' ? '#000' : '#fff',
                                color: activeTab === 'STUDENT' ? '#fff' : '#666',
                                fontWeight: 800,
                                cursor: 'pointer',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
                            }}
                        >
                            Students
                        </button>
                        <button
                            onClick={() => setActiveTab('LECTURER')}
                            style={{
                                padding: '0.6rem 1.5rem',
                                borderRadius: '50px',
                                border: 'none',
                                background: activeTab === 'LECTURER' ? '#000' : '#fff',
                                color: activeTab === 'LECTURER' ? '#fff' : '#666',
                                fontWeight: 800,
                                cursor: 'pointer',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
                            }}
                        >
                            Admins / Lecturers
                        </button>
                    </div>

                    <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
                        <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.3 }} size={18} />
                        <input
                            type="text"
                            placeholder="Search by name, email, or username..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.8rem 1rem 0.8rem 3rem',
                                borderRadius: '15px',
                                border: '1px solid #eee',
                                outline: 'none',
                                fontWeight: 600,
                                fontSize: '0.9rem'
                            }}
                        />
                    </div>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '4rem' }}>Loading users...</div>
                ) : filteredUsers.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '4rem', background: '#fff', borderRadius: '24px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                        No users found in this category.
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        {filteredUsers.map(user => (
                            <motion.div
                                key={user.id}
                                layout
                                style={{
                                    background: '#fff',
                                    padding: '1.25rem 2rem',
                                    borderRadius: '24px',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    border: '2px solid transparent',
                                    transition: 'all 0.2s',
                                }}
                                className="user-card"
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                    <div style={{
                                        width: '45px',
                                        height: '45px',
                                        background: (user.role === 'LECTURER' || user.role === 'ADMIN') ? '#000' : '#f3f4f6',
                                        borderRadius: '12px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: (user.role === 'LECTURER' || user.role === 'ADMIN') ? '#fff' : '#000'
                                    }}>
                                        {(user.role === 'LECTURER' || user.role === 'ADMIN') ? <Shield size={20} /> : <User size={20} />}
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 800, fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            {user.fullName || 'No Name'} {user.id === currentUser?.id && <span style={{ fontSize: '0.65rem', background: '#e0f2fe', color: '#0369a1', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>YOU</span>}
                                        </div>
                                        <div style={{ fontSize: '0.8rem', opacity: 0.5, fontWeight: 600 }}>@{user.username} • {user.email || 'No Email'}</div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    {user.id !== currentUser?.id && (
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button
                                                onClick={() => handleUpdateRole(user.id, (user.role === 'LECTURER' || user.role === 'ADMIN') ? 'STUDENT' : 'LECTURER')}
                                                style={{
                                                    padding: '0.5rem 1rem',
                                                    borderRadius: '10px',
                                                    border: '1px solid #eee',
                                                    background: '#fff',
                                                    fontSize: '0.75rem',
                                                    fontWeight: 800,
                                                    cursor: 'pointer',
                                                    textTransform: 'uppercase'
                                                }}
                                            >
                                                Make {(user.role === 'LECTURER' || user.role === 'ADMIN') ? 'Student' : 'Lecturer'}
                                            </button>
                                            <button
                                                onClick={() => handleDeleteUser(user.id)}
                                                style={{
                                                    padding: '0.5rem',
                                                    borderRadius: '10px',
                                                    border: 'none',
                                                    background: 'rgba(239, 68, 68, 0.1)',
                                                    color: '#ef4444',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @media (max-width: 768px) {
                    .nav-users { flex-direction: column; gap: 1rem; text-align: center; }
                    .user-controls { flex-direction: column; align-items: stretch !important; }
                    .user-card { flex-direction: column; align-items: flex-start !important; gap: 1.5rem; }
                    .user-card > div:last-child { width: 100%; border-top: 1px solid #eee; pt: 1rem; }
                }
            `}} />
        </div>
    );
};

export default LecturerUsers;
