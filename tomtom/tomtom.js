// Displays the map centered at UIUC
const APIKEY = '2qRsV2zsyz62ggkkqfXG2xWuqrnOaGSi';
const UIUC = [-88.2272, 40.1020];

var map = tt.map({
  key: APIKEY,
  container: 'mymap',
  center: UIUC,
  zoom: 13,
  style: 'tomtom://vector/1/basic-main'
});

var markers = []; // Stores our markers
var num_clicks = 0; // Keeps track of num of clicks and helps delete route layer ;-;

// Does the moving map animation when you insert a location
// function moveMap() {
//   var lng = 0;
//   var lat = 0;
//   for(mark of markers) {
//       lng += mark.getLngLat()[0];
//       lat += mark.getLngLat()[1];
//   }
//   lng = lng / markers.length;
//   lat = lat / markers.length;

//   map.flyTo({
//     center: [lng,lat],
//     zoom: 18
//   });
// }

// Resets the map / schedule display if you click another button
function clear_() {
  document.getElementById('classlist').innerHTML = '';
  document.getElementById('distance').innerHTML = '';
  document.getElementById('time').innerHTML = '';
  map.removeLayer('route' + num_clicks.toString());
}

// Handles search results
function handleResults (result) {
  console.log(result)
  if (result.results) {
    // Creates a marker on lnglat
    const marker = new tt.Marker()
      .setLngLat(result.results[0].position)
      .addTo(map);
    markers.push(marker);
  }
}

// Helps find location data
function search (address) {
  tt.services.fuzzySearch({
    key: APIKEY,
    query: address,
    boundingBox: map.getBounds()
  }).go().then(handleResults)
}

function displayRoute(geoJSON) {
  routeLayer = map.addLayer({
    // Created a unique id bc deleting it is a pain
    'id' : 'route' + num_clicks.toString(),
    'type' : 'line',
    'source' : {
      'type' : 'geojson',
      'data' : geoJSON
    },
    'paint' : {
      'line-color' : 'blue',
      'line-width' : 4,
    }
  });
}

// Creates route from building address list
function createRoute() {
  var routeOptions = {
    key: APIKEY,
    locations: [],
    travelMode: 'pedestrian'
  };
  for (mark of markers) {
    routeOptions.locations.push(mark.getLngLat());
  }
  tt.services.calculateRoute(routeOptions).go().then(
    function(routeData) {
      // Displays your distance and time
      document.getElementById('distance').innerHTML = 
        "Total distance: " 
        + (routeData.routes[0].summary.lengthInMeters * 0.000621371).toFixed(2)
        + " miles";
      document.getElementById('time').innerHTML = 
        "Approximate Time: " 
        + (routeData.routes[0].summary.travelTimeInSeconds / 60).toFixed(2)
        + " min";

      console.log(routeData);
      // Geolocates our lnglat
      var geo = routeData.toGeoJson();
      // Displays a customizable route
      displayRoute(geo);
    }
  );
}

function displaySchedule(section) {
  let element = `<p>${section.label} `
  element += `(${section.type})<br>`
  element = (section.building === null) ? element + 'Location: <span id="buildingName">N/A<span><br>' : element + `Location: ${section.room} <span id="buildingName">${section.building}<span><br>`
  element = (section.start_time === 'ARRANGED') ? element + `Time: ${section.start_time}` : element + `Time: ${section.start_time} - ${section.end_time}`
  element += '<br></p>'
  return element
}

function displayScheduleRoute(day) {
  // Resets classes, distance, and time
  clear_();
  num_clicks ++;

  const schedule = JSON.parse(window.localStorage.getItem('SCHEDULE'));

  let num_Classes = 0;

  for (let i = 0; i < schedule.length; i++) {
    if (schedule[i].days_of_week.includes(day)) {
      // Displays your classes
      document.getElementById('classlist').innerHTML += displaySchedule(schedule[i]);
      // Searches and plot the class location
      let building = schedule[i].building.toUpperCase();
      let address = addressMap.get(building);
      // Finds the lng and lat of the building and stores them
      search(address);

      num_Classes ++;
    }
  }
  if (num_Classes == 0) {
    document.getElementById('classlist').innerHTML = '<p>You have no classes on this day! :D</p>';
    return;
  }
  // Displays the route corresponding to each day
  createRoute();
  
  // Moves map based on the average lnglat of each location
  // moveMap();
  
  // Deletes marker data after plotting Route
  for (mark of markers) {
    mark.remove();
  }
  markers = [];
}