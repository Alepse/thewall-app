# TheWall - Social Media Platform

A modern, Facebook-inspired social media platform built with Next.js, TypeScript, Tailwind CSS, and Supabase.

## Features

### ✅ Implemented Features
- **Post Creation:** Only “John Doe” can create posts.
- **Post Deletion:** Only “John Doe” can delete their own posts (via ellipsis menu at the top right of each post).
- **Like System:** Anyone can like/unlike posts (not user-specific, just increments/decrements the count).
- **Comments:** Anyone can add comments as “John Doe”.
- **Facebook-like UI:** Modern, responsive design with blue theme and card-based layout.
- **Sidebar Navigation:** Menu items for Home, Friends, Groups, Marketplace, etc. (most show “coming soon” alerts).
- **Trending Topics:** Static trending topics in the right sidebar.
- **Search Bar:** Present in the header (not functional).

### 🚧 Not Yet Implemented / Placeholder Only
- **Authentication:** No sign up, sign in, or user switching.
- **User Profiles:** No profile editing, avatars are colored initials only.
- **Follows/Unfollows:** Not implemented.
- **Notifications:** Not implemented.
- **Direct Messaging:** Not implemented.
- **Image Uploads:** Not implemented.
- **Real-Time Updates:** Not implemented (manual refresh required).
- **Advanced Search:** Not implemented.
- **Dark Mode:** Not implemented.
- **Mobile App:** Not implemented.
- **Settings, Friends, Groups, Marketplace, Pages, Events, Gaming, etc.:** Sidebar buttons show alert only.

## How It Works

- All posts and comments are made as “John Doe”.
- Only “John Doe” posts can be deleted, via a menu on each post.
- Likes and comments are not tied to any real user account.
- Most navigation and social features are placeholders for future development.

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Main home page
│   └── globals.css         # Global styles
├── components/             # React components
│   ├── Header.tsx          # Main header with navigation
│   ├── PostForm.tsx        # Post creation form
│   ├── PostList.tsx        # Posts display with likes/comments and delete
│   └── Sidebar.tsx         # Left sidebar navigation
└── lib/                    # Utility functions
    ├── supabaseClient.ts   # Supabase client configuration
    └── utils.ts            # Helper functions and date formatting
```

## Setup

1. Install dependencies:  
   `npm install`
2. Set up your Supabase project and run the SQL in your setup script.
3. Add your Supabase URL and anon key to `.env.local`.
4. Start the app:  
   `npm run dev`

The application will be available at `http://localhost:3000`

## License

MIT License - feel free to use this project for personal or commercial purposes.
