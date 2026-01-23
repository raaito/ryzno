import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Star, TrendingUp, CheckCircle, Award } from 'lucide-react';

const AcademyAdSection = () => {
    const [ad, setAd] = useState(null);

    useEffect(() => {
        fetch('/api/settings/academy-ad')
            .then(res => res.json())
            .then(data => setAd(data))
            .catch(err => console.error("Failed to load ad settings", err));
    }, []);

    if (!ad?.isVisible) return null;

    return (
        <section style={{
            background: '#fff',
            padding: '8rem 2rem',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Background elements */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '100%',
                background: 'radial-gradient(circle at 100% 0%, rgba(245, 158, 11, 0.08) 0%, transparent 40%)',
                zIndex: 0
            }} />

            <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
                <div className="ad-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6rem', alignItems: 'center' }}>

                    {/* Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.5rem 1rem',
                            background: 'rgba(245, 158, 11, 0.1)',
                            borderRadius: '50px',
                            color: '#d97706',
                            fontWeight: 800,
                            fontSize: '0.8rem',
                            marginBottom: '1.5rem',
                            letterSpacing: '1px'
                        }}>
                            <Award size={16} /> COURSE SPOTLIGHT
                        </div>

                        <h2 style={{ fontSize: '3rem', fontWeight: 900, lineHeight: 1.1, marginBottom: '1.5rem', color: '#1a1a1a' }}>
                            {ad.title}
                        </h2>

                        <p style={{ fontSize: '1.1rem', color: '#555', lineHeight: 1.8, marginBottom: '2.5rem', fontWeight: 500 }}>
                            {ad.description}
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '3rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#444' }}>
                                <CheckCircle size={20} color="#10b981" /> <span style={{ fontWeight: 600 }}>Biblical Principles of Wealth</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#444' }}>
                                <CheckCircle size={20} color="#10b981" /> <span style={{ fontWeight: 600 }}>Practical Financial Stewardship</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#444' }}>
                                <CheckCircle size={20} color="#10b981" /> <span style={{ fontWeight: 600 }}>Kingdom Legacy Building</span>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                            <div style={{ background: '#000', color: '#fff', padding: '1rem 2rem', borderRadius: '16px', display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                                <span style={{ fontSize: '0.9rem', fontWeight: 600, opacity: 0.8 }}>Access Fee:</span>
                                <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f59e0b' }}>₦{ad.price.toLocaleString()}</span>
                            </div>

                            <a
                                href={ad.buttonLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    textDecoration: 'none',
                                    color: '#000',
                                    fontWeight: 800,
                                    fontSize: '1rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    borderBottom: '2px solid #000',
                                    paddingBottom: '0.2rem'
                                }}
                            >
                                Enroll Now <ArrowRight size={20} />
                            </a>
                        </div>
                    </motion.div>

                    {/* Image/Visual */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        style={{ position: 'relative' }}
                    >
                        <div style={{
                            position: 'absolute',
                            inset: '-20px',
                            border: '2px solid rgba(245, 158, 11, 0.2)',
                            borderRadius: '30px',
                            zIndex: 0
                        }}></div>

                        <div style={{
                            borderRadius: '24px',
                            overflow: 'hidden',
                            boxShadow: '0 40px 80px -20px rgba(0,0,0,0.15)',
                            position: 'relative',
                            zIndex: 1
                        }}>
                            <img
                                src={ad.image}
                                alt={ad.title}
                                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                            />

                            <div style={{
                                position: 'absolute',
                                bottom: '2rem',
                                left: '2rem',
                                right: '2rem',
                                background: 'rgba(255,255,255,0.9)',
                                backdropFilter: 'blur(10px)',
                                padding: '1.5rem',
                                borderRadius: '16px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
                            }}>
                                <div style={{ background: '#f59e0b', padding: '0.8rem', borderRadius: '12px', color: '#fff' }}>
                                    <TrendingUp size={24} />
                                </div>
                                <div>
                                    <h4 style={{ fontSize: '0.9rem', fontWeight: 800, margin: 0 }}>Instant Access</h4>
                                    <p style={{ fontSize: '0.8rem', color: '#666', margin: 0 }}>Automated enrollment via Selar</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @media (max-width: 900px) {
                    .ad-grid { grid-template-columns: 1fr !important; gap: 4rem !important; }
                }
            `}} />
        </section>
    );
};

export default AcademyAdSection;
