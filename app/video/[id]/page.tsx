import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ShareButton } from "@/components/share-button";
import { Sidebar } from "@/components/sidebar";
import { VideoPlayer } from "@/components/video-player";
import {
  getDriveFoldersConfig,
  getFolderInfo,
  getVideoMetadata,
} from "@/lib/drive";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ folder?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const video = await getVideoMetadata(id);
  if (!video) return { title: "Video not found" };

  const title = `${video.name} | Videos`;
  const description = `Watch "${video.name}"`;
  const thumbnailUrl = `/api/drive/thumbnail?id=${id}`;

  return {
    title,
    description,
    openGraph: {
      title: video.name,
      description,
      url: `/video/${id}`,
      type: "website",
      images: [{ url: thumbnailUrl, width: 1200, height: 630, alt: video.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: video.name,
      description,
      images: [thumbnailUrl],
    },
  };
}

export default async function VideoPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { folder: folderId } = await searchParams;
  const [video, backFolderName] = await Promise.all([
    getVideoMetadata(id),
    folderId
      ? (async () => {
          const rootFolders = getDriveFoldersConfig();
          const folder =
            rootFolders.find((f) => f.id === folderId) ??
            (await getFolderInfo(folderId));
          return folder?.name ?? null;
        })()
      : Promise.resolve(null),
  ]);

  if (!video) {
    notFound();
  }

  const backHref = folderId ? `/?folder=${encodeURIComponent(folderId)}` : "/";
  const backLabel = backFolderName
    ? `Back to ${backFolderName}`
    : "Back to my videos";

  return (
    <div className="flex min-h-screen">
      <Sidebar currentFolderId={folderId ?? null} />
      <main className="flex-1 overflow-auto pt-[calc(3.5rem+env(safe-area-inset-top,0px))] px-4 pb-8 sm:px-6 lg:pt-0 lg:p-8">
        <div className="mx-auto max-w-4xl">
          <div className="my-4 flex flex-wrap items-center gap-2 sm:gap-3">
            <Link
              href={backHref}
              className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-[var(--muted)] transition hover:bg-[var(--hover)] hover:text-[var(--foreground)] sm:min-h-0 sm:min-w-0 sm:justify-start"
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
              {backLabel}
            </Link>
            <ShareButton videoId={id} videoName={video.name} />
          </div>
          <h1 className="mb-4 truncate text-xl font-bold text-[var(--foreground)] sm:mb-6 sm:text-2xl">
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
