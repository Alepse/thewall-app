"use client";
import { getInitials, getAvatarColor } from '../lib/utils';
import { toast } from 'sonner';

export default function Sidebar() {
  const handleMenuClick = (label: string) => {
    toast.info(`${label} feature coming soon!`, {
      description: "This feature is currently under development."
    });
  };

  const sampleUser = "John Doe";
  const avatarColor = getAvatarColor(sampleUser);
  const initials = getInitials(sampleUser);

  const menuItems = [
    { label: 'Home', icon: '🏠', active: true },
    { label: 'Friends', icon: '👥' },
    { label: 'Groups', icon: '👥' },
    { label: 'Marketplace', icon: '🛒' },
    { label: 'Watch', icon: '📺' },
    { label: 'Memories', icon: '📅' },
    { label: 'Saved', icon: '💾' },
    { label: 'Pages', icon: '📄' },
    { label: 'Events', icon: '📅' },
    { label: 'Gaming', icon: '🎮' },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 p-4 space-y-4">
      {/* User Profile Section */}
      <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
          style={{ backgroundColor: avatarColor }}
        >
          {initials}
        </div>
        <div>
          <div className="font-semibold text-gray-900">{sampleUser}</div>
          <div className="text-sm text-gray-500">Welcome to TheWall!</div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.label}
            onClick={() => handleMenuClick(item.label)}
            className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
              item.active
                ? 'bg-blue-50 text-primary-blue'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Divider */}
      <div className="border-t border-gray-200 pt-4">
        <h3 className="text-sm font-semibold text-gray-500 mb-3">Your Shortcuts</h3>
        <div className="space-y-1">
          <button
            onClick={() => handleMenuClick('Developer Community')}
            className="w-full flex items-center space-x-3 p-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">DC</span>
            </div>
            <span className="font-medium">Developer Community</span>
          </button>
          
          <button
            onClick={() => handleMenuClick('Tech News')}
            className="w-full flex items-center space-x-3 p-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">TN</span>
            </div>
            <span className="font-medium">Tech News</span>
          </button>
        </div>
      </div>
    </div>
  );
} 