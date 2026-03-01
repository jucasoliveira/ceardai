"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import TierBadge from "@/components/TierBadge";
import type { UserTier } from "@/types";

interface PortalSidebarProps {
  userName: string;
  userTier: UserTier;
}

const baseLinks = [
  { href: "/portal", label: "Dashboard" },
  { href: "/portal/orders", label: "Orders" },
  { href: "/portal/early-access", label: "Early Access" },
  { href: "/portal/account", label: "Account" },
];

const founderLinks = [
  { href: "/portal", label: "Dashboard" },
  { href: "/portal/orders", label: "Orders" },
  { href: "/portal/early-access", label: "Early Access" },
  { href: "/portal/vote", label: "Vote" },
  { href: "/portal/account", label: "Account" },
];

export default function PortalSidebar({ userName, userTier }: PortalSidebarProps) {
  const pathname = usePathname();
  const links = userTier === "founder" ? founderLinks : baseLinks;

  function isActive(href: string) {
    if (href === "/portal") return pathname === "/portal";
    return pathname.startsWith(href);
  }

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-64 min-h-screen bg-charcoal text-cream shrink-0">
        <div className="p-6 border-b border-cream/10">
          <p className="font-serif text-lg truncate">{userName}</p>
          <div className="mt-2">
            <TierBadge tier={userTier} />
          </div>
        </div>
        <nav className="flex-1 py-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block px-6 py-3 text-sm uppercase tracking-widest transition-colors ${
                isActive(link.href)
                  ? "bg-cream/10 text-amber"
                  : "text-cream/60 hover:text-cream hover:bg-cream/5"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="p-6 border-t border-cream/10">
          <p className="text-xs text-cream/40 uppercase tracking-widest">Member Portal</p>
        </div>
      </aside>

      {/* Mobile horizontal tabs */}
      <nav className="md:hidden flex overflow-x-auto bg-charcoal border-b border-cream/10">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`shrink-0 px-4 py-3 text-xs uppercase tracking-widest transition-colors ${
              isActive(link.href)
                ? "text-amber border-b-2 border-amber"
                : "text-cream/60 hover:text-cream"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </>
  );
}
