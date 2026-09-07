import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { SITE } from "@/lib/site";
import { Toaster } from "sonner";
import appCss from "../styles.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: `${SITE.product} — ${SITE.brand}` },
      {
        name: "description",
        content:
          "Aegis Atlas is a licensed synthetic medication-administration and near-miss dataset from Nix Nightshade Security. 32,000 events, 2025 vintage, no PHI.",
      },
      { name: "theme-color", content: "#f4f2ec" },
      { property: "og:title", content: `${SITE.product} — ${SITE.brand}` },
      { property: "og:url", content: SITE.origin },
      { property: "og:description", content: "32,000 synthetic medication-administration events. PayPal. No PHI." },
    ],
    links: [
      { rel: "canonical", href: SITE.origin },
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Newsreader:opsz,wght@6..72,400;6..72,500;6..72,600&family=Source+Sans+3:wght@400;500;600&display=swap",
      },
    ],
  }),
  component: () => (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <PreviewHostBridge />
        <AuthProvider>
          <Outlet />
        </AuthProvider>
        <Toaster position="bottom-right" richColors />
        <Scripts />
      </body>
    </html>
  ),
});
