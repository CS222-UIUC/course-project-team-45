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

// Resets the map / schedule display if you click another button
function clear_() {
  document.getElementById('classlist').innerHTML = '';
  document.getElementById('distance').innerHTML = '';
  document.getElementById('time').innerHTML = '';
  // Deletes marker data after plotting Route
  // for (mark of markers) {
  //   mark.remove();
  // }
  // markers = [];
}

// Adds location to map
function handleResults(result) {
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

var doubleClick = false;
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
      if (!doubleClick) {
        document.getElementById('distance').innerHTML = 
          "Total distance: " 
          + (routeData.routes[0].summary.lengthInMeters * 0.000621371).toFixed(2)
          + " miles";
        document.getElementById('time').innerHTML = 
          "Approximate Time: " 
          + (routeData.routes[0].summary.travelTimeInSeconds / 60).toFixed(2)
          + " min";
        doubleClick = true;
      }

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

function plotMap(day) {
  if (doubleClick) { location.reload(); }
  
  // Resets classes, distance, and time
  clear_();
  const schedule = JSON.parse(window.localStorage.getItem('SORTED_SCHEDULE'))[day];
  if (schedule.length == 0) {
    document.getElementById('classlist').innerHTML = '<p>You have no classes on this day! :D</p>';
    return;
  }

  for (sched of schedule) {
    // Displays your classes
    if (!doubleClick) {
      document.getElementById('classlist').innerHTML += displaySchedule(sched);
    }
    // Searches and plot the class location
    let building = sched.building.toUpperCase();
    let address = addressMap.get(building);
    // Finds the lng and lat of the building and stores them
    search(address);
    createRoute();
  }
}