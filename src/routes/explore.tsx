import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/site-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FEATURED_TIER } from "@/lib/data/catalog";
import { downloadFullCsv, downloadSampleCsv } from "@/lib/data/export";
import { getSampleEvents, isIncident, PRESCRIBED, type MedEvent } from "@/lib/data/load";
import { hasPaidUnlock, useLicenses } from "@/lib/license/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/explore")({ component: Explore });

const SHIFTS = ["All", "Day", "Evening", "Night"] as const;
const OUTCOMES = ["All", "Prescribed", "Near-miss", "Error"] as const;

function outcomeOf(e: MedEvent) {
  if (e.event_type === PRESCRIBED) return "Prescribed";
  if (e.event_type.startsWith("Near-miss")) return "Near-miss";
  return "Error";
}

function Explore() {
  const licenses = useLicenses((s) => s.licenses);
  const unlocked = hasPaidUnlock(licenses);
  const all = useMemo(() => getSampleEvents(), []);
  const [shift, setShift] = useState<(typeof SHIFTS)[number]>("All");
  const [outcome, setOutcome] = useState<(typeof OUTCOMES)[number]>("All");
  const [risk, setRisk] = useState<"All" | "Yes" | "No">("All");
  const [q, setQ] = useState("");

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return all.filter((e) => {
      if (shift !== "All" && e.shift_type !== shift) return false;
      if (outcome !== "All" && outcomeOf(e) !== outcome) return false;
      if (risk !== "All" && e.high_risk_medication !== risk) return false;
      if (!needle) return true;
      return (
        e.event_type.toLowerCase().includes(needle) ||
        e.medication_name.toLowerCase().includes(needle) ||
        e.ward_unit.toLowerCase().includes(needle) ||
        e.facility_id.toLowerCase().includes(needle) ||
        e.contributing_factor.toLowerCase().includes(needle)
      );
    });
  }, [all, shift, outcome, risk, q]);

  return (
    <SiteShell>
      <section className="border-b border-line">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <Badge>Explore</Badge>
          <h1 className="mt-4 font-display text-4xl">750-row sample. Same 22 fields as the paid file.</h1>
          <p className="mt-3 max-w-2xl text-muted">
            Filter the public sample. The 32,000-event file unlocks after PayPal.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button variant="outline" onClick={() => downloadSampleCsv()}>
              Sample CSV
            </Button>
            {unlocked ? (
              <Button variant="outline" onClick={() => downloadFullCsv()}>
                Full 32k CSV
              </Button>
            ) : (
              <Button asChild variant="outline">
                <Link to="/license">Unlock 32k · {FEATURED_TIER.price}</Link>
              </Button>
            )}
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
          <FilterRow label="Shift" value={shift} options={SHIFTS} onChange={setShift} />
          <FilterRow label="Outcome" value={outcome} options={OUTCOMES} onChange={setOutcome} />
          <FilterRow label="High-risk" value={risk} options={["All", "Yes", "No"]} onChange={setRisk} />
          <div className="flex-1">
            <label className="font-mono text-2xs uppercase tracking-label text-subtle" htmlFor="filter">
              Search
            </label>
            <Input
              id="filter"
              className="mt-1"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="ward, med, event type…"
            />
          </div>
        </div>
        <p className="mt-4 font-mono text-2xs uppercase tracking-label text-subtle">
          {rows.length} of {all.length} sample rows
        </p>
        <div className="mt-4 overflow-x-auto rounded-xl border border-line bg-elevated">
          <table className="w-full text-left text-sm" style={{ minWidth: "40rem" }}>
            <thead>
              <tr className="border-b border-line font-mono text-2xs uppercase tracking-label text-subtle">
                <th className="px-3 py-3">Event</th>
                <th className="px-3 py-3">Shift</th>
                <th className="px-3 py-3">Ward</th>
                <th className="px-3 py-3">Med</th>
                <th className="px-3 py-3">Type</th>
                <th className="px-3 py-3">Risk</th>
              </tr>
            </thead>
            <tbody>
              {rows.slice(0, 80).map((e) => (
                <tr key={e.event_id} className="border-b border-line/60">
                  <td className="px-3 py-2 font-mono text-xs">{e.event_id}</td>
                  <td className="px-3 py-2">{e.shift_type}</td>
                  <td className="px-3 py-2">{e.ward_unit}</td>
                  <td className="px-3 py-2">{e.medication_name}</td>
                  <td className={cn("px-3 py-2", isIncident(e) && "text-danger")}>{e.event_type}</td>
                  <td className="px-3 py-2">{e.high_risk_medication}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {rows.length > 80 ? (
          <p className="mt-3 text-sm text-muted">Showing first 80 matches. Download the sample CSV for all 750.</p>
        ) : null}
      </section>
    </SiteShell>
  );
}

function FilterRow<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: readonly T[];
  onChange: (v: T) => void;
}) {
  return (
    <div>
      <p className="font-mono text-2xs uppercase tracking-label text-subtle">{label}</p>
      <div className="mt-1 flex flex-wrap gap-1">
        {options.map((o) => (
          <button
            key={o}
            type="button"
            onClick={() => onChange(o)}
            className={cn(
              "h-11 rounded-md border px-3 text-sm",
              value === o ? "border-accent bg-accent text-accent-fg" : "border-line bg-elevated text-ink",
            )}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}
