#!/usr/bin/env python3
"""
WiseMove Consultancy — static page generator.

Composes every .html file from one shared shell (head / nav / mobile drawer /
contact modal / footer) so navigation, branding and the modal can never drift
apart or duplicate between pages. Output is plain static HTML suitable for
GitHub Pages with relative paths only.

    python3 build.py
"""

import os
import re

ROOT = os.path.dirname(os.path.abspath(__file__))

EMAIL = "info@wisemoveconsultancy.com"
PHONE_DISPLAY = "+91 99953 33560"
PHONE_RAW = "+919995333560"
WA = "https://wa.me/919995333560"
ADDRESS_1 = "15/972, Nedumkulangara Rd,"
ADDRESS_2 = "Athani, Kakkanad, Kerala 682030"

# --------------------------------------------------------------------------
# Icons (inline SVG, currentColor)
# --------------------------------------------------------------------------

I = {
    "arrow": '<svg class="arw" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" width="16" height="16"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    "arrow_dl": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" width="16" height="16"><path d="M12 5v14M6 13l6 6 6-6"/></svg>',
    "arrow_ur": '<svg class="arw" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" width="16" height="16"><path d="M7 17 17 7M9 7h8v8"/></svg>',
    "shield": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3 5 6v5.5c0 4.3 2.9 8.3 7 9.5 4.1-1.2 7-5.2 7-9.5V6l-7-3Z"/><path d="m9 12 2 2 4-4"/></svg>',
    "clock": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    "support": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 14v-2a8 8 0 0 1 16 0v2"/><rect x="2" y="13" width="4" height="7" rx="1.6"/><rect x="18" y="13" width="4" height="7" rx="1.6"/></svg>',
    "cube": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m12 2 8.5 4.8v9.9L12 21.5 3.5 16.7V6.8L12 2Z"/><path d="m3.6 7 8.4 4.8L20.4 7M12 21.5v-9.7"/></svg>',
    "users": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="8" r="3.2"/><path d="M2.8 20a6.4 6.4 0 0 1 12.4 0"/><path d="M16.5 5.3a3.2 3.2 0 0 1 0 6M18 14.4a6.4 6.4 0 0 1 3.2 5.6"/></svg>',
    "rocket": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M13.5 3.5c3.5 0 7 3.5 7 7 0 4.5-5 8-8 10.5-2.5-3-6-6-6-9.5 0-4 3.5-8 7-8Z"/><circle cx="13.5" cy="10" r="2.2"/><path d="M7 17c-1.5.8-2 2.5-2 4 1.5 0 3.2-.5 4-2"/></svg>',
    "search": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.4-4.4"/></svg>',
    "chart": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></svg>',
    "pen": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4 11.5-11.5Z"/></svg>',
    "code": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m8 7-5 5 5 5M16 7l5 5-5 5M13.5 4l-3 16"/></svg>',
    "trend": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m3 16 5.5-5.5 3.5 3.5L21 5"/><path d="M15 5h6v6"/></svg>',
    "layers": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 13 9 5 9-5M3 17.5l9 5 9-5"/></svg>',
    "spark": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8"/></svg>',
    "bulb": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.5 10.9c.5.4.8 1 .8 1.6h5.4c0-.6.3-1.2.8-1.6A6 6 0 0 0 12 3Z"/></svg>',
    "mail": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2.8" y="5" width="18.4" height="14" rx="2.4"/><path d="m3.4 6.8 8.6 6 8.6-6"/></svg>',
    "phone": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6.5 3.5h3l1.5 4-2 1.4a12 12 0 0 0 5.1 5.1l1.4-2 4 1.5v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.5 5.7 2 2 0 0 1 6.5 3.5Z"/></svg>',
    "pin": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z"/><circle cx="12" cy="10" r="2.6"/></svg>',
    "wa": '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .1-1.7-.1-.4-.1-.9-.3-1.5-.6a11 11 0 0 1-4.3-3.9c-.3-.5-.8-1.3-.8-2.4s.6-1.7.8-2c.2-.2.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 1.9c.1.2 0 .4-.1.5l-.3.4-.3.3c-.1.1-.2.3-.1.5.2.4.7 1.2 1.4 1.8.9.8 1.6 1 1.9 1.2.2.1.4 0 .5-.1l.7-.8c.2-.2.3-.2.5-.1l1.8.9c.3.1.4.2.5.3v1Z"/></svg>',
    "plus": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
    "close": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    "sun": '<svg class="i-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
    "moon": '<svg class="i-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z"/></svg>',
}

# --------------------------------------------------------------------------
# Shared shell
# --------------------------------------------------------------------------

NAV_ITEMS = [
    ("index.html", "Home"),
    ("work.html", "Work"),
    ("services.html", "Services"),
    ("platform.html", "Platform"),
    ("how-it-works.html", "How It Works"),
    ("about.html", "About"),
]

# NOTE ON FILE NAMES: the asset names describe the BACKGROUND they sit on, not
# the ink colour. wisemove-logo-light.png has DARK ink (for light backgrounds);
# wisemove-logo-dark.png has WHITE ink (for dark backgrounds). Verified from the
# pixel data — do not swap these without re-checking the artwork.
WM_LOGO = (
    '<img src="assets/wisemove-logo-dark.png" class="logo-on-dark" alt="WiseMove Consultancy" width="646" height="185">'
    '<img src="assets/wisemove-logo-light.png" class="logo-on-light" alt="WiseMove Consultancy" width="646" height="185">'
)

ZED0_LOGO = (
    '<img src="assets/zed0 Logo White.png" class="zed-on-dark" alt="ZED0" width="2448" height="759">'
    '<img src="assets/zed0 Logo dark.png" class="zed-on-light" alt="ZED0" width="2448" height="758">'
)


def head(page, title, desc):
    nav_desktop = "".join(
        '<a href="{href}"{cur}>{label}</a>'.format(
            href=href,
            label=label,
            cur=' aria-current="page"' if href == page else "",
        )
        for href, label in NAV_ITEMS
    )
    nav_mobile = "".join(
        '<a href="{href}"{cur}>{label}</a>'.format(
            href=href,
            label=label,
            cur=' aria-current="page"' if href == page else "",
        )
        for href, label in NAV_ITEMS
    )

    return f"""<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<meta name="description" content="{desc}">
<meta name="theme-color" content="#07050f">
<link rel="icon" type="image/png" href="assets/favicon.png">
<link rel="apple-touch-icon" href="assets/favicon.png">
<meta property="og:type" content="website">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{desc}">
<meta property="og:image" content="assets/wisemove-logo-dark.png">
<meta name="twitter:card" content="summary_large_image">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Fraunces:ital,opsz,wght@1,9..144,400;1,9..144,500;1,9..144,600&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="style.css">
<script>
/* Set the stored theme before first paint so there is no flash. */
(function(){{try{{var s=window['local'+'Storage'];var t=s&&s.getItem('wisemove-theme');if(t==='light'||t==='dark'){{document.documentElement.setAttribute('data-theme',t);}}}}catch(e){{}}}})();
</script>
</head>
<body>

<a href="#main" class="skip-link">Skip to content</a>

<header class="site-header">
  <div class="nav-bar">
    <a href="index.html" class="brand" aria-label="WiseMove Consultancy — home">{WM_LOGO}</a>
    <nav class="nav-links" aria-label="Primary">{nav_desktop}</nav>
    <div class="nav-actions">
      <button type="button" class="theme-toggle" data-theme-toggle aria-label="Switch colour theme">{I['sun']}{I['moon']}</button>
      <button type="button" class="btn btn-primary btn-sm" data-modal-open>Start a Project {I['arrow']}</button>
      <button type="button" class="nav-toggle" data-menu-toggle aria-expanded="false" aria-controls="mobileMenu" aria-label="Open menu"><span></span><span></span><span></span></button>
    </div>
  </div>
</header>

<div class="mobile-menu" id="mobileMenu" hidden>
  <nav aria-label="Mobile">{nav_mobile}</nav>
  <div class="mm-foot">
    <button type="button" class="btn btn-primary btn-lg" data-modal-open>Start a Project {I['arrow']}</button>
    <a class="mono" href="mailto:{EMAIL}">{EMAIL}</a>
  </div>
</div>

<main id="main">
"""


def footer():
    return f"""</main>

<footer class="site-footer">
  <div class="glow glow-a"></div>
  <div class="wrap">
    <div class="footer-grid">
      <div class="footer-brand">
        {WM_LOGO}
        <p>Make every move wiser. A product studio building software end to end — and operating what it builds.</p>
        <a class="link-arrow" href="mailto:{EMAIL}">{EMAIL}</a>
      </div>
      <div class="footer-col">
        <h5>Company</h5>
        <ul>
          <li><a href="work.html">Work</a></li>
          <li><a href="services.html">Services</a></li>
          <li><a href="platform.html">Platform</a></li>
          <li><a href="how-it-works.html">How It Works</a></li>
          <li><a href="about.html">About</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h5>Products</h5>
        <ul>
          <li><a href="getvia.html">Getvia</a></li>
          <li><a href="vashq.html">Vashq</a></li>
          <li><a href="zed0.html">ZED0</a></li>
          <li><a href="contact.html">Contact</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h5>Legal</h5>
        <ul>
          <li><a href="privacy-policy.html">Privacy Policy</a></li>
          <li><a href="terms.html">Terms</a></li>
          <li><a href="cookie-policy.html">Cookie Policy</a></li>
          <li><button type="button" class="footer-contact" data-modal-open>Contact</button></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <p>&copy; <span data-year>2026</span> WiseMove Consultancy — All rights reserved.</p>
      <div class="footer-legal">
        <a href="privacy-policy.html">Privacy</a>
        <a href="terms.html">Terms</a>
        <a href="cookie-policy.html">Cookies</a>
        <span>Kakkanad, Kerala, India</span>
      </div>
    </div>
  </div>
</footer>

<a class="float-cta" href="{WA}" target="_blank" rel="noopener noreferrer" aria-label="Chat with WiseMove on WhatsApp">{I['wa']}</a>

<div class="modal" id="contactModal" role="dialog" aria-modal="true" aria-labelledby="contactModalTitle" aria-hidden="true" hidden>
  <div class="modal-backdrop" data-modal-close></div>
  <div class="modal-panel">
    <button type="button" class="modal-close" data-modal-close aria-label="Close contact form">{I['close']}</button>
    <span class="eyebrow">WiseMove Consultancy</span>
    <h2 id="contactModalTitle">Let's build your next product.</h2>
    <p>Tell us what you're building and we'll come back with next steps and a clear estimate.</p>
    <a class="modal-mail" href="mailto:{EMAIL}">{I['mail']} {EMAIL}</a>
    <form data-enquiry-form novalidate>
      <div class="field-row">
        <div class="field">
          <label for="m-name">Name</label>
          <input type="text" id="m-name" name="name" autocomplete="name" placeholder="Your name" required>
        </div>
        <div class="field">
          <label for="m-email">Email</label>
          <input type="email" id="m-email" name="email" autocomplete="email" placeholder="you@company.com" required>
        </div>
      </div>
      <div class="field-row">
        <div class="field">
          <label for="m-company">Company</label>
          <input type="text" id="m-company" name="company" autocomplete="organization" placeholder="Company name">
        </div>
        <div class="field">
          <label for="m-phone">Phone</label>
          <input type="tel" id="m-phone" name="phone" autocomplete="tel" placeholder="{PHONE_DISPLAY}">
        </div>
      </div>
      <div class="field">
        <label for="m-message">Message</label>
        <textarea id="m-message" name="message" placeholder="What are you building?" required></textarea>
      </div>
      <div class="modal-actions">
        <button type="submit" class="btn btn-primary">Send Enquiry {I['arrow']}</button>
        <button type="button" class="btn btn-ghost" data-modal-close>Close</button>
      </div>
      <p class="form-note" data-form-status>No backend is connected — submitting opens your email app with this enquiry addressed to {EMAIL}.</p>
    </form>
  </div>
</div>

<script src="script.js"></script>
</body>
</html>
"""


def page_head(eyebrow, h1, lede):
    return f"""<section class="page-head">
  <div class="glow glow-a"></div>
  <div class="glow glow-b"></div>
  <div class="wrap">
    <span class="eyebrow">{eyebrow}</span>
    <h1>{h1}</h1>
    <p class="lede">{lede}</p>
  </div>
</section>
"""


def final_cta(title="Let's make the next move wiser.", lede="Tell us what you're building — we'll get back with next steps and a clear estimate."):
    return f"""<section class="final-cta">
  <div class="glow glow-a"></div>
  <div class="wrap reveal">
    <span class="eyebrow is-centered">Your next move</span>
    <h2>{title}</h2>
    <p class="lede">{lede}</p>
    <div class="btn-row">
      <button type="button" class="btn btn-primary btn-lg" data-modal-open>Start a Project {I['arrow']}</button>
      <a class="btn btn-ghost btn-lg" href="{WA}" target="_blank" rel="noopener noreferrer">Talk on WhatsApp {I['arrow_ur']}</a>
    </div>
  </div>
</section>
"""


# --------------------------------------------------------------------------
# Reusable content blocks
# --------------------------------------------------------------------------

PRODUCTS = {
    "getvia": {
        "name": "Getvia",
        "kind": "Business Discovery Platform",
        "headline": "Connecting businesses. Simplifying discovery.",
        "body": "A modern business discovery and listing platform that helps customers discover, explore, compare and connect with trusted businesses — while helping businesses build a stronger digital presence.",
        "tags": ["Discovery", "Search", "Business Profiles", "Listings", "Enquiries", "Reviews"],
        "logo": '<img src="assets/getvia-logo.png" alt="Getvia" width="64" height="64">',
        "shot": "assets/getvia-hero.png",
        "shot_alt": "Getvia business discovery interface",
        "shot2": "assets/getvia-categories.png",
        "shot2_alt": "Getvia category browsing view",
        "url": "https://getvia.in",
        "page": "getvia.html",
        "status": "Live product",
    },
    "vashq": {
        "name": "Vashq",
        "kind": "Operations Software",
        "headline": "The operating system for modern car wash businesses.",
        "body": "Vashq is a car wash management platform built to simplify and control daily operations — customers, jobs, employees, bookings, invoices, expenses and reports, all in one system.",
        "tags": ["Jobs", "Customers", "Employees", "Bookings", "Invoices", "Reports"],
        "logo": '<img src="assets/vashq-official-logo.png" alt="Vashq" width="1614" height="1599">',
        "shot": "assets/vashq-dashboard.png",
        "shot_alt": "Vashq operations dashboard",
        "shot2": "assets/vashq-features.png",
        "shot2_alt": "Vashq features view",
        "url": "https://home.vashq.com",
        "page": "vashq.html",
        "status": "Live product",
    },
    "zed0": {
        "name": "ZED0",
        "kind": "Self-Service Car Wash Machine",
        "headline": "Self-service car washing, made simpler.",
        "body": "ZED0 is a self-service car wash machine designed for convenient, customer-operated vehicle cleaning. It brings a simple, accessible car-washing experience to modern vehicle-care spaces.",
        "tags": ["Self-Service", "Car Wash", "Hardware", "Vehicle Care"],
        "logo": ZED0_LOGO,
        "shot": "assets/zed0-machine.png",
        "shot_alt": "ZED0 self-service car wash machine",
        "shot2": None,
        "shot2_alt": "",
        "url": None,
        "page": "zed0.html",
        "status": "Product",
    },
}


def showcase(key, index, flip=False):
    p = PRODUCTS[key]
    tags = "".join(f'<span class="tag">{t}</span>' for t in p["tags"])

    if p["url"]:
        cta = f'<a class="btn btn-ghost" href="{p["url"]}" target="_blank" rel="noopener noreferrer">Visit {p["name"]} {I["arrow_ur"]}</a>'
    else:
        cta = ""
    cta += f'<a class="btn btn-primary" href="{p["page"]}">{p["name"]} details {I["arrow"]}</a>'

    back = ""
    if p["shot2"]:
        back = f'<div class="shot back"><img src="{p["shot2"]}" alt="{p["shot2_alt"]}" loading="lazy" width="1440" height="816"></div>'

    return f"""<section class="showcase {key}{' flip' if flip else ''}" id="{key}">
  <div class="glow glow-a"></div>
  <div class="glow glow-b"></div>
  <div class="wrap">
    <div class="showcase-inner">
      <div class="showcase-copy reveal">
        <span class="idx">{index} — {p['status']} · built by WiseMove</span>
        <div class="prod-logo">{p['logo']}<span class="prod-kind">{p['kind']}</span></div>
        <h2>{p['headline']}</h2>
        <p>{p['body']}</p>
        <div class="tag-row">{tags}</div>
        <div class="hero-cta mb-0">{cta}</div>
      </div>
      <div class="showcase-media reveal">
        <div class="shot-stack">
          <div class="shot"><img src="{p['shot']}" alt="{p['shot_alt']}" loading="lazy" width="1440" height="757"></div>
          {back}
        </div>
      </div>
    </div>
  </div>
</section>
"""


def product_cards():
    cards = []
    for key in ("getvia", "vashq", "zed0"):
        p = PRODUCTS[key]
        cards.append(f"""<a class="pcard" href="{p['page']}">
  <div class="pcard-media"><img src="{p['shot']}" alt="{p['shot_alt']}" loading="lazy" width="1440" height="757"></div>
  <div class="pcard-body">
    <div class="pcard-logo">{p['logo']}</div>
    <span class="mono stack-label">{p['kind']}</span>
    <p>{p['body']}</p>
    <span class="link-arrow">View {p['name']} {I['arrow']}</span>
  </div>
</a>""")
    return '<div class="grid g-3 stagger">' + "".join(cards) + "</div>"


STEPS = [
    ("01", "search", "Discovery", "Understand the problem before writing code."),
    ("02", "chart", "Strategy", "Define what actually deserves to be built."),
    ("03", "pen", "Design", "Turn complexity into clarity."),
    ("04", "code", "Build", "Engineer for real-world use."),
    ("05", "rocket", "Launch", "Ship with confidence."),
    ("06", "trend", "Scale", "Improve as the product grows."),
]


def step_grid():
    items = "".join(
        f"""<article class="step">
  <span class="n">{n}</span>
  <div class="ic">{I[icon]}</div>
  <h4>{title}</h4>
  <p>{body}</p>
</article>"""
        for n, icon, title, body in STEPS
    )
    return f"""<div class="step-grid stagger">{items}</div>
<div class="track"><div class="dots">{'<i></i>' * 6}</div></div>
<div class="track-labels"><span>Idea</span><span>Product</span></div>"""


CAPABILITIES = [
    ("01", "spark", "Strategy", ["Product strategy", "Discovery", "Requirements", "MVP planning"]),
    ("02", "pen", "Design", ["UI / UX design", "Product design", "Wireframes", "Prototyping"]),
    ("03", "code", "Engineering", ["Web applications", "Mobile applications", "Product engineering", "AI &amp; automation"]),
    ("04", "layers", "Scale", ["Deployment", "Maintenance", "Support", "Performance"]),
]


def capability_cards():
    items = "".join(
        f"""<article class="card">
  <span class="n">{n}</span>
  <div class="card-icon">{I[icon]}</div>
  <h3>{title}</h3>
  <ul>{''.join(f'<li>{x}</li>' for x in items_)}</ul>
</article>"""
        for n, icon, title, items_ in CAPABILITIES
    )
    return f'<div class="grid g-4 stagger">{items}</div>'


FAQS = [
    ("What services does WiseMove offer?",
     "We build web and mobile applications end to end — product strategy, UI/UX design, development, QA, launch and ongoing support. We also take on AI integration and product consulting work."),
    ("How long does it take to build an app?",
     "It depends on scope. A focused MVP typically takes 6–10 weeks; larger, multi-feature products take longer. We give you a realistic timeline after the discovery phase, not before."),
    ("Do you offer support after launch?",
     "Yes. We offer ongoing maintenance, monitoring and feature updates after launch — the same way we support the products we build, including Getvia, Vashq and ZED0."),
    ("Can you build custom software for my business?",
     "Yes. Alongside our own products, we take on custom builds for businesses that need software tailored to their workflow — internal tools, customer-facing apps, dashboards and more."),
    ("What industries do you work with?",
     "We've built for local business discovery and service-industry operations, including car wash and detailing, and take on projects across retail, services and SaaS more broadly."),
    ("How much does a project cost?",
     "Cost depends on scope, platform and timeline. Share your requirements and we'll give you a clear estimate after an initial discovery call."),
]


def faq_block():
    items = "".join(
        f"""<div class="faq-item">
  <button type="button" class="faq-q" aria-expanded="false" id="faq-q{i}" aria-controls="faq-a{i}">
    <span>{q}</span><span class="pm">{I['plus']}</span>
  </button>
  <div class="faq-a" id="faq-a{i}" role="region" aria-labelledby="faq-q{i}"><div><p>{a}</p></div></div>
</div>"""
        for i, (q, a) in enumerate(FAQS)
    )
    return f'<div class="faq">{items}</div>'


def bigtype(words):
    row = "".join(f"<span>{w}</span>" for w in words)
    return f'<section class="bigtype" aria-hidden="true"><div class="marquee">{row}{row}</div></section>'


# --------------------------------------------------------------------------
# PAGES
# --------------------------------------------------------------------------

def p_index():
    return f"""<section class="hero">
  <div class="glow glow-a"></div>
  <div class="glow glow-b"></div>
  <div class="wrap">
    <div class="hero-grid">
      <div class="hero-copy">
        <span class="eyebrow pill">Product Studio</span>
        <h1>Make every <span class="accent">move</span> wiser.</h1>
        <p class="lede">Product strategy, design and engineering — built around your users, your timeline and your growth goals.</p>
        <div class="hero-cta">
          <button type="button" class="btn btn-primary btn-lg" data-modal-open>Book Free Consultation {I['arrow']}</button>
          <a class="btn btn-ghost btn-lg" href="#work">Explore Our Work {I['arrow_dl']}</a>
        </div>
        <div class="hero-trust">
          <div class="trust-marks" aria-hidden="true"><span>W</span><span>G</span><span>V</span><span>Z</span></div>
          <span class="mono">Three products built &amp; operated in-house</span>
        </div>
        <ul class="hero-assure">
          <li>{I['shield']} Transparent process</li>
          <li>{I['clock']} Clear timelines</li>
          <li>{I['support']} Ongoing support</li>
        </ul>
      </div>

      <div class="hero-visual" data-parallax>
        <div class="hv-stage">
          <div class="hv-ring r1"></div>
          <div class="hv-ring r2"></div>
          <div class="hv-orb" data-depth="0.25"></div>
          <img class="hv-mark" src="assets/wisemove-icon.png" alt="" aria-hidden="true" data-depth="0.5" width="299" height="350">
        </div>
        <div class="hv-idea" data-depth="1.1">{I['bulb']} Your idea</div>
        <a class="hv-card hv-getvia" href="getvia.html" data-depth="0.8">
          <img src="assets/getvia-logo.png" alt="Getvia" width="64" height="64">
          <span class="hv-txt"><small>Live product</small><b>Getvia</b></span>
        </a>
        <a class="hv-card hv-vashq" href="vashq.html" data-depth="0.95">
          <img src="assets/vashq-official-logo.png" alt="Vashq" width="1614" height="1599">
          <span class="hv-txt"><small>Live product</small><b>Vashq</b></span>
        </a>
        <a class="hv-card hv-zed0" href="zed0.html" data-depth="0.7">
          <span class="hv-zedmark">{ZED0_LOGO}</span>
          <span class="hv-txt"><small>Product</small><b>Self-service car wash</b></span>
        </a>
        <div class="hv-engine" data-depth="1.25">
          <h4>WiseMove engine</h4>
          <ul>
            <li><i></i>Strategy</li>
            <li><i></i>Design</li>
            <li><i></i>Engineering</li>
            <li><i></i>Launch</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="stats-band">
  <div class="wrap">
    <div class="stats-inner stagger">
      <div class="stat"><div class="stat-icon">{I['cube']}</div><div><b data-count="3" data-pad="true">03</b><small>Products built</small></div></div>
      <div class="stat"><div class="stat-icon">{I['users']}</div><div><b data-count="100" data-suffix="%">100%</b><small>End-to-end delivery</small></div></div>
      <div class="stat"><div class="stat-icon">{I['rocket']}</div><div><b data-count="6" data-suffix="–10 wks">6–10 wks</b><small>Typical MVP</small></div></div>
      <div class="stat"><div class="stat-icon">{I['support']}</div><div><b>24/7</b><small>Ongoing support</small></div></div>
    </div>
  </div>
</section>

<section class="section" id="work">
  <div class="wrap">
    <div class="process-layout">
      <div class="reveal">
        <span class="eyebrow">How we move</span>
        <h2>From idea to <span class="accent">impact.</span></h2>
        <p class="my-loose">A structured, product-first approach — practical, on time and aligned with your business goals.</p>
        <a class="btn btn-ghost" href="how-it-works.html">See the process {I['arrow']}</a>
      </div>
      <div>{step_grid()}</div>
    </div>
  </div>
</section>

<section class="section section-alt">
  <div class="wrap">
    <div class="head-split">
      <div class="reveal">
        <span class="eyebrow">Products</span>
        <h2>Built by us. Used in the real world.</h2>
      </div>
      <p class="reveal">We don't only build software for clients — we build and operate our own products, so we know what it takes to ship, scale and support something people rely on daily.</p>
    </div>
    {product_cards()}
  </div>
</section>

{bigtype(["We operate what we build.", "Make every move wiser.", "Product-first thinking.", "Built for real use."])}

<section class="section">
  <div class="wrap">
    <div class="head-split">
      <div class="reveal">
        <span class="eyebrow">Capabilities</span>
        <h2>End-to-end delivery, designed for clarity.</h2>
      </div>
      <p class="reveal">Whether you need a full product built from scratch or ongoing support for something that already exists, we work as an extension of your team.</p>
    </div>
    {capability_cards()}
    <div class="mt-3 reveal"><a class="link-arrow" href="services.html">All services and technology {I['arrow']}</a></div>
  </div>
</section>

<section class="section section-alt">
  <div class="wrap">
    <div class="section-head reveal">
      <span class="eyebrow">Why WiseMove</span>
      <h2>Why teams choose to build with us.</h2>
    </div>
    <div class="grid g-3 stagger">
      <article class="card"><span class="n">01</span><div class="card-icon">{I['spark']}</div><h3>Product-first thinking</h3><p>Strategy before features — every build starts with your users and your business outcomes, not a technology preference.</p></article>
      <article class="card"><span class="n">02</span><div class="card-icon">{I['shield']}</div><h3>Transparent process</h3><p>Know where the project stands at any point — clear timelines, honest scoping and no surprise costs.</p></article>
      <article class="card"><span class="n">03</span><div class="card-icon">{I['layers']}</div><h3>End-to-end delivery</h3><p>One team from idea to scale — from the first wireframe through launch and long-term support.</p></article>
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="section-head reveal">
      <span class="eyebrow">FAQ</span>
      <h2>Good to know before we start.</h2>
    </div>
    <div class="reveal">{faq_block()}</div>
  </div>
</section>

{final_cta()}
"""


def p_work():
    return f"""{page_head("Work", 'Products we built — and still <span class="accent">operate.</span>',
    "Three products across business discovery, car wash operations and vehicle-care hardware. Each one designed, engineered, launched and supported by WiseMove.")}

<section class="section">
  <div class="wrap">{product_cards()}</div>
</section>

{showcase("getvia", "01")}
{showcase("vashq", "02", flip=True)}
{showcase("zed0", "03")}

{bigtype(["Getvia", "Vashq", "ZED0", "Built by WiseMove"])}

<section class="section">
  <div class="wrap">
    <div class="head-split">
      <div class="reveal">
        <span class="eyebrow">Custom builds</span>
        <h2>We also build for other teams.</h2>
      </div>
      <p class="reveal">Alongside our own products we take on custom software for businesses that need something built around their specific workflow.</p>
    </div>
    <div class="chips reveal">
      {''.join(f'<span class="chip">{c}</span>' for c in ["Web applications", "Mobile apps", "SaaS platforms", "Custom software", "AI &amp; automation", "Business systems", "Internal tools", "Dashboards"])}
    </div>
  </div>
</section>

{final_cta("Have something you want built?")}
"""


def p_services():
    return f"""{page_head("Services", 'End-to-end software delivery, designed for <span class="accent">clarity.</span>',
    "From product strategy through engineering, launch and long-term support — one team, one accountable process.")}

<section class="section">
  <div class="wrap">{capability_cards()}</div>
</section>

<section class="section section-alt">
  <div class="wrap">
    <div class="head-split">
      <div class="reveal"><span class="eyebrow">What we build</span><h2>Software shaped around the problem.</h2></div>
      <p class="reveal">We start with the outcome you need and choose the format that gets you there — not the other way around.</p>
    </div>
    <div class="rows reveal">
      <div class="row-item"><span class="n">01</span><div><h3>Web applications</h3><p>Customer-facing platforms, portals and internal tools built to hold up under real usage and real data.</p></div></div>
      <div class="row-item"><span class="n">02</span><div><h3>Mobile applications</h3><p>Cross-platform apps that stay fast and consistent across devices without maintaining two separate codebases.</p></div></div>
      <div class="row-item"><span class="n">03</span><div><h3>SaaS platforms</h3><p>Multi-tenant products with the billing, roles, onboarding and reporting a commercial product actually needs.</p></div></div>
      <div class="row-item"><span class="n">04</span><div><h3>Custom software</h3><p>Systems built around an existing workflow rather than forcing the workflow to fit off-the-shelf software.</p></div></div>
      <div class="row-item"><span class="n">05</span><div><h3>AI &amp; automation</h3><p>Practical automation and AI integration applied where it removes real manual work — not as a feature badge.</p></div></div>
      <div class="row-item"><span class="n">06</span><div><h3>Business systems</h3><p>Operations software for jobs, customers, bookings, invoicing and reporting, informed by running Vashq ourselves.</p></div></div>
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="section-head reveal">
      <span class="eyebrow">Technology</span>
      <h2>Technology chosen for the problem, not the trend.</h2>
      <p>We pick the stack based on what the product has to do, how it will be maintained and who will operate it.</p>
    </div>
    <div class="chips reveal">
      {''.join(f'<span class="chip">{c}</span>' for c in ["React / Next.js", "Flutter", "Node.js", "Python", "PostgreSQL", "Supabase", "AWS / Cloud", "AI / ML APIs", "REST &amp; GraphQL", "Design systems", "CI / CD", "Git"])}
    </div>
  </div>
</section>

<section class="section section-alt">
  <div class="wrap">
    <div class="section-head reveal"><span class="eyebrow">Engagement</span><h2>Ways of working together.</h2></div>
    <div class="grid g-3 stagger">
      <article class="card"><div class="card-icon">{I['cube']}</div><h3>Full product build</h3><p>You have an idea or a validated need. We take it from discovery to a launched, supported product.</p></article>
      <article class="card"><div class="card-icon">{I['layers']}</div><h3>Extend your team</h3><p>You already have a product and need design or engineering capacity that fits into your existing process.</p></article>
      <article class="card"><div class="card-icon">{I['support']}</div><h3>Maintain &amp; grow</h3><p>Something already exists and needs to be kept running, improved and scaled without breaking.</p></article>
    </div>
  </div>
</section>

{final_cta()}
"""


def p_platform():
    return f"""{page_head("Platform", 'One ecosystem. Customers, professionals and businesses <span class="accent">connected.</span>',
    "How the WiseMove product ecosystem fits together — discovery for customers, presence for businesses, and operations software for the teams doing the work.")}

<section class="section">
  <div class="wrap">
    <div class="grid g-3 stagger">
      <article class="card"><span class="n">Customers</span><div class="card-icon">{I['search']}</div><h3>Discover and decide</h3><p>People searching for a trusted local business browse profiles, services and catalogues on Getvia, compare options, and send an enquiry directly.</p></article>
      <article class="card"><span class="n">Businesses</span><div class="card-icon">{I['users']}</div><h3>Be found and be credible</h3><p>Businesses publish a verified profile with services, catalogue and contact details — building visibility and trust in one place.</p></article>
      <article class="card"><span class="n">Operators</span><div class="card-icon">{I['chart']}</div><h3>Run the work</h3><p>Once the enquiry lands, Vashq handles the operational half — jobs, bookings, employees, invoices, expenses and reporting.</p></article>
    </div>
  </div>
</section>

<section class="showcase getvia">
  <div class="glow glow-a"></div>
  <div class="glow glow-b"></div>
  <div class="wrap">
    <div class="showcase-inner">
      <div class="showcase-copy reveal">
        <span class="idx">Layer 01 — Discovery</span>
        <div class="prod-logo">{PRODUCTS['getvia']['logo']}<span class="prod-kind">Business Discovery Platform</span></div>
        <h2>Where demand starts.</h2>
        <p>Getvia is the front door of the ecosystem. Customers discover, explore and compare verified businesses; businesses get professional profiles, service listings, catalogues and a channel for customer enquiries and reviews.</p>
        <div class="tag-row">{''.join(f'<span class="tag">{t}</span>' for t in ["Verified businesses", "Professional profiles", "Services", "Catalogues", "Enquiries", "Reviews"])}</div>
        <div class="hero-cta mb-0">
          <a class="btn btn-ghost" href="https://getvia.in" target="_blank" rel="noopener noreferrer">Visit Getvia {I['arrow_ur']}</a>
          <a class="btn btn-primary" href="getvia.html">Getvia details {I['arrow']}</a>
        </div>
      </div>
      <div class="showcase-media reveal">
        <div class="shot-stack">
          <div class="shot"><img src="assets/getvia-hero.png" alt="Getvia discovery interface" loading="lazy" width="1440" height="757"></div>
          <div class="shot back"><img src="assets/getvia-categories.png" alt="Getvia category browsing" loading="lazy" width="1440" height="816"></div>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="showcase vashq flip">
  <div class="glow glow-a"></div>
  <div class="wrap">
    <div class="showcase-inner">
      <div class="showcase-copy reveal">
        <span class="idx">Layer 02 — Operations</span>
        <div class="prod-logo">{PRODUCTS['vashq']['logo']}<span class="prod-kind">Operations Software</span></div>
        <h2>Where the work gets done.</h2>
        <p>Vashq picks up after the enquiry. It gives the operating team one system for customers, jobs, employees, bookings, invoices, expenses and reports — so the business side stays as organised as the storefront.</p>
        <div class="tag-row">{''.join(f'<span class="tag">{t}</span>' for t in ["Jobs", "Customers", "Employees", "Bookings", "Invoices", "Expenses", "Reports"])}</div>
        <div class="hero-cta mb-0">
          <a class="btn btn-ghost" href="https://home.vashq.com" target="_blank" rel="noopener noreferrer">Visit Vashq {I['arrow_ur']}</a>
          <a class="btn btn-primary" href="vashq.html">Vashq details {I['arrow']}</a>
        </div>
      </div>
      <div class="showcase-media reveal">
        <div class="shot-stack">
          <div class="shot"><img src="assets/vashq-dashboard.png" alt="Vashq operations dashboard" loading="lazy" width="1413" height="760"></div>
          <div class="shot back"><img src="assets/vashq-features.png" alt="Vashq features view" loading="lazy" width="1430" height="763"></div>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="showcase zed0">
  <div class="glow glow-a"></div>
  <div class="glow glow-b"></div>
  <div class="wrap">
    <div class="showcase-inner">
      <div class="showcase-copy reveal">
        <span class="idx">Layer 03 — On the ground</span>
        <div class="prod-logo">{ZED0_LOGO}<span class="prod-kind">Self-Service Car Wash Machine</span></div>
        <h2>Where the service is delivered.</h2>
        <p>ZED0 is the physical end of the ecosystem — a self-service car wash machine for convenient, customer-operated vehicle cleaning in modern vehicle-care spaces.</p>
        <div class="tag-row">{''.join(f'<span class="tag">{t}</span>' for t in ["Self-service", "Car wash", "Hardware", "Vehicle care"])}</div>
        <div class="hero-cta mb-0"><a class="btn btn-primary" href="zed0.html">ZED0 details {I['arrow']}</a></div>
      </div>
      <div class="showcase-media reveal">
        <div class="shot"><img src="assets/zed0-machine.png" alt="ZED0 self-service car wash machine" loading="lazy" width="1536" height="1024"></div>
      </div>
    </div>
  </div>
</section>

<section class="section section-alt">
  <div class="wrap">
    <div class="section-head reveal"><span class="eyebrow">Why it matters</span><h2>Operating our own products changes how we build yours.</h2></div>
    <div class="grid g-3 stagger">
      <article class="card"><div class="card-icon">{I['shield']}</div><h3>Reliability isn't optional</h3><p>When we're the ones answering for downtime, reliability stops being a line item and becomes a design constraint.</p></article>
      <article class="card"><div class="card-icon">{I['users']}</div><h3>Usability is measurable</h3><p>Real users on our own platforms tell us quickly which decisions were convenient for us and bad for them.</p></article>
      <article class="card"><div class="card-icon">{I['trend']}</div><h3>Maintainability compounds</h3><p>We live with our own architecture choices for years, which makes us conservative in the places that matter.</p></article>
    </div>
  </div>
</section>

{final_cta()}
"""


def p_how():
    detail = [
        ("Discovery", "We start by understanding the problem, the users and the constraints — before a single line of code exists. You get a clear picture of what's actually worth building.",
         ["Stakeholder conversations", "Problem definition", "User and workflow mapping", "Constraint and risk review"]),
        ("Strategy", "We define scope honestly: what belongs in the first release, what waits, and what the success measure is. This is where surprise costs get eliminated.",
         ["Feature prioritisation", "MVP definition", "Timeline and milestones", "Technical approach"]),
        ("Design", "Complexity turns into something people can use. Wireframes first, then interface design and a system that stays consistent as the product grows.",
         ["Wireframes", "UI / UX design", "Prototypes", "Design system"]),
        ("Build", "Engineering for real-world use — built to be maintained, not just demoed. You see progress continuously rather than at the end.",
         ["Frontend and backend", "Integrations", "QA and testing", "Regular review builds"]),
        ("Launch", "Deployment, monitoring and the operational setup needed to run in production with confidence.",
         ["Deployment", "Monitoring", "Handover and docs", "Go-live support"]),
        ("Scale", "The product keeps improving after launch — informed by real usage rather than assumptions.",
         ["Maintenance", "Feature updates", "Performance work", "Ongoing support"]),
    ]

    rows = "".join(
        f"""<div class="row-item">
  <span class="n">{i + 1:02d}</span>
  <div>
    <h3>{title}</h3>
    <p>{body}</p>
    <div class="chips mt-1">{''.join(f'<span class="chip">{b}</span>' for b in bullets)}</div>
  </div>
</div>"""
        for i, (title, body, bullets) in enumerate(detail)
    )

    return f"""{page_head("How it works", 'From idea to <span class="accent">impact,</span> one step at a time.',
    "A structured, product-first approach — practical, on time and aligned with your business goals. Here is exactly what happens, in order.")}

<section class="section">
  <div class="wrap">{step_grid()}</div>
</section>

<section class="section section-alt">
  <div class="wrap">
    <div class="section-head reveal"><span class="eyebrow">In detail</span><h2>What each stage actually involves.</h2></div>
    <div class="rows reveal">{rows}</div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="section-head reveal"><span class="eyebrow">Working together</span><h2>Built around better collaboration.</h2></div>
    <div class="grid g-4 stagger">
      <article class="card"><span class="n">01</span><h4>Clear communication</h4><p>You always know who to talk to and what stage the work is in.</p></article>
      <article class="card"><span class="n">02</span><h4>Practical decisions</h4><p>We recommend the option that fits your budget and timeline, not the most impressive one.</p></article>
      <article class="card"><span class="n">03</span><h4>Transparent timelines</h4><p>Dates are set after discovery, and changes are flagged early rather than absorbed quietly.</p></article>
      <article class="card"><span class="n">04</span><h4>Long-term support</h4><p>Launch is a milestone, not the end of the relationship.</p></article>
    </div>
  </div>
</section>

<section class="section section-alt">
  <div class="wrap">
    <div class="section-head reveal"><span class="eyebrow">FAQ</span><h2>Questions we get before kickoff.</h2></div>
    <div class="reveal">{faq_block()}</div>
  </div>
</section>

{final_cta()}
"""


def p_about():
    return f"""{page_head("About WiseMove", 'A product company built on <span class="accent">useful</span> ideas.',
    "WiseMove Consultancy is a software and product development company creating digital platforms, business solutions and vehicle-care products from Kakkanad, Kerala.")}

<section class="section">
  <div class="wrap">
    <div class="head-split">
      <div class="reveal">
        <span class="eyebrow">Who we are</span>
        <h2>Small team. Product mindset. Serious execution.</h2>
      </div>
      <div class="reveal">
        <p>We combine strategy, design, engineering and technology to turn useful ideas into products people actually use. Technology is only worth something when it solves the right problem and creates measurable value.</p>
        <p class="mt-1">We don't only build for clients — we build products we have to operate. Reliability, usability and long-term maintainability aren't optional when we're responsible for what happens after launch.</p>
      </div>
    </div>
    <div class="grid g-4 stagger">
      <article class="card"><span class="n">Products</span><h3>03</h3><p>Getvia, Vashq and ZED0 — designed, built and operated in-house.</p></article>
      <article class="card"><span class="n">Discipline</span><h3>360°</h3><p>Strategy, design, engineering and support under one roof.</p></article>
      <article class="card"><span class="n">Based in</span><h3>Kerala</h3><p>Kakkanad, Kerala, India — working with teams locally and remotely.</p></article>
      <article class="card"><span class="n">Approach</span><h3>Product-first</h3><p>The problem and the user come before the technology choice.</p></article>
    </div>
  </div>
</section>

{bigtype(["We operate what we build.", "Built with purpose.", "Make every move wiser."])}

<section class="section">
  <div class="wrap">
    <div class="section-head reveal">
      <span class="eyebrow">Why we exist</span>
      <h2>We care about the whole product.</h2>
      <p>Plenty of software gets delivered and then quietly stops being useful. We're interested in the part that comes after the handover.</p>
    </div>
    <div class="rows reveal">
      <div class="row-item"><span class="n">01</span><div><h3>Product-first thinking</h3><p>We start with the problem, the users and the business outcome before choosing technology. That order matters — reversing it is how teams end up with something impressive that nobody needed.</p></div></div>
      <div class="row-item"><span class="n">02</span><div><h3>Built for real use</h3><p>Our products are designed around practical workflows and real-world requirements. Getvia and Vashq are used by actual businesses, and that feedback shapes everything else we build.</p></div></div>
      <div class="row-item"><span class="n">03</span><div><h3>Long-term thinking</h3><p>We build foundations that can evolve as products, businesses and customers grow, rather than optimising purely for the fastest possible first release.</p></div></div>
    </div>
  </div>
</section>

<section class="section section-alt">
  <div class="wrap">
    <div class="head-split">
      <div class="reveal"><span class="eyebrow">The ecosystem</span><h2>What we've built so far.</h2></div>
      <p class="reveal">Three products spanning business discovery, operations software and physical vehicle-care hardware.</p>
    </div>
    {product_cards()}
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="section-head reveal"><span class="eyebrow">Work with us</span><h2>A better way to build together.</h2></div>
    <div class="grid g-4 stagger">
      <article class="card"><span class="n">01</span><h4>Tell us the problem.</h4><p>Start with what's not working, not with a feature list.</p></article>
      <article class="card"><span class="n">02</span><h4>Define the product.</h4><p>We shape scope, timeline and approach together.</p></article>
      <article class="card"><span class="n">03</span><h4>Build the solution.</h4><p>Design and engineering with visible progress throughout.</p></article>
      <article class="card"><span class="n">04</span><h4>Move it forward.</h4><p>Support, iterate and scale after launch.</p></article>
    </div>
  </div>
</section>

{final_cta("Let's build something worth moving.")}
"""


def p_product_page(key):
    p = PRODUCTS[key]

    extras = {
        "getvia": {
            "eyebrow": "Live product",
            "lede": "A modern business discovery and listing platform connecting customers with trusted businesses.",
            "features": [
                ("search", "Business discovery", "Customers search and browse businesses by category, service and location."),
                ("users", "Verified profiles", "Businesses present a professional profile with services, details and contact options."),
                ("layers", "Service catalogues", "Structured listings so people can see what a business actually offers before enquiring."),
                ("mail", "Customer enquiries", "A direct channel from an interested customer to the business."),
                ("spark", "Reviews and trust", "Feedback that helps customers choose and helps good businesses stand out."),
                ("trend", "Business visibility", "A stronger digital presence for businesses that don't have one."),
            ],
        },
        "vashq": {
            "eyebrow": "Live product",
            "lede": "A car wash management platform that keeps daily operations organised in one system.",
            "features": [
                ("cube", "Jobs", "Track work from booking through completion without paper or spreadsheets."),
                ("users", "Customers", "A single customer record with history, contact details and past jobs."),
                ("support", "Employees", "Assign work, track who did what and keep the roster clear."),
                ("clock", "Bookings", "Manage the schedule and avoid double-booked bays and staff."),
                ("mail", "Invoices", "Generate and issue invoices tied to the job that produced them."),
                ("chart", "Expenses &amp; reports", "See what the business is actually earning and spending."),
            ],
        },
        "zed0": {
            "eyebrow": "Product",
            "lede": "A self-service car wash machine for convenient, customer-operated vehicle cleaning.",
            "features": [
                ("users", "Customer operated", "Designed so the customer runs the wash themselves, without an attendant."),
                ("cube", "Built for vehicle-care spaces", "Intended for modern car-care and vehicle service locations."),
                ("spark", "Simple to use", "A straightforward, accessible washing experience."),
            ],
        },
    }[key]

    feats = "".join(
        f'<article class="card"><div class="card-icon">{I[icon]}</div><h3>{t}</h3><p>{b}</p></article>'
        for icon, t, b in extras["features"]
    )

    visit = ""
    if p["url"]:
        visit = f'<a class="btn btn-primary btn-lg" href="{p["url"]}" target="_blank" rel="noopener noreferrer">Visit {p["name"]} {I["arrow_ur"]}</a>'

    gallery = f'<div class="shot"><img src="{p["shot"]}" alt="{p["shot_alt"]}" loading="lazy" width="1440" height="757"></div>'
    if p["shot2"]:
        gallery = (
            '<div class="grid g-2">'
            + gallery
            + f'<div class="shot"><img src="{p["shot2"]}" alt="{p["shot2_alt"]}" loading="lazy" width="1440" height="816"></div>'
            + "</div>"
        )

    note = ""
    if key == "zed0":
        note = f"""<section class="section section-alt">
  <div class="wrap wrap-narrow reveal">
    <div class="card">
      <div class="card-icon">{I['shield']}</div>
      <h3>ZED0 is hardware, not software.</h3>
      <p>ZED0 is a physical self-service car wash machine. It is not a SaaS product, a cloud platform or a business management application. Detailed technical specifications are shared directly on enquiry rather than published here.</p>
    </div>
  </div>
</section>"""

    return f"""<section class="page-head {key}">
  <div class="glow glow-a"></div>
  <div class="glow glow-b"></div>
  <div class="wrap">
    <span class="eyebrow">{extras['eyebrow']} — built by WiseMove</span>
    <div class="prod-logo my-tight">{p['logo']}<span class="prod-kind">{p['kind']}</span></div>
    <h1>{p['headline']}</h1>
    <p class="lede">{extras['lede']}</p>
    <div class="hero-cta mt-2 mb-0">
      {visit}
      <button type="button" class="btn btn-ghost btn-lg" data-modal-open>Enquire about {p['name']} {I['arrow']}</button>
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap reveal">{gallery}</div>
</section>

<section class="section section-alt">
  <div class="wrap">
    <div class="section-head reveal"><span class="eyebrow">Overview</span><h2>{p['name']} at a glance.</h2><p>{p['body']}</p></div>
    <div class="grid g-3 stagger">{feats}</div>
  </div>
</section>

{note}

<section class="section">
  <div class="wrap">
    <div class="head-split">
      <div class="reveal"><span class="eyebrow">The ecosystem</span><h2>How {p['name']} fits in.</h2></div>
      <p class="reveal">{p['name']} is one of three products WiseMove designs, builds and operates. See how they connect on the platform page.</p>
    </div>
    <div class="reveal"><a class="link-arrow" href="platform.html">Explore the WiseMove platform {I['arrow']}</a></div>
  </div>
</section>

{final_cta()}
"""


def p_contact():
    return f"""{page_head("Contact", 'Let\'s build your next <span class="accent">product.</span>',
    "Tell us what you're building — we'll come back with next steps and a clear estimate.")}

<section class="section">
  <div class="wrap">
    <div class="contact-grid">
      <div class="contact-detail reveal">
        <div class="cd-item"><div class="card-icon">{I['mail']}</div><div><small>Email</small><a href="mailto:{EMAIL}">{EMAIL}</a></div></div>
        <div class="cd-item"><div class="card-icon">{I['phone']}</div><div><small>Phone</small><a href="tel:{PHONE_RAW}">{PHONE_DISPLAY}</a></div></div>
        <div class="cd-item"><div class="card-icon">{I['pin']}</div><div><small>Address</small><address>{ADDRESS_1}<br>{ADDRESS_2}</address></div></div>
        <div class="cd-item"><div class="card-icon">{I['clock']}</div><div><small>Response time</small><span class="text-strong">Within one business day</span></div></div>
        <a class="btn btn-ghost" href="{WA}" target="_blank" rel="noopener noreferrer" class="self-start">Talk on WhatsApp {I['arrow_ur']}</a>
      </div>

      <div class="form-card reveal">
        <h2 class="text-h3 mb-05">Send an enquiry</h2>
        <p class="mb-2 text-sm">All fields except company and phone are required.</p>
        <form data-enquiry-form novalidate>
          <div class="field-row">
            <div class="field"><label for="c-name">Name</label><input type="text" id="c-name" name="name" autocomplete="name" placeholder="Your name" required></div>
            <div class="field"><label for="c-email">Email</label><input type="email" id="c-email" name="email" autocomplete="email" placeholder="you@company.com" required></div>
          </div>
          <div class="field-row">
            <div class="field"><label for="c-company">Company</label><input type="text" id="c-company" name="company" autocomplete="organization" placeholder="Company name"></div>
            <div class="field"><label for="c-phone">Phone</label><input type="tel" id="c-phone" name="phone" autocomplete="tel" placeholder="{PHONE_DISPLAY}"></div>
          </div>
          <div class="field"><label for="c-subject">Subject</label><input type="text" id="c-subject" name="subject" placeholder="What is this about?"></div>
          <div class="field"><label for="c-message">Message</label><textarea id="c-message" name="message" placeholder="Tell us what you're building" required></textarea></div>
          <button type="submit" class="btn btn-primary btn-block btn-lg">Send Enquiry {I['arrow']}</button>
          <p class="form-note" data-form-status>No backend is connected — submitting opens your email app with this enquiry addressed to {EMAIL}.</p>
        </form>
      </div>
    </div>
  </div>
</section>

<section class="section section-alt">
  <div class="wrap">
    <div class="section-head reveal"><span class="eyebrow">FAQ</span><h2>Questions, answered.</h2></div>
    <div class="reveal">{faq_block()}</div>
  </div>
</section>
"""


# ---- Legal ---------------------------------------------------------------

def legal_page(title, eyebrow, lede, sections, updated="1 September 2026"):
    body = ""
    for h, paras in sections:
        body += f"<h2>{h}</h2>"
        for para in paras:
            if isinstance(para, list):
                body += "<ul>" + "".join(f"<li>{x}</li>" for x in para) + "</ul>"
            else:
                body += f"<p>{para}</p>"

    return f"""{page_head(eyebrow, title, lede)}

<section class="section">
  <div class="wrap">
    <div class="legal reveal">
      <p class="updated">Last updated: {updated}</p>
      {body}
    </div>
  </div>
</section>
"""


PRIVACY = [
    ("Introduction", [
        f"This Privacy Policy explains how WiseMove Consultancy (\"WiseMove\", \"we\", \"us\") handles information in connection with this website. If you have any question about it, contact us at <a href=\"mailto:{EMAIL}\">{EMAIL}</a>.",
        "This policy covers this website only. Our products — Getvia, Vashq and ZED0 — are governed by their own terms and policies where applicable.",
    ]),
    ("Information We Collect", [
        "We collect only what you choose to send us. This website does not require an account and does not ask you to log in.",
        ["Information you submit through an enquiry form — your name, email address, and optionally your company, phone number, subject and message.",
         "Standard technical information your browser sends when requesting a page, such as IP address and user agent, which is handled by our hosting provider.",
         "Any information you include when you contact us directly by email, phone or WhatsApp."],
        "The enquiry forms on this site do not submit to a WiseMove server. Submitting a form opens your own email application with a pre-filled message addressed to us, which you then choose to send. Nothing is transmitted to us until you send that email.",
    ]),
    ("How We Use Information", [
        "We use the information you send us to respond to your enquiry, discuss a potential project, provide an estimate, and maintain a record of our correspondence with you.",
        "We do not sell your information. We do not use it for automated decision-making or profiling.",
    ]),
    ("Cookies", [
        "This website does not set advertising or tracking cookies.",
        "We store a single preference in your browser's local storage to remember whether you chose the light or dark colour theme. It contains no personal information and is never sent to us. Clearing your browser storage removes it.",
    ]),
    ("Analytics", [
        "At the time of writing, this website does not run third-party analytics. If that changes, this policy will be updated before any analytics service is added.",
    ]),
    ("Third-Party Services", [
        "This website loads fonts from Google Fonts, which means your browser makes a request to Google's servers when a page loads. Our site is hosted by a third-party hosting provider that processes standard server request logs on our behalf.",
        "Some pages link to external sites, including getvia.in, home.vashq.com and WhatsApp. Once you follow such a link, that site's own privacy policy applies.",
    ]),
    ("Data Security", [
        "We apply reasonable measures to protect the information we hold, including limiting access to correspondence to the people who need it. No method of transmission or storage is completely secure, and we cannot guarantee absolute security.",
    ]),
    ("Data Retention", [
        "We keep enquiry correspondence for as long as needed to respond to you and to maintain a reasonable business record. You can ask us to delete your correspondence at any time.",
    ]),
    ("Your Rights", [
        "Subject to applicable law, you may ask us to:",
        ["Confirm what information about you we hold.",
         "Provide a copy of that information.",
         "Correct information that is inaccurate.",
         "Delete information we no longer need to keep.",
         "Stop using your information for a particular purpose."],
        f"To make a request, email <a href=\"mailto:{EMAIL}\">{EMAIL}</a>. We will respond within a reasonable period.",
    ]),
    ("Children", [
        "This website is intended for businesses and adults. We do not knowingly collect information from children.",
    ]),
    ("Policy Updates", [
        "We may update this policy as our practices or the website change. The date at the top of this page shows when it was last revised.",
    ]),
    ("Contact", [
        f"WiseMove Consultancy<br>{ADDRESS_1}<br>{ADDRESS_2}<br>Email: <a href=\"mailto:{EMAIL}\">{EMAIL}</a><br>Phone: <a href=\"tel:{PHONE_RAW}\">{PHONE_DISPLAY}</a>",
    ]),
]

TERMS = [
    ("Agreement", [
        "These terms apply to your use of the WiseMove Consultancy website. By using the site, you accept them. If you do not accept them, please do not use the site.",
    ]),
    ("About This Website", [
        "This website presents information about WiseMove Consultancy, our services and the products we build. It is informational. Nothing on it constitutes a binding offer, a quotation, or professional advice for your specific situation.",
    ]),
    ("Enquiries and Estimates", [
        "Submitting an enquiry does not create a contract between us. Any estimate we provide in response is indicative until scope is agreed and a separate written agreement is signed.",
    ]),
    ("Intellectual Property", [
        "The WiseMove name, logo, site content and design are owned by WiseMove Consultancy unless stated otherwise. The Getvia, Vashq and ZED0 names and logos identify products built by WiseMove.",
        "You may view and share links to this site. You may not copy, republish or reuse its content or branding for commercial purposes without our written permission.",
    ]),
    ("Product Information", [
        "Descriptions of Getvia, Vashq and ZED0 on this site are general summaries provided for information. Product features may change. ZED0 is a physical self-service car wash machine; specifications are provided directly on enquiry.",
    ]),
    ("External Links", [
        "This site links to third-party websites, including getvia.in, home.vashq.com and WhatsApp. We are not responsible for the content, availability or practices of sites we do not control.",
    ]),
    ("Availability", [
        "We aim to keep the site available and accurate, but we do not guarantee uninterrupted availability or that every detail is free of error or fully current.",
    ]),
    ("Limitation of Liability", [
        "To the extent permitted by law, WiseMove Consultancy is not liable for indirect or consequential loss arising from your use of, or inability to use, this website. Nothing in these terms limits liability that cannot lawfully be limited.",
    ]),
    ("Governing Law", [
        "These terms are governed by the laws of India, and the courts of Kerala have jurisdiction over any dispute arising from them.",
    ]),
    ("Changes", [
        "We may revise these terms. The revision date at the top of this page indicates the current version.",
    ]),
    ("Contact", [
        f"Questions about these terms: <a href=\"mailto:{EMAIL}\">{EMAIL}</a>.",
    ]),
]

COOKIES = [
    ("Overview", [
        "This page explains how this website uses cookies and similar browser storage.",
        "This website does not use advertising cookies, tracking pixels or cross-site profiling.",
    ]),
    ("What We Store", [
        "We store one item in your browser's local storage:",
        ["<strong>wisemove-theme</strong> — remembers whether you selected the light or dark colour theme, so the site does not reset your choice on every visit."],
        "This value contains no personal information, is never transmitted to WiseMove, and stays on your device.",
    ]),
    ("Third-Party Requests", [
        "Loading a page makes a request to Google Fonts to retrieve the typefaces used on this site. That request is made by your browser directly to Google and is subject to Google's own policies.",
    ]),
    ("Managing Your Preferences", [
        "You can clear this site's local storage at any time through your browser's privacy or site-data settings. Doing so simply resets the theme to the default.",
        "Blocking storage entirely will not break the site — your theme choice just won't be remembered between visits.",
    ]),
    ("Changes", [
        "If we ever introduce analytics or other cookies, this page will be updated first.",
    ]),
    ("Contact", [
        f"Questions about this page: <a href=\"mailto:{EMAIL}\">{EMAIL}</a>.",
    ]),
]


def redirect_page(target, label):
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Redirecting to {label} | WiseMove Consultancy</title>
<meta name="description" content="This page has moved to {target}.">
<meta name="robots" content="noindex">
<link rel="canonical" href="{target}">
<meta http-equiv="refresh" content="0; url={target}">
<link rel="icon" type="image/png" href="assets/favicon.png">
<link rel="stylesheet" href="style.css">
</head>
<body>
<main id="main" class="section redirect-stage">
  <div class="wrap wrap-narrow">
    <h1 class="mb-1">This page has moved</h1>
    <p class="lede lede-centered">{label} now lives at a new address.</p>
    <a class="btn btn-primary btn-lg" href="{target}">Continue to {label}</a>
  </div>
</main>
<script>window.location.replace("{target}");</script>
</body>
</html>
"""


# --------------------------------------------------------------------------
# BUILD
# --------------------------------------------------------------------------

PAGES = [
    ("index.html", "WiseMove Consultancy | Software Product Studio in Kerala",
     "WiseMove builds software products end to end — strategy, design, engineering and support. Creators of Getvia, Vashq and ZED0.", p_index),
    ("work.html", "Work | Products Built by WiseMove Consultancy",
     "Getvia, Vashq and ZED0 — three products WiseMove designed, engineered, launched and continues to operate.", p_work),
    ("services.html", "Services | Product Strategy, Design & Engineering | WiseMove",
     "End-to-end software delivery from WiseMove Consultancy: product strategy, UI/UX design, engineering, launch and long-term support.", p_services),
    ("platform.html", "Platform | The WiseMove Product Ecosystem",
     "How Getvia, Vashq and ZED0 connect customers, businesses and operators across discovery, operations and on-the-ground service.", p_platform),
    ("how-it-works.html", "How It Works | The WiseMove Delivery Process",
     "Discovery, strategy, design, build, launch and scale — exactly what happens at each stage of a WiseMove project.", p_how),
    ("about.html", "About | WiseMove Consultancy, Kakkanad, Kerala",
     "WiseMove Consultancy is a software and product development company creating digital platforms, business solutions and vehicle-care products.", p_about),
    ("getvia.html", "Getvia | Business Discovery Platform by WiseMove",
     "Getvia is a business discovery and listing platform connecting customers with verified, trusted businesses.", lambda: p_product_page("getvia")),
    ("vashq.html", "Vashq | Car Wash Operations Software by WiseMove",
     "Vashq is a car wash management platform for jobs, customers, employees, bookings, invoices, expenses and reports.", lambda: p_product_page("vashq")),
    ("zed0.html", "ZED0 | Self-Service Car Wash Machine by WiseMove",
     "ZED0 is a self-service car wash machine designed for convenient, customer-operated vehicle cleaning.", lambda: p_product_page("zed0")),
    ("contact.html", "Contact | WiseMove Consultancy",
     f"Get in touch with WiseMove Consultancy at {EMAIL} or {PHONE_DISPLAY}. Based in Kakkanad, Kerala, India.", p_contact),
    ("privacy-policy.html", "Privacy Policy | WiseMove Consultancy",
     "How WiseMove Consultancy handles information submitted through this website.",
     lambda: legal_page("Privacy Policy", "Legal", "How we handle information in connection with this website.", PRIVACY)),
    ("terms.html", "Terms & Conditions | WiseMove Consultancy",
     "The terms that apply to your use of the WiseMove Consultancy website.",
     lambda: legal_page("Terms &amp; Conditions", "Legal", "The terms that apply to your use of this website.", TERMS)),
    ("cookie-policy.html", "Cookie Policy | WiseMove Consultancy",
     "How this website uses cookies and browser storage.",
     lambda: legal_page("Cookie Policy", "Legal", "What this website stores in your browser, and why.", COOKIES)),
]

REDIRECTS = [
    ("privacy.html", "privacy-policy.html", "Privacy Policy"),
    ("cookies.html", "cookie-policy.html", "Cookie Policy"),
    ("products.html", "work.html", "Work"),
    ("capabilities.html", "services.html", "Services"),
]


def main():
    written = []

    for filename, title, desc, fn in PAGES:
        html = head(filename, title, desc) + fn() + footer()
        html = re.sub(r"\n{3,}", "\n\n", html)
        with open(os.path.join(ROOT, filename), "w", encoding="utf-8") as f:
            f.write(html)
        written.append(filename)

    for filename, target, label in REDIRECTS:
        with open(os.path.join(ROOT, filename), "w", encoding="utf-8") as f:
            f.write(redirect_page(target, label))
        written.append(filename + "  (redirect -> " + target + ")")

    print("Built %d files:" % len(written))
    for w in written:
        print("  " + w)


if __name__ == "__main__":
    main()
