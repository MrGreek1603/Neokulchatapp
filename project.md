# Neokul Chat App

## Overview
Neokul Chat App is a modern, full-stack chat application designed for real-time communication between users. It supports direct messaging, group chats, friend management, and user authentication. The project leverages a robust backend, a responsive frontend, and integrates with Supabase for authentication and database management.

## Features
- **User Authentication:** Secure sign up, login, and profile management using Supabase Auth.
- **Direct Messaging:** One-on-one chat between users with real-time updates.
- **Group Chats:** Create, join, and manage group conversations.
- **Friend System:** Send, accept, and decline friend requests.
- **Media Sharing:** Send images and media in chat.
- **Responsive UI:** Modern, mobile-friendly interface built with React and Tailwind CSS.

## Tech Stack
- **Frontend:** Next.js (React), Tailwind CSS
- **Backend:** Next.js API routes, Drizzle ORM
- **Database:** PostgreSQL (managed by Supabase)
- **Authentication:** Supabase Auth
- **ORM & Migrations:** Drizzle ORM & Drizzle Kit

## Project Structure
- `app/` - Contains Next.js pages, API routes, and UI layouts
- `components/` - Reusable React components (UI, chat, auth, etc.)
- `db/` - Database schema and migration files
- `lib/` - Utility libraries and Supabase client setup
- `supabase/` - Supabase configuration and seed scripts
- `types/` - TypeScript type definitions

## How It Works
1. **Authentication:**
   - Users sign up or log in using Supabase Auth.
   - Auth state is managed on the frontend and backend for secure API access.

2. **Chat System:**
   - Users can send direct messages or participate in group chats.
   - Messages are stored in PostgreSQL and delivered in real-time using API routes and Supabase features.

3. **Friend & Group Management:**
   - Users can send/accept/decline friend requests.
   - Groups can be created, joined, and managed, with group membership tracked in the database.

4. **Media Sharing:**
   - Users can upload and share media files in chat, with previews and secure storage.

5. **Database & Migrations:**
   - Database schema is defined in TypeScript using Drizzle ORM.
   - Migrations are managed with Drizzle Kit for version control and easy updates.

## Getting Started
1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Set up environment variables:**
   - Copy `.env.local.example` to `.env.local` and fill in your Supabase credentials and database URL.
3. **Run database migrations:**
   ```bash
   npx drizzle-kit migrate
   ```
4. **Start the development server:**
   ```bash
   npm run dev
   ```

## Contributing
Feel free to open issues or pull requests to improve the app!

---

**Neokul Chat App** is a learning and productivity tool, demonstrating best practices in full-stack TypeScript development with modern frameworks and cloud services. 