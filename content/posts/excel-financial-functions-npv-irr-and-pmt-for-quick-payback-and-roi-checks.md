---
title: "Excel Financial Functions: NPV, IRR, and PMT for Quick Payback and ROI Checks"
date: "2026-09-19"
tags: ["excel", "finance", "formulas"]
excerpt: "Three built-in Excel functions that answer 'is this investment worth it?' without building a full discounted cash flow model from scratch."
---

A data analyst gets asked "is this project worth funding?" almost as often as "what happened last quarter?" — and the honest answer usually needs more than a simple payback-period subtraction. Excel has three financial functions built for exactly this that most analysts never open outside of a finance team's template.

**1. `NPV` discounts a stream of future cash flows back to today's dollars.** A dollar promised in year three is worth less than a dollar in hand now, and NPV bakes that discount rate in so you're comparing like with like instead of just adding up raw numbers.
```excel
=NPV(0.08, B2:B6) + B1
```
The `0.08` is your discount rate (often your company's cost of capital), and `B2:B6` holds the projected cash flows for years 1 through 5. The initial outlay in `B1` gets added separately, outside the discounting, because it happens at time zero.

**2. A positive NPV means the project clears your hurdle rate — a negative one means it doesn't.** That's the whole decision rule: NPV > 0 creates value at the discount rate you chose, NPV < 0 destroys it. The number itself (say, $42,000) is the estimated value created in today's dollars, which is also a more honest way to rank competing projects than comparing raw multi-year totals.

**3. `IRR` flips the question around and solves for the discount rate itself.** Instead of assuming a rate and checking if NPV is positive, IRR asks "at what rate does this investment exactly break even?" — useful when a stakeholder wants a single percentage to compare against a target, like "we only fund projects above 15% IRR."
```excel
=IRR(B1:B6)
```
Here the initial outlay is included in the same range as a negative number, since IRR needs the full cash flow sequence, outflow and all, in one array.

**4. `PMT` answers the loan and lease side of the same question: what's the payment?** Given a rate, a number of periods, and a present value, PMT returns the fixed periodic payment — the same math behind a car loan or an equipment lease your finance team is trying to model.
```excel
=PMT(0.05/12, 36, -20000)
```
This example is a 5% annual rate loan (divided by 12 for monthly), paid over 36 months, on $20,000 borrowed today. The result comes back negative by convention, representing money paid out — wrap it in `-PMT(...)` if you'd rather see it as a positive number in a report.

**5. Keep your rate and your period in the same units.** The single most common mistake with all three functions is mixing an annual rate with monthly cash flows, or vice versa. If your cash flows in `NPV` or `IRR` are monthly figures, your rate needs to be a monthly rate too — divide an annual discount rate by 12 before plugging it in, the same way `PMT` divides its rate in the example above.

**6. Sanity-check IRR against NPV at your actual hurdle rate before presenting either one.** IRR can occasionally return more than one mathematically valid answer when cash flows switch sign more than once (a project with a big cost spike midway through, say), which makes the single percentage misleading on its own. Pairing it with an NPV calculated at your real discount rate catches that case before it reaches a slide.

None of these replace a proper finance team's model for a genuinely large capital decision, but for the everyday "should we buy this software" or "does this automation project pay for itself" question, they turn a gut-feel estimate into a number you can actually defend in the meeting.
