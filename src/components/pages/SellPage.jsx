import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { submitDonation, apiPredictImage } from '../../services/api';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import Textarea from '../ui/Textarea';
import Alert from '../ui/Alert';
import { useFormState } from '../../hooks';
import { useToast } from '../../context/ToastContext';

const SellPage = () => {
    const { formData, handleChange, resetForm, setFormData } = useFormState({
        items: '',
        fabric: '',
        size: '',
        gender: '',
        age: '',
        clothesDate: '',
        timeSlot: '',
        description: ''
    });
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null); // Add preview state
    const [loading, setLoading] = useState(false);
    const [isScanning, setIsScanning] = useState(false); // New state for AI scan
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const navigate = useNavigate();
    const { showSuccess, showError, showInfo } = useToast();

    const handleFileChange = async (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);

        if (selectedFile) {
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(selectedFile);

            // Start AI Model Scan
            setIsScanning(true);
            setSuccess(null);
            setError(null);

            try {
                // Create FormData for the prediction API
                const predictionData = new FormData();
                predictionData.append('image', selectedFile);

                // Call the backend API
                const result = await apiPredictImage(predictionData);

                if (result.is_cloth) {
                    showSuccess(`Verified as ${result.category}`);
                    
                    // If the backend returns specific details in the future, we can auto-fill here.
                    // For now, the gatekeeper only confirms it is a cloth.
                    // We can optionally set a default category if the model provides it.
                    if (result.predicted_details) {
                         setFormData(prev => ({
                            ...prev,
                            ...result.predicted_details
                        }));
                    }
                } else {
                    const msg = `Verification Failed: The image was identified as ${result.category}. Please upload a valid clothing item.`;
                    setError(msg);
                    showError(msg);
                    setFile(null); // Clear the invalid file
                    setPreview(null);
                }

            } catch (err) {
                console.error("AI Scan Failed", err);
                const msg = "AI Service Error: " + (err.message || "Could not verify image.");
                setError(msg);
                showError(msg);
            } finally {
                setIsScanning(false);
            }
        } else {
            setPreview(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!file) {
            setError('Photo upload is required.');
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(null);

        // Create a FormData object to send multipart data
        const data = new FormData();
        
        // Append all text fields
        Object.keys(formData).forEach(key => {
            data.append(key, formData[key]);
        });
        
        // Append the file
        data.append('photos', file); 

        try {
            await submitDonation(data);
            setSuccess('Submission successful! Your donation is pending verification. Virtual coins will be credited once verified.');
            // Reset form using custom hook
            resetForm();
            setFile(null);
            e.target.reset(); // Resets the file input
        } catch (err) {
            setError(err.message || 'An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    
    // This is the static data for the points table from your EJS
    const pointsData = [
        { s: 'S', f: 'Cotton', u: '< 6 mos', p: 200 },
        { s: 'M', f: 'Cotton', u: '< 6 mos', p: 250 },
        { s: 'L', f: 'Cotton', u: '< 6 mos', p: 300 },
        { s: 'S', f: 'Silk', u: '< 6 mos', p: 300 },
        { s: 'M', f: 'Silk', u: '< 6 mos', p: 350 },
        { s: 'L', f: 'Silk', u: '< 6 mos', p: 400 },
        { s: 'S', f: 'Linen', u: '< 6 mos', p: 220 },
        { s: 'M', f: 'Linen', u: '< 6 mos', p: 270 },
        { s: 'L', f: 'Linen', u: '< 6 mos', p: 320 },
        { s: 'S', f: 'Leather', u: '< 6 mos', p: 450 },
        { s: 'M', f: 'Leather', u: '< 6 mos', p: 550 },
        { s: 'L', f: 'Leather', u: '< 6 mos', p: 600 },
        { s: 'S', f: 'Cashmere', u: '< 6 mos', p: 400 },
        { s: 'M', f: 'Cashmere', u: '< 6 mos', p: 450 },
        { s: 'L', f: 'Cashmere', u: '< 6 mos', p: 500 },
        { s: 'S', f: 'Cotton', u: '> 1 yr', p: 140 },
        { s: 'M', f: 'Cotton', u: '> 1 yr', p: 180 },
        { s: 'L', f: 'Cotton', u: '> 1 yr', p: 220 },
        { s: 'S', f: 'Silk', u: '> 1 yr', p: 220 },
        { s: 'M', f: 'Silk', u: '> 1 yr', p: 260 },
        { s: 'L', f: 'Silk', u: '> 1 yr', p: 300 },
        { s: 'S', f: 'Linen', u: '> 1 yr', p: 160 },
        { s: 'M', f: 'Linen', u: '> 1 yr', p: 200 },
        { s: 'L', f: 'Linen', u: '> 1 yr', p: 240 },
        { s: 'S', f: 'Leather', u: '> 1 yr', p: 300 },
        { s: 'M', f: 'Leather', u: '> 1 yr', p: 350 },
        { s: 'L', f: 'Leather', u: '> 1 yr', p: 400 },
        { s: 'S', f: 'Cashmere', u: '> 1 yr', p: 260 },
        { s: 'M', f: 'Cashmere', u: '> 1 yr', p: 320 },
        { s: 'L', f: 'Cashmere', u: '> 1 yr', p: 350 },
    ];

    return (
        <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-green-50 dark:from-gray-950 dark:via-emerald-900/35 dark:to-green-900/30 overflow-hidden">
            {/* Futuristic background elements */}
            <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] dark:opacity-[0.08] pointer-events-none" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-green-400/20 to-emerald-500/20 dark:from-green-500/25 dark:to-emerald-600/25 blur-3xl rounded-full" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-emerald-400/15 to-green-500/15 dark:from-emerald-600/20 dark:to-green-700/20 blur-3xl rounded-full" />
            
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Hero Header */}
                <div className="text-center mb-12 space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-green-500/10 to-emerald-500/10 dark:from-green-500/20 dark:to-emerald-500/20 border border-green-500/20 backdrop-blur-sm mb-4">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-sm font-medium text-green-700 dark:text-green-400">Earn While You Sustain</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-emerald-500 to-green-600 dark:from-green-400 dark:via-emerald-400 dark:to-green-400">Transform</span>
                        <br />
                        <span className="text-gray-900 dark:text-white">Your Wardrobe</span>
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        Turn pre-loved fashion into rewards. Every piece you share helps build a sustainable future.
                    </p>
                </div>
                
                <div className="flex flex-col lg:flex-row lg:gap-8">
                    {/* Main Form - Glassmorphism Card */}
                    <div className="lg:w-2/3 relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/40 dark:from-gray-800/85 dark:to-gray-900/75 backdrop-blur-xl rounded-2xl" />
                        <div className="relative bg-white/60 dark:bg-gray-800/65 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-green-500/30 shadow-2xl shadow-green-500/10 dark:shadow-green-500/20 p-8 mb-8 lg:mb-0">
                            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-200/50 dark:border-gray-700/50">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Submit Your Item</h2>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Fill in the details to get started</p>
                                </div>
                            </div>

                            {/* AI Guide Section */}
                            <div className="mb-6 p-4 bg-green-50/50 dark:bg-green-900/10 rounded-xl border border-green-100 dark:border-green-800/30">
                                <h3 className="text-sm font-bold text-green-800 dark:text-green-400 mb-2 flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                    How AI Verification Works:
                                </h3>
                                <ol className="list-decimal list-inside space-y-1 text-xs text-green-700 dark:text-green-300 ml-1">
                                    <li><strong>Upload Photo:</strong> Upload a photo of the cloth you want to sell.</li>
                                    <li><strong>AI Scan:</strong> We use smart technology to confirm it's a clothing item.</li>
                                    <li><strong>Auto-Fill:</strong> We'll automatically identify the item (e.g., "Woolen Sweater") and fill in the Item Name for you!</li>
                                </ol>
                            </div>

                            <form id="clothesForm" className="space-y-6" autoComplete="off" onSubmit={handleSubmit}>

                            {/* Form Messages */}
                            <Alert type="success" message={success} />
                            <Alert type="error" message={error} />

                            <Select
                                label="Type of Clothing Item"
                                name="items"
                                value={formData.items}
                                onChange={handleChange}
                                required
                                placeholder="Select Item"
                                options={[
                                    { value: 't-shirts', label: 'T-shirts' },
                                    { value: 'shirts', label: 'Shirts' },
                                    { value: 'pants-jeans', label: 'Pants/Jeans' },
                                    { value: 'dresses', label: 'Dresses' },
                                    { value: 'skirts', label: 'Skirts' },
                                    { value: 'jackets-coats', label: 'Jackets/Coats' },
                                    { value: 'sweaters', label: 'Sweaters' }
                                ]}
                            />

                            <Select
                                label="Clothing Material"
                                name="fabric"
                                value={formData.fabric}
                                onChange={handleChange}
                                required
                                placeholder="Select material type"
                                options={[
                                    { value: 'Cotton', label: 'Cotton' },
                                    { value: 'Silk', label: 'Silk' },
                                    { value: 'Leather', label: 'Leather' },
                                    { value: 'Linen', label: 'Linen' },
                                    { value: 'Cashmere', label: 'Cashmere' },
                                    { value: 'Synthetic', label: 'Synthetic' },
                                    { value: 'Wool', label: 'Wool' },
                                    { value: 'Denim', label: 'Denim' },
                                    { value: 'Polyester', label: 'Polyester' }
                                ]}
                            />

                            <Select
                                label="Size"
                                name="size"
                                value={formData.size}
                                onChange={handleChange}
                                required
                                placeholder="Select Size"
                                options={[
                                    { value: 'S', label: 'S' },
                                    { value: 'M', label: 'M' },
                                    { value: 'L', label: 'L' }
                                ]}
                            />

                            <div>
                                <label className="block text-sm font-semibold bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-200 dark:to-white bg-clip-text text-transparent mb-2">Gender</label>
                                <div className="flex gap-3">
                                    <label className="flex-1 cursor-pointer">
                                        <input type="radio" name="gender" value="mens" checked={formData.gender === 'mens'} onChange={handleChange} required className="peer sr-only" />
                                        <div className="flex items-center justify-center h-11 px-4 rounded-xl border-2 border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm text-sm font-medium transition-all peer-checked:border-green-500 peer-checked:bg-green-500/10 peer-checked:text-green-600 dark:peer-checked:text-green-400 hover:border-green-500/30">
                                            Men's
                                        </div>
                                    </label>
                                    <label className="flex-1 cursor-pointer">
                                        <input type="radio" name="gender" value="womens" checked={formData.gender === 'womens'} onChange={handleChange} className="peer sr-only" />
                                        <div className="flex items-center justify-center h-11 px-4 rounded-xl border-2 border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm text-sm font-medium transition-all peer-checked:border-green-500 peer-checked:bg-green-500/10 peer-checked:text-green-600 dark:peer-checked:text-green-400 hover:border-green-500/30">
                                            Women's
                                        </div>
                                    </label>
                                    <label className="flex-1 cursor-pointer">
                                        <input type="radio" name="gender" value="unisex" checked={formData.gender === 'unisex'} onChange={handleChange} className="peer sr-only" />
                                        <div className="flex items-center justify-center h-11 px-4 rounded-xl border-2 border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm text-sm font-medium transition-all peer-checked:border-green-500 peer-checked:bg-green-500/10 peer-checked:text-green-600 dark:peer-checked:text-green-400 hover:border-green-500/30">
                                            Unisex
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <div>
                                <Select
                                    label="Usage Duration"
                                    name="age"
                                    value={formData.age}
                                    onChange={handleChange}
                                    required
                                    placeholder="Select Usage Duration"
                                    options={[
                                        { value: '6', label: 'Less than 6 months' },
                                        { value: '1', label: 'More than 1 year' }
                                    ]}
                                />
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Choose "6" for less than 6 months, "1" for more than 1 year.</p>
                            </div>

                            <Input
                                label="Preferred Date"
                                type="date"
                                name="clothesDate"
                                value={formData.clothesDate}
                                onChange={handleChange}
                                required
                            />

                            <Select
                                label="Preferred Time Slot"
                                name="timeSlot"
                                value={formData.timeSlot}
                                onChange={handleChange}
                                required
                                placeholder="Select a time slot"
                                options={[
                                    { value: 'morning', label: 'Morning (9 AM - 12 PM)' },
                                    { value: 'afternoon', label: 'Afternoon (12 PM - 5 PM)' },
                                    { value: 'evening', label: 'Evening (5 PM - 8 PM)' }
                                ]}
                            />

                            <Textarea
                                label="Description (optional)"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={3}
                                placeholder="Describe your item (brand, condition, etc.)"
                            />

                            <div>
                                <label className="block text-sm font-semibold bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-200 dark:to-white bg-clip-text text-transparent mb-2">Photo Upload (required)</label>
                                <div className="relative">
                                    <input 
                                        type="file" 
                                        name="photos" 
                                        onChange={handleFileChange} 
                                        accept="image/*" 
                                        required 
                                        className="block w-full text-sm text-gray-600 dark:text-gray-400 file:mr-4 file:py-2.5 file:px-5 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-green-500 file:to-emerald-600 file:text-white hover:file:from-green-600 hover:file:to-emerald-700 file:shadow-lg file:shadow-green-500/30 file:transition-all cursor-pointer rounded-xl border-2 border-dashed border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm p-3 hover:border-green-500/30 transition-all" 
                                    />
                                    {preview && (
                                        <div className="mt-4 flex justify-center">
                                            <img 
                                                src={preview} 
                                                alt="Preview" 
                                                className="h-48 w-48 object-cover rounded-xl shadow-lg border-2 border-white dark:border-gray-700"
                                            />
                                        </div>
                                    )}
                                    {isScanning && (
                                        <div className="mt-3 flex items-center justify-center gap-2 text-sm font-medium text-green-600 dark:text-green-400 animate-pulse">
                                            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            AI Model is analyzing your image...
                                        </div>
                                    )}
                                </div>
                            </div>

                            <Button 
                                type="submit" 
                                variant="primary" 
                                className="w-full"
                                disabled={loading}
                            >
                                {loading ? 'Submitting...' : 'Submit'}
                            </Button>
                        </form>
                        </div>
                    </div>

                    {/* Points Calculator - Futuristic Card */}
                    <div className="lg:w-1/3 flex flex-col">
                        <div className="relative h-full bg-gradient-to-br from-green-500 to-emerald-600 dark:from-green-500 dark:to-emerald-600 p-[2px] rounded-2xl shadow-2xl shadow-green-500/20 dark:shadow-green-500/40">
                            <div className="bg-white/95 h-full dark:bg-gray-800/95 backdrop-blur-xl p-6 rounded-2xl">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <h4 className="text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">Points Calculator</h4>
                                </div>
                                <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm leading-relaxed">
                                    Earn points based on <span className="font-semibold text-green-600 dark:text-green-400">size</span>, <span className="font-semibold text-green-600 dark:text-green-400">fabric</span>, and <span className="font-semibold text-green-600 dark:text-green-400">usage duration</span>.
                                </p>
                                <div className="overflow-x-auto max-h-[60.5rem] overflow-y-auto mb-2 rounded-xl border border-gray-200/50 dark:border-gray-700/50">
                                    <table className="min-w-full text-sm text-left">
                                        <thead className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50 sticky top-0 backdrop-blur-sm">
                                            <tr>
                                                <th className="px-3 py-3 font-semibold text-green-700 dark:text-green-400">Size</th>
                                                <th className="px-3 py-3 font-semibold text-green-700 dark:text-green-400">Fabric</th>
                                                <th className="px-3 py-3 font-semibold text-green-700 dark:text-green-400">Usage</th>
                                                <th className="px-3 py-3 font-semibold text-green-700 dark:text-green-400">Points (₹)</th>
                                        </tr>
                                    </thead>
                                        <tbody>
                                            {pointsData.map((item, index) => (
                                                <tr key={index} className="border-b border-gray-100 dark:border-gray-800 hover:bg-green-50/50 dark:hover:bg-green-950/20 transition-colors">
                                                    <td className="px-3 py-3 text-gray-700 dark:text-gray-300">{item.s}</td>
                                                    <td className="px-3 py-3 text-gray-700 dark:text-gray-300">{item.f}</td>
                                                    <td className="px-3 py-3 text-gray-600 dark:text-gray-400 text-xs">{item.u}</td>
                                                    <td className="px-3 py-3 font-bold text-green-600 dark:text-green-400">{item.p}</td>
                                            </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
                {/* Terms Section - Modern Card */}
                <div className="mt-8 relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-emerald-500/5 dark:from-green-500/20 dark:to-emerald-500/20 rounded-2xl" />
                    <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-8 rounded-2xl border border-gray-200/50 dark:border-green-500/30 shadow-xl dark:shadow-green-500/15">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-500 to-gray-700 dark:from-gray-600 dark:to-gray-800 flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Terms & Conditions</h3>
                        </div>
                        <div className="space-y-4 text-sm text-gray-600 dark:text-gray-300">
                        <p>1. <strong>Eligibility:</strong> Clothes must be clean and in acceptable condition. We reserve the right to refuse items that do not meet our standards.</p>
                        <p>2. <strong>Item Limitations:</strong> We do not accept items that are heavily soiled or damaged beyond repair.</p>
                        <p>3. <strong>Privacy Policy:</strong> All personal information collected will be kept confidential and used solely for the purpose of processing donations.</p>
                        <p>4. <strong>Donation Acknowledgment:</strong> By submitting this form, you acknowledge that you are donating items without expectation of compensation or reimbursement.</p>
                        <p>5. <strong>Point System:</strong> Donations may be eligible for a point system where points can be redeemed for discounts or rewards. Details will be provided upon confirmation of your donation.</p>
                        <p>6. <strong>Scheduling:</strong> Please select a preferred donation date and time slot; we will do our best to accommodate your request.</p>
                    </div>
                </div>
            </div>
            </div>
        </div>
    );
};

export default SellPage;