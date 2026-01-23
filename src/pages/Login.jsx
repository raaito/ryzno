import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Shield, ArrowRight } from 'lucide-react';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (response.ok) {
                login(data.user, data.token);
                const origin = location.state?.from?.pathname || '/academy';
                navigate(origin);
            } else {
                setError(data.message || 'Login failed');
            }
        } catch (err) {
            setError('Connection error. Is the server running?');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', background: '#f8f9fa', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="auth-card"
                style={{ background: '#fff', padding: '3.5rem', borderRadius: '40px', boxShadow: '0 25px 60px rgba(0,0,0,0.04)', width: '100%', maxWidth: '480px', border: '1px solid rgba(0,0,0,0.02)' }}
            >
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <div style={{ display: 'inline-flex', padding: '1rem', borderRadius: '20px', background: 'rgba(245, 158, 11, 0.1)', color: 'var(--color-soar)', marginBottom: '1.5rem' }}>
                        <Shield size={32} />
                    </div>
                    <h1 className="auth-title" style={{ fontSize: '2rem', fontWeight: 900, color: '#000', letterSpacing: '-1px', marginBottom: '0.75rem' }}>Sentinel Access</h1>
                    <p style={{ color: '#666', fontWeight: 500 }}>Enter the Academy archives.</p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '2rem' }}>
                    <div style={{ display: 'grid', gap: '0.75rem' }}>
                        <label style={{ fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', opacity: 0.4, letterSpacing: '1.5px', marginLeft: '1rem' }}>Sentinel ID</label>
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            style={{ padding: '1.2rem 1.75rem', background: '#fcfcfc', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '50px', outline: 'none', fontSize: '1rem' }}
                            required
                        />
                    </div>

                    <div style={{ display: 'grid', gap: '0.75rem' }}>
                        <label style={{ fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', opacity: 0.4, letterSpacing: '1.5px', marginLeft: '1rem' }}>Access Key</label>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ padding: '1.2rem 1.75rem', background: '#fcfcfc', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '50px', outline: 'none', fontSize: '1rem' }}
                            required
                        />
                    </div>

                    {error && <p style={{ color: 'var(--color-restore)', textAlign: 'center', fontSize: '0.85rem', fontWeight: 800 }}>{error}</p>}

                    <button
                        disabled={loading}
                        style={{ padding: '1.3rem', background: '#000', color: '#fff', border: 'none', borderRadius: '50px', fontWeight: 900, fontSize: '1.1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginTop: '1rem', boxShadow: '0 15px 30px rgba(0,0,0,0.1)' }}
                    >
                        {loading ? 'Verifying...' : 'Authenticate Sentinel'} <ArrowRight size={20} />
                    </button>
                </form>

                {/* <div style={{ textAlign: 'center', marginTop: '2.5rem', color: '#666', fontSize: '0.9rem', fontWeight: 500 }}>
                    New recruit? <Link to="/register" style={{ color: '#000', fontWeight: 800, textDecoration: 'none' }}>Join the Movement</Link>
                </div> */}
            </motion.div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @media (max-width: 600px) {
                    .auth-card { padding: 2.5rem 1.5rem !important; border-radius: 30px !important; }
                    .auth-title { font-size: 1.5rem !important; }
                }
            ` }} />
        </div>
    );
};

export default Login;
