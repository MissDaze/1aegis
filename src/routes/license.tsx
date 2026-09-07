import { useEffect, useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Check, Copy, Download } from "lucide-react";
import { toast } from "sonner";
import { SiteShell } from "@/components/layout/site-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { COMMERCIAL_TIER, FEATURED_TIER, RELEASE, TIERS } from "@/lib/data/catalog";
import { downloadFullCsv, fulfillPurchase } from "@/lib/data/export";
import {
  PAYPAL_BUSINESS,
  isEmail,
  paypalCheckoutAction,
  stashPending,
  takePending,
} from "@/lib/license/paypal";
import { isPaidTier, tierName, useLicenses, type TierId } from "@/lib/license/store";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

type LicenseSearch = {
  tier?: string;
  paid?: boolean;
};

export const Route = createFileRoute("/license")({
  validateSearch: (s: Record<string, unknown>): LicenseSearch => ({
    tier: typeof s.tier === "string" ? s.tier : undefined,
    paid: s.paid === "1" || s.paid === true || s.paid === "true",
  }),
  component: LicensePage,
});

function parseTier(v: string | undefined): TierId {
  if (v === "sample" || v === "commercial" || v === "personal") return v;
  return "personal";
}

function LicensePage() {
  const search = Route.useSearch();
  const addLicense = useLicenses((s) => s.addLicense);
  const licenses = useLicenses((s) => s.licenses);

  const [tier, setTier] = useState<TierId>(parseTier(search.tier));
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [org, setOrg] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const selected = TIERS.find((t) => t.id === tier) ?? FEATURED_TIER;
  const latest = licenses[0];

  useEffect(() => {
    setTier(parseTier(search.tier));
  }, [search.tier]);

  useEffect(() => {
    if (!search.paid) return;
    const pending = takePending();
    if (!pending) return;
    const issued = addLicense({
      org: pending.org,
      contact: pending.contact,
      email: pending.email,
      tier: pending.tier,
    });
    fulfillPurchase(pending.tier);
    toast.success(`Paid. Files downloading. ${issued.key}`);
  }, [search.paid, addLicense]);

  function onSample(e: FormEvent) {
    e.preventDefault();
    const issued = addLicense({
      org: "Independent",
      contact: contact.trim() || "Sample user",
      email: email.trim() || "sample@local",
      tier: "sample",
    });
    fulfillPurchase("sample");
    toast.success(`Sample pack downloaded. ${issued.key}`);
  }

  function onPaypalSubmit(e: FormEvent<HTMLFormElement>) {
    if (tier === "sample") {
      e.preventDefault();
      return;
    }
    if (!isEmail(email)) {
      e.preventDefault();
      setError("Enter the email we should attach the files to.");
      return;
    }
    setError("");
    stashPending({
      tier: tier === "commercial" ? "commercial" : "personal",
      email: email.trim(),
      contact: contact.trim() || email.trim(),
      org: org.trim() || (tier === "commercial" ? "One company" : "Independent"),
    });
  }

  const returnUrl =
    typeof window === "undefined"
      ? ""
      : `${window.location.origin}/license?tier=${tier}&paid=1`;
  const cancelUrl =
    typeof window === "undefined" ? "" : `${window.location.origin}/license?tier=${tier}`;

  return (
    <SiteShell>
      <section className="border-b border-line">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <Badge>Buy</Badge>
          <h1 className="mt-4 max-w-3xl font-display text-4xl sm:text-5xl">
            Thirty-two thousand events. {FEATURED_TIER.price}. PayPal. Once.
          </h1>
          <p className="mt-4 max-w-xl text-muted">
            Sample is free. The file is {FEATURED_TIER.price}. Commercial is {COMMERCIAL_TIER.price}.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_22rem]">
        <div>
          <div className="grid gap-3 sm:grid-cols-3">
            {TIERS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTier(t.id)}
                className={cn(
                  "rounded-xl border p-4 text-left",
                  tier === t.id ? "border-accent bg-accent-soft" : "border-line bg-elevated",
                )}
              >
                <p className="font-mono text-2xs uppercase tracking-label text-subtle">
                  {t.name}
                  {t.featured ? " · Most bought" : ""}
                </p>
                <p className="mt-2 font-display text-3xl">{t.price}</p>
                <p className="mt-1 text-sm text-muted">
                  {t.cadence} · {t.size}
                </p>
                <ul className="mt-3 space-y-1 text-sm text-muted">
                  {t.includes.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </button>
            ))}
          </div>

          {tier === "sample" ? (
            <form onSubmit={onSample} className="mt-8 space-y-4 rounded-xl border border-line bg-elevated p-5">
              <h2 className="font-display text-2xl">Get the sample</h2>
              <div>
                <Label htmlFor="email">Email (optional)</Label>
                <Input id="email" className="mt-1" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <Button type="submit">Download sample pack</Button>
            </form>
          ) : (
            <form
              className="mt-8 space-y-4 rounded-xl border border-line bg-elevated p-5"
              action={paypalCheckoutAction()}
              method="post"
              onSubmit={onPaypalSubmit}
            >
              <h2 className="font-display text-2xl">Pay {selected.price} with PayPal</h2>
              <input type="hidden" name="cmd" value="_xclick" />
              <input type="hidden" name="business" value={PAYPAL_BUSINESS} />
              <input type="hidden" name="charset" value="utf-8" />
              <input type="hidden" name="currency_code" value="USD" />
              <input type="hidden" name="amount" value={selected.amount.toFixed(2)} />
              <input
                type="hidden"
                name="item_name"
                value={`${SITE.product} ${RELEASE.code} — ${selected.name}`}
              />
              <input type="hidden" name="item_number" value={selected.id} />
              <input type="hidden" name="no_shipping" value="1" />
              <input type="hidden" name="no_note" value="1" />
              <input type="hidden" name="rm" value="2" />
              <input type="hidden" name="return" value={returnUrl} />
              <input type="hidden" name="cancel_return" value={cancelUrl} />
              <div>
                <Label htmlFor="contact">Your name</Label>
                <Input id="contact" className="mt-1" value={contact} onChange={(e) => setContact(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="org">Organisation</Label>
                <Input id="org" className="mt-1" value={org} onChange={(e) => setOrg(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="email">Email for the files</Label>
                <Input
                  id="email"
                  required
                  type="email"
                  className="mt-1"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              {error ? <p className="text-sm text-danger">{error}</p> : null}
              <Button type="submit">Pay {selected.price} with PayPal</Button>
            </form>
          )}

          {latest && isPaidTier(latest.tier) ? (
            <div className="mt-8 rounded-xl border border-accent bg-accent-soft p-5">
              <p className="font-mono text-2xs uppercase tracking-label text-accent">Receipt</p>
              <h2 className="mt-2 font-display text-2xl">{tierName(latest.tier)} · {latest.key}</h2>
              <p className="mt-2 text-sm text-muted">{latest.email}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button onClick={() => downloadFullCsv()}>
                  <Download />
                  Full 32k CSV
                </Button>
                <Button
                  variant="outline"
                  onClick={async () => {
                    await navigator.clipboard.writeText(latest.key);
                    setCopied(true);
                    toast.success("License key copied");
                  }}
                >
                  {copied ? <Check /> : <Copy />}
                  Copy key
                </Button>
              </div>
            </div>
          ) : null}
        </div>

        <aside>
          <div className="rounded-xl border border-line p-5">
            <h2 className="font-display text-2xl">What you can do with it</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted">
              <li>Personal: teach, research, portfolio, local tools.</li>
              <li>Commercial: ship it inside one company's product.</li>
              <li>Do not resell the raw CSV as your own dataset.</li>
              <li>Not for clinical decision-making.</li>
            </ul>
          </div>
        </aside>
      </section>
    </SiteShell>
  );
}
