import { useState } from "react";
import { User, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Friend } from "@/types/database";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

interface FriendRequestCardProps {
  request: Friend;
  onUpdate: () => void;
}

export function FriendRequestCard({ request, onUpdate }: FriendRequestCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();
  
  const handleResponse = async (status: 'accepted' | 'rejected') => {
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('friends')
        .update({ status })
        .eq('id', request.id);
        
      if (error) throw error;
      onUpdate();
      toast.success(`Friend request ${status}`);
    } catch (error) {
      toast.error("Failed to update friend request");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
          <User className="h-5 w-5" />
        </div>
        <div>
          <p className="font-medium">{request.sender.username}</p>
          <p className="text-sm text-muted-foreground">{request.sender.full_name}</p>
        </div>
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleResponse('accepted')}
          disabled={isLoading}
        >
          <Check className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleResponse('rejected')}
          disabled={isLoading}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}