import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-xl bg-[#1E3354]/50',
        className,
      )}
    />
  )
}

export function PostSkeleton() {
  return (
    <div className="bg-[#0D1A31] rounded-2xl border border-[#1E3354] p-5">
      <div className="flex items-center gap-3 mb-4">
        <Skeleton className="w-10 h-10 rounded-full shrink-0" />
        <div className="flex-1">
          <Skeleton className="h-4 w-32 mb-2" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-3/4 mb-4" />
      <Skeleton className="h-48 w-full rounded-xl mb-4" />
      <div className="flex gap-6 pt-3 border-t border-[#1E3354]">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-4 w-12" />
      </div>
    </div>
  )
}

export function CourseSkeleton() {
  return (
    <div className="bg-[#06091A] rounded-2xl overflow-hidden border border-[#1E3354]">
      <Skeleton className="h-44 w-full rounded-none" />
      <div className="p-5">
        <Skeleton className="h-3 w-16 mb-3" />
        <Skeleton className="h-5 w-full mb-2" />
        <Skeleton className="h-4 w-2/3 mb-4" />
        <div className="flex justify-between pt-3 border-t border-[#1E3354]">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    </div>
  )
}

export function CardSkeleton() {
  return (
    <div className="bg-[#0D1A31] rounded-2xl border border-[#1E3354] p-6">
      <Skeleton className="w-10 h-10 rounded-xl mb-4" />
      <Skeleton className="h-5 w-3/4 mb-2" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  )
}

export function TableRowSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4">
      <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
      <div className="flex-1">
        <Skeleton className="h-4 w-32 mb-2" />
        <Skeleton className="h-3 w-48" />
      </div>
      <Skeleton className="h-6 w-24 rounded-full" />
    </div>
  )
}
