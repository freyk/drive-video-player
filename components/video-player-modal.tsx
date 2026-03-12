"use client";

import type { DriveVideo } from "./video-card";

interface VideoPlayerModalProps {
  video: DriveVideo | null;
  onClose: () => void;
}

export function VideoPlayerModal({ video, onClose }: VideoPlayerModalProps) {
  if (!video) return null;

  const streamUrl = `/api/drive/stream?id=${video.id}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/90 p-0 sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Play video"
    >
      <div className="relative flex w-full max-h-[90vh] max-w-4xl flex-col overflow-hidden rounded-t-2xl bg-[var(--card-bg)] shadow-2xl sm:rounded-2xl">
        <div className="flex shrink-0 items-center justify-between gap-2 border-b border-[var(--border)] px-3 py-2 sm:px-4 sm:py-3">
          <h2 className="min-w-0 truncate text-sm font-medium text-[var(--foreground)] sm:text-base">
            {video.name}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-[var(--muted)] hover:bg-[var(--hover)] hover:text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            aria-label="Close"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="relative aspect-video w-full bg-black">
          <video
            key={video.id}
            controls
            autoPlay
            preload="metadata"
            className="absolute inset-0 h-full w-full"
          >
            <source
              src={streamUrl}
              type={video.mimeType ?? "video/mp4"}
            />
            Your browser does not support the video element.
          </video>
        </div>
      </div>
    </div>
  );
}
