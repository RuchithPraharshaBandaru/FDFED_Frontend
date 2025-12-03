import React, { useState, useEffect } from 'react';
import { fetchBlogs } from '../../services/api';
import { BookOpen, Calendar, User, X } from 'lucide-react';

const BlogsPage = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedBlog, setSelectedBlog] = useState(null);

    useEffect(() => {
        const loadBlogs = async () => {
            try {
                setLoading(true);
                const data = await fetchBlogs();
                setBlogs(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        loadBlogs();
    }, []);

    return (
        <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-green-50/15 to-emerald-50/20 dark:from-gray-950 dark:via-green-900/25 dark:to-emerald-900/20 overflow-hidden">
            <div className="absolute inset-0 bg-dot-pattern opacity-[0.02] dark:opacity-[0.06] pointer-events-none" />
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-green-400/12 to-emerald-500/12 dark:from-green-500/20 dark:to-emerald-600/20 blur-3xl rounded-full" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-emerald-400/8 to-green-500/8 dark:from-emerald-600/15 dark:to-green-700/15 blur-3xl rounded-full" />

            <div className="relative container mx-auto py-12 px-6">
                {/* Header */}
                <div className="max-w-4xl mx-auto mb-12 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-green-500/10 to-emerald-500/10 dark:from-green-500/15 dark:to-emerald-500/15 border border-green-500/20 mb-4">
                        <BookOpen className="h-4 w-4 text-green-600 dark:text-green-400" />
                        <span className="text-sm font-medium text-green-700 dark:text-green-400">Latest Articles</span>
                    </div>
                    <h1 className="text-5xl font-extrabold mb-4">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-green-700 to-emerald-700 dark:from-white dark:via-green-400 dark:to-emerald-400">
                            Blog & News
                        </span>
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">
                        Stay updated with the latest insights, tips, and stories from our community.
                    </p>
                </div>

                {/* Content */}
                <div className="max-w-6xl mx-auto">
                    {loading ? (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden animate-pulse">
                                    <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
                                    <div className="p-6 space-y-3">
                                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : error ? (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-8 text-center">
                            <p className="text-red-600 dark:text-red-400 text-lg">{error}</p>
                        </div>
                    ) : blogs.length === 0 ? (
                        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl p-12 text-center">
                            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600 dark:text-gray-400 text-lg">No blogs available yet. Check back soon!</p>
                        </div>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {blogs.map((blog) => (
                                <article 
                                    key={blog._id}
                                    onClick={() => setSelectedBlog(blog)}
                                    className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200/50 dark:border-gray-700/50 hover:border-green-500/30 dark:hover:border-green-400/30 cursor-pointer"
                                >
                                    {/* Blog Image */}
                                    <div className="relative h-48 overflow-hidden bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30">
                                        {blog.image ? (
                                            <img 
                                                src={blog.image} 
                                                alt={blog.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <BookOpen className="h-16 w-16 text-green-400/50 dark:text-green-500/50" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Blog Content */}
                                    <div className="p-6">
                                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors line-clamp-2">
                                            {blog.title}
                                        </h2>
                                        
                                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3 leading-relaxed">
                                            {blog.content}
                                        </p>

                                        {/* Meta Information */}
                                        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-700">
                                            <div className="flex items-center gap-1.5">
                                                <User className="h-3.5 w-3.5" />
                                                <span>{blog.author || 'Admin'}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Calendar className="h-3.5 w-3.5" />
                                                <span>{new Date(blog.createdAt).toLocaleDateString('en-US', { 
                                                    month: 'short', 
                                                    day: 'numeric', 
                                                    year: 'numeric' 
                                                })}</span>
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </div>

                {/* Blog Detail Modal */}
                {selectedBlog && (
                    <div 
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                        onClick={() => setSelectedBlog(null)}
                    >
                        <div 
                            className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Close Button */}
                            <button
                                onClick={() => setSelectedBlog(null)}
                                className="sticky top-4 right-4 float-right z-10 p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                            >
                                <X className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                            </button>

                            {/* Blog Image */}
                            {selectedBlog.image && (
                                <div className="relative h-64 md:h-80 overflow-hidden rounded-t-2xl bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30">
                                    <img 
                                        src={selectedBlog.image} 
                                        alt={selectedBlog.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}

                            {/* Blog Content */}
                            <div className="p-8">
                                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                                    {selectedBlog.title}
                                </h1>

                                {/* Meta Information */}
                                <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                                    <div className="flex items-center gap-2">
                                        <User className="h-4 w-4" />
                                        <span>{selectedBlog.author || 'Admin'}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4" />
                                        <span>{new Date(selectedBlog.createdAt).toLocaleDateString('en-US', { 
                                            month: 'long', 
                                            day: 'numeric', 
                                            year: 'numeric' 
                                        })}</span>
                                    </div>
                                </div>

                                {/* Full Content */}
                                <div className="prose prose-lg dark:prose-invert max-w-none">
                                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                                        {selectedBlog.content}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BlogsPage;