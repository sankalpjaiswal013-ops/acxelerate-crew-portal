import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/header";
import { SiteFooter } from "@/components/site/footer";
import { Button } from "@/components/ui/button";
import { Users, BookOpenCheck, CalendarCheck } from "lucide-react";

export const Route = createFileRoute("/hi/")({
  head: () => ({
    meta: [
      { title: "एक्सेलरेट क्रू — स्वयंसेवी कार्यक्रम | Acxelerate India" },
      {
        name: "description",
        content:
          "एक्सेलरेट इंडिया का स्वयंसेवी कार्यक्रम — सीखिए, मदद कीजिए और अपने काम का प्रमाणित रिकॉर्ड बनाइए। बिना फ़ीस, बिना वेतन, 18 वर्ष या उससे अधिक।",
      },
      { property: "og:title", content: "एक्सेलरेट क्रू — स्वयंसेवी कार्यक्रम" },
      {
        property: "og:description",
        content:
          "अपने शहर को अगले क़दम के लिए तैयार करने में मदद कीजिए। आवेदन में पाँच मिनट लगते हैं।",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HiHome,
});

const cards = [
  {
    icon: Users,
    title: "नए स्वयंसेवियों का स्वागत करें",
    body: "दोस्तों को आमंत्रित करें, सवालों के जवाब दें और उन्हें शुरुआत करने में मदद करें।",
  },
  {
    icon: BookOpenCheck,
    title: "रेडीनेस असेसमेंट समझाएँ",
    body: "लोगों को इसे समझने और पूरा करने में ईमानदारी से और बिना दबाव के मदद करें।",
  },
  {
    icon: CalendarCheck,
    title: "असली कार्यक्रमों में सहयोग करें",
    body: "किसी कार्यक्रम में अपनी भूमिका बुक करें, जैसे सीट चुनते हैं, और टीम का हिस्सा बनें।",
  },
];

function HiHome() {
  return (
    <div className="min-h-screen bg-background" lang="hi">
      <SiteHeader hindi />
      <main>
        <section className="mx-auto max-w-3xl px-4 pb-16 pt-32 text-center sm:px-6">
          <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl">
            अपने शहर को अगले क़दम के लिए तैयार करने में मदद कीजिए।
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            एक्सेलरेट क्रू — ग्लोबल ग्रोथ एंबेसडर समुदाय — उन लोगों के लिए एक
            स्वयंसेवी कार्यक्रम है जो दूसरों को अपने लक्ष्य की ओर पहला क़दम
            बढ़ाने में मदद करना चाहते हैं। आप सीखते हैं, मदद करते हैं और अपने
            काम का प्रमाणित रिकॉर्ड बनाते हैं।
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <a href="/#apply">आवेदन करें</a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href="/hi/how-it-works">यह कैसे काम करता है</a>
            </Button>
          </div>
        </section>

        <section className="bg-tint py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="text-3xl font-bold">आप क्या करेंगे</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {cards.map((c) => (
                <div
                  key={c.title}
                  className="rounded-2xl border border-border bg-card p-6 shadow-sm"
                >
                  <span className="flex size-11 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
                    <c.icon className="size-5" />
                  </span>
                  <h3 className="mt-4 text-lg font-bold">{c.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {c.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <h2 className="text-3xl font-bold">सुरक्षित और निष्पक्ष</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 leading-relaxed text-muted-foreground">
              <li>स्वयंसेवी अवैतनिक होते हैं। जुड़ने या आगे बढ़ने के लिए हम कभी पैसे नहीं माँगते।</li>
              <li>आवेदकों की उम्र 18 वर्ष या उससे अधिक होनी चाहिए।</li>
              <li>आपसे जुड़े फ़ैसले असली लोग करते हैं, और आप समीक्षा माँग सकते हैं।</li>
            </ul>
            <p className="mt-6 text-sm text-muted-foreground">
              हम कुछ चुनिंदा कैंपसों में एक पायलट से शुरुआत कर रहे हैं। जो हम
              सीखेंगे, उसके आधार पर चीज़ें बदलेंगी।
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
