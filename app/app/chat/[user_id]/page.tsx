"use client";

import { useEffect, useState, useId } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { useAuth } from "@/components/auth/auth-provider";
import { motion, AnimatePresence } from "framer-motion";
import { parse, parseISO } from "date-fns";
import { toZonedTime, format } from "date-fns-tz";

export default function PrivateChatsPage({
  params,
}: {
  params: { user_id: string };
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const isGroup =
    params.user_id.startsWith("GPXX_") && params.user_id.endsWith("_GPXX");
  const [chatID, setChatID] = useState(params.user_id);
  useEffect(() => {
    setChatID(
      isGroup
        ? params.user_id.replace("GPXX_", "").replace("_GPXX", "")
        : params.user_id,
    );
  }, [params, isGroup]);
  const { user } = useAuth();
  const [lastUpdated, setLastUpdated] = useState(Date.now());

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
    createdAt: string;
    displayPicture: string;
  } | null>(null);
  const [commonChatId, setCommonChatId] = useState<string | null>(null);

  useEffect(() => {
    if (isGroup) {
      // For group chats, use the existing chat ID
      setCommonChatId(params.user_id.replace("GPXX_", "").replace("_GPXX", ""));
    } else {
      // For 1:1 chats, generate a common chat ID from the two UUIDs
      const userIds = [params.user_id, user?.id].sort(); // Sort to ensure consistency
      setCommonChatId(userIds.join("-")); // Create a consistent UUID-based chat ID
    }
  }, [params, isGroup, user]);

  useEffect(() => {
    if (!commonChatId || !user) return;

    const eventSource = new EventSource(`/api/stream?chatId=${commonChatId}`);

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setChats((prev) => [...(prev ?? []), data]);
      setLastUpdated(Date.now());
    };

    return () => eventSource.close();
  }, [commonChatId, user]);

  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      axios
        .get("/api/chat", {
          params: {
            userId: user.id,
            ...(isGroup ? { groupId: chatID } : { chatWith: chatID }),
          },
        })
        .then((resp) => {
          setChats(resp.data);
          setLastUpdated(Date.now());
        });
    }, 60000);

    return () => clearInterval(interval);
  }, [chatID, user, isGroup]);

  useEffect(() => {
    if (!user) return;

    axios
      .get("/api/chat", {
        params: {
          userId: user.id,
          ...(isGroup ? { groupId: chatID } : { chatWith: chatID }),
        },
      })
      .then((resp) => setChats(resp.data));

    isGroup
      ? axios
          .get("/api/groups", {
            params: {
              groupId: chatID,
            },
          })
          .then((resp) => setFriend(resp.data))
      : axios
          .get("/api/users", {
            params: {
              userId: chatID,
            },
          })
          .then((resp) => setFriend(resp.data));
  }, [chatID, user, isGroup]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const payload = {
      userId: user?.id,
      message: newMessage,
      ...(isGroup ? { groupId: chatID } : { chatWith: chatID }),
    };

    await axios.post("/api/chat", payload);

    await axios.put("/api/stream", {
      chatId: commonChatId,
      message: JSON.stringify({
        id: crypto.randomUUID(),
        message: newMessage,
        attachment: null,
        createdAt: new Date().toISOString(),
        chatFrom: { id: user!.id, name: user!.new_email },
      }),
    });
    axios
      .get("/api/chat", {
        params: {
          userId: user!.id,
          ...(isGroup ? { groupId: chatID } : { chatWith: chatID }),
        },
      })
      .then((resp) => setChats(resp.data));
    setNewMessage("");
  };

  return (
    <div className="p-6 max-w-6xl  mx-auto space-y-6 flex flex-col justify-between h-full">
      <div>
        {JSON.stringify(
          format(
            toZonedTime(
              new Date(),
              Intl.DateTimeFormat().resolvedOptions().timeZone,
            ),
            "hh:mm a",
          ),
        )}
        <div className="text-sm text-muted-foreground">
          Chatting with: {friend?.name}
        </div>

        <div className="flex flex-col gap-3">
          <AnimatePresence>
            {chats?.map((chat, index) => (
              <motion.div
                key={chat.id}
                className={`max-w-[70%] min-w-[80px] px-2.5 py-1.5 rounded-lg shadow-sm ${
                  chat.chatFrom.id === user?.id
                    ? "self-end bg-green-100 dark:bg-green-800 text-gray-800 dark:text-gray-200"
                    : "self-start bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                }`}
                initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -20, filter: "blur(4px)" }}
                transition={{
                  duration: 0.7,
                  ease: "anticipate",
                }}
              >
                <div className="flex flex-col">
                  {isGroup && chat.chatFrom.id !== user?.id && (
                    <div className="text-xs font-semibold text-teal-600 dark:text-teal-400 mb-0.5">
                      {chat.chatFrom.name}
                    </div>
                  )}
                  <div className="flex items-end w-full">
                    <p className="text-sm whitespace-pre-wrap break-words mr-2 flex-grow min-w-0">
                      {chat.message}
                    </p>
                    <span className="text-[11px] text-gray-500 dark:text-gray-400 self-end whitespace-nowrap shrink-0 ml-2">
                      {format(parseISO(chat.createdAt), "hh:mm a")}{" "}
                    </span>
                  </div>
                </div>
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
