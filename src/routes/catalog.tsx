import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/site-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FIELDS, RELEASE } from "@/lib/data/catalog";
import { downloadAsset, downloadSampleCsv } from "@/lib/data/export";

export const Route = createFileRoute("/catalog")({ component: Catalog });

function Catalog() {
  return (
    <SiteShell>
      <section className="border-b border-line">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <Badge>Catalog</Badge>
          <h1 className="mt-4 font-display text-4xl">Twenty-two fields. One grain.</h1>
          <p className="mt-3 max-w-2xl text-muted">
            Each row is one medication administration. Full dictionary ships with every pack.
            {RELEASE.columns} columns, {RELEASE.events.toLocaleString()} events in the paid file.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button onClick={() => downloadSampleCsv()}>Download sample CSV</Button>
            <Button variant="outline" onClick={() => downloadAsset("/data/data_dictionary.md", "data_dictionary.md")}>
              Data dictionary
            </Button>
            <Button asChild variant="outline">
              <Link to="/explore">Browse 750 rows</Link>
            </Button>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-6xl overflow-x-auto px-4 py-10 sm:px-6">
        <table className="w-full text-left text-sm" style={{ minWidth: "36rem" }}>
          <thead>
            <tr className="border-b border-line font-mono text-2xs uppercase tracking-label text-subtle">
              <th className="py-3 pr-4">Field</th>
              <th className="py-3 pr-4">Type</th>
              <th className="py-3">Note</th>
            </tr>
          </thead>
          <tbody>
            {FIELDS.map((f) => (
              <tr key={f.name} className="border-b border-line/70">
                <td className="py-3 pr-4 font-mono text-sm">{f.name}</td>
                <td className="py-3 pr-4 text-muted">{f.type}</td>
                <td className="py-3 text-muted">{f.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </SiteShell>
  );
}
