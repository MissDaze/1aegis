import { RELEASE } from "./catalog";

function triggerDownload(href: string, filename: string) {
  const a = document.createElement("a");
  a.href = href;
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export function downloadSampleCsv() {
  triggerDownload(RELEASE.sampleFile, "medication_admin_safety_SAMPLE.csv");
}

export function downloadFullCsv() {
  triggerDownload(RELEASE.file, "medication_admin_safety_full.csv");
}

export function downloadAsset(path: string, filename: string) {
  triggerDownload(path, filename);
}

export function downloadProspectus() {
  const body = `Aegis Atlas ${RELEASE.code}
Synthetic medication administration & near-miss dataset
${RELEASE.events} events · ${RELEASE.facilities} facilities · ${RELEASE.wards} wards · ${RELEASE.vintage} vintage
Incident rate ${RELEASE.incidentRate}% (modelled, not measured)

Prices
- Sample: free (750 rows)
- The file: $29 one-time (personal / teaching / research)
- Commercial: $99 one-time (one legal entity)

100% synthetic. No PHI. Not for clinical use.
`;
  const blob = new Blob([body], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  triggerDownload(url, "aegis-atlas-prospectus.txt");
  URL.revokeObjectURL(url);
}

export function fulfillPurchase(tier: "sample" | "personal" | "commercial") {
  if (tier === "sample") {
    downloadSampleCsv();
    downloadAsset("/data/data_dictionary.md", "data_dictionary.md");
    return;
  }
  downloadFullCsv();
  downloadAsset("/data/data_dictionary.md", "data_dictionary.md");
  downloadAsset("/data/sql_practice_queries.sql", "sql_practice_queries.sql");
  downloadAsset("/data/methodology_bias_limitations.md", "methodology_bias_limitations.md");
}
