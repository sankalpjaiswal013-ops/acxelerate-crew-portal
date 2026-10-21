import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/header";
import { SiteFooter } from "@/components/site/footer";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/hi/how-it-works")({
  head: () => ({
    meta: [
      { title: "यह कैसे काम करता है | एक्सेलरेट क्रू — Acxelerate India" },
      {
        name: "description",
        content:
          "आवेदन से सक्रिय स्वयंसेवी तक छह क़दम: आवेदन, निःशुल्क ऑनबोर्डिंग असेसमेंट, ओरिएंटेशन, स्वयंसेवी समझौता, 30-दिन की शुरुआती अवधि, सक्रिय।",
      },
      { property: "og:title", content: "एक्सेलरेट क्रू कैसे काम करता है" },
      { property: "og:description", content: "आवेदन से सक्रिय स्वयंसेवी तक छह ईमानदार क़दम।" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HiHowItWorks,
});

const steps = [
  { title: "आवेदन करें", body: "अपने बारे में बताइए — शहर, रुचि, समय। पाँच मिनट लगते हैं।" },
  { title: "निःशुल्क ऑनबोर्डिंग असेसमेंट", body: "चुनिंदा समूहों के स्वयंसेवियों के लिए एक छोटा, मुफ़्त असेसमेंट। इसे पूरा करना किसी पद या paid अवसर की गारंटी नहीं है।" },
  { title: "ओरिएंटेशन", body: "नियम, भूमिका और चीज़ों को ईमानदारी से समझाने का तरीका सीखें।" },
  { title: "स्वयंसेवी समझौता स्वीकारें", body: "आचरण, डेटा और नो-पेमेंट नियम। इसी बिंदु पर आपकी स्वयंसेवी आईडी बनती है।" },
  { title: "30-दिन की शुरुआती अवधि", body: "एक सत्यापित योगदान करें: किसी दोस्त को जोड़ने में मदद, किसी कार्यक्रम में सहयोग, या किसी को असेसमेंट पूरा करने में मदद।" },
  { title: "सक्रिय स्वयंसेवी", body: "कार्यक्रमों में भूमिका बुक करें, दूसरों को आमंत्रित करें, मान्यता अर्जित करें।" },
];

function HiHowItWorks() {
  return (
    <div className="min-h-screen bg-background" lang="hi">
      <SiteHeader hindi />
      <main className="mx-auto max-w-3xl px-4 pb-20 pt-28 sm:px-6">
        <h1 className="text-4xl font-bold">यह कैसे काम करता है</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          आवेदन से सक्रिय स्वयंसेवी तक छह क़दम। हम क़दम 1 से 5 एक हफ़्ते में पूरे
          करने का लक्ष्य रखते हैं।
        </p>
        <ol className="mt-10 space-y-6">
          {steps.map((s, i) => (
            <li
              key={s.title}
              className="flex gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm"
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                {i + 1}
              </span>
              <div>
                <h2 className="text-lg font-bold">{s.title}</h2>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {s.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
        <div className="mt-10">
          <Button asChild size="lg">
            <a href="/#apply">आवेदन करें</a>
          </Button>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
