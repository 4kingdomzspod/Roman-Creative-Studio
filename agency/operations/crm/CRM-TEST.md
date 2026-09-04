# RCS CRM — End-to-End Acceptance Test

Run this once in the actual Google Sheet after installing `Code.gs`. Use a clearly fake test business such as `RCS CRM TEST — DELETE ME` so it cannot be confused with a real prospect.

## Test sequence

1. **Prospects:** add the test business and contact. Confirm a Prospect ID and Created Date appear automatically.
2. **Website Audits:** add the Prospect ID, business, website, scores, and one key problem.
3. **Outreach Pipeline:** add the Prospect ID, business, contact, channel, and message. Change Status to `Sent`. Confirm Date Sent and Next Action Date populate.
4. **Follow Ups:** confirm an open follow-up is automatically created. Confirm it appears on Dashboard/Today when due.
5. **Follow Up completion:** change the follow-up to `Completed`. Confirm Completed Date populates and an Activity Log row appears.
6. **Meetings:** add a meeting for the test prospect. Change Status to `Completed`. Confirm Activity Log receives a meeting event.
7. **Proposals:** add a proposal amount/package. Change Status to `Sent`. Confirm Sent Date and Next Follow-Up Date populate.
8. **Acceptance:** change proposal Status to `Accepted`. Confirm Decision Date populates, the prospect becomes `Won`, and exactly one Client is created.
9. **Revenue:** add a Revenue row for the test client and mark Status `Paid`. Confirm the Dashboard Revenue Collected increases by the payment amount.
10. **Cleanup:** delete all test rows from every operational sheet after the test passes. Do not delete the headers or Dashboard formulas.

## Pass criteria

The complete chain works without manually copying data more than necessary:

`Prospect → Audit → Outreach → Follow-Up → Meeting → Proposal → Accepted → Client → Revenue → Dashboard`

If all ten steps pass, freeze the CRM for the 90-day journey. Only make later changes for real bugs, data-loss prevention, or direct selling/revenue friction.
