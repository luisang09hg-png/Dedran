"use client";

import { mockApplications } from "@/data/mockData";
import { Card } from "@/components/ui/Card";
import { MapPin, Calendar } from "lucide-react";

const columns = [
  { id: "Applied", title: "Applied", borderColor: "border-green-200" },
  { id: "Under Review", title: "Under Review", borderColor: "border-orange-200" },
  { id: "Interview Scheduled", title: "Interview Scheduled", borderColor: "border-purple-200" },
  { id: "Offer Received", title: "Offer Received", borderColor: "border-yellow-200" },
  { id: "Rejected", title: "Rejected", borderColor: "border-gray-200" },
];

export default function ApplicationsPage() {
  return (
    <div className="flex flex-col gap-6 animate-fade-in h-full">
      <div className="animate-slide-up" style={{ animationDelay: '100ms' }}>
        <h1 className="text-3xl font-bold tracking-tight bg-brand-gradient bg-clip-text text-transparent">Applications</h1>
        <p className="mt-1 text-sm text-[var(--color-muted-foreground)] font-medium">Every role you're pursuing, from first click to signed offer.</p>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 flex-1 animate-slide-up" style={{ animationDelay: '200ms' }}>
        {columns.map(column => {
          const columnApps = mockApplications.filter(app => app.status === column.id);
          return (
            <div key={column.id} className="min-w-[300px] max-w-[300px] flex flex-col gap-3">
              <div className={`flex items-center justify-between px-4 py-2.5 bg-white/50 backdrop-blur-md rounded-xl border ${column.borderColor}`}>
                <span className="font-semibold text-sm text-[var(--color-foreground)]">{column.title}</span>
                <span className="text-xs text-[var(--color-muted-foreground)] bg-white px-2 py-0.5 rounded-full shadow-sm">
                  {columnApps.length}
                </span>
              </div>
              
              <div className="flex flex-col gap-3">
                {columnApps.map((app, index) => (
                  <Card key={app.id} className="p-4 flex flex-col gap-4 border-[var(--color-border)] shadow-sm hover:-translate-y-1 hover:shadow-md cursor-pointer transition-all duration-300 bg-white/80 backdrop-blur-sm">
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm ${app.color}`}>
                        {app.company.substring(0, 2)}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-sm leading-tight text-[var(--color-foreground)]">{app.role}</span>
                        <span className="text-sm font-medium text-[var(--color-muted-foreground)]">{app.company}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-1.5 text-xs font-medium text-[var(--color-muted-foreground)]">
                      <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {app.location}</span>
                      <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Applied {app.appliedDate}</span>
                    </div>
                    
                    <div className="pt-3 border-t border-[var(--color-border)] mt-1">
                      <p className="text-xs font-medium text-[var(--color-muted-foreground)]">{app.statusText}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
