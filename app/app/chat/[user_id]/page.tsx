"use client";

import { useEffect, useState, useId } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { useAuth } from "@/components/auth/auth-provider";
import { motion, AnimatePresence } from "framer-motion";

export default function PrivateChatsPage({
  params,
}: {
  params: { user_id: string };
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();
  const [chats, setChats] = useState<
    | {
        id: string;
        message: string;
        attachment: string | null;
        createdAt: string;
        chatFrom: {
          id: string;
          name: string;
        };
      }[]
    | null
  >(null);
  const inputId = useId();
  const [newMessage, setNewMessage] = useState("");
  const [friend, setFriend] = useState<{
    id: string;
    name: string;
    email: string;
    createdAt: Date;
    displayPicture: string;
  } | null>(null);

  useEffect(() => {
    if (!user) return;

    axios
      .get("/api/chat", {
        params: {
          userId: user.id,
          chatWith: params.user_id,
        },
      })
      .then((resp) => setChats(resp.data));

    axios
      .get("/api/users", {
        params: {
          userId: params.user_id,
        },
      })
      .then((resp) => setFriend(resp.data));
  }, [params, user]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    await axios.post("/api/chat", {
      userId: user?.id,
      chatWith: params.user_id,
      message: newMessage,
    });
    setNewMessage("");
    const res = await axios.get("/api/chat", {
      params: {
        userId: user?.id,
        chatWith: params.user_id,
      },
    });
    setChats(res.data);
  };

  return (
    <div className="p-6 max-w-6xl bg-neutral-900 mx-auto space-y-6 flex flex-col justify-between h-full">
      <div>
        <div className="text-sm text-muted-foreground">
          Chatting with: {friend?.name}
        </div>

        <div className="flex flex-col gap-3">
          <AnimatePresence>
            {chats?.map((chat, index) => (
              <motion.div
                key={chat.id}
                className={`max-w-[70%] px-4 py-2 rounded-xl shadow ${
                  chat.chatFrom.id === user?.id
                    ? "self-end bg-blue-500 text-white"
                    : "self-start bg-gray-100 text-gray-900"
                }`}
                initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -20, filter: "blur(4px)" }}
                transition={{
                  duration: 0.7,
                  ease: "anticipate",
                  delay: index * 0.07, // Stagger the messages with 0.1s delay
                }}
              >
                <p className="text-sm">{chat.message}</p>
                <span className="text-xs mt-1 block text-muted-foreground">
                  {new Date(chat.createdAt).toLocaleTimeString()}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <div className="*:not-first:mt-2">
        <div className="flex gap-2">
          <Input
            id={inputId}
            className="flex-1"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <Button variant="outline" onClick={sendMessage}>
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}
