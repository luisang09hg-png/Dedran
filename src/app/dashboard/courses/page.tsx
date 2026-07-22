"use client";

import { useState } from "react";
import { Star, Clock, Users, Play } from "lucide-react";
import { mockCourses } from "@/data/mockData";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Progress } from "@/components/ui/Progress";

const filters = ["All", "Design", "Tech", "Business", "Communication"];

export default function CoursesPage() {
  const [activeFilter, setActiveFilter] = useState("All");

  const filteredCourses = activeFilter === "All"
    ? mockCourses
    : mockCourses.filter(c => c.category === activeFilter.toUpperCase());

  return (
    <div className="flex flex-col gap-6 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-[var(--color-foreground)]">Guided courses</h1>
        <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">Short, project-based tracks taught by practitioners.</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-2">
        {filters.map(filter => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activeFilter === filter
                ? "bg-[var(--color-primary)] text-white"
                : "bg-[var(--color-card)] text-[var(--color-foreground)] border border-[var(--color-border)] hover:bg-[var(--color-background)]"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredCourses.map((course) => (
          <Card key={course.id} className="overflow-hidden flex flex-col hover:shadow-md transition-shadow">
            <div className="relative h-48 w-full overflow-hidden bg-[var(--color-muted)]">
              <img src={course.image} alt={course.title} className="object-cover w-full h-full" />
              <div className="absolute top-3 right-3">
                <Badge className="bg-white/90 text-black border-none font-bold">
                  {course.price}
                </Badge>
              </div>
            </div>
            
            <CardContent className="flex-1 flex flex-col p-5">
              <div className="flex gap-2 mb-3">
                <Badge variant="secondary" className="bg-[var(--color-background)] text-xs text-[var(--color-muted-foreground)]">
                  {course.level}
                </Badge>
                <Badge variant="secondary" className="bg-[var(--color-background)] text-xs text-[var(--color-muted-foreground)]">
                  {course.category}
                </Badge>
              </div>
              
              <h3 className="font-semibold text-lg leading-tight mb-1 text-[var(--color-foreground)] line-clamp-2">
                {course.title}
              </h3>
              <p className="text-sm text-[var(--color-muted-foreground)] mb-4">
                By {course.author}
              </p>
              
              <div className="flex items-center gap-4 text-xs text-[var(--color-muted-foreground)] mb-6">
                <span className="flex items-center gap-1 font-medium text-amber-500">
                  <Star className="h-3.5 w-3.5 fill-current" /> {course.rating}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" /> {course.duration}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-3.5 w-3.5" /> {course.students}
                </span>
              </div>

              <div className="mt-auto">
                <div className="flex justify-between text-xs mb-2 text-[var(--color-muted-foreground)]">
                  <span>Progress</span>
                  <span>{course.progress}%</span>
                </div>
                <Progress value={course.progress} className="mb-4 h-1.5" />
                
                <Button 
                  variant={course.progress > 0 ? "secondary" : "primary"} 
                  className={`w-full rounded-full gap-2 ${course.progress > 0 ? "bg-[var(--color-background)] hover:bg-[var(--color-border)]" : ""}`}
                >
                  <Play className="h-4 w-4" />
                  {course.progress > 0 ? "Continue" : "Enrol"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
