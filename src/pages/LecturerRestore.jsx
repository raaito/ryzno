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
    const [reassignMode, setReassignMode] = useState(false);
    const [reassignData, setReassignData] = useState({ assignments: [], reason: '' });
    const [isConflict, setIsConflict] = useState(false);
    const [view, setView] = useState('list'); // list, calendar
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);

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
        // ... (existing code)
    };

    const handleReassign = async () => {
        if (!reassignData.reason) {
            setStatus('Please provide a reason for reassignment.');
            return;
        }

        try {
            const res = await fetch(`/api/restore/registrations/${selectedEntry.id}/reassign`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(reassignData)
            });

            const data = await res.json();

            if (res.ok) {
                setRegistrations(registrations.map(r => r.id === selectedEntry.id ? data.registration : r));
                setSelectedEntry(data.registration);
                setReassignMode(false);
                setReassignData({ assignments: [], reason: '' });
                setStatus('Session reassigned successfully!');
                setTimeout(() => setStatus(''), 3000);
            } else if (res.status === 409) {
                setIsConflict(true);
                setStatus(data.message);
            } else {
                setStatus(data.message || 'Reassignment failed.');
            }
        } catch (error) {
            setStatus('Error reassigning session.');
        }
    };

    const fetchNewAvailability = async (duration) => {
        // ... (existing code)
    };

    const getCalendarDays = () => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const days = [];
        // Fill leading empty days
        for (let i = 0; i < (firstDay === 0 ? 6 : firstDay - 1); i++) {
            days.push(null);
        }
        for (let d = 1; d <= daysInMonth; d++) {
            days.push(new Date(year, month, d));
        }
        return days;
    };

    const getAssignmentsForDate = (date) => {
        if (!date) return [];
        const dateStr = date.toISOString().split('T')[0];
        const results = [];
        registrations.forEach(reg => {
            reg.assignments?.forEach(assign => {
                const assignDate = new Date(assign.date).toISOString().split('T')[0];
                if (assignDate === dateStr) {
                    results.push({ ...assign, reg });
                }
            });
        });
        return results;
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
                    .calendar-day:hover { background: #f1f5f9 !important; transform: translateY(-2px); }
                }
            `}} />

            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                {status && (
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ background: '#000', color: '#fff', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', textAlign: 'center', fontWeight: 700 }}>
                        {status}
                    </motion.div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
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

                    <div style={{ background: '#fff', padding: '0.4rem', borderRadius: '50px', display: 'flex', gap: '0.25rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                        <button
                            onClick={() => setView('list')}
                            style={{ padding: '0.5rem 1.5rem', borderRadius: '50px', border: 'none', background: view === 'list' ? 'var(--color-restore)' : 'transparent', color: view === 'list' ? '#fff' : '#666', fontWeight: 800, cursor: 'pointer', fontSize: '0.8rem' }}
                        >
                            List
                        </button>
                        <button
                            onClick={() => setView('calendar')}
                            style={{ padding: '0.5rem 1.5rem', borderRadius: '50px', border: 'none', background: view === 'calendar' ? 'var(--color-restore)' : 'transparent', color: view === 'calendar' ? '#fff' : '#666', fontWeight: 800, cursor: 'pointer', fontSize: '0.8rem' }}
                        >
                            Calendar
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '4rem' }}>Loading registrations...</div>
                ) : view === 'list' ? (
                    filteredRegistrations.length === 0 ? (
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
                                        {reg.status === 'scheduled' && (!reg.assignments || reg.assignments.length === 0) && (
                                            <div style={{ padding: '0.4rem 1rem', borderRadius: '50px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', fontSize: '0.75rem', fontWeight: 800, border: '1px solid #ef4444' }}>
                                                ⚠️ MISSING FROM CALENDAR
                                            </div>
                                        )}
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.75rem' }} className="reg-actions">
                                        <button onClick={(e) => { e.stopPropagation(); setSelectedEntry(reg); }} style={{ padding: '0.75rem', borderRadius: '12px', border: 'none', background: '#f3f4f6', cursor: 'pointer' }}><Eye size={18} /></button>
                                        <button onClick={(e) => { e.stopPropagation(); deleteEntry(reg.id); }} style={{ padding: '0.75rem', borderRadius: '12px', border: 'none', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={18} /></button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )
                ) : (
                    <div style={{ background: '#fff', padding: '2rem', borderRadius: '32px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 900 }}>{currentMonth.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}</h2>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))} style={{ padding: '0.5rem', background: '#f3f4f6', border: 'none', borderRadius: '10px', cursor: 'pointer' }}><ArrowLeft size={16} /></button>
                                <button onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))} style={{ padding: '0.5rem', background: '#f3f4f6', border: 'none', borderRadius: '10px', cursor: 'pointer', transform: 'rotate(180deg)' }}><ArrowLeft size={16} /></button>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem' }}>
                            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                                <div key={day} style={{ textAlign: 'center', fontSize: '0.75rem', fontWeight: 900, opacity: 0.3, padding: '0.5rem' }}>{day}</div>
                            ))}
                            {getCalendarDays().map((date, i) => {
                                const dayAssignments = getAssignmentsForDate(date);
                                const isOfficialDay = date && [1, 2, 3, 5].includes(date.getDay()); // Mon, Tue, Wed, Fri

                                return (
                                    <div
                                        key={i}
                                        onClick={() => date && setSelectedDate(date)}
                                        style={{
                                            minHeight: '120px',
                                            padding: '0.75rem',
                                            background: date ? (isOfficialDay ? '#f8f9fa' : '#fff') : 'transparent',
                                            borderRadius: '16px',
                                            border: '1px solid #eee',
                                            position: 'relative',
                                            cursor: date ? 'pointer' : 'default',
                                            transition: 'transform 0.1s, background 0.2s'
                                        }}
                                        className="calendar-day"
                                    >
                                        {date && (
                                            <>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                                    <span style={{ fontSize: '0.85rem', fontWeight: 800, opacity: dayAssignments.length > 0 ? 1 : 0.3 }}>{date.getDate()}</span>
                                                    {isOfficialDay && dayAssignments.length < 3 && (
                                                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-restore)', opacity: 0.6 }}></div>
                                                    )}
                                                </div>
                                                <div style={{ display: 'grid', gap: '0.5rem' }}>
                                                    {dayAssignments.map((a, j) => (
                                                        <div
                                                            key={j}
                                                            onClick={(e) => { e.stopPropagation(); setSelectedEntry(a.reg); }}
                                                            style={{
                                                                fontSize: '0.7rem',
                                                                background: getStatusColor(a.reg.status),
                                                                color: '#fff',
                                                                padding: '0.3rem 0.5rem',
                                                                borderRadius: '6px',
                                                                fontWeight: 700,
                                                                cursor: 'pointer',
                                                                whiteSpace: 'nowrap',
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis'
                                                            }}
                                                            title={`${a.reg.firstName} ${a.reg.surname} - ${a.startTime}`}
                                                        >
                                                            {a.reg.firstName}
                                                        </div>
                                                    ))}
                                                    {isOfficialDay && dayAssignments.length < 3 && (
                                                        <div style={{ fontSize: '0.6rem', fontWeight: 700, color: 'var(--color-restore)', opacity: 0.4 }}>
                                                            {3 - dayAssignments.length} slots free
                                                        </div>
                                                    )}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
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
                                            <div style={{ display: 'grid', gap: '0.5rem' }}>
                                                {selectedEntry.assignments && selectedEntry.assignments.map((a, i) => (
                                                    <div key={i} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                                        <Clock size={16} opacity={0.5} />
                                                        <span style={{ fontWeight: 700 }}>
                                                            {new Date(a.date).toLocaleDateString()} @ {a.startTime}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                            <div style={{ fontSize: '0.9rem' }}><span style={{ opacity: 0.5 }}>Requested:</span> {selectedEntry.requestedDuration} Hours</div>
                                            <div style={{ fontSize: '0.9rem' }}><span style={{ opacity: 0.5 }}>Fee Agreed:</span> {selectedEntry.feeAgreement ? 'Yes' : 'No'}</div>

                                            <button
                                                onClick={() => {
                                                    setReassignMode(true);
                                                    fetchNewAvailability(selectedEntry.requestedDuration || 1);
                                                }}
                                                style={{
                                                    padding: '0.6rem 1rem',
                                                    borderRadius: '12px',
                                                    border: '1px solid #eee',
                                                    background: '#fff',
                                                    fontWeight: 800,
                                                    fontSize: '0.8rem',
                                                    cursor: 'pointer',
                                                    marginTop: '0.5rem'
                                                }}
                                            >
                                                🔄 Reassign Slots
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {selectedEntry.status === 'scheduled' && (!selectedEntry.assignments || selectedEntry.assignments.length === 0) && (
                                    <div style={{ background: '#fff4f4', padding: '1.5rem', borderRadius: '24px', marginBottom: '2rem', border: '1px dashed #ef4444' }}>
                                        <p style={{ margin: 0, color: '#ef4444', fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            ⚠️ This registration is missing from the calendar because it doesn't have assigned dates.
                                            Use the <strong>"Reassign Slots"</strong> button above to pick a calendar date.
                                        </p>
                                    </div>
                                )}

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

                                {reassignMode && (
                                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={{ marginTop: '2rem', padding: '2rem', background: '#fff4f4', borderRadius: '24px', border: '2px solid #ef4444' }}>
                                        <h3 style={{ fontSize: '1rem', fontWeight: 900, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ef4444' }}>
                                            <Clock size={20} /> Reassign Session
                                        </h3>

                                        <div style={{ marginBottom: '1.5rem' }}>
                                            <label style={{ fontSize: '0.8rem', fontWeight: 800, marginBottom: '0.5rem', display: 'block' }}>Reason for Reassignment (Sent to User) *</label>
                                            <textarea
                                                value={reassignData.reason}
                                                onChange={e => setReassignData({ ...reassignData, reason: e.target.value })}
                                                placeholder="e.g. Schedule conflict, lecturer unavailable, etc."
                                                style={{ width: '100%', padding: '1rem', borderRadius: '15px', border: '1px solid #eee', minHeight: '100px', resize: 'none' }}
                                            />
                                        </div>

                                        <div style={{ marginBottom: '1.5rem' }}>
                                            <label style={{ fontSize: '0.8rem', fontWeight: 800, marginBottom: '0.5rem', display: 'block' }}>New Assigned Slots</label>
                                            <div style={{ display: 'grid', gap: '0.5rem', background: '#fff', padding: '1rem', borderRadius: '15px', border: '1px solid #eee' }}>
                                                {reassignData.assignments.map((a, i) => (
                                                    <div key={i} style={{ display: 'flex', gap: '0.5rem', fontWeight: 700, fontSize: '0.9rem' }}>
                                                        <span>{new Date(a.date).toLocaleDateString()}</span> @ <span>{a.startTime}</span>
                                                    </div>
                                                ))}
                                                {reassignData.assignments.length === 0 && <span style={{ opacity: 0.5 }}>Identifying next free slots...</span>}
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', gap: '1rem' }}>
                                            <button
                                                onClick={handleReassign}
                                                style={{ flex: 2, padding: '1rem', borderRadius: '50px', border: 'none', background: '#ef4444', color: '#fff', fontWeight: 900, cursor: 'pointer' }}
                                            >
                                                Confirm & Inform User
                                            </button>
                                            <button
                                                onClick={() => { setReassignMode(false); setIsConflict(false); }}
                                                style={{ flex: 1, padding: '1rem', borderRadius: '50px', border: '1px solid #eee', background: '#fff', fontWeight: 800, cursor: 'pointer' }}
                                            >
                                                Cancel
                                            </button>
                                        </div>

                                        {isConflict && (
                                            <p style={{ marginTop: '1rem', color: '#ef4444', fontSize: '0.85rem', fontWeight: 700, textAlign: 'center' }}>
                                                ⚠️ Current slots are taken. Move existing occupant or pick another date.
                                            </p>
                                        )}
                                    </motion.div>
                                )}
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

            {/* Day Detail Modal */}
            <AnimatePresence>
                {selectedDate && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(5px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}
                        onClick={() => setSelectedDate(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            style={{ background: '#fff', width: '100%', maxWidth: '450px', borderRadius: '32px', overflow: 'hidden', boxShadow: '0 30px 60px rgba(0,0,0,0.12)' }}
                            onClick={e => e.stopPropagation()}
                        >
                            <div style={{ padding: '2rem', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fcfcfc' }}>
                                <div>
                                    <h2 style={{ fontSize: '1.25rem', fontWeight: 900 }}>{selectedDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</h2>
                                    <p style={{ fontSize: '0.8rem', opacity: 0.5, fontWeight: 700 }}>Daily Schedule Overview</p>
                                </div>
                                <button onClick={() => setSelectedDate(null)} style={{ background: '#eee', border: 'none', width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><XCircle size={18} opacity={0.5} /></button>
                            </div>

                            <div style={{ padding: '2rem' }}>
                                <div style={{ display: 'grid', gap: '1rem' }}>
                                    {[1, 2, 3, 5].includes(selectedDate.getDay()) ? (
                                        ['18:00', '19:00', '20:00'].map(time => {
                                            const assignment = getAssignmentsForDate(selectedDate).find(a => a.startTime === time);
                                            return (
                                                <div key={time} style={{ background: '#f8f9fa', padding: '1.25rem', borderRadius: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #eee' }}>
                                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                                        <Clock size={16} opacity={0.4} />
                                                        <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>{time}</div>
                                                    </div>

                                                    {assignment ? (
                                                        <button
                                                            onClick={() => { setSelectedEntry(assignment.reg); setSelectedDate(null); }}
                                                            style={{ padding: '0.6rem 1rem', background: getStatusColor(assignment.reg.status), color: '#fff', borderRadius: '12px', border: 'none', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                                                        >
                                                            {assignment.reg.firstName} <Eye size={14} />
                                                        </button>
                                                    ) : (
                                                        <div style={{ color: 'var(--color-restore)', fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px', background: 'rgba(239, 68, 68, 0.05)', padding: '0.4rem 0.8rem', borderRadius: '50px' }}>
                                                            Available
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div style={{ textAlign: 'center', padding: '2rem', opacity: 0.5, fontWeight: 700 }}>
                                            No sessions scheduled for this day (Mon, Tue, Wed, Fri only).
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div style={{ padding: '1.5rem', textAlign: 'center', background: '#fcfcfc', borderTop: '1px solid #eee' }}>
                                <button onClick={() => setSelectedDate(null)} style={{ padding: '0.8rem 2rem', borderRadius: '50px', background: '#000', color: '#fff', fontWeight: 800, width: '100%', cursor: 'pointer' }}>Done</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default LecturerRestore;
