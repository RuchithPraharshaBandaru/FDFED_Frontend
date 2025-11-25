// src/context/ThemeContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

export const ThemeProvider = ({ children }) => {
    // Check localStorage for saved theme preference, default to 'light'
    const [theme, setTheme] = useState(() => {
        
        return 'light';
    });

    useEffect(() => {
        // Update the HTML element with the dark class
        const root = document.documentElement;
        console.log('Theme changed to:', theme);
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        // Save to localStorage
        try {
            localStorage.setItem('theme', theme);
        } catch (e) {
            console.warn("Could not save theme preference:", e);
        }
    }, [theme]);

    const toggleTheme = () => {
        console.log('Toggle clicked, current theme:', theme);
        setTheme(prevTheme => {
            const newTheme = prevTheme === 'light' ? 'dark' : 'light';
            console.log('Setting new theme to:', newTheme);
            return newTheme;
        });
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
