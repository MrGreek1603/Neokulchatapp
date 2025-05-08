import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { createClient } from './supabase/client';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function uploadMedia(file: File, userId: string): Promise<string> {
  const supabase = createClient();
  
  // Create a unique file name
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/${Date.now()}.${fileExt}`;
  
  // Upload to Supabase Storage
  const { data, error } = await supabase.storage
    .from('chat_media')
    .upload(fileName, file);
    
  if (error) {
    throw error;
  }
  
  // Get the public URL
  const { data: { publicUrl } } = supabase.storage
    .from('chat_media')
    .getPublicUrl(fileName);
    
  return publicUrl;
}

export function getMediaType(file: File): string {
  if (file.type.startsWith('image/')) return 'image';
  if (file.type.startsWith('video/')) return 'video';
  if (file.type.startsWith('audio/')) return 'audio';
  return 'file';
}

export const ACCEPTED_FILE_TYPES = {
  'image/*': [],
  'video/*': [],
  'audio/*': [],
  'application/pdf': [],
  'application/msword': [],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [],
  'application/vnd.ms-excel': [],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [],
  'application/vnd.ms-powerpoint': [],
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': [],
};