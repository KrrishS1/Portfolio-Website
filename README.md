# Krrish Shah — personal website

Plain HTML, CSS and JavaScript. No build step, no framework, nothing to install. Open `index.html` in a browser and it works.

## Pages

```
index.html               Home
about.html               About me
degree.html              Degree, courses, timeline
portfolio.html           Engineering + Commerce project grids
fun.html                 The non-resume page
resume.html              Resume highlights + link to resume.pdf
contact.html             Contact links
projects/rover.html      Full rover write-up (interactive)
projects/capsule-x.html  Placeholder for the next project
404.html                 Not-found page
css/site.css             One stylesheet for every page
js/site.js               Progress bar, reveal animation, light/dark toggle
assets/                  Site-wide images (favicon, og.png)
projects/rover/assets/   Rover photos, CAD, video
sitemap.xml, robots.txt  For Google
```

## Things marked for you to fill in

Anything with a dashed amber outline and a ✎ mark on the page is a placeholder. Search the files for `todo`:

- High-school line on `degree.html`, career sentence on `about.html`
- GitHub link, once you want one on the site
- Fun page cards
- `assets/og.png`: a 1200×630 image shown when the link is shared on LinkedIn. Any photo or a screenshot of the home page works.

## Add a project page

1. Copy `projects/capsule-x.html` to a new file, e.g. `projects/drone-mount.html`.
2. Replace the heading, subtitle and body. Put images in `projects/<name>/assets/`.
3. Add a card on `portfolio.html` pointing at the new file.
4. Add the page to `sitemap.xml`.

Or paste your notes into Claude and ask for a page in the same style as the rover one.

## How it's published

- Code lives on GitHub: `github.com/KrrishS1/website`
- Hosted on Vercel, connected to that repo, at **https://krrishshah.com**
- Every push to the `main` branch goes live in about a minute. The link never changes, so printed QR codes stay valid.

To change something yourself: edit the file on GitHub (pencil icon) and commit. Vercel redeploys on its own.

## Get found on Google for your name

1. **Domain with your name** — the strongest single signal.
2. **Google Search Console** (search.google.com/search-console, free). Add the domain, verify it with the DNS record Google gives you, submit `sitemap.xml`, then open *URL inspection* for the home page and click *Request indexing*.
3. **Link to the site from profiles Google already trusts**: LinkedIn (Contact info → Website, and the Featured section), GitHub profile, club pages, email signature.
4. Keep page titles in the form `Something | Krrish Shah`. They already are.
5. Expect a few days to a few weeks. Check progress by searching `site:yourdomain.com`.

## QR code

Generate it only after the final domain works. Point it at the home page. Scan it with your own phone before printing.
