import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, Calendar, ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Contact = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="contact-page">
            <Navbar />
            <main style={{ paddingTop: '100px', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                <section id="contact" style={{ padding: '4rem 0', position: 'relative', width: '100%', overflow: 'hidden', flexGrow: 1, display: 'flex', alignItems: 'center' }}>
                    <div className="container" style={{ width: '100%', padding: '0 15px', boxSizing: 'border-box' }}>
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1 }}
                            className="glass"
                            style={{
                                padding: 'clamp(1.5rem, 5vw, 4rem)',
                                borderRadius: 'var(--radius-lg)',
                                display: 'grid',
                                gridTemplateColumns: '1fr 1.2fr',
                                gap: 'clamp(2rem, 5vw, 4rem)',
                                overflow: 'hidden',
                                position: 'relative',
                                background: 'linear-gradient(135deg, rgba(255,255,255,0.01) 0%, rgba(255,255,255,0.03) 100%)',
                                width: '100%',
                                boxSizing: 'border-box'
                            }}
                            id="contact-inner"
                        >
                            {/* Left Side: Info */}
                            <div className="contact-info" style={{ width: '100%' }}>
                                <h2 style={{
                                    fontSize: 'clamp(2rem, 8vw, 3.5rem)',
                                    marginBottom: '1.5rem',
                                    lineHeight: 1.1,
                                    fontWeight: 800,
                                    wordBreak: 'break-word'
                                }}>
                                    Begin Your <br />
                                    <span style={{ color: 'var(--color-soar)' }}>Transformation</span>
                                </h2>
                                <p style={{
                                    color: 'var(--text-secondary)',
                                    marginBottom: '2.5rem',
                                    fontSize: 'clamp(0.95rem, 4vw, 1.2rem)',
                                    lineHeight: 1.6,
                                    maxWidth: '100%'
                                }}>
                                    The journey of accountability and responsibility starts here. Reach out to join the Academy or book a private session.
                                </p>

                                <div style={{ display: 'grid', gap: '1.5rem' }}>
                                    <motion.div whileHover={{ x: 10 }} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                        <div className="glass" style={{ padding: '0.75rem', borderRadius: '12px', color: 'var(--color-soar)', boxShadow: '0 10px 30px rgba(245, 158, 11, 0.05)', flexShrink: 0 }}>
                                            <Calendar size={20} />
                                        </div>
                                        <div>
                                            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.2rem' }}>One-on-One Sessions</h4>
                                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Deep restoration and strategic guidance.</p>
                                        </div>
                                    </motion.div>

                                    <motion.div whileHover={{ x: 10 }} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                        <div className="glass" style={{ padding: '0.75rem', borderRadius: '12px', color: 'var(--color-restore)', boxShadow: '0 10px 30px rgba(239, 68, 68, 0.05)', flexShrink: 0 }}>
                                            <MessageSquare size={20} />
                                        </div>
                                        <div>
                                            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.2rem' }}>Academy Enrollment</h4>
                                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Become a Sentinel in the SOAR training system.</p>
                                        </div>
                                    </motion.div>
                                </div>
                            </div>

                            {/* Right Side: Form */}
                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8, delay: 0.5 }}
                                className="glass"
                                style={{
                                    padding: 'clamp(1rem, 4vw, 2.5rem)',
                                    background: 'rgba(255,255,255,0.5)',
                                    borderRadius: '20px',
                                    width: '100%',
                                    boxSizing: 'border-box'
                                }}
                            >
                                <form onSubmit={async (e) => {
                                    e.preventDefault();
                                    const formData = {
                                        name: e.target[0].value,
                                        email: e.target[1].value,
                                        message: e.target[2].value
                                    };
                                    try {
                                        const res = await fetch('/api/contact', {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify(formData)
                                        });
                                        if (res.ok) {
                                            alert('Message sent successfully!');
                                            e.target.reset();
                                        } else {
                                            alert('Failed to send message.');
                                        }
                                    } catch (err) {
                                        alert('Connection error.');
                                    }
                                }} style={{ display: 'grid', gap: '1rem', width: '100%' }}>
                                    <div style={{ display: 'grid', gap: '0.5rem' }}>
                                        <label style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Full Name</label>
                                        <input type="text" placeholder="John Doe" style={{
                                            padding: '0.8rem 1rem',
                                            background: 'rgba(255,255,255,0.8)',
                                            color: 'var(--text-primary)',
                                            borderRadius: '8px',
                                            border: '1px solid rgba(0,0,0,0.1)',
                                            outline: 'none',
                                            fontSize: '0.9rem',
                                            width: '100%',
                                            boxSizing: 'border-box'
                                        }} />
                                    </div>

                                    <div style={{ display: 'grid', gap: '0.5rem' }}>
                                        <label style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Email Address</label>
                                        <input type="email" placeholder="john@example.com" style={{
                                            padding: '0.8rem 1rem',
                                            background: 'rgba(255,255,255,0.8)',
                                            color: 'var(--text-primary)',
                                            borderRadius: '8px',
                                            border: '1px solid rgba(0,0,0,0.1)',
                                            outline: 'none',
                                            fontSize: '0.9rem',
                                            width: '100%',
                                            boxSizing: 'border-box'
                                        }} />
                                    </div>

                                    <div style={{ display: 'grid', gap: '0.5rem' }}>
                                        <label style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>How can we help?</label>
                                        <textarea placeholder="Tell us your story..." rows="3" style={{
                                            padding: '0.8rem 1rem',
                                            background: 'rgba(255,255,255,0.8)',
                                            color: 'var(--text-primary)',
                                            borderRadius: '8px',
                                            border: '1px solid rgba(0,0,0,0.1)',
                                            outline: 'none',
                                            fontSize: '0.9rem',
                                            resize: 'none',
                                            width: '100%',
                                            boxSizing: 'border-box'
                                        }}></textarea>
                                    </div>

                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="glow-soar" style={{
                                            padding: '1rem',
                                            background: 'var(--color-soar)',
                                            color: 'white',
                                            fontWeight: 800,
                                            borderRadius: '8px',
                                            border: 'none',
                                            marginTop: '0.5rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '0.75rem',
                                            cursor: 'pointer',
                                            fontSize: '0.95rem'
                                        }}>
                                        Send Message <ArrowRight size={18} />
                                    </motion.button>
                                </form>
                            </motion.div>
                        </motion.div>
                    </div>

                    <style dangerouslySetInnerHTML={{
                        __html: `
                @media (max-width: 860px) {
                  #contact-inner { grid-template-columns: 1fr !important; padding: 2rem 1.5rem !important; gap: 3rem !important; }
                  .contact-info { text-align: center; }
                  .contact-info div { justify-content: center; text-align: left; }
                  #contact { padding: 4rem 0 !important; }
                }
              ` }} />
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default Contact;
