import React from "react";
import { Link } from "react-router-dom";

const CheckoutCancel = () => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16 px-4">
            <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8 text-center">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Payment canceled</h1>
                <p className="mt-3 text-gray-600 dark:text-gray-300">
                    Your payment was canceled. You can retry checkout whenever you are ready.
                </p>
                <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                        to="/checkout"
                        className="inline-flex justify-center rounded-lg px-4 py-2 bg-green-600 text-white hover:bg-green-700"
                    >
                        Return to checkout
                    </Link>
                    <Link
                        to="/cart"
                        className="inline-flex justify-center rounded-lg px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200"
                    >
                        Back to cart
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default CheckoutCancel;
