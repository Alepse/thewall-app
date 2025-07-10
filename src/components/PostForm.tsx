"use client";
import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { getInitials, getAvatarColor } from "../lib/utils";
import imageCompression from 'browser-image-compression';
import { toast } from 'sonner';

type PostFormProps = {
  onPost: () => void;
};

export default function PostForm({ onPost }: PostFormProps) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [largeImageWarning, setLargeImageWarning] = useState<string | null>(null);

  // Default sample user
  const sampleUser = "John Doe";
  const avatarColor = getAvatarColor(sampleUser);
  const initials = getInitials(sampleUser);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (!file) {
      setImageFile(null);
      setImagePreview(null);
      setLargeImageWarning(null);
      return;
    }
    // Compress the image
    try {
      const compressedFile = await imageCompression(file, {
        maxSizeMB: 10,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      });
      setImageFile(compressedFile);
      setImagePreview(URL.createObjectURL(compressedFile));
      if (compressedFile.size > 10 * 1024 * 1024) {
        setLargeImageWarning('Warning: This image is still very large and may not display in some browsers.');
      } else {
        setLargeImageWarning(null);
      }
    } catch (err) {
      console.error('Image compression failed:', err);
      toast.error('Image compression failed', {
        description: 'Please try another image.'
      });
      setImageFile(null);
      setImagePreview(null);
      setLargeImageWarning(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !imageFile) return;
    
    setLoading(true);
    let photo_url = null;
    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('post-photos').upload(fileName, imageFile);
      if (uploadError) {
        toast.error('Image upload failed', {
          description: uploadError.message
        });
        setLoading(false);
        return;
      }
      const { data } = supabase.storage.from('post-photos').getPublicUrl(fileName);
      photo_url = data?.publicUrl || null;
      console.log('Public URL:', photo_url);
    }
    const { error } = await supabase.from("posts").insert([{ 
      content,
      user_id: null,
      user_name: sampleUser,
      photo_url
    }]);
    setLoading(false);
    
    if (!error) {
      setContent("");
      setImageFile(null);
      setImagePreview(null);
      toast.success('Post created successfully!', {
        description: 'Your post has been shared.'
      });
      onPost();
    } else {
      toast.error('Error posting', {
        description: error.message
      });
    }
  };

  return (
    <div className="card p-4 mb-6">
      <div className="flex space-x-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0"
          style={{ backgroundColor: avatarColor }}
        >
          {initials}
        </div>
        <div className="flex-1">
          <form onSubmit={handleSubmit}>
            {imagePreview && (
              <div className="mb-3 flex flex-col items-center">
                <div className="bg-white border-2 border-primary-blue rounded-xl shadow-lg p-2 inline-block">
                  <img src={imagePreview} alt="Preview" className="max-h-48 rounded-lg object-contain" style={{background: '#f3f4f6'}} />
                </div>
                {largeImageWarning && (
                  <div className="text-xs text-yellow-600 mt-2">{largeImageWarning}</div>
                )}
              </div>
            )}
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind, John?"
              rows={3}
              className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent"
              maxLength={500}
            />
            <div className="flex items-center justify-between mt-3">
              <div className="flex space-x-2 items-center">
                <label className="p-2 text-gray-500 hover:bg-gray-100 rounded-full cursor-pointer" title="Add photo">
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                  </svg>
                </label>
                {imageFile && (
                  <button type="button" className="text-xs text-red-500 underline cursor-pointer" onClick={() => { setImageFile(null); setImagePreview(null); }}>Remove</button>
                )}
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-500">
                  {content.length}/500
                </span>
                <button
                  type="submit"
                  disabled={loading || (!content.trim() && !imageFile)}
                  className="btn-primary px-6 py-2 cursor-pointer"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
                      Posting...
                    </div>
                  ) : (
                    'Post'
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 