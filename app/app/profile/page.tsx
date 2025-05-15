"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth/auth-provider";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import axios from "axios";
import { useRouter } from "next/navigation";


export default function ProfilePage() {
  const { user } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    displayPicture: "",
  });

  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        displayPicture: user.image || "",
      });
      setPreview(user.image || null);
    }
  }, [user]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setFormData({ ...formData, displayPicture: base64String });
        setPreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put("/api/users/edit", {
        userId: user?.id,
        ...formData,
      });
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-zinc-800 flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="bg-zinc-900 text-white rounded-2xl shadow-lg p-8 max-w-md w-full space-y-6"
      >
        <h2 className="text-3xl font-bold text-center text-white">
          Edit Your Profile
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Image */}
          <motion.div
            className="flex flex-col items-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {preview ? (
              <img
                src={preview}
                alt="Profile preview"
                className="w-24 h-24 rounded-full object-cover border-2 border-sky-500 shadow"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-zinc-700 flex items-center justify-center text-zinc-400 shadow">
                No Image
              </div>
            )}
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full bg-zinc-800 border-zinc-700 file:bg-sky-600 file:text-white file:px-4 file:py-1 file:rounded-md"
            />
          </motion.div>

          {/* Name Field */}
          <div>
            <Label htmlFor="name" className="text-zinc-300">
              Name
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
              className="mt-2 w-full bg-zinc-800 text-white border-zinc-700 focus:ring-sky-500"
            />
          </div>

          {/* Email Field */}
          <div>
            <Label htmlFor="email" className="text-zinc-300">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              disabled
              className="mt-2 w-full bg-zinc-800 text-zinc-400 border-zinc-700 cursor-not-allowed"
            />
          </div>

          {/* Submit */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Button
              type="submit"
              className="w-full py-3 bg-sky-600 hover:bg-sky-700 transition rounded-xl text-white"
              disabled={loading}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent animate-spin rounded-full mx-auto" />
              ) : (
                "Update Profile"
              )}
            </Button>
          </motion.div>
        </form>
        <button
  onClick={() => router.push('/app')}
  className="absolute top-4 left-4 text-white hover:text-sky-400 transition"
>
  ← Back
</button>

      </motion.div>
    </main>
  );
}
