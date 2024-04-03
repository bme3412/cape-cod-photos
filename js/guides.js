document.addEventListener("DOMContentLoaded", function() {
  const guides = document.querySelectorAll(".guide");
  const modalContainer = document.getElementById("modal-container");

  guides.forEach(function(guide) {
    guide.addEventListener("click", function() {
      const modalId = this.getAttribute("data-modal");

      fetch("../data/guides/guides.json")
        .then(response => response.json())
        .then(data => {
          const modalData = data.find(modal => modal.id === modalId);
          if (modalData) {
            if (modalId === "modal3") {
              const modal3 = createModal3(modalData);
              modalContainer.appendChild(modal3);
              modal3.style.display = "block";
            } else {
              const modal = createModal(modalData);
              modalContainer.appendChild(modal);
              modal.style.display = "block";
            }
          }
        })
        .catch(error => {
          console.log('Error fetching JSON data:', error);
        });
    });
  });

  function createModal3(data) {
    const modal3 = document.createElement("div");
    modal3.id = "modal3";
    modal3.classList.add("modal");

    const modalContent = document.createElement("div");
    modalContent.classList.add("modal-content");

    const closeButton = document.createElement("span");
    closeButton.classList.add("close");
    closeButton.innerHTML = "&times;";
    closeButton.addEventListener("click", function() {
      modal3.style.display = "none";
    });

    const title = document.createElement("h2");
    title.textContent = "Guides for Each Town";

    const townGuidesContainer = document.createElement("div");
    townGuidesContainer.id = "town-guides-container";

    data.content.forEach(function(townGuide) {
      const townElement = document.createElement("div");
      townElement.classList.add("town-guide");

      const townName = document.createElement("h3");
      townName.classList.add("town-tagline");
      townName.innerHTML = townGuide.tagline;

      const description = document.createElement("div");
      description.classList.add("town-description");
      description.innerHTML = townGuide.description;

      const pdfLink = document.createElement("a");
      pdfLink.classList.add("town-pdf-link");
      pdfLink.href = townGuide.pdfLink;
      pdfLink.textContent = `Download ${townGuide.town} Guide`;

      townElement.appendChild(townName);
      townElement.appendChild(description);
      townElement.appendChild(pdfLink);

      townGuidesContainer.appendChild(townElement);
    });

    modalContent.appendChild(closeButton);
    modalContent.appendChild(title);
    modalContent.appendChild(townGuidesContainer);
    modal3.appendChild(modalContent);

    return modal3;
  }

  function createModal(data) {
    const modal = document.createElement("div");
    modal.id = data.id;
    modal.classList.add("modal");

    const modalContent = document.createElement("div");
    modalContent.classList.add("modal-content");

    const closeButton = document.createElement("span");
    closeButton.classList.add("close");
    closeButton.innerHTML = "&times;";
    closeButton.addEventListener("click", function() {
      modal.style.display = "none";
    });

    const title = document.createElement("h2");
    title.textContent = data.title;

    const contentWrapper = document.createElement("div");
    contentWrapper.innerHTML = data.content;

    modalContent.appendChild(closeButton);
    modalContent.appendChild(title);
    modalContent.appendChild(contentWrapper);
    modal.appendChild(modalContent);

    return modal;
  }
});