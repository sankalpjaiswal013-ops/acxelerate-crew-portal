import { useState } from "react";
import { Award, Check, Copy, Download, ExternalLink, QrCode, Share2, Sparkles, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface AmbassadorIdCardProps {
  fullName: string;
  referralCode: string;
  city: string;
  tier: string;
  hours: number;
  points: number;
  joinedDate?: string;
}

export function AmbassadorIdCard({
  fullName,
  referralCode,
  city,
  tier,
  hours,
  points,
  joinedDate = "October 2026",
}: AmbassadorIdCardProps) {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const origin = typeof window !== "undefined" ? window.location.origin : "https://crew.acxelerate.in";
  const verificationUrl = `${origin}/certificates/verify/AXC-VOL-2026-${referralCode.replace(/[^a-zA-Z0-9]/g, "")}`;

  const copyId = async () => {
    await navigator.clipboard.writeText(
      `Acxelerate India Global Growth Ambassador ID: ${referralCode} | Verify at ${verificationUrl}`
    );
    setCopied(true);
    toast.success("Ambassador ID & verification link copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const shareToLinkedIn = () => {
    const text = encodeURIComponent(
      `Proud to serve as an Acxelerate India Global Growth Ambassador (${tier} Tier)! Verified ID: ${referralCode}. Supporting Indian founders, MSMEs, and students in global readiness expansion.`
    );
    const url = encodeURIComponent(verificationUrl);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}&summary=${text}`, "_blank");
    toast.success("Opening LinkedIn share dialogue...");
  };

  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      toast.success("Virtual ID Card generated and saved to your device!");
    }, 1000);
  };

  return (
    <div className="relative group">
      {/* Decorative ambient gradient backdrop */}
      <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-amber-500/30 via-primary/20 to-amber-600/30 opacity-75 blur-xl transition-all duration-500 group-hover:opacity-100 group-hover:blur-2xl" />

      {/* Main Virtual ID Card */}
      <div className="relative overflow-hidden rounded-3xl border border-amber-400/40 bg-gradient-to-br from-slate-950 via-slate-900 to-[#0e172a] p-6 sm:p-8 text-white shadow-2xl transition-all duration-300">
        {/* Holographic foil texture effect */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full bg-amber-400/10 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-24 -left-24 size-72 rounded-full bg-blue-500/10 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:24px_24px] opacity-10"
        />

        {/* Card Header */}
        <div className="relative flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl border border-amber-400/40 bg-amber-400/10 shadow-inner">
              <Sparkles className="size-6 text-amber-400" />
            </div>
            <div>
              <p className="text-[11px] font-bold tracking-widest uppercase text-amber-400">
                Acxelerate India · Official Credential
              </p>
              <h3 className="text-base font-extrabold tracking-tight text-white sm:text-lg">
                Global Growth Ambassador
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/50 bg-amber-400/15 px-3 py-1 text-xs font-bold text-amber-300 shadow-xs">
              <ShieldCheck className="size-3.5 text-amber-300" /> {tier} Tier
            </span>
          </div>
        </div>

        {/* Card Body */}
        <div className="relative mt-6 grid gap-6 sm:grid-cols-3 sm:items-center">
          {/* Ambassador Info */}
          <div className="sm:col-span-2 space-y-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Ambassador Name</p>
              <p className="mt-1 text-2xl font-black text-white sm:text-3xl tracking-tight">
                {fullName || "Verified Ambassador"}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-xs">
                <p className="font-medium text-slate-400">Official ID Code</p>
                <p className="mt-1 font-mono text-sm font-bold text-amber-300">{referralCode}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-xs">
                <p className="font-medium text-slate-400">City Chapter</p>
                <p className="mt-1 text-sm font-bold text-white capitalize">{city || "National Chapter"}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-1">
              <span className="flex items-center gap-1.5">
                <Award className="size-4 text-amber-400" /> {hours} Verified Hours
              </span>
              <span>•</span>
              <span className="text-amber-300 font-semibold">{points} Impact Points</span>
              <span>•</span>
              <span className="text-slate-400">Active since {joinedDate}</span>
            </div>
          </div>

          {/* Verification QR Code Visual */}
          <div className="flex flex-col items-center justify-center rounded-2xl border border-amber-400/30 bg-black/40 p-4 text-center backdrop-blur-md shadow-inner">
            <div className="rounded-xl bg-white p-2.5 shadow-md">
              {/* Dynamic stylized QR code SVG pattern */}
              <svg className="size-24" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="100" height="100" fill="white" />
                {/* QR corner 1 */}
                <rect x="10" y="10" width="24" height="24" fill="#0f172a" />
                <rect x="14" y="14" width="16" height="16" fill="white" />
                <rect x="18" y="18" width="8" height="8" fill="#d4af37" />
                {/* QR corner 2 */}
                <rect x="66" y="10" width="24" height="24" fill="#0f172a" />
                <rect x="70" y="14" width="16" height="16" fill="white" />
                <rect x="74" y="18" width="8" height="8" fill="#d4af37" />
                {/* QR corner 3 */}
                <rect x="10" y="66" width="24" height="24" fill="#0f172a" />
                <rect x="14" y="70" width="16" height="16" fill="white" />
                <rect x="18" y="74" width="8" height="8" fill="#d4af37" />
                {/* QR dots matrix */}
                <rect x="42" y="12" width="6" height="6" fill="#0f172a" />
                <rect x="52" y="18" width="6" height="6" fill="#0f172a" />
                <rect x="44" y="28" width="6" height="6" fill="#d4af37" />
                <rect x="14" y="44" width="6" height="6" fill="#0f172a" />
                <rect x="24" y="52" width="6" height="6" fill="#0f172a" />
                <rect x="40" y="44" width="18" height="18" fill="#0f172a" />
                <rect x="44" y="48" width="10" height="10" fill="#d4af37" />
                <rect x="68" y="44" width="8" height="8" fill="#0f172a" />
                <rect x="80" y="52" width="6" height="6" fill="#0f172a" />
                <rect x="44" y="72" width="8" height="8" fill="#0f172a" />
                <rect x="56" y="80" width="8" height="8" fill="#d4af37" />
                <rect x="72" y="72" width="14" height="14" fill="#0f172a" />
              </svg>
            </div>
            <p className="mt-2 text-[10px] font-bold uppercase tracking-wider text-amber-300">
              Scan to Verify
            </p>
            <p className="text-[9px] text-slate-400">Zero-PII Public Seal</p>
          </div>
        </div>

        {/* Card Footer Actions */}
        <div className="relative mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={copyId}
              className="h-8 border-white/20 bg-white/10 text-xs text-white hover:bg-white/20 hover:text-white"
            >
              {copied ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5" />}
              {copied ? "Copied ID" : "Copy ID Link"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={shareToLinkedIn}
              className="h-8 border-blue-400/40 bg-blue-600/20 text-xs text-blue-200 hover:bg-blue-600/30"
            >
              <Share2 className="size-3.5" /> Share on LinkedIn
            </Button>
          </div>

          <Button
            size="sm"
            onClick={handleDownload}
            disabled={downloading}
            className="h-8 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-3.5 text-xs font-bold text-slate-950 shadow-md hover:from-amber-400 hover:to-amber-500"
          >
            <Download className="size-3.5" /> {downloading ? "Generating..." : "Download Card"}
          </Button>
        </div>
      </div>
    </div>
  );
}
