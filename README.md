# WiseMove Consultancy — website

Static site, hosted on GitHub Pages. No build step is required to deploy: every
`.html` file in the repo root is the real, finished file that the browser loads.

- **Contact address used everywhere:** `info@wisemoveconsultancy.com`
- **Phone / WhatsApp:** +91 99953 33560
- **Live products:** [Getvia](https://getvia.in), [Vashq](https://home.vashq.com), ZED0

## Files

| File | Purpose |
| --- | --- |
| `style.css` | The single stylesheet for the whole site. Every class used in the HTML has a rule here. |
| `script.js` | The single script for the whole site. Loaded by every page. |
| `build.py` | Optional dev tool that regenerates the HTML files (see below). |
| `assets/` | Real logos, product screenshots and the ZED0 machine render. |
| `*.html` | The pages, committed as plain static files. |

### Pages

**Real pages:** `index.html`, `work.html`, `services.html`, `platform.html`,
`how-it-works.html`, `about.html`, `getvia.html`, `vashq.html`, `zed0.html`,
`contact.html`, `privacy-policy.html`, `terms.html`, `cookie-policy.html`

**Redirect stubs** kept so previously-shared links never 404:
`privacy.html` → `privacy-policy.html`, `cookies.html` → `cookie-policy.html`,
`products.html` → `work.html`, `capabilities.html` → `services.html`

## About `build.py`

Every page shares the same `<head>`, navbar, mobile drawer, contact modal and
footer. Previously those were copy-pasted, and they had drifted apart — four
different font stacks, four pages that never linked `style.css` at all, nav links
pointing at pages that did not exist, and a duplicate logo in the navbar.

`build.py` composes all 17 files from one shared shell so that class of bug
cannot come back. Editing the shell in one place updates every page.

```bash
python3 build.py     # regenerates all *.html in place
```

**It is a convenience, not a dependency.** The generated `.html` files are
committed and served directly. If you would rather hand-edit the HTML, do that
and delete `build.py` — nothing else refers to it. Just remember that a change
to the navbar or footer then has to be repeated on 13 pages.

## Two things worth knowing before editing

**1. The logo file names describe the background, not the ink colour.**

| File | Ink | Use on |
| --- | --- | --- |
| `assets/wisemove-logo-light.png` | dark | light backgrounds |
| `assets/wisemove-logo-dark.png` | white | dark backgrounds |
| `assets/zed0 Logo White.png` | white | dark backgrounds |
| `assets/zed0 Logo dark.png` | dark | light backgrounds |

Both variants are always present in the markup; CSS shows exactly one via the
`--logo-light` / `--logo-dark` custom properties, which flip with the theme.
Never recreate a logo as text, CSS shapes or a hand-drawn SVG — always use the
real file with `object-fit: contain`.

**2. The header must stay above the mobile drawer.**
`.site-header` is `z-index: 960`, `.mobile-menu` is `950`. If the drawer ever
sits on top, the hamburger becomes unclickable and the menu cannot be closed.

## Theme

Dark by default, with a working light theme via the navbar toggle. The choice is
saved to `localStorage` under `wisemove-theme`. All colours come from custom
properties defined in `:root` and overridden under `[data-theme="light"]`.

## Contact form

There is no backend. Submitting the modal or the contact-page form composes a
pre-filled email to `info@wisemoveconsultancy.com` using the visitor's own mail
client. If a backend is added later, replace the `mailto` composer in the
`initForms` module of `script.js`.

## Accessibility and motion

- Skip-to-content link is the first tab stop on every page.
- The contact modal traps focus and closes on `Esc`, the X button, or a click on
  the backdrop.
- The mobile drawer is hidden at every viewport width until it is opened, and
  closes on `Esc`, on the X, and when a link inside it is followed.
- All animation is disabled under `prefers-reduced-motion: reduce`.

## Verified

Checked across 320 / 375 / 390 / 430 / 768 / 1024 / 1280 / 1440 / 1920 px on all
13 real pages: no horizontal overflow, no JavaScript console errors, no broken
images or links, exactly one visible logo and one visible navigation per page.
