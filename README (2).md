# WiseMove Consultancy — Website

Source for the WiseMove Consultancy homepage — a software product studio site built around the `wisemove` brand identity, featuring our products **Getvia** and **Vashq**.

**Live brand elements (do not change without updating the whole site):**
- Wordmark: `wisemove` + diamond mark
- Tagline: **"Make every move wiser."**
- Supporting line: **"Transparent guidance. Clear timelines. Step-by-step support."**
- Primary color: `#6e4ef2` (purple)
- Dark/light theme toggle (top-right nav)

## Project structure

```
.
├── index.html          → main homepage
├── css/
│   └── style.css       → all styling (CSS variables drive the dark/light theme)
├── js/
│   └── script.js       → theme toggle, FAQ accordion, scroll reveal, hero terminal animation
├── assets/
│   └── images/
│       ├── getvia-logo.png
│       └── vashq-logo.png
└── README.md
```

## Running locally

No build step required — it's static HTML/CSS/JS.

```bash
# Option 1: just open it
open index.html

# Option 2: serve it locally (recommended, avoids any relative-path issues)
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deploying with GitHub Pages

1. Push this repo to GitHub.
2. Go to **Settings → Pages**.
3. Under "Build and deployment", set **Source** to `Deploy from a branch`.
4. Choose the `main` branch and `/ (root)` folder, then **Save**.
5. Your site will be live at `https://<username>.github.io/<repo-name>/` within a few minutes.

To use the custom domain (`wisemoveconsultancy.com`):
1. Add a file named `CNAME` at the repo root containing just: `wisemoveconsultancy.com`
2. In your domain's DNS settings, point it at GitHub Pages (A records to GitHub's IPs, or a CNAME record if using a subdomain) — see [GitHub's custom domain docs](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site).
3. Re-enable "Enforce HTTPS" in the Pages settings once DNS propagates.

## Notes for future edits

- All colors, fonts, and spacing are controlled via CSS custom properties at the top of `css/style.css` — update tokens there rather than hardcoding new values throughout.
- Testimonials in `index.html` are currently placeholder quotes — replace with real client feedback before public launch.
- Stats in the "stats" section (products shipped, businesses onboarded, etc.) are estimates — update with real numbers when available.
- Additional pages (Products detail, Services detail, About, Work/Case Studies, Blog, Careers, Legal) are scoped in the project's site-structure plan but not yet built — see prior planning doc if available, or ask for them to be generated in this same structure.
