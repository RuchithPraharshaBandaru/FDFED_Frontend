import React from 'react';
import Navbar from './Navbar';

const MainLayout = ({ children }) => {
    return (
        <div className="min-h-screen bg-background text-foreground font-sans antialiased">
            <Navbar />
            <main>{children}</main>
        </div>
    );
};

export default MainLayout;