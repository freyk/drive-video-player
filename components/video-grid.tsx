"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { VideoCard, type DriveVideo } from "./video-card";

export function VideoGrid() {
  const [videos, setVideos] = useState<DriveVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/drive/videos")
      .then((res) => {
        if (!res.ok) throw new Error("Error al cargar videos");
        return res.json();
      })
      .then((data: { files: DriveVideo[] }) => {
        setVideos(data.files ?? []);
        setError(null);
      })
      .catch((err) => {
        setError(err.message ?? "Error de conexión");
        setVideos([]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-[var(--accent)] border-t-transparent" />
          <p className="text-sm text-[var(--muted)]">Cargando videos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-4 text-red-800 dark:border-red-800 dark:bg-red-950/30 dark:text-red-200">
          <p className="font-medium">No se pudieron cargar los videos</p>
          <p className="mt-1 text-sm">{error}</p>
          <p className="mt-2 text-sm opacity-90">
            Asegúrate de que GOOGLE_DRIVE_FOLDER_ID esté configurado y que la carpeta sea accesible con tu cuenta.
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
          No hay videos en esta carpeta
        </h3>
        <p className="max-w-sm text-sm text-[var(--muted)]">
          Sube videos a la carpeta de Google Drive configurada o revisa el ID de carpeta en las variables de entorno.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
      {videos.map((video) => (
        <Link key={video.id} href={`/video/${video.id}`}>
          <VideoCard video={video} />
        </Link>
      ))}
    </div>
  );
}
