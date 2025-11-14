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
        <div className="bg-white p-6 rounded-lg shadow-sm border mt-8">
            <h3 className="text-xl font-semibold mb-4">Write a Review</h3>
            {message && <p className="text-green-600 mb-4">{message}</p>}
            {error && <p className="text-red-600 mb-4">{error}</p>}
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                    <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                type="button"
                                key={star}
                                onClick={() => setRating(star)}
                                className={`text-2xl cursor-pointer ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                            >
                                &#9733;
                            </button>
                        ))}
                    </div>
                </div>
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Review</label>
                    <textarea
                        id="description"
                        name="description"
                        rows="4"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                        placeholder="Share your thoughts about the product..."
                    ></textarea>
                </div>
                <div>
                    <button type="submit" className="bg-green-600 text-white px-5 py-2 rounded-md text-sm font-medium hover:bg-green-700">
                        Submit Review
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ReviewForm;