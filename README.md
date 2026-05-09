# Prof. Yendoubé Lare — Personal Website

A clean, modern academic website for the Laboratoire sur l'Énergie Solaire, Université de Lomé, built as static HTML/CSS for hosting on GitHub Pages with a custom subdomain (`lesul.groupebm.net`).

## Structure

```
.
├── index.html          # Home (hero + recent news)
├── about.html          # Biography
├── research.html       # Three research axes
├── publications.html   # Selected publications
├── teaching.html       # Courses + syllabus links
├── people.html         # PhD and Master's students
├── join.html           # How to apply to the group
├── gallery.html        # Event/site visit photos
├── contact.html        # Email, phone, affiliations
├── CNAME               # Custom domain for GitHub Pages
├── .nojekyll           # Disable Jekyll processing
├── assets/
│   ├── css/styles.css  # All site styling
│   ├── js/site.js      # Mobile nav, lightbox, active link
│   ├── images/         # Profile photo, research figures, gallery
│   └── syllabi/        # Course PDF syllabi
```

## Local preview

Any static-file server works. Easiest options:

```bash
# Python 3
python -m http.server 8000

# Node (with npx)
npx serve .
```

Then open <http://localhost:8000>.

## Deployment (GitHub Pages + GoDaddy)

1. Push this folder to a new GitHub repo (any name, e.g. `ylare-site`)
2. In repo Settings → Pages: source = `main` branch, root folder
3. The `CNAME` file already sets the custom domain to `lesul.groupebm.net`
4. In GoDaddy DNS, add a `CNAME` record:
   - Host: `lesul`
   - Points to: `<your-github-username>.github.io`
   - TTL: 1 hour
5. Wait 5–30 min for DNS, then enable "Enforce HTTPS" in repo Pages settings.

## Updating content

All content is plain HTML — edit the relevant `.html` file in any text editor. Image and PDF assets live under `assets/`. Add new files there and reference them with relative paths (e.g. `assets/images/new-photo.jpg`).
