"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { FriendCard } from "@/components/friends/friend-card";
import { Friend } from "@/types/database";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/auth/auth-provider";

export default function FriendsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const supabase = createClient();
  
  useEffect(() => {
    if (!user) return;
    
    const fetchFriends = async () => {
      try {
        const { data, error } = await supabase
          .from('friends')
          .select(`
            *,
            sender:sender_id(*),
            receiver:receiver_id(*)
          `)
          .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
          .eq('status', 'accepted');
          
        if (error) throw error;
        setFriends(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFriends();
  }, [user]);
  
  const filteredFriends = friends.filter(friend => {
    const friendName = friend.sender_id === user?.id
      ? friend.receiver?.username
      : friend.sender?.username;
    return friendName?.toLowerCase().includes(searchQuery.toLowerCase());
  });
  
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Friends</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search friends..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button>Add Friend</Button>
        </div>
      </div>
      
      <div className="grid gap-4">
        {filteredFriends.map(friend => (
          <FriendCard
            key={friend.id}
            friend={friend}
            onRemove={() => setFriends(friends.filter(f => f.id !== friend.id))}
          />
        ))}
        
        {!loading && filteredFriends.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No friends found
          </div>
        )}
      </div>
    </div>
  );
}