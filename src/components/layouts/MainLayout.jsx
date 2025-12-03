import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';

const MainLayout = ({ children }) => {
    const { pathname } = useLocation();
    const isIndustryPath = pathname.startsWith('/industry');

    return (
        <div className="min-h-screen bg-background text-foreground font-sans antialiased">
            {!isIndustryPath && <Navbar />}
            <main>{children}</main>
        </div>
    );
};

export default MainLayout;