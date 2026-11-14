# Human Knowledge Bridge — The Moon Detective

A five-screen "Science Detective" experience for ages 8–12. A child asks their own
question, gets a short sourced answer about the Moon, meets the real **Apollo 11
Passive Seismic Experiment** that NASA left on the Moon, and then sorts three claims
into measured evidence, scientific conclusion, and scientific model — with a separate
panel for what science still does not know.

Built for the **NASA Space Apps Challenge 2026**, challenge "Abandoned but not Forgotten".

**Live demo:** https://theselectionlab.ai/human-knowledge-bridge/

> This is an independent project. It is not an official NASA product and is not
> endorsed by NASA.

---

## Why it fits the challenge

The Apollo 11 Passive Seismic Experiment is exactly the kind of hardware the challenge
asks about: a real instrument, placed on the lunar surface in 1969, left behind when
the astronauts came home. It returned data for about three weeks and gave scientists
the first detailed look at the Moon's internal structure. The demo makes that
instrument the *destination* of a child's question, rather than a decorative fact.

It also keeps Apollo 11's instrument distinct from the later Apollo 12, 14, 15 and 16
seismometers, which transmitted until September 1977 — a distinction most summaries
blur, and one the demo turns into a teachable moment.

## The five screens

1. **The Question.** The child types their own question. The example is a clickable
   chip, never a prefill.
2. **The Discovery.** A short answer, plus a "How do we know?" panel that separates
   direct Moon-rock samples from seismic inference.
3. **The Science Detective.** The Apollo 11 PSE: what it measured, what it did *not*
   do, and how the later Apollo seismometers differed.
4. **The Evidence Scales.** Three claims, three labels, immediate feedback that
   explains reasoning, no score, and a "What we still don't know" panel.
5. **Your Next Question.** The child chooses what to explore next.

## What this demo does not do

- It answers **one** checked question. Anything else gets an honest "I don't have
  enough verified evidence yet", not an invented answer.
- It does not search the internet, retrieve live data, or generate scientific answers.
- **No AI model runs at runtime.** There is no large language model, no chatbot and
  no API key. AI tools were used during development; see [`AI_USAGE.md`](AI_USAGE.md).
- It collects nothing: no accounts, no cookies, no analytics, no personal information.
  The child's question stays in the browser tab.
- It does not cover later Apollo missions in detail, and it does not resolve open
  scientific debates — it labels them as open questions.

## Accessibility

Target: **WCAG 2.2 AA**.

- Plain semantic HTML, real buttons and labels, one `<h1>` per screen.
- Keyboard: skip link first, Enter submits, Space selects a label, focus moves to each
  screen heading on navigation.
- Every text colour verified at or above 4.5:1 (lowest measured: 9.61:1); control
  borders at or above 3:1.
- Comfortable from 320 px up, with no horizontal scrolling; reflows without loss at
  200% zoom.
- `prefers-reduced-motion` is honoured in both CSS and JavaScript.

Known limitation: testing was done with automated checks and keyboard walks in
Chromium, not with a screen reader on every platform. See
[`SOURCES.md`](SOURCES.md) for the source list.

## Run it locally

No build step, no dependencies, no install.

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

Opening `index.html` directly from disk also works. The page uses classic scripts with
`defer` (not ES modules) and relative paths specifically so `file://` works.

## Tests

Open `tests/tests.html` in a browser. It runs **391 checks** with no framework and no
install: the 89-case question matcher fixture, the content contract, state validation,
the route-reachability rules, and XSS handling.

The page title shows `PASS n/n` or `FAIL n/n`, and failures are listed with the actual
and expected values.

## How it is built

| File | Role |
|---|---|
| `index.html` | The five screens as static markup; screens 2–5 start `hidden`. |
| `sources.html` | Sources, licences, limits, privacy, AI disclosure, team. |
| `assets/js/content.js` | All child-facing copy, the three claims, the source registry. |
| `assets/js/logic.js` | Pure functions: normalisation, the question matcher, state validation, claim scoring. |
| `assets/js/screens.js` | Renders screens 2–5 from content. |
| `assets/js/app.js` | Routing, guards, persistence, screen 1 and screen 5 wiring. |
| `assets/css/styles.css` | Design tokens and components. |

Plain HTML, CSS and JavaScript. No framework, no bundler, no backend, no database, no
service worker. The absence of those is deliberate: the whole demo is auditable in an
afternoon.

## Sources

Every scientific claim is tied to a NASA page and given an evidence status. The full
table, with access dates, is in [`SOURCES.md`](SOURCES.md) and on the
[sources page](sources.html) of the live demo.

## Licences

Code, text and illustrations in this repository are **MIT-licensed** (see
[`LICENSE`](LICENSE)). No other licence is offered for this project's material.

NASA material is credited, used under NASA's Media Usage Guidelines, and is not
relicensed by this project. The NASA insignia is not used.

Pre-existing Selection Lab materials and methods are **not** included in this
repository and are not covered by the licence.

## Team

- **Ali** — build, repository, deployment, QA, submission, pitch.
- **Tatiana Ilina**, Selection Lab — concept, research, source checking, child-facing
  copy, visual direction.

Selection Lab is a research and product initiative exploring how AI systems can handle
evidence, uncertainty, and human questions more reliably.
<https://theselectionlab.ai/>

## Evidence before narrative

This is a small, testable demonstration of Selection Lab's "Evidence Before Narrative"
principle. It is not a claim that we have built a general AI reliability system.
