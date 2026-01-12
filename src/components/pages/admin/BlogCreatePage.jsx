import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import Textarea from '../../ui/Textarea';
import Card from '../../ui/Card';
import { addBlog } from '../../../store/slices/adminSlice';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { ImagePlus, Save, X, ArrowLeft, Upload } from 'lucide-react';

const schema = z.object({
  title: z.string().min(3, 'Title is required'),
  content: z.string().min(10, 'Content must be at least 10 chars'),
  author: z.string().min(2, 'Author is required'),
  image: z.any().optional(),
});

const BlogCreatePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [preview, setPreview] = useState(null);
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset, watch } = useForm({ resolver: zodResolver(schema) });

  const imageFile = watch('image');

  // Handle image preview
  React.useEffect(() => {
    if (imageFile?.[0]) {
      const file = imageFile[0];
      const url = URL.createObjectURL(file);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [imageFile]);

  const onSubmit = async (values) => {
    const fd = new FormData();
    fd.append('title', values.title);
    fd.append('content', values.content);
    fd.append('author', values.author);
    if (values.image?.[0]) fd.append('image', values.image[0]);

    const res = await dispatch(addBlog(fd));
    if (res.meta.requestStatus === 'fulfilled') {
      toast.success('Blog created successfully');
      reset();
      navigate('/admin/blogs');
    } else {
      toast.error(res.payload || 'Failed to create blog');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-2">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create New Blog</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Share your thoughts and updates with the community</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="p-6 border-none shadow-lg">
            <form id="blog-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Blog Title</label>
                <Input 
                  placeholder="e.g., The Future of Sustainable Fashion" 
                  className="text-lg font-medium"
                  {...register('title')} 
                />
                {errors.title && <p className="text-red-500 text-sm flex items-center gap-1"><X size={12} /> {errors.title.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Content</label>
                <Textarea 
                  rows={12} 
                  placeholder="Write your article content here..." 
                  className="resize-y min-h-[200px] font-normal leading-relaxed"
                  {...register('content')} 
                />
                {errors.content && <p className="text-red-500 text-sm flex items-center gap-1"><X size={12} /> {errors.content.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Author Name</label>
                <Input 
                  placeholder="e.g., John Doe" 
                  {...register('author')} 
                />
                {errors.author && <p className="text-red-500 text-sm flex items-center gap-1"><X size={12} /> {errors.author.message}</p>}
              </div>
            </form>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6 border-none shadow-lg">
            <h3 className="font-semibold mb-4 text-gray-900 dark:text-white">Featured Image</h3>
            <div className="space-y-4">
              <div className={`relative border-2 border-dashed rounded-xl p-4 transition-colors ${preview ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-700 hover:border-gray-400'}`}>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  {...register('image')} 
                />
                {preview ? (
                  <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <p className="text-white text-sm font-medium">Click to change</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 text-blue-600 rounded-full flex items-center justify-center mb-3">
                      <ImagePlus size={24} />
                    </div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Click to upload</p>
                    <p className="text-xs text-gray-500 mt-1">SVG, PNG, JPG or GIF</p>
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 text-center">
                Recommended size: 1200x630px
              </p>
            </div>
          </Card>

          <Card className="p-6 border-none shadow-lg">
            <h3 className="font-semibold mb-4 text-gray-900 dark:text-white">Publish</h3>
            <div className="space-y-3">
              <Button 
                type="submit" 
                form="blog-form" 
                className="w-full flex items-center justify-center gap-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Publishing...' : <><Save size={18} /> Publish Post</>}
              </Button>
              <Button 
                type="button" 
                variant="secondary" 
                onClick={() => navigate(-1)}
                className="w-full"
              >
                Cancel
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BlogCreatePage;
