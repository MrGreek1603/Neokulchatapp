"use client";

import { useState } from 'react';
import Image from 'next/image';
import { FileIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MediaUpload } from '@/types/database';

interface MediaPreviewProps {
  media: MediaUpload;
  onRemove: () => void;
}

export function MediaPreview({ media, onRemove }: MediaPreviewProps) {
  const [isLoading, setIsLoading] = useState(true);
  
  if (media.type === 'image') {
    return (
      <div className="relative group">
        <div className="aspect-square w-32 rounded-lg overflow-hidden bg-muted">
          <Image
            src={media.url}
            alt="Upload preview"
            className="object-cover"
            fill
            onLoadingComplete={() => setIsLoading(false)}
          />
        </div>
        <Button
          variant="destructive"
          size="icon"
          className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={onRemove}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  }
  
  return (
    <div className="relative group">
      <div className="w-32 h-32 rounded-lg bg-muted flex items-center justify-center">
        <FileIcon className="h-8 w-8 text-muted-foreground" />
        <span className="text-xs text-muted-foreground mt-2">
          {media.file.name}
        </span>
      </div>
      <Button
        variant="destructive"
        size="icon"
        className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={onRemove}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}