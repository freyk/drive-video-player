import { Sidebar } from "@/components/sidebar";
import { VideoGrid } from "@/components/video-grid";

export default function Home() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto pt-[calc(3.5rem+env(safe-area-inset-top,0px))] px-4 pb-8 sm:px-6 lg:pt-0 lg:p-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-xl font-bold text-[var(--foreground)] sm:text-2xl">
            Mis videos
          </h1>
        </div>
        <VideoGrid />
      </main>
    </div>
  );
}
