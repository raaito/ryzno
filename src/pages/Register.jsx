import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Star, ArrowRight, ShieldCheck, Mail, User } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        username: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { token } = useAuth();
    const navigate = useNavigate();

    // Redirect if already logged in
    React.useEffect(() => {
        if (token) {
            navigate('/academy', { replace: true });
        }
    }, [token, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('/api/auth/register', {
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
                navigate('/login', { state: { message: 'Registration successful! Welcome to the movement.' } });
            } else {
                setError(data.message || 'Registration failed');
            }
        } catch (err) {
            setError('Connection error. Is the server running?');
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = {
        padding: '1.2rem 1.75rem',
        background: '#fff',
        border: '1px solid rgba(0,0,0,0.08)',
        borderRadius: '50px', // Pill-shaped like the reference image
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
        <div style={{ minHeight: '100vh', background: '#f8f9fa', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="auth-card"
                style={{
                    background: '#fff',
                    padding: '4rem',
                    borderRadius: '50px',
                    boxShadow: '0 40px 100px rgba(0,0,0,0.05)',
                    width: '100%',
                    maxWidth: '1000px', // Wider for multi-column
                    border: '1px solid rgba(0,0,0,0.02)'
                }}
            >
                <div style={{ textAlign: 'center', marginBottom: '4.5rem' }} className="auth-header">
                    <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        style={{ display: 'inline-flex', padding: '1.25rem', borderRadius: '25px', background: 'rgba(245, 158, 11, 0.1)', color: 'var(--color-soar)', marginBottom: '2rem' }}>
                        <ShieldCheck size={40} />
                    </motion.div>
                    <h1 className="auth-title" style={{ fontSize: '3rem', fontWeight: 900, color: '#000', letterSpacing: '-1.5px', marginBottom: '1rem' }}>Initiation Portal</h1>
                    <p className="auth-subtitle" style={{ color: '#666', fontWeight: 500, fontSize: '1.1rem' }}>Enlist in the RYZNO Academy. High-capacity training awaits.</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form" style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '2rem' }}>

                    {/* 3 Column Row (Full Name, Email, Username) */}
                    <div className="grid-span-4" style={{ gridColumn: 'span 4' }}>
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

                    <div className="grid-span-4" style={{ gridColumn: 'span 4' }}>
                        <label style={labelStyle}>Digital Address</label>
                        <input
                            type="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            style={inputStyle}
                            required
                        />
                    </div>

                    <div className="grid-span-4" style={{ gridColumn: 'span 4' }}>
                        <label style={labelStyle}>Sentinel ID</label>
                        <input
                            type="text"
                            placeholder="Username"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            style={inputStyle}
                            required
                        />
                    </div>

                    {/* 2 Column Row (Password, Confirm Password) */}
                    <div className="grid-span-6" style={{ gridColumn: 'span 6' }}>
                        <label style={labelStyle}>Access Key</label>
                        <input
                            type="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            style={inputStyle}
                            required
                        />
                    </div>

                    <div className="grid-span-6" style={{ gridColumn: 'span 6' }}>
                        <label style={labelStyle}>Confirm Access</label>
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            style={inputStyle}
                            required
                        />
                    </div>

                    <div style={{ gridColumn: 'span 12' }}>
                        {error && (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                style={{ color: 'var(--color-restore)', textAlign: 'center', fontSize: '0.9rem', fontWeight: 800, margin: '1rem 0' }}
                            >
                                {error}
                            </motion.p>
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
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '1rem',
                                marginTop: '2rem',
                                boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                                transition: 'transform 0.2s'
                            }}
                            onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
                            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                        >
                            {loading ? 'Initializing Sentinel...' : 'Confirm Enrollment'} <ArrowRight size={22} />
                        </button>
                    </div>
                </form>

                <div style={{ textAlign: 'center', marginTop: '4rem', color: '#666', fontSize: '1rem', fontWeight: 500 }}>
                    Already an active Sentinel? <Link to="/login" style={{ color: '#000', fontWeight: 800, textDecoration: 'none' }}>Authenticate Here</Link>
                </div>
            </motion.div>

            <style dangerouslySetInnerHTML={{
                __html: `
                *, *::before, *::after { box-sizing: border-box; }
                @media (max-width: 900px) {
                    .auth-card { padding: 3rem 2rem !important; border-radius: 35px !important; }
                    .auth-title { font-size: 2.2rem !important; }
                    .grid-span-4, .grid-span-6 { grid-column: span 12 !important; }
                    .auth-header { marginBottom: 3rem !important; }
                }
                @media (max-width: 600px) {
                    .auth-card { padding: 2.25rem 1.25rem !important; border-radius: 30px !important; }
                    .auth-title { font-size: 1.8rem !important; }
                    .auth-subtitle { font-size: 1rem !important; }
                    .auth-form { gap: 1.25rem !important; }
                }
                input:focus {
                    border-color: var(--color-soar) !important;
                    box-shadow: 0 0 0 4px rgba(245, 158, 11, 0.05) !important;
                }
            ` }} />
        </div>
    );
};

export default Register;
