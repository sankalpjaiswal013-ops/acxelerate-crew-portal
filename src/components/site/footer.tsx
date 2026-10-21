import logo from "@/assets/acxelerate-logo.png.asset.json";

const legalLinks = [
  { href: "/legal/privacy", label: "Privacy notice" },
  { href: "/legal/volunteer-terms", label: "Volunteer terms" },
  { href: "/legal/terms", label: "Terms of use" },
  { href: "/legal/accessibility", label: "Accessibility" },
  { href: "/legal/grievance", label: "Grievance officer" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-muted py-12">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:px-6 md:grid-cols-3">
        <div>
          <img
            src={logo.url}
            alt="Acxelerate India — Cross boundaries and raise standards"
            className="h-11 w-auto"
          />
          <p className="mt-3 max-w-sm text-sm text-muted-foreground">
            Acxelerate Crew — the Global Growth Ambassador community. Serve.
            Grow. Show.
          </p>
          <p className="mt-3 max-w-sm text-xs font-semibold text-muted-foreground">
            Volunteers are unpaid. The programme never charges volunteers to
            join or to move up.
          </p>
        </div>
        <nav className="flex flex-col gap-2 text-sm">
          <p className="font-semibold">Programme</p>
          <a href="/about" className="text-muted-foreground transition-colors hover:text-foreground">About</a>
          <a href="/how-it-works" className="text-muted-foreground transition-colors hover:text-foreground">How it works</a>
          <a href="/positions" className="text-muted-foreground transition-colors hover:text-foreground">Positions</a>
          <a href="/events" className="text-muted-foreground transition-colors hover:text-foreground">Events</a>
          <a href="/contact" className="text-muted-foreground transition-colors hover:text-foreground">Contact</a>
          <a href="/auth" className="text-muted-foreground transition-colors hover:text-foreground">Volunteer login</a>
        </nav>
        <nav className="flex flex-col gap-2 text-sm">
          <p className="font-semibold">Legal</p>
          {legalLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
