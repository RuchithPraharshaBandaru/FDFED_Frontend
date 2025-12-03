import React, { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { ShieldCheck, Lock, CheckCircle2, Server } from 'lucide-react';

// --- MOCKS FOR PREVIEW (Replace with your actual imports) ---
// import { useSelector } from 'react-redux';
// import { selectIndustryIsAuthenticated } from '../../store/slices/industrySlice';

const ProtectedIndustryRoute = () => {
    // Mock State for Preview - Replace with Redux selectors
    // const isAuthenticated = useSelector(selectIndustryIsAuthenticated);
    const isAuthenticated = true; // Hardcoded for demo
    const [initialized, setInitialized] = useState(false);
    const [progress, setProgress] = useState(0);
    const [statusStep, setStatusStep] = useState(0);

    const steps = [
        "Connecting to Industry Server...",
        "Verifying SSL Certificates...",
        "Authenticating Partner Credentials...",
        "Syncing Inventory Data..."
    ];

    // Simulate "Secure Connection" initialization aesthetic
    useEffect(() => {
        const totalDuration = 2000; // 2 seconds total load
        const intervalTime = 20;
        const stepsCount = steps.length;
        
        let currentProgress = 0;

        const timer = setInterval(() => {
            currentProgress += 1;
            setProgress(Math.min(currentProgress, 100));

            // Update text based on progress chunk
            const currentStepIndex = Math.floor((currentProgress / 100) * stepsCount);
            setStatusStep(Math.min(currentStepIndex, stepsCount - 1));

            if (currentProgress >= 100) {
                clearInterval(timer);
                setTimeout(() => setInitialized(true), 400); // Small pause at 100%
            }
        }, totalDuration / 100);

        return () => clearInterval(timer);
    }, []);

    // Initial Loading State (Modern Light/Green Secure Screen)
    if (!initialized) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 flex flex-col items-center justify-center relative overflow-hidden font-sans transition-colors duration-300">
                
                {/* Ambient Background */}
                 <div className="absolute inset-0 z-0 pointer-events-none">
                     <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_120%,rgba(16,185,129,0.1),transparent_70%)]" />
                     <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-100/40 dark:bg-emerald-900/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                 </div>

                {/* Central Card */}
                <div className="relative z-10 w-full max-w-sm bg-white dark:bg-zinc-900 rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] dark:shadow-none p-8 border border-slate-100 dark:border-zinc-800">
                    
                    {/* Icon Header */}
                    <div className="flex flex-col items-center mb-8">
                        <div className="relative mb-6">
                            <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl flex items-center justify-center">
                                <Lock className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            {/* Orbiting Dot */}
                            <div className="absolute inset-0 border-2 border-emerald-100 dark:border-emerald-800 rounded-2xl animate-[spin_3s_linear_infinite]" />
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-zinc-900 animate-bounce" />
                        </div>
                        
                        <h2 className="text-xl font-bold text-slate-800 dark:text-white">SwiftMart Secure</h2>
                        <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">Industrial Partner Gateway</p>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden mb-4">
                        <div 
                            className="h-full bg-gradient-to-r from-emerald-400 to-green-500 rounded-full transition-all duration-300 ease-out"
                            style={{ width: `${progress}%` }}
                        />
                    </div>

                    {/* Status Text & Steps */}
                    <div className="h-16 flex flex-col items-center justify-center text-center">
                        <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400 animate-in fade-in slide-in-from-bottom-2 key={statusStep}">
                            {steps[statusStep]}
                        </p>
                        <p className="text-xs text-slate-400 dark:text-zinc-500 mt-1 font-mono">
                            {progress}% COMPLETE
                        </p>
                    </div>

                    {/* Footer Badges */}
                    <div className="mt-6 pt-6 border-t border-slate-50 dark:border-zinc-800 flex justify-center gap-4">
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 dark:text-zinc-500 font-medium uppercase tracking-wider">
                            <Server className="w-3 h-3" />
                            <span>Encrypted</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 dark:text-zinc-500 font-medium uppercase tracking-wider">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Verified</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/industry/login" replace />;
    }

    // Success State - Render the content
    return <Outlet />;
};

export default ProtectedIndustryRoute;