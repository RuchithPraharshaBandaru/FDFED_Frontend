import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { selectAdminBlogs, fetchBlogs } from '../../../store/slices/adminSlice';
import Button from '../../ui/Button';
import Input from '../../ui/Input';

const BlogsPage = () => {
  const dispatch = useDispatch();
  const blogs = useSelector(selectAdminBlogs);

  useEffect(() => { dispatch(fetchBlogs({})); }, [dispatch]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Blogs</h1>
        <Link to="/admin/blogs/create"><Button>New Blog</Button></Link>
      </div>
      {blogs.loading ? 'Loading…' : (
        <div className="rounded-2xl border shadow-sm overflow-hidden">
          <div className="divide-y">
            {(blogs.items || []).map(b => (
              <div key={b._id} className="p-4 flex gap-4">
                <img
                  src={b.image || 'https://via.placeholder.com/160x120?text=No+Image'}
                  alt={b.title}
                  className="h-24 w-32 md:h-28 md:w-40 rounded-lg border object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="text-base md:text-lg font-semibold">{b.title}</h2>
                    <span className="text-xs text-gray-500">{new Date(b.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="text-xs text-gray-600 mb-2">By {b.author || 'Unknown'}</div>
                  <p className="text-sm text-gray-700 line-clamp-3 whitespace-pre-line">{b.content}</p>
                </div>
              </div>
            ))}
            {(!blogs.items || blogs.items.length === 0) && (
              <div className="p-6 text-sm text-center text-muted-foreground">No blogs found.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogsPage;
