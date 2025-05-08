"use client";

import { useState } from 'react';
import Image from 'next/image';
import { FileIcon, Download } from 'lucide-react';
import { Message } from '@/types/database';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
}

export function MessageBubble({ message, isOwn }: MessageBubbleProps) {
  const [imageLoading, setImageLoading] = useState(true);
  
  const bubbleClass = isOwn
    ? "bg-primary text-primary-foreground ml-auto"
    : "bg-muted";
    
  const renderMedia = () => {
    if (!message.media_url) return null;
    
    switch (message.media_type) {
      case 'image':
        return (
          <div className="relative aspect-square w-64 rounded-lg overflow-hidden bg-muted mb-2">
            <Image
              src={message.media_url}
              alt="Shared image"
              className="object-cover"
              fill
              onLoadingComplete={() => setImageLoading(false)}
            />
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-2 mb-2 p-2 rounded bg-background/50">
            <FileIcon className="h-4 w-4" />
            <span className="text-sm flex-1 truncate">Attachment</span>
            <Button size="icon" variant="ghost" asChild>
              <a href={message.media_url} download target="_blank" rel="noopener noreferrer">
                <Download className="h-4 w-4" />
              </a>
            </Button>
          </div>
        );
    }
  };
  
  return (
    <div className={`flex flex-col max-w-[70%] ${isOwn ? 'items-end' : 'items-start'}`}>
      <div className={`rounded-lg p-3 ${bubbleClass}`}>
        {renderMedia()}
        {message.content && <p className="text-sm">{message.content}</p>}
      </div>
      <span className="text-xs text-muted-foreground mt-1">
        {format(new Date(message.created_at), 'HH:mm')}
      </span>
    </div>
  );
}