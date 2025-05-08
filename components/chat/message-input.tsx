"use client";

import { useState, useRef } from 'react';
import { Send, Paperclip, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MediaPreview } from './media-preview';
import { uploadMedia, getMediaType, ACCEPTED_FILE_TYPES } from '@/lib/utils';
import { MediaUpload } from '@/types/database';
import { useAuth } from '@/components/auth/auth-provider';
import { toast } from 'sonner';

interface MessageInputProps {
  chatId: string;
  onSend: (content: string, mediaUrl?: string, mediaType?: string) => Promise<void>;
}

export function MessageInput({ chatId, onSend }: MessageInputProps) {
  const [content, setContent] = useState('');
  const [media, setMedia] = useState<MediaUpload | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  
  const handleSubmit = async () => {
    if (!content.trim() && !media) return;
    
    try {
      setIsSubmitting(true);
      
      let mediaUrl = '';
      let mediaType = '';
      
      if (media) {
        mediaUrl = await uploadMedia(media.file, user!.id);
        mediaType = media.type;
      }
      
      await onSend(content.trim(), mediaUrl || undefined, mediaType || undefined);
      setContent('');
      setMedia(null);
    } catch (error) {
      toast.error('Failed to send message');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    try {
      // Create object URL for preview
      const url = URL.createObjectURL(file);
      const type = getMediaType(file);
      
      setMedia({
        file,
        type,
        url,
      });
    } catch (error) {
      toast.error('Failed to upload file');
      console.error(error);
    }
  };
  
  return (
    <div className="p-4 border-t">
      {media && (
        <div className="mb-4">
          <MediaPreview
            media={media}
            onRemove={() => setMedia(null)}
          />
        </div>
      )}
      <div className="flex items-end gap-2">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Type a message..."
          className="min-h-[80px]"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
        />
        <div className="flex flex-col gap-2">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept={Object.keys(ACCEPTED_FILE_TYPES).join(',')}
            onChange={handleFileSelect}
          />
          <Button
            size="icon"
            variant="ghost"
            onClick={() => fileInputRef.current?.click()}
            disabled={isSubmitting}
          >
            <Paperclip className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            onClick={handleSubmit}
            disabled={isSubmitting || (!content.trim() && !media)}
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}