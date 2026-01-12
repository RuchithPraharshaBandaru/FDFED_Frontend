import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { selectAdminBlogs, fetchBlogs } from '../../../store/slices/adminSlice';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import Card from '../../ui/Card';
import Modal from '../../ui/Modal';
import { Calendar, User, Plus, Search, MoreVertical, FileText } from 'lucide-react';

const BlogsPage = () => {
  const dispatch = useDispatch();
  const blogs = useSelector(selectAdminBlogs);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBlog, setSelectedBlog] = useState(null);

  useEffect(() => { dispatch(fetchBlogs({})); }, [dispatch]);

  const filteredBlogs = (blogs.items || []).filter(b => 
    b.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.author?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 p-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Blog Posts</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your blog content and articles</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search blogs..." 
              className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all w-full sm:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Link to="/admin/blogs/create">
            <Button className="flex items-center gap-2">
              <Plus size={18} /> New Blog
            </Button>
          </Link>
        </div>
      </div>

      {blogs.loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-80 bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBlogs.map(b => (
            <Card key={b._id} className="group hover:shadow-lg transition-all duration-300 border-none overflow-hidden flex flex-col h-full p-0">
              <div className="relative h-48 overflow-hidden">
                <img
                  src={b.image || 'https://via.placeholder.com/400x300?text=No+Image'}
                  alt={b.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              
              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mb-3">
                  <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
                    <Calendar size={12} />
                    <span>{new Date(b.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User size={12} />
                    <span>{b.author || 'Unknown'}</span>
                  </div>
                </div>

                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {b.title}
                </h2>
                
                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 mb-4 flex-1">
                  {b.content}
                </p>

                <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between mt-auto">
                  <button 
                    onClick={() => setSelectedBlog(b)}
                    className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    Read More <FileText size={14} />
                  </button>
                  <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-gray-400 hover:text-gray-600 transition-colors">
                    <MoreVertical size={18} />
                  </button>
                </div>
              </div>
            </Card>
          ))}
          
          {filteredBlogs.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <FileText size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">No blogs found</h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-sm mt-2">
                {searchTerm ? `No results found for "${searchTerm}"` : "Get started by creating your first blog post."}
              </p>
              {!searchTerm && (
                <Link to="/admin/blogs/create" className="mt-4">
                  <Button variant="outline">Create Blog</Button>
                </Link>
              )}
            </div>
          )}
        </div>
      )}

      {/* Blog Detail Modal */}
      <Modal
        isOpen={!!selectedBlog}
        onClose={() => setSelectedBlog(null)}
        title={selectedBlog?.title}
      >
        {selectedBlog && (
          <div className="space-y-6">
            <div className="relative h-64 w-full rounded-xl overflow-hidden">
              <img
                src={selectedBlog.image || 'https://via.placeholder.com/800x400?text=No+Image'}
                alt={selectedBlog.title}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1.5">
                <Calendar size={16} />
                <span>{new Date(selectedBlog.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <User size={16} />
                <span>{selectedBlog.author || 'Unknown'}</span>
              </div>
            </div>

            <div className="prose dark:prose-invert max-w-none">
              <p className="whitespace-pre-line text-gray-700 dark:text-gray-300 leading-relaxed">
                {selectedBlog.content}
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default BlogsPage;
