import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Lock, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ChangePassword = () => {
    const { token, logout } = useAuth();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            const res = await fetch('/api/auth/change-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ newPassword })
            });

            if (res.ok) {
                setSuccess(true);
                setTimeout(() => {
                    navigate('/profile', { replace: true });
                }, 2000);
            } else {
                const data = await res.json();
                setError(data.message || 'Failed to update password');
            }
        } catch (err) {
            setError('Connection error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', background: '#f8f9fa', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{
                    background: '#fff',
                    padding: '4rem',
                    borderRadius: '40px',
                    boxShadow: '0 40px 80px rgba(0,0,0,0.06)',
                    width: '100%',
                    maxWidth: '550px',
                    textAlign: 'center',
                    border: '1px solid rgba(0,0,0,0.02)'
                }}
            >
                <div style={{ width: '80px', height: '80px', background: 'rgba(239, 68, 68, 0.08)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem auto' }}>
                    <Lock size={40} color="var(--color-restore)" />
                </div>

                <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '1rem', letterSpacing: '-1.5px' }}>Security First</h2>
                <p style={{ color: '#666', lineHeight: 1.6, marginBottom: '3rem', fontWeight: 500 }}>
                    We've created an account for you. For your security, please update your default password before accessing your profile.
                </p>

                {success ? (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ padding: '2rem', background: 'rgba(16, 185, 129, 0.05)', color: '#10b981', borderRadius: '25px', border: '1px solid rgba(16, 185, 129, 0.1)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                        <ShieldCheck size={48} />
                        <span style={{ fontWeight: 800 }}>Password updated! Heading to your profile...</span>
                    </motion.div>
                ) : (
                    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '2rem' }}>
                        <div style={{ textAlign: 'left' }}>
                            <label style={{ fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', opacity: 0.4, letterSpacing: '2px', marginLeft: '1.5rem', marginBottom: '0.75rem', display: 'block' }}>New Access Key</label>
                            <input
                                type="password"
                                placeholder="Min. 6 characters"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '1.25rem 2rem',
                                    background: '#fcfcfc',
                                    border: '1px solid rgba(0,0,0,0.08)',
                                    borderRadius: '50px',
                                    outline: 'none',
                                    fontSize: '1rem',
                                    boxSizing: 'border-box'
                                }}
                                required
                            />
                        </div>

                        <div style={{ textAlign: 'left' }}>
                            <label style={{ fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', opacity: 0.4, letterSpacing: '2px', marginLeft: '1.5rem', marginBottom: '0.75rem', display: 'block' }}>Confirm Key</label>
                            <input
                                type="password"
                                placeholder="Repeat your new password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '1.25rem 2rem',
                                    background: '#fcfcfc',
                                    border: '1px solid rgba(0,0,0,0.08)',
                                    borderRadius: '50px',
                                    outline: 'none',
                                    fontSize: '1rem',
                                    boxSizing: 'border-box'
                                }}
                                required
                            />
                        </div>

                        {error && (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: '#ef4444', fontSize: '0.85rem', fontWeight: 800 }}>
                                <AlertCircle size={16} /> {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                width: '100%',
                                padding: '1.5rem',
                                background: '#000',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '50px',
                                fontWeight: 900,
                                fontSize: '1.1rem',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '1rem',
                                boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                                marginTop: '1rem',
                                transition: 'all 0.3s'
                            }}
                        >
                            {loading ? 'Securing...' : 'Secure Account'} <ArrowRight size={22} />
                        </button>
                    </form>
                )}
            </motion.div>
        </div>
    );
};

export default ChangePassword;
