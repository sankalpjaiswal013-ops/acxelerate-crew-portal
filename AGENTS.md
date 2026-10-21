<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

# Project rules

- Public site pages live as top-level routes (about, how-it-works, positions, rewards, events, safety, faq, contact, legal.*) and share `src/components/site/header.tsx` + `footer.tsx`; the landing page keeps its own `landing/nav.tsx`. Hindi mirrors live under `src/routes/hi/` with `lang="hi"` on the wrapper. Why: one shared chrome for inner pages, hash-anchor nav only on the landing page.
- Points logic lives in `src/lib/points.functions.ts`; `awardPoints` is a plain helper imported by other server modules (e.g. crew shift verification), not an RPC endpoint. Why: server-fn stubs can't be called server-to-server.
- Points and onboarding values (caps, milestones, journey steps) are programme rules — they belong to mem://features/points-and-onboarding, not here.
- Portal surfaces use the shared glass utilities in `src/styles.css` (`glass-shell`, `glass-panel`, `glass-nav`) rather than one-off translucent styles. Why: one consistent glassmorphism system with a no-blur fallback.
- Track A readiness tiers are computed from valid completions in a rolling window (`src/lib/readiness-tiers.ts`, tested); completions are only recorded by staff via `src/lib/referrals.functions.ts`, keyed by the official form's submission ID. Why: no editable tier field and each completion counts once.
