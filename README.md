# Portfolio — Engr. Jumilan L. Dela Peña

Personal portfolio and online résumé for **Engr. Jumilan L. Dela Peña** — licensed
Electronics Engineer and QA Automation Engineer based in Cagayan de Oro City,
Philippines.

**Live:** https://jumilandelapena.github.io/portfolio/

## Stack

A static single-page site. No build step, no package manager, no framework —
open `index.html` in a browser and it runs.

| | |
|---|---|
| Layout | Bootstrap 5.3 (CSS grid/utilities only; no Bootstrap JS) |
| Icons | Bootstrap Icons |
| Scroll reveal | AOS |
| Hero typing effect | Typed.js |
| Skill bar triggers | Waypoints |
| Contact form | Embedded Google Form |
| Hosting | GitHub Pages, served from `main` |

## Structure

```
index.html              the entire site — hero, about, skills, résumé,
                        certificates, contact
assets/
  css/main.css          all styling, including the blue theme override
                        at the end of the file
  js/main.js            nav, scrollspy, reveal-on-scroll, skill bars
  img/profile/          profile photos
  files/resume.pdf      downloadable résumé
  vendor/               third-party CSS/JS, pruned to only what the page loads
```

## Local development

No tooling required:

```sh
git clone https://github.com/jumilandelapena/portfolio.git
cd portfolio
```

Then open `index.html` directly, or serve it if you want the embedded Google
Form and relative URLs to behave exactly as they do in production:

```sh
python -m http.server 8000    # or: npx serve
```

## Deploying

Pushing to `main` publishes the site. GitHub Pages redeploys automatically.

## Notes

- `assets/vendor/` is intentionally trimmed to the ten files the page actually
  requests. If you add a component that needs Swiper, GLightbox, Isotope or
  Bootstrap's JS, restore that bundle from the upstream template *and* add its
  `<script>` tag back — `assets/js/main.js` no longer initialises them.
- The colour palette is a theme override block at the bottom of
  `assets/css/main.css`, which intentionally wins over the variables declared at
  the top of the file. Edit the override, not the originals.

## Credits

Built on the [SnapFolio](https://bootstrapmade.com/snapfolio-bootstrap-portfolio-template/)
template. Designed by [BootstrapMade](https://bootstrapmade.com/), used under its
template licence — the footer credit on `index.html` is a condition of the free
licence.

Site content, copy and images © Jumilan L. Dela Peña.
