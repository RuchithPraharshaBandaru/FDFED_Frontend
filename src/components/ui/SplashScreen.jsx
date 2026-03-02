// src/components/ui/SplashScreen.jsx
import React, { useEffect, useState } from 'react';

const SplashScreen = ({ onComplete }) => {
    const [animationPhase, setAnimationPhase] = useState('enter'); // enter, visible, exit

    useEffect(() => {
        // Phase 1: Enter animation plays immediately
        // Phase 2: After 1.5s, start exit animation
        const visibleTimer = setTimeout(() => {
            setAnimationPhase('exit');
        }, 1800);

        // Phase 3: After exit animation, call onComplete
        const exitTimer = setTimeout(() => {
            onComplete();
        }, 2500);

        return () => {
            clearTimeout(visibleTimer);
            clearTimeout(exitTimer);
        };
    }, [onComplete]);

    return (
        <div
            className={`fixed inset-0 z-[9999] flex items-center justify-center bg-background transition-opacity duration-700 ${
                animationPhase === 'exit' ? 'opacity-0' : 'opacity-100'
            }`}
        >
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Animated circles */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/15 rounded-full blur-3xl animate-pulse delay-300" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
            </div>

            {/* Main content */}
            <div className="relative flex flex-col items-center gap-8">
                {/* Logo/Brand animation */}
                <div className="relative">
                    {/* Outer ring */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-32 h-32 rounded-full border-4 border-primary/20 animate-[spin_3s_linear_infinite]" />
                    </div>
                    
                    {/* Middle ring */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-24 h-24 rounded-full border-4 border-t-primary border-r-primary/50 border-b-primary/20 border-l-primary/50 animate-[spin_2s_linear_infinite_reverse]" />
                    </div>

                    {/* Inner circle with icon */}
                    <div className="relative w-32 h-32 flex items-center justify-center">
                        <div 
                            className={`w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30 transition-all duration-700 ${
                                animationPhase === 'enter' ? 'scale-100 rotate-0' : ''
                            }`}
                            style={{
                                animation: 'logoEnter 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards'
                            }}
                        >
                            {/* Leaf/Eco icon */}
                            <svg 
                                className="w-8 h-8 text-primary-foreground" 
                                fill="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z"/>
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Brand name with staggered letter animation */}
                <div className="flex items-center gap-1 overflow-hidden">
                    {'SwiftMart'.split('').map((letter, index) => (
                        <span
                            key={index}
                            className="text-4xl font-bold text-foreground inline-block"
                            style={{
                                animation: `letterSlideUp 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${index * 0.1}s forwards`,
                                opacity: 0,
                                transform: 'translateY(100%)'
                            }}
                        >
                            {letter}
                        </span>
                    ))}
                </div>

                {/* Tagline */}
                <p 
                    className="text-muted-foreground text-lg"
                    style={{
                        animation: 'fadeSlideUp 0.6s ease-out 0.8s forwards',
                        opacity: 0,
                        transform: 'translateY(20px)'
                    }}
                >
                    Sustainable Shopping, Redefined
                </p>

                {/* Loading bar */}
                <div className="w-48 h-1 bg-muted rounded-full overflow-hidden mt-4">
                    <div 
                        className="h-full bg-primary rounded-full"
                        style={{
                            animation: 'loadingBar 1.8s ease-in-out forwards'
                        }}
                    />
                </div>
            </div>

            {/* Inline keyframes */}
            <style>{`
                @keyframes logoEnter {
                    0% {
                        transform: scale(0) rotate(-180deg);
                        opacity: 0;
                    }
                    100% {
                        transform: scale(1) rotate(0deg);
                        opacity: 1;
                    }
                }

                @keyframes letterSlideUp {
                    0% {
                        opacity: 0;
                        transform: translateY(100%);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes fadeSlideUp {
                    0% {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes loadingBar {
                    0% {
                        width: 0%;
                    }
                    50% {
                        width: 70%;
                    }
                    100% {
                        width: 100%;
                    }
                }
            `}</style>
        </div>
    );
};

export default SplashScreen;
