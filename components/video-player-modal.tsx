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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Reproducir video"
    >
      <div className="relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-[var(--card-bg)] shadow-2xl">
        <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
          <h2 className="truncate font-medium text-[var(--foreground)]">
            {video.name}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-[var(--muted)] hover:bg-[var(--hover)] hover:text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            aria-label="Cerrar"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            Tu navegador no soporta el elemento video.
          </video>
        </div>
      </div>
    </div>
  );
}
