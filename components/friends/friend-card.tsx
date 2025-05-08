import { useState } from "react";
import { User, UserMinus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Friend, Profile } from "@/types/database";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

interface FriendCardProps {
  friend: Friend;
  onRemove: () => void;
}

export function FriendCard({ friend, onRemove }: FriendCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();
  
  const handleRemoveFriend = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('friends')
        .delete()
        .eq('id', friend.id);
        
      if (error) throw error;
      onRemove();
      toast.success("Friend removed");
    } catch (error) {
      toast.error("Failed to remove friend");
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
          <p className="font-medium">{friend.receiver?.username || friend.sender?.username}</p>
          <p className="text-sm text-muted-foreground">
            {friend.receiver?.full_name || friend.sender?.full_name}
          </p>
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleRemoveFriend}
        disabled={isLoading}
      >
        <UserMinus className="h-4 w-4" />
      </Button>
    </div>
  );
}