import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf,  Globe, Heart, Rocket, Recycle, Headset, MapPin, Phone, Mail } from 'lucide-react';


const AboutUsPage = () => {
    return (
        <div className="bg-green-50 dark:bg-gray-900 font-sans text-green-900 dark:text-gray-100">
            {/* Hero Section */}

            <section className="bg-green-100 dark:bg-gray-800 py-16">
                <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-12">
                    <div className="flex-1">
                        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight dark:text-white">
                            Fashion for the Future<br />
                            <span className="text-green-500">Sustainable. Stylish. Swift.</span>
                        </h1>
                        <p className="text-lg text-green-800 dark:text-gray-300 mb-6">
                            At SwiftMart, we believe in clothing that looks good, feels good, and does good. Discover timeless fashion, responsibly sourced and delivered to your doorstep.
                        </p>
                        <Link to="/store" className="inline-block bg-green-500 text-white px-6 py-3 rounded-lg font-semibold shadow hover:bg-green-600 transition">
                            Explore Collection
                        </Link>
                    </div>
                    <div className="flex-1 flex justify-center">
                        <img src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=600&q=80"
                            alt="Fashionable clothing"
                            className="rounded-xl shadow-lg object-cover w-40 h-40 md:w-64 md:h-64" />
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section className="py-16">
                <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
                    <div className="flex justify-center">
                        <img src="https://images.unsplash.com/photo-1524253482453-3fed8d2fe12b?auto=format&fit=crop&w=600&q=80"
                            alt="Sustainable fashion"
                            className="rounded-xl shadow-md object-cover w-40 h-40 md:w-64 md:h-64" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold mb-4 dark:text-white">About SwiftMart</h2>
                        <p className="mb-4 text-green-800 dark:text-gray-300">
                            Founded in 2025, SwiftMart is your trusted destination for quality clothing and lifestyle essentials. We are passionate about sustainability, ethical sourcing, and empowering you to express your style with confidence.
                        </p>
                        <ul className="space-y-2 text-green-700 dark:text-gray-300">
                            <li className="flex items-center"><Leaf className="text-green-500 mr-2" size={20} /> Eco-friendly fabrics & packaging</li>
                            <li className="flex items-center"><Leaf className="text-green-500 mr-2" size={20} /> Curated collections for every season</li>
                            <li className="flex items-center"><Globe className="text-green-500 mr-2" size={20} /> Responsibly sourced, globally delivered</li>
                            <li className="flex items-center"><Heart className="text-green-500 mr-2" size={20} /> Customer-first service, always</li>
                        </ul>
                        <Link to="/contact" className="mt-6 inline-block bg-green-100 dark:bg-gray-700 text-green-700 dark:text-green-400 px-5 py-2 rounded hover:bg-green-200 dark:hover:bg-gray-600 transition border border-green-200 dark:border-gray-600 font-semibold">
                            Contact Us
                        </Link>
                    </div>
                </div>
            </section>

            {/* Team/Values Section */}
            <section className="bg-white dark:bg-gray-800 py-16">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-6 dark:text-white">Our Promise</h2>
                    <div className="flex flex-col md:flex-row justify-center gap-8">
                        <div className="flex-1 bg-green-50 dark:bg-gray-700 rounded-lg p-8 shadow hover:shadow-lg transition">
                            <Rocket className="text-3xl text-green-500 mb-4 mx-auto" />
                            <h3 className="font-semibold text-lg mb-2 dark:text-white">Swift Delivery</h3>
                            <p className="text-green-700 dark:text-gray-300">Get your favorite styles delivered quickly and reliably, right to your door.</p>
                        </div>
                        <div className="flex-1 bg-green-50 dark:bg-gray-700 rounded-lg p-8 shadow hover:shadow-lg transition">
                            <Recycle className="text-3xl text-green-500 mb-4 mx-auto" />
                            <h3 className="font-semibold text-lg mb-2 dark:text-white">Sustainable Choices</h3>
                            <p className="text-green-700 dark:text-gray-300">We prioritize eco-friendly materials and ethical production at every step.</p>
                        </div>
                        <div className="flex-1 bg-green-50 dark:bg-gray-700 rounded-lg p-8 shadow hover:shadow-lg transition">
                            <Headset className="text-3xl text-green-500 mb-4 mx-auto" />
                            <h3 className="font-semibold text-lg mb-2 dark:text-white">24/7 Support</h3>
                            <p className="text-green-700 dark:text-gray-300">Our team is always here to help you with any questions or concerns.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-8 text-center dark:text-white">Get in Touch</h2>
                    <div className="grid md:grid-cols-2 gap-10">
                        <div className="space-y-6">
                            <div className="flex items-center space-x-4">
                                <MapPin className="text-green-500 text-2xl flex-shrink-0" />
                                <div>
                                    <h4 className="font-semibold dark:text-white">Address</h4>
                                    <p className="dark:text-gray-300">123 Fashion Street, Mumbai, India</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <Phone className="text-green-500 text-2xl flex-shrink-0" />
                                <div>
                                    <h4 className="font-semibold dark:text-white">Phone</h4>
                                    <p className="dark:text-gray-300">+91 72493 99999</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <Mail className="text-green-500 text-2xl flex-shrink-0" />
                                <div>
                                    <h4 className="font-semibold dark:text-white">Email</h4>
                                    <p className="dark:text-gray-300">support@swiftmart.com</p>
                                </div>
                            </div>
                        </div>
                        <form className="bg-green-50 dark:bg-gray-800 rounded-lg p-8 shadow space-y-4">
                            <input type="text" placeholder="Your Name" className="w-full px-4 py-2 rounded border border-green-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400" required />
                            <input type="email" placeholder="Your Email" className="w-full px-4 py-2 rounded border border-green-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400" required />
                            <textarea placeholder="Your Message" className="w-full px-4 py-2 rounded border border-green-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400" rows="4" required></textarea>
                            <button type="submit" className="bg-green-500 text-white px-6 py-2 rounded font-semibold hover:bg-green-600 transition">Send Message</button>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutUsPage;