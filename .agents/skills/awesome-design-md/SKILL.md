---
name: awesome-design-md
description: Library of 84 DESIGN.md design-system analyses of real websites (Stripe, Linear, Vercel, Apple, Airbnb, Notion, Spotify, Tesla, etc.) with colors, typography, spacing, radii and component rules. Use when the user wants a page or component to look like a specific brand or site, asks for a reference design system, or wants to create a DESIGN.md for this project.
metadata:
  source: https://github.com/VoltAgent/awesome-design-md
  commit: 3b605329240ce735b510037cca322f1831fdd7f8
---

# Awesome DESIGN.md

Each file in `designs/` is a [DESIGN.md](https://stitch.withgoogle.com/docs/design-md/overview/) extracted from a real website: YAML front matter with design tokens (colors, typography, rounded, spacing, components) followed by prose rules for how the UI should look and feel.

## How to use

1. Pick the reference that matches the request. List the options with `ls designs/`; file names are the site slug (e.g. `stripe.md`, `linear.app.md`, `x.ai.md`).
2. Read the whole file before writing UI. Treat its tokens and rules as the design system for the task: use its palette, type scale, radii and spacing rather than defaults.
3. If the user wants the project to adopt a style permanently, copy the chosen file to the project root as `DESIGN.md` and adapt the brand-specific parts (name, logo, product copy) to this project.
4. When no single site fits, combine deliberately: take one file as the base system and borrow specific elements from others, stating which.

Do not copy brand assets, logos or proprietary fonts; substitute the closest open alternative when a named font is not available.

Previews and updated versions of each file are at `https://getdesign.md/<slug>/design-md`.
