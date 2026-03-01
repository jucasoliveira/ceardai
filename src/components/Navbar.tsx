"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";

const links = [
  { href: "/", label: "Home" },
  { href: "/our-story", label: "Our Story" },
  { href: "/our-beers", label: "Our Beers" },
  { href: "/beer-sales", label: "Beer Sales" },
  { href: "/contact", label: "Contact" },
  { href: "/faq", label: "FAQ" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  const user = session?.user;
  const tier = (user as { tier?: string } | undefined)?.tier;
  const isAdmin = tier === "admin";
  const isFounder = tier === "founder";

  return (
    <nav className="bg-charcoal text-cream">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link
            href="/"
            className={`font-serif text-2xl tracking-wide ${
              isFounder ? "text-gold" : ""
            }`}
          >
            Ceardaí
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center space-x-8">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-cream/80 hover:text-amber transition-colors text-sm uppercase tracking-widest"
              >
                {link.label}
              </Link>
            ))}

            {/* Auth links */}
            {user ? (
              <>
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="text-amber hover:text-amber/80 transition-colors text-sm uppercase tracking-widest"
                  >
                    Admin
                  </Link>
                )}
                <Link
                  href="/portal"
                  className={`hover:text-amber transition-colors text-sm uppercase tracking-widest ${
                    isFounder ? "text-gold" : "text-cream/80"
                  }`}
                >
                  My Account
                </Link>
                <button
                  onClick={async () => { await signOut(); router.push("/"); }}
                  className="text-cream/50 hover:text-cream/80 transition-colors text-sm uppercase tracking-widest"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="text-cream/80 hover:text-amber transition-colors text-sm uppercase tracking-widest"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-cream"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block text-cream/80 hover:text-amber transition-colors text-sm uppercase tracking-widest py-2"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            {user ? (
              <>
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="block text-amber hover:text-amber/80 transition-colors text-sm uppercase tracking-widest py-2"
                    onClick={() => setIsOpen(false)}
                  >
                    Admin
                  </Link>
                )}
                <Link
                  href="/portal"
                  className={`block hover:text-amber transition-colors text-sm uppercase tracking-widest py-2 ${
                    isFounder ? "text-gold" : "text-cream/80"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  My Account
                </Link>
                <button
                  onClick={async () => {
                    await signOut(); router.push("/");
                    setIsOpen(false);
                  }}
                  className="block text-cream/50 hover:text-cream/80 transition-colors text-sm uppercase tracking-widest py-2"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="block text-cream/80 hover:text-amber transition-colors text-sm uppercase tracking-widest py-2"
                onClick={() => setIsOpen(false)}
              >
                Sign In
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
