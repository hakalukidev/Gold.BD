"use client";

import Link from "next/link";
import { useT } from "@/lib/i18n/use-t";

export function LandingFooter() {
  const t = useT();

  const columns = [
    {
      title: t.footer.productHeading,
      links: [
        { href: "/register", label: t.nav.register },
        { href: "/login", label: t.nav.login },
        { href: "#how-it-works", label: t.nav.howItWorks },
        { href: "#features", label: t.nav.features },
      ],
    },
    {
      title: t.footer.supportHeading,
      links: [{ href: "#faq", label: t.faq.heading }],
    },
  ];

  return (
    <footer id="contact" className="scroll-mt-24 border-t border-white/10 bg-ink py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <Link href="/" className="flex items-baseline gap-1 text-lg font-bold text-white">
              Gold <span className="text-gold">BD</span>
            </Link>
            <p className="mt-3 max-w-xs text-sm text-neutral-400">{t.footer.tagline}</p>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <p className="text-sm font-medium text-white">{col.title}</p>
              <ul className="mt-3 space-y-2">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} className="text-sm text-neutral-400 hover:text-white">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 border-t border-white/10 pt-6 text-xs text-neutral-500">
          © {new Date().getFullYear()} Gold BD. {t.footer.copyright}
        </div>
      </div>
    </footer>
  );
}
