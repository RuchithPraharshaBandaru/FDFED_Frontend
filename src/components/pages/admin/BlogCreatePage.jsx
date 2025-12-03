import React from 'react';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import Textarea from '../../ui/Textarea';
import { addBlog } from '../../../store/slices/adminSlice';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const schema = z.object({
  title: z.string().min(3, 'Title is required'),
  content: z.string().min(10, 'Content must be at least 10 chars'),
  author: z.string().min(2, 'Author is required'),
  image: z.any().optional(),
});

const BlogCreatePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, reset } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (values) => {
    const fd = new FormData();
    fd.append('title', values.title);
    fd.append('content', values.content);
    fd.append('author', values.author);
    if (values.image?.[0]) fd.append('image', values.image[0]);

    const res = await dispatch(addBlog(fd));
    if (res.meta.requestStatus === 'fulfilled') {
      toast.success('Blog created');
      reset();
      navigate('/admin/blogs');
    } else {
      toast.error(res.payload || 'Failed to create blog');
    }
  };

  return (
    <div className="max-w-2xl space-y-4">
      <h1 className="text-2xl font-bold">Create Blog</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Input label="Title" placeholder="Spring Sale" {...register('title')} />
          {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title.message}</p>}
        </div>
        <div>
          <Textarea label="Content" rows={6} placeholder="Write details…" {...register('content')} />
          {errors.content && <p className="text-red-600 text-sm mt-1">{errors.content.message}</p>}
        </div>
        <div>
          <Input label="Author" placeholder="Admin" {...register('author')} />
          {errors.author && <p className="text-red-600 text-sm mt-1">{errors.author.message}</p>}
        </div>
        <div>
          <Input label="Image" type="file" accept="image/*" {...register('image')} />
        </div>
        <div className="flex gap-2">
          <Button type="submit">Create</Button>
          <Button type="button" variant="secondary" onClick={() => navigate(-1)}>Cancel</Button>
        </div>
      </form>
    </div>
  );
};

export default BlogCreatePage;
