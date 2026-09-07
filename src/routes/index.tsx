import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Download, Lock, ShieldCheck, Stethoscope } from "lucide-react";
import { SiteShell } from "@/components/layout/site-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { COMMERCIAL_TIER, FEATURED_TIER, RELEASE, TIERS, USE_CASES } from "@/lib/data/catalog";
import { downloadProspectus, downloadSampleCsv } from "@/lib/data/export";
import { EVENT_TYPES, SHIFT_RATES } from "@/lib/data/stats";
import { SITE } from "@/lib/site";
import { formatInt } from "@/lib/utils";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const night = SHIFT_RATES.find((s) => s.key === "Night");
  const prescribed = EVENT_TYPES.find((e) => e.key === "Administered as prescribed");

  return (
    <SiteShell>
      <section className="border-b border-line">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
          <Badge>{SITE.brand} · {RELEASE.code}</Badge>
          <h1 className="mt-6 max-w-3xl font-display text-4xl font-medium sm:text-6xl">
            Synthetic medication-administration data you can actually sell.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-muted">
            {formatInt(RELEASE.events)} events across {RELEASE.facilities} facilities and {RELEASE.wards}{" "}
            wards. No PHI. PayPal. One payment. Sold by {SITE.brand} at {SITE.host}.
          </p>
          <p className="mt-3 font-mono text-sm text-subtle">
            Sample is free · Full file {FEATURED_TIER.price} · Commercial {COMMERCIAL_TIER.price}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link to="/license">
                Buy the 32k file · {FEATURED_TIER.price}
                <ArrowRight />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => {
                downloadSampleCsv();
              }}
            >
              <Download />
              Free 750-row sample
            </Button>
          </div>
        </div>
      </section>

      <section className="border-b border-line">
        <div className="mx-auto grid max-w-6xl gap-px bg-line sm:grid-cols-4">
          {[
            { k: formatInt(RELEASE.events), v: "Events" },
            { k: `${RELEASE.incidentRate}%`, v: "Modelled incidents" },
            { k: String(RELEASE.columns), v: "Columns" },
            { k: night ? `${night.rate}%` : "—", v: "Night-shift rate" },
          ].map((s) => (
            <div key={s.v} className="bg-bg px-6 py-8">
              <p className="font-display text-3xl">{s.k}</p>
              <p className="mt-1 font-mono text-2xs uppercase tracking-label text-subtle">{s.v}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <p className="font-mono text-2xs uppercase tracking-label text-subtle">01 · What it is</p>
        <h2 className="mt-3 max-w-2xl font-display text-3xl font-medium">
          One administration event per row. Staffing, experience, shift, and a near-miss flag.
        </h2>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {USE_CASES.map((u) => (
            <article key={u.title} className="rounded-xl bg-elevated p-5 shadow-card">
              <h3 className="font-display text-xl">{u.title}</h3>
              <p className="mt-2 text-sm text-muted">{u.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-line bg-elevated">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2">
          <div>
            <p className="font-mono text-2xs uppercase tracking-label text-subtle">02 · Modelled, not measured</p>
            <h2 className="mt-3 font-display text-3xl font-medium">Night is hotter. Juniors miss more. Thin staffing shows.</h2>
            <p className="mt-4 text-muted">
              {prescribed ? `${prescribed.pct}% administered as prescribed.` : null} Incident rate rises on
              night shift to {night?.rate}%. High-risk meds run hotter than the rest. These are generator
              rules, not a hospital's log.
            </p>
            <Button asChild className="mt-6" variant="outline">
              <Link to="/quality">
                Quality charts
                <ArrowRight />
              </Link>
            </Button>
          </div>
          <ul className="space-y-3">
            {SHIFT_RATES.map((s) => (
              <li key={s.key} className="flex items-center justify-between rounded-lg border border-line bg-bg px-4 py-3">
                <span>{s.key}</span>
                <span className="font-mono text-sm tabular-nums">{s.rate}%</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-2xs uppercase tracking-label text-subtle">03 · Trust</p>
            <h2 className="mt-3 font-display text-3xl font-medium">Born synthetic. HIPAA-safe by construction.</h2>
          </div>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {[
            { icon: ShieldCheck, t: "No PHI", d: "Nothing was sampled from a real record. Facilities, staff, and events are fictional." },
            { icon: Stethoscope, t: "Clinically shaped", d: "Relationships were specified by an RN. Rates are elevated on purpose so the positive class is usable." },
            { icon: Lock, t: "Not clinical use", d: "Teaching, research, software tests, and demos. Do not treat the rates as evidence." },
          ].map((c) => (
            <article key={c.t} className="rounded-xl border border-line p-5">
              <c.icon className="size-5 text-accent" />
              <h3 className="mt-3 font-display text-xl">{c.t}</h3>
              <p className="mt-2 text-sm text-muted">{c.d}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-14 sm:flex-row sm:items-end sm:justify-between sm:px-6">
          <div>
            <p className="font-mono text-2xs uppercase tracking-label text-subtle">04 · Price</p>
            <h2 className="mt-3 font-display text-3xl font-medium">One file. One payment. Done.</h2>
          </div>
          <Button asChild variant="outline">
            <Link to="/license">
              Checkout
              <ArrowRight />
            </Link>
          </Button>
        </div>
        <div className="mx-auto max-w-6xl px-4 pb-14 sm:px-6">
          <div className="grid gap-4 md:grid-cols-3">
            {TIERS.map((t) => (
              <article
                key={t.id}
                className={`flex flex-col rounded-xl p-5 shadow-card ${t.featured ? "bg-ink text-bg" : "bg-elevated"}`}
              >
                <p className={`font-mono text-2xs uppercase tracking-label ${t.featured ? "text-bg/60" : "text-subtle"}`}>
                  {t.name}
                  {t.featured ? " · Most bought" : ""}
                </p>
                <p className="mt-3 font-display text-4xl">{t.price}</p>
                <p className={`mt-1 text-sm ${t.featured ? "text-bg/70" : "text-muted"}`}>
                  {t.cadence} · {t.size}
                </p>
                <p className={`mt-4 flex-1 text-sm ${t.featured ? "text-bg/75" : "text-muted"}`}>{t.blurb}</p>
                <Button asChild className="mt-6" variant={t.featured ? "default" : "outline"}>
                  <Link to="/license">{t.amount === 0 ? "Get sample" : `Buy ${t.price}`}</Link>
                </Button>
              </article>
            ))}
          </div>
          <button
            type="button"
            className="mt-6 text-sm text-muted underline-offset-4 hover:text-ink hover:underline"
            onClick={() => downloadProspectus()}
          >
            Download a one-page prospectus
          </button>
        </div>
      </section>

      <section className="border-t border-line bg-accent text-accent-fg">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-14 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <h2 className="font-display text-3xl font-medium">Pay {FEATURED_TIER.price}. Download the 32,000-event file.</h2>
            <p className="mt-2 max-w-md text-accent-fg/80">
              Or take the 750-row sample first. Same schema. If the sample does not fit, the full file will not either.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild variant="inverse" size="lg">
              <Link to="/license">Buy · {FEATURED_TIER.price}</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-accent-fg/30 bg-transparent text-accent-fg hover:bg-accent-fg/10">
              <Link to="/explore">Inspect the sample</Link>
            </Button>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
