// Displays the map centered at UIUC
const APIKEY = 'AvmH2sk25s5jn09Mhc980ITYPNpfAm31'
const UIUC = [-88.2272, 40.1020]
/* eslint-disable no-undef */
const map = tt.map({
  key: APIKEY,
  container: 'mymap',
  center: UIUC,
  zoom: 13,
  style: 'tomtom://vector/1/basic-main'
});
var lnglats = [] // Our list of building lnglat

// Does the moving map animation when you insert a location
function moveMap (lnglat) {
  map.flyTo({
    center: lnglat,
    zoom: 18
  })
}

// Handles search results
function handleResults (result) {
  console.log(result)
  if (result.results) {
    moveMap(result.results[0].position) // Long and latitude

    lnglats.push(result.results[0].position); // Puts your result's lnglat into lnglats list to be used in route display

    // Creates a marker on lnglat
    // eslint-disable-next-line no-unused-vars
    const marker = new tt.Marker()
      .setLngLat(result.results[0].position)
      .addTo(map)
  }
}

// Helps find location data
// eslint-disable-next-line no-unused-vars
function search () {
  tt.services.fuzzySearch({
    key: APIKEY,
    query: document.getElementById('query').value,
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
    locations: [],
    travelMode: 'pedestrian'
  };

  for (let i = 0; i < lnglats.length; i++) {
    routeOptions.locations.push(lnglats[i]);
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
      var geo = routeData.toGeoJson();
      displayRoute(geo);
    }
  );
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
