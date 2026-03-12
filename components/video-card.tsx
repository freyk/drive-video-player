"use client";

import { useState } from "react";

export interface DriveVideo {
  id: string;
  name: string;
  mimeType?: string;
  size?: string;
  createdTime?: string;
  thumbnailLink?: string;
  webContentLink?: string;
}

interface VideoCardProps {
  video: DriveVideo;
}

export function VideoCard({ video }: VideoCardProps) {
  const [thumbError, setThumbError] = useState(false);
  const date = video.createdTime
    ? new Date(video.createdTime).toLocaleDateString("es", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

  return (
    <div
      className="group flex w-full flex-col overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card-bg)] text-left shadow-sm transition hover:border-[var(--accent)]/40 hover:shadow-md focus-within:ring-2 focus-within:ring-[var(--accent)]/50"
    >
      <div className="relative aspect-video w-full bg-[var(--muted)]/20">
        {!thumbError ? (
          <img
            src={`/api/drive/thumbnail?id=${video.id}`}
            alt=""
            className="h-full w-full object-cover transition group-hover:scale-[1.02]"
            onError={() => setThumbError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[var(--muted)]">
            <svg
              className="h-12 w-12"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition group-hover:bg-black/30 group-hover:opacity-100">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-[var(--accent)] shadow-lg">
            <svg className="ml-1 h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-0.5 p-3 sm:p-4">
        <h3 className="line-clamp-2 font-medium text-[var(--foreground)] group-hover:text-[var(--accent)] text-sm sm:text-base">
          {video.name}
        </h3>
        {date && (
          <p className="text-sm text-[var(--muted)]">{date}</p>
        )}
      </div>
    </div>
  );
}
