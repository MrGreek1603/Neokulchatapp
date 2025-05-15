"use client";

import { useAuth } from "@/components/auth/auth-provider";
import { motion } from "framer-motion";
import {
  Users,
  MessageCircle,
  MessageSquarePlus,
  Layers,
  PartyPopper,
} from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <main className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-black via-neutral-900 to-zinc-800 px-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-2xl text-center text-white space-y-6"
      >
        <motion.h1
          className="text-5xl font-bold tracking-tight"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-2">
            <PartyPopper className="w-8 h-8 text-pink-400" />
            Welcome to the Neokul Chat Forum
          </span>
        </motion.h1>

        <motion.p
          className="text-lg text-neutral-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          Connect, chat, and collaborate in style.
        </motion.p>

        <motion.ul
          className="text-left text-base text-neutral-200 space-y-4"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.2,
              },
            },
          }}
        >
          {[
            {
              icon: <Users className="text-sky-400 w-5 h-5" />,
              text: "Add and manage friends with ease",
            },
            {
              icon: <MessageCircle className="text-green-400 w-5 h-5" />,
              text: "Have private one-on-one chats",
            },
            {
              icon: <MessageSquarePlus className="text-purple-400 w-5 h-5" />,
              text: "Create or join fun group chats",
            },
            {
              icon: <Layers className="text-yellow-400 w-5 h-5" />,
              text: "Participate in topic-based forums",
            },
          ].map(({ icon, text }, index) => (
            <motion.li
              key={index}
              className="flex items-center gap-3"
              variants={{
                hidden: { opacity: 0, x: -20 },
                visible: { opacity: 1, x: 0 },
              }}
            >
              {icon}
              <span>{text}</span>
            </motion.li>
          ))}
        </motion.ul>

        <motion.p
          className="text-sm text-neutral-400 mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          Dive in and enjoy rich conversations with your community!
        </motion.p>
      </motion.div>
    </main>
  );
}
