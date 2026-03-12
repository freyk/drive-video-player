"use client";

import { signOut } from "next-auth/react";
import Image from "next/image";
import { ThemeToggle } from "@/components/theme-toggle";

interface SidebarProps {
  user?: { name?: string | null; email?: string | null; image?: string | null };
}

export function Sidebar({ user }: SidebarProps) {
  return (
    <aside className="flex w-56 flex-col border-r border-[var(--border)] bg-[var(--sidebar-bg)]">
      <div className="flex h-14 items-center justify-between gap-2 px-4 border-b border-[var(--border)]">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent)]">
            <svg
              className="h-5 w-5 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          <span className="font-semibold text-[var(--foreground)]">Videos</span>
        </div>
        <ThemeToggle />
      </div>
      <nav className="flex-1 p-3">
        <a
          href="/"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--hover)]"
        >
          <svg
            className="h-5 w-5 text-[var(--muted)]"
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
          Mis videos
        </a>
      </nav>
      {user && (
        <div className="border-t border-[var(--border)] p-3">
          <div className="flex items-center gap-3 rounded-lg px-3 py-2">
            {user.image ? (
              <Image
                src={user.image}
                alt=""
                width={32}
                height={32}
                className="rounded-full"
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--accent)] text-sm font-medium text-white">
                {user.name?.[0] ?? user.email?.[0] ?? "?"}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-[var(--foreground)]">
                {user.name ?? "Usuario"}
              </p>
              <p className="truncate text-xs text-[var(--muted)]">
                {user.email}
              </p>
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
  );
}
