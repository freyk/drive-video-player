import { Sidebar } from "@/components/sidebar";
import { VideoGrid } from "@/components/video-grid";
import { getDriveFoldersConfig, getFolderInfo } from "@/lib/drive";

type SearchParams = Promise<{ folder?: string }>;

export default async function Home({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { folder } = await searchParams;
  const folderId = typeof folder === "string" ? folder : undefined;
  const rootFolders = getDriveFoldersConfig();
  const currentFolder = folderId
    ? rootFolders.find((f) => f.id === folderId) ?? (await getFolderInfo(folderId))
    : null;
  const pageTitle =
    currentFolder?.name ??
    (folderId ? "Videos" : rootFolders.length > 1 ? "Todos los videos" : "Mis videos");

  return (
    <div className="flex min-h-screen">
      <Sidebar currentFolderId={folderId ?? null} />
      <main className="flex-1 overflow-auto pt-[calc(3.5rem+env(safe-area-inset-top,0px))] px-4 pb-8 sm:px-6 lg:pt-0 lg:p-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-xl font-bold text-[var(--foreground)] sm:text-2xl">
            {pageTitle}
          </h1>
        </div>
        <VideoGrid folderId={folderId ?? undefined} />
      </main>
    </div>
  );
}
