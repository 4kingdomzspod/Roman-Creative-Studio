# Communication Standards
# Roman Creative Studio — Team & Leadership Operating System
# Section 12 of 19 | ERD Version 1.0

---

## Purpose

Define the communication standards at Roman Creative Studio — tools, tone, response times, escalation paths, and documentation requirements — so information flows efficiently, professionally, and without noise.

**Business Value:** Poor communication is the #1 cause of project failures, client dissatisfaction, and team friction. These standards prevent ambiguity and create a culture of clarity.

**Owner:** CEO / Operations Manager  
**Version:** 1.0  
**Related Documents:** MeetingStandards.md, KnowledgeBase.md, CommunicationStandards.md

---

## Communication Principles

1. **Written first.** If it matters, write it down. Verbal-only agreements and updates create confusion and are invisible to the rest of the team.
2. **Async first.** Use synchronous communication (calls, live chat) only when async is genuinely insufficient. Most things don't require a call.
3. **Clear subject lines and thread context.** Every message should tell the recipient what it's about in the first line.
4. **Respond, don't ignore.** A "received, will get back to you by [time]" is a valid response. Silence is not.
5. **Escalate appropriately.** Know when a Slack thread needs to become a call, or when a client concern needs CEO involvement.
6. **One channel per topic.** Don't split a conversation across Slack, email, and a Notion comment simultaneously.

---

## Tool Guide

### Slack — Internal Real-Time Communication

**Use Slack for:**
- Quick questions and updates
- Project progress pings
- Brainstorming and short discussions
- Celebrating wins (#wins)
- Sharing resources and links
- Status updates (daily standup)

**Don't use Slack for:**
- Final decisions (document in Notion after)
- Long-form feedback on work (use Figma comments or Google Docs)
- Sensitive HR or financial conversations (use email or direct video call)
- Information that will need to be searched or referenced later (document it in Notion)

**Response time expectations:**
- Core hours (9 AM – 3 PM local time): within 2 hours
- Outside core hours: within 4 hours on next business day
- Urgent/flagged messages: within 30 minutes during core hours

**Channel rules:**
- Use threads for replies on existing topics (don't post in main channel)
- Use @name to notify a specific person; avoid @channel for non-urgent posts
- Set your Slack status when you're in deep work (DND) or away
- Post project updates in the relevant #project channel, not in DMs

---

### Email — External and Formal Communication

**Use email for:**
- All client communication (primary channel)
- Formal documentation (offers, agreements, invoices, policies)
- External vendor and partner communication
- Sensitive HR communications (PIP, offers, terminations)
- Marketing (newsletters via MailerLite)

**Don't use email for:**
- Internal team chatter (use Slack)
- Real-time project coordination (use Slack + PM tool)

**Email standards:**
- Reply to all client emails within **4 business hours** (maximum 24 hours)
- Use a professional signature on all external emails
- Subject line: descriptive and action-oriented (`[Action] Roman Creative Studio — [Topic]`)
- BCC policy: BCC `Alexander@romancreativestudio.co` on all client emails until Stage 3

**Email tone:**
- Professional but warm. Not stiff; not casual.
- Always begin with the recipient's name (`Hi Sarah,`)
- Get to the point in the first sentence
- Close with clear next steps and a call-to-action
- Proofread before sending. No typos in client-facing emails.

**Email templates maintained in:** Notion → Templates → Email Templates

---

### GitHub — Code and Technical Documentation

**Use GitHub for:**
- All code repositories and version control
- Code reviews (pull requests)
- Technical issue tracking (GitHub Issues)
- Deployment and release notes

**GitHub communication standards:**
- PR descriptions must explain WHAT changed and WHY
- Code review comments must be constructive and specific (`"This could cause a performance issue on large lists — consider pagination"` not `"this is bad"`)
- Approved comments with a simple `+1` or `LGTM` require no additional thread
- Blocking issues must be clearly marked `[BLOCKING]` in PR comments
- Merge only after approval from at least 1 reviewer (Stage 3+)

**Commit message standard:**
```
[type]: brief description in present tense

Types: feat | fix | docs | style | refactor | test | chore

Examples:
feat: add Stripe payment integration to checkout flow
fix: resolve mobile nav overlay z-index issue
docs: update API authentication documentation
```

---

### Notion — Documentation and Project Management

**Use Notion for:**
- All long-form documentation (processes, SOPs, guides)
- Project briefs, timelines, and status
- Meeting notes and decision logs
- Client project documentation
- Team knowledge base
- Performance review records

**Don't use Notion for:**
- Real-time chat or quick questions (use Slack)
- Code (use GitHub)
- Email drafting or client communication (use Gmail)

**Notion communication standards:**
- Every page has an owner and last-updated date
- Use `[TODO]`, `[REVIEW]`, `[DONE]` tags for in-progress documentation
- Comments in Notion are for documentation feedback, not team chat
- Archive, don't delete, outdated pages
- Use page templates consistently (every process doc has: Purpose, Steps, Owner, Version)

---

### Client Communication Standards

#### Tone
- Warm, professional, and confident
- Speak in plain language. Avoid agency jargon unless the client uses it first.
- Don't say "ASAP" or "URGENT" to clients unless it truly is
- Never promise what you haven't confirmed with the team

#### Proactive Updates
- Clients should never have to ask "what's the status?" for more than 5 business days
- Send a project update at each milestone, and if no milestone in 1 week, send a brief async update
- Format: `[Project Name] Update — [Date]` as email subject

#### Bad News
- Deliver delays, scope changes, and problems to clients proactively and as early as possible
- Frame: `"Here's what happened, here's what we're doing about it, here's the new timeline."`
- Never hide a problem hoping it resolves itself
- Always bring a solution when you bring a problem

#### Client Expectations
- Set deadlines in writing; confirm client understands their role in meeting them
- Remind clients of content submission deadlines 5 business days in advance
- If client delays cause project delays, document it and adjust the timeline in writing

---

## Decision Log Standard

Every significant decision made at RCS — in a meeting, via Slack, or async — must be logged.

**Log format (in Notion → Decision Log):**
```
Date: 2026-07-01
Decision: Changed homepage design direction to dark-mode-first at client request
Context: Client saw competitor site using dark mode and preferred it after design review call
Made by: Alexander Roman + Client (Sarah Chen)
Impact: Design timeline extended 3 days. Budget unchanged.
Documented by: Alexander Roman
```

**When to log a decision:**
- Changes to project scope, timeline, or budget
- Tool adoption or removal decisions
- Hiring decisions
- Pricing changes
- Client relationship decisions (e.g., accept late payment plan, extend support period)
- Any decision that would be confusing to a team member who wasn't in the room

---

## Internal Discussion Standards

### Feedback Delivery (SBI Model)

All feedback at RCS uses the SBI framework:

```
Situation: Specific context (not general)
  "In the client presentation on Tuesday..."

Behavior: Observable action (not personality)
  "...you presented the mobile version without showing the desktop first,"

Impact: Effect on project or team
  "...which confused the client and required 20 extra minutes of explanation."
```

**Never:**
- "You always do this..." (generalization)
- "You're not a team player" (personality attack)
- "Everyone thinks..." (triangulating)

### Disagreement Resolution

1. Raise disagreement in the conversation where it happens (don't take it to a side channel)
2. State your position with reasoning: "I think we should do X because Y"
3. Ask for the other person's reasoning: "Help me understand why you prefer Z"
4. If unresolved: escalate to manager / CEO with both perspectives documented
5. Once a decision is made, commit to it — even if you disagreed

---

*Document: CommunicationStandards.md | Phase 10 Section 12 | Version 1.0 | 2026-07-01*
