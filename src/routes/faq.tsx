import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/header";
import { SiteFooter } from "@/components/site/footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ | Acxelerate Crew — Acxelerate India" },
      {
        name: "description",
        content:
          "Honest answers about Acxelerate Crew: it's unpaid, free to join, 18+, and points are recognition with no cash value.",
      },
      { property: "og:title", content: "Acxelerate Crew FAQ" },
      {
        property: "og:description",
        content:
          "Is it paid? Do I pay anything? What are points worth? Straight answers.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
    ],
  }),
  component: FaqPage,
});

const faqs = [
  {
    q: "Is this paid?",
    a: "No. Volunteers are unpaid and are not employees or sales agents. The programme pays in skills, proof, access, status, agency and belonging — never money.",
  },
  {
    q: "Do I have to pay anything?",
    a: "No. We never charge volunteers to join or to move up.",
  },
  {
    q: "Is the Readiness Assessment free?",
    a: "The onboarding assessment is free for volunteers in selected groups. The full Readiness Assessment is a separate paid assessment for participants; its price is announced by Acxelerate India on its official channels. Volunteers earn it free at the Lead tier — buying it earns no status or privilege.",
  },
  {
    q: "Am I expected to sell the assessment?",
    a: "No. You help people understand it. You do not collect money or pressure anyone.",
  },
  {
    q: "How old do I have to be?",
    a: "18 or older for now.",
  },
  {
    q: "Does this give me a job or marks?",
    a: "No. It gives you experience, a verified record and certificates at defined milestones. We make no promise of jobs or marks.",
  },
  {
    q: "What are points worth?",
    a: "Recognition only. No cash value, no transfer between people, no public ranking.",
  },
  {
    q: "How do tiers and positions work?",
    a: "Tiers (Crew, Lead, Fellow) are earned through verified hours. Positions (Community Ambassador, Readiness Ambassador, Campus or Community Lead) are reviewed and approved by people. Meeting the numbers makes you eligible; it does not guarantee a position.",
  },
  {
    q: "How much time does it take?",
    a: "It depends on you. Many volunteers give two to three hours a week; event assignments need separate acceptance.",
  },
  {
    q: "What happens to my data?",
    a: "See the privacy notice. We collect what we need to run the programme, and you can ask to see or delete it.",
  },
  {
    q: "How do I leave?",
    a: "Tell us and we will close your account.",
  },
  {
    q: "How are decisions made?",
    a: "Routine checks are automatic. People decide anything that affects your position, points or access. You can ask for a review.",
  },
];

function FaqPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 pb-20 pt-28 sm:px-6">
        <h1 className="text-4xl font-bold">Frequently Asked Questions</h1>
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
