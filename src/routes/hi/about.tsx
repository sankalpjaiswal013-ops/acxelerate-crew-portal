import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/header";
import { SiteFooter } from "@/components/site/footer";

export const Route = createFileRoute("/hi/about")({
  head: () => ({
    meta: [
      { title: "कार्यक्रम के बारे में | एक्सेलरेट क्रू — Acxelerate India" },
      {
        name: "description",
        content:
          "एक्सेलरेट क्रू स्वयंसेवी कार्यक्रम क्यों है, स्वयंसेवी क्या करते हैं, और हम इसे निष्पक्ष और सुरक्षित कैसे रखते हैं।",
      },
      { property: "og:title", content: "एक्सेलरेट क्रू के बारे में" },
      { property: "og:description", content: "कार्यक्रम का उद्देश्य, काम और नियम।" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HiAbout,
});

function HiAbout() {
  return (
    <div className="min-h-screen bg-background" lang="hi">
      <SiteHeader hindi />
      <main className="mx-auto max-w-3xl px-4 pb-20 pt-28 sm:px-6">
        <h1 className="text-4xl font-bold">कार्यक्रम के बारे में</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          एक्सेलरेट क्रू — ग्लोबल ग्रोथ एंबेसडर समुदाय — एक्सेलरेट इंडिया का
          स्वयंसेवी कार्यक्रम है।
        </p>

        <section className="mt-10">
          <h2 className="text-2xl font-bold">हम क्यों हैं</h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            जब तक किसी शहर में पर्याप्त तैयार, प्रशिक्षित स्वयंसेवी न हों, वहाँ
            कार्यक्रम नहीं चल सकते। यह कार्यक्रम उन्हीं स्वयंसेवियों को खोजने,
            प्रशिक्षित करने और सहयोग देने के लिए है — और उन्हें एक स्पष्ट रास्ता
            और अपने काम का निष्पक्ष रिकॉर्ड देने के लिए।
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-bold">स्वयंसेवी क्या करते हैं</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 leading-relaxed text-muted-foreground">
            <li>नए स्वयंसेवियों का स्वागत करते हैं और शुरुआत में मदद करते हैं।</li>
            <li>ग्लोबल रेडीनेस असेसमेंट को ईमानदारी से समझाते हैं — बिना दबाव, बिना पैसे।</li>
            <li>असली कार्यक्रमों में सहयोग करते हैं: रजिस्ट्रेशन, मार्गदर्शन, व्यवस्था।</li>
            <li>सत्यापित घंटों और समीक्षाओं से आगे बढ़ते हैं।</li>
          </ul>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-bold">निष्पक्ष और सुरक्षित कैसे</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 leading-relaxed text-muted-foreground">
            <li>स्वयंसेवी अवैतनिक हैं; कर्मचारी या बिक्री एजेंट नहीं।</li>
            <li>जुड़ने या आगे बढ़ने के लिए कभी भुगतान नहीं।</li>
            <li>उम्र 18 वर्ष या अधिक।</li>
            <li>मान्यता सत्यापित काम से मिलती है — खरीदी नहीं जा सकती।</li>
          </ul>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
