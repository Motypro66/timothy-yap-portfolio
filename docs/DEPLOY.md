# Deployment

## GitHub Pages

- Repository: `Motypro66/timothy-yap-portfolio`
- Published URL: https://motypro66.github.io/timothy-yap-portfolio/
- Production branch: `main`
- Workflow: `.github/workflows/deploy.yml`
- Build: `npm ci` then `npm run build`
- Artifact: `out/`

The workflow already grants `pages: write` and `id-token: write` and uses the `github-pages` environment. It uploads the static export, then deploys with `actions/deploy-pages`.

## Paths and assets

`next.config.ts` sets `output: 'export'`, trailing slashes and the `/timothy-yap-portfolio` base path. `assetUrl()` prefixes public image and favicon paths. Next.js manages hashed JS, CSS and font URLs. The hero uses a custom static image loader; the About image is pre-optimized and does not require the Next.js image server.

The canonical URL, sitemap and social metadata use the GitHub Pages address. Existing root-hosted builds remain supported by `CF_PAGES=1` or `NEXT_PUBLIC_ROOT_BASE=1`; the public canonical remains GitHub Pages.

## Local preview

`npm run dev` starts Next.js. Open `http://localhost:3000/timothy-yap-portfolio/`. The dev wrapper also accepts hosted preview flags (`--host`, `--port`, `--strictPort`).

To verify a production export, serve `out/` under the `/timothy-yap-portfolio/` mount path. Serving it only at `/` does not reproduce GitHub Pages asset URLs.

## Verify after deployment

Check the workflow completes, then open the live URL and confirm images/fonts load, the People controls show 2/3/4, the tabs and accordions respond, and WhatsApp opens the intended `wa.me/60182982325` destination. Verify narrow mobile widths and motion controls. To roll back, revert the deployment commit; do not rewrite branch history.
