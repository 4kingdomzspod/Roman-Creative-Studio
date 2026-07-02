# Client Onboarding System
## Roman Creative Studio — Agency Operating System

**Owner:** Founder
**Version:** 1.0
**Last Updated:** 2026-06-30
**Related Documents:** CRMArchitecture.md, ProjectManagementFramework.md, DocumentManagement.md

---

## Purpose

Define a repeatable, premium onboarding experience for every new Roman Creative Studio client — from contract signing to the first day of active design work.

## Onboarding Timeline Overview

```
Day 0    — Contract signed + deposit received
Day 0    — Welcome email sent (automated)
Day 1    — Shared folder created + access shared
Day 1    — Brand questionnaire sent
Day 2    — Kickoff meeting scheduled
Day 3    — Content collection form sent
Day 5-7  — Kickoff meeting held
Day 8+   — Active design begins (once assets collected)
```

---

## Step 1: Contract + Deposit

**Trigger:** E-signature fully signed AND Stripe deposit confirmed.
**Actions:** CRM stage → Client; PM project created; Stripe M2/M3 invoices drafted; founder notified; welcome email triggered.

## Step 2: Welcome Email Template

```
Subject: Welcome to Roman Creative Studio — here's what happens next, [First Name]

[First Name],

Welcome aboard! Your project is officially underway.

📁 Today: Shared project folder access
📝 This week: Brand questionnaire + content checklist
📞 Days 5-7: Kickoff meeting to align on strategy

• Primary communication: email. Replies within 1 business day.
• Design revisions are structured in rounds.
• Timeline depends on timely asset delivery and approvals.

Alexander
Roman Creative Studio
Alexander@romancreativestudio.co
```

## Step 3: Shared Folder Structure

```
[ClientName]-[ProjectTier]-[Year]/
├── 01-Brand-Assets/ (Logos, Fonts, Colors, Photography)
├── 02-Content/ (Copy-Drafts, Copy-Approved, Images)
├── 03-Design/ (Wireframes, Mockups-v1, Mockups-Approved, Final-Exports)
├── 04-Development/ (Staging-Link.txt, Launch-Checklist.md)
├── 05-Contracts-Invoices/
└── 06-Meeting-Notes/
```

**Access:** Client gets Viewer + Commenter. RCS retains Editor.

## Step 4: Brand Questionnaire (20 Questions)

Covers: Brand identity (3 words, colors, existing guidelines, logo, fonts); Audience & messaging (ideal client, 5-second message, differentiators, testimonials, trust signals); Competitor reference (3 sites you respect, 3 inspiring sites, styles you dislike); Content (who writes copy, do you have photos); Technical (current hosting, domain registrar, integrations, legal requirements); Final open question.

## Step 5: Content Collection Checklist

Required by agreed deadline for: Homepage (hero, story, services overview, testimonials, trust logos); Services pages (name, description, benefits, pricing, FAQs); About page (bio, headshot, story, mission); Contact page (address, phone, hours, social links); Additional (blog posts, Privacy Policy, Terms, disclaimers).

## Step 6: Hosting Access Form

Collects: Current hosting credentials (secure sharing only — no email), domain registrar credentials, SSL status, email hosting provider, DNS records to preserve, analytics accounts, third-party scripts.

## Step 7: Kickoff Meeting (60 min)

Agenda: Intro (5 min) → Project goals review (10 min) → Brand questionnaire review (10 min) → Content checklist review (10 min) → Timeline and milestones (5 min) → Communication expectations (5 min) → Q&A (10 min) → Next steps (5 min)

## Step 8: Approval Process Documentation

- Revision rounds: consolidated batch per round (not incremental emails)
- Written approval (email) required to move from each stage to next
- Revisions vs. scope change: changes within agreed scope vs. new pages/features
- Revision rounds expire 30 days after delivery

## Step 9: Communication Expectations

RCS commitments: email replies within 1 business day; weekly project status update every Friday; proactive notice if timeline shifts; no surprise invoices.

Client commitments: designate one primary contact; consolidate feedback before submitting; reply to approvals within 3 business days; deliver content by agreed deadline.

## Onboarding Completion Checklist

```
CONTRACT & PAYMENT
[ ] Contract fully signed | [ ] 50% deposit received | [ ] Stripe invoice marked paid

COMMUNICATION
[ ] Welcome email sent | [ ] Primary client contact identified

SHARED WORKSPACE
[ ] Project folder created | [ ] Client has access

INFORMATION COLLECTION
[ ] Brand questionnaire submitted | [ ] Content checklist sent
[ ] Content deadline agreed | [ ] Hosting info received (secure)

KICKOFF
[ ] Kickoff meeting held | [ ] Notes documented and shared
[ ] Approval process reviewed | [ ] Communication expectations confirmed

PROJECT SETUP
[ ] Project record in PM tool | [ ] Milestones with target dates
[ ] M2 invoice draft | [ ] M3 invoice draft

ACTIVE DESIGN IS CLEARED TO BEGIN
```
