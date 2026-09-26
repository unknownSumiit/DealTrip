# DealTrip static website

A zero-framework static website designed for GitHub + Azure Static Web Apps. There is no build command.

## Deploy to Azure Static Web Apps

1. Create a new GitHub repository and upload **the contents of this folder** to the repository root.
2. In Azure Portal, create **Static Web App** and connect the GitHub repository.
3. Build preset: **Custom**.
4. App location: `/`
5. API location: leave blank.
6. Output location: leave blank.
7. Let Azure create the GitHub Actions workflow and deploy.
8. Add your custom domain in Azure Static Web Apps.

## Before using Google Ads

The website contains the pages and trust signals commonly needed for a legitimate advertising destination, but **no website can guarantee Google Ads approval**. Google reviews the ad, advertiser account, business identity, claims, destination, policy history and other signals.

Complete these items before launching ads:

- Confirm you own or control `dealtrip.com`. If your real domain is different, replace `https://dealtrip.com` in `sitemap.xml`, canonical tags and `robots.txt`.
- Confirm `hello@dealtrip.com` is a working mailbox. If not, replace it everywhere before launch.
- Add your actual legal/business identity information where appropriate if it differs from the DealTrip brand. Do not invent an address.
- Re-check every listed offer against its official merchant source. Remove expired or unavailable offers.
- Never advertise a coupon or savings claim that cannot be found easily on the landing page.
- Do not imply an official partnership with a merchant unless you have one.
- Keep Google AdsBot and ordinary U.S. visitors able to access the landing page.
- Do not add forced pop-ups, auto-downloads or misleading buttons.
- If you add analytics, remarketing or ad pixels, update the Privacy Policy and add consent controls where legally required.
- If you add a newsletter or contact form, make it fully functional and update the Privacy Policy to describe the data collected.

## Editing deals

Starter listings are in `assets/deals.json`. Each record includes merchant, title, age, category, summary, restrictions, official source URL and verification date.

## Performance choices

- No framework/runtime
- No external font requests
- No icon library
- No third-party JavaScript
- No hero image payload
- One CSS file + one small JavaScript file
- Native system fonts

## Adding Google Analytics / Google Ads tags

They are intentionally NOT bundled. Add them only after you have configured privacy/consent requirements for the states/countries you serve. If you add third-party scripts, update the Content-Security-Policy in `staticwebapp.config.json`.

## Important

This package contains general website legal-language templates, not legal advice. Have the Privacy Policy, Terms and disclosure language reviewed for your actual business entity, affiliate programs, data collection and jurisdictions before commercial launch.


## Azure styling safeguard

This release embeds the critical CSS, JavaScript and starter deal data directly into every HTML page. This avoids a deployment issue where `/assets/styles.css` or `/assets/app.js` is not published or is served from the wrong path. The `/assets` folder is still included as a source/backup copy.

If an older deployment appears as plain, unstyled HTML, replace the repository contents with this release and let the Azure Static Web Apps GitHub Action finish a fresh deployment.
