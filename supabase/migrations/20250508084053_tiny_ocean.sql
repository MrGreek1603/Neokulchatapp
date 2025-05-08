/*
  # Add media support to messages

  1. Changes
    - Add media_url column to messages table
    - Add media_type column to messages table
    - Create storage bucket for chat media
    - Add policies for media access

  2. Security
    - Enable RLS for storage bucket
    - Add policies for authenticated users
*/

-- Create storage bucket for chat media
INSERT INTO storage.buckets (id, name, public) 
VALUES ('chat_media', 'chat_media', false);

-- Add media columns to messages table
ALTER TABLE messages 
ADD COLUMN IF NOT EXISTS media_url TEXT,
ADD COLUMN IF NOT EXISTS media_type TEXT;

-- Storage policies
CREATE POLICY "Users can upload media" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'chat_media' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can read media from their chats" ON storage.objects
FOR SELECT TO authenticated
USING (
  bucket_id = 'chat_media' AND
  EXISTS (
    SELECT 1 FROM messages m
    JOIN chat_members cm ON m.chat_id = cm.chat_id
    WHERE 
      cm.user_id = auth.uid() AND
      m.media_url = name
  )
);