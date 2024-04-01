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

    // Clear the active filters and remove 'active' class from filter buttons
    activeFilters = {};
    const filterButtons = document.querySelectorAll(".filter");
    filterButtons.forEach((btn) => btn.classList.remove("active"));

    if (category === "towns") {
      fetchAndDisplayResults(category);
    } else if (category === "beaches") {
      fetchAndDisplayResults(category);
    }
  });
});

function fetchAndDisplayResults(category, filters = {}) {
  const url =
    category === "towns"
      ? "../data/towns/towns.json"
      : "../data/beaches/beaches.json";

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      let items = category === "towns" ? data.towns : data.beaches;

      if (filters && Object.keys(filters).length > 0) {
        items = items.filter((item) => {
          return Object.entries(filters).every(([filterKey, isActive]) => {
            if (isActive) {
              if (filterKey === "town") {
                return item.town === filters.town;
              } else {
                return item.filters[filterKey];
              }
            }
            return true;
          });
        });
      }

      displayResults(items, category);
    })
    .catch((error) => console.error("Error fetching data:", error));
}

async function displayResults(items, category) {
  resultsContainer.innerHTML = ""; // Clear current results

  if (items.length > 0) {
    const grid = document.createElement("div");
    grid.classList.add("grid");

    for (const item of items) {
      const itemBox = document.createElement("div");
      itemBox.classList.add("item-box");

      const placeId = await getPlaceIdForItem(item.name, category);
      if (placeId) {
        const photoUrls = await fetchPhotosForPlaceId(placeId, 5);
        if (photoUrls.length > 0) {
          itemBox.innerHTML = `
            <div class="photo-container">
              <img src="${photoUrls[0]}" alt="${item.name}" class="active-photo">
              <div class="arrow-buttons">
                <button class="arrow-left">&lt;</button>
                <button class="arrow-right">&gt;</button>
              </div>
            </div>
            <div class="item-caption">${item.name}</div>
          `;

          const photoContainer = itemBox.querySelector(".photo-container");
          const photo = photoContainer.querySelector("img");
          const arrowLeft = itemBox.querySelector(".arrow-left");
          const arrowRight = itemBox.querySelector(".arrow-right");

          let currentPhotoIndex = 0;

          photoContainer.addEventListener("click", () => {
            expandPhoto(photoUrls, currentPhotoIndex);
          });

          arrowLeft.addEventListener("click", (event) => {
            event.stopPropagation();
            currentPhotoIndex =
              (currentPhotoIndex - 1 + photoUrls.length) % photoUrls.length;
            photo.src = photoUrls[currentPhotoIndex];
          });

          arrowRight.addEventListener("click", (event) => {
            event.stopPropagation();
            currentPhotoIndex = (currentPhotoIndex + 1) % photoUrls.length;
            photo.src = photoUrls[currentPhotoIndex];
          });
        } else {
          itemBox.innerHTML = `<div class="item-caption">${item.name}</div>`;
        }
      } else {
        itemBox.innerHTML = `<div class="item-caption">${item.name}</div>`;
      }

      grid.appendChild(itemBox);
    }

    resultsContainer.appendChild(grid);
    lazyLoadImages();
  } else {
    resultsContainer.innerHTML = "<p>No results found.</p>";
  }
}

let activeFilters = {};

function applyFilters(category) {
  const filteredResults = Object.entries(activeFilters).reduce(
    (acc, [filterKey, isActive]) => {
      if (isActive) {
        acc[filterKey] = true;
      }
      return acc;
    },
    {}
  );

  // Clear the previous results
  resultsContainer.innerHTML = "";

  if (category === "beaches") {
    const selectedTown = Object.keys(filteredResults).find((filter) =>
      filter.startsWith("town-")
    );
    if (selectedTown) {
      // If a town filter is selected for beaches, fetch and display beaches by town
      fetchAndDisplayResults(category, {
        town: selectedTown.replace("town-", ""),
      });
    } else {
      // If no town filter is selected, fetch and display results based on the selected beach filters
      fetchAndDisplayResults(category, filteredResults);
    }
  } else if (category === "towns") {
    // If the towns button is active, fetch and display results based on the selected town filters
    fetchAndDisplayResults(category, filteredResults);
  }
}

function populateFilters(category) {
  filterContainer.innerHTML = "";

  if (category === "towns") {
    // Add town-specific filters
    filterContainer.innerHTML = `
    <button class="filter" data-filter="greatBeaches">🏖️ Great Beaches</button>
    <button class="filter" data-filter="whaleWatches">🐋 Whale Watches</button>
    <button class="filter" data-filter="localArtScene">🎨 Local Art Scene</button>
    <button class="filter" data-filter="easyToGetTo">🚗 Easy To Get To</button>
    <button class="filter" data-filter="weddingVenues">💒 Wedding Venues</button>
    <button class="filter" data-filter="greatGolf">⛳ Great Golf</button>
    <button class="filter" data-filter="bikePaths">🚴 Bike Paths</button>
    <button class="filter" data-filter="lighthouses">🚨 Lighthouses</button>
    <button class="filter" data-filter="deepSeaFishing">🎣 Deep Sea Fishing</button>
    <button class="filter" data-filter="familyFriendly">👨‍👩‍👧‍👦 Family Friendly</button>
    <button class="filter" data-filter="diningOptions">🍽️ Dining Options</button>
    <button class="filter" data-filter="nightlife">🌃 Nightlife</button>
    <button class="filter" data-filter="july4thEvents">🎆 July 4th Events</button>
    <button class="filter" data-filter="capeBaseballLeague">⚾ Cape Baseball</button>
    <button class="filter" data-filter="sharkFree">🚫🦈 Shark-Free</button>
    <button class="filter" data-filter="massTransit">🚌 Mass Transit</button>
    <hr class="filter-divider">
    <button class="filter" data-filter="upperCape">🌉 Upper Cape</button>
    <button class="filter" data-filter="midCape">🛣️ Mid-Cape</button>
    <button class="filter" data-filter="lowerCape">🍇 Lower Cape</button>
    <button class="filter" data-filter="outerCape">🌊 Outer Cape</button>
    <button class="filter" data-filter="nationalSeashore">🏞️ National Seashore</button>
    <button class="filter" data-filter="islands">🏝️ The Islands</button>
    <hr class="filter-divider"> 
    <button class="filter" data-filter="familyFriendly">👨‍👩‍👧‍👦 Family-Friendly</button> 
    <button class="filter" data-filter="historicalSites">🏰 Historical Sites</button> 
    <button class="filter" data-filter="artGalleries">🎨 Art Galleries</button> 
    <button class="filter" data-filter="beachAccess">🏖️ Beach Access</button> 
    <button class="filter" data-filter="shoppingDistricts">🛍️ Shopping Districts</button> 
    <button class="filter" data-filter="natureTrails">🌲 Nature Trails</button> 
    <button class="filter" data-filter="nightlife">🍸 Nightlife</button> 
    <button class="filter" data-filter="localCuisine">🦞 Local Cuisine</button> 
    <button class="filter" data-filter="publicTransport">🚌 Public Transport</button> 
    <button class="filter" data-filter="petFriendlyAreas">🐾 Pet-Friendly Areas</button> 
    <button class="filter" data-filter="accommodations">🏠 Accommodations</button> 
    <button class="filter" data-filter="restaurants">🍴 Restaurants</button>
    `;

    // Add click event listener to filter buttons
    const filterButtons = document.querySelectorAll(".filter");
    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const filter = button.getAttribute("data-filter");
        activeFilters[filter] = !activeFilters[filter];
        applyFilters(category);

        // Toggle the 'active' class on the clicked button
        button.classList.toggle("active");
      });
    });
  } else if (category === "beaches") {
    // Add beach-specific filters
    filterContainer.innerHTML = `
  <button class="filter" data-filter="petFriendly">🐾 Pet-Friendly</button>
  <button class="filter" data-filter="lifeguards">🚨 Lifeguards On Duty</button>
  <button class="filter" data-filter="waterSports">🏄‍♂️ Water Sports</button>
  <button class="filter" data-filter="softSand">🏖️ Soft Sand</button>
  <button class="filter" data-filter="rockyShores">🪨 Rocky Shores</button>
  <button class="filter" data-filter="quietSpots">🔇 Quiet Spots</button>
  <button class="filter" data-filter="familyAreas">👨‍👩‍👧‍👦 Family Areas</button>
  <button class="filter" data-filter="picnicFacilities">🧺 Picnic Facilities</button>
  <button class="filter" data-filter="publicRestrooms">🚻 Public Restrooms</button>
  <button class="filter" data-filter="boardwalks">🚶‍♀️ Boardwalks</button>
  <button class="filter" data-filter="ampleParking">🅿️ Ample Parking</button>
  <button class="filter" data-filter="sharkFree">🦈🚫 Shark-Free</button>
  <button class="filter" data-filter="warmWater">🌡️ Warm Water</button>
  <button class="filter" data-filter="boatRamp">🛶 Boat Ramp</button>
  <hr class="filter-divider">
      <button class="filter" data-region="Upper Cape">🌉 Upper Cape</button>
      <button class="filter" data-region="Mid-Cape">🛣️ Mid-Cape</button>
      <button class="filter" data-region="Lower Cape">🍇 Lower Cape</button>
      <button class="filter" data-region="Outer Cape">🌊 Outer Cape</button>
      <button class="filter" data-region="Cape Cod National Seashore">🏞️ National Seashore</button>
      <button class="filter" data-region="The Islands">🏝️ The Islands</button>
      <hr class="filter-divider">
  <button class="filter" data-filter="town-Falmouth">🌊 Falmouth</button>
  <button class="filter" data-filter="town-Bourne">⚓ Bourne</button>
  <button class="filter" data-filter="town-Sandwich">🥪 Sandwich</button>
  <button class="filter" data-filter="town-Barnstable">🐚 Barnstable</button>
  <button class="filter" data-filter="town-Yarmouth">⛵ Yarmouth</button>
  <button class="filter" data-filter="town-Dennis">🌅 Dennis</button>
  <button class="filter" data-filter="town-Harwich">🐟 Harwich</button>
  <button class="filter" data-filter="town-Brewster">🌿 Brewster</button>
  <button class="filter" data-filter="town-Chatham">🦈 Chatham</button>
  <button class="filter" data-filter="town-Orleans">🦞 Orleans</button>
  <button class="filter" data-filter="town-Eastham">🌊 Eastham</button>
  <button class="filter" data-filter="town-Wellfleet">🦪 Wellfleet</button>
  <button class="filter" data-filter="town-Truro">🎨 Truro</button>
  <button class="filter" data-filter="town-Provincetown">🌈 Provincetown</button>
  <button class="filter" data-filter="town-Nantucket">⚓ Nantucket</button>
  <button class="filter" data-filter="town-Martha\'s Vineyard">🍇 Martha's Vineyard</button>
`;
    // Add click event listener to beach filter buttons
    const filterButtons = document.querySelectorAll(".filter");
    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const filter = button.getAttribute("data-filter");
        const region = button.getAttribute("data-region");
        
        if (filter) {
          activeFilters[filter] = !activeFilters[filter];
        } else if (region) {
          activeFilters.region = region;
        }
        
        applyFilters(category);

        // Toggle the 'active' class on the clicked button
        button.classList.toggle("active");
      });
    });
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
      const category = document
        .querySelector(".category-btn.active")
        .getAttribute("data-category");
      const filter = button.getAttribute("data-filter");
      const town = button.getAttribute("data-town");
      const region = button.getAttribute("data-region");

      if (filter) {
        activeFilters[filter] = !activeFilters[filter];
      } else if (town) {
        activeFilters.town = town;
      } else if (region) {
        activeFilters.region = region;
      }

      applyFilters(category);
    });
  });
});

function fetchPhotosForPlaceId(placeId, count) {
  return new Promise((resolve, reject) => {
    const service = new google.maps.places.PlacesService(
      document.createElement("div")
    );
    service.getDetails(
      {
        placeId: placeId,
        fields: ["photos"],
      },
      (place, status) => {
        if (
          status === google.maps.places.PlacesServiceStatus.OK &&
          place.photos &&
          place.photos.length > 0
        ) {
          // Sort the photos based on their rating in descending order
          const sortedPhotos = place.photos.sort(
            (a, b) => (b.rating || 0) - (a.rating || 0)
          );

          // Get the URLs of the top-rated photos
          const photoUrls = sortedPhotos
            .slice(0, count)
            .map((photo) => photo.getUrl({ maxWidth: 400, maxHeight: 400 }));
          resolve(photoUrls);
        } else {
          resolve([]);
        }
      }
    );
  });
}

function getPlaceIdForItem(itemName, category) {
  return new Promise((resolve, reject) => {
    const request = {
      query: itemName + ", Cape Cod, MA",
      fields: ["place_id"],
    };
    const service = new google.maps.places.PlacesService(
      document.createElement("div")
    );
    service.findPlaceFromQuery(request, (results, status) => {
      if (
        status === google.maps.places.PlacesServiceStatus.OK &&
        results.length > 0
      ) {
        resolve(results[0].place_id);
      } else {
        resolve(null);
      }
    });
  });
}

function lazyLoadImages() {
  const lazyImages = document.querySelectorAll(".lazy");

  const options = {
    rootMargin: "0px",
    threshold: 0.1,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        const src = img.getAttribute("data-src");
        img.setAttribute("src", src);
        img.classList.remove("lazy");
        observer.unobserve(img);
      }
    });
  }, options);

  lazyImages.forEach((image) => {
    observer.observe(image);
  });
}

function expandPhoto(photoUrls, currentIndex) {
  const overlay = document.createElement("div");
  overlay.classList.add("overlay");

  const expandedPhoto = document.createElement("img");
  expandedPhoto.src = photoUrls[currentIndex];
  expandedPhoto.classList.add("expanded-photo");

  const arrowLeft = document.createElement("button");
  arrowLeft.innerHTML = "&lt;";
  arrowLeft.classList.add("arrow-left");

  const arrowRight = document.createElement("button");
  arrowRight.innerHTML = "&gt;";
  arrowRight.classList.add("arrow-right");

  const closeButton = document.createElement("button");
  closeButton.innerHTML = "&times;";
  closeButton.classList.add("close-button");
  closeButton.addEventListener("click", () => {
    overlay.remove();
  });

  overlay.appendChild(arrowLeft);
  overlay.appendChild(expandedPhoto);
  overlay.appendChild(arrowRight);
  overlay.appendChild(closeButton);
  document.body.appendChild(overlay);

  let currentPhotoIndex = currentIndex;

  arrowLeft.addEventListener("click", () => {
    currentPhotoIndex =
      (currentPhotoIndex - 1 + photoUrls.length) % photoUrls.length;
    expandedPhoto.src = photoUrls[currentPhotoIndex];
  });

  arrowRight.addEventListener("click", () => {
    currentPhotoIndex = (currentPhotoIndex + 1) % photoUrls.length;
    expandedPhoto.src = photoUrls[currentPhotoIndex];
  });
}
