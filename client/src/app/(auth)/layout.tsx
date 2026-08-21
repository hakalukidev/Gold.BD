import Link from "next/link";
import { Gem } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative flex flex-1 flex-col items-center justify-center gap-8 overflow-hidden px-4 py-16">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_45%_at_50%_0%,color-mix(in_oklch,var(--color-gold)_12%,transparent),transparent)]"
      />
      <Link href="/" className="flex flex-col items-center gap-2.5">
        <span className="flex size-11 items-center justify-center rounded-full border border-gold/40 bg-gold/10 text-gold">
          <Gem className="size-5" />
        </span>
        <span className="flex flex-col items-center leading-none">
          <span className="text-lg font-bold tracking-tight">
            GOLD<span className="text-gold">.BD</span>
          </span>
          <span className="mt-1.5 text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
            Trusted Gold. Pure Value.
          </span>
        </span>
      </Link>
      <div className="w-full max-w-sm">{children}</div>
    </main>
  );
}
