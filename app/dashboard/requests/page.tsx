"use client";

import { useState, useEffect } from "react";
import { FriendRequestCard } from "@/components/friends/friend-request-card";
import { Friend } from "@/types/database";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/auth/auth-provider";

export default function RequestsPage() {
  const [requests, setRequests] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const supabase = createClient();
  
  const fetchRequests = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('friends')
        .select(`
          *,
          sender:sender_id(*),
          receiver:receiver_id(*)
        `)
        .eq('receiver_id', user.id)
        .eq('status', 'pending');
        
      if (error) throw error;
      setRequests(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchRequests();
  }, [user]);
  
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Friend Requests</h1>
      
      <div className="space-y-4">
        {requests.map(request => (
          <FriendRequestCard
            key={request.id}
            request={request}
            onUpdate={fetchRequests}
          />
        ))}
        
        {!loading && requests.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No pending friend requests
          </div>
        )}
      </div>
    </div>
  );
}