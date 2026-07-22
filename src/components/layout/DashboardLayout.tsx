"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, Home, User, BookOpen, Briefcase, LogOut } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Feed", href: "/dashboard/feed", icon: Home },
  { name: "Profile", href: "/dashboard/profile", icon: User },
  { name: "Courses", href: "/dashboard/courses", icon: BookOpen },
  { name: "Applications", href: "/dashboard/applications", icon: Briefcase },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen w-full bg-[var(--color-background)]">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-10 flex w-64 flex-col border-r border-[var(--color-border)] bg-white/70 backdrop-blur-xl pt-6 pb-4 shadow-[1px_0_40px_rgb(0,0,0,0.02)]">
        {/* Logo */}
        <div className="px-6 mb-8 flex items-center gap-3">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-brand-gradient text-white shadow-md">
            <Sparkles className="h-4 w-4" />
          </span>
          <span className="text-xl font-bold tracking-tight text-[var(--color-foreground)] bg-brand-gradient bg-clip-text text-transparent">Dedran</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1.5 px-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-300",
                  isActive
                    ? "bg-brand-gradient text-white shadow-md shadow-astral/20 scale-100"
                    : "text-[var(--color-muted-foreground)] hover:bg-white/60 hover:text-[var(--color-foreground)] hover:scale-[1.02]"
                )}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="px-4 mt-auto">
          <div className="flex flex-col rounded-2xl bg-[var(--color-background)] p-3">
            <div className="flex items-center gap-3 mb-3">
              <Avatar src="https://i.pravatar.cc/150?u=luis" fallback="L" size="md" />
              <div className="flex flex-col overflow-hidden">
                <span className="truncate text-sm font-semibold text-[var(--color-foreground)]">Luis</span>
                <span className="truncate text-xs text-[var(--color-muted-foreground)]">luisahg444@gmail.com</span>
              </div>
            </div>
            <Button variant="outline" size="sm" className="w-full gap-2 text-xs h-8 border-[var(--color-border)] bg-transparent">
              <LogOut className="h-3.5 w-3.5" />
              Sign out
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 pl-64">
        <div className="mx-auto h-full w-full max-w-7xl p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
