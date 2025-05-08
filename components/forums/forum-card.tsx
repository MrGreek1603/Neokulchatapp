import { useState } from "react";
import { Layout, Users, DoorOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Channel } from "@/types/database";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

interface ForumCardProps {
  forum: Channel;
  onJoinRequest: () => void;
}

export function ForumCard({ forum, onJoinRequest }: ForumCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();
  
  const handleJoinRequest = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('channel_join_requests')
        .insert({
          channel_id: forum.id,
          status: 'pending'
        });
        
      if (error) throw error;
      onJoinRequest();
      toast.success("Join request sent");
    } catch (error) {
      toast.error("Failed to send join request");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="p-4 rounded-lg border bg-card">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Layout className="h-5 w-5" />
          <h3 className="font-medium">{forum.name}</h3>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>{forum.members_count || 0} members</span>
        </div>
      </div>
      
      <p className="text-sm text-muted-foreground mb-4">{forum.description}</p>
      
      {!forum.is_member && !forum.join_request_status && (
        <Button
          className="w-full"
          onClick={handleJoinRequest}
          disabled={isLoading}
        >
          <DoorOpen className="h-4 w-4 mr-2" />
          Request to Join
        </Button>
      )}
      
      {forum.join_request_status === 'pending' && (
        <Button variant="secondary" className="w-full" disabled>
          Request Pending
        </Button>
      )}
      
      {forum.is_member && (
        <Button variant="secondary" className="w-full">
          Enter Forum
        </Button>
      )}
    </div>
  );
}