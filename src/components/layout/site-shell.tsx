import { useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { FEATURED_TIER } from "@/lib/data/catalog";
import { SITE } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/catalog" as const, label: "Catalog" },
  { to: "/explore" as const, label: "Explore" },
  { to: "/quality" as const, label: "Quality" },
  { to: "/practice" as const, label: "Practice" },
  { to: "/license" as const, label: "Buy" },
];

export function SiteShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-dvh bg-bg text-ink">
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-elevated focus:px-3 focus:py-2"
      >
        Skip to content
      </a>
      <header className="sticky top-0 z-40 border-b border-line bg-bg/90 pr-20 backdrop-blur md:pr-6">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Link to="/" className="min-w-0">
            <span className="block font-display text-lg leading-none">{SITE.brand}</span>
            <span className="mt-1 block font-mono text-2xs uppercase tracking-label text-subtle">
              {SITE.product} · {SITE.host}
            </span>
          </Link>
          <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium text-muted hover:text-ink",
                  pathname === item.to && "bg-accent-soft text-accent",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Button asChild size="sm" className="hidden sm:inline-flex">
              <Link to="/license">Buy {FEATURED_TIER.price}</Link>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="md:hidden"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
        {open ? (
          <nav className="border-t border-line px-4 py-3 md:hidden" aria-label="Mobile">
            <div className="flex flex-col gap-1">
              {NAV.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "rounded-md px-3 py-3 text-base font-medium text-ink",
                    pathname === item.to && "bg-accent-soft text-accent",
                  )}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                to="/license"
                onClick={() => setOpen(false)}
                className="rounded-md bg-accent px-3 py-3 text-center text-base font-medium text-accent-fg"
              >
                Buy {FEATURED_TIER.price}
              </Link>
            </div>
          </nav>
        ) : null}
      </header>
      <div id="content">{children}</div>
      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-muted sm:px-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p>
              {SITE.brand}. Synthetic data. No PHI. Not for clinical use.
            </p>
            <p className="font-mono text-2xs uppercase tracking-label">
              {SITE.host} · ABN {SITE.abn}
            </p>
          </div>
          <p>
            <a className="underline decoration-line underline-offset-4 hover:text-ink" href={`mailto:${SITE.email}`}>
              {SITE.email}
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
