import React from 'react';
import Navbar from './Navbar';

const MainLayout = ({ children }) => {
    return (
        <div>
            <Navbar />
            <main>{children}</main>
            {/* You can add a Footer component here later */}
        </div>
    );
};

export default MainLayout;