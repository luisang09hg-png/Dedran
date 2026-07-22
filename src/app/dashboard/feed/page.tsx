"use client";

import { useState } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Image as ImageIcon, Clock, Send, Heart, MessageSquare, Share2, MoreHorizontal, Trash2 } from "lucide-react";

export default function FeedPage() {
  const [postText, setPostText] = useState("");

  const posts = [
    {
      id: 1,
      author: { name: "Alex Rivera", role: "Junior UX Designer", avatar: "https://i.pravatar.cc/150?u=alex" },
      timeAgo: "45m ago",
      content: "🔴 Live portfolio review happening NOW on Google Meet! Joining for the next 3 hours as I walk through my healthcare app redesign case study. Feedback welcome — designers, devs, PMs. Link in comments!",
      likes: 47,
      comments: 12,
      shares: 8,
      temporary: true,
      expiresIn: "3h 3m"
    },
    {
      id: 2,
      author: { name: "Maya Chen", role: "Product Designer at Figma", avatar: "https://i.pravatar.cc/150?u=maya" },
      timeAgo: "2h ago",
      content: "Just published a new guide on building scalable design systems in Figma. Let me know what you think!",
      likes: 124,
      comments: 32,
      shares: 45,
      temporary: false,
    }
  ];

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-[var(--color-foreground)]">Your feed</h1>
        <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">Opportunities, insights and temporary posts from the Dedran network.</p>
      </div>

      {/* Create Post */}
      <Card className="p-4 bg-[var(--color-card)] border-[var(--color-border)] shadow-sm">
        <div className="flex gap-4">
          <Avatar src="https://i.pravatar.cc/150?u=luis" fallback="L" />
          <textarea
            className="flex-1 resize-none bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl p-3 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] transition-all"
            placeholder="What's on your mind, luis?"
            rows={2}
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
          />
        </div>
        <div className="flex justify-between items-center mt-3 pl-14">
          <div className="flex gap-2 text-[var(--color-muted-foreground)]">
            <button className="flex items-center gap-1.5 text-xs font-medium hover:text-[var(--color-foreground)] transition-colors p-1.5 rounded-md hover:bg-[var(--color-background)]">
              <ImageIcon className="h-4 w-4" /> Image
            </button>
            <button className="flex items-center gap-1.5 text-xs font-medium hover:text-[var(--color-foreground)] transition-colors p-1.5 rounded-md hover:bg-[var(--color-background)]">
              <Clock className="h-4 w-4" /> Temporary
            </button>
          </div>
          <Button size="sm" className="rounded-full px-5 h-9 gap-2 shadow-sm">
            <Send className="h-3.5 w-3.5" /> Post
          </Button>
        </div>
      </Card>

      {/* Feed List */}
      <div className="flex flex-col gap-4">
        {posts.map(post => (
          <Card key={post.id} className="bg-[var(--color-card)] border-[var(--color-border)] shadow-sm overflow-hidden">
            {post.temporary && (
              <div className="bg-[var(--color-background)] px-4 py-2 border-b border-[var(--color-border)] border-dashed flex justify-between items-center text-xs text-[var(--color-muted-foreground)] font-medium">
                <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> Temporary · expires in {post.expiresIn}</span>
                <span className="flex items-center gap-1">🔥</span>
              </div>
            )}
            <div className="p-5">
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-3">
                  <Avatar src={post.author.avatar} fallback={post.author.name[0]} />
                  <div className="flex flex-col">
                    <span className="font-semibold text-[var(--color-foreground)] text-sm">{post.author.name}</span>
                    <span className="text-xs text-[var(--color-muted-foreground)]">{post.author.role} · {post.timeAgo}</span>
                  </div>
                </div>
                <div className="flex gap-1 text-[var(--color-muted-foreground)]">
                  {post.author.name === "Alex Rivera" && ( // mock own post delete
                    <button className="p-1.5 hover:bg-[var(--color-background)] rounded-md transition-colors"><Trash2 className="h-4 w-4" /></button>
                  )}
                  <button className="p-1.5 hover:bg-[var(--color-background)] rounded-md transition-colors"><MoreHorizontal className="h-4 w-4" /></button>
                </div>
              </div>
              
              <p className="text-sm text-[var(--color-foreground)] leading-relaxed mb-4">
                {post.content}
              </p>
              
              <div className="flex gap-6 text-[var(--color-muted-foreground)] pt-3 border-t border-[var(--color-border)]">
                <button className="flex items-center gap-1.5 text-xs font-medium hover:text-[var(--color-primary)] transition-colors">
                  <Heart className="h-4 w-4" /> {post.likes}
                </button>
                <button className="flex items-center gap-1.5 text-xs font-medium hover:text-[var(--color-primary)] transition-colors">
                  <MessageSquare className="h-4 w-4" /> {post.comments}
                </button>
                <button className="flex items-center gap-1.5 text-xs font-medium hover:text-[var(--color-primary)] transition-colors">
                  <Share2 className="h-4 w-4" /> {post.shares}
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
