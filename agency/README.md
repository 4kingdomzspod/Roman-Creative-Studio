# Agency — Internal Files

This folder contains Roman Creative Studio's internal operating system.
These files are **never deployed** to the public website.

Access requires GitHub collaborator permissions on this repository.

## Structure

```
agency/
  docs/         — Company OS (phases 1–12, all SOPs, playbooks)
  brand/        — Brand guidelines, templates, internal design assets
  templates/    — Invoice, letterhead, proposal templates
  finance/      — Financial models, pricing strategy, cash flow
  hr/           — Hiring, onboarding, succession planning
```

## Security Model

The GitHub Actions deployment workflow (`/.github/workflows/pages.yml`) uses
an explicit allowlist. Only files inside `public/` are copied to the
deployment artifact. Nothing in `agency/` is ever uploaded to GitHub Pages.

The team accesses these files at:
`github.com/4kingdomzspod/roman-creative-studio/tree/main/agency`
