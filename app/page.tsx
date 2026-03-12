import { Sidebar } from "@/components/sidebar";
import { VideoGrid } from "@/components/video-grid";

export default function Home() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[var(--foreground)]">
            Mis videos
          </h1>
        </div>
        <VideoGrid />
      </main>
    </div>
  );
}
