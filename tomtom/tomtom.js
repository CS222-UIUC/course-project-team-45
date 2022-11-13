// Displays the map centered at UIUC
const APIKEY = 'AvmH2sk25s5jn09Mhc980ITYPNpfAm31';
const UIUC = [-88.2272, 40.1020];
/* eslint-disable no-undef */
const map = tt.map({
  key: APIKEY,
  container: 'mymap',
  center: UIUC,
  zoom: 13,
  style: 'tomtom://vector/1/basic-main'
});

let lnglats = []; // Our list of building lnglat
let markers = []; // Stores our markers

// Does the moving map animation when you insert a location
// function moveMap() {
//   var lng = 0;
//   var lat = 0;
//   for(var i = 0; i < lnglats.length; i++) {
//       lng += lnglats[i][0];
//       lat += lnglats[i][1];
//   }
//   lng = lng / lnglats.length;
//   lat = lat / lnglats.length;

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
  for (mark of markers) {
    mark.remove();
  }
  markers = [];
}

// Handles search results
function handleResults (result) {
  console.log(result)
  if (result.results) {
    lnglats.push(result.results[0].position); // Stores your result's lnglat to be used in route display

    // Creates a marker on lnglat
    const marker = new tt.Marker();
    markers.push(marker);

    marker.setLngLat(result.results[0].position).addTo(map);
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
    'id' : 'route',
    'type' : 'line',
    'source' : {
      'type' : 'geojson',
      'data' : geoJSON
    },
    'paint' : {
      'line-color' : 'blue',
      'line-width' : 5,
    }
  });
}

// Creates route from building address list
function createRoute() {
  var routeOptions = {
    key: APIKEY,
    locations: lnglats,
    travelMode: 'pedestrian'
  };
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
      var geo = routeData.toGeoJson();
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

  const schedule = JSON.parse(window.localStorage.getItem('SCHEDULE'));

  let numberOfClasses = 0;

  for (let i = 0; i < schedule.length; i++) {
    if (schedule[i].days_of_week.includes(day)) {
      // Displays your classes
      document.getElementById('classlist').innerHTML += displaySchedule(schedule[i]);
      // Searches and plot the class location
      let building = schedule[i].building.toUpperCase();
      let address = addressMap.get(building);
      // Finds the lng and lat of the building and stores them
      search(address);

      numberOfClasses += 1;
    }
  }
  if (numberOfClasses === 0) {
    document.getElementById('classlist').innerHTML += '<p>You have no classes on this day! :D</p>';
    return;
  }
  // Displays the route corresponding to each day
  createRoute();

  // Moves map based on the average lnglat of each location
  // moveMap();

  // resets our paths after creating route
  lnglats = [];
}


/*
async function getTomTomDirections() {
    //need to add inputs to convert to lat and long, inputted as addresses
    let baseUrl = 'https://api.tomtom.com/routing/1/calculateRoute/'
    let lat1 = '52.50931';
    let long1 = '13.42936';
    let lat2 = '52.50274';
    let long2 = '13.43872'
    let loc1 = lat1 + '%2C' + long1;
    let loc2 = lat2 + '%2C' + long2;
    let location = loc1 + "%3A" + loc2;
    baseUrl += location;
    baseUrl += '/json?instructionsType=text&sectionType=pedestrian&report=effectiveSettings&routeType=shortest&travelMode=pedestrian&key=';
    baseUrl += APIKEY;
    //url is ready for request
    await fetch(baseUrl).then((response) =>
    response = response.json().then((jsonResponse) => {
      let instructions = jsonResponse.guidance.instructionGroups.groupMessage;
      console.log(instructions); // Outputs detailed directions to destination
    })
  )
    //document.getElementById("test").innerHTML = baseUrl;//whatever the output is
}
*/
