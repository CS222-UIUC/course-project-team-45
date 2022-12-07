// Displays the map centered at UIUC
const APIKEY = config.APIKEY;
const UIUC = [-88.2272, 40.1020];

var map = tt.map({
  key: APIKEY,
  container: 'mymap',
  center: UIUC,
  zoom: 13,
  style: 'tomtom://vector/1/basic-main'
});

var markers = []; // Stores our markers
var locations = [];
var schedule = [];

// Resets the map / schedule display if you click another button
function clear_() {
  document.getElementById('classlist').innerHTML = '';
  document.getElementById('distance').innerHTML = '';
  document.getElementById('time').innerHTML = '';
  // Deletes marker data after plotting Route
  for (mark of markers) {
    mark.remove();
  }
  markers = [];
  locations = [];
  schedule = [];
}

// Adds location to map
function handleResults(result) {
  console.log(result)
  if (result.results) {
    // Creates a marker on lnglat
    const marker = new tt.Marker().setLngLat(result.results[0].position).addTo(map);
    markers.push(marker);
    locations.push(result.results[0].position);
  }
}

// Helps find location data
function search(address) {
  tt.services.fuzzySearch({
    key: APIKEY,
    query: address,
    boundingBox: map.getBounds()
  }).go().then(handleResults)
}

function displayRoute(geoJSON) {
  routeLayer = map.addLayer({
    id: 'route',
    type: 'line',
    source: {
      type: 'geojson',
      data: geoJSON
    },
    paint: {
      'line-color': 'blue',
      'line-width': 5
    }
  })
}

var routeIsDisplayed = false;

// Creates route from building address list
function createRoute() {
  var routeOptions = {
    key: APIKEY,
    locations: locations,
    travelMode: 'pedestrian'
  };
  tt.services.calculateRoute(routeOptions).go().then(
    function(routeData) {
      // Displays your distance and time
      document.getElementById('distance').innerHTML = 
        "<b>Total distance: " 
        + (routeData.routes[0].summary.lengthInMeters * 0.000621371).toFixed(2)
        + " mi</br>";
      document.getElementById('time').innerHTML = 
        "<b>Approximate Time: " 
        + Math.floor(routeData.routes[0].summary.travelTimeInSeconds / 60)
        + " min</b>";

      calculateBetween(routeData.routes[0].legs);

      console.log(routeData);
      // Geolocates our lnglat
      var geo = routeData.toGeoJson();
      displayRoute(geo);
    }
  );
  // Keep track if route is displayed in order to delete it later
  routeIsDisplayed = true;
}

function displaySchedule(section) {
  let element = `<b><u><p>${section.label} `
  element += `(${section.type})<br></u></b>`
  element = (section.start_time === 'ARRANGED') ? element + `${section.start_time}` : element + `${section.start_time} - ${section.end_time}<br>`
  element = (section.building === null) ? element + '<span id="buildingName">N/A<span><br>' : element + `${section.room} <span id="buildingName">${section.building}<span><br>`
  element += '</p>'
  return element
}

// Calculates our time and distance between classes
function calculateBetween(legs) {
  document.getElementById('classlist').innerHTML = '';

  for (let i = 0; i < schedule.length; i++) {
    // Does not display time/distance for first class
    // Displays time distance between classes
    if (i > 0) {
      let leg = legs[i - 1];
      document.getElementById('classlist').innerHTML 
        += "Distance: " 
        + (leg.summary.lengthInMeters * 0.000621371).toFixed(2)
        + " mi"
        + "<br>"
        + "Time: " 
        + Math.floor(leg.summary.travelTimeInSeconds / 60)
        + " min";
    }
    // Display classes
    document.getElementById('classlist').innerHTML += displaySchedule(schedule[i]);
  }
}

function plotMap(day) {
  clear_();
  // If the route is displayed on map refresh page to remove it
  if (routeIsDisplayed) { location.reload(); }  

  schedule = JSON.parse(window.localStorage.getItem('SORTED_SCHEDULE'))[day];

  if (schedule.length == 0) {
    document.getElementById('classlist').innerHTML = '<p>You have no classes on this day! :D</p>';
    return;
  }

  for (sched of schedule) {
    // Displays your classes
    document.getElementById('classlist').innerHTML += displaySchedule(sched);
    // Searches and plot the class location
    let building = sched.building.toUpperCase();
    let address = addressMap.get(building);
    // Finds the lng and lat of the building and stores them
    search(address);
  }
}