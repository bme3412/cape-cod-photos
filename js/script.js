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

function fetchAndDisplayResults(category, townFilter) {
  if (category === "towns") {
    fetch("data/towns/towns.json")
      .then((response) => response.json())
      .then((data) => {
        if (townFilter) {
          const filteredData = data.towns.filter(
            (town) => town.name === townFilter
          );
          displayResults(filteredData);
        } else {
          displayResults(data.towns);
        }
      })
      .catch((error) => console.error("Error fetching data:", error));
  }
}
function displayResults(towns) {
  resultsContainer.innerHTML = ""; // Clear current results

  if (towns.length > 0) {
    const townsHtml = towns
      .map(
        (town) => `
      <div class="town-container">
        <div class="town-info">
          <h2>${town.name}</h2>
          <p class="town-description">${town.description}</p>
          <div class="getting-there">
            <h3>Getting There</h3>
            <div class="from-boston">
              <h4>From Boston</h4>
              <p>Distance: ${town.gettingThere.fromBoston.distance}</p>
              <div class="driving-time">
                <p>Off-Season: ${
                  town.gettingThere.fromBoston.drivingTime.offSeason
                }</p>
                <p>Summer Weekday: ${
                  town.gettingThere.fromBoston.drivingTime.summerWeekday
                }</p>
                <p>Summer Weekend: ${
                  town.gettingThere.fromBoston.drivingTime.summerWeekend
                }</p>
              </div>
              <div class="public-transport">
                <p>Bus: ${town.gettingThere.fromBoston.publicTransport.bus}</p>
                <p>Ferry: ${
                  town.gettingThere.fromBoston.publicTransport.ferry
                }</p>
              </div>
            </div>
            <div class="from-sagamore-bridge">
              <h4>From Sagamore Bridge</h4>
              <p>Distance: ${town.gettingThere.fromSagamoreBridge.distance}</p>
              <div class="driving-time">
                <p>Off-Season: ${
                  town.gettingThere.fromSagamoreBridge.drivingTime.offSeason
                }</p>
                <p>Summer Weekday: ${
                  town.gettingThere.fromSagamoreBridge.drivingTime.summerWeekday
                }</p>
                <p>Summer Weekend: ${
                  town.gettingThere.fromSagamoreBridge.drivingTime.summerWeekend
                }</p>
              </div>
            </div>
            <p class="crowdedness">Crowdedness: ${
              town.gettingThere.crowdedness
            }</p>
            <div class="tips">
              <h4>Tips</h4>
              <ul>
                ${town.gettingThere.tips
                  .map((tip) => `<li>${tip}</li>`)
                  .join("")}
              </ul>
            </div>
          </div>
        </div>
        <div class="town-villages">
          <h3>Things to Do in ${town.name}:</h3>
          <ul>
            ${town.villages
              .map(
                (village) => `
              <li>
                <h4>${village.name}</h4>
                <h5>Attractions:</h5>
                <ul>
                  ${village.attractions
                    .map((attraction) => `<li>${attraction}</li>`)
                    .join("")}
                </ul>
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
              </li>
            `
              )
              .join("")}
          </ul>
        </div>
      </div>
    `
      )
      .join("");
    resultsContainer.innerHTML = townsHtml;
  } else {
    resultsContainer.innerHTML = "<p>No results found.</p>";
  }
}

function populateFilters(category) {
  filterContainer.innerHTML = "";

  if (category === "towns") {
    // Add town-specific filters
    filterContainer.innerHTML = `
      <button class="filter" data-town="Falmouth">Falmouth</button>
      <button class="filter" data-town="Bourne">Bourne</button>
      <button class="filter" data-town="Sandwich">Sandwich</button>
      <button class="filter" data-town="Barnstable">Barnstable</button>
      <button class="filter" data-town="Yarmouth">Yarmouth</button>
      <button class="filter" data-town="Dennis">Dennis</button>
      <button class="filter" data-town="Harwich">Harwich</button>
      <button class="filter" data-town="Brewster">Brewster</button>
      <button class="filter" data-town="Chatham">Chatham</button>
      <button class="filter" data-town="Orleans">Orleans</button>
      <button class="filter" data-town="Eastham">Eastham</button>
      <button class="filter" data-town="Wellfleet">Wellfleet</button>
      <button class="filter" data-town="Truro">Truro</button>
      <button class="filter" data-town="Provincetown">Provincetown</button>
      <button class="filter" data-town="Nantucket">Nantucket</button>
      <button class="filter" data-town="Martha's Vineyard">Martha's Vineyard</button>
      <hr class="filter-divider">
      <button class="filter">Upper Cape</button>
      <button class="filter">Mid-Cape</button>
      <button class="filter">Lower Cape</button>
      <button class="filter">Outer Cape</button>
      <button class="filter">Cape Cod National Seashore</button>
      <button class="filter">The Islands</button>
      <hr class="filter-divider">
      <button class="filter">Family-Friendly</button>
      <button class="filter">Historical Sites</button>
      <button class="filter">Art Galleries</button>
      <button class="filter">Beach Access</button>
      <button class="filter">Shopping Districts</button>
      <button class="filter">Nature Trails</button>
      <button class="filter">Nightlife</button>
      <button class="filter">Local Cuisine</button>
      <button class="filter">Public Transport</button>
      <button class="filter">Pet-Friendly Areas</button>
      <button class="filter">Accommodations</button>
      <button class="filter">Restaurants</button>
    `;

    // Add click event listener to filter buttons
    const filterButtons = document.querySelectorAll(".filter[data-town]");
    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const townName = button.getAttribute("data-town");
        fetchAndDisplayResults("towns", townName);
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
      <button class="filter">Upper Cape</button>
      <button class="filter">Mid-Cape</button>
      <button class="filter">Lower Cape</button>
      <button class="filter">Outer Cape</button>
      <button class="filter">Cape Cod National Seashore</button>
      <button class="filter">The Islands</button>
      <hr class="filter-divider">
      <button class="filter">Falmouth</button>
      <button class="filter">Bourne</button>
      <button class="filter">Sandwich</button>
      <button class="filter">Barnstable</button>
      <button class="filter">Yarmouth</button>
      <button class="filter">Dennis</button>
      <button class="filter">Harwich</button>
      <button class="filter">Brewster</button>
      <button class="filter">Chatham</button>
      <button class="filter">Orleans</button>
      <button class="filter">Eastham</button>
      <button class="filter">Wellfleet</button>
      <button class="filter">Truro</button>
      <button class="filter">Provincetown</button>
      <button class="filter">Nantucket</button>
      <button class="filter">Martha's Vineyard</button>
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
      <button class="filter">Upper Cape</button>
      <button class="filter">Mid-Cape</button>
      <button class="filter">Lower Cape</button>
      <button class="filter">Outer Cape</button>
      <button class="filter">Cape Cod National Seashore</button>
      <button class="filter">The Islands</button>
      <hr class="filter-divider">
      <button class="filter">Falmouth</button>
      <button class="filter">Bourne</button>
      <button class="filter">Sandwich</button>
      <button class="filter">Barnstable</button>
      <button class="filter">Yarmouth</button>
      <button class="filter">Dennis</button>
      <button class="filter">Harwich</button>
      <button class="filter">Brewster</button>
      <button class="filter">Chatham</button>
      <button class="filter">Orleans</button>
      <button class="filter">Eastham</button>
      <button class="filter">Wellfleet</button>
      <button class="filter">Truro</button>
      <button class="filter">Provincetown</button>
      <button class="filter">Nantucket</button>
      <button class="filter">Martha's Vineyard</button>
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
