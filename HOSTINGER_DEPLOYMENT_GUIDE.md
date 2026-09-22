# Hostinger Deployment Guide for Apex Trade Hub

This application is built with **React + TypeScript + Vite + Tailwind CSS**. It compiles into a static production bundle ready to be hosted on **Hostinger Web Hosting (Shared, Cloud, or VPS)**.

---

## Method 1: Upload via Hostinger File Manager (Quickest & Easiest)

### Step 1: Build the Production Bundle
On your local machine or terminal, run:
```bash
npm install
npm run build
```
This generates a `dist/` folder containing all compiled HTML, CSS, JavaScript, assets, and the configured `.htaccess` file.

### Step 2: Compress the `dist` Folder
- Open your file explorer and go into the `dist` folder.
- Select all contents inside `dist` (`index.html`, `assets/`, `.htaccess`, etc.) and compress them into a `.zip` file (e.g. `website-build.zip`).

### Step 3: Upload to Hostinger hPanel
1. Log into your **Hostinger Account** -> go to **hPanel**.
2. Select your domain or website.
3. Click on **Files** -> **File Manager** (or access via FTP).
4. Navigate to the `public_html` directory of your website.
5. *(Optional)* If there is a default `default.php` or placeholder file, delete it.
6. Click **Upload** (top right) and upload your `website-build.zip`.
7. Right-click the uploaded `.zip` file and click **Extract**.
8. Make sure `index.html` and the `assets/` folder are located directly in `public_html`.
9. Delete the `.zip` file.

Your website is now **live** on your Hostinger domain with instant SSL and high performance!

---

## Method 2: Deploy via Hostinger Git (Continuous Deployment)

If you have your project pushed to GitHub or GitLab:

1. In Hostinger **hPanel**, search for **Git** under **Advanced**.
2. Paste your repository URL and choose the `main` branch.
3. Set the directory to `public_html`.
4. Click **Create**.
5. When deploying updates, simply click **Deploy** in the Git section.
*(Note: If Hostinger Git does not run npm build automatically on your plan, you can push the pre-built `dist/` files or use a GitHub Action to deploy directly to Hostinger FTP).*

---

## Included Hostinger Optimizations

- **Apache / LiteSpeed `.htaccess` Pre-configured**:
  Included in the build to ensure Single Page Application (SPA) routing works without 404 errors when reloading pages.
- **Aggressive Asset Caching**:
  Images, fonts, and JavaScript chunks have expiration headers configured for maximum speed and Google PageSpeed scores on Hostinger LiteSpeed servers.
- **Directory Protection**:
  `-Indexes` enabled to prevent public directory browsing.
