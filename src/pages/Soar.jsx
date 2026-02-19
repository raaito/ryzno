import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, Shield, Sparkles, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PillarContact from '../components/PillarContact';
import AcademyAdSection from '../components/AcademyAdSection';
import soarImg from '../assets/soar.png';

const Soar = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const cards = [
        {
            icon: <Eye size={32} color="var(--color-soar)" />,
            title: "Watchers",
            desc: "Observing trends, spirits, and systems without being shaped by them. Watchers are the alert eyes of the community, discerning the times and seasons with divine clarity.",
            items: ['Vigilance', 'Perception', 'Discernment', 'Environmental Awareness']
        },
        {
            icon: <Shield size={32} color="var(--color-soar)" />,
            title: "Guardians",
            desc: "Preserving truth and legacy in a shifting culture. Guardians stand at the gates of our values, ensuring that the essence of our faith remains untainted by external pressures.",
            items: ['Stewardship', 'Moral Strength', 'Preservation', 'Legacy Building']
        },
        {
            icon: <Sparkles size={32} color="var(--color-soar)" />,
            title: "Mystics",
            desc: "Decoding unseen structures shaping human behaviour as revealed by the spirit. Mystics bridge the gap between the seen and unseen, translating spiritual truth into practical wisdom.",
            items: ['Reflection', 'Intuition', 'Decoding', 'Spiritual Insight']
        }
    ];

    const faqs = [
        { q: "What is the Academy?", a: "SOAR for Ryzno Academy is our elite training program designed to cultivate individuals who embody authenticity and moral authority. It focuses on spiritual grounding and cultural relevance." },
        { q: "How do I get access to the Academy?", a: "Access is granted through an inquiry process. Start by filling out the contact form below or clicking 'Register Now' to express your interest." },
        { q: "What are the requirements for enrollment?", a: "We look for a commitment to personal growth, accountability, and a willingness to engage in deep spiritual and practical training." },
        { q: "Is there a cost for the program?", a: "Specific program costs and scholarship opportunities are shared with applicants during the initial discovery phase." }
    ];

    return (
        <div className="soar-page">
            <Navbar />
            <main style={{ paddingTop: '100px' }}>
                <section style={{ padding: '4rem 0' }}>
                    <div className="container">
                        <Link to="/" style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            color: 'var(--text-secondary)',
                            textDecoration: 'none',
                            marginBottom: '2rem',
                            fontSize: '0.9rem',
                            fontWeight: 500,
                            transition: 'color 0.3s'
                        }} className="back-link">
                            <ArrowLeft size={16} /> Back to Home
                        </Link>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center', marginBottom: '6rem' }} className="soar-hero-grid">
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                            >
                                <h1 style={{ fontSize: 'clamp(2.5rem, 8vw, 4rem)', color: 'var(--color-soar)', fontWeight: 800, marginBottom: '1.5rem', lineHeight: 1 }}>
                                    SOAR for Ryzno Academy
                                </h1>
                                <p style={{ fontSize: 'clamp(1.1rem, 4vw, 1.4rem)', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '2rem' }}>
                                    We cultivate individuals who embody authenticity and moral authority—people who are as spiritually grounded as they are culturally relevant.
                                </p>
                                <div className="glass" style={{ padding: '1.5rem', borderLeft: '4px solid var(--color-soar)' }}>
                                    <p style={{ fontStyle: 'italic', color: 'var(--text-primary)' }}>
                                        "The height of your influence is determined by the depth of your grounding."
                                    </p>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.8 }}
                                style={{ position: 'relative' }}
                            >
                                <div style={{
                                    borderRadius: 'var(--radius-lg)',
                                    overflow: 'hidden',
                                    aspectRatio: '1',
                                    border: '1px solid rgba(245, 158, 11, 0.2)',
                                    boxShadow: '0 0 60px rgba(245, 158, 11, 0.1)'
                                }}>
                                    <img src={soarImg} alt="SOAR Academy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                            </motion.div>
                        </div>

                        <div style={{ marginBottom: '4rem' }}>
                            <h2 style={{ fontSize: '2rem', marginBottom: '3rem', textAlign: 'center' }}>The SOAR Mandate</h2>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                                {cards.map((card, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.6, delay: i * 0.2 }}
                                        className="glass"
                                        style={{ padding: '2.5rem', height: '100%', display: 'flex', flexDirection: 'column' }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem' }}>
                                            <div className="glass" style={{ padding: '0.8rem', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.1)' }}>
                                                {card.icon}
                                            </div>
                                            <h3 style={{ fontSize: '1.75rem', fontWeight: 700 }}>{card.title}</h3>
                                        </div>
                                        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: 1.6, flexGrow: 1 }}>
                                            {card.desc}
                                        </p>
                                        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                                            {card.items.map((item, idx) => (
                                                <span key={idx} style={{
                                                    fontSize: '0.75rem',
                                                    padding: '0.4rem 1rem',
                                                    borderRadius: '50px',
                                                    background: 'rgba(245, 158, 11, 0.05)',
                                                    color: 'var(--color-soar)',
                                                    border: '1px solid rgba(245, 158, 11, 0.2)',
                                                    fontWeight: 600,
                                                    textTransform: 'uppercase'
                                                }}>{item}</span>
                                            ))}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        <div style={{ marginTop: '8rem' }}>
                            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, textAlign: 'center', marginBottom: '4rem' }}>Academy Access FAQ</h2>
                            <div style={{ maxWidth: '800px', margin: '0 auto', display: 'grid', gap: '1.5rem' }}>
                                {faqs.map((faq, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.1 }}
                                        className="glass"
                                        style={{ padding: '2rem', borderRadius: '20px' }}
                                    >
                                        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--color-soar)' }}>{faq.q}</h3>
                                        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>{faq.a}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>


                        <div className="glass" style={{ padding: '4rem 2rem', textAlign: 'center', marginTop: '4rem' }}>
                            <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Ready to Join the Academy?</h2>
                            <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 2.5rem auto', fontSize: '1.1rem' }}>
                                Join our community of Watchers, Guardians, and Mystics today.
                            </p>
                            <a href="#" target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ padding: '1rem 3rem', background: 'var(--color-soar)', color: 'white', textDecoration: 'none' }}>
                                Register Now
                            </a>
                        </div>
                    </div>
                </section>
            </main>
            <AcademyAdSection />
            <Footer />

            <style dangerouslySetInnerHTML={{
                __html: `
                .back-link:hover { color: var(--color-soar) !important; }
                @media (max-width: 968px) {
                    .soar-hero-grid { grid-template-columns: 1fr !important; text-align: center; gap: 3rem !important; }
                    .soar-hero-grid div:first-child { order: 2; }
                    .soar-hero-grid div:last-child { order: 1; }
                }
            `}} />
        </div>
    );
};

export default Soar;
