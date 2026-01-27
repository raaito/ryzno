import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, User, Mail, Phone, Calendar, Clock, CheckCircle, XCircle, Trash2, Eye, ExternalLink, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LecturerRestore = () => {
    const { token } = useAuth();
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedEntry, setSelectedEntry] = useState(null);
    const [status, setStatus] = useState('');
    const [filter, setFilter] = useState('all'); // all, pending, reviewed, scheduled, completed

    useEffect(() => {
        fetchRegistrations();
    }, [token]);

    const fetchRegistrations = async () => {
        try {
            const res = await fetch('/api/restore/registrations', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setRegistrations(data);
            }
        } catch (error) {
            console.error('Fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, newStatus) => {
        try {
            const res = await fetch(`/api/restore/registrations/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (res.ok) {
                setRegistrations(registrations.map(r => r.id === id ? { ...r, status: newStatus } : r));
                if (selectedEntry?.id === id) setSelectedEntry({ ...selectedEntry, status: newStatus });
                setStatus('Status updated successfully!');
                setTimeout(() => setStatus(''), 3000);
            }
        } catch (error) {
            setStatus('Failed to update status.');
        }
    };

    const deleteEntry = async (id) => {
        if (!window.confirm('Are you sure you want to delete this registration?')) return;
        try {
            const res = await fetch(`/api/restore/registrations/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                setRegistrations(registrations.filter(r => r.id !== id));
                setSelectedEntry(null);
                setStatus('Entry deleted.');
                setTimeout(() => setStatus(''), 3000);
            }
        } catch (error) {
            setStatus('Delete failed.');
        }
    };

    const filteredRegistrations = filter === 'all'
        ? registrations
        : registrations.filter(r => r.status === filter);

    const getStatusColor = (s) => {
        switch (s) {
            case 'pending': return '#f59e0b';
            case 'reviewed': return '#3b82f6';
            case 'scheduled': return '#8b5cf6';
            case 'completed': return '#10b981';
            default: return '#6b7280';
        }
    };

    return (
        <div style={{ background: '#f8f9fa', minHeight: '100vh', padding: '2rem' }}>
            <nav style={{ maxWidth: '1200px', margin: '0 auto 2rem auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} className="nav-restore">
                <Link to="/academy/lecturer" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#000', textDecoration: 'none', fontWeight: 800 }}>
                    <ArrowLeft size={20} /> Back to Dashboard
                </Link>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 900 }}>RESTORE Management</h1>
            </nav>

            <style dangerouslySetInnerHTML={{
                __html: `
                @media (max-width: 768px) {
                    .nav-restore { flex-direction: column; gap: 1rem; text-align: center; }
                    .modal-content { padding: 1.5rem !important; }
                    .info-grid { grid-template-columns: 1fr !important; gap: 1.5rem !important; }
                    .reg-card { flex-direction: column; align-items: flex-start !important; gap: 1rem; }
                    .reg-actions { width: 100%; justify-content: space-between; }
                    .status-buttons { flex-wrap: wrap; justify-content: center; }
                }
            `}} />

            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                {status && (
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ background: '#000', color: '#fff', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', textAlign: 'center', fontWeight: 700 }}>
                        {status}
                    </motion.div>
                )}

                <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                    {['all', 'pending', 'reviewed', 'scheduled', 'completed'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            style={{
                                padding: '0.6rem 1.25rem',
                                borderRadius: '50px',
                                border: 'none',
                                background: filter === f ? '#000' : '#fff',
                                color: filter === f ? '#fff' : '#666',
                                fontWeight: 700,
                                cursor: 'pointer',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                                textTransform: 'capitalize'
                            }}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '4rem' }}>Loading registrations...</div>
                ) : filteredRegistrations.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '4rem', background: '#fff', borderRadius: '24px' }}>No registrations found.</div>
                ) : (
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        {filteredRegistrations.map(reg => (
                            <motion.div
                                key={reg.id}
                                layoutId={reg.id}
                                style={{
                                    background: '#fff',
                                    padding: '1.5rem',
                                    borderRadius: '24px',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    cursor: 'pointer',
                                    border: '2px solid transparent',
                                    transition: 'all 0.2s'
                                }}
                                className="reg-card"
                                onClick={() => setSelectedEntry(reg)}
                                whileHover={{ scale: 1.01, borderColor: 'rgba(0,0,0,0.05)' }}
                            >
                                <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                                    <div>
                                        <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{reg.firstName} {reg.surname}</div>
                                        <div style={{ fontSize: '0.85rem', opacity: 0.6 }}>{reg.email} • {new Date(reg.createdAt).toLocaleDateString()}</div>
                                    </div>
                                    <div style={{ padding: '0.4rem 1rem', borderRadius: '50px', background: `${getStatusColor(reg.status)}15`, color: getStatusColor(reg.status), fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
                                        {reg.status}
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '0.75rem' }} className="reg-actions">
                                    <button onClick={(e) => { e.stopPropagation(); setSelectedEntry(reg); }} style={{ padding: '0.75rem', borderRadius: '12px', border: 'none', background: '#f3f4f6', cursor: 'pointer' }}><Eye size={18} /></button>
                                    <button onClick={(e) => { e.stopPropagation(); deleteEntry(reg.id); }} style={{ padding: '0.75rem', borderRadius: '12px', border: 'none', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={18} /></button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Detailed View Modal */}
            <AnimatePresence>
                {selectedEntry && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(5px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}
                        onClick={() => setSelectedEntry(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            style={{ background: '#fff', width: '100%', maxWidth: '800px', maxHeight: '90vh', borderRadius: '32px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
                            onClick={e => e.stopPropagation()}
                        >
                            <div style={{ padding: '2rem', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <h2 style={{ fontSize: '1.5rem', fontWeight: 900 }}>Registration Details</h2>
                                    <p style={{ fontSize: '0.85rem', opacity: 0.5 }}>ID: {selectedEntry.id}</p>
                                </div>
                                <button onClick={() => setSelectedEntry(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', opacity: 0.5 }}><XCircle size={24} /></button>
                            </div>

                            <div style={{ padding: '2rem', overflowY: 'auto', flex: 1 }} className="modal-content">
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '3rem' }} className="info-grid">
                                    <div>
                                        <h3 style={{ fontSize: '0.75rem', fontWeight: 800, opacity: 0.5, marginBottom: '1rem', textTransform: 'uppercase' }}>Participant info</h3>
                                        <div style={{ display: 'grid', gap: '1rem' }}>
                                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}><User size={16} opacity={0.5} /> <span style={{ fontWeight: 700 }}>{selectedEntry.firstName} {selectedEntry.surname}</span></div>
                                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}><Mail size={16} opacity={0.5} /> <span>{selectedEntry.email}</span></div>
                                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}><Phone size={16} opacity={0.5} /> <span>{selectedEntry.phoneNumber}</span></div>
                                            <div style={{ fontSize: '0.9rem' }}><span style={{ opacity: 0.5 }}>Occupation:</span> {selectedEntry.occupation}</div>
                                            <div style={{ fontSize: '0.9rem' }}><span style={{ opacity: 0.5 }}>Age/Gender:</span> {selectedEntry.ageRange} / {selectedEntry.gender}</div>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: '0.75rem', fontWeight: 800, opacity: 0.5, marginBottom: '1rem', textTransform: 'uppercase' }}>Session Info</h3>
                                        <div style={{ display: 'grid', gap: '1rem' }}>
                                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}><Clock size={16} opacity={0.5} /> <span style={{ fontWeight: 700 }}>{selectedEntry.preferredTime}</span></div>
                                            <div style={{ fontSize: '0.9rem' }}><span style={{ opacity: 0.5 }}>Duration:</span> {selectedEntry.duration}</div>
                                            <div style={{ fontSize: '0.9rem' }}><span style={{ opacity: 0.5 }}>Alternative Time:</span> {selectedEntry.alternativeTimeConsent ? 'Yes' : 'No'}</div>
                                            <div style={{ fontSize: '0.9rem' }}><span style={{ opacity: 0.5 }}>Fee Agreed:</span> {selectedEntry.feeAgreement ? 'Yes' : 'No'}</div>
                                            {selectedEntry.proofOfPayment && (
                                                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', color: 'var(--color-restore)', fontWeight: 700, fontSize: '0.9rem' }}>
                                                    <ExternalLink size={16} /> Proof: {selectedEntry.proofOfPayment}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div style={{ marginBottom: '2rem' }}>
                                    <h3 style={{ fontSize: '0.75rem', fontWeight: 800, opacity: 0.5, marginBottom: '1rem', textTransform: 'uppercase' }}>Areas of Concern</h3>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                                        {selectedEntry.concerns.map((c, i) => (
                                            <span key={i} style={{ padding: '0.4rem 0.8rem', background: '#f3f4f6', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 600 }}>{c}</span>
                                        ))}
                                    </div>
                                    <div style={{ background: '#f8f9fa', padding: '1.5rem', borderRadius: '20px' }}>
                                        <div style={{ fontWeight: 800, fontSize: '0.9rem', marginBottom: '0.5rem' }}>Most Pressing:</div>
                                        <p style={{ margin: 0, fontSize: '0.95rem' }}>{selectedEntry.mostPressingIssue}</p>
                                    </div>
                                </div>

                                <div style={{ marginBottom: '2rem' }}>
                                    <h3 style={{ fontSize: '0.75rem', fontWeight: 800, opacity: 0.5, marginBottom: '1rem', textTransform: 'uppercase' }}>The Story</h3>
                                    <p style={{ background: '#f8f9fa', padding: '1.5rem', borderRadius: '24px', margin: 0, lineHeight: 1.6 }}>{selectedEntry.story}</p>
                                </div>

                                <div style={{ marginBottom: '2rem' }}>
                                    <h3 style={{ fontSize: '0.75rem', fontWeight: 800, opacity: 0.5, marginBottom: '1rem', textTransform: 'uppercase' }}>Expectations</h3>
                                    <p style={{ background: '#f8f9fa', padding: '1.5rem', borderRadius: '24px', margin: 0, lineHeight: 1.6 }}>{selectedEntry.expectations}</p>
                                </div>

                                <div>
                                    <h3 style={{ fontSize: '0.75rem', fontWeight: 800, opacity: 0.5, marginBottom: '1rem', textTransform: 'uppercase' }}>Previous Support</h3>
                                    <p style={{ margin: 0 }}>{selectedEntry.previousSupport ? `Yes: ${selectedEntry.supportDetails}` : 'No previous support received.'}</p>
                                </div>
                            </div>

                            <div style={{ padding: '2rem', borderTop: '1px solid #eee', background: '#fcfcfc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} className="nav-restore">
                                <div style={{ display: 'flex', gap: '0.5rem' }} className="status-buttons">
                                    {['pending', 'reviewed', 'scheduled', 'completed'].map(s => (
                                        <button
                                            key={s}
                                            onClick={() => updateStatus(selectedEntry.id, s)}
                                            style={{
                                                padding: '0.6rem 1rem',
                                                borderRadius: '50px',
                                                border: 'none',
                                                background: selectedEntry.status === s ? getStatusColor(s) : '#eee',
                                                color: selectedEntry.status === s ? '#fff' : '#666',
                                                fontWeight: 800,
                                                fontSize: '0.7rem',
                                                cursor: 'pointer',
                                                textTransform: 'uppercase',
                                                transition: 'all 0.2s'
                                            }}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                                <button
                                    onClick={() => setSelectedEntry(null)}
                                    style={{ padding: '0.8rem 2rem', borderRadius: '50px', border: '1px solid #eee', background: '#fff', fontWeight: 800, cursor: 'pointer' }}
                                >
                                    Close
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default LecturerRestore;
