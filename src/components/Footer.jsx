import React from 'react';
import { motion } from 'framer-motion';
import { Instagram, Twitter, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';

import logo from '../assets/1000665431.png';

const Footer = () => {
    return (
        <footer style={{
            padding: '8rem 0 4rem 0',
            borderTop: '1px solid var(--glass-border)',
            background: 'linear-gradient(to bottom, #F8FAFC, #E2E8F0)',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Decorative Glow */}
            <div style={{
                position: 'absolute',
                bottom: '-10%',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '80%',
                height: '300px',
                background: 'radial-gradient(circle at center, rgba(245, 158, 11, 0.05) 0%, transparent 70%)',
                zIndex: 0
            }}></div>

            <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '2.5rem',
                    marginBottom: '6rem'
                }} className="footer-grid">
                    {/* Brand Column */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                            <img src={logo} alt="RYZNO" style={{ height: '50px', objectFit: 'contain' }} />
                        </Link>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '2.5rem', fontSize: '1rem', maxWidth: '400px' }}>
                            Risen and Ordained. Cultivating authenticity, moral authority, and spiritual grounding in a shifting culture.
                        </p>
                        <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--text-primary)' }}>
                            <motion.div whileHover={{ y: -3, color: 'var(--color-soar)' }}><Instagram size={22} style={{ opacity: 0.6, cursor: 'pointer' }} /></motion.div>
                            <motion.div whileHover={{ y: -3, color: 'var(--color-soar)' }}><Twitter size={22} style={{ opacity: 0.6, cursor: 'pointer' }} /></motion.div>
                            <motion.div whileHover={{ y: -3, color: 'var(--color-soar)' }}><Linkedin size={22} style={{ opacity: 0.6, cursor: 'pointer' }} /></motion.div>
                        </div>
                    </motion.div>

                    {/* Academy Column */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                    >
                        <h4 style={{ fontWeight: 800, marginBottom: '2rem', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '2px', color: 'var(--color-soar)' }}>S.O.A.R Academy</h4>
                        <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: '1rem' }}>
                            <li><motion.a whileHover={{ x: 5 }} href="#soar" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Sentinels Training</motion.a></li>
                            <li><motion.a whileHover={{ x: 5 }} href="#soar" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Watchers</motion.a></li>
                            <li><motion.a whileHover={{ x: 5 }} href="#soar" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Guardians</motion.a></li>
                            <li><motion.a whileHover={{ x: 5 }} href="#soar" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Mystics</motion.a></li>
                        </ul>
                    </motion.div>

                    {/* Healing Column */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                    >
                        <h4 style={{ fontWeight: 800, marginBottom: '2rem', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '2px', color: 'var(--color-restore)' }}>Healing</h4>
                        <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: '1rem' }}>
                            <li><motion.a whileHover={{ x: 5 }} href="#restore" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>The Blueprint</motion.a></li>
                            <li><motion.a whileHover={{ x: 5 }} href="#restore" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Transformation</motion.a></li>
                            <li><motion.a whileHover={{ x: 5 }} href="#restore" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>One-on-One</motion.a></li>
                        </ul>
                    </motion.div>

                    {/* Quick Links Column */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                    >
                        <h4 style={{ fontWeight: 800, marginBottom: '2rem', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '2px', color: 'var(--text-primary)' }}>Quick Links</h4>
                        <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: '1rem' }}>
                            <li><Link to="/about" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}><motion.span whileHover={{ x: 5, display: 'inline-block' }}>About Ryzno</motion.span></Link></li>
                            <li><motion.a whileHover={{ x: 5 }} href="#contact" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Inquiry Form</motion.a></li>
                            <li style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>info@ryzno.com</li>
                            <li><motion.a whileHover={{ x: 5 }} href="#home" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Back to top ^</motion.a></li>
                        </ul>
                    </motion.div>
                </div>

                <div style={{
                    paddingTop: '2.5rem',
                    borderTop: '1px solid rgba(0,0,0,0.05)',
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '2rem',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    color: 'var(--text-secondary)',
                    fontSize: '0.85rem'
                }}>
                    <p>&copy; {new Date().getFullYear()} RYZNO. Risen & Ordained.</p>
                    <div style={{ display: 'flex', gap: '2.5rem' }}>
                        <span style={{ cursor: 'pointer' }}>Privacy Policy</span>
                        <span style={{ cursor: 'pointer' }}>Terms of Service</span>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
        @media (max-width: 968px) {
          .footer-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 3rem !important; }
        }
        @media (max-width: 500px) {
          #footer .footer-grid { grid-template-columns: 1fr !important; text-align: center; }
          #footer .footer-grid > div { margin: 0 auto; }
          #footer .footer-grid ul { justify-items: center; }
        }
      ` }} />
        </footer>
    );
};

export default Footer;
