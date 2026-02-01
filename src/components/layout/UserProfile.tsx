"use client";

import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { ArrowUpRight01Icon } from "@/components/icons";

interface UserProfileProps {
  name: string;
  avatarUrl?: string | null;
  initials?: string;
  profileHref?: string;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function UserProfile({
  name,
  avatarUrl,
  initials,
  profileHref,
}: UserProfileProps) {
  const displayInitials = initials ?? getInitials(name);
  const isClickable = profileHref != null && profileHref !== "";

  const content = (
    <>
        {/* Avatar */}
        <div className="relative z-10 w-10 h-10 rounded-full shrink-0 overflow-hidden bg-[var(--neutral-stroke-muted)]">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={name}
              fill
              className="object-cover"
              sizes="40px"
            />
          ) : (
            <span
              className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-[var(--neutral-text-muted)]"
              aria-hidden
            >
              {displayInitials}
            </span>
          )}
        </div>

        {/* Info */}
        <div className="relative z-10 min-w-0 flex-1">
          <p className="font-semibold text-sm text-[var(--neutral-text-black)] truncate">
            {name}
          </p>
          <span className="flex items-center gap-1 text-xs text-[var(--neutral-text-muted)] transition-colors duration-200">
            Ver Perfil
            <Icon
              icon={ArrowUpRight01Icon}
              size={12}
              className="shrink-0 opacity-70"
            />
          </span>
        </div>
    </>
  );

  return (
    <div className="group mx-4 mb-4">
      {isClickable ? (
        <Link
          href={profileHref}
          className="relative flex items-center gap-3 p-3 rounded-[var(--radius-md)] border border-[var(--neutral-stroke-white)] bg-[var(--neutral-25)] text-[var(--neutral-text-strong)] before:content-[''] before:absolute before:inset-0 before:rounded-[inherit] before:bg-black/8 before:opacity-0 before:transition-opacity before:duration-200 hover:before:opacity-100 before:pointer-events-none active:scale-[0.99] transition-all duration-150 ease-out"
        >
          {content}
        </Link>
      ) : (
        <div
          className="relative flex items-center gap-3 p-3 rounded-[var(--radius-md)] border border-[var(--neutral-stroke-white)] bg-[var(--neutral-25)] text-[var(--neutral-text-strong)] cursor-default opacity-90"
          aria-disabled="true"
        >
          {content}
        </div>
      )}
    </div>
  );
}
