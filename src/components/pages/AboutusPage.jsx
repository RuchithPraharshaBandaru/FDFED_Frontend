import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf,  Globe, Heart, Rocket, Recycle, Headset, MapPin, Phone, Mail } from 'lucide-react';


const AboutUsPage = () => {
    return (
        <div className="relative min-h-screen bg-gradient-to-br from-white via-green-50/30 to-emerald-50/20 dark:from-gray-950 dark:via-green-900/25 dark:to-emerald-900/20 font-sans">
            {/* Background patterns */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.05),transparent_50%)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.08),transparent_50%)] pointer-events-none"></div>
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzEwYjk4MSIgc3Ryb2tlLXdpZHRoPSIxIiBvcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-[0.03] dark:opacity-[0.06] pointer-events-none"></div>
            
            {/* Floating orbs */}
            <div className="absolute top-20 left-10 w-72 h-72 bg-green-500/18 dark:bg-green-500/20 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-500/18 dark:bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"></div>
            
            {/* Hero Section */}
            <section className="relative py-20">
                <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-12">
                    <div className="flex-1">
                        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
                            <span className="bg-gradient-to-r from-gray-800 to-gray-900 dark:from-gray-100 dark:to-white bg-clip-text text-transparent">Fashion for the Future</span><br />
                            <span className="bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">Sustainable. Stylish. Swift.</span>
                        </h1>
                        <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                            At SwiftMart, we believe in clothing that looks good, feels good, and does good. Discover timeless fashion, responsibly sourced and delivered to your doorstep.
                        </p>
                        <Link to="/store" className="inline-block bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 hover:from-green-600 hover:to-emerald-700 transition-all">
                            Explore Collection
                        </Link>
                    </div>
                    <div className="flex-1 flex justify-center">
                        <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-[3px] rounded-3xl">
                            <img src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=600&q=80"
                                alt="Fashionable clothing"
                                className="rounded-3xl shadow-2xl object-cover w-48 h-48 md:w-80 md:h-80" />
                        </div>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section className="relative py-20">
                <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
                    <div className="flex justify-center">
                        <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-[3px] rounded-3xl">
                            <img src="https://images.unsplash.com/photo-1524253482453-3fed8d2fe12b?auto=format&fit=crop&w=600&q=80"
                                alt="Sustainable fashion"
                                className="rounded-3xl shadow-2xl object-cover w-48 h-48 md:w-80 md:h-80" />
                        </div>
                    </div>
                    <div>
                        <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-gray-800 to-gray-900 dark:from-gray-100 dark:to-white bg-clip-text text-transparent">About SwiftMart</h2>
                        <p className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">
                            Founded in 2025, SwiftMart is your trusted destination for quality clothing and lifestyle essentials. We are passionate about sustainability, ethical sourcing, and empowering you to express your style with confidence.
                        </p>
                        <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                            <li className="flex items-center"><Leaf className="text-green-500 mr-3" size={24} /> <span className="font-medium">Eco-friendly fabrics & packaging</span></li>
                            <li className="flex items-center"><Leaf className="text-green-500 mr-3" size={24} /> <span className="font-medium">Curated collections for every season</span></li>
                            <li className="flex items-center"><Globe className="text-green-500 mr-3" size={24} /> <span className="font-medium">Responsibly sourced, globally delivered</span></li>
                            <li className="flex items-center"><Heart className="text-green-500 mr-3" size={24} /> <span className="font-medium">Customer-first service, always</span></li>
                        </ul>
                        <Link to="/contact" className="mt-8 inline-block bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-2 border-gray-200/50 dark:border-gray-700/50 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-xl hover:border-green-500/30 transition-all font-bold shadow-sm">
                            Contact Us
                        </Link>
                    </div>
                </div>
            </section>

            {/* Team/Values Section */}
            <section className="relative py-20">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-4xl font-bold mb-12 bg-gradient-to-r from-gray-800 to-gray-900 dark:from-gray-100 dark:to-white bg-clip-text text-transparent">Our Promise</h2>
                    <div className="flex flex-col md:flex-row justify-center gap-8">
                        <div className="flex-1 bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-2xl p-8 shadow-xl border-2 border-gray-200/50 dark:border-gray-700/50 hover:shadow-2xl hover:border-green-500/30 transition-all">
                            <Rocket className="text-4xl text-green-500 mb-4 mx-auto" />
                            <h3 className="font-bold text-xl mb-3 bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-200 dark:to-white bg-clip-text text-transparent">Swift Delivery</h3>
                            <p className="text-gray-700 dark:text-gray-300">Get your favorite styles delivered quickly and reliably, right to your door.</p>
                        </div>
                        <div className="flex-1 bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-2xl p-8 shadow-xl border-2 border-gray-200/50 dark:border-gray-700/50 hover:shadow-2xl hover:border-green-500/30 transition-all">
                            <Recycle className="text-4xl text-green-500 mb-4 mx-auto" />
                            <h3 className="font-bold text-xl mb-3 bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-200 dark:to-white bg-clip-text text-transparent">Sustainable Choices</h3>
                            <p className="text-gray-700 dark:text-gray-300">We prioritize eco-friendly materials and ethical production at every step.</p>
                        </div>
                        <div className="flex-1 bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-2xl p-8 shadow-xl border-2 border-gray-200/50 dark:border-gray-700/50 hover:shadow-2xl hover:border-green-500/30 transition-all">
                            <Headset className="text-4xl text-green-500 mb-4 mx-auto" />
                            <h3 className="font-bold text-xl mb-3 bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-200 dark:to-white bg-clip-text text-transparent">24/7 Support</h3>
                            <p className="text-gray-700 dark:text-gray-300">Our team is always here to help you with any questions or concerns.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="relative py-20">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl font-bold mb-12 text-center bg-gradient-to-r from-gray-800 to-gray-900 dark:from-gray-100 dark:to-white bg-clip-text text-transparent">Get in Touch</h2>
                    <div className="grid md:grid-cols-2 gap-10">
                        <div className="space-y-8">
                            <div className="flex items-center space-x-4">
                                <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-3 rounded-xl">
                                    <MapPin className="text-white text-2xl flex-shrink-0" />
                                </div>
                                <div>
                                    <h4 className="font-bold dark:text-white text-lg">Address</h4>
                                    <p className="dark:text-gray-300">123 Fashion Street, Mumbai, India</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-3 rounded-xl">
                                    <Phone className="text-white text-2xl flex-shrink-0" />
                                </div>
                                <div>
                                    <h4 className="font-bold dark:text-white text-lg">Phone</h4>
                                    <p className="dark:text-gray-300">+91 72493 99999</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-3 rounded-xl">
                                    <Mail className="text-white text-2xl flex-shrink-0" />
                                </div>
                                <div>
                                    <h4 className="font-bold dark:text-white text-lg">Email</h4>
                                    <p className="dark:text-gray-300">support@swiftmart.com</p>
                                </div>
                            </div>
                        </div>
                        <form className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-2xl p-8 shadow-xl border-2 border-gray-200/50 dark:border-gray-700/50 space-y-4">
                            <input type="text" placeholder="Your Name" className="w-full h-11 px-4 py-3 rounded-xl border-2 border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all" required />
                            <input type="email" placeholder="Your Email" className="w-full h-11 px-4 py-3 rounded-xl border-2 border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all" required />
                            <textarea placeholder="Your Message" className="w-full px-4 py-3 rounded-xl border-2 border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 resize-none transition-all" rows="4" required></textarea>
                            <button type="submit" className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:from-green-600 hover:to-emerald-700 shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 transition-all w-full">Send Message</button>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutUsPage;