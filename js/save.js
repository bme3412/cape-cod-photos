const categoryButtons = document.querySelectorAll(".category-btn");
const filterContainer = document.getElementById("filter-container");
const filtersSection = document.getElementById("filters");
const resultsContainer = document.getElementById("results");

categoryButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const category = button.getAttribute("data-category");

    categoryButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    populateFilters(category);
    toggleFiltersSection(category);
    fetchAndDisplayResults(category);
  });
});

function fetchAndDisplayResults(category, filter) {
  if (category === "towns") {
    fetch("data/towns/towns.json")
      .then((response) => response.json())
      .then((data) => {
        if (filter) {
          const filteredData = data.towns.filter(
            (town) => town.filters[filter]
          );
          displayResults(filteredData);
        } else {
          resultsContainer.innerHTML = ""; // Clear results if no filter selected
        }
      })
      .catch((error) => console.error("Error fetching data:", error));
  }
}
function displayResults(towns) {
  resultsContainer.innerHTML = ""; // Clear current results

  if (towns.length > 0) {
    const town = towns[0];
    const townHtml = `
      <div class="town-container">
        <div class="town-info">
          <h2>${town.name}</h2>
          <p class="town-description">${town.description}</p>
        </div>
        <div class="grid-container">
          <div class="grid-item from-boston">
            <h3>From Boston</h3>
            <table>
              <tr>
                <td>Distance:</td>
                <td>${town.gettingThere.fromBoston.distance}</td>
              </tr>
              <tr>
                <td>Off-Season:</td>
                <td>${town.gettingThere.fromBoston.drivingTime.offSeason}</td>
              </tr>
              <tr>
                <td>Summer Weekday:</td>
                <td>${
                  town.gettingThere.fromBoston.drivingTime.summerWeekday
                }</td>
              </tr>
              <tr>
                <td>Summer Weekend:</td>
                <td>${
                  town.gettingThere.fromBoston.drivingTime.summerWeekend
                }</td>
              </tr>
              <tr>
                <td>Bus:</td>
                <td>${town.gettingThere.fromBoston.publicTransport.bus}</td>
              </tr>
              <tr>
                <td>Ferry:</td>
                <td>${town.gettingThere.fromBoston.publicTransport.ferry}</td>
              </tr>
            </table>
          </div>
          <div class="grid-item from-sagamore-bridge">
            <h3>From Sagamore Bridge</h3>
            <table>
              <tr>
                <td>Distance:</td>
                <td>${town.gettingThere.fromSagamoreBridge.distance}</td>
              </tr>
              <tr>
                <td>Off-Season:</td>
                <td>${
                  town.gettingThere.fromSagamoreBridge.drivingTime.offSeason
                }</td>
              </tr>
              <tr>
                <td>Summer Weekday:</td>
                <td>${
                  town.gettingThere.fromSagamoreBridge.drivingTime.summerWeekday
                }</td>
              </tr>
              <tr>
                <td>Summer Weekend:</td>
                <td>${
                  town.gettingThere.fromSagamoreBridge.drivingTime.summerWeekend
                }</td>
              </tr>
            </table>
          </div>
          ${town.villages
            .map(
              (village) => `
                <div class="grid-item village-box">
                  <h4>${village.name}</h4>
                  <div class="attractions">
                    <h5>Attractions:</h5>
                    <ul>
                      ${village.attractions
                        .map((attraction) => `<li>${attraction}</li>`)
                        .join("")}
                    </ul>
                  </div>
                  <div class="events">
                    <h5>Events:</h5>
                    <ul>
                      ${village.events
                        .map(
                          (event) => `
                            <li>
                              <strong>${event.name}</strong>
                              <p>${event.description}</p>
                              <p>Date: ${event.date}</p>
                            </li>
                          `
                        )
                        .join("")}
                    </ul>
                  </div>
                </div>
              `
            )
            .join("")}
        </div>
      </div>
    `;

    resultsContainer.innerHTML = townHtml;
  } else {
    resultsContainer.innerHTML = "<p>No results found.</p>";
  }
}
function populateFilters(category) {
  filterContainer.innerHTML = "";

  if (category === "towns") {
    // Add town-specific filters
    filterContainer.innerHTML = `
    <button class="filter" data-filter="greatBeaches">Great Beaches</button>
    <button class="filter" data-filter="whaleWatches">Whale Watches</button>
    <button class="filter">Local Art Scene</button>
    <button class="filter">Easy To Get To</button>
    <button class="filter">Wedding Venues</button>
    <button class="filter">Great Golf</button>
    <button class="filter">Bike Paths</button>
    <button class="filter">Lighthouses</button>
    <button class="filter">Deep Sea Fishing</button>
    <button class="filter">Family Friendly</button>
    <button class="filter">Dining Options</button>
    <button class="filter">Nightlife</button>
    <button class="filter">July 4th Events</button>
    <button class="filter">Cape Baseball Leage</button>
    <button class="filter">Shark-Free</button>
    <button class="filter">Mass Transit</button>
    <hr class="filter-divider">
    <button class="filter">🌉 Upper Cape</button>
    <button class="filter">🛣️ Mid-Cape</button>
    <button class="filter">🍇 Lower Cape</button>
    <button class="filter">🌊 Outer Cape</button>
    <button class="filter">🏞️ Cape Cod National Seashore</button>
    <button class="filter">🏝️ The Islands</button>
    <hr class="filter-divider">
    <button class="filter">👨‍👩‍👧‍👦 Family-Friendly</button>
    <button class="filter">🏰 Historical Sites</button>
    <button class="filter">🎨 Art Galleries</button>
    <button class="filter">🏖️ Beach Access</button>
    <button class="filter">🛍️ Shopping Districts</button>
    <button class="filter">🌲 Nature Trails</button>
    <button class="filter">🍸 Nightlife</button>
    <button class="filter">🦞 Local Cuisine</button>
    <button class="filter">🚌 Public Transport</button>
    <button class="filter">🐾 Pet-Friendly Areas</button>
    <button class="filter">🏠 Accommodations</button>
    <button class="filter">🍴 Restaurants</button>
    `;

    // Add click event listener to filter buttons
    const filterButtons = document.querySelectorAll(".filter");
    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const filter = button.getAttribute("data-filter");
        fetchAndDisplayResults("towns", filter);
      });
    });
  } else if (category === "beach") {
    // Add beach-specific filters
    filterContainer.innerHTML = `
      <button class="filter">Pet-Friendly</button>
      <button class="filter">Lifeguards On Duty</button>
      <button class="filter">Water Sports</button>
      <button class="filter">Soft Sand</button>
      <button class="filter">Rocky Shores</button>
      <button class="filter">Quiet Spots</button>
      <button class="filter">Family Areas</button>
      <button class="filter">Picnic Facilities</button>
      <button class="filter">Public Restrooms</button>
      <button class="filter">Boardwalks</button>
      <hr class="filter-divider">
      <button class="filter">🌉 Upper Cape</button>
    <button class="filter">🛣️ Mid-Cape</button>
    <button class="filter">🍇 Lower Cape</button>
    <button class="filter">🌊 Outer Cape</button>
    <button class="filter">🏞️ Cape Cod National Seashore</button>
    <button class="filter">🏝️ The Islands</button>
      <hr class="filter-divider">
      <button class="filter" data-town="Falmouth">🌊 Falmouth</button>
    <button class="filter" data-town="Bourne">⚓ Bourne</button>
    <button class="filter" data-town="Sandwich">🥪 Sandwich</button>
    <button class="filter" data-town="Barnstable">🐚 Barnstable</button>
    <button class="filter" data-town="Yarmouth">⛵ Yarmouth</button>
    <button class="filter" data-town="Dennis">🌅 Dennis</button>
    <button class="filter" data-town="Harwich">🐟 Harwich</button>
    <button class="filter" data-town="Brewster">🌿 Brewster</button>
    <button class="filter" data-town="Chatham">🦈 Chatham</button>
    <button class="filter" data-town="Orleans">🦞 Orleans</button>
    <button class="filter" data-town="Eastham">🌊 Eastham</button>
    <button class="filter" data-town="Wellfleet">🦪 Wellfleet</button>
    <button class="filter" data-town="Truro">🎨 Truro</button>
    <button class="filter" data-town="Provincetown">🌈 Provincetown</button>
    <button class="filter" data-town="Nantucket">⚓ Nantucket</button>
    <button class="filter" data-town="Martha's Vineyard">🍇 Martha's Vineyard</button>
    `;
  } else if (category === "things-to-do") {
    // Add activities-specific filters
    filterContainer.innerHTML = `
      <button class="filter">Outdoor Activities</button>
      <button class="filter">Cultural Events</button>
      <button class="filter">Children's Activities</button>
      <button class="filter">Nature Parks</button>
      <button class="filter">Boat Tours</button>
      <button class="filter">Fishing Spots</button>
      <button class="filter">Historical Tours</button>
      <button class="filter">Golf Courses</button>
      <button class="filter">Art Workshops</button>
      <button class="filter">Live Music</button>
      <button class="filter">Light Houses</button>
      <button class="filter">Bike Paths</button>
      <button class="filter">July 4th Fireworks</button>
      <button class="filter">July 4th Parades</button>
      <button class="filter">Cape League Baseball</button>
      <button class="filter">Ferries to Islands</button>
      <hr class="filter-divider">
      <button class="filter">🌉 Upper Cape</button>
    <button class="filter">🛣️ Mid-Cape</button>
    <button class="filter">🍇 Lower Cape</button>
    <button class="filter">🌊 Outer Cape</button>
    <button class="filter">🏞️ Cape Cod National Seashore</button>
    <button class="filter">🏝️ The Islands</button>
      <hr class="filter-divider">
      <button class="filter" data-town="Falmouth">🌊 Falmouth</button>
    <button class="filter" data-town="Bourne">⚓ Bourne</button>
    <button class="filter" data-town="Sandwich">🥪 Sandwich</button>
    <button class="filter" data-town="Barnstable">🐚 Barnstable</button>
    <button class="filter" data-town="Yarmouth">⛵ Yarmouth</button>
    <button class="filter" data-town="Dennis">🌅 Dennis</button>
    <button class="filter" data-town="Harwich">🐟 Harwich</button>
    <button class="filter" data-town="Brewster">🌿 Brewster</button>
    <button class="filter" data-town="Chatham">🦈 Chatham</button>
    <button class="filter" data-town="Orleans">🦞 Orleans</button>
    <button class="filter" data-town="Eastham">🌊 Eastham</button>
    <button class="filter" data-town="Wellfleet">🦪 Wellfleet</button>
    <button class="filter" data-town="Truro">🎨 Truro</button>
    <button class="filter" data-town="Provincetown">🌈 Provincetown</button>
    <button class="filter" data-town="Nantucket">⚓ Nantucket</button>
    <button class="filter" data-town="Martha's Vineyard">🍇 Martha's Vineyard</button>
    `;
  }
}

function toggleFiltersSection(category) {
  if (category) {
    filtersSection.classList.add("active");
  } else {
    filtersSection.classList.remove("active");
  }
}
document.addEventListener("DOMContentLoaded", () => {
  // Event listener for filter buttons
  const filterButtons = document.querySelectorAll(".filter");
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.getAttribute("data-filter");
      fetchAndDisplayResults("towns", filter);
    });
  });
});