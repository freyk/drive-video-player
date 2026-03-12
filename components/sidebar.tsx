"use client";

import { useState, useEffect } from "react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

interface SidebarProps {
  user?: { name?: string | null; email?: string | null; image?: string | null };
}

function NavContent({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <Link
      href="/"
      onClick={onNavigate}
      className="flex min-h-[44px] items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--hover)]"
    >
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
      Mis videos
    </Link>
  );
}

export function Sidebar({ user }: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

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
          <NavContent onNavigate={() => setMobileOpen(false)} />
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
        <nav className="flex-1 p-3">
          <NavContent />
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
