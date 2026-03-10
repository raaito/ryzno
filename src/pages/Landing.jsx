import React from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import SoarSection from '../components/SoarSection';
import RestoreSection from '../components/RestoreSection';
import RoarSection from '../components/RoarSection';
import ContactSection from '../components/ContactSection';
import BookPresaleSection from '../components/BookPresaleSection';
import AcademyAdSection from '../components/AcademyAdSection';
import CommunityFormModal from '../components/CommunityFormModal';
import BirthdayShowcase from '../components/BirthdayShowcase';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

const Landing = () => {
    const [isCommunityModalOpen, setIsCommunityModalOpen] = React.useState(false);

    return (
        <div className="landing">
            <Navbar />
            <main>
                <HeroSection onJoinCommunity={() => setIsCommunityModalOpen(true)} />
                <SoarSection />
                <RestoreSection />
                <RoarSection />
                <BirthdayShowcase />
                <BookPresaleSection />
                <AcademyAdSection onJoinCommunity={() => setIsCommunityModalOpen(true)} />
                <ContactSection />
            </main>
            <CommunityFormModal isOpen={isCommunityModalOpen} onClose={() => setIsCommunityModalOpen(false)} />
            <Footer />
        </div>
    );
};

export default Landing;
