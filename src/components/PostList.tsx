"use client";
import { useEffect, useState, useRef } from "react";
import { supabase } from "../lib/supabaseClient";
import { formatDate, getInitials, getAvatarColor } from "../lib/utils";

type Post = {
  id: string;
  content: string;
  created_at: string;
  user_id: string | null;
  user_name: string | null;
  likes_count: number;
  comments_count: number;
  is_liked?: boolean;
  photo_url?: string;
};

type Comment = {
  id: string;
  content: string;
  created_at: string;
  user_name: string;
  user_id: string | null;
};

type PostListProps = {
  refresh: number;
};

export default function PostList({ refresh }: PostListProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [showComments, setShowComments] = useState<Record<string, boolean>>({});
  const [newComment, setNewComment] = useState<Record<string, string>>({});
  const [openMenuPostId, setOpenMenuPostId] = useState<string | null>(null);
  const menuRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [imageModalUrl, setImageModalUrl] = useState<string | null>(null);

  // Default sample user for comments
  const sampleUser = "John Doe";

  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line
  }, [refresh]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (openMenuPostId && menuRefs.current[openMenuPostId]) {
        if (!menuRefs.current[openMenuPostId]?.contains(event.target as Node)) {
          setOpenMenuPostId(null);
        }
      }
    }
    if (openMenuPostId) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openMenuPostId]);

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (!error && data) {
      setPosts(data as Post[]);
    }
  };

  const handleLike = async (postId: string) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    if (post.is_liked) {
      // Unlike - we'll use a simple approach without user tracking
      setPosts(posts.map(p => 
        p.id === postId 
          ? { ...p, likes_count: Math.max(0, p.likes_count - 1), is_liked: false }
          : p
      ));
    } else {
      // Like
      setPosts(posts.map(p => 
        p.id === postId 
          ? { ...p, likes_count: p.likes_count + 1, is_liked: true }
          : p
      ));
    }
  };

  const fetchComments = async (postId: string) => {
    const { data, error } = await supabase
      .from("comments")
      .select("*")
      .eq("post_id", postId)
      .order("created_at", { ascending: true });
    
    if (!error && data) {
      setComments(prev => ({ ...prev, [postId]: data as Comment[] }));
    }
  };

  const handleComment = async (postId: string) => {
    if (!newComment[postId]?.trim()) return;

    const { error } = await supabase
      .from("comments")
      .insert([{
        post_id: postId,
        content: newComment[postId],
        user_id: null,
        user_name: sampleUser
      }]);

    if (!error) {
      setNewComment(prev => ({ ...prev, [postId]: '' }));
      fetchComments(postId);
      // Update comment count
      setPosts(posts.map(p => 
        p.id === postId 
          ? { ...p, comments_count: p.comments_count + 1 }
          : p
      ));
    }
  };

  const toggleComments = (postId: string) => {
    if (!showComments[postId]) {
      fetchComments(postId);
    }
    setShowComments(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  return (
    <div className="space-y-4">
      {posts.map((post) => {
        const userName = post.user_name || 'Anonymous User';
        const avatarColor = getAvatarColor(userName);
        const initials = getInitials(userName);
        
        return (
          <div key={post.id} className="card p-4 fade-in relative">
            {/* Post Header */}
            <div className="flex items-center space-x-3 mb-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0"
                style={{ backgroundColor: avatarColor }}
              >
                {initials}
              </div>
              <div>
                <div className="font-semibold text-gray-900">{userName}</div>
                <div className="text-sm text-gray-500">{formatDate(post.created_at)}</div>
              </div>
              {/* Ellipsis menu for John Doe's posts at top right */}
              {post.user_name === 'John Doe' && (
                <div className="ml-auto relative" ref={el => (menuRefs.current[post.id] = el)}>
                  <button
                    className="p-2 rounded-full hover:bg-gray-100 text-gray-500 cursor-pointer"
                    title="More options"
                    onClick={() => setOpenMenuPostId(openMenuPostId === post.id ? null : post.id)}
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <circle cx="4" cy="10" r="2" />
                      <circle cx="10" cy="10" r="2" />
                      <circle cx="16" cy="10" r="2" />
                    </svg>
                  </button>
                  {openMenuPostId === post.id && (
                    <div className="absolute right-0 mt-2 w-28 bg-white border border-gray-200 rounded shadow-lg z-10">
                      <button
                        onClick={async () => {
                          if (window.confirm('Are you sure you want to delete this post?')) {
                            const { error } = await supabase.from('posts').delete().eq('id', post.id);
                            if (!error) {
                              setPosts(posts.filter(p => p.id !== post.id));
                              setOpenMenuPostId(null);
                            } else {
                              alert('Error deleting post: ' + error.message);
                            }
                          }
                        }}
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Post Image */}
            {post.photo_url && (
              <div className="mb-4 flex justify-center">
                <div className="bg-gradient-to-br from-gray-100 to-white border border-gray-200 rounded-2xl shadow-xl p-2 inline-block transition-transform hover:scale-105 cursor-pointer" onClick={() => setImageModalUrl(post.photo_url!)}>
                  <img src={post.photo_url} alt="Post" className="max-h-80 w-full object-cover rounded-xl" style={{background: '#f3f4f6'}} />
                </div>
              </div>
            )}
            {/* Post Content */}
            <div className="text-gray-900 mb-4 leading-relaxed">
              {post.content}
            </div>

            {/* Post Stats */}
            <div className="flex items-center justify-between text-sm text-gray-500 mb-3 pb-3 border-b border-gray-100">
              <div className="flex items-center space-x-4">
                <span>{post.likes_count} likes</span>
                <span>{post.comments_count} comments</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-1 items-center">
              <button
                onClick={() => handleLike(post.id)}
                className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-lg transition-colors ${
                  post.is_liked 
                    ? 'text-primary-blue bg-blue-50' 
                    : 'text-gray-600 hover:bg-gray-100'
                } cursor-pointer`}
              >
                <svg className="w-5 h-5" fill={post.is_liked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                </svg>
                <span>Like</span>
              </button>
              
              <button
                onClick={() => toggleComments(post.id)}
                className="flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span>Comment</span>
              </button>
            </div>

            {/* Comments Section */}
            {showComments[post.id] && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                {/* Add Comment */}
                <div className="flex space-x-3 mb-4">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0"
                    style={{ backgroundColor: getAvatarColor(sampleUser) }}
                  >
                    {getInitials(sampleUser)}
                  </div>
                  <div className="flex-1 flex space-x-2">
                    <input
                      type="text"
                      value={newComment[post.id] || ''}
                      onChange={(e) => setNewComment(prev => ({ ...prev, [post.id]: e.target.value }))}
                      placeholder="Write a comment..."
                      className="flex-1 input text-sm"
                      onKeyPress={(e) => e.key === 'Enter' && handleComment(post.id)}
                    />
                    <button
                      onClick={() => handleComment(post.id)}
                      disabled={!newComment[post.id]?.trim()}
                      className="btn-primary px-4 py-2 text-sm"
                    >
                      Post
                    </button>
                  </div>
                </div>

                {/* Comments List */}
                <div className="space-y-3">
                  {comments[post.id]?.map((comment) => {
                    const commentAvatarColor = getAvatarColor(comment.user_name);
                    const commentInitials = getInitials(comment.user_name);
                    
                    return (
                      <div key={comment.id} className="flex space-x-3">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0"
                          style={{ backgroundColor: commentAvatarColor }}
                        >
                          {commentInitials}
                        </div>
                        <div className="flex-1">
                          <div className="bg-gray-50 rounded-lg p-3">
                            <div className="font-semibold text-sm text-gray-900">{comment.user_name}</div>
                            <div className="text-sm text-gray-700 mt-1">{comment.content}</div>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">{formatDate(comment.created_at)}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );
      })}
      {/* Image Preview Modal */}
      {imageModalUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70" onClick={() => setImageModalUrl(null)}>
          <div className="relative max-w-3xl w-full mx-4" onClick={e => e.stopPropagation()}>
            <button className="absolute top-2 right-2 bg-white bg-opacity-80 rounded-full p-2 shadow hover:bg-opacity-100 transition cursor-pointer" onClick={() => setImageModalUrl(null)} aria-label="Close preview">
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <div className="bg-white rounded-2xl shadow-2xl p-4 flex justify-center items-center">
              <img src={imageModalUrl} alt="Full Preview" className="max-h-[70vh] w-auto rounded-xl object-contain" style={{background: '#f3f4f6'}} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 