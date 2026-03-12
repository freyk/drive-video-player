"use client";

import { useCallback, useState, useEffect } from "react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export interface DriveFolder {
  id: string;
  name: string;
}

interface SidebarProps {
  user?: { name?: string | null; email?: string | null; image?: string | null };
  /** ID de la carpeta seleccionada (desde la URL ?folder=...) */
  currentFolderId?: string | null;
}

const FOLDER_ICON = (
  <svg
    className="h-5 w-5 shrink-0 text-[var(--muted)]"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
    />
  </svg>
);

function FolderTreeItem({
  folder,
  depth,
  currentFolderId,
  expandedIds,
  childrenMap,
  loadingIds,
  onToggleExpand,
  onNavigate,
}: {
  folder: DriveFolder;
  depth: number;
  currentFolderId: string | null;
  expandedIds: Set<string>;
  childrenMap: Record<string, DriveFolder[]>;
  loadingIds: Set<string>;
  onToggleExpand: (folderId: string) => void;
  onNavigate?: () => void;
}) {
  const isExpanded = expandedIds.has(folder.id);
  const children = childrenMap[folder.id];
  const isLoading = loadingIds.has(folder.id);
  const showExpand = children === undefined || children.length > 0;

  const linkClass = (active: boolean) =>
    `flex min-h-[44px] flex-1 min-w-0 items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium transition-colors ${
      active
        ? "bg-[var(--accent)]/15 text-[var(--accent)]"
        : "text-[var(--foreground)] hover:bg-[var(--hover)]"
    }`;

  return (
    <div className="flex flex-col gap-0.5">
      <div
        className="flex items-center gap-0.5"
        style={{ paddingLeft: depth * 12 }}
      >
        {showExpand ? (
        <button
          type="button"
          onClick={() => onToggleExpand(folder.id)}
          className="flex h-9 w-6 shrink-0 items-center justify-center rounded text-[var(--muted)] hover:bg-[var(--hover)] hover:text-[var(--foreground)]"
          aria-label={isExpanded ? "Contraer" : "Expandir"}
          aria-expanded={isExpanded}
        >
          {isLoading ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--accent)] border-t-transparent" />
          ) : (
            <svg
              className={`h-4 w-4 shrink-0 transition-transform ${isExpanded ? "rotate-90" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          )}
        </button>
        ) : (
          <span className="w-6 shrink-0" aria-hidden />
        )}
        <Link
          href={`/?folder=${encodeURIComponent(folder.id)}`}
          onClick={onNavigate}
          className={linkClass(currentFolderId === folder.id)}
        >
          {FOLDER_ICON}
          <span className="truncate">{folder.name}</span>
        </Link>
      </div>
      {isExpanded && children && children.length > 0 && (
        <div className="flex flex-col gap-0.5">
          {children.map((child) => (
            <FolderTreeItem
              key={child.id}
              folder={child}
              depth={depth + 1}
              currentFolderId={currentFolderId}
              expandedIds={expandedIds}
              childrenMap={childrenMap}
              loadingIds={loadingIds}
              onToggleExpand={onToggleExpand}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function NavContent({
  rootFolders,
  currentFolderId,
  expandedIds,
  childrenMap,
  loadingIds,
  onLoadChildren,
  onToggleExpand,
  onNavigate,
}: {
  rootFolders: DriveFolder[];
  currentFolderId: string | null;
  expandedIds: Set<string>;
  childrenMap: Record<string, DriveFolder[]>;
  loadingIds: Set<string>;
  onLoadChildren: (parentId: string) => void;
  onToggleExpand: (folderId: string) => void;
  onNavigate?: () => void;
}) {
  const linkClass = (active: boolean) =>
    `flex min-h-[44px] items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
      active
        ? "bg-[var(--accent)]/15 text-[var(--accent)]"
        : "text-[var(--foreground)] hover:bg-[var(--hover)]"
    }`;

  return (
    <div className="space-y-0.5">
      <Link href="/" onClick={onNavigate} className={linkClass(!currentFolderId)}>
        <svg
          className="h-5 w-5 shrink-0 text-[var(--muted)]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
        Todos
      </Link>
      {rootFolders.map((folder) => (
        <FolderTreeItem
          key={folder.id}
          folder={folder}
          depth={0}
          currentFolderId={currentFolderId}
          expandedIds={expandedIds}
          childrenMap={childrenMap}
          loadingIds={loadingIds}
          onToggleExpand={onToggleExpand}
          onNavigate={onNavigate}
        />
      ))}
    </div>
  );
}

export function Sidebar({ user, currentFolderId = null }: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [rootFolders, setRootFolders] = useState<DriveFolder[]>([]);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [childrenMap, setChildrenMap] = useState<Record<string, DriveFolder[]>>({});
  const [loadingIds, setLoadingIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch("/api/drive/folders")
      .then((res) => (res.ok ? res.json() : { folders: [] }))
      .then((data: { folders?: DriveFolder[] }) => setRootFolders(data.folders ?? []))
      .catch(() => setRootFolders([]));
  }, []);

  const loadChildren = useCallback((parentId: string) => {
    setLoadingIds((prev) => new Set(prev).add(parentId));
    fetch(`/api/drive/folders?parentId=${encodeURIComponent(parentId)}`)
      .then((res) => (res.ok ? res.json() : { folders: [] }))
      .then((data: { folders?: DriveFolder[] }) => {
        setChildrenMap((prev) => ({ ...prev, [parentId]: data.folders ?? [] }));
        setExpandedIds((prev) => new Set(prev).add(parentId));
      })
      .catch(() => setChildrenMap((prev) => ({ ...prev, [parentId]: [] })))
      .finally(() => setLoadingIds((prev) => {
        const next = new Set(prev);
        next.delete(parentId);
        return next;
      }));
  }, []);

  const handleToggleExpand = useCallback((folderId: string) => {
    if (expandedIds.has(folderId)) {
      setExpandedIds((prev) => {
        const next = new Set(prev);
        next.delete(folderId);
        return next;
      });
      return;
    }
    if (childrenMap[folderId] === undefined) {
      loadChildren(folderId);
      return;
    }
    setExpandedIds((prev) => new Set(prev).add(folderId));
  }, [expandedIds, childrenMap, loadChildren]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      {/* Mobile top bar */}
      <header className="fixed left-0 right-0 top-0 z-40 flex h-14 items-center justify-between gap-2 border-b border-[var(--border)] bg-[var(--sidebar-bg)] px-4 pt-[env(safe-area-inset-top)] lg:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="flex h-10 w-10 min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-[var(--foreground)] hover:bg-[var(--hover)]"
          aria-label="Abrir menú"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent)]">
            <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          <span className="font-semibold text-[var(--foreground)]">Videos</span>
        </div>
        <ThemeToggle />
      </header>

      {/* Mobile drawer overlay */}
      <div
        role="presentation"
        className="fixed inset-0 z-50 bg-black/50 transition-opacity lg:hidden"
        style={{ opacity: mobileOpen ? 1 : 0, pointerEvents: mobileOpen ? "auto" : "none" }}
        onClick={() => setMobileOpen(false)}
        aria-hidden={!mobileOpen}
      />
      <aside
        className="fixed left-0 top-0 z-50 flex h-full w-72 max-w-[85vw] flex-col border-r border-[var(--border)] bg-[var(--sidebar-bg)] shadow-xl transition-transform duration-200 ease-out lg:hidden"
        style={{ transform: mobileOpen ? "translateX(0)" : "translateX(-100%)" }}
        aria-modal="true"
        aria-label="Menú de navegación"
      >
        <div className="flex h-14 items-center justify-between border-b border-[var(--border)] px-4">
          <span className="font-semibold text-[var(--foreground)]">Menú</span>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="flex h-10 w-10 min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-[var(--muted)] hover:bg-[var(--hover)] hover:text-[var(--foreground)]"
            aria-label="Cerrar menú"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="flex-1 overflow-auto p-3">
          <NavContent
            rootFolders={rootFolders}
            currentFolderId={currentFolderId ?? null}
            expandedIds={expandedIds}
            childrenMap={childrenMap}
            loadingIds={loadingIds}
            onLoadChildren={loadChildren}
            onToggleExpand={handleToggleExpand}
            onNavigate={() => setMobileOpen(false)}
          />
        </nav>
        {user && (
          <div className="border-t border-[var(--border)] p-3">
            <div className="flex items-center gap-3 rounded-lg px-3 py-2">
              {user.image ? (
                <Image src={user.image} alt="" width={32} height={32} className="rounded-full" />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--accent)] text-sm font-medium text-white">
                  {user.name?.[0] ?? user.email?.[0] ?? "?"}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-[var(--foreground)]">{user.name ?? "Usuario"}</p>
                <p className="truncate text-xs text-[var(--muted)]">{user.email}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => signOut()}
              className="mt-2 w-full rounded-lg px-3 py-2.5 text-left text-sm text-[var(--muted)] hover:bg-[var(--hover)] hover:text-[var(--foreground)] min-h-[44px]"
            >
              Cerrar sesión
            </button>
          </div>
        )}
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden w-56 flex-col border-r border-[var(--border)] bg-[var(--sidebar-bg)] lg:flex">
        <div className="flex h-14 items-center justify-between gap-2 border-b border-[var(--border)] px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent)]">
              <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <span className="font-semibold text-[var(--foreground)]">Videos</span>
          </div>
          <ThemeToggle />
        </div>
        <nav className="flex-1 overflow-auto p-3">
          <NavContent
            rootFolders={rootFolders}
            currentFolderId={currentFolderId ?? null}
            expandedIds={expandedIds}
            childrenMap={childrenMap}
            loadingIds={loadingIds}
            onLoadChildren={loadChildren}
            onToggleExpand={handleToggleExpand}
          />
        </nav>
        {user && (
          <div className="border-t border-[var(--border)] p-3">
            <div className="flex items-center gap-3 rounded-lg px-3 py-2">
              {user.image ? (
                <Image src={user.image} alt="" width={32} height={32} className="rounded-full" />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--accent)] text-sm font-medium text-white">
                  {user.name?.[0] ?? user.email?.[0] ?? "?"}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-[var(--foreground)]">{user.name ?? "Usuario"}</p>
                <p className="truncate text-xs text-[var(--muted)]">{user.email}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => signOut()}
              className="mt-2 w-full rounded-lg px-3 py-2 text-left text-sm text-[var(--muted)] hover:bg-[var(--hover)] hover:text-[var(--foreground)]"
            >
              Cerrar sesión
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
