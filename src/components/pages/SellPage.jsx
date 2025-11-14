import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { submitDonation } from '../../services/api'; // We will create this function next

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
        <div className="bg-gray-100 min-h-screen py-8 mt-6">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-center mb-8 text-green-800">Sell/Donate Your Clothes</h1>
                
                <div className="flex flex-col lg:flex-row lg:gap-8">
                    <div className="lg:w-2/3 bg-white rounded-lg shadow-md p-8 mb-8 lg:mb-0">
                        <form id="clothesForm" className="space-y-6" autoComplete="off" onSubmit={handleSubmit}>

                            {/* Form Messages */}
                            {success && <div className="p-4 rounded-md bg-green-100 text-green-700">{success}</div>}
                            {error && <div className="p-4 rounded-md bg-red-100 text-red-700">{error}</div>}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Type of Clothing Item</label>
                                <select name="items" value={formData.items} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                                    <option value="">Select Item</option>
                                    <option value="t-shirts">T-shirts</option>
                                    <option value="shirts">Shirts</option>
                                    <option value="pants-jeans">Pants/Jeans</option>
                                    <option value="dresses">Dresses</option>
                                    <option value="skirts">Skirts</option>
                                    <option value="jackets-coats">Jackets/Coats</option>
                                    <option value="sweaters">Sweaters</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Clothing Material</label>
                                <select name="fabric" value={formData.fabric} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                                    <option value="">Select material type</option>
                                    <option value="Cotton">Cotton</option>
                                    <option value="Silk">Silk</option>
                                    <option value="Leather">Leather</option>
                                    <option value="Linen">Linen</option>
                                    <option value="Cashmere">Cashmere</option>
                                    <option value="Synthetic">Synthetic</option>
                                    <option value="Wool">Wool</option>
                                    <option value="Denim">Denim</option>
                                    <option value="Polyester">Polyester</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Size</label>
                                <select name="size" value={formData.size} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                                    <option value="">Select Size</option>
                                    <option value="S">S</option>
                                    <option value="M">M</option>
                                    <option value="L">L</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                                <div className="flex gap-4">
                                    <label className="flex items-center space-x-2">
                                        <input type="radio" name="gender" value="mens" checked={formData.gender === 'mens'} onChange={handleChange} required className="rounded-full border-gray-300 text-blue-600 focus:ring-blue-500" />
                                        <span>Men's</span>
                                    </label>
                                    <label className="flex items-center space-x-2">
                                        <input type="radio" name="gender" value="womens" checked={formData.gender === 'womens'} onChange={handleChange} className="rounded-full border-gray-300 text-blue-600 focus:ring-blue-500" />
                                        <span>Women's</span>
                                    </label>
                                    <label className="flex items-center space-x-2">
                                        <input type="radio" name="gender" value="unisex" checked={formData.gender === 'unisex'} onChange={handleChange} className="rounded-full border-gray-300 text-blue-600 focus:ring-blue-500" />
                                        <span>Unisex</span>
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Usage Duration</label>
                                <select name="age" value={formData.age} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                                    <option value="">Select Usage Duration</option>
                                    <option value="6">Less than 6 months</option>
                                    <option value="1">More than 1 year</option>
                                </select>
                                <p className="text-xs text-gray-500 mt-1">Choose "6" for less than 6 months, "1" for more than 1 year.</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Preferred Date</label>
                                <input type="date" name="clothesDate" value={formData.clothesDate} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Preferred Time Slot</label>
                                <select name="timeSlot" value={formData.timeSlot} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                                    <option value="">Select a time slot</option>
                                    <option value="morning">Morning (9 AM - 12 PM)</option>
                                    <option value="afternoon">Afternoon (12 PM - 5 PM)</option>
                                    <option value="evening">Evening (5 PM - 8 PM)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Description (optional)</label>
                                <textarea name="description" value={formData.description} onChange={handleChange} rows="3" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" placeholder="Describe your item (brand, condition, etc.)"></textarea>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Photo Upload (required)</label>
                                <input type="file" name="photos" onChange={handleFileChange} accept="image/*" required className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                            </div>

                            <div>
                                <button type="submit" disabled={loading} className="w-full py-3 px-6 bg-green-700 text-white rounded-lg font-semibold hover:bg-green-800 transition disabled:opacity-50">
                                    {loading ? 'Submitting...' : 'Submit'}
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="lg:w-1/3 lg:sticky lg:top-8 self-start">
                        <div className="bg-white p-6 rounded-lg border border-gray-200">
                            <h4 className="text-md font-semibold mb-2 text-blue-700">How Your Points Are Calculated</h4>
                            <p className="text-gray-700 mb-2 text-sm">
                                Points are determined by the <strong>size</strong>, <strong>fabric</strong>, and <strong>usage duration</strong>.
                            </p>
                            <div className="overflow-x-auto max-h-[40rem] overflow-y-auto mb-2">
                                <table className="min-w-full border text-sm text-left text-gray-700">
                                    <thead className="bg-gray-100 sticky top-0">
                                        <tr>
                                            <th className="px-3 py-2 border">Size</th>
                                            <th className="px-3 py-2 border">Fabric</th>
                                            <th className="px-3 py-2 border">Usage</th>
                                            <th className="px-3 py-2 border">Points (₹)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pointsData.map((item, index) => (
                                            <tr key={index}>
                                                <td className="px-3 py-2 border">{item.s}</td>
                                                <td className="px-3 py-2 border">{item.f}</td>
                                                <td className="px-3 py-2 border">{item.u}</td>
                                                <td className="px-3 py-2 border">{item.p}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                </div>
                <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-4">Terms and Conditions</h3>
                    <div className="space-y-4 text-sm text-gray-600">
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