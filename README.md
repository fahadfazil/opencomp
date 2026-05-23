<div align="center">

<img src="docs/banner.png" alt="OpenComp" width="100%" />

# OpenComp

### Open-source workplace intelligence for India

Anonymous, community-owned salary data and company culture insights — built for Indian tech professionals who are tired of negotiating in the dark.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen?style=flat-square)](CONTRIBUTING.md)
[![Built with React](https://img.shields.io/badge/Built%20with-React-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![Powered by Supabase](https://img.shields.io/badge/Powered%20by-Supabase-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com)

[Live Demo](https://opencomp.onrender.com) · [Submit Your Data](https://opencomp.onrender.com/contribute) · [Report an Issue](https://github.com/fahadfazil/opencomp/issues)

</div>

---

## The Problem

Salary negotiation in India is broken. Job postings hide compensation. Candidates lowball themselves. Employers exploit information asymmetry. Platforms like Glassdoor exist, but they're US-centric, paywalled, and increasingly unreliable.

OpenComp fixes this by putting the data in the hands of the community — free, forever.

---

## What You Get

<table>
<tr>
<td width="50%">

### 💰 Salary Intelligence
Real compensation data — base, variable, and equity — broken down by company, role, city, and years of experience. No estimates. No scraping. Verified community submissions.

</td>
<td width="50%">

### 🏢 Company Intelligence
Deep dives on India's top employers. Culture ratings, work-life balance scores, anonymous reviews, and salary distribution — all in one place.

</td>
</tr>
<tr>
<td width="50%">

### 🗺️ City Intelligence
Compare tech hubs across affordability, commute quality, and livability. Bangalore vs Hyderabad vs Pune — see where your salary actually goes further.

</td>
<td width="50%">

### 📊 OpenComp Score
A 0–100 benchmarking score that shows exactly where your CTC stands in your peer group — same role, same city, same experience band. Know your worth.

</td>
</tr>
</table>

---

## How the OpenComp Score Works

Your score is calculated using z-score normalization against a peer group filtered by city, role, and experience (±2 years):

```
score = clamp(50 + (z × 15), 0, 100)
where z = (your_salary − peer_mean) / peer_stddev
```

| Score | What it means |
|-------|--------------|
| < 40 | Below market — time to renegotiate |
| 40–60 | At market rate |
| 60–75 | Above average for your peer group |
| 75–90 | Top quartile |
| 90+ | Exceptional / outlier |

---

## Privacy, By Design

We built the privacy model before writing a single line of UI.

- **No individual data is ever displayed.** Every stat shown is aggregated across a minimum of 5 anonymous submissions.
- **Zero PII collected.** The contribution flow asks for no name, no email, no phone, no LinkedIn.
- **Auth exists only to prevent spam** — not to link your identity to your submission. The connection is severed immediately after verification.
- **No ads. No data sales. No dark patterns.** Ever.
- **Open source.** You can read every line of code that handles your data.

---

## Roadmap

- [x] Salary data — company, role, city, experience
- [x] Culture ratings and anonymous reviews
- [x] City affordability and commute intelligence
- [x] OpenComp Score benchmarking engine
- [x] Anonymous contribution flow
- [ ] Interview experience database
- [ ] Offer letter verification (community-powered)
- [ ] Salary trend alerts — get notified when market moves
- [ ] Public API for researchers and journalists
- [ ] Mobile app

---

## Contributing

OpenComp is only as good as its data. The most valuable contribution you can make is submitting your own compensation — it takes 3 minutes and helps thousands of professionals negotiate better offers.

**[→ Submit your compensation anonymously](https://opencomp.onrender.com/contribute)**

If you want to contribute to the codebase, pull requests are welcome. Open an issue first for significant changes.

---

## License

MIT — free to use, fork, modify, and build on. No strings attached.

---

<div align="center">

Built with care for India's tech community.

*If this helped you get a better offer, pay it forward — submit your data.*

</div>
