import logo from "@/assets/acxelerate-logo.png.asset.json";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "Do I need to pay to join?",
    a: "No. Acxelerate Crew is free to join and free to serve in. The programme pays no money — it pays in skills, proof, access, status, agency and belonging.",
  },
  {
    q: "Do I need prior experience?",
    a: "No. Curiosity, reliability and a willingness to learn are a good starting point. Some roles may require additional training or experience.",
  },
  {
    q: "Will I receive a certificate?",
    a: "Certificates can be issued for defined milestones or completed activities under the program's published rules. Submitting an application alone does not guarantee a certificate.",
  },
  {
    q: "Can I earn money?",
    a: "No. The programme pays no money. What you earn is verified proof: hours, ratings, endorsements, badges, tier progress and — at Lead — a free full readiness assessment. The assessment can also be bought for ₹499, but buying earns no status or privilege.",
  },
  {
    q: "Will my achievement be posted on social media?",
    a: "Only with your explicit, separate approval for the specific post and the information to be shared. You can participate without public social-media recognition.",
  },
  {
    q: "What happens after I apply?",
    a: "You receive a reference ID on screen when your application is submitted. The team reviews your application and shares the decision and onboarding instructions on your volunteer dashboard.",
  },
  {
    q: "How do tiers and milestones work?",
    a: "Everyone starts as an Applicant. Your first verified shift makes you Crew. Lead needs 30 verified hours across at least three events and two role types, plus leading a crew of four or more once with a good rating. Fellow is selective — 20 to 30 seats a year. Milestones at 5, 10, 20, 50 and 75 hours add certificates, briefings and coaching along the way.",
  },
  {
    q: "How are my hours verified?",
    a: "A team lead approves hours within seven days of each event, and no more than ten hours a day count. Verified hours build your Passport and your tier.",
  },
  {
    q: "Do I earn anything for bringing a friend?",
    a: "When a friend you refer completes their first shift, you earn programme credit — never cash. The credit scheme is non-monetary by design.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="scroll-mt-20 py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <p className="text-sm font-bold uppercase tracking-widest text-primary">
          FAQ
        </p>
        <h2 className="mt-2 text-3xl font-bold sm:text-4xl">
          Frequently Asked Questions
        </h2>
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
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted py-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 sm:px-6 md:flex-row md:items-start md:justify-between">
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
        </div>
        <nav className="flex flex-col gap-2 text-sm">
          <a
            href="https://acxelerateindia.com/"
            target="_blank"
            rel="noreferrer"
            className="font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Main website
          </a>
          <a
            href="#apply"
            className="font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Apply now
          </a>
          <a
            href="/auth"
            className="font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Volunteer login
          </a>
          <a
            href="/legal/privacy"
            className="font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Privacy notice
          </a>
          <a
            href="/legal/volunteer-terms"
            className="font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Volunteer terms
          </a>
          <a
            href="/legal/grievance"
            className="font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Grievance officer
          </a>
        </nav>
      </div>
    </footer>
  );
}
