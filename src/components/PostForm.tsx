"use client";
import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { getInitials, getAvatarColor } from "../lib/utils";

type PostFormProps = {
  onPost: () => void;
};

export default function PostForm({ onPost }: PostFormProps) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  // Default sample user
  const sampleUser = "John Doe";
  const avatarColor = getAvatarColor(sampleUser);
  const initials = getInitials(sampleUser);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    
    setLoading(true);
    const { error } = await supabase.from("posts").insert([{ 
      content,
      user_id: null,
      user_name: sampleUser
    }]);
    setLoading(false);
    
    if (!error) {
      setContent("");
      onPost();
    } else {
      alert("Error posting: " + error.message);
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
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind, John?"
              rows={3}
              className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent"
              maxLength={500}
            />
            <div className="flex items-center justify-between mt-3">
              <div className="flex space-x-2">
                <button
                  type="button"
                  className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"
                  title="Add photo"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                  </svg>
                </button>
                <button
                  type="button"
                  className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"
                  title="Add emoji"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-7.536 5.879a1 1 0 001.415 0 3 3 0 014.242 0 1 1 0 001.415-1.415 5 5 0 00-7.072 0 1 1 0 000 1.415z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-500">
                  {content.length}/500
                </span>
                <button
                  type="submit"
                  disabled={loading || !content.trim()}
                  className="btn-primary px-6 py-2"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="spinner mr-2"></div>
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