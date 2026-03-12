"use client";

interface VideoPlayerProps {
  id: string;
  mimeType?: string | null;
  name: string;
}

export function VideoPlayer({ id, mimeType, name }: VideoPlayerProps) {
  const streamUrl = `/api/drive/stream?id=${id}`;

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black">
      <video
        key={id}
        controls
        autoPlay
        preload="metadata"
        className="h-full w-full"
        aria-label={name}
      >
        <source src={streamUrl} type={mimeType ?? "video/mp4"} />
        Tu navegador no soporta el elemento video.
      </video>
    </div>
  );
}
