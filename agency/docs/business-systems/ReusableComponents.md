# Reusable Components Library

**Owner:** Alexander Roman / Technical Lead
**Version:** 1.0
**Last Updated:** 2026-07-01
**Status:** Designed — Implementation Pending Portal Build

---

## Purpose

Define the reusable UI components for the Roman Creative Studio client portal and internal dashboard. Each component is documented with its purpose, props interface, states, usage context, and accessibility requirements. Designed for implementation in Next.js + TypeScript with Tailwind CSS.

## Business Value

A component library reduces development time by 40-60% on the portal build and ensures every client touchpoint reflects the quality RCS promises.

---

## Design Tokens

```typescript
export const tokens = {
  colors: {
    gold: { 400: '#D4AF37', 600: '#C9A84C' },
    charcoal: { 950: '#0C0E11' },
    gray: { 50: '#F8F9FA', 400: '#9CA3AF', 800: '#1F2937' },
    white: '#FFFFFF',
  },
  radius: { sm: '4px', md: '8px', lg: '12px', xl: '16px', '2xl': '24px' },
  font: { sans: 'Inter, sans-serif', display: 'Plus Jakarta Sans, sans-serif' },
}
```

---

## Component Index

| ID | Component | Portal | Admin |
|----|-----------|--------|-------|
| C-01 | Client Dashboard Card | ✓ | ✓ |
| C-02 | Task Card | ✓ | ✓ |
| C-03 | Invoice Card | ✓ | ✓ |
| C-04 | Project Timeline | ✓ | ✓ |
| C-05 | Status Badge | ✓ | ✓ |
| C-06 | Progress Bar | ✓ | ✓ |
| C-07 | Notification Banner | ✓ | ✓ |
| C-08 | Support Ticket | ✓ | ✓ |
| C-09 | Meeting Summary | ✓ | ✓ |
| C-10 | Report Card | ✓ | ✓ |
| C-11 | Knowledge Base Card | ✓ | — |
| C-12 | Empty State | ✓ | ✓ |
| C-13 | Loading State | ✓ | ✓ |
| C-14 | Error State | ✓ | ✓ |

---

## C-01 — Client Dashboard Card

```typescript
interface ClientDashboardCardProps {
  projectName: string
  stage: ProjectStage
  percentComplete: number      // 0-100
  nextMilestone: string
  nextMilestoneDue: Date
  healthStatus: 'on-track' | 'attention' | 'delayed'
  lastUpdated: Date
}
```

**States:** Default, Attention (yellow border + badge), Delayed (red border + badge), Awaiting Client (pulsing indicator)
**Accessibility:** `role="article"`, `aria-label="Project: {name}, {n}% complete"`, progress bar uses `role="progressbar"` with `aria-valuenow/min/max`

## C-02 — Task Card

```typescript
interface TaskCardProps {
  id: string; title: string; description?: string
  assignedTo: 'rcs' | 'client'
  dueDate?: Date
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'pending' | 'in-progress' | 'waiting' | 'complete' | 'blocked'
  projectId: string; attachments?: number
  onStatusChange?: (status: TaskStatus) => void
}
```

**States:** Pending (unchecked), In Progress (accent border), Waiting (clock icon, muted), Blocked (red indicator), Complete (checkmark, strikethrough, reduced opacity)
**Interactions:** Client marks own tasks complete; RCS tasks read-only for clients

## C-03 — Invoice Card

```typescript
interface InvoiceCardProps {
  invoiceNumber: string; description: string; amount: number; currency: 'USD'
  status: 'draft' | 'sent' | 'viewed' | 'paid' | 'overdue' | 'void'
  dueDate: Date; paidDate?: Date; stripeInvoiceUrl?: string
  onPayClick?: () => void
}
```

| Status | Badge | CTA |
|--------|-------|-----|
| paid | Green | Download Receipt |
| sent/viewed | Blue | Pay Now |
| overdue | Red | Pay Now — Overdue |
| draft/void | Gray | None |

## C-04 — Project Timeline

```typescript
interface TimelineStage {
  id: string; label: string
  status: 'complete' | 'active' | 'upcoming' | 'skipped'
  completedDate?: Date; estimatedDate?: Date
}
```

**Layouts:** Horizontal (default, dashboard) or Vertical (project detail)
**States:** Complete (gold checkmark), Active (pulsing gold dot), Upcoming (empty circle), Skipped (X mark)

## C-05 — Status Badge

| Status | Background | Text |
|--------|------------|------|
| on-track | green-50 | green-700 |
| attention | amber-50 | amber-700 |
| delayed / cancelled | red-50 | red-700 |
| paid | green-50 | green-700 |
| overdue | red-50 | red-700 |

## C-06 — Progress Bar

```typescript
interface ProgressBarProps {
  value: number; label?: string; showValue?: boolean
  variant?: 'default' | 'gold' | 'success' | 'warning' | 'danger'
  size?: 'sm' | 'md' | 'lg'; animated?: boolean
}
```

**Accessibility:** `role="progressbar"` with `aria-valuenow/min/max` and `aria-label`

## C-07 — Notification Banner

```typescript
interface NotificationBannerProps {
  type: 'info' | 'success' | 'warning' | 'error'
  title: string; message?: string
  action?: { label: string; onClick: () => void }
  dismissible?: boolean; onDismiss?: () => void
}
```

**Accessibility:** `role="alert"` for error/warning; `role="status"` for info/success

## C-08 — Support Ticket

```typescript
interface SupportTicketProps {
  id: string; subject: string; message: string; submittedAt: Date
  status: 'open' | 'in-review' | 'resolved' | 'closed'
  priority: 'low' | 'normal' | 'high' | 'urgent'
  responses?: TicketResponse[]; onReply?: () => void
}
```

**States:** Open (blue), In Review (gold), Resolved (green + "Mark Closed" CTA), Closed (muted, collapsed)

## C-09 — Meeting Summary

```typescript
interface MeetingSummaryProps {
  meetingDate: Date; meetingType: 'discovery' | 'kickoff' | 'check-in' | 'review' | 'training'
  duration: number; attendees: string[]
  summary: string; decisions: string[]; actionItems: ActionItem[]; nextMeeting?: Date
}
interface ActionItem { task: string; assignedTo: 'client' | 'rcs'; dueDate?: Date; complete: boolean }
```

## C-10 — Report Card

```typescript
interface ReportCardProps {
  month: string; planType: 'care' | 'seo-retainer' | 'growth-partner'
  metrics: ReportMetric[]; summary: string
  completedWork: string[]; nextMonthPlanned: string[]; downloadUrl?: string
}
interface ReportMetric { label: string; value: string; change?: number; trend: 'up' | 'down' | 'neutral' }
```

## C-12 — Empty State

| Context | Title | Action |
|---------|-------|--------|
| No invoices | No invoices yet | — |
| No tasks | You're all caught up! | — |
| No messages | No messages yet | Send Message |
| No documents | No documents yet | — |
| No reports | No reports yet | — |

## C-13 — Loading State

**Variants:** Card skeleton, Table row skeleton, Full page skeleton (3-4 card skeletons)
**Animation:** Shimmer effect (gradient sweeps left-to-right); `prefers-reduced-motion` disables animation, uses static muted fill

## C-14 — Error State

| Type | Title | Message | Action |
|------|-------|---------|--------|
| network | Connection issue | Check your internet and try again. | Retry |
| not-found | Page not found | This page doesn't exist or was moved. | Go Home |
| unauthorized | Access denied | You don't have permission. | Go Back |
| server | Something went wrong | Our team has been notified. | Retry |

---

## Implementation Notes

**Tech Stack:** Next.js 14+ (App Router), Tailwind CSS, TypeScript (strict)

**File Structure:**
```
src/components/
  ui/ (StatusBadge, ProgressBar, NotificationBanner, EmptyState, LoadingState, ErrorState)
  portal/ (ClientDashboardCard, TaskCard, InvoiceCard, ProjectTimeline,
           SupportTicket, MeetingSummary, ReportCard, KnowledgeBaseCard)
```

**Accessibility Requirements:**
- All interactive elements: keyboard accessible, visible focus ring
- Color is never the sole indicator of status — always paired with text or icon
- WCAG 2.1 AA contrast ratios on all text
- Screen reader tested with VoiceOver (Mac) and NVDA (Windows)

**Related Documents:** ClientPortalArchitecture.md, InternalDashboardArchitecture.md, SecurityPrivacy.md
