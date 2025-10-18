import React, { useState, useEffect } from 'react';
import { ContentPost, PostType } from '../../types';

interface PostFormProps {
  post?: ContentPost;
  onSave: (post: Omit<ContentPost, 'id'>, id?: string) => void;
  onCancel: () => void;
  defaultType: PostType;
}

const PostForm: React.FC<PostFormProps> = ({ post, onSave, onCancel, defaultType }) => {
    const [formData, setFormData] = useState<Omit<ContentPost, 'id' | 'createdAt'>>({
        title: '',
        category: '',
        content: '',
        status: 'published',
        type: defaultType,
        publishedDate: new Date().toISOString().split('T')[0],
        examDate: '',
        imageUrl: '',
    });

    useEffect(() => {
        if (post) {
            setFormData({ ...post });
        } else {
            // Reset form for new post, ensuring correct default type
            setFormData({
                title: '',
                category: '',
                content: '',
                status: 'published',
                type: defaultType,
                publishedDate: new Date().toISOString().split('T')[0],
                examDate: '',
                imageUrl: '',
            });
        }
    }, [post, defaultType]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value as any }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, imageUrl: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { createdAt, ...saveData } = formData as any;
        onSave(saveData, post?.id);
    };

    const getTitleForType = (type: PostType) => {
        switch(type) {
            case 'exam-notices': return 'Notice Title';
            case 'results': return 'Result Title';
            default: return 'Post Title';
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">{getTitleForType(formData.type)} *</label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" required />
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Category *</label>
                    <input type="text" name="category" value={formData.category} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" required />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Status *</label>
                    <select name="status" value={formData.status} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-white" required>
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                    </select>
                </div>
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-700">Content *</label>
                <textarea name="content" value={formData.content} onChange={handleChange} rows={8} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" required />
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-700">Featured Image</label>
                <input type="file" accept="image/*" onChange={handleImageChange} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100" />
                {formData.imageUrl && (
                    <div className="mt-4 relative w-fit">
                        <img src={formData.imageUrl} alt="Preview" className="h-auto max-h-48 object-contain rounded-md border" />
                        <button 
                            type="button" 
                            onClick={() => setFormData(prev => ({ ...prev, imageUrl: '' }))}
                            className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-lg font-bold leading-none hover:bg-red-700"
                            aria-label="Remove Image"
                        >
                            &times;
                        </button>
                    </div>
                )}
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Published Date *</label>
                    <input type="date" name="publishedDate" value={formData.publishedDate} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Exam Date (if applicable)</label>
                    <input type="date" name="examDate" value={formData.examDate || ''} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
                </div>
            </div>
            <div className="flex justify-end gap-4 mt-6 pt-4 border-t">
                <button type="button" onClick={onCancel} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300">Cancel</button>
                <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">Save</button>
            </div>
        </form>
    );
};

export default PostForm;