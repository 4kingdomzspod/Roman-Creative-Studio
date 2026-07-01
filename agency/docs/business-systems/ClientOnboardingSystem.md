# Client Onboarding System
## Roman Creative Studio — Agency Operating System

**Owner:** Founder
**Version:** 1.0
**Last Updated:** 2026-06-30
**Related Documents:** CRMArchitecture.md, ProjectManagementFramework.md, DocumentManagement.md

---

## Purpose

Define a repeatable, premium onboarding experience for every new Roman Creative Studio client — from contract signing to the first day of active design work. First impressions after the sale determine retention, referrals, and the client's willingness to respect the process.

## Business Value

A structured onboarding system reduces project delays caused by missing assets, sets clear expectations that prevent scope creep, establishes the founder's authority, and creates the foundation for a long-term relationship.

---

## Onboarding Philosophy

> "The project starts when the deposit lands. The relationship starts when the welcome email lands."

The goal of onboarding is to:
1. Make the client feel they made the right decision
2. Establish clear expectations upfront (timeline, communication, revision process)
3. Collect everything needed before design begins
4. Minimize back-and-forth during the active project phase

---

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

## Step 1: Contract Signed + Deposit Received

**Trigger:** E-signature platform marks contract as fully signed AND Stripe deposit confirmed.

**Actions:**
- CRM: Stage → Client
- PM Tool: Create project record (name, tier, target launch date)
- Stripe: Mark deposit invoice as paid; create milestone 2 invoice (draft)
- Notify founder: New client alert
- Trigger: Welcome email (Step 2)

---

## Step 2: Welcome Email

**Sent:** Within 30 minutes of deposit confirmation (automated).

**Template:**

```
Subject: Welcome to Roman Creative Studio — here's what happens next, [First Name]

[First Name],

Welcome aboard! I'm genuinely excited to work on this with you.

Your project is officially underway. Here's what the next few days look like:

📁 Today: You'll receive access to your shared project folder
📝 This week: I'll send a brand questionnaire and content checklist
📞 Days 5-7: We'll hold our kickoff meeting to align on strategy before design begins

A few things to know:
• Our primary communication channel is email. Expect replies within 1 business day.
• Design revisions are structured in rounds — more details in your project folder.
• Your project timeline depends on how quickly we receive your assets and approvals.

Your project portal is being set up. You'll receive a link shortly.

I'll be in touch within 24 hours with your shared folder access and the brand questionnaire.

Let's build something great,
Alexander
Roman Creative Studio
Alexander@romancreativestudio.co
```

---

## Step 3: Shared Folder Setup

**Sent:** Within 24 hours of deposit.

**Folder Structure:**
```
[ClientName]-[ProjectTier]-[Year]/
├── 01-Brand-Assets/
│   ├── Logos/
│   ├── Fonts/
│   ├── Colors/
│   └── Photography/
├── 02-Content/
│   ├── Copy-Drafts/
│   ├── Copy-Approved/
│   └── Images/
├── 03-Design/
│   ├── Wireframes/
│   ├── Mockups-v1/
│   ├── Mockups-Approved/
│   └── Final-Exports/
├── 04-Development/
│   ├── Staging-Link.txt
│   └── Launch-Checklist.md
├── 05-Contracts-Invoices/
│   ├── Contract-Signed.pdf
│   └── Invoices/
└── 06-Meeting-Notes/
```

**Access:** Client gets Viewer + Commenter access. RCS retains Editor access.
**Platform:** Google Drive (current) or Notion (future portal integration)

---

## Step 4: Brand Questionnaire

**Sent:** Day 1 (same email as shared folder access)

**Purpose:** Collect brand identity inputs before design begins. Prevents "I'll know it when I see it" design feedback.

```
ROMANCREATIVESTUDIO.CO — BRAND QUESTIONNAIRE

Project: [Client Name]

BRAND IDENTITY
1. In 3 words, describe the feeling your brand should evoke.
   (Examples: trustworthy, energetic, premium, approachable)

2. What are your brand colors? (Provide hex codes if possible, or describe.)

3. Do you have existing brand guidelines? Please upload them to your brand folder.

4. Do you have a logo? If yes, please upload all versions (PNG, SVG) to your brand folder.
   If no, note that logo design is out of scope unless agreed in your contract.

5. What fonts or typography styles do you prefer?
   (Examples: clean and modern, elegant serif, bold and energetic)

AUDIENCE & MESSAGING
6. Describe your ideal client in as much detail as possible.
   (Age, profession, pain points, what they search for, what they care about)

7. What is the single most important thing a visitor should understand within
   5 seconds of landing on your homepage?

8. List your top 3 differentiators — why should someone choose you over a competitor?

9. Do you have any client testimonials or reviews? Please paste them here or
   share links (Google, Yelp, etc.).

10. List any awards, certifications, affiliations, or trust signals we should feature.

COMPETITOR REFERENCE
11. Share 2-3 competitor websites you respect. What do you like about them?

12. Share 2-3 websites outside your industry that you find inspiring. What do you like?

13. Are there any website styles you dislike? (Describe or share examples.)

CONTENT
14. Will you be providing your own website copy, or would you like RCS to write it?
    [ ] I will provide copy
    [ ] I want RCS to write it (note: copywriting scope should be in your contract)
    [ ] Mix — I'll provide a draft, RCS will refine

15. Do you have professional photography? If yes, upload to the brand folder.
    If no, do you have a budget for stock photography?

TECHNICAL
16. What is your current hosting provider (if any)?

17. Who manages your domain? (GoDaddy, Namecheap, etc.)

18. Are there any third-party tools your website must integrate with?
    (Examples: booking system, CRM, payment processor, email marketing)

19. Do you have any legal requirements for your website?
    (Examples: HIPAA notice, accessibility compliance, specific disclaimers)

FINAL QUESTION
20. Is there anything important about your business, your clients, or your 
    goals that we haven't asked about yet?
```

---

## Step 5: Content Collection

**Sent:** Day 3

**Purpose:** Gather all written and visual content before design begins. Content gaps are the #1 cause of project delays.

**Content Collection Checklist (sent to client):**

```
CONTENT COLLECTION CHECKLIST
Project: [Client Name]
Deadline: [Date — typically 7 days before design begins]

PLEASE UPLOAD TO: [Google Drive Folder Link]

HOMEPAGE
[ ] Hero headline + sub-headline (or approve RCS draft)
[ ] Hero image or video
[ ] Your story / about section (2-3 paragraphs)
[ ] Services overview descriptions
[ ] 3-5 client testimonials (name, title, quote)
[ ] Trust logos (awards, certifications, partners)

SERVICES PAGES (one per service)
[ ] Service name and description
[ ] Service benefits (bullet list)
[ ] Pricing (or "starting at" price)
[ ] FAQ for this service (3-5 questions)

ABOUT PAGE
[ ] Founder bio or team bios
[ ] Headshot photo(s) — professional quality
[ ] Company history or founding story
[ ] Mission statement or values

CONTACT PAGE
[ ] Business address (or specify "remote-only")
[ ] Phone number (if displayed publicly)
[ ] Business hours
[ ] Social media profile links

ADDITIONAL
[ ] Any existing blog posts to migrate
[ ] Privacy Policy (or confirm RCS template is acceptable)
[ ] Terms of Service (or confirm RCS template is acceptable)
[ ] Any legal disclaimers required for your industry
```

---

## Step 6: Hosting Information

**Requested:** During kickoff meeting or via pre-kickoff email.

**Information Needed:**
```
HOSTING & TECHNICAL ACCESS FORM

1. Current hosting provider and login credentials:
   (To be shared via secure method — do NOT send via email)

2. Domain registrar and login credentials:
   (Same as above — secure sharing only)

3. SSL certificate: Managed by host? [ ] Yes  [ ] No  [ ] Unknown

4. Email hosting provider:

5. Any DNS records to preserve (MX, SPF, DKIM):

6. Analytics accounts to retain access to (Google Analytics, etc.):

7. Any existing third-party scripts to preserve:

Secure credential sharing: Use 1Password link, LastPass Share, or equivalent.
Do NOT email passwords in plain text.
```

---

## Step 7: Kickoff Meeting

**Held:** Days 5-7 after deposit.

**Duration:** 60 minutes

**Agenda:**
```
KICKOFF MEETING AGENDA
Client: [Name]
Date: [Date]
Attendees: [Names]

1. Introduction & relationship building (5 min)
2. Project goals review — confirm alignment from discovery call (10 min)
3. Review brand questionnaire responses together (10 min)
4. Review content collection checklist — what's ready, what's outstanding (10 min)
5. Review project timeline and milestones (5 min)
6. Communication expectations (5 min)
   - Primary channel: email
   - Response time: 1 business day
   - Revision process: 2 rounds per milestone
   - Approval process: written (email) approval required
7. Q&A (10 min)
8. Next steps: wireframes begin [date] (5 min)
```

---

## Step 8: Approval Process Documentation

**Shared in the project folder and reviewed during kickoff.**

```
APPROVAL PROCESS
Roman Creative Studio — Project Standards

ROUNDS OF REVISIONS
Your project includes [X] rounds of revisions at each stage (design and development).
A revision round is a single consolidated batch of feedback — not individual items
shared over multiple emails.

HOW TO SUBMIT FEEDBACK
• Compile all feedback into a single email or shared document
• Reference specific pages and elements clearly
• Separate "must change" from "nice to have"
• We use your feedback to revise, then send a new version for your review

WHAT COUNTS AS A REVISION VS. A SCOPE CHANGE
Revision: Changes within the agreed scope (copy edits, color adjustments, layout tweaks)
Scope Change: New pages, new features, new integrations not in the original contract
Scope changes are quoted separately and may extend the timeline.

APPROVAL TO PROCEED
Written approval (email is fine) is required to move from each stage to the next:
• Approve wireframes → design begins
• Approve designs → development begins + Milestone 2 invoice sent
• Approve staging site → launch → final invoice sent

REVISION EXPIRATION
Revision rounds must be used within 30 days of delivery. Unused revisions do not
carry over to future work.
```

---

## Step 9: Communication Expectations

```
COMMUNICATION STANDARDS

OUR COMMITMENT TO YOU:
• Email replies within 1 business day (Monday–Friday, 9am–6pm EST)
• Weekly project status update every Friday
• Proactive notice if timeline shifts
• No surprise invoices or scope changes without your approval

WHAT WE NEED FROM YOU:
• Designate one primary point of contact for feedback and approvals
• Consolidate feedback from all stakeholders before submitting a revision round
• Reply to approval requests within 3 business days to maintain the project timeline
• Share all assets and content by the agreed content deadline

TIMELINE IMPACT:
Project timelines are based on timely approvals and asset delivery. 
Delays on the client side extend the timeline accordingly.
We will always communicate this clearly and adjust together.
```

---

## Onboarding Completion Checklist

Before active design begins, verify all boxes are checked:

```
ONBOARDING COMPLETION CHECKLIST

CONTRACT & PAYMENT
[ ] Contract fully signed (both parties)
[ ] 50% deposit received and confirmed
[ ] Stripe invoice marked paid

COMMUNICATION
[ ] Welcome email sent
[ ] Primary client contact identified and confirmed

SHARED WORKSPACE
[ ] Project folder created with correct structure
[ ] Client has access to their folder

INFORMATION COLLECTION
[ ] Brand questionnaire submitted by client
[ ] Content collection checklist sent
[ ] Content deadline agreed and calendared
[ ] Hosting and domain information received (secure)

KICKOFF
[ ] Kickoff meeting held
[ ] Meeting notes documented and shared
[ ] Approval process reviewed with client
[ ] Communication expectations confirmed

PROJECT SETUP
[ ] Project record created in PM tool
[ ] Milestones created with target dates
[ ] Milestone 2 invoice in draft
[ ] Milestone 3 invoice in draft

ACTIVE DESIGN IS CLEARED TO BEGIN
```

---

## Technical Notes

- All credentials received from clients must be stored in a password manager (1Password or Bitwarden) — never in email or plain text files
- Content collection deadline should be set as a hard dependency in the PM tool — if it slips, the launch date slips
- All documents (contract, approval history, meeting notes) must be preserved for a minimum of 3 years

## Future Enhancements

- Fully automated onboarding sequence triggered by Stripe webhook on deposit
- Interactive onboarding portal within the Client Portal
- AI pre-population of project records from brand questionnaire responses
- Client onboarding NPS survey at kickoff completion to catch early friction
