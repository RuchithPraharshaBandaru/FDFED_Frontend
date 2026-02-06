import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { apiConfirmStripePayment } from "../../services/api";

const CheckoutSuccess = () => {
    const [params] = useSearchParams();
    const sessionId = params.get("session_id");
    const [status, setStatus] = useState("confirming");
    const [error, setError] = useState("");

    useEffect(() => {
        if (!sessionId) {
            setStatus("missing");
            return;
        }

        const confirm = async () => {
            try {
                await apiConfirmStripePayment(sessionId);
                setStatus("confirmed");
            } catch (err) {
                setError(err.message || "Stripe confirmation failed");
                setStatus("failed");
            }
        };

        confirm();
    }, [sessionId]);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16 px-4">
            <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8 text-center">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Payment successful</h1>
                <p className="mt-3 text-gray-600 dark:text-gray-300">
                    Your payment was received. It may take a few seconds to reflect in your orders.
                </p>
                {status === "confirming" && (
                    <p className="mt-2 text-sm text-gray-500">Confirming payment...</p>
                )}
                {status === "failed" && (
                    <p className="mt-2 text-sm text-red-600">{error}</p>
                )}
                {sessionId && (
                    <p className="mt-2 text-xs text-gray-500 break-all">Session: {sessionId}</p>
                )}
                <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                        to="/account/orders"
                        className="inline-flex justify-center rounded-lg px-4 py-2 bg-green-600 text-white hover:bg-green-700"
                    >
                        View orders
                    </Link>
                    <Link
                        to="/store"
                        className="inline-flex justify-center rounded-lg px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200"
                    >
                        Continue shopping
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default CheckoutSuccess;
