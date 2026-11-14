# AI usage

**No AI model runs in this demo.** At runtime the app is plain HTML, CSS and
JavaScript. There is no large language model, no chatbot, no search API, and no API
key. Every answer the child sees was written in advance and checked against a NASA
page.

## What AI tools were used for

AI assistants were used during development, in these roles:

| Area | How AI was used | Human check |
|---|---|---|
| Research and planning | Summarising NASA pages and the challenge requirements into a source ledger | Every claim traced back to a quoted line on a NASA page and opened by hand |
| Copy drafting | Drafting child-facing sentences from an approved outline | Reviewed against the copy deck and the fact ledger before it shipped |
| Code | Writing and debugging the HTML, CSS and JavaScript | Run and tested in a real browser: 391 automated checks plus a manual walkthrough |
| Testing | Generating the matcher test fixture and edge cases | Each case's expected result was reviewed by a person |

## What was not delegated

- **Factual accuracy.** Every scientific claim is attributed to a named NASA page and
  carries an evidence status (measured, concluded, or model). Where NASA's own pages
  disagreed on a number, the number was cut rather than averaged or guessed.
- **Source selection.** The demo cites only the specific page that supports the
  specific claim. It does not cite search snippets or summaries.
- **The honesty rules.** Answers the demo cannot support produce "I don't have enough
  verified evidence to answer it yet". This is a product decision, not model behaviour.

## Accountability

The team is accountable for everything in this repository, including anything drafted
with AI assistance. If an error is found in a claim, it should be fixed in
`assets/js/content.js` and re-checked against the source in `SOURCES.md`.
