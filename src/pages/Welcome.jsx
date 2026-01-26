import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Rocket, ArrowRight, Mail, User, Lock, UserPlus } from 'lucide-react';

const Welcome = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        username: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setStatus('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        setStatus('Verifying your Selar purchase...');

        try {
            const response = await fetch('/api/auth/register-success', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fullName: formData.fullName,
                    email: formData.email,
                    username: formData.username,
                    password: formData.password
                })
            });

            const data = await response.json();

            if (response.ok) {
                setStatus('Purchase verified! Account created.');
                setTimeout(() => {
                    navigate('/login', { state: { message: 'Registration successful! Your credentials have also been sent to your email.' } });
                }, 2000);
            } else {
                setError(data.message || 'Verification failed');
            }
        } catch (err) {
            setError('Connection error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = {
        padding: '1.2rem 1.75rem',
        background: '#fff',
        border: '1px solid rgba(0,0,0,0.08)',
        borderRadius: '50px',
        outline: 'none',
        fontSize: '0.95rem',
        width: '100%',
        transition: 'all 0.2s ease',
        boxSizing: 'border-box'
    };

    const labelStyle = {
        fontSize: '0.7rem',
        fontWeight: 900,
        textTransform: 'uppercase',
        opacity: 0.4,
        letterSpacing: '1.5px',
        marginBottom: '0.75rem',
        display: 'block',
        marginLeft: '1rem'
    };

    return (
        <div style={{ minHeight: '100vh', background: '#f8f9fa', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '5px', background: 'linear-gradient(90deg, var(--color-soar), var(--color-roar))' }}></div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                    background: '#fff',
                    padding: '4rem',
                    borderRadius: '50px',
                    boxShadow: '0 50px 100px rgba(0,0,0,0.06)',
                    width: '100%',
                    maxWidth: '900px',
                    border: '1px solid rgba(0,0,0,0.02)',
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                {/* Background Decoration */}
                <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '300px', height: '300px', background: 'rgba(212, 163, 115, 0.03)', borderRadius: '50%', filter: 'blur(60px)' }}></div>

                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        style={{ display: 'inline-flex', padding: '1.5rem', borderRadius: '30px', background: 'rgba(212, 163, 115, 0.08)', color: 'var(--color-soar)', marginBottom: '2rem' }}>
                        <Rocket size={45} />
                    </motion.div>
                    <h1 style={{ fontSize: '3rem', fontWeight: 900, color: '#000', letterSpacing: '-1.5px', marginBottom: '1rem' }}>Welcome, Initiated</h1>
                    <p style={{ color: '#666', fontWeight: 500, fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
                        Congratulations on your payment! Use the email you used for Selar to claim your access to the Academy.
                    </p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>
                    <div className="form-group" style={{ gridColumn: 'span 1' }}>
                        <label style={labelStyle}>Full Identity</label>
                        <input
                            type="text"
                            placeholder="Full Name"
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            style={inputStyle}
                            required
                        />
                    </div>

                    <div className="form-group" style={{ gridColumn: 'span 1' }}>
                        <label style={labelStyle}>Digital Address (Used on Selar)</label>
                        <input
                            type="email"
                            placeholder="Email address"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            style={inputStyle}
                            required
                        />
                    </div>

                    <div className="form-group" style={{ gridColumn: 'span 2' }}>
                        <label style={labelStyle}>Desired Sentinel ID (Username)</label>
                        <input
                            type="text"
                            placeholder="Pick a unique username"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            style={inputStyle}
                            required
                        />
                    </div>

                    <div className="form-group" style={{ gridColumn: 'span 1' }}>
                        <label style={labelStyle}>Access Key (Password)</label>
                        <input
                            type="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            style={inputStyle}
                            required
                        />
                    </div>

                    <div className="form-group" style={{ gridColumn: 'span 1' }}>
                        <label style={labelStyle}>Confirm Access Key</label>
                        <input
                            type="password"
                            placeholder="Repeat password"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            style={inputStyle}
                            required
                        />
                    </div>

                    <div style={{ gridColumn: 'span 2', marginTop: '1rem' }}>
                        {error && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.05)', color: '#ef4444', borderRadius: '15px', fontSize: '0.9rem', fontWeight: 700, textAlign: 'center', marginBottom: '1.5rem', border: '1px solid rgba(239, 68, 68, 0.1)' }}>
                                {error}
                            </motion.div>
                        )}

                        {status && !error && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.05)', color: '#10b981', borderRadius: '15px', fontSize: '0.9rem', fontWeight: 700, textAlign: 'center', marginBottom: '1.5rem', border: '1px solid rgba(16, 185, 129, 0.1)' }}>
                                {status}
                            </motion.div>
                        )}

                        <button
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
                                opacity: loading ? 0.7 : 1,
                                transition: 'all 0.3s'
                            }}
                        >
                            {loading ? 'Processing...' : 'Verify Purchase & Finish'} <ArrowRight size={22} />
                        </button>
                    </div>
                </form>

                <div style={{ textAlign: 'center', marginTop: '3rem', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '2.5rem' }}>
                    <p style={{ color: '#999', fontSize: '0.9rem', fontWeight: 600 }}>
                        Already have an account? <Link to="/login" style={{ color: 'var(--color-soar)', textDecoration: 'none', fontWeight: 800 }}>Sign in instead</Link>
                    </p>
                </div>
            </motion.div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @media (max-width: 800px) {
                    .form-group { grid-column: span 2 !important; }
                    div[style*="padding: 4rem"] { padding: 2.5rem 1.5rem !important; }
                    h1 { font-size: 2.2rem !important; }
                }
            ` }} />
        </div>
    );
};

export default Welcome;
