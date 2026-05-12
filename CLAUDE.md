# CLAUDE.md — Multi Family Deals Website

This file is read automatically at the start of every session. Do not remove it.

## The Business

**Multi Family Deals** is an Edmonton-based real estate investment firm run by **Kunal Sarhadi**, Real Estate Broker at Homelife Miracle Realty Inc., and his brother **Ankit Sarhadi**.

The firm helps investors acquire purpose-built multi-family properties in Edmonton, Alberta using the **CMHC MLI Select** program — which offers 5% down and 50-year amortization on qualifying builds.

The target investor wants to scale to 50+ doors in 4 years.

## The Website

- **Live URL:** https://multi-family-deals.ca
- **Hosting:** GitHub Pages (the CNAME file points the domain to GitHub Pages)
- **Repository:** https://github.com/kunalsarhadi/multifamilydeals
- **Local files:** `/home/user/multifamilydeals/`
- **Default branch for deploys:** `main` — pushing to `main` makes changes live within 1–2 minutes
- **Feature branches:** use `fix/` or `feat/` prefix, merge to `main` when ready

## IMPORTANT: Deployment Rule

Changes to local HTML files do NOT affect the live site until pushed to `main` on GitHub.
Always tell the user whether a change is local-only or has been pushed live.

## Pages (10 total)

| File | URL path | Purpose |
|---|---|---|
| `index.html` | `/` | Homepage |
| `about.html` | `/about` | The Strategy |
| `why-alberta.html` | `/why-alberta` | Why Alberta — market data, vacancy rates, migration |
| `inventory.html` | `/inventory` | Active property listings |
| `inglewood.html` | `/inglewood` | Portfolio — completed 9-plex project |
| `buying-process.html` | `/buying-process` | Step-by-step buying process |
| `faq.html` | `/faq` | FAQ accordion |
| `reviews.html` | `/reviews` | Client reviews |
| `guide.html` | `/guide` | Free CMHC MLI Select investor guide (printable PDF) |
| `contact.html` | `/contact` | Book Strategy Call |

## Site Architecture

- Plain HTML/CSS/JS — no build framework, no npm, no bundler
- All styles are inline `<style>` blocks inside each page's `<head>`
- Fonts: Cinzel (headings) + Josefin Sans (body) via Google Fonts
- Color tokens: `--navy-deep`, `--navy-primary`, `--navy-card`, `--navy-border`, `--gold`, `--gold-light`, `--gold-muted`, `--text-primary`, `--text-muted`, `--text-subtle`
- Nav: `<nav>` → `.nav-inner` → `.nav-logo` (left) + `.nav-links` (middle) + `.nav-cta` (right)
- Mobile nav: `<div class="mobile-nav" id="mobileNav">` — toggled by `.hamburger` button
- Footer: consistent across all pages, links to all 9 other pages

## Key Market Data (update here when figures change)

- **Edmonton rental vacancy rate:** ~4%
- **Edmonton population growth:** Canada's fastest-growing major city 2023–2024
- **CMHC MLI Select down payment:** 5%
- **CMHC MLI Select amortization:** 50 years
- **Edmonton avg 2BR rent:** ~$1,600/mo
- **Edmonton avg detached home price:** ~$470K
- **Multi-family cap rates Edmonton:** ~4.5–5.5%
- **Ontario vacancy rate:** ~1.5%
- **BC vacancy rate:** ~0.9%
- **Alberta provincial sales tax:** None (no PST, no HST)

## Why Investors Choose Alberta (key talking points)

- No provincial sales tax (written into Alberta's constitution — not a policy that can be reversed)
- Lowest provincial income tax in Canada
- Edmonton home prices 40–50% below Toronto/Vancouver — preserves cap rates
- Canada's #1 interprovincial migration destination
- 200,000+ people moved to Alberta in 2024 — creates sustained rental demand
- New arrivals rent first — stable, employed tenants
- Purpose-built rental GST exemption applies to CMHC MLI Select builds
- Alberta New Home Warranty Program covers all builds
- CMHC MLI Select requires separate utility meters per unit — built to spec

## Inventory

- The "Last Updated" date on the inventory page updates automatically via JavaScript (`new Date()`) — no manual work needed
- Inventory data is managed in Google Sheets — see the Google Sheets section below for API access

## Git Workflow

Always use feature branches — never push directly to main.

```bash
git checkout -b feat/description origin/main
git add <files>
git commit -m "description"
git push -u origin feat/description
```

Then open a PR via `mcp__github__create_pull_request` and squash-merge via `mcp__github__merge_pull_request`.

**Notes:**
- `git push` works fine through the local proxy — use it for all file commits including images
- Do NOT use `mcp__github__push_files` for large files (>50KB) — it cannot reliably handle them
- Do NOT use background agents to push files — they truncate large files
- Large MCP tool outputs (>25K tokens) auto-persist to a file path shown in the result — always read from that path using `jq`, never try to capture the raw output directly

## Google Sheets — Inventory Hotlist

The live inventory data is managed in Google Sheets. Read it at the start of any inventory-related task.

- **Spreadsheet ID:** `1rv3GdNkdN89AmNthj1JeL2ulSgKL9x3NnIL7UxCbn20`
- **Tab name:** `CMHC MLI Inventory List`
- **API Key:** `AIzaSyC3Ii4Ps8mqlB-sCO5DyqFo1HgTyADcxCc`

**To read the sheet (always use `includeGridData=true` — required to get Drive folder hyperlinks embedded in cells):**
```
https://sheets.googleapis.com/v4/spreadsheets/1rv3GdNkdN89AmNthj1JeL2ulSgKL9x3NnIL7UxCbn20?key=AIzaSyC3Ii4Ps8mqlB-sCO5DyqFo1HgTyADcxCc&includeGridData=true&ranges=CMHC%20MLI%20Inventory%20List!A1:Z60
```

Save the response to `/tmp/hotlist.json` and use `jq` to read it — the output is large and will auto-persist.

**When the user says "upload line N" (single property):**
1. Extract row N-1 (0-indexed) from `/tmp/hotlist.json` — get plex type, status, package name + Drive folder hyperlink, neighbourhood, city, cash flow, DSCR, completion
2. If `AVAILABLE`: find the image in the Drive folder via `mcp__565775ac-*__search_files` with `parentId = '<folder_id>'` and `mimeType contains 'image/'` — pick whichever result is a JPEG or PNG (any filename)
3. Download via `mcp__565775ac-*__download_file_content` — output persists to file; decode with `jq -r '.content' <path> | base64 -d > images/<slug>.png`
4. **Phase A PR:** branch `feat/add-<slug>-image` off main → commit image → push → PR → squash-merge
5. **Phase B PR:** branch `feat/add-<plex>-<slug>` off main → insert card → bump status pill + count + dropdown + JSON-LD → push → PR → squash-merge
6. Cards with 6–12 units go in the first tier; 15+ units go in the second tier (Institutional-Scale)

**When the user says "sync inventory":**
1. Re-fetch the sheet into `/tmp/hotlist.json`
2. Diff all rows against inventory.html (Available, SC, CS sections + status pill + dropdown + JSON-LD)
3. If more than ~3 properties changed, report the planned diff before opening any PRs
