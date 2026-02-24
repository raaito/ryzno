import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User, Mail, Phone, Briefcase, Calendar,
    ArrowRight, ArrowLeft, CheckCircle,
    Upload, AlertCircle, Heart, Shield,
    ChevronDown, Clock
} from 'lucide-react';

const RestoreForm = () => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('idle'); // idle, success, error
    const [assignmentsPreview, setAssignmentsPreview] = useState([]);
    const [formData, setFormData] = useState({
        firstName: '',
        surname: '',
        ageRange: '',
        gender: '',
        phoneNumber: '',
        email: '',
        occupation: '',
        concerns: [],
        otherConcern: '',
        mostPressingIssue: '',
        duration: '',
        previousSupport: null,
        supportDetails: '',
        story: '',
        consentToShare: false,
        expectations: '',
        requestedDuration: 1, // 1, 2, or 3 hours
        countryCode: '+234',
        feeAgreement: false,
        proofOfPayment: null
    });
    const [attemptedNext, setAttemptedNext] = useState(false);
    const [prevRecord, setPrevRecord] = useState(null);
    const [showResumptionModal, setShowResumptionModal] = useState(false);

    const steps = [
        { id: 1, title: 'Identity', icon: <User size={20} /> },
        { id: 2, title: 'Concerns', icon: <AlertCircle size={20} /> },
        { id: 3, title: 'Experience', icon: <Heart size={20} /> },
        { id: 4, title: 'Scheduling', icon: <Calendar size={20} /> },
        { id: 5, title: 'Commitment', icon: <Shield size={20} /> }
    ];

    const validatePhoneNumber = (code, number) => {
        if (!code || !number) return false;
        const cleanNumber = number.replace(/\D/g, '');
        const cleanCode = code.replace(/\D/g, '');

        // Validation logic for common country codes
        const rules = {
            '234': /^(\d{10,11})$/,      // Nigeria
            '1': /^(\d{10})$/,          // USA/Canada
            '44': /^(\d{10})$/,         // UK
            '233': /^(\d{9})$/,         // Ghana
            '27': /^(\d{9})$/,          // South Africa
            '254': /^(\d{9})$/          // Kenya
        };

        if (rules[cleanCode]) {
            return rules[cleanCode].test(cleanNumber);
        }

        // Generic fallback: most international numbers are 7-15 digits
        return cleanNumber.length >= 7 && cleanNumber.length <= 15;
    };

    const isStepValid = () => {
        switch (step) {
            case 1:
                return (
                    formData.firstName &&
                    formData.surname &&
                    formData.email &&
                    formData.countryCode &&
                    formData.phoneNumber &&
                    validatePhoneNumber(formData.countryCode, formData.phoneNumber) &&
                    formData.occupation &&
                    formData.ageRange &&
                    formData.gender &&
                    formData.consentToShare
                );
            case 2:
                return (
                    formData.concerns.length > 0 &&
                    formData.mostPressingIssue &&
                    formData.duration
                );
            case 3:
                return (
                    formData.story &&
                    formData.previousSupport !== null
                );
            case 4:
                return (
                    formData.expectations &&
                    formData.requestedDuration
                );
            case 5:
                if (formData.feeAgreement) return !!formData.proofOfPayment;
                if (formData.paymentPromise) return !!formData.paymentDate;
                return true;
            default:
                return true;
        }
    };

    const handleNext = () => {
        if (isStepValid()) {
            setStep(s => Math.min(s + 1, 6));
            setAttemptedNext(false);
            window.scrollTo(0, 0);
        } else {
            setAttemptedNext(true);
        }
    };

    const handleBack = () => setStep(s => Math.max(s - 1, 1));

    const handleCheckboxChange = (value) => {
        const current = [...formData.concerns];
        if (current.includes(value)) {
            setFormData({ ...formData, concerns: current.filter(v => v !== value) });
        } else {
            setFormData({ ...formData, concerns: [...current, value] });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isStepValid()) {
            setAttemptedNext(true);
            return;
        }
        setLoading(true);
        setAttemptedNext(false);
        setStatus('idle');

        try {
            const response = await fetch('/api/restore/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setStatus('success');
                setStep(6);
            } else {
                const errorData = await response.json().catch(() => ({}));
                console.error('Registration failed:', errorData);
                setStatus('error');
            }
        } catch (error) {
            console.error('Registration error:', error);
            setStatus('error');
        } finally {
            setLoading(false);
        }
    };

    const checkExistingRecord = async (email) => {
        if (!email || !email.includes('@')) return;
        try {
            const res = await fetch(`/api/restore/check-record?email=${email}`);
            const data = await res.json();
            if (data.found) {
                setPrevRecord(data.registration);
                setShowResumptionModal(true);
            }
        } catch (err) {
            console.error('Check record error:', err);
        }
    };

    const handleResume = () => {
        if (prevRecord) {
            const { assignments, status, createdAt, updatedAt, _id, __v, ...rest } = prevRecord;
            setFormData({
                ...formData,
                ...rest,
                feeAgreement: false,
                proofOfPayment: null
            });
            setShowResumptionModal(false);
        }
    };

    const inputStyle = {
        padding: '1.2rem 1.75rem',
        background: 'rgba(255,255,255,0.8)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(0,0,0,0.05)',
        borderRadius: '24px',
        outline: 'none',
        fontSize: '1rem',
        color: '#1a1a1a',
        width: '100%',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
    };

    const getFieldStyle = (value, isRequired = true) => {
        const isInvalid = attemptedNext && isRequired && !value;
        return {
            ...inputStyle,
            borderColor: isInvalid ? '#ef4444' : 'rgba(0,0,0,0.05)',
            background: isInvalid ? 'rgba(239, 68, 68, 0.05)' : 'rgba(255,255,255,0.8)',
            borderWidth: isInvalid ? '2px' : '1px'
        };
    };

    const labelStyle = {
        fontSize: '0.75rem',
        fontWeight: 800,
        textTransform: 'uppercase',
        opacity: 0.5,
        letterSpacing: '1px',
        marginBottom: '0.75rem',
        display: 'block',
        marginLeft: '0.5rem',
        color: '#000'
    };

    const sectionTitleStyle = {
        fontSize: '1.75rem',
        fontWeight: 900,
        marginBottom: '0.5rem',
        color: '#000',
        letterSpacing: '-0.5px'
    };

    const sectionDescStyle = {
        fontSize: '1rem',
        color: '#666',
        marginBottom: '2.5rem',
        lineHeight: 1.5
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                        <h2 style={sectionTitleStyle} className="restore-section-title">About You</h2>
                        <p style={sectionDescStyle}>In order to help you better, we will need these details from you.</p>

                        <div className="consent-box" style={{
                            background: (attemptedNext && !formData.consentToShare) ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.05)',
                            padding: '1.5rem',
                            borderRadius: '24px',
                            marginBottom: '2.5rem',
                            border: `2px solid ${(attemptedNext && !formData.consentToShare) ? '#ef4444' : 'rgba(239, 68, 68, 0.1)'}`,
                            transition: 'all 0.3s'
                        }}>
                            <label style={{ ...labelStyle, textTransform: 'none', opacity: 1, fontSize: '1rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    checked={formData.consentToShare}
                                    onChange={e => setFormData({ ...formData, consentToShare: e.target.checked })}
                                    style={{ width: '22px', height: '22px', cursor: 'pointer' }}
                                />
                                Do you consent to share this information for counselling purposes? *
                            </label>
                        </div>

                        <div className="restore-grid-2">
                            <div>
                                <label style={labelStyle}>First Name *</label>
                                <input
                                    style={getFieldStyle(formData.firstName)}
                                    className="restore-input"
                                    placeholder="Enter your first name"
                                    value={formData.firstName}
                                    onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                                />
                            </div>
                            <div>
                                <label style={labelStyle}>Surname *</label>
                                <input
                                    style={getFieldStyle(formData.surname)}
                                    className="restore-input"
                                    placeholder="Enter your surname"
                                    value={formData.surname}
                                    onChange={e => setFormData({ ...formData, surname: e.target.value })}
                                />
                            </div>
                            <div className="full-width">
                                <label style={labelStyle}>Email Address *</label>
                                <input
                                    type="email"
                                    style={getFieldStyle(formData.email)}
                                    className="restore-input"
                                    placeholder="you@example.com"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    onBlur={e => checkExistingRecord(e.target.value)}
                                />
                            </div>
                            <div>
                                <label style={labelStyle}>Phone Number (preferably WhatsApp) *</label>
                                <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '1rem' }}>
                                    <input
                                        style={getFieldStyle(formData.countryCode)}
                                        className="restore-input"
                                        placeholder="+234"
                                        value={formData.countryCode}
                                        onChange={e => {
                                            let val = e.target.value;
                                            if (val && !val.startsWith('+')) val = '+' + val.replace(/\D/g, '');
                                            setFormData({ ...formData, countryCode: val });
                                        }}
                                    />
                                    <div style={{ position: 'relative' }}>
                                        <input
                                            style={getFieldStyle(formData.phoneNumber)}
                                            className="restore-input"
                                            placeholder="Phone number"
                                            value={formData.phoneNumber}
                                            onChange={e => setFormData({ ...formData, phoneNumber: e.target.value.replace(/\D/g, '') })}
                                        />
                                        {formData.phoneNumber && !validatePhoneNumber(formData.countryCode, formData.phoneNumber) && (
                                            <span style={{ position: 'absolute', bottom: '-1.5rem', left: '0.5rem', color: '#ef4444', fontSize: '0.7rem', fontWeight: 700 }}>
                                                Invalid format for {formData.countryCode}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label style={labelStyle}>Occupation *</label>
                                <input
                                    style={getFieldStyle(formData.occupation)}
                                    className="restore-input"
                                    placeholder="Your current role"
                                    value={formData.occupation}
                                    onChange={e => setFormData({ ...formData, occupation: e.target.value })}
                                />
                            </div>
                            <div>
                                <label style={labelStyle}>Age Range *</label>
                                <select
                                    style={getFieldStyle(formData.ageRange)}
                                    className="restore-input"
                                    value={formData.ageRange}
                                    onChange={e => setFormData({ ...formData, ageRange: e.target.value })}
                                >
                                    <option value="">Select Age</option>
                                    <option value="18 - 24">18 - 24</option>
                                    <option value="25 - 34">25 - 34</option>
                                    <option value="35 - 44">35 - 44</option>
                                    <option value="45+">45+</option>
                                </select>
                            </div>
                            <div>
                                <label style={labelStyle}>Gender *</label>
                                <div className="gender-container" style={{
                                    padding: (attemptedNext && !formData.gender) ? '4px' : '0',
                                    borderRadius: '24px',
                                    border: (attemptedNext && !formData.gender) ? '2px solid #ef4444' : 'none'
                                }}>
                                    {['Male', 'Female'].map(g => (
                                        <label key={g} style={{
                                            flex: 1,
                                            padding: '1rem',
                                            borderRadius: '20px',
                                            background: formData.gender === g ? 'var(--color-restore)' : '#fff',
                                            color: formData.gender === g ? '#fff' : '#000',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer',
                                            border: formData.gender === g ? '1px solid transparent' : '1px solid rgba(0,0,0,0.05)',
                                            transition: 'all 0.3s'
                                        }}>
                                            <input
                                                type="radio"
                                                name="gender"
                                                style={{ display: 'none' }}
                                                onChange={() => setFormData({ ...formData, gender: g })}
                                                checked={formData.gender === g}
                                            />
                                            <span style={{ fontWeight: 700 }}>{g}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                );
            case 2:
                const concernOptions = [
                    "Spiritual Life & Faith Struggles",
                    "Identity & Purpose Confusion",
                    "Emotional & Mental Health Challenges",
                    "Trauma & Past Wounds",
                    "Abuse (Past or Present)",
                    "Grief, Loss & Bereavement",
                    "Relationship Challenges",
                    "Marriage & Intimate Relationship Issues",
                    "Family & Parental Issues",
                    "Financial Stress & Career Pressure",
                    "Academic & Educational Challenges",
                    "Self-Esteem & Confidence Issues",
                    "Addictions & Harmful Patterns",
                    "Life Transitions & Major Decisions",
                    "Inner Healing & Personal Growth",
                ];
                return (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                        <h2 style={sectionTitleStyle} className="restore-section-title">Primary Area(s) of Concern</h2>
                        <p style={sectionDescStyle}>Select all that apply. These help us identify your challenges.</p>
                        <div className="restore-grid-2 concerns-grid" style={{
                            padding: (attemptedNext && formData.concerns.length === 0) ? '8px' : '0',
                            borderRadius: '24px',
                            border: (attemptedNext && formData.concerns.length === 0) ? '2px solid #ef4444' : 'none'
                        }}>
                            {concernOptions.map(opt => (
                                <button
                                    key={opt}
                                    type="button"
                                    onClick={() => handleCheckboxChange(opt)}
                                    className={`concern-opt ${formData.concerns.includes(opt) ? 'active' : ''}`}
                                    style={{
                                        textAlign: 'left',
                                        padding: '1.2rem',
                                        borderRadius: '20px',
                                        fontSize: '0.9rem',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        border: '2px solid transparent'
                                    }}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                        <div style={{ display: 'grid', gap: '1.5rem' }}>
                            <div>
                                <label style={labelStyle}>Which of the selected issues affects you the most right now? *</label>
                                <select
                                    style={getFieldStyle(formData.mostPressingIssue)}
                                    value={formData.mostPressingIssue}
                                    onChange={e => setFormData({ ...formData, mostPressingIssue: e.target.value })}
                                >
                                    <option value="">Select the main issue</option>
                                    {formData.concerns.map(c => <option key={c} value={c}>{c}</option>)}
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label style={labelStyle}>How long have you been dealing with this issue? *</label>
                                <select
                                    style={getFieldStyle(formData.duration)}
                                    value={formData.duration}
                                    onChange={e => setFormData({ ...formData, duration: e.target.value })}
                                >
                                    <option value="">Select Duration</option>
                                    <option value="Less than 6 months">Less than 6 months</option>
                                    <option value="6 months - 1 year">6 months - 1 year</option>
                                    <option value="1 - 3 years">1 - 3 years</option>
                                    <option value="Over 3 years">Over 3 years</option>
                                </select>
                            </div>
                        </div>
                    </motion.div>
                );
            case 3:
                return (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                        <h2 style={sectionTitleStyle} className="restore-section-title">Your Story</h2>
                        <p style={sectionDescStyle}>Share only what you feel safe sharing. There is no right or wrong way.</p>
                        <div style={{ display: 'grid', gap: '1.5rem' }}>
                            <div>
                                <label style={labelStyle}>Please briefly describe what you are experiencing *</label>
                                <textarea
                                    style={{
                                        ...getFieldStyle(formData.story),
                                        borderRadius: '32px',
                                        resize: 'none',
                                        minHeight: '150px'
                                    }}
                                    rows="6"
                                    placeholder="Write your story here..."
                                    value={formData.story}
                                    onChange={e => setFormData({ ...formData, story: e.target.value })}
                                />
                            </div>
                            <div>
                                <label style={labelStyle}>Have you received support before? *</label>
                                <div style={{
                                    display: 'flex',
                                    gap: '1rem',
                                    marginTop: '0.5rem',
                                    padding: (attemptedNext && formData.previousSupport === null) ? '4px' : '0',
                                    borderRadius: '24px',
                                    border: (attemptedNext && formData.previousSupport === null) ? '2px solid #ef4444' : 'none'
                                }}>
                                    {[true, false].map(val => (
                                        <label key={val.toString()} style={{
                                            flex: 1,
                                            padding: '1.2rem',
                                            borderRadius: '24px',
                                            background: formData.previousSupport === val ? 'var(--color-restore)' : '#fff',
                                            color: formData.previousSupport === val ? '#fff' : '#000',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer',
                                            border: formData.previousSupport === val ? '1px solid transparent' : '1px solid rgba(0,0,0,0.05)',
                                            transition: 'all 0.3s'
                                        }}>
                                            <input
                                                type="radio"
                                                name="previousSupport"
                                                style={{ display: 'none' }}
                                                onChange={() => setFormData({ ...formData, previousSupport: val })}
                                                checked={formData.previousSupport === val}
                                            />
                                            <span style={{ fontWeight: 700 }}>{val ? 'Yes' : 'No'}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            {formData.previousSupport && (
                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                                    <label style={labelStyle}>If yes, what kind of support?</label>
                                    <input
                                        style={inputStyle}
                                        placeholder="e.g. Therapy, counseling, etc."
                                        value={formData.supportDetails}
                                        onChange={e => setFormData({ ...formData, supportDetails: e.target.value })}
                                    />
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                );
            case 4:
                const fetchPreview = async (dur) => {
                    try {
                        const res = await fetch(`/api/restore/availability?duration=${dur}`);
                        const data = await res.json();
                        setAssignmentsPreview(data);
                    } catch (err) {
                        console.error('Failed to fetch preview:', err);
                    }
                };

                return (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                        <h2 style={sectionTitleStyle} className="restore-section-title">Session Scheduling</h2>
                        <p style={sectionDescStyle}>The system automatically picks the earliest available slots on Mon, Tue, Wed, and Fri (3h max/day).</p>
                        <div style={{ display: 'grid', gap: '2rem' }}>
                            <div>
                                <label style={labelStyle}>What are you hoping to gain? *</label>
                                <textarea
                                    style={{ ...getFieldStyle(formData.expectations), borderRadius: '32px', resize: 'none' }}
                                    rows="4"
                                    placeholder="Clarity, healing, direction, or support?"
                                    value={formData.expectations}
                                    onChange={e => setFormData({ ...formData, expectations: e.target.value })}
                                />
                            </div>
                            <div>
                                <label style={labelStyle}>How many hours do you want your session to last? *</label>
                                <div className="restore-grid-2" style={{
                                    padding: (attemptedNext && !formData.requestedDuration) ? '8px' : '0',
                                    borderRadius: '32px',
                                    border: (attemptedNext && !formData.requestedDuration) ? '2px solid #ef4444' : 'none'
                                }}>
                                    {[1, 2, 3].map(dur => (
                                        <button
                                            key={dur}
                                            type="button"
                                            onClick={() => {
                                                setFormData({ ...formData, requestedDuration: dur });
                                                fetchPreview(dur);
                                            }}
                                            style={{
                                                padding: '1.2rem',
                                                borderRadius: '24px',
                                                background: formData.requestedDuration === dur ? '#000' : '#fff',
                                                color: formData.requestedDuration === dur ? '#fff' : '#000',
                                                border: formData.requestedDuration === dur ? '1px solid transparent' : '1px solid rgba(0,0,0,0.05)',
                                                fontWeight: 800,
                                                fontSize: '0.9rem',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '0.5rem'
                                            }}
                                        >
                                            <Clock size={16} /> {dur} {dur === 1 ? 'Hour' : 'Hours'}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {assignmentsPreview.length > 0 && (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{
                                    background: 'rgba(239, 68, 68, 0.05)',
                                    padding: '2rem',
                                    borderRadius: '32px',
                                    border: '1px solid rgba(239, 68, 68, 0.1)'
                                }}>
                                    <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--color-restore)', marginBottom: '1rem', textTransform: 'uppercase' }}>Assigned Slots</h4>
                                    <div style={{ display: 'grid', gap: '0.75rem' }}>
                                        {assignmentsPreview.map((a, idx) => (
                                            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '1rem', fontWeight: 700 }}>
                                                <Calendar size={18} opacity={0.5} />
                                                <span>{new Date(a.date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
                                                <span style={{ opacity: 0.5 }}>@</span>
                                                <span>{a.startTime}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <p style={{ marginTop: '1rem', fontSize: '0.85rem', opacity: 0.6, fontStyle: 'italic' }}>
                                        {assignmentsPreview.length > 1 ? "Note: Your session has been split across multiple days due to availability." : "Your session will be completed in a single day."}
                                    </p>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                );
            case 5:
                return (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                        <h2 style={sectionTitleStyle} className="restore-section-title">Commitment & Fees</h2>
                        <div style={{ background: 'rgba(239, 68, 68, 0.05)', padding: '2rem', borderRadius: '32px', marginBottom: '2.5rem', border: '1px solid rgba(239, 68, 68, 0.1)' }}>
                            <p style={{ color: '#000', fontWeight: 600, marginBottom: '1rem', lineHeight: 1.6 }}>
                                NOTE: The RESTORE Session is a guided one-on-one counselling session designed to offer focused care and support.
                            </p>
                            <p style={{ color: '#000', fontSize: '0.95rem', lineHeight: 1.6 }}>
                                Each session lasts 60 minutes and requires a commitment fee of <strong>₦5,000 / $5</strong> to help us prepare adequately and honour the time set aside for you.
                            </p>
                        </div>
                        <div style={{ display: 'grid', gap: '2rem' }}>
                            <label style={{
                                ...labelStyle,
                                textTransform: 'none',
                                opacity: 1,
                                fontSize: '1.1rem',
                                fontWeight: 800,
                                marginBottom: '2rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1.5rem',
                                cursor: 'pointer',
                                background: '#fff',
                                padding: '1.5rem',
                                borderRadius: '24px',
                                border: (attemptedNext && !formData.feeAgreement) ? '2px solid #ef4444' : `2px solid ${formData.feeAgreement ? 'var(--color-restore)' : '#eee'}`,
                                transition: 'all 0.3s'
                            }}>
                                <input
                                    type="checkbox"
                                    checked={formData.feeAgreement}
                                    onChange={e => setFormData({ ...formData, feeAgreement: e.target.checked })}
                                    style={{ width: '24px', height: '24px' }}
                                />
                                Are you willing to pay the commitment fee per session? *
                            </label>

                            {formData.feeAgreement && (
                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'grid', gap: '2rem' }}>
                                    <div style={{ background: '#f8f9fa', padding: '2.5rem', borderRadius: '32px', border: '1px solid #eee' }} className="payment-details-container">
                                        <h3 style={{ fontSize: '1.1rem', fontWeight: 900, marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Payment Details</h3>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }} className="payment-details-grid">
                                            <div>
                                                <p style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-restore)', marginBottom: '0.5rem' }}>NIGERIAN ACCOUNT</p>
                                                <p style={{ fontWeight: 800, fontSize: '1.1rem' }}>Zenith Bank</p>
                                                <p style={{ fontWeight: 500, opacity: 0.7 }}>Victor Achimugu</p>
                                                <p style={{ fontWeight: 900, fontSize: '1.3rem', marginTop: '0.5rem', letterSpacing: '1px' }}>2123932730</p>
                                            </div>
                                            <div>
                                                <p style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-restore)', marginBottom: '0.5rem' }}>AMERICAN ACCOUNT</p>
                                                <p style={{ fontWeight: 800, fontSize: '1.1rem' }}>Lead Bank</p>
                                                <p style={{ fontWeight: 500, opacity: 0.7 }}>Victor Enyone Achimugu</p>
                                                <p style={{ fontWeight: 900, fontSize: '1.3rem', marginTop: '0.5rem', letterSpacing: '1px' }}>216019310785</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <label style={labelStyle}>Snapshot or Proof of Payment (Image Only) *</label>
                                        <div style={{
                                            padding: '3rem',
                                            background: '#fff',
                                            borderRadius: '32px',
                                            border: (attemptedNext && !formData.proofOfPayment) ? '2px dashed #ef4444' : '2px dashed #eee',
                                            textAlign: 'center',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s'
                                        }} onClick={() => document.getElementById('file-upload').click()}>
                                            <input
                                                id="file-upload"
                                                type="file"
                                                accept="image/*"
                                                style={{ display: 'none' }}
                                                onChange={e => setFormData({ ...formData, proofOfPayment: e.target.files[0] ? e.target.files[0].name : null })}
                                            />
                                            <Upload style={{ margin: '0 auto 1.5rem auto', color: (attemptedNext && !formData.proofOfPayment) ? '#ef4444' : 'var(--color-restore)' }} size={48} />
                                            <p style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.5rem', color: (attemptedNext && !formData.proofOfPayment) ? '#ef4444' : '#000' }}>
                                                {formData.proofOfPayment ? formData.proofOfPayment : 'Click to upload proof'}
                                            </p>
                                            <p style={{ fontSize: '0.85rem', opacity: 0.5 }}>Image formats only. Max 10 MB.</p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {attemptedNext && !formData.feeAgreement && (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ background: '#fff4f4', padding: '1.5rem', borderRadius: '24px', border: '1px solid #ef4444' }}>
                                    <p style={{ color: '#ef4444', fontWeight: 700, fontSize: '0.9rem', marginBottom: '1rem' }}>
                                        ⚠️ Note: Without payment, you cannot book a session right now.
                                    </p>
                                    <label style={{ ...labelStyle, textTransform: 'none', opacity: 1, fontSize: '1rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}>
                                        <input
                                            type="checkbox"
                                            checked={formData.paymentPromise}
                                            onChange={e => setFormData({ ...formData, paymentPromise: e.target.checked })}
                                            style={{ width: '22px', height: '22px' }}
                                        />
                                        Would you like to book and pay for a later date?
                                    </label>

                                    {formData.paymentPromise && (
                                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={{ marginTop: '1.5rem' }}>
                                            <label style={labelStyle}>When do you plan to make the payment?</label>
                                            <input
                                                type="date"
                                                style={getFieldStyle(formData.paymentDate)}
                                                value={formData.paymentDate}
                                                onChange={e => setFormData({ ...formData, paymentDate: e.target.value })}
                                                min={new Date().toISOString().split('T')[0]}
                                            />
                                            <p style={{ fontSize: '0.8rem', opacity: 0.6, marginTop: '0.5rem' }}>
                                                We will send you a reminder on this day. Once paid, you will be assigned a slot.
                                            </p>
                                        </motion.div>
                                    )}
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                );
            case 6:
                return (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                        <div style={{ width: '100px', height: '100px', background: 'var(--color-restore)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2.5rem auto', boxShadow: '0 20px 40px rgba(239, 68, 68, 0.3)' }}>
                            <CheckCircle size={50} color="#fff" />
                        </div>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '1.5rem' }}>
                            {formData.feeAgreement ? "Registration Complete!" : (formData.paymentPromise ? "Payment Promise Recorded" : "Registration Saved")}
                        </h2>
                        <p style={{ fontSize: '1.2rem', color: '#666', lineHeight: 1.6, maxWidth: '600px', margin: '0 auto' }}>
                            {formData.feeAgreement
                                ? "Your restoration session has been scheduled. Please check your Email and WhatsApp for confirmation details."
                                : (formData.paymentPromise
                                    ? `We have recorded your promise to pay on ${new Date(formData.paymentDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })}. A reminder will be sent to you then!`
                                    : "Your information has been saved in our system. You can reach out to us whenever you are ready to proceed with a booking.")
                            }
                        </p>
                        <button
                            onClick={() => window.location.href = '/'}
                            style={{
                                marginTop: '3rem',
                                padding: '1.2rem 3rem',
                                background: '#000',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '50px',
                                fontWeight: 800,
                                fontSize: '1rem',
                                cursor: 'pointer'
                            }}
                        >
                            Return to Homepage
                        </button>
                    </motion.div>
                );
            default:
                return null;
        }
    };

    const isCurrentStepValid = isStepValid();

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative' }} className="restore-form-container">
            {/* Progress Bar */}
            {step < 6 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4rem', padding: '0 1rem', position: 'relative', overflowX: 'auto', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' }} className="restore-progress-bar">
                    <style dangerouslySetInnerHTML={{ __html: '.restore-progress-bar::-webkit-scrollbar { display: none; }' }} />
                    {steps.map((s, i) => (
                        <div key={s.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', opacity: step >= s.id ? 1 : 0.3, transition: 'all 0.5s', position: 'relative', zIndex: 1, minWidth: '80px', flexShrink: 0 }}>
                            <div style={{
                                width: '36px',
                                height: '36px',
                                background: step >= s.id ? 'var(--color-restore)' : '#eee',
                                borderRadius: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: step >= s.id ? '#fff' : '#666',
                                fontWeight: 900,
                                fontSize: '0.9rem',
                                boxShadow: step >= s.id ? '0 8px 16px rgba(239, 68, 68, 0.2)' : 'none'
                            }}>
                                {step > s.id ? <CheckCircle size={18} /> : s.icon}
                            </div>
                            <span style={{ fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', whiteSpace: 'nowrap' }}>{s.title}</span>
                            {i < steps.length - 1 && <div style={{ width: '40px', height: '2px', background: '#eee', margin: '0 0.5rem' }} />}
                        </div>
                    ))}
                </div>
            )}

            {/* Form Container */}
            <form onSubmit={handleSubmit}>
                <AnimatePresence mode="wait">
                    <div style={{ minHeight: '400px' }}>
                        {renderStep()}
                    </div>
                </AnimatePresence>

                {/* Footer Actions */}
                {step < 6 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4rem', padding: '2rem 0', borderTop: '1px solid #eee' }} className="restore-footer">
                        <button
                            type="button"
                            onClick={handleBack}
                            style={{
                                padding: '1.2rem 2.5rem',
                                background: 'transparent',
                                color: step === 1 ? '#ccc' : '#000',
                                border: '1px solid #eee',
                                borderRadius: '50px',
                                fontWeight: 800,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                cursor: step === 1 ? 'not-allowed' : 'pointer',
                                transition: 'all 0.3s'
                            }}
                            disabled={step === 1}
                        >
                            <ArrowLeft size={18} /> Previous
                        </button>

                        {step < 5 ? (
                            <motion.button
                                type="button"
                                onClick={handleNext}
                                animate={attemptedNext && !isCurrentStepValid ? { x: [0, -10, 10, -10, 10, 0] } : {}}
                                transition={{ duration: 0.4 }}
                                style={{
                                    padding: '1.2rem 3rem',
                                    background: isCurrentStepValid ? 'var(--color-restore)' : '#eee',
                                    color: isCurrentStepValid ? '#fff' : '#aaa',
                                    border: 'none',
                                    borderRadius: '50px',
                                    fontWeight: 900,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    cursor: 'pointer',
                                    boxShadow: isCurrentStepValid ? '0 15px 30px rgba(239, 68, 68, 0.3)' : 'none',
                                    transition: 'all 0.3s'
                                }}
                                onMouseEnter={e => isCurrentStepValid && (e.target.style.transform = 'translateY(-3px)')}
                                onMouseLeave={e => isCurrentStepValid && (e.target.style.transform = 'translateY(0)')}
                            >
                                Continue <ArrowRight size={18} />
                            </motion.button>
                        ) : (
                            <motion.button
                                type="submit"
                                disabled={loading}
                                animate={attemptedNext && !isCurrentStepValid ? { x: [0, -10, 10, -10, 10, 0] } : {}}
                                transition={{ duration: 0.4 }}
                                style={{
                                    padding: '1.2rem 3rem',
                                    background: isCurrentStepValid ? '#000' : '#eee',
                                    color: isCurrentStepValid ? '#fff' : '#aaa',
                                    border: 'none',
                                    borderRadius: '50px',
                                    fontWeight: 900,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    opacity: loading ? 0.7 : 1,
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    boxShadow: isCurrentStepValid ? '0 15px 30px rgba(0,0,0,0.1)' : 'none',
                                    transition: 'all 0.3s'
                                }}
                            >
                                {loading ? 'Submitting...' : 'Complete Registration'} <CheckCircle size={18} />
                            </motion.button>
                        )}
                        {status === 'error' && (
                            <p style={{ color: '#ef4444', fontSize: '0.9rem', fontWeight: 700, marginTop: '1rem', textAlign: 'center', width: '100%' }}>
                                Something went wrong. Please check your details or try again later.
                            </p>
                        )}
                    </div>
                )}
            </form>

            <AnimatePresence>
                {showResumptionModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(10px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                        <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} style={{ background: '#fff', padding: '3rem', borderRadius: '40px', maxWidth: '500px', textAlign: 'center', boxShadow: '0 30px 60px rgba(0,0,0,0.12)' }}>
                            <div style={{ width: '80px', height: '80px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem auto' }}>
                                <Heart size={40} color="var(--color-restore)" />
                            </div>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '1rem' }}>Welcome Back!</h3>
                            <p style={{ color: '#666', lineHeight: 1.6, marginBottom: '2.5rem' }}>
                                We found a previous registration attempt for <strong>{prevRecord.firstName}</strong>. Would you like to continue from where you left off?
                            </p>
                            <div style={{ display: 'grid', gap: '1rem' }}>
                                <button
                                    onClick={handleResume}
                                    style={{ padding: '1.2rem', background: 'var(--color-restore)', color: '#fff', borderRadius: '50px', border: 'none', fontWeight: 800, cursor: 'pointer', transition: 'all 0.3s' }}
                                >
                                    Yes, Continue session
                                </button>
                                <button
                                    onClick={() => { setPrevRecord(null); setShowResumptionModal(false); }}
                                    style={{ padding: '1.2rem', background: '#f3f4f6', color: '#000', borderRadius: '50px', border: 'none', fontWeight: 700, cursor: 'pointer' }}
                                >
                                    No, Start from scratch
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style dangerouslySetInnerHTML={{
                __html: `
                .restore-input:focus {
                    border-color: var(--color-restore) !important;
                    background: #fff !important;
                    box-shadow: 0 10px 25px -5px rgba(239, 68, 68, 0.1) !important;
                }
                .restore-input::placeholder { opacity: 0.3; }
                select.restore-input { appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 1.5rem center; background-size: 1.2rem; }

                .restore-grid-2 {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1.5rem;
                }
                .full-width { grid-column: span 2; }
                
                .concern-opt { background: #fff; color: #1a1a1a; }
                .concern-opt.active { background: rgba(239, 68, 68, 0.1); border-color: var(--color-restore) !important; color: var(--color-restore); }

                .gender-container { display: flex; gap: 1rem; margin-top: 0.5rem; }

                @media (max-width: 768px) {
                    .restore-grid-2 { grid-template-columns: 1fr !important; gap: 1rem !important; }
                    .full-width { grid-column: auto !important; }
                    .gender-container { flex-direction: column !important; }
                    
                    .restore-form-container { padding: 1rem !important; }
                    .restore-section-title { font-size: 1.8rem !important; }
                    .restore-footer { flex-direction: column-reverse !important; gap: 1rem !important; padding: 2rem 0 !important; }
                    .restore-footer button { width: 100% !important; justify-content: center !important; padding: 1.2rem !important; }
                    
                    /* Progress Bar Mobile Optimizations */
                    .restore-progress-bar { 
                        gap: 1.5rem !important; 
                        margin-bottom: 2.5rem !important;
                        padding-bottom: 1rem !important;
                        overflow-x: auto !important;
                        justify-content: flex-start !important;
                    }
                    .restore-progress-bar > div { flex-shrink: 0 !important; }
                    
                    /* Step Content Spacing */
                    .restore-input { padding: 1rem 1.25rem !important; font-size: 16px !important; } /* 16px prevents zoom on iOS */
                    
                    /* Payment Details Stack */
                    .payment-details-container { padding: 1.5rem !important; }
                    .payment-details-grid { grid-template-columns: 1fr !important; gap: 1.5rem !important; text-align: left !important; }
                    
                    /* Consent Box Spacing */
                    .consent-box { padding: 1rem !important; }
                    .consent-box label { gap: 0.75rem !important; font-size: 0.9rem !important; align-items: flex-start !important; }
                    .consent-box input { margin-top: 0.2rem !important; }
                }

                @media (max-width: 480px) {
                    .restore-section-title { font-size: 1.5rem !important; }
                    .restore-progress-bar span { font-size: 0.65rem !important; }
                }
            `}} />
        </div>
    );
};

export default RestoreForm;
