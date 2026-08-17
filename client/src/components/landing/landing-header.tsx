"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Phone, Gem } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setMobileMenuOpen, toggleMobileMenu, setLocale, type Locale } from "@/store/slices/ui-slice";
import { useT } from "@/lib/i18n/use-t";
import { cn } from "@/lib/utils";

const SUPPORT_PHONE = "+880 1700 000000";

function LanguageToggle({ className }: { className?: string }) {
  const locale = useAppSelector((state) => state.ui.locale);
  const dispatch = useAppDispatch();

  const options: { id: Locale; label: string }[] = [
    { id: "bn", label: "বাং" },
    { id: "en", label: "EN" },
  ];

  return (
    <div className={cn("flex items-center gap-0.5 rounded-full border border-white/15 bg-white/5 p-0.5", className)}>
      {options.map((opt) => (
        <button
          key={opt.id}
          type="button"
          onClick={() => dispatch(setLocale(opt.id))}
          aria-pressed={locale === opt.id}
          className={cn(
            "rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
            locale === opt.id ? "bg-gold text-ink" : "text-neutral-400 hover:text-white"
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
  const pathname = usePathname();
  const t = useT();

  const navLinks = [
    { href: "/", label: t.nav.home },
    { href: "#about", label: t.nav.aboutUs },
    { href: "#rate-history", label: t.nav.marketRate },
    { href: "/buy-gold", label: t.nav.buyGold },
    { href: "#why", label: t.nav.whyUs },
    { href: "#contact", label: t.nav.contactUs },
  ];

  const isActive = (href: string) => href === "/" && pathname === "/";
  const closeMobileMenu = () => dispatch(setMobileMenuOpen(false));

  return (
    <div className="sticky top-0 z-50 w-full">
      <header className="w-full border-b border-[rgba(212,166,42,0.15)] bg-[rgba(3,3,3,0.75)] backdrop-blur-[20px]">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex shrink-0 items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-full border border-gold/40 bg-gold/10 text-gold">
              <Gem className="size-4.5" />
            </span>
            <span className="flex flex-col leading-none">
              <span className="text-lg font-bold tracking-tight text-white">
                GOLD<span className="text-gold">.BD</span>
              </span>
              <span className="mt-1 text-[10px] font-medium tracking-wide text-muted-white uppercase">
                {t.nav.tagline}
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-7 lg:flex">
            {navLinks.map(({ href, label }) => {
              const active = isActive(href);
              const linkClassName = cn(
                "relative py-1.5 text-sm text-neutral-300 transition-colors duration-300 hover:text-gold",
                active && "text-gold"
              );
              const content = (
                <>
                  {label}
                  <span
                    className={cn(
                      "absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-gold transition-transform duration-300",
                      active ? "scale-x-100" : "group-hover:scale-x-100"
                    )}
                  />
                </>
              );
              return href.startsWith("#") ? (
                <a key={label} href={href} className={cn(linkClassName, "group")}>
                  {content}
                </a>
              ) : (
                <Link key={label} href={href} className={cn(linkClassName, "group")}>
                  {content}
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-4 lg:flex">
            <a
              href={`tel:${SUPPORT_PHONE.replace(/\s/g, "")}`}
              className="flex items-center gap-2 text-sm text-neutral-300 transition-colors hover:text-gold"
            >
              <Phone className="size-4 text-gold" />
              {SUPPORT_PHONE}
            </a>
            <LanguageToggle />
            <Button
              size="sm"
              nativeButton={false}
              className="rounded-[11px] bg-gold px-4 font-semibold tracking-wide text-ink uppercase shadow-[0_0_18px_rgba(212,166,42,0.25)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-gold-bright hover:shadow-[0_0_26px_rgba(212,166,42,0.4)]"
              render={<Link href="/login">{t.nav.loginSignup}</Link>}
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
        <div className="w-full border-b border-[rgba(212,166,42,0.15)] bg-[rgba(3,3,3,0.97)] p-4 shadow-2xl backdrop-blur-[20px] lg:hidden">
          <nav className="flex flex-col gap-1">
            {navLinks.map(({ href, label }) => {
              const active = isActive(href);
              const className = cn(
                "rounded-xl px-3 py-2 text-sm transition-colors",
                active ? "text-gold" : "text-neutral-300 hover:bg-white/10 hover:text-white"
              );
              return href.startsWith("#") ? (
                <a key={label} href={href} onClick={closeMobileMenu} className={className}>
                  {label}
                </a>
              ) : (
                <Link key={label} href={href} onClick={closeMobileMenu} className={className}>
                  {label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-3 flex flex-col gap-3 border-t border-white/10 pt-3">
            <a
              href={`tel:${SUPPORT_PHONE.replace(/\s/g, "")}`}
              className="flex items-center gap-2 px-3 text-sm text-neutral-300"
            >
              <Phone className="size-4 text-gold" />
              {SUPPORT_PHONE}
            </a>
            <Button
              nativeButton={false}
              className="rounded-[11px] bg-gold font-semibold tracking-wide text-ink uppercase hover:bg-gold-bright"
              render={<Link href="/login">{t.nav.loginSignup}</Link>}
            />
          </div>
        </div>
      )}
    </div>
  );
}
