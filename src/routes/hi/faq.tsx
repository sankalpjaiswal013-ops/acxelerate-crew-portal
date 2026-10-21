import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/header";
import { SiteFooter } from "@/components/site/footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/hi/faq")({
  head: () => ({
    meta: [
      { title: "सवाल-जवाब | एक्सेलरेट क्रू — Acxelerate India" },
      {
        name: "description",
        content:
          "एक्सेलरेट क्रू के बारे में सीधे जवाब: यह अवैतनिक है, जुड़ना मुफ़्त है, उम्र 18+, और पॉइंट्स की कोई नकद कीमत नहीं।",
      },
      { property: "og:title", content: "एक्सेलरेट क्रू — सवाल-जवाब" },
      { property: "og:description", content: "क्या यह paid है? क्या मुझे कुछ देना होगा? सीधे जवाब।" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HiFaq,
});

const faqs = [
  { q: "क्या यह paid है?", a: "नहीं। स्वयंसेवी अवैतनिक होते हैं। कार्यक्रम कौशल, प्रमाण, पहुँच, मान-सम्मान और समुदाय देता है — पैसा कभी नहीं।" },
  { q: "क्या मुझे कुछ देना होगा?", a: "नहीं। जुड़ने या आगे बढ़ने के लिए हम कभी शुल्क नहीं लेते।" },
  { q: "क्या रेडीनेस असेसमेंट मुफ़्त है?", a: "ऑनबोर्डिंग असेसमेंट चुनिंदा समूहों के स्वयंसेवियों के लिए मुफ़्त है। पूरा रेडीनेस असेसमेंट प्रतिभागियों के लिए एक अलग paid असेसमेंट है; इसकी कीमत एक्सेलरेट इंडिया अपने आधिकारिक चैनलों पर घोषित करता है।" },
  { q: "क्या मुझे असेसमेंट बेचना होगा?", a: "नहीं। आप लोगों को इसे समझने में मदद करते हैं। आप पैसे नहीं लेते और किसी पर दबाव नहीं डालते।" },
  { q: "उम्र कितनी होनी चाहिए?", a: "अभी के लिए 18 वर्ष या अधिक।" },
  { q: "क्या इससे नौकरी या मार्क्स मिलेंगे?", a: "नहीं। इससे अनुभव, एक सत्यापित रिकॉर्ड और निश्चित माइलस्टोन पर प्रमाणपत्र मिलते हैं। हम नौकरी या मार्क्स का वादा नहीं करते।" },
  { q: "पॉइंट्स की कीमत क्या है?", a: "सिर्फ़ मान्यता। कोई नकद कीमत नहीं, ट्रांसफ़र नहीं, सार्वजनिक रैंकिंग नहीं।" },
  { q: "कितना समय लगेगा?", a: "यह आप पर निर्भर है। कई स्वयंसेवी हफ़्ते में दो-तीन घंटे देते हैं।" },
  { q: "मैं कार्यक्रम कैसे छोड़ूँ?", a: "हमें बताइए और हम आपका खाता बंद कर देंगे।" },
  { q: "फ़ैसले कौन करता है?", a: "सामान्य जाँचें स्वचालित हैं। आपके पद, पॉइंट्स या पहुँच से जुड़े फ़ैसले लोग करते हैं। आप समीक्षा माँग सकते हैं।" },
];

function HiFaq() {
  return (
    <div className="min-h-screen bg-background" lang="hi">
      <SiteHeader hindi />
      <main className="mx-auto max-w-3xl px-4 pb-20 pt-28 sm:px-6">
        <h1 className="text-4xl font-bold">अक्सर पूछे जाने वाले सवाल</h1>
        <Accordion type="single" collapsible className="mt-8">
          {faqs.map((f, i) => (
            <AccordionItem key={f.q} value={`item-${i}`}>
              <AccordionTrigger className="text-left font-semibold">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </main>
      <SiteFooter />
    </div>
  );
}
