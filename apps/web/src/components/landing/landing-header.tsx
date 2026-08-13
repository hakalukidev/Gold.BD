"use client";

import Link from "next/link";
import { Menu, X, Route, Sparkles, LifeBuoy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setMobileMenuOpen, toggleMobileMenu, setLocale, type Locale } from "@/store/slices/ui-slice";
import { useT } from "@/lib/i18n/use-t";
import { cn } from "@/lib/utils";

const navIcons = [Route, Sparkles, LifeBuoy];
const navHrefs = ["#how-it-works", "#features", "#faq"];

function LanguageToggle({ className }: { className?: string }) {
  const locale = useAppSelector((state) => state.ui.locale);
  const dispatch = useAppDispatch();

  const options: { id: Locale; label: string }[] = [
    { id: "bn", label: "বাং" },
    { id: "en", label: "EN" },
  ];

  return (
    <div className={cn("flex items-center gap-0.5 rounded-full border border-white/10 bg-white/5 p-0.5", className)}>
      {options.map((opt) => (
        <button
          key={opt.id}
          type="button"
          onClick={() => dispatch(setLocale(opt.id))}
          aria-pressed={locale === opt.id}
          className={cn(
            "rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
            locale === opt.id ? "bg-gold text-ink" : "text-neutral-300 hover:text-white"
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export function LandingHeader() {
  const mobileMenuOpen = useAppSelector((state) => state.ui.mobileMenuOpen);
  const dispatch = useAppDispatch();
  const t = useT();

  const navLinks = navHrefs.map((href, i) => ({
    href,
    label: [t.nav.howItWorks, t.nav.features, t.nav.support][i],
    Icon: navIcons[i],
  }));

  return (
    <div className="sticky top-3 z-50 flex justify-center px-3 sm:top-4 sm:px-4">
      <header className="w-full max-w-3xl rounded-full border border-white/10 bg-ink/90 shadow-2xl shadow-black/40 backdrop-blur-md">
        <div className="flex items-center justify-between gap-2 px-3 py-2 sm:px-4">
          <Link href="/" className="flex shrink-0 items-baseline gap-1 pl-1 text-base font-bold text-white">
            Gold <span className="text-gold">BD</span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {navLinks.map(({ href, label, Icon }) => (
              <a
                key={href}
                href={href}
                className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm text-neutral-300 transition-colors hover:bg-white/10 hover:text-white"
              >
                <Icon className="size-3.5" />
                {label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <LanguageToggle />
            <Button
              variant="ghost"
              size="sm"
              className="text-neutral-200 hover:bg-white/10 hover:text-white"
              render={<Link href="/login">{t.nav.login}</Link>}
            />
            <Button
              size="sm"
              className="bg-gold text-ink hover:bg-gold-light"
              render={<Link href="/register">{t.nav.register}</Link>}
            />
          </div>

          <div className="flex items-center gap-1 lg:hidden">
            <LanguageToggle />
            <button
              type="button"
              aria-label={mobileMenuOpen ? t.nav.closeMenu : t.nav.openMenu}
              onClick={() => dispatch(toggleMobileMenu())}
              className="rounded-full p-2 text-white hover:bg-white/10"
            >
              {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="absolute top-full mt-2 w-full max-w-3xl rounded-3xl border border-white/10 bg-ink/95 p-4 shadow-2xl backdrop-blur-md lg:hidden">
          <nav className="flex flex-col gap-1">
            {navLinks.map(({ href, label, Icon }) => (
              <a
                key={href}
                href={href}
                onClick={() => dispatch(setMobileMenuOpen(false))}
                className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-neutral-300 hover:bg-white/10 hover:text-white"
              >
                <Icon className="size-4" />
                {label}
              </a>
            ))}
          </nav>
          <div className="mt-3 flex flex-col gap-2 border-t border-white/10 pt-3">
            <Button
              variant="outline"
              className="border-white/20 bg-transparent text-white hover:bg-white/10"
              render={<Link href="/login">{t.nav.login}</Link>}
            />
            <Button
              className="bg-gold text-ink hover:bg-gold-light"
              render={<Link href="/register">{t.nav.register}</Link>}
            />
          </div>
        </div>
      )}
    </div>
  );
}
