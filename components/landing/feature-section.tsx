"use client";

import { motion } from "framer-motion";
import { MessageSquare, Users, Layout } from "lucide-react";

export function FeatureSection() {
  const features = [
    {
      icon: <MessageSquare className="h-10 w-10" />,
      title: "Real-time Chat",
      description: "Seamless private and group conversations with real-time updates."
    },
    {
      icon: <Users className="h-10 w-10" />,
      title: "Friend System",
      description: "Connect with others through a comprehensive friend request system."
    },
    {
      icon: <Layout className="h-10 w-10" />,
      title: "Organized Forums",
      description: "Structured channels with moderation tools for focused discussions."
    }
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <section className="w-full bg-muted/40 py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <motion.h2 
            className="text-3xl font-bold tracking-tighter sm:text-5xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Key Features
          </motion.h2>
          <motion.p 
            className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Our platform combines the best of chat and forum technologies to provide a seamless communication experience.
          </motion.p>
        </div>
        <motion.div 
          className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3 lg:gap-12"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              className="flex flex-col items-center gap-2 text-center"
              variants={item}
            >
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}