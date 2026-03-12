import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ShareButton } from "@/components/share-button";
import { Sidebar } from "@/components/sidebar";
import { VideoPlayer } from "@/components/video-player";
import { getVideoMetadata } from "@/lib/drive";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const video = await getVideoMetadata(id);
  if (!video) return { title: "Video no encontrado" };
  return { title: `${video.name} | Videos` };
}

export default async function VideoPage({
  params,
}: Props) {
  const { id } = await params;
  const video = await getVideoMetadata(id);

  if (!video) {
    notFound();
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto p-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-[var(--muted)] transition hover:bg-[var(--hover)] hover:text-[var(--foreground)]"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Volver a mis videos
            </Link>
            <ShareButton videoId={id} videoName={video.name} />
          </div>
          <h1 className="mb-6 truncate text-2xl font-bold text-[var(--foreground)]">
            {video.name}
          </h1>
          <VideoPlayer
            id={video.id}
            mimeType={video.mimeType}
            name={video.name}
          />
        </div>
      </main>
    </div>
  );
}
