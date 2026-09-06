import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import { SiteShell } from "@/components/layout/site-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { downloadAsset } from "@/lib/data/export";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/practice")({ component: Practice });

const QUESTIONS = [
  {
    id: 1,
    level: "Beginner",
    title: "Event count per facility",
    prompt: "How many total medication administration events are recorded per facility_id?",
    sql: `SELECT facility_id, COUNT(*) AS total_events
FROM medication_admin_safety
GROUP BY facility_id
ORDER BY facility_id;`,
  },
  {
    id: 2,
    level: "Beginner",
    title: "Event type distribution",
    prompt: "What proportion of events fall into each event_type?",
    sql: `SELECT event_type, COUNT(*) AS event_count,
       ROUND(100.0 * COUNT(*) / (SELECT COUNT(*) FROM medication_admin_safety), 2) AS pct
FROM medication_admin_safety
GROUP BY event_type
ORDER BY event_count DESC;`,
  },
  {
    id: 6,
    level: "Intermediate",
    title: "Incident rate by shift",
    prompt: "Which shifts have the highest modelled near-miss/error rate?",
    sql: `SELECT shift_type,
       COUNT(*) AS total_events,
       SUM(CASE WHEN event_type <> 'Administered as prescribed' THEN 1 ELSE 0 END) AS incidents,
       ROUND(100.0 * SUM(CASE WHEN event_type <> 'Administered as prescribed' THEN 1 ELSE 0 END) / COUNT(*), 2) AS incident_rate_pct
FROM medication_admin_safety
GROUP BY shift_type
ORDER BY incident_rate_pct DESC;`,
  },
  {
    id: 7,
    level: "Intermediate",
    title: "Incident rate by experience band",
    prompt: "How does the incident rate vary by staff experience band?",
    sql: `SELECT
  CASE
    WHEN staff_years_experience < 1 THEN '<1yr'
    WHEN staff_years_experience < 3 THEN '1-3yr'
    WHEN staff_years_experience < 10 THEN '3-10yr'
    ELSE '10yr+'
  END AS experience_band,
  COUNT(*) AS total_events,
  ROUND(100.0 * SUM(CASE WHEN event_type <> 'Administered as prescribed' THEN 1 ELSE 0 END) / COUNT(*), 2) AS incident_rate_pct
FROM medication_admin_safety
GROUP BY experience_band
ORDER BY incident_rate_pct DESC;`,
  },
  {
    id: 12,
    level: "Advanced",
    title: "Timing buckets vs incident rate",
    prompt: "Bucket time_variance_minutes into early / on time / late and compare incident rates.",
    sql: `SELECT
  CASE
    WHEN time_variance_minutes < -15 THEN 'early'
    WHEN time_variance_minutes > 15 THEN 'late'
    ELSE 'on time'
  END AS timing,
  COUNT(*) AS total_events,
  ROUND(100.0 * SUM(CASE WHEN event_type <> 'Administered as prescribed' THEN 1 ELSE 0 END) / COUNT(*), 2) AS incident_rate_pct
FROM medication_admin_safety
GROUP BY timing
ORDER BY incident_rate_pct DESC;`,
  },
  {
    id: 15,
    level: "Advanced",
    title: "Near-miss vs harm-reaching factors",
    prompt: "Compare contributing_factor distributions between near-miss events and errors that reached the patient.",
    sql: `SELECT
  CASE
    WHEN event_type LIKE 'Near-miss%' THEN 'near-miss'
    WHEN event_type LIKE 'Error reached patient%' THEN 'reached-patient'
  END AS class,
  contributing_factor,
  COUNT(*) AS n
FROM medication_admin_safety
WHERE event_type <> 'Administered as prescribed'
GROUP BY class, contributing_factor
ORDER BY class, n DESC;`,
  },
] as const;

const LEVELS = ["All", "Beginner", "Intermediate", "Advanced"] as const;

function Practice() {
  const [level, setLevel] = useState<(typeof LEVELS)[number]>("All");
  const items = useMemo(
    () => QUESTIONS.filter((q) => level === "All" || q.level === level),
    [level],
  );

  return (
    <SiteShell>
      <section className="border-b border-line">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <Badge>Practice</Badge>
          <h1 className="mt-4 font-display text-4xl">Fifteen questions. Six shown here. Full SQL file in the pack.</h1>
          <p className="mt-3 max-w-2xl text-muted">
            Load medication_admin_safety from the CSV, then run these. Synthetic data only.
          </p>
          <Button
            className="mt-6"
            variant="outline"
            onClick={() => downloadAsset("/data/sql_practice_queries.sql", "sql_practice_queries.sql")}
          >
            Download all SQL
          </Button>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="flex flex-wrap gap-1">
          {LEVELS.map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setLevel(l)}
              className={cn(
                "h-11 rounded-md border px-3 text-sm",
                level === l ? "border-accent bg-accent text-accent-fg" : "border-line bg-elevated",
              )}
            >
              {l}
            </button>
          ))}
        </div>
        <ol className="mt-8 space-y-6">
          {items.map((q) => (
            <li key={q.id} className="rounded-xl border border-line bg-elevated p-5">
              <p className="font-mono text-2xs uppercase tracking-label text-subtle">
                {q.level} · Q{q.id}
              </p>
              <h2 className="mt-2 font-display text-2xl">{q.title}</h2>
              <p className="mt-2 text-sm text-muted">{q.prompt}</p>
              <pre className="mt-4 overflow-x-auto rounded-lg bg-ink p-4 font-mono text-xs text-bg">
                <code>{q.sql}</code>
              </pre>
              <Button
                className="mt-3"
                size="sm"
                variant="outline"
                onClick={async () => {
                  await navigator.clipboard.writeText(q.sql);
                  toast.success("SQL copied");
                }}
              >
                <Copy />
                Copy SQL
              </Button>
            </li>
          ))}
        </ol>
      </section>
    </SiteShell>
  );
}
