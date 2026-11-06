# TravelBloom – Travel Recommendation Website

Final project for **JavaScript Programming Essentials** (IBM Skills Network).

TravelBloom is a travel recommendation website. Visitors type a keyword in the search bar and get destination recommendations, each with an image, a description, the current local time and the nearest airport.

## Features

- **Home page** with an introduction to the website and a navigation bar containing **Home**, **About Us**, **Contact Us**, a **search input**, and **Search** and **Clear** buttons.
- **Keyword search** using JavaScript `fetch()` to load `travel_recommendation_api.json`:
  - `beach` / `beaches` → beach recommendations
  - `temple` / `temples` → temple recommendations
  - `country` / `countries` → two cities from each country
  - A country or place name (for example `japan` or `kyoto`) → matching places
  - Keywords work in any letter case and with extra spaces.
- **Clear** button empties the search box and the results.
- **About Us** page with company information, the team and guidelines for team members.
- **Contact Us** page with contact information and a form (name, email, message) that opens the visitor's email app with the message ready to send.
- Local time for each destination using `toLocaleTimeString` with the destination's time zone.
- Responsive layout (desktop and phone) and light/dark mode.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Home page (introduction, navbar with search, results) |
| `about.html` | About Us page |
| `contact.html` | Contact Us page with the email form |
| `travel_recommendation.css` | Styles for all pages |
| `travel_recommendation.js` | Search, results, Clear button and contact form logic |
| `travel_recommendation_api.json` | Recommendation data (countries, temples, beaches) |
| `images/` | Destination illustrations |

## Run locally

`fetch()` does not work when an HTML file is opened directly from disk, so use a local server:

- **VS Code:** install the *Live Server* extension, right-click `index.html` and choose **Open with Live Server**.
- **Python:** run `python -m http.server` in this folder and open http://localhost:8000.

## Deploy on GitHub Pages

1. Push these files to the root of a public GitHub repository.
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to *Deploy from a branch*, choose the `main` branch and the `/ (root)` folder, then **Save**.
4. After a minute the site is live at `https://<your-username>.github.io/<repository-name>/`.

## Changing the contact email

Replace `contact@travelbloom.example` with your own email address in `contact.html` using Find and Replace (it appears in the email link and in the form's `action`).
