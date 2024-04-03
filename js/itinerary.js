// JavaScript code remains the same as in the previous response
document.getElementById('itineraryForm').addEventListener('submit', function(event) {
  event.preventDefault();
  var travelDates = document.getElementById('travelDates').value;
  var groupSize = parseInt(document.getElementById('groupSize').value);
  var groupType = document.getElementById('groupType').value;
  var interests = Array.from(document.getElementById('interests').selectedOptions).map(function(option) {
    return option.value;
  });
  var pace = document.getElementById('pace').value;
  var accommodationType = document.getElementById('accommodationType').value;
  var transportation = document.getElementById('transportation').value;
  var budget = document.getElementById('budget').value;
  var lengthOfStay = parseInt(document.getElementById('lengthOfStay').value);

  var itinerary = generateItinerary(travelDates, groupSize, groupType, interests, pace, accommodationType, transportation, budget, lengthOfStay);
  document.getElementById('itineraryResult').innerHTML = itinerary.join('<br>');
});

var activities = [
  { name: 'Activity 1', interests: ['outdoorActivities', 'adventure'], pace: 'packed', budget: 'midrange', time: 3 },
  { name: 'Activity 2', interests: ['culturalExperiences', 'foodAndDining'], pace: 'moderate', budget: 'midrange', time: 2 },
  { name: 'Activity 3', interests: ['relaxation', 'shopping'], pace: 'relaxed', budget: 'luxury', time: 4 },
  { name: 'Activity 4', interests: ['outdoorActivities', 'sports'], pace: 'packed', budget: 'budget', time: 5 },
  { name: 'Activity 5', interests: ['culturalExperiences', 'foodAndDining'], pace: 'moderate', budget: 'luxury', time: 3 },
  { name: 'Activity 6', interests: ['adventure', 'outdoorActivities'], pace: 'packed', budget: 'budget', time: 6 }
];

function generateItinerary(travelDates, groupSize, groupType, interests, pace, accommodationType, transportation, budget, lengthOfStay) {
  var filteredActivities = activities.filter(function(activity) {
    return activity.interests.some(function(interest) {
      return interests.includes(interest);
    }) && activity.pace === pace && activity.budget === budget;
  });

  if (filteredActivities.length === 0) {
    return ["No activities found matching the selected criteria."];
  }

  var itinerary = [];
  var totalTime = 0;
  for (var i = 0; i < filteredActivities.length && totalTime < lengthOfStay; i++) {
    itinerary.push(filteredActivities[i].name);
    totalTime += filteredActivities[i].time;
  }

  return itinerary;
}