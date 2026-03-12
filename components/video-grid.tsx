"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { VideoCard, type DriveVideo } from "./video-card";

interface VideoGridProps {
  /** If specified, only shows videos in this folder. */
  folderId?: string;
}

export function VideoGrid({ folderId }: VideoGridProps) {
  const [videos, setVideos] = useState<DriveVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const url =
    folderId != null && folderId !== ""
      ? `/api/drive/videos?folderId=${encodeURIComponent(folderId)}`
      : "/api/drive/videos";

  useEffect(() => {
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("Error loading videos");
        return res.json();
      })
      .then((data: { files: DriveVideo[] }) => {
        setVideos(data.files ?? []);
        setError(null);
      })
      .catch((err) => {
        setError(err.message ?? "Connection error");
        setVideos([]);
      })
      .finally(() => setLoading(false));
  }, [url]);

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-[var(--accent)] border-t-transparent" />
          <p className="text-sm text-[var(--muted)]">Loading videos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-4 text-red-800 dark:border-red-800 dark:bg-red-950/30 dark:text-red-200">
          <p className="font-medium">Could not load videos</p>
          <p className="mt-1 text-sm">{error}</p>
          <p className="mt-2 text-sm opacity-90">
            Make sure GOOGLE_DRIVE_FOLDER_ID or GOOGLE_DRIVE_FOLDERS is
            configured and that the folders are accessible with your service
            account.
          </p>
        </div>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--muted)]/30 text-[var(--muted)]">
          <svg className="h-10 w-10" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-[var(--foreground)]">
          No videos in this folder
        </h3>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
      {videos.map((video) => (
        <Link
          key={video.id}
          href={
            folderId
              ? `/video/${video.id}?folder=${encodeURIComponent(folderId)}`
              : `/video/${video.id}`
          }
          className="block w-full"
        >
          <VideoCard video={video} />
        </Link>
      ))}
    </div>
  );
}
