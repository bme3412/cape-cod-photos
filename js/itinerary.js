document.getElementById('itineraryForm').addEventListener('submit', function(event) {
    event.preventDefault();
    var demographics = document.getElementById('demographics').value;
    var lengthOfStay = parseInt(document.getElementById('lengthOfStay').value);
    var interests = Array.from(document.getElementById('interests').selectedOptions).map(function(option) {
      return option.value;
    });
    var transportation = document.getElementById('transportation').value;
    var town = document.getElementById('town').value;
  
    var itinerary = generateItinerary(demographics, lengthOfStay, interests, transportation, town);
    document.getElementById('itineraryResult').innerHTML = itinerary.join('<br>');
  });
  
  var activities = [
    { name: 'Activity 1', town: 'town1', interests: ['beach', 'nature'], distance: 5, time: 2, opening: '9:00', closing: '17:00' },
    { name: 'Activity 2', town: 'town1', interests: ['history', 'food'], distance: 10, time: 3, opening: '10:00', closing: '18:00' },
    { name: 'Activity 3', town: 'town2', interests: ['beach', 'food'], distance: 15, time: 4, opening: '11:00', closing: '19:00' },
    { name: 'Activity 4', town: 'town2', interests: ['history', 'nature'], distance: 20, time: 5, opening: '12:00', closing: '20:00' },
    { name: 'Activity 5', town: 'town3', interests: ['beach', 'history'], distance: 25, time: 6, opening: '13:00', closing: '21:00' },
    { name: 'Activity 6', town: 'town3', interests: ['food', 'nature'], distance: 30, time: 7, opening: '14:00', closing: '22:00' }
  ];
  
  function generateItinerary(demographics, lengthOfStay, interests, transportation, town) {
    var filteredActivities = activities.filter(function(activity) {
      return activity.town === town && activity.interests.some(function(interest) {
        return interests.includes(interest);
      });
    });
  
    if (filteredActivities.length === 0) {
      return ["No activities found matching the selected criteria."];
    }
  
    filteredActivities.sort(function(a, b) {
      if (transportation === 'car') {
        return a.distance - b.distance;
      } else {
        return a.time - b.time;
      }
    });
  
    var itinerary = [];
    var totalTime = 0;
    for (var i = 0; i < filteredActivities.length && totalTime < lengthOfStay; i++) {
      itinerary.push(filteredActivities[i].name);
      totalTime += filteredActivities[i].time;
    }
  
    return itinerary;
  }