# Deployment Guide for `ylare.groupebm.net`

This walks through publishing the site to GitHub Pages with a custom subdomain on your existing GoDaddy `groupebm.net` domain. Total time, about 15 to 30 minutes plus DNS propagation wait.

## Step 1, Activate the contact form (5 minutes)

The contact form on `contact.html` uses **Formspree**, a free service that delivers form submissions straight to an inbox. Without setup, the form will fall back to opening the visitor's email client.

1. Go to <https://formspree.io> and click **Sign up**. Use your own email (not the professor's) to avoid asking him for verification codes.
2. Once signed in, click **+ New Form**.
3. Set the destination email to `yenlare@yahoo.fr` (or whichever address the professor wants the messages delivered to).
4. Formspree will give you an endpoint that looks like `https://formspree.io/f/abcdwxyz`.
5. Open `contact.html` in any text editor, find this line:
   ```html
   <form id="contact-form" action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
   ```
   and replace `YOUR_FORM_ID` with the part Formspree gave you.
6. Save. The first time someone submits the form, Formspree may ask the professor to confirm the email address (one click). Free tier allows 50 submissions per month.

## Step 2, Create a GitHub repository

1. Sign in to GitHub at <https://github.com> with your own account, no need for the professor to have one.
2. Click the **+** in the top right, then **New repository**.
3. Settings:
   - **Repository name:** `ylare-site` (or any name you like, the repo name is invisible to visitors)
   - **Public** (required for free GitHub Pages)
   - Do **not** check "Add a README", the folder already has one.
4. Click **Create repository**.
5. On the next page, copy the HTTPS URL shown, it looks like:
   ```
   https://github.com/YOUR-USERNAME/ylare-site.git
   ```

## Step 3, Push the site files

Open a terminal (PowerShell or Git Bash on Windows) and run, line by line, replacing `YOUR-USERNAME`:

```bash
cd "C:\Users\bawan\Downloads\ylare-site"
git init -b main
git add .
git commit -m "Initial site"
git remote add origin https://github.com/YOUR-USERNAME/ylare-site.git
git push -u origin main
```

If prompted, sign in to GitHub. If you don't have Git installed yet, get it from <https://git-scm.com/download/win>.

## Step 4, Enable GitHub Pages

1. In the new repo on GitHub, go to **Settings**, then **Pages** (left sidebar).
2. Under **Build and deployment**:
   - **Source:** *Deploy from a branch*
   - **Branch:** `main`, folder `/ (root)`, click **Save**.
3. Wait about a minute, refresh. You'll see:
   > Your site is ready to be published at <https://YOUR-USERNAME.github.io/ylare-site/>
4. Under **Custom domain**, the field should already say `ylare.groupebm.net` because the `CNAME` file is in the repo. If not, type it in and click **Save**.
5. GitHub will start a DNS check, it will fail at first because we haven't set up DNS yet. That's expected.

## Step 5, Configure DNS in GoDaddy

1. Sign in at <https://godaddy.com>, go to **My Products**, then **Domains**.
2. Find **`groupebm.net`**, click the three dot menu, then **Manage DNS** (or click the domain name then **DNS**).
3. Scroll to the **Records** section. Click **Add New Record**.
4. Fill in exactly:
   - **Type:** `CNAME`
   - **Name:** `ylare`
   - **Value:** `YOUR-USERNAME.github.io` (replace with your actual GitHub username, no `https://`, no trailing slash)
   - **TTL:** `1 Hour`
5. Click **Save**.

> **Note:** A CNAME record only works on a subdomain like `ylare.groupebm.net`, not the root domain. Since you wanted a subdomain, this is the right setup.

## Step 6, Wait, then verify

1. DNS usually propagates within 5 to 30 minutes (occasionally up to a few hours).
2. Test in a fresh browser tab: <http://ylare.groupebm.net>
3. Back in GitHub repo, Settings, Pages, the DNS check should show a green checkmark.
4. Once green, check **Enforce HTTPS**, this gives you free SSL (a padlock icon).

## Step 7, Update citation statistics (every 1 to 3 months)

The Publications page shows a Citation Statistics block with totals from Google Scholar. These numbers are hardcoded because Google Scholar does not allow live programmatic access. To refresh them:

1. Visit <https://scholar.google.com/citations?user=4pouJkEAAAAJ&hl=fr> in any browser.
2. Note the four numbers from the right side panel: total Citations, h-index (indice h), i10-index (indice i10), and citations since 2021.
3. Open `publications.html` in a text editor.
4. Find the section that begins with `<!-- CITATION STATS, Google Scholar.` (around line 60).
5. Update each `<div class="metric-value">XXX</div>` with the current number.
6. Update the `data-updated="YYYY-MM-DD"` attribute on the `<section class="citation-stats">` line with today's date.
7. Save, commit, and push (see Step 8 below).

The "Last updated" line on the page will format the date automatically in English or French depending on the visitor's selected language.

## Step 8, Update content later

Any time you want to change something:

```bash
cd "C:\Users\bawan\Downloads\ylare-site"
# edit files in any text editor (VS Code, Notepad++, etc.)
git add .
git commit -m "describe what you changed"
git push
```

The site rebuilds automatically within about a minute of pushing.

## Troubleshooting

**"DNS check unsuccessful" stays red after an hour:**
- Verify the GoDaddy CNAME points to `YOUR-USERNAME.github.io` (exact, no extra characters).
- Try `nslookup ylare.groupebm.net` in PowerShell, it should return your GitHub Pages address.
- If GoDaddy added a trailing dot, that's fine.

**Site shows a 404 page:**
- In repo Settings, Pages, confirm the branch is `main` and folder is `/ (root)`.
- Confirm the file `index.html` is at the repo root (not inside a subfolder).

**Old, cached version showing:**
- Hard refresh: `Ctrl + Shift + R` in the browser.
- Or try in an incognito window.

**Contact form does nothing or errors:**
- Confirm step 1 was completed and the `YOUR_FORM_ID` placeholder was replaced.
- Check the Formspree dashboard for confirmation status (the destination email may need a one time confirmation click).

**Need to remove the custom domain later:**
- Delete the `CNAME` file from the repo, push the change, then remove the custom domain in repo Settings, Pages.

## Optional next steps

- **Add a favicon:** drop a `favicon.ico` in the root folder and add `<link rel="icon" href="favicon.ico">` to each page's `<head>`.
- **Track visits:** add Google Analytics or [Plausible](https://plausible.io) (privacy friendly).
- **Custom error page:** create `404.html` for missing pages.
- **More languages:** the EN/FR system is already in place, add a third language by adding a third toggle button and `data-lang="xx"` content tags.
