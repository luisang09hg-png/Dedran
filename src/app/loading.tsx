export default function Loading() {
  return (
    <div className="min-h-screen bg-[#06091A] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-[#24476C] border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-[#A8A9AD] font-inter">Loading...</p>
      </div>
    </div>
  )
}
