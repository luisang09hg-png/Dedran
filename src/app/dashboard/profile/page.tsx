"use client";

import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { MapPin, Users, Eye, Briefcase, Edit2 } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto animate-fade-in-up">
      <Card className="overflow-hidden bg-[var(--color-card)] border-[var(--color-border)] shadow-sm">
        {/* Banner */}
        <div className="h-48 w-full bg-[var(--color-muted)] relative">
          <img 
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200" 
            alt="Profile Banner" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="px-8 pb-8 relative">
          {/* Avatar over banner */}
          <div className="absolute -top-12 left-8 p-1 bg-[var(--color-card)] rounded-2xl">
            <Avatar 
              src="https://i.pravatar.cc/150?u=luis" 
              fallback="L" 
              className="h-24 w-24 rounded-xl border-2 border-transparent"
            />
          </div>

          <div className="flex justify-between items-start pt-16">
            <div className="flex flex-col">
              <h1 className="text-3xl font-bold text-[var(--color-foreground)] tracking-tight">luis</h1>
              <p className="text-sm text-[var(--color-muted-foreground)] mt-1">Junior UX Designer</p>
              <p className="flex items-center gap-1.5 text-sm text-[var(--color-muted-foreground)] mt-1">
                <MapPin className="h-4 w-4" /> Barcelona, Spain
              </p>
            </div>
            <Button variant="outline" size="sm" className="rounded-full gap-2 px-4 shadow-sm">
              <Edit2 className="h-3.5 w-3.5" /> Edit
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-8">
            <div className="bg-[var(--color-background)] rounded-xl p-4 flex flex-col items-center justify-center border border-[var(--color-border)]">
              <Users className="h-5 w-5 text-[var(--color-muted-foreground)] mb-2" />
              <span className="text-xl font-bold text-[var(--color-foreground)]">342</span>
              <span className="text-[10px] font-semibold tracking-wider text-[var(--color-muted-foreground)] uppercase mt-1">Connections</span>
            </div>
            <div className="bg-[var(--color-background)] rounded-xl p-4 flex flex-col items-center justify-center border border-[var(--color-border)]">
              <Eye className="h-5 w-5 text-[var(--color-muted-foreground)] mb-2" />
              <span className="text-xl font-bold text-[var(--color-foreground)]">1248</span>
              <span className="text-[10px] font-semibold tracking-wider text-[var(--color-muted-foreground)] uppercase mt-1">Profile Views</span>
            </div>
            <div className="bg-[var(--color-background)] rounded-xl p-4 flex flex-col items-center justify-center border border-[var(--color-border)]">
              <Briefcase className="h-5 w-5 text-[var(--color-muted-foreground)] mb-2" />
              <span className="text-xl font-bold text-[var(--color-foreground)]">12</span>
              <span className="text-[10px] font-semibold tracking-wider text-[var(--color-muted-foreground)] uppercase mt-1">Applications</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Tabs & Content */}
      <div className="flex flex-col gap-6 mt-2">
        <div className="flex gap-6 border-b border-[var(--color-border)] px-2">
          <button className="px-1 py-3 text-sm font-medium border-b-2 border-[var(--color-foreground)] text-[var(--color-foreground)]">About</button>
          <button className="px-1 py-3 text-sm font-medium border-b-2 border-transparent text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]">Experience</button>
          <button className="px-1 py-3 text-sm font-medium border-b-2 border-transparent text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]">Skills</button>
        </div>

        <Card className="p-6 bg-[var(--color-card)] border-[var(--color-border)] shadow-sm">
          <p className="text-sm text-[var(--color-foreground)] leading-relaxed">
            Passionate about crafting human-centred digital experiences. Currently seeking opportunities in product design and UX research. Open to hybrid and remote roles across Europe.
          </p>
        </Card>
      </div>
    </div>
  );
}
