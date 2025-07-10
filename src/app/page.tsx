"use client";
import { useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import PostForm from "../components/PostForm";
import PostList from "../components/PostList";

export default function Home() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handlePost = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="flex max-w-6xl mx-auto">
        {/* Sidebar */}
        <div className="hidden lg:block">
          <Sidebar />
        </div>
        
        {/* Main Content */}
        <div className="flex-1 max-w-2xl mx-auto px-4 py-6">
          <PostForm onPost={handlePost} />
          <PostList refresh={refreshKey} />
        </div>
        
        {/* Right Sidebar - Empty for now */}
        <div className="hidden xl:block w-80 p-4">
          <div className="card p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Trending Topics</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="p-2 hover:bg-gray-50 rounded cursor-pointer">
                #JavaScript
              </div>
              <div className="p-2 hover:bg-gray-50 rounded cursor-pointer">
                #React
              </div>
              <div className="p-2 hover:bg-gray-50 rounded cursor-pointer">
                #NextJS
              </div>
              <div className="p-2 hover:bg-gray-50 rounded cursor-pointer">
                #WebDevelopment
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
