import React from 'react';
import Navbar from './Navbar';

const MainLayout = ({ children }) => {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-900">
            <Navbar />
            <main>{children}</main>
            {/* You can add a Footer component here later */}
        </div>
    );
};

export default MainLayout;