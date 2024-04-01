// Function to create a modal element
function createModal(modal) {
  var modalElement = document.createElement('div');
  modalElement.id = modal.id;
  modalElement.className = 'modal';

  var modalContent = document.createElement('div');
  modalContent.className = 'modal-content';

  var closeButton = document.createElement('span');
  closeButton.className = 'close';
  closeButton.innerHTML = '&times;';
  closeButton.addEventListener('click', function() {
    modalElement.style.display = 'none';
  });

  var title = document.createElement('h2');
  title.textContent = modal.title;

  var contentWrapper = document.createElement('div');
  
  if (modal.id === 'modal3') {
    // Handle the "Guides for Each Town" modal
    modal.content.forEach(function(townGuide) {
      var townElement = document.createElement('div');
      townElement.className = 'town-guide';

      var townName = document.createElement('h3');
      townName.textContent = townGuide.town;

      var tagline = document.createElement('div');
      tagline.innerHTML = townGuide.tagline;

      var description = document.createElement('div');
      description.innerHTML = townGuide.description;

      var pdfLink = document.createElement('a');
      pdfLink.className = 'pdf-link';
      pdfLink.href = townGuide.pdfLink;
      pdfLink.textContent = 'Download PDF Guide';

      townElement.appendChild(townName);
      townElement.appendChild(tagline);
      townElement.appendChild(description);
      townElement.appendChild(pdfLink);

      contentWrapper.appendChild(townElement);
    });
  } else {
    // Handle other modals
    contentWrapper.innerHTML = modal.content;
  }

  modalContent.appendChild(closeButton);
  modalContent.appendChild(title);
  modalContent.appendChild(contentWrapper);
  modalElement.appendChild(modalContent);

  return modalElement;
}

// Fetch the JSON data and create the modals
fetch('../data/guides/guides.json')
  .then(response => response.json())
  .then(data => {
    var modalContainer = document.getElementById('modal-container');

    data.forEach(function(modal) {
      var modalElement = createModal(modal);
      modalContainer.appendChild(modalElement);
    });

    // Add event listeners to guide elements
    var guides = document.querySelectorAll('.guide');
    guides.forEach(function(guide) {
      guide.addEventListener('click', function() {
        var modalId = this.getAttribute('data-modal');
        var modal = document.getElementById(modalId);
        modal.style.display = 'block';
      });
    });
  })
  .catch(error => {
    console.log('Error fetching JSON data:', error);
  });