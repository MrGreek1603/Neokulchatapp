"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus } from "lucide-react";
import { ForumCard } from "@/components/forums/forum-card";
import { Channel } from "@/types/database";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/auth/auth-provider";

export default function ForumsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [forums, setForums] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const supabase = createClient();
  
  const fetchForums = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('channels')
        .select(`
          *,
          members_count:channel_members(count),
          is_member:channel_members!inner(user_id)
        `);
        
      if (error) throw error;
      
      // Get join request status for each forum
      const joinRequests = await supabase
        .from('channel_join_requests')
        .select('channel_id, status')
        .eq('user_id', user.id);
        
      const forumsWithStatus = data.map(forum => ({
        ...forum,
        join_request_status: joinRequests.data?.find(
          req => req.channel_id === forum.id
        )?.status
      }));
      
      setForums(forumsWithStatus);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchForums();
  }, [user]);
  
  const filteredForums = forums.filter(forum =>
    forum.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Forums</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search forums..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Forum
          </Button>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredForums.map(forum => (
          <ForumCard
            key={forum.id}
            forum={forum}
            onJoinRequest={fetchForums}
          />
        ))}
        
        {!loading && filteredForums.length === 0 && (
          <div className="col-span-full text-center py-8 text-muted-foreground">
            No forums found
          </div>
        )}
      </div>
    </div>
  );
}