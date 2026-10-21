import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/landing/nav";
import { Hero } from "@/components/landing/hero";
import {
  BenefitTypes,
  HowSection,
  OpportunitiesPreview,
  ProgramSection,
  WhoSection,
  WhySection,
} from "@/components/landing/sections";
import { ApplyForm } from "@/components/landing/apply-form";
import { Faq, Footer } from "@/components/landing/faq";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Acxelerate Crew — Serve. Grow. Show. | Acxelerate India" },
      {
        name: "description",
        content:
          "Acxelerate Crew is Acxelerate India's volunteer programme for students, professionals and delegates. Serve at events, grow through feedback and the readiness assessment, and show verified proof that employers and universities trust.",
      },
      {
        property: "og:title",
        content: "Acxelerate Crew — Serve. Grow. Show.",
      },
      {
        property: "og:description",
        content:
          "A volunteer programme that pays in skills, proof, access, status, agency and belonging. Verified hours unlock tiers: Crew, Lead, Fellow.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <main>
        <Hero />
        <ProgramSection />
        <OpportunitiesPreview />
        <WhoSection />
        <WhySection />
        <BenefitTypes />
        <HowSection />
        <ApplyForm />
        <Faq />
      </main>
      <Footer />
    </div>
  );
}
