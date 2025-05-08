"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Users, 
  UserPlus, 
  MessageSquare, 
  Users2,
  Layout,
  User
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const sidebarItems = [
  {
    title: "Friends",
    icon: Users,
    href: "/dashboard/friends"
  },
  {
    title: "Requests",
    icon: UserPlus,
    href: "/dashboard/requests"
  },
  {
    title: "Private Chats",
    icon: MessageSquare,
    href: "/dashboard/private-chats"
  },
  {
    title: "Group Chats",
    icon: Users2,
    href: "/dashboard/group-chats"
  },
  {
    title: "Forums",
    icon: Layout,
    href: "/dashboard/forums"
  },
  {
    title: "Profile",
    icon: User,
    href: "/dashboard/profile"
  }
];

export function Sidebar() {
  const pathname = usePathname();
  
  return (
    <div className="w-64 border-r bg-card h-full flex flex-col">
      <div className="p-4 border-b">
        <h1 className="text-xl font-bold">ChatForum</h1>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href;
          
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start gap-2",
                  isActive && "relative"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.title}
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 rounded-md bg-primary z-[-1]"
                  />
                )}
              </Button>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}