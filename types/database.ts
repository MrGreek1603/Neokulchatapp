export interface Profile {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string | null;
}

export interface Friend {
  id: string;
  sender_id: string;
  receiver_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  updated_at: string | null;
  // Joined fields
  sender?: Profile;
  receiver?: Profile;
}

export interface Chat {
  id: string;
  name: string | null;
  is_group: boolean;
  created_at: string;
  created_by: string;
  updated_at: string | null;
  // Joined fields
  members?: ChatMember[];
  messages?: Message[];
  latest_message?: Message;
}

export interface ChatMember {
  id: string;
  chat_id: string;
  user_id: string;
  created_at: string;
  // Joined fields
  user?: Profile;
}

export interface Message {
  id: string;
  chat_id: string;
  sender_id: string;
  content: string;
  media_url?: string | null;
  media_type?: string | null;
  created_at: string;
  // Joined fields
  sender?: Profile;
}

export interface Channel {
  id: string;
  name: string;
  description: string | null;
  is_private: boolean;
  created_at: string;
  created_by: string;
  updated_at: string | null;
  // Joined fields
  members_count?: number;
  is_member?: boolean;
  is_moderator?: boolean;
  join_request_status?: string;
}

export interface ChannelMember {
  id: string;
  channel_id: string;
  user_id: string;
  created_at: string;
  // Joined fields
  user?: Profile;
}

export interface ChannelModerator {
  id: string;
  channel_id: string;
  user_id: string;
  created_at: string;
  // Joined fields
  user?: Profile;
}

export interface ChannelJoinRequest {
  id: string;
  channel_id: string;
  user_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  updated_at: string | null;
  // Joined fields
  user?: Profile;
  channel?: Channel;
}

export interface MediaUpload {
  file: File;
  type: string;
  url: string;
}