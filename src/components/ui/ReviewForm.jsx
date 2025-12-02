// src/components/ui/ReviewForm.jsx
import React, { useState } from 'react';
import { apiSubmitReview } from '../../services/api';

const ReviewForm = ({ productId, onReviewSubmitted }) => {
    const [rating, setRating] = useState(0);
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (rating === 0) {
            setError('Please select a rating.');
            return;
        }

        try {
            const data = await apiSubmitReview(productId, { rating, description });
            if (data.success) {
                setMessage('Review submitted successfully!');
                setRating(0);
                setDescription('');
                if (onReviewSubmitted) {
                    onReviewSubmitted(); // Tell the parent page to re-fetch reviews
                }
            }
        } catch (err) {
            setError(err.message || 'Failed to submit review.');
        }
    };

    return (
        <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl p-6 rounded-2xl shadow-xl border-2 border-gray-200/50 dark:border-gray-700/50 mt-8">
            <h3 className="text-xl font-bold mb-6 bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-200 dark:to-white bg-clip-text text-transparent">
                Write a Review
            </h3>
            {message && <p className="text-green-600 dark:text-green-400 mb-4 font-semibold">{message}</p>}
            {error && <p className="text-red-600 dark:text-red-400 mb-4 font-semibold">{error}</p>}
            
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-semibold bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-200 dark:to-white bg-clip-text text-transparent mb-3">
                        Rating
                    </label>
                    <div className="flex space-x-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                type="button"
                                key={star}
                                onClick={() => setRating(star)}
                                className={`text-3xl cursor-pointer transition-all hover:scale-110 ${
                                    star <= rating 
                                        ? 'text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]' 
                                        : 'text-gray-300 dark:text-gray-600 hover:text-yellow-300'
                                }`}
                            >
                                &#9733;
                            </button>
                        ))}
                    </div>
                </div>
                <div>
                    <label htmlFor="description" className="block text-sm font-semibold bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-200 dark:to-white bg-clip-text text-transparent mb-2">
                        Review
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        rows="4"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="mt-1 block w-full rounded-xl border-2 border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 shadow-sm focus:border-green-500/50 focus:ring-2 focus:ring-green-500/50 sm:text-sm px-4 py-3 resize-none transition-all"
                        placeholder="Share your thoughts about the product..."
                    ></textarea>
                </div>
                <div>
                    <button 
                        type="submit" 
                        className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl text-sm font-bold hover:from-green-600 hover:to-emerald-700 shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 transition-all"
                    >
                        Submit Review
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ReviewForm;