"use client";

import { useEffect, useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useAuth } from "@/components/auth/auth-provider";
import { motion, AnimatePresence } from "framer-motion";
import { parseISO, format } from "date-fns";
import { useRouter } from "next/navigation";
import { Forward } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function PrivateChatsPage({
  params,
}: {
  params: { user_id: string };
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [chatID, setChatID] = useState(params.user_id);
  const router = useRouter();
  const isGroup =
    params.user_id.startsWith("GPXX_") && params.user_id.endsWith("_GPXX");

  useEffect(() => {
    setChatID(
      isGroup
        ? params.user_id.replace("GPXX_", "").replace("_GPXX", "")
        : params.user_id,
    );
  }, [params, isGroup]);
  const closeChat = () => {
    router.push("/app"); // Navigate to /app when the close button is clicked
  };

  const { user } = useAuth();
  const [lastUpdated, setLastUpdated] = useState(Date.now());
  const [chats, setChats] = useState<any[] | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [commonChatId, setCommonChatId] = useState<string | null>(null);
  const [friend, setFriend] = useState<any | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [myFriends, setMyFriends] = useState<
    | {
        friendId: string;
        friendName: string;
        friendEmail: string;
        friendCreatedAt: string;
        friendDisplayPicture: string | null;
        from: string;
        requestStatus: "pending" | "accepted" | "rejected";
      }[]
    | null
  >(null);

  useEffect(() => {
    if (!user) return;
    axios
      .get("/api/friends", {
        params: { userId: user.id },
      })
      .then((resp) => setMyFriends(resp.data));
  }, [user]);
  useEffect(() => {
    if (!user) return;
    if (isGroup) {
      setCommonChatId(params.user_id.replace("GPXX_", "").replace("_GPXX", ""));
    } else {
      const userIds = [params.user_id, user.id].sort();
      setCommonChatId(userIds.join("-"));
    }
  }, [params, user, isGroup]);

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

    const userOrGroupAPI = isGroup ? "/api/groups" : "/api/users";
    axios
      .get(userOrGroupAPI, {
        params: { [isGroup ? "groupId" : "userId"]: chatID },
      })
      .then((resp) => setFriend(resp.data));
  }, [chatID, user, isGroup]);

  const forwardMessage = (friendID: string, message: string) => {
    const payload: any = {
      userId: user?.id,
      message: message,
      chatWith: friendID,
    };
    axios.post("/api/chat", payload).then((d) => console.log(d.data));
  };
  const sendMessage = async () => {
    if (!newMessage.trim() && !selectedFile) return;

    const payload: any = {
      userId: user?.id,
      message: newMessage,
      ...(isGroup ? { groupId: chatID } : { chatWith: chatID }),
    };

    if (selectedFile) {
      // Convert file to base64 using FileReader
      const reader = new FileReader();

      reader.onloadend = async () => {
        const base64Image = reader.result as string; // This is the base64 string
        payload.attachment = base64Image;

        await axios.post("/api/chat", payload);

        // Send real-time stream data if required
        await axios.put("/api/stream", {
          chatId: commonChatId,
          message: JSON.stringify({
            id: crypto.randomUUID(),
            message: newMessage,
            attachment: base64Image,
            createdAt: new Date().toISOString(),
            chatFrom: { id: user!.id, name: user!.new_email },
          }),
        });

        setNewMessage("");
        setSelectedFile(null); // Clear the file after sending
        inputRef.current?.focus();
      };

      // Read the selected file as a Data URL (Base64)
      reader.readAsDataURL(selectedFile);
    } else {
      // No file, just send the message
      await axios.post("/api/chat", payload);
      await axios.put("/api/stream", {
        chatId: commonChatId,
        message: JSON.stringify({
          id: crypto.randomUUID(),
          message: newMessage,
          attachment: "",
          createdAt: new Date().toISOString(),
          chatFrom: { id: user!.id, name: user!.new_email },
        }),
      });

      setNewMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;

    if (file) {
      // Check if the file is an image and its size is <= 10MB
      if (!file.type.startsWith("image/")) {
        alert("Only image files are allowed.");
        setSelectedFile(null);
      } else if (file.size > 10 * 1024 * 1024) {
        // 10MB = 10 * 1024 * 1024 bytes
        alert("File size must be less than 10MB.");
        setSelectedFile(null);
      } else {
        setSelectedFile(file);
      }
    }
  };

  return (
    <div className="relative flex flex-col h-full w-full">
      {/* Background with blur overlay */}
      <div className="absolute inset-0 -z-10">
        <img
          src="https://i.pinimg.com/736x/a4/ba/48/a4ba48877579d057e340aec51a5388c8.jpg"
          alt="background"
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-md"></div>
      </div>

      {/* Top Bar */}
      <div className="sticky top-0 z-10 bg-background/90 backdrop-blur py-4 px-4 text-sm text-muted-foreground flex justify-between items-center shadow-sm">
        <div className="font-semibold text-white">
          Chatting with: {friend?.name}
        </div>
        {isGroup && (
          <a
            href={`/app/chat/${params.user_id}/manage`}
            className="text-xs underline hover:text-white"
          >
            Manage Group
          </a>
        )}
        <Button
          variant="secondary"
          onClick={closeChat}
          className="text-white text-xs px-3 py-1 rounded-md hover:bg-gray-700"
        >
          Close
        </Button>
      </div>

      {/* Chat Body */}
      <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3">
        {chats?.length ? (
          <AnimatePresence>
            {chats.map((chat) => (
              <motion.div
                key={chat.id}
                className={`max-w-[70%] px-1.5 py-1 rounded-xl shadow ${
                  chat.chatFrom.id === user?.id
                    ? "self-end bg-green-200 dark:bg-green-800 text-black dark:text-white"
                    : "self-start bg-white/90 dark:bg-gray-800 text-black dark:text-white"
                }`}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.4 }}
              >
                {isGroup && chat.chatFrom.id !== user?.id && (
                  <div className="text-xs text-teal-500 mb-1 font-medium">
                    {chat.chatFrom.name}
                  </div>
                )}
                <div className="text-sm break-words whitespace-pre-wrap relative">
                  <Dialog>
                    <DialogTrigger asChild>
                      <button className="absolute aspect-square w-8 h-8 bg-slate-800/30 backdrop-blur-md -right-8 rounded-full grid place-items-center">
                        <Forward className="text-xs w-4" />
                      </button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Forward Message</DialogTitle>
                      </DialogHeader>
                      <div>
                        {myFriends?.map((x) => (
                          <div key={x.friendId}>
                            {x.friendName}{" "}
                            <Button
                              onClick={() =>
                                forwardMessage(x.friendId, chat.message)
                              }
                            >
                              forward Message
                            </Button>
                          </div>
                        ))}
                      </div>
                    </DialogContent>
                  </Dialog>

                  <div>
                    <img
                      className="max-w-[32rem] max-h-96 rounded-xl rounded-lg mb-2 "
                      src={chat.attachment}
                    />
                  </div>

                  {chat.message}
                </div>
                <div className="text-[10px] text-right text-gray-500 mt-1">
                  {format(parseISO(chat.createdAt), "hh:mm a")}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground text-center text-sm min-h-[300px]">
            <span>
              👋 Say hi!
              <br />
              It’s suspiciously quiet here...
            </span>
          </div>
        )}
      </div>

      {/* Chat Input Box */}
      <div className="sticky bottom-0 bg-background/80 backdrop-blur p-4 border-t border-border">
        <div className="flex gap-2 relative">
          <div className=" h-64 max-w-96 w-3/4 pointer-events-auto flex items-end  absolute bottom-[200%]">
            <div className="text-xs text-gray-500 mt-1">
              {selectedFile && (
                <>
                  <img
                    src={URL.createObjectURL(selectedFile)}
                    alt="Preview"
                    className="mt-2 w-32 h-32 object-cover rounded"
                  />
                </>
              )}
            </div>
          </div>
          <label className="w-10 h-10 flex items-center justify-center rounded-full bg-muted cursor-pointer">
            +
            <input
              type="file"
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </label>

          <Input
            ref={inputRef}
            placeholder="Type your message..."
            className="flex-1"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <Button variant="secondary" onClick={sendMessage}>
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}
