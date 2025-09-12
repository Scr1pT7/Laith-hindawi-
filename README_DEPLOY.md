# Deploy to GitHub Pages – laithhindawi.cloud

This folder is ready to upload to a GitHub repository and publish with **GitHub Pages**.

## Quick Steps
1. Create a new repository on GitHub (e.g., `portfolio`).
2. Upload **all files** from this folder to the repository root (including the `CNAME` file).
3. Go to **Settings → Pages**:
   - **Build and deployment:** *Deploy from a branch*
   - **Branch:** `main` / `(root)`
   - **Custom domain:** `laithhindawi.cloud` and **Save**
4. On your domain DNS, create **A records** for the apex:
   - `@ → 185.199.108.153`
   - `@ → 185.199.109.153`
   - `@ → 185.199.110.153`
   - `@ → 185.199.111.153`
5. (Optional) For `www` subdomain: `www → CNAME → <your-username>.github.io`
6. After DNS propagates, in **Settings → Pages** click **Enforce HTTPS**.

If your site doesn't load, double-check that:
- The repository contains an `index.html` at the root (`FOUND`).
- The `CNAME` file contains `laithhindawi.cloud`.
- DNS records are correct and have finished propagating.
