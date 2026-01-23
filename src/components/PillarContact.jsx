import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle, AlertCircle, Eye, RefreshCw, Zap, Shield, Sparkles, Volume2 } from 'lucide-react';

const getPillarInfo = (source) => {
    switch (source) {
        case 'SOAR': return {
            icon: <Eye size={32} />,
            gradient: 'linear-gradient(135deg, #111 0%, #000 100%)',
            borderColor: '#B8860B',
            accent: '#FFD700',
            glow: 'rgba(255, 215, 0, 0.15)'
        };
        case 'RESTORE': return {
            icon: <RefreshCw size={32} />,
            gradient: 'linear-gradient(135deg, #FFF5F5 0%, #FFEBEB 100%)',
            borderColor: 'rgba(239, 68, 68, 0.2)',
            accent: '#ef4444',
            glow: 'rgba(239, 68, 68, 0.1)'
        };
        case 'ROAR': return {
            icon: <Volume2 size={32} />,
            gradient: 'linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 100%)',
            borderColor: 'rgba(139, 92, 246, 0.2)',
            accent: '#8b5cf6',
            glow: 'rgba(139, 92, 246, 0.1)'
        };
        default: return {
            icon: <Send size={32} />,
            gradient: '#fff',
            borderColor: '#eee',
            accent: '#000',
            glow: 'rgba(0,0,0,0.05)'
        };
    }
};

const PillarContact = ({ source, color = 'var(--color-soar)', title = "Enquire Now" }) => {
    const info = getPillarInfo(source);
    const [status, setStatus] = useState('idle'); // idle, sending, success, error

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('sending');

        const formData = {
            name: e.target.elements.name.value,
            email: e.target.elements.email.value,
            message: e.target.elements.message.value,
            source: source
        };
        console.log('Sending from PillarContact:', formData);

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                setStatus('success');
                e.target.reset();
            } else {
                setStatus('error');
            }
        } catch (err) {
            setStatus('error');
        }
    };

    const isDark = source === 'SOAR';

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass"
            style={{
                padding: '3.5rem',
                borderRadius: '40px',
                maxWidth: '650px',
                margin: '6rem auto',
                background: info.gradient,
                border: `1px solid ${info.borderColor}`,
                position: 'relative',
                overflow: 'hidden',
                boxShadow: `0 20px 40px ${info.glow}`
            }}
        >
            {/* Visual Decoration */}
            <div style={{ position: 'absolute', top: '-20px', right: '-20px', opacity: 0.05, transform: 'rotate(-15deg)', color: info.accent }}>
                {React.cloneElement(info.icon, { size: 120 })}
            </div>

            <div style={{ textAlign: 'center', marginBottom: '3rem', position: 'relative', zIndex: 1 }}>
                <div style={{
                    width: '64px',
                    height: '64px',
                    background: info.accent,
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.5rem auto',
                    color: isDark ? '#000' : '#fff',
                    boxShadow: `0 10px 30px -5px ${info.accent}`
                }}>
                    {info.icon}
                </div>
                <h2 style={{ fontSize: '2.25rem', fontWeight: 900, marginBottom: '0.75rem', letterSpacing: '-0.02em', color: isDark ? '#fff' : '#000' }}>{title}</h2>
                <p style={{ color: isDark ? 'rgba(255,255,255,0.6)' : 'var(--text-secondary)', fontSize: '1rem', fontWeight: 500 }}>
                    Inquire specifically about <span style={{ color: info.accent, fontWeight: 800 }}>{source}</span>.
                </p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem', position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'grid', gap: '0.6rem' }}>
                    <label style={{ fontSize: '0.7rem', fontWeight: 800, opacity: isDark ? 0.6 : 0.5, textTransform: 'uppercase', letterSpacing: '1px', color: isDark ? '#fff' : '#000' }}>Full Name</label>
                    <input name="name" type="text" required style={{
                        padding: '1.2rem',
                        background: isDark ? 'rgba(255,255,255,0.08)' : '#fff',
                        border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'transparent'}`,
                        borderRadius: '16px',
                        color: isDark ? '#fff' : 'var(--text-primary)',
                        outline: 'none',
                        fontSize: '1rem',
                        fontWeight: 500,
                        transition: 'all 0.3s',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.02)'
                    }} placeholder="Enter your full name" className="pillar-input" />
                </div>

                <div style={{ display: 'grid', gap: '0.6rem' }}>
                    <label style={{ fontSize: '0.7rem', fontWeight: 800, opacity: isDark ? 0.6 : 0.5, textTransform: 'uppercase', letterSpacing: '1px', color: isDark ? '#fff' : '#000' }}>Email Address</label>
                    <input name="email" type="email" required style={{
                        padding: '1.2rem',
                        background: isDark ? 'rgba(255,255,255,0.08)' : '#fff',
                        border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'transparent'}`,
                        borderRadius: '16px',
                        color: isDark ? '#fff' : 'var(--text-primary)',
                        outline: 'none',
                        fontSize: '1rem',
                        fontWeight: 500,
                        transition: 'all 0.3s',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.02)'
                    }} placeholder="you@example.com" className="pillar-input" />
                </div>

                <div style={{ display: 'grid', gap: '0.6rem' }}>
                    <label style={{ fontSize: '0.7rem', fontWeight: 800, opacity: isDark ? 0.6 : 0.5, textTransform: 'uppercase', letterSpacing: '1px', color: isDark ? '#fff' : '#000' }}>Your Message</label>
                    <textarea name="message" rows="4" required style={{
                        padding: '1.2rem',
                        background: isDark ? 'rgba(255,255,255,0.08)' : '#fff',
                        border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'transparent'}`,
                        borderRadius: '16px',
                        color: isDark ? '#fff' : 'var(--text-primary)',
                        outline: 'none',
                        fontSize: '1rem',
                        fontWeight: 500,
                        resize: 'none',
                        transition: 'all 0.3s',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.02)'
                    }} placeholder="Tell us more..."></textarea>
                </div>

                <motion.button
                    whileHover={{ scale: 1.02, translateY: -2 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={status === 'sending'}
                    style={{
                        padding: '1.2rem',
                        background: info.accent,
                        color: isDark ? '#000' : 'white',
                        border: 'none',
                        borderRadius: '16px',
                        fontWeight: 900,
                        fontSize: '1.1rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '1rem',
                        marginTop: '1rem',
                        opacity: status === 'sending' ? 0.7 : 1,
                        boxShadow: `0 15px 35px -10px ${info.glow}`
                    }}
                >
                    {status === 'sending' ? 'Sending...' : (
                        <>{title} <Send size={20} /></>
                    )}
                </motion.button>

                {status === 'success' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', justifyContent: 'center', marginTop: '1rem' }}>
                        <CheckCircle size={20} /> <span style={{ fontWeight: 600 }}>Message sent successfully!</span>
                    </motion.div>
                )}

                {status === 'error' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ef4444', justifyContent: 'center', marginTop: '1rem' }}>
                        <AlertCircle size={20} /> <span style={{ fontWeight: 600 }}>Failed to send message. Please try again.</span>
                    </motion.div>
                )}
            </form>

            <style dangerouslySetInnerHTML={{
                __html: `
                .pillar-input::placeholder {
                    color: ${isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'};
                }
                .pillar-input:focus {
                    border-color: ${info.accent} !important;
                    background: ${isDark ? 'rgba(255,255,255,0.1)' : '#fff'} !important;
                }
            `}} />
        </motion.div>
    );
};

export default PillarContact;
