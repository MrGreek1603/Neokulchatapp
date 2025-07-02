"use client";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/auth-provider";
import { MessageSquare, Users, Layout } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function Home() {
  const { session } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      session?.expires_at &&
      session.expires_at * 1000 > Date.now()
    ) {
      router.push("/app");
    }
  }, [session, router]);

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-black/80 backdrop-blur shadow-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2 text-xl font-bold text-white">
            <MessageSquare className="h-5 w-5 text-blue-500" />
            <span>Neokul ChatForum</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className={buttonVariants({
                variant: "ghost",
                size: "sm",
                className: "text-white hover:bg-gray-800",
              })}
            >
              Login
            </Link>
            <Link
              href="/signup"
              className={buttonVariants({
                size: "sm",
                className: "bg-blue-600 text-black hover:bg-blue-700",
              })}
            >
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      {/* Main Section */}
      <main className="flex-1 flex flex-col justify-center items-center text-center px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-3xl"
        >
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight">
            The Future of Discussion is Here
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-400">
            Create communities, discuss ideas, and collaborate like never
            before.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/signup"
              className={buttonVariants({
                size: "lg",
                className: "bg-blue-600 text-black hover:bg-blue-700",
              })}
            >
              Get Started
            </Link>
            <Link
              href="/login"
              className={buttonVariants({
                variant: "ghost",
                size: "lg",
                className: "text-white hover:bg-gray-800",
              })}
            >
              Learn More
            </Link>
          </div>
        </motion.div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-20 w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {[
            {
              title: "Real-Time Messaging",
              desc: "Connect with your community instantly.",
              icon: <MessageSquare className="h-8 w-8 text-blue-500" />,
            },
            {
              title: "User Groups",
              desc: "Create and manage interest-based communities.",
              icon: <Users className="h-8 w-8 text-green-500" />,
            },
            {
              title: "Clean UI",
              desc: "Enjoy a beautifully crafted user experience.",
              icon: <Layout className="h-8 w-8 text-purple-500" />,
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              className="rounded-xl border border-gray-800 bg-gray-900 p-6 text-left"
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <div className="flex items-center gap-4 mb-4 text-white">
                {item.icon}
                <h3 className="text-lg font-semibold">{item.title}</h3>
              </div>
              <p className="text-gray-400 text-sm">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-gray-800 bg-black py-6 text-sm text-gray-500">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-4 gap-4">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-white" />
            <span>© 2025 Neokul ChatForum. All rights reserved.</span>
          </div>
          <div className="flex gap-4">
            <Link href="#" className="hover:underline">
              Privacy
            </Link>
            <Link href="#" className="hover:underline">
              Terms
            </Link>
            <Link href="#" className="hover:underline">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
