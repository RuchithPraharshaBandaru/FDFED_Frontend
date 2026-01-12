import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const MainLayout = () => {
    return (
        <div className="min-h-screen bg-background text-foreground font-sans antialiased">
            <Navbar />
            <main><Outlet /></main>
        </div>
    );
};

export default MainLayout;