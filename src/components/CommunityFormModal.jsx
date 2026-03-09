import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, CheckCircle, Users, Heart, Camera, MapPin, Briefcase, MessageSquare } from 'lucide-react';

const CommunityFormModal = ({ isOpen, onClose }) => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('idle'); // idle, success, error
    const [formData, setFormData] = useState({
        firstName: '',
        surname: '',
        ageRange: '',
        phoneNumber: '',
        birthDay: '',
        birthMonth: '',
        stateOfResidence: '',
        profession: '',
        socialPlatforms: [],
        favouritePlatform: '',
        bestThing: '',
        heardAboutUs: '',
        reasonForJoining: '',
        activelyParticipate: ''
    });

    const [attemptedSubmit, setAttemptedSubmit] = useState(false);

    const socialOptions = ['Instagram', 'X (Twitter)', 'LinkedIn', 'Facebook', 'TikTok', 'YouTube', 'Threads'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString());

    const handleSocialToggle = (platform) => {
        setFormData(prev => ({
            ...prev,
            socialPlatforms: prev.socialPlatforms.includes(platform)
                ? prev.socialPlatforms.filter(p => p !== platform)
                : [...prev.socialPlatforms, platform]
        }));
    };

    const isStepValid = (s) => {
        if (s === 1) {
            return formData.firstName && formData.surname && formData.ageRange && formData.phoneNumber && formData.birthDay && formData.birthMonth && formData.stateOfResidence && formData.profession;
        }
        if (s === 2) {
            return formData.socialPlatforms.length > 0 && formData.favouritePlatform && formData.bestThing;
        }
        if (s === 3) {
            return formData.heardAboutUs && formData.reasonForJoining && formData.activelyParticipate;
        }
        return true;
    };

    const nextStep = () => {
        if (isStepValid(step)) {
            setStep(s => s + 1);
            setAttemptedSubmit(false);
        } else {
            setAttemptedSubmit(true);
        }
    };

    const prevStep = () => setStep(s => s - 1);

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        if (!isStepValid(3)) {
            setAttemptedSubmit(true);
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('/api/community/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setStatus('success');
                setTimeout(() => {
                    window.location.href = 'https://chat.whatsapp.com/B9B2IkLpJwnJziCsipSKAR?mode=hqrt3';
                }, 2000);
            } else {
                setStatus('error');
            }
        } catch (error) {
            console.error('Submission error:', error);
            setStatus('error');
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = (field) => ({
        width: '100%',
        padding: '1rem 1.25rem',
        borderRadius: '16px',
        border: `1.5px solid ${attemptedSubmit && !formData[field] ? '#ef4444' : 'rgba(0,0,0,0.1)'}`,
        background: 'rgba(255,255,255,0.8)',
        fontSize: '0.95rem',
        outline: 'none',
        transition: 'all 0.3s ease'
    });

    const labelStyle = {
        fontSize: '0.75rem',
        fontWeight: 800,
        textTransform: 'uppercase',
        opacity: 0.5,
        letterSpacing: '1px',
        marginBottom: '0.5rem',
        display: 'block'
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'rgba(0,0,0,0.6)',
                    backdropFilter: 'blur(8px)',
                    zIndex: 2000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '1rem'
                }}
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    style={{
                        background: '#F8FAFC',
                        width: '100%',
                        maxWidth: '600px',
                        borderRadius: '32px',
                        padding: '2.5rem',
                        position: 'relative',
                        maxHeight: '90vh',
                        overflowY: 'auto',
                        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)'
                    }}
                    onClick={e => e.stopPropagation()}
                >
                    <button
                        onClick={onClose}
                        style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: '#eee', border: 'none', borderRadius: '50%', padding: '0.5rem', cursor: 'pointer' }}
                    >
                        <X size={20} />
                    </button>

                    {status === 'success' ? (
                        <div style={{ textAlign: 'center', padding: '3rem 0' }}>
                            <CheckCircle size={80} color="#F59E0B" style={{ marginBottom: '1.5rem', margin: '0 auto' }} />
                            <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '1rem' }}>Welcome to RYZNO!</h2>
                            <p style={{ color: '#666', fontSize: '1.1rem' }}>Redirecting you to our WhatsApp community...</p>
                        </div>
                    ) : (
                        <>
                            <div style={{ marginBottom: '2.5rem' }}>
                                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                                    {[1, 2, 3].map(s => (
                                        <div key={s} style={{ height: '4px', flex: 1, background: s <= step ? '#F59E0B' : '#E2E8F0', borderRadius: '2px', transition: 'all 0.4s ease' }}></div>
                                    ))}
                                </div>
                                <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0F172A' }}>
                                    {step === 1 ? 'Join the Community' : step === 2 ? 'Your Presence' : 'Commitment'}
                                </h2>
                                <p style={{ opacity: 0.6, fontSize: '0.95rem' }}>
                                    {step === 1 ? 'Let\'s start with some basic details.' : step === 2 ? 'How do you express yourself?' : 'Final steps to join our tribe.'}
                                </p>
                            </div>

                            <form onSubmit={handleSubmit}>
                                {step === 1 && (
                                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                                            <div>
                                                <label style={labelStyle}>First Name</label>
                                                <input style={inputStyle('firstName')} placeholder="John" value={formData.firstName} onChange={e => setFormData({ ...formData, firstName: e.target.value })} />
                                            </div>
                                            <div>
                                                <label style={labelStyle}>Surname</label>
                                                <input style={inputStyle('surname')} placeholder="Doe" value={formData.surname} onChange={e => setFormData({ ...formData, surname: e.target.value })} />
                                            </div>
                                        </div>
                                        <div style={{ marginBottom: '1.25rem' }}>
                                            <label style={labelStyle}>Phone Number (WhatsApp)</label>
                                            <input style={inputStyle('phoneNumber')} placeholder="+234 ..." value={formData.phoneNumber} onChange={e => setFormData({ ...formData, phoneNumber: e.target.value })} />
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                                            <div>
                                                <label style={labelStyle}>Age Range</label>
                                                <select style={inputStyle('ageRange')} value={formData.ageRange} onChange={e => setFormData({ ...formData, ageRange: e.target.value })}>
                                                    <option value="">Select Age</option>
                                                    <option value="Under 18">Under 18</option>
                                                    <option value="18-25">18-25</option>
                                                    <option value="26-35">26-35</option>
                                                    <option value="36-45">36-45</option>
                                                    <option value="46+">46+</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label style={labelStyle}>State of Residence</label>
                                                <input style={inputStyle('stateOfResidence')} placeholder="Lagos, Nigeria" value={formData.stateOfResidence} onChange={e => setFormData({ ...formData, stateOfResidence: e.target.value })} />
                                            </div>
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                                            <div>
                                                <label style={labelStyle}>Birth Day</label>
                                                <select style={inputStyle('birthDay')} value={formData.birthDay} onChange={e => setFormData({ ...formData, birthDay: e.target.value })}>
                                                    <option value="">Day</option>
                                                    {days.map(d => <option key={d} value={d}>{d}</option>)}
                                                </select>
                                            </div>
                                            <div>
                                                <label style={labelStyle}>Birth Month</label>
                                                <select style={inputStyle('birthMonth')} value={formData.birthMonth} onChange={e => setFormData({ ...formData, birthMonth: e.target.value })}>
                                                    <option value="">Month</option>
                                                    {months.map(m => <option key={m} value={m}>{m}</option>)}
                                                </select>
                                            </div>
                                        </div>
                                        <div style={{ marginBottom: '1.25rem' }}>
                                            <label style={labelStyle}>Profession / Occupation</label>
                                            <input style={inputStyle('profession')} placeholder="Student, Engineer, etc." value={formData.profession} onChange={e => setFormData({ ...formData, profession: e.target.value })} />
                                        </div>
                                    </motion.div>
                                )}

                                {step === 2 && (
                                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                                        <div style={{ marginBottom: '1.5rem' }}>
                                            <label style={labelStyle}>Social Media Platforms</label>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                                {socialOptions.map(platform => (
                                                    <button
                                                        key={platform}
                                                        type="button"
                                                        onClick={() => handleSocialToggle(platform)}
                                                        style={{
                                                            padding: '0.6rem 1rem',
                                                            borderRadius: '50px',
                                                            border: '1.5px solid',
                                                            borderColor: formData.socialPlatforms.includes(platform) ? '#F59E0B' : '#E2E8F0',
                                                            background: formData.socialPlatforms.includes(platform) ? '#FFFBEB' : '#fff',
                                                            color: formData.socialPlatforms.includes(platform) ? '#F59E0B' : '#64748B',
                                                            fontSize: '0.85rem',
                                                            fontWeight: 700,
                                                            transition: 'all 0.2s'
                                                        }}
                                                    >
                                                        {platform}
                                                    </button>
                                                ))}
                                            </div>
                                            {attemptedSubmit && formData.socialPlatforms.length === 0 && <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.5rem' }}>Please select at least one</p>}
                                        </div>
                                        <div style={{ marginBottom: '1.5rem' }}>
                                            <label style={labelStyle}>Whch is your favourite platform?</label>
                                            <input style={inputStyle('favouritePlatform')} placeholder="e.g. Instagram" value={formData.favouritePlatform} onChange={e => setFormData({ ...formData, favouritePlatform: e.target.value })} />
                                        </div>
                                        <div style={{ marginBottom: '1.5rem' }}>
                                            <label style={labelStyle}>What is the best thing about you?</label>
                                            <textarea style={{ ...inputStyle('bestThing'), resize: 'none' }} rows="3" placeholder="Share a strength or gift..." value={formData.bestThing} onChange={e => setFormData({ ...formData, bestThing: e.target.value })} />
                                        </div>
                                    </motion.div>
                                )}

                                {step === 3 && (
                                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                                        <div style={{ marginBottom: '1.5rem' }}>
                                            <label style={labelStyle}>How did you hear about us?</label>
                                            <input style={inputStyle('heardAboutUs')} placeholder="Ad, Referral, Friend..." value={formData.heardAboutUs} onChange={e => setFormData({ ...formData, heardAboutUs: e.target.value })} />
                                        </div>
                                        <div style={{ marginBottom: '1.5rem' }}>
                                            <label style={labelStyle}>Why do you want to be a part of our community?</label>
                                            <textarea style={{ ...inputStyle('reasonForJoining'), resize: 'none' }} rows="3" placeholder="Your hopes and growth..." value={formData.reasonForJoining} onChange={e => setFormData({ ...formData, reasonForJoining: e.target.value })} />
                                        </div>
                                        <div style={{ marginBottom: '1.5rem' }}>
                                            <label style={labelStyle}>Are you willing to commit to actively participating?</label>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                                {['Yes', 'No'].map(opt => (
                                                    <button
                                                        key={opt}
                                                        type="button"
                                                        onClick={() => setFormData({ ...formData, activelyParticipate: opt })}
                                                        style={{
                                                            padding: '1rem',
                                                            borderRadius: '16px',
                                                            border: '1.5px solid',
                                                            borderColor: formData.activelyParticipate === opt ? '#F59E0B' : '#E2E8F0',
                                                            background: formData.activelyParticipate === opt ? '#FFFBEB' : '#fff',
                                                            color: formData.activelyParticipate === opt ? '#F59E0B' : '#64748B',
                                                            fontWeight: 800,
                                                            transition: 'all 0.2s'
                                                        }}
                                                    >
                                                        {opt}
                                                    </button>
                                                ))}
                                            </div>
                                            {attemptedSubmit && !formData.activelyParticipate && <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.5rem' }}>Please select one</p>}
                                        </div>
                                    </motion.div>
                                )}

                                <div style={{ display: 'flex', gap: '1rem', marginTop: '3rem' }}>
                                    {step > 1 && (
                                        <button
                                            type="button"
                                            onClick={prevStep}
                                            style={{ flex: 1, padding: '1rem', borderRadius: '50px', border: '1px solid #E2E8F0', background: 'transparent', fontWeight: 700 }}
                                        >
                                            Back
                                        </button>
                                    )}
                                    <button
                                        type="button"
                                        onClick={step === 3 ? handleSubmit : nextStep}
                                        disabled={loading}
                                        style={{
                                            flex: 2,
                                            padding: '1rem',
                                            borderRadius: '50px',
                                            background: '#0F172A',
                                            color: '#fff',
                                            fontWeight: 900,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '0.75rem',
                                            cursor: loading ? 'not-allowed' : 'pointer',
                                            opacity: loading ? 0.7 : 1
                                        }}
                                    >
                                        {loading ? 'Submitting...' : step === 3 ? 'Join Community' : 'Next Step'}
                                        {!loading && (step === 3 ? <CheckCircle size={18} /> : <Send size={18} />)}
                                    </button>
                                </div>
                            </form>
                        </>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default CommunityFormModal;
