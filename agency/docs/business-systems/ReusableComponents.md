# Reusable Components Library

**Owner:** Alexander Roman / Technical Lead  
**Version:** 1.0  
**Last Updated:** 2026-07-01  
**Status:** Designed — Implementation Pending Portal Build

---

## Purpose

Define the reusable UI components for the Roman Creative Studio client portal and internal dashboard. Each component is documented with its purpose, props interface, states, usage context, and accessibility requirements. These components are designed for implementation in Next.js + TypeScript with Tailwind CSS.

---

## Business Value

A component library prevents inconsistent UI, reduces development time by 40-60% on the portal build, and ensures every touchpoint the client sees reflects the quality RCS promises. Components are designed once, used everywhere, and updated in one place.

---

## Design Tokens

All components inherit from the RCS design token system:

```typescript
// tokens.ts
export const tokens = {
  colors: {
    gold: { 400: '#D4AF37', 600: '#C9A84C' },
    charcoal: { 950: '#0C0E11' },
    gray: { 50: '#F8F9FA', 400: '#9CA3AF', 800: '#1F2937' },
    white: '#FFFFFF',
  },
  radius: {
    sm: '4px', md: '8px', lg: '12px', xl: '16px', '2xl': '24px',
  },
  font: {
    sans: 'Inter, sans-serif',
    display: 'Plus Jakarta Sans, sans-serif',
  },
}
```

---

## Component Index

| ID | Component | Category | Portal | Admin |
|----|-----------|----------|--------|-------|
| C-01 | Client Dashboard Card | Data Display | ✓ | ✓ |
| C-02 | Task Card | Task Management | ✓ | ✓ |
| C-03 | Invoice Card | Billing | ✓ | ✓ |
| C-04 | Project Timeline | Progress | ✓ | ✓ |
| C-05 | Status Badge | Labels | ✓ | ✓ |
| C-06 | Progress Bar | Metrics | ✓ | ✓ |
| C-07 | Notification Banner | Feedback | ✓ | ✓ |
| C-08 | Support Ticket | Communication | ✓ | ✓ |
| C-09 | Meeting Summary | Documentation | ✓ | ✓ |
| C-10 | Report Card | Analytics | ✓ | ✓ |
| C-11 | Knowledge Base Card | Content | ✓ | — |
| C-12 | Empty State | UX | ✓ | ✓ |
| C-13 | Loading State | UX | ✓ | ✓ |
| C-14 | Error State | UX | ✓ | ✓ |

---

## C-01 — Client Dashboard Card

**Purpose:** Summary card displayed on the client portal home screen showing project health at a glance.

### Props
```typescript
interface ClientDashboardCardProps {
  projectName: string
  stage: ProjectStage          // 'design' | 'development' | 'review' | 'launch'
  percentComplete: number      // 0-100
  nextMilestone: string
  nextMilestoneDue: Date
  healthStatus: 'on-track' | 'attention' | 'delayed'
  lastUpdated: Date
}
```

### Visual Anatomy
```
┌────────────────────────────────────────┐
│ ● On Track          [Status Badge]     │
│                                        │
│ Smith Dental Rebrand                   │
│ Stage: UI Design                       │
│                                        │
│ [████████████░░░░░░] 68%              │
│                                        │
│ Next: Design Approval   Due Jul 8      │
│ Last updated 2 days ago                │
└────────────────────────────────────────┘
```

### States
- **Default:** Normal project in progress
- **Attention:** Yellow border, amber health badge
- **Delayed:** Red border, red health badge
- **Awaiting Client:** Pulsing indicator on next milestone

### Usage
- Client portal home: one card per active project
- Admin dashboard: grid of all active project cards

### Accessibility
- `role="article"` on card container
- `aria-label={`Project: ${projectName}, ${percentComplete}% complete`}`
- Progress bar uses `role="progressbar"` with `aria-valuenow`, `aria-valuemin`, `aria-valuemax`

---

## C-02 — Task Card

**Purpose:** Individual task item showing task details, ownership, due date, and completion state.

### Props
```typescript
interface TaskCardProps {
  id: string
  title: string
  description?: string
  assignedTo: 'rcs' | 'client'     // who is responsible
  dueDate?: Date
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'pending' | 'in-progress' | 'waiting' | 'complete' | 'blocked'
  projectId: string
  attachments?: number             // count of attached files
  onStatusChange?: (status: TaskStatus) => void
}
```

### Visual Anatomy
```
┌────────────────────────────────────────┐
│ [✓] Upload logo files          [High]  │
│     Assigned to: You   Due: Jul 5      │
│     ↳ 2 attachments                   │
└────────────────────────────────────────┘
```

### States
- **Pending:** Unchecked box, normal opacity
- **In Progress:** Half-filled indicator, accent border
- **Waiting:** Clock icon, muted style (waiting on other party)
- **Blocked:** Red indicator, "Blocked" label visible
- **Complete:** Checkmark, strikethrough text, reduced opacity

### Usage
- Client portal tasks tab: client-facing tasks only
- Admin dashboard task queue: all tasks across all projects
- Project detail view: full task list by stage

### Interactions
- Client can mark their own tasks complete
- RCS tasks are read-only for clients (visible but not editable)
- Clicking opens task detail drawer

---

## C-03 — Invoice Card

**Purpose:** Display a single invoice with payment status, amount, and action button.

### Props
```typescript
interface InvoiceCardProps {
  invoiceNumber: string        // e.g., 'RCS-2026-0042'
  description: string          // e.g., '50% Deposit — Smith Dental Website'
  amount: number               // in cents
  currency: 'USD'
  status: 'draft' | 'sent' | 'viewed' | 'paid' | 'overdue' | 'void'
  dueDate: Date
  paidDate?: Date
  stripeInvoiceUrl?: string    // link to Stripe-hosted invoice
  onPayClick?: () => void
}
```

### Visual Anatomy
```
┌────────────────────────────────────────┐
│ RCS-2026-0042          [UNPAID]        │
│ 50% Deposit — Smith Dental Website     │
│                                        │
│ $1,750.00 USD         Due Jul 10       │
│                                        │
│              [Pay Now →]               │
└────────────────────────────────────────┘
```

### Status Styles
| Status | Badge Color | CTA |
|--------|------------|-----|
| draft | Gray | None |
| sent | Blue | "Pay Now" |
| viewed | Blue | "Pay Now" |
| paid | Green | "Download Receipt" |
| overdue | Red | "Pay Now — Overdue" |
| void | Gray (strikethrough) | None |

### Usage
- Client portal billing tab: list of all invoices
- Admin dashboard: revenue overview, overdue alerts

### Accessibility
- Amount rendered as `<data value="175000">$1,750.00</data>`
- Pay button: `aria-label={`Pay invoice ${invoiceNumber} for $${formattedAmount}`}`

---

## C-04 — Project Timeline

**Purpose:** Visual representation of project stages with completion status and current position.

### Props
```typescript
interface ProjectTimelineProps {
  stages: TimelineStage[]
  currentStageId: string
  showDates?: boolean
}

interface TimelineStage {
  id: string
  label: string
  status: 'complete' | 'active' | 'upcoming' | 'skipped'
  completedDate?: Date
  estimatedDate?: Date
}
```

### Visual Anatomy
```
[✓] Discovery  [✓] Design  [●] Development  [○] Launch
    Jun 15         Jun 28       Active           ~Jul 20
```

### Layout Variants
- **Horizontal:** Default, used on dashboard cards and project overview
- **Vertical:** Used in project detail view with full stage descriptions

### States
- **Complete:** Gold checkmark, solid connector line
- **Active:** Pulsing gold dot, dashed connector to next
- **Upcoming:** Empty circle, muted connector line
- **Skipped:** X mark, strikethrough label

### Usage
- Project detail page (portal): shows full project lifecycle
- Dashboard card (C-01): embedded mini timeline (horizontal, compact)
- Admin project view: full vertical timeline with notes per stage

---

## C-05 — Status Badge

**Purpose:** Small inline label indicating the status of any entity (project, task, invoice, etc.).

### Props
```typescript
interface StatusBadgeProps {
  status: string
  variant: 'project' | 'task' | 'invoice' | 'health' | 'custom'
  size?: 'sm' | 'md'
  dot?: boolean   // show colored dot before label
}
```

### Status → Style Mapping

**Project Status**
| Status | Background | Text | Dot |
|--------|------------|------|-----|
| active | green-50 | green-700 | green |
| on-hold | amber-50 | amber-700 | amber |
| complete | gray-50 | gray-600 | gray |
| cancelled | red-50 | red-700 | red |

**Invoice Status**
| Status | Background | Text |
|--------|------------|------|
| paid | green-50 | green-700 |
| unpaid | blue-50 | blue-700 |
| overdue | red-50 | red-700 |
| draft | gray-50 | gray-600 |

**Health Status**
| Status | Background | Text |
|--------|------------|------|
| on-track | green-50 | green-700 |
| attention | amber-50 | amber-700 |
| delayed | red-50 | red-700 |

### Usage
- Used inline in every card component above
- Used in tables and list views as status indicators
- Used in the navigation to show pending actions count

---

## C-06 — Progress Bar

**Purpose:** Visual percentage indicator for project completion, task completion, or any measured metric.

### Props
```typescript
interface ProgressBarProps {
  value: number           // 0-100
  label?: string          // e.g., "Project Complete"
  showValue?: boolean     // display "68%" text
  variant?: 'default' | 'gold' | 'success' | 'warning' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  animated?: boolean      // animate fill on mount
}
```

### Visual Variants
- **default:** Charcoal track, gold fill
- **success:** Green fill (100% complete)
- **warning:** Amber fill (overdue/at-risk)
- **danger:** Red fill (critical delay)

### Accessibility
```html
<div
  role="progressbar"
  aria-valuenow={value}
  aria-valuemin={0}
  aria-valuemax={100}
  aria-label={label || `${value}% complete`}
>
```

### Usage
- C-01 Dashboard Card: project completion
- Project detail view: overall progress + per-stage progress
- Admin KPI dashboard: metric target progress
- Client portal home: "Your project is X% complete"

---

## C-07 — Notification Banner

**Purpose:** Full-width or card-width alert banner for system messages, action required notices, and status updates.

### Props
```typescript
interface NotificationBannerProps {
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  message?: string
  action?: {
    label: string
    onClick: () => void
  }
  dismissible?: boolean
  onDismiss?: () => void
}
```

### Visual Anatomy
```
┌────────────────────────────────────────┐
│ ⚠ Action Required                      │
│   Your logo files are needed to        │
│   continue. Please upload by Jul 5.    │
│                         [Upload Now]   │
└────────────────────────────────────────┘
```

### Type → Style Mapping
| Type | Icon | Background | Border |
|------|------|------------|--------|
| info | ℹ | blue-50 | blue-200 |
| success | ✓ | green-50 | green-200 |
| warning | ⚠ | amber-50 | amber-200 |
| error | ✕ | red-50 | red-200 |

### Usage
- Portal home: "Action required" banners for pending client tasks
- Admin dashboard: system alerts, overdue payments
- Form submission feedback (inline, non-modal)
- Replaces modal popups for non-critical messages

### Accessibility
- `role="alert"` for `error` and `warning` types (announced by screen readers)
- `role="status"` for `info` and `success` types
- Dismiss button: `aria-label="Dismiss notification"`

---

## C-08 — Support Ticket

**Purpose:** Display a single client support request or question within the portal messaging system.

### Props
```typescript
interface SupportTicketProps {
  id: string
  subject: string
  message: string
  submittedAt: Date
  status: 'open' | 'in-review' | 'resolved' | 'closed'
  priority: 'low' | 'normal' | 'high' | 'urgent'
  responses?: TicketResponse[]
  onReply?: () => void
}

interface TicketResponse {
  author: 'client' | 'rcs'
  message: string
  sentAt: Date
}
```

### Visual Anatomy
```
┌────────────────────────────────────────┐
│ #T-0024  Logo not showing on mobile    │
│ Opened Jul 1              [OPEN]       │
│                                        │
│ "The logo disappears on iPhone..."     │
│                                        │
│ ─ RCS replied Jul 2 ───────────────── │
│ "Hi! We've identified the issue..."    │
│                                        │
│                    [Reply] [Close]     │
└────────────────────────────────────────┘
```

### States
- **Open:** Blue border, open badge
- **In Review:** Gold border, "RCS is reviewing" indicator
- **Resolved:** Green border, resolution visible, "Mark Closed" CTA
- **Closed:** Muted, collapsed by default

### Usage
- Client portal support tab: all tickets for this client
- Admin dashboard: all open tickets queue, sorted by priority

---

## C-09 — Meeting Summary

**Purpose:** Structured record of a discovery call, kickoff meeting, or check-in with decisions, action items, and next steps.

### Props
```typescript
interface MeetingSummaryProps {
  meetingDate: Date
  meetingType: 'discovery' | 'kickoff' | 'check-in' | 'review' | 'training'
  duration: number          // minutes
  attendees: string[]
  summary: string
  decisions: string[]
  actionItems: ActionItem[]
  nextMeeting?: Date
}

interface ActionItem {
  task: string
  assignedTo: 'client' | 'rcs'
  dueDate?: Date
  complete: boolean
}
```

### Visual Anatomy
```
┌────────────────────────────────────────┐
│ Kickoff Meeting — Jun 28, 2026  45min  │
│ Attendees: Alexander, Sarah Smith      │
│                                        │
│ Summary                                │
│ We aligned on brand direction and...  │
│                                        │
│ Decisions Made                         │
│ • Navy and gold color palette confirmed│
│ • Launch target: July 20               │
│                                        │
│ Action Items                           │
│ [✓] You: Send logo files by Jul 2     │
│ [○] RCS: Send wireframes by Jul 5     │
└────────────────────────────────────────┘
```

### Usage
- Client portal project detail: meeting history section
- Admin project management: meeting log
- Post-meeting email: auto-generated from this template

---

## C-10 — Report Card

**Purpose:** Monthly performance report summary for Care Plan clients, showing key metrics.

### Props
```typescript
interface ReportCardProps {
  month: string              // e.g., 'June 2026'
  planType: 'care' | 'seo-retainer' | 'growth-partner'
  metrics: ReportMetric[]
  summary: string
  completedWork: string[]
  nextMonthPlanned: string[]
  downloadUrl?: string
}

interface ReportMetric {
  label: string
  value: string
  change?: number            // +/- percentage from last month
  trend: 'up' | 'down' | 'neutral'
}
```

### Visual Anatomy
```
┌────────────────────────────────────────┐
│ June 2026 Report   SEO Retainer Plan   │
│                                        │
│ Traffic: 1,247 visits    ↑ +18%       │
│ Leads: 14 form submits   ↑ +3         │
│ Ranking: 4.2 avg position ↑ +0.8      │
│                                        │
│ Work Completed                         │
│ • Updated 3 service pages             │
│ • Published 2 blog posts              │
│                                        │
│            [Download Full Report]      │
└────────────────────────────────────────┘
```

### Usage
- Client portal reports tab: monthly report history
- Admin dashboard: sent reports log
- Auto-generated via AI automation (see `AIAutomationFramework.md`)

---

## C-11 — Knowledge Base Card

**Purpose:** Entry in the client-facing knowledge base — a how-to article or guide.

### Props
```typescript
interface KnowledgeBaseCardProps {
  title: string
  description: string
  category: 'getting-started' | 'content' | 'billing' | 'technical' | 'care-plan'
  readTimeMinutes: number
  href: string
  lastUpdated: Date
  popular?: boolean
}
```

### Visual Anatomy
```
┌────────────────────────────────────────┐
│ [Content]                   ★ Popular  │
│ How to Update Your Homepage Text       │
│ Step-by-step guide to editing content  │
│ through your portal.                   │
│                          3 min read →  │
└────────────────────────────────────────┘
```

### Usage
- Client portal help tab: searchable and filterable article grid
- Admin knowledge base: internal SOPs (same component, different content)

---

## C-12 — Empty State

**Purpose:** Displayed when a section has no data yet — prevents blank, confusing screens.

### Props
```typescript
interface EmptyStateProps {
  icon: string              // emoji or icon name
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
    variant: 'primary' | 'secondary'
  }
}
```

### Standard Empty States

| Context | Icon | Title | Description | Action |
|---------|------|-------|-------------|--------|
| No invoices | 📄 | No invoices yet | Your invoices will appear here once your project begins. | — |
| No tasks | ✓ | You're all caught up! | No tasks are waiting for you right now. | — |
| No messages | 💬 | No messages yet | Start a conversation with your project team. | Send Message |
| No documents | 📁 | No documents yet | Project files will appear here when shared. | — |
| No reports | 📊 | No reports yet | Your first monthly report will arrive soon. | — |

### Usage
- Every list/table view in portal and admin that could return zero results
- Prevents the "broken" feeling of an empty page

---

## C-13 — Loading State

**Purpose:** Skeleton placeholder shown while data is being fetched.

### Variants

**Card Skeleton**
```
┌────────────────────────────────────────┐
│ [████████░░░░░░░░░░]  [██░░]          │
│ [████████████████░░░░░░░░░░░░░]       │
│ [████████░░░░░]                       │
└────────────────────────────────────────┘
```

**Table Row Skeleton**
```
[████░░░░]  [████████░░░░░░]  [████░░]  [██░░]
```

**Full Page Skeleton**
- Renders 3-4 card skeletons matching the expected content layout

### Animation
- Shimmer effect: gradient sweeps left-to-right over the skeleton
- CSS animation, no JavaScript required
- `prefers-reduced-motion: reduce` disables animation, uses static muted fill instead

### Props
```typescript
interface LoadingStateProps {
  variant: 'card' | 'table-row' | 'full-page' | 'inline'
  count?: number    // how many skeleton items to show
}
```

### Usage
- Replace every data-fetching component while `isLoading === true`
- Never show a spinner alone — always use a skeleton matching the expected content shape

---

## C-14 — Error State

**Purpose:** User-friendly error display when something fails, with context and recovery options.

### Props
```typescript
interface ErrorStateProps {
  type: 'network' | 'not-found' | 'unauthorized' | 'server' | 'generic'
  title?: string          // overrides default for type
  message?: string        // overrides default for type
  action?: {
    label: string
    onClick: () => void
  }
  showDetails?: boolean   // developer mode: show error code
  errorCode?: string
}
```

### Standard Error Messages

| Type | Title | Message | Action |
|------|-------|---------|--------|
| network | Connection issue | Check your internet and try again. | Retry |
| not-found | Page not found | This page doesn't exist or was moved. | Go Home |
| unauthorized | Access denied | You don't have permission to view this. | Go Back |
| server | Something went wrong | Our team has been notified. Try again shortly. | Retry |
| generic | Something went wrong | An unexpected error occurred. | Retry |

### Usage
- Wrap every async data component in an error boundary
- Never show raw error messages or stack traces to clients
- Log full error details to `audit_log` even when showing friendly message

---

## Component Composition Examples

### Portal Home Screen
```
[NotificationBanner — "Action Required: Logo files needed"]

[ClientDashboardCard]  [ClientDashboardCard]

[ProjectTimeline — horizontal, compact]

Recent Tasks
[TaskCard]  [TaskCard]  [TaskCard]

Recent Invoices
[InvoiceCard]  [InvoiceCard]
```

### Admin Project Detail
```
[StatusBadge] Smith Dental Website — Active

[ProjectTimeline — vertical, full]

[ProgressBar — 68% complete]

Tasks  [TaskCard] [TaskCard] [TaskCard] [TaskCard]

Meeting History  [MeetingSummary] [MeetingSummary]

Invoices  [InvoiceCard] [InvoiceCard]
```

---

## Implementation Notes

### Technology Stack
- Framework: Next.js 14+ with App Router
- Styling: Tailwind CSS with custom design token configuration
- Language: TypeScript (strict mode)
- State: React Server Components where possible; client components for interactions
- Testing: Jest + React Testing Library; one test per component at minimum

### File Structure
```
src/
  components/
    ui/
      StatusBadge.tsx
      ProgressBar.tsx
      NotificationBanner.tsx
      EmptyState.tsx
      LoadingState.tsx
      ErrorState.tsx
    portal/
      ClientDashboardCard.tsx
      TaskCard.tsx
      InvoiceCard.tsx
      ProjectTimeline.tsx
      SupportTicket.tsx
      MeetingSummary.tsx
      ReportCard.tsx
      KnowledgeBaseCard.tsx
```

### Accessibility Requirements
- All interactive elements: keyboard accessible, visible focus ring
- Color is never the sole indicator of status — always paired with text or icon
- WCAG 2.1 AA contrast ratios on all text
- All images have descriptive `alt` attributes
- Screen reader tested with VoiceOver (Mac) and NVDA (Windows)

---

## Future Enhancements

- [ ] Storybook documentation with live component playground
- [ ] Dark mode variants for all components
- [ ] Animation library integration (Framer Motion) for card transitions
- [ ] Mobile-specific variants for all card components
- [ ] Component performance benchmarking (render time, bundle size)
- [ ] Export to Figma via design token sync

---

## Related Documents

- `ClientPortalArchitecture.md` — defines all portal screens these components populate
- `InternalDashboardArchitecture.md` — defines all admin screens
- `KnowledgeBase.md` — design token and coding standards
- `SecurityPrivacy.md` — RLS and auth context passed to components
- `AIAutomationFramework.md` — AI-generated content displayed in ReportCard and MeetingSummary
