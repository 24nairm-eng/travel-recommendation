// TravelBloom - Travel Recommendation website
// Home page: fetches the recommendation data and shows results for the keyword typed in the search bar.
// Contact page: turns the contact form into a ready-to-send email in the visitor's email app.

const DATA_URL = "travel_recommendation_api.json";
let travelData = null;

// ---------- Load the data with fetch() ----------
async function loadTravelData() {
  if (travelData) return travelData;
  const response = await fetch(DATA_URL);
  if (!response.ok) {
    throw new Error("Could not load " + DATA_URL + " (status " + response.status + ")");
  }
  travelData = await response.json();
  console.log("Travel recommendation data loaded:", travelData);
  return travelData;
}

// ---------- Match a keyword to recommendations ----------
// Accepts different forms of the keyword: "beach", "Beaches", " BEACH ", "temple", "temples",
// "country", "countries", or a country or place name such as "japan" or "rio".
function getRecommendations(data, rawKeyword) {
  const keyword = rawKeyword.trim().toLowerCase();

  if (/\bbeach(es)?\b/.test(keyword)) {
    return { title: "Beach recommendations", items: data.beaches };
  }

  if (/\btemples?\b/.test(keyword)) {
    return { title: "Temple recommendations", items: data.temples };
  }

  if (/\bcountr(y|ies)\b/.test(keyword)) {
    const cities = data.countries.flatMap((country) => country.cities);
    return { title: "Country recommendations", items: cities };
  }

  // A specific country name, e.g. "japan" or "Brazil"
  const country = data.countries.find((c) => c.name.toLowerCase() === keyword);
  if (country) {
    return { title: "Recommendations in " + country.name, items: country.cities };
  }

  // Any place whose name contains the keyword, e.g. "kyoto", "taj", "bora"
  const everything = [
    ...data.countries.flatMap((c) => c.cities),
    ...data.temples,
    ...data.beaches,
  ];
  const matches = everything.filter((place) => place.name.toLowerCase().includes(keyword));
  return { title: "Results for “" + rawKeyword.trim() + "”", items: matches };
}

// ---------- Local time for a destination ----------
function localTime(timeZone) {
  try {
    return new Date().toLocaleTimeString("en-US", {
      timeZone: timeZone,
      hour: "numeric",
      minute: "2-digit",
    });
  } catch (error) {
    return null;
  }
}

// ---------- Build one result card ----------
function createResultCard(place) {
  const card = document.createElement("article");
  card.className = "result-card";

  const img = document.createElement("img");
  img.src = place.imageUrl;
  img.alt = "Illustration of " + place.name;
  img.loading = "lazy";

  const body = document.createElement("div");
  body.className = "result-body";

  const title = document.createElement("h3");
  title.textContent = place.name;

  const description = document.createElement("p");
  description.textContent = place.description;

  const meta = document.createElement("div");
  meta.className = "result-meta";

  const time = localTime(place.timeZone);
  if (time) {
    const timeEl = document.createElement("span");
    timeEl.textContent = "Local time: " + time;
    meta.appendChild(timeEl);
  }

  if (place.airport) {
    const airport = document.createElement("span");
    airport.className = "chip";
    airport.title = "Nearest airport";
    airport.textContent = "✈ " + place.airport;
    meta.appendChild(airport);
  }

  const visit = document.createElement("a");
  visit.className = "visit";
  visit.href = "https://www.google.com/maps/search/" + encodeURIComponent(place.name);
  visit.target = "_blank";
  visit.rel = "noopener";
  visit.textContent = "Visit →";
  meta.appendChild(visit);

  body.append(title, description, meta);
  card.append(img, body);
  return card;
}

// ---------- Show results / messages ----------
function showResults(title, items) {
  const panel = document.getElementById("results");
  const list = document.getElementById("resultsList");
  document.getElementById("resultsTitle").textContent = title;
  document.getElementById("resultsCount").textContent =
    items.length === 1 ? "1 place" : items.length + " places";

  list.innerHTML = "";
  items.forEach((place) => list.appendChild(createResultCard(place)));
  panel.hidden = false;
}

function showMessage(title, message) {
  const panel = document.getElementById("results");
  const list = document.getElementById("resultsList");
  document.getElementById("resultsTitle").textContent = title;
  document.getElementById("resultsCount").textContent = "";
  list.innerHTML = "";
  const p = document.createElement("p");
  p.className = "empty";
  p.textContent = message;
  list.appendChild(p);
  panel.hidden = false;
}

// ---------- Search button ----------
async function handleSearch(event) {
  if (event) event.preventDefault();
  const input = document.getElementById("searchInput");
  const keyword = input.value;

  if (!keyword.trim()) {
    showMessage("Search", "Type a keyword such as beach, temple or country, then press Search.");
    return;
  }

  try {
    const data = await loadTravelData();
    const result = getRecommendations(data, keyword);
    if (result.items.length === 0) {
      showMessage(
        "No results",
        "We have no recommendations for “" + keyword.trim() + "” yet. Try beach, temple or country."
      );
    } else {
      showResults(result.title, result.items);
    }
  } catch (error) {
    console.error(error);
    showMessage(
      "Could not load recommendations",
      "The recommendation data could not be loaded. Open the site through a web server (GitHub Pages or VS Code Live Server) rather than as a local file."
    );
  }
}

// ---------- Clear button ----------
function clearResults() {
  const input = document.getElementById("searchInput");
  input.value = "";
  document.getElementById("resultsList").innerHTML = "";
  document.getElementById("results").hidden = true;
  input.focus();
}

// ---------- Contact form ----------
function handleContactSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const status = document.getElementById("formStatus");

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const name = form.elements.name.value.trim();
  const email = form.elements.email.value.trim();
  const message = form.elements.message.value.trim();
  const to =
    (form.getAttribute("action") || "").replace("mailto:", "") ||
    document.getElementById("contactEmail").textContent.trim();

  const subject = "Travel enquiry from " + name;
  const body = message + "\n\nFrom: " + name + "\nReply to: " + email;
  window.location.href =
    "mailto:" + to + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);

  status.textContent =
    "Thank you, " + name + ". Your email app should now open with your message ready to send. " +
    "If it doesn't, email us at " + to + ".";
}

// ---------- Wire everything up ----------
document.addEventListener("DOMContentLoaded", () => {
  const searchForm = document.getElementById("searchForm");
  if (searchForm) {
    searchForm.addEventListener("submit", handleSearch);
    document.getElementById("btnClear").addEventListener("click", clearResults);

    document.querySelectorAll("[data-keyword]").forEach((tile) => {
      tile.addEventListener("click", () => {
        document.getElementById("searchInput").value = tile.dataset.keyword;
        handleSearch();
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    });

    loadTravelData().catch((error) => console.error(error));
  }

  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", handleContactSubmit);
  }
});
