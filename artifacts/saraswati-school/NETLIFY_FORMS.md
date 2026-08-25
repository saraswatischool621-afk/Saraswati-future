# Netlify Forms setup

The admissions form is a static Netlify Form. It does not use the Replit API server and can run from a Netlify-hosted site.

## Deploying to Netlify

1. Create a new Netlify site from this repository.
2. Set the **Base directory** to `artifacts/saraswati-school`. The included `netlify.toml` uses `pnpm run build` and publishes `dist/public`.
3. Deploy the site. The Vite configuration has safe production defaults, so no Replit-specific `PORT` or `BASE_PATH` variables are needed.

## After the first deploy

1. Open the Netlify site dashboard and choose **Forms**.
2. Confirm that **admission-enquiry** appears after the first deploy. Netlify stores each submission there.
3. In **Forms** → **Form notifications**, add an **Email notification** for `admission-enquiry`.
4. Enter `lewaedusaraswati@gmail.com` as the recipient and save the rule.

The form includes a honeypot field for basic automated-submission protection. Netlify handles form delivery and submission storage; no school email credentials are embedded in this website.