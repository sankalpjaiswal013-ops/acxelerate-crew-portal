import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/acxelerate-logo.png.asset.json";

const links = [
  { href: "/about", label: "About" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/positions", label: "Positions" },
  { href: "/rewards", label: "Rewards" },
  { href: "/events", label: "Events" },
  { href: "/faq", label: "FAQ" },
];

export function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors ${
        scrolled
          ? "border-b border-border/80 bg-background/95 backdrop-blur-md shadow-xs"
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-4 sm:px-6">
        <a href="/" className="flex items-center">
          <img
            src="/acxelerate-logo.png"
            alt="Acxelerate India — Cross boundaries and raise standards"
            className="h-11 sm:h-12 w-auto object-contain"
          />
        </a>

        <nav className="hidden items-center gap-6 lg:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
            >
              {l.label}
            </a>
          ))}
          <a
            href="/hi"
            className="rounded-full border border-slate-300 bg-white/60 px-3 py-1 text-xs font-semibold text-slate-700 shadow-2xs transition-colors hover:bg-white hover:text-slate-900"
          >
            हिंदी
          </a>
          <a
            href="/auth"
            className="text-sm font-medium text-slate-700 transition-colors hover:text-slate-900"
          >
            Volunteer Login
          </a>
          <Button
            asChild
            size="sm"
            className="rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-xs hover:bg-primary/90"
          >
            <a href="#apply">Apply Now</a>
          </Button>
        </nav>

        <button
          className="lg:hidden text-slate-700"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-border bg-background px-4 py-4 lg:hidden">
          <div className="flex flex-col gap-3">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-sm font-medium text-muted-foreground"
              >
                {l.label}
              </a>
            ))}
            <a href="/hi" className="text-sm font-medium text-muted-foreground">
              हिंदी
            </a>
            <Button asChild variant="ghost" size="sm" className="w-fit">
              <a href="/auth">Volunteer Login</a>
            </Button>
            <Button asChild size="sm" className="w-fit">
              <a href="#apply" onClick={() => setOpen(false)}>
                Apply Now
              </a>
            </Button>
          </div>
        </nav>
      )}
    </header>
  );
}
