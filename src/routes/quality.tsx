import type { ReactElement } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { SiteShell } from "@/components/layout/site-shell";
import { Badge } from "@/components/ui/badge";
import { CF, EXP_RATES, HIGH_RISK_MEDS, HIGH_RISK_RATES, SHIFT_RATES, STAFF_RATES, STATS } from "@/lib/data/stats";
import { formatInt } from "@/lib/utils";

export const Route = createFileRoute("/quality")({ component: Quality });

function Quality() {
  return (
    <SiteShell>
      <section className="border-b border-line">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <Badge>Quality · full file</Badge>
          <h1 className="mt-4 font-display text-4xl">Rates computed on all {formatInt(STATS.n)} events.</h1>
          <p className="mt-3 max-w-2xl text-muted">
            Overall modelled incident rate {STATS.incidentRate}%. Charts below are from the paid file, not the
            750-row sample.
          </p>
        </div>
      </section>
      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-2">
        <ChartCard title="Incident rate by shift">
          <BarChart data={SHIFT_RATES}>
            <CartesianGrid stroke="var(--color-line)" vertical={false} />
            <XAxis dataKey="key" tick={{ fill: "var(--color-muted)", fontSize: 12 }} />
            <YAxis tick={{ fill: "var(--color-muted)", fontSize: 12 }} unit="%" />
            <Tooltip />
            <Bar dataKey="rate" fill="var(--color-accent)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartCard>
        <ChartCard title="Incident rate by experience">
          <BarChart data={[...EXP_RATES].sort((a, b) => orderExp(a.key) - orderExp(b.key))}>
            <CartesianGrid stroke="var(--color-line)" vertical={false} />
            <XAxis dataKey="key" tick={{ fill: "var(--color-muted)", fontSize: 12 }} />
            <YAxis tick={{ fill: "var(--color-muted)", fontSize: 12 }} unit="%" />
            <Tooltip />
            <Bar dataKey="rate" fill="var(--color-accent)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartCard>
        <ChartCard title="Incident rate by staffing ratio">
          <BarChart data={[...STAFF_RATES].sort((a, b) => orderStaff(a.key) - orderStaff(b.key))}>
            <CartesianGrid stroke="var(--color-line)" vertical={false} />
            <XAxis dataKey="key" tick={{ fill: "var(--color-muted)", fontSize: 12 }} />
            <YAxis tick={{ fill: "var(--color-muted)", fontSize: 12 }} unit="%" />
            <Tooltip />
            <Bar dataKey="rate" fill="var(--color-accent)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartCard>
        <ChartCard title="High-risk vs other medications">
          <BarChart data={HIGH_RISK_RATES}>
            <CartesianGrid stroke="var(--color-line)" vertical={false} />
            <XAxis dataKey="key" tick={{ fill: "var(--color-muted)", fontSize: 12 }} />
            <YAxis tick={{ fill: "var(--color-muted)", fontSize: 12 }} unit="%" />
            <Tooltip />
            <Bar dataKey="rate" fill="var(--color-accent)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartCard>
      </section>
      <section className="mx-auto max-w-6xl px-4 pb-14 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="overflow-x-auto rounded-xl border border-line bg-elevated p-5">
            <h2 className="font-display text-2xl">Hottest high-risk medications</h2>
            <table className="mt-4 w-full text-sm">
              <thead>
                <tr className="font-mono text-2xs uppercase tracking-label text-subtle">
                  <th className="py-2 text-left">Medication</th>
                  <th className="py-2 text-right">N</th>
                  <th className="py-2 text-right">Rate</th>
                </tr>
              </thead>
              <tbody>
                {HIGH_RISK_MEDS.map((r) => (
                  <tr key={r.key} className="border-t border-line/70">
                    <td className="py-2">{r.key}</td>
                    <td className="py-2 text-right font-mono tabular-nums">{formatInt(r.n)}</td>
                    <td className="py-2 text-right font-mono tabular-nums">{r.rate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="overflow-x-auto rounded-xl border border-line bg-elevated p-5">
            <h2 className="font-display text-2xl">Contributing factors on incidents</h2>
            <table className="mt-4 w-full text-sm">
              <thead>
                <tr className="font-mono text-2xs uppercase tracking-label text-subtle">
                  <th className="py-2 text-left">Factor</th>
                  <th className="py-2 text-right">Incidents</th>
                </tr>
              </thead>
              <tbody>
                {CF.map((r) => (
                  <tr key={r.key} className="border-t border-line/70">
                    <td className="py-2">{r.key}</td>
                    <td className="py-2 text-right font-mono tabular-nums">{formatInt(r.n)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}

function ChartCard({ title, children }: { title: string; children: ReactElement }) {
  return (
    <div className="rounded-xl border border-line bg-elevated p-5">
      <h2 className="font-display text-2xl">{title}</h2>
      <div className="mt-4 h-64">
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function orderExp(k: string) {
  return ["<1yr", "1-3yr", "3-10yr", "10yr+"].indexOf(k);
}
function orderStaff(k: string) {
  return ["<4", "4–6", "6–8", "8+"].indexOf(k);
}
