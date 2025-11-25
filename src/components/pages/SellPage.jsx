import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { submitDonation } from '../../services/api';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import Textarea from '../ui/Textarea';
import Alert from '../ui/Alert';

const SellPage = () => {
    const [formData, setFormData] = useState({
        items: '',
        fabric: '',
        size: '',
        gender: '',
        age: '', // This corresponds to 'usageDuration'
        clothesDate: '',
        timeSlot: '',
        description: ''
    });
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
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
            setSuccess('Submission successful! You can submit another item or browse the store.');
            // Reset form
            setFormData({
                items: '', fabric: '', size: '', gender: '',
                age: '', clothesDate: '', timeSlot: '', description: ''
            });
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
        <div className="bg-gray-100 dark:bg-gray-900 min-h-screen py-8 mt-6">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-center mb-8 text-green-500">Sell/Donate Your Clothes</h1>
                
                <div className="flex flex-col lg:flex-row lg:gap-8">
                    <div className="lg:w-2/3 bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 mb-8 lg:mb-0">
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
                                options={[
                                    { value: '', label: 'Select Item' },
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
                                options={[
                                    { value: '', label: 'Select material type' },
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
                                options={[
                                    { value: '', label: 'Select Size' },
                                    { value: 'S', label: 'S' },
                                    { value: 'M', label: 'M' },
                                    { value: 'L', label: 'L' }
                                ]}
                            />

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Gender</label>
                                <div className="flex gap-4">
                                    <label className="flex items-center space-x-2 dark:text-gray-300">
                                        <input type="radio" name="gender" value="mens" checked={formData.gender === 'mens'} onChange={handleChange} required className="rounded-full border-gray-300 text-green-500 focus:ring-green-500" />
                                        <span>Men's</span>
                                    </label>
                                    <label className="flex items-center space-x-2 dark:text-gray-300">
                                        <input type="radio" name="gender" value="womens" checked={formData.gender === 'womens'} onChange={handleChange} className="rounded-full border-gray-300 text-green-500 focus:ring-green-500" />
                                        <span>Women's</span>
                                    </label>
                                    <label className="flex items-center space-x-2 dark:text-gray-300">
                                        <input type="radio" name="gender" value="unisex" checked={formData.gender === 'unisex'} onChange={handleChange} className="rounded-full border-gray-300 text-green-500 focus:ring-green-500" />
                                        <span>Unisex</span>
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
                                    options={[
                                        { value: '', label: 'Select Usage Duration' },
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
                                options={[
                                    { value: '', label: 'Select a time slot' },
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
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Photo Upload (required)</label>
                                <input type="file" name="photos" onChange={handleFileChange} accept="image/*" required className="mt-1 block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-50 dark:file:bg-gray-700 file:text-green-700 dark:file:text-green-400 hover:file:bg-green-100 dark:hover:file:bg-gray-600" />
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

                    <div className="lg:w-1/3 lg:sticky lg:top-8 self-start">
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                            <h4 className="text-md font-semibold mb-2 text-green-500">How Your Points Are Calculated</h4>
                            <p className="text-gray-700 dark:text-gray-300 mb-2 text-sm">
                                Points are determined by the <strong>size</strong>, <strong>fabric</strong>, and <strong>usage duration</strong>.
                            </p>
                            <div className="overflow-x-auto max-h-[40rem] overflow-y-auto mb-2">
                                <table className="min-w-full border dark:border-gray-600 text-sm text-left text-gray-700 dark:text-gray-300">
                                    <thead className="bg-gray-100 dark:bg-gray-700 sticky top-0">
                                        <tr>
                                            <th className="px-3 py-2 border dark:border-gray-600">Size</th>
                                            <th className="px-3 py-2 border dark:border-gray-600">Fabric</th>
                                            <th className="px-3 py-2 border dark:border-gray-600">Usage</th>
                                            <th className="px-3 py-2 border dark:border-gray-600">Points (₹)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pointsData.map((item, index) => (
                                            <tr key={index}>
                                                <td className="px-3 py-2 border dark:border-gray-600">{item.s}</td>
                                                <td className="px-3 py-2 border dark:border-gray-600">{item.f}</td>
                                                <td className="px-3 py-2 border dark:border-gray-600">{item.u}</td>
                                                <td className="px-3 py-2 border dark:border-gray-600">{item.p}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                </div>
                <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-4 dark:text-white">Terms and Conditions</h3>
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
    );
};

export default SellPage;