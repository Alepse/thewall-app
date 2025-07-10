# TheWall - Social Media Platform

A modern, Facebook-inspired social media platform built with Next.js, TypeScript, Tailwind CSS, and Supabase.

## Features

### ✅ Implemented Features
- **Anonymous Posting:** All posts and comments are made as "John Doe" (no authentication required)
- **Post Creation:** Create text posts with optional image uploads
- **Image Uploads:** Upload images with automatic compression (max 10MB, compressed to ~1MB)
- **Image Preview:** Modal preview for uploaded images with modern frame design
- **Post Deletion:** Delete posts via ellipsis menu (only "John Doe" posts can be deleted)
- **Like System:** Like/unlike posts (increments/decrements count)
- **Comments:** Add comments as "John Doe" on any post
- **Facebook-like UI:** Modern, responsive design with blue theme and card-based layout
- **Sidebar Navigation:** Menu items for Home, Friends, Groups, Marketplace, etc. (shows "coming soon" alerts)
- **Trending Topics:** Static trending topics in the right sidebar
- **Search Bar:** Present in the header (shows "coming soon" alert)

### 🚧 Not Yet Implemented / Placeholder Only
- **Authentication:** No sign up, sign in, or user switching (intentionally removed)
- **User Profiles:** No profile editing, avatars are colored initials only
- **Follows/Unfollows:** Not implemented
- **Notifications:** Not implemented
- **Direct Messaging:** Not implemented
- **Real-Time Updates:** Not implemented (manual refresh required)
- **Advanced Search:** Not implemented
- **Dark Mode:** Not implemented
- **Mobile App:** Not implemented
- **Settings, Friends, Groups, Marketplace, Pages, Events, Gaming, etc.:** Sidebar buttons show alert only

## How It Works

- All posts and comments are made as "John Doe" (anonymous posting)
- Image uploads are automatically compressed for better performance
- Only "John Doe" posts can be deleted, via a menu on each post
- Likes and comments are not tied to any real user account
- Most navigation and social features are placeholders for future development

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Main home page
│   └── globals.css         # Global styles
├── components/             # React components
│   ├── PostForm.tsx        # Post creation form with image upload
│   └── PostList.tsx        # Posts display with likes/comments and delete
└── lib/                    # Utility functions
    └── supabaseClient.ts   # Supabase client configuration
```

## Database Setup

The app requires the following Supabase setup:

### Tables
- `posts` - Stores post content, images, and metadata
- `comments` - Stores comments on posts
- `likes` - Stores post likes

### Storage
- Public bucket for image uploads
- Row Level Security (RLS) policies allowing all operations

### Required SQL Policies
```sql
-- Enable RLS on all tables
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;

-- Allow all operations (for anonymous posting)
CREATE POLICY "Allow all operations on posts" ON posts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on comments" ON comments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on likes" ON likes FOR ALL USING (true) WITH CHECK (true);

-- Storage policies
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (true);
CREATE POLICY "Public Insert" ON storage.objects FOR INSERT WITH CHECK (true);
```

## Setup

1. **Install dependencies:**  
   ```bash
   npm install
   ```

2. **Set up Supabase:**
   - Create a new Supabase project
   - Run the database setup SQL (see above)
   - Create a public storage bucket named `images`
   - Set up the storage policies

3. **Environment variables:**
   Create `.env.local` with:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start the app:**  
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:3000`

## Technical Notes

- **Image Compression:** Uses `browser-image-compression` to compress images before upload
- **Hydration:** Uses UTC date formatting to avoid SSR/CSR mismatches
- **Storage:** Images are stored in Supabase Storage with public URLs
- **Security:** RLS policies allow all operations for anonymous posting

## License

MIT License - feel free to use this project for personal or commercial purposes.
