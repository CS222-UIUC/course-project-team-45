// Displays the map centered at UIUC
var APIKEY = "AvmH2sk25s5jn09Mhc980ITYPNpfAm31";
var UIUC = [-88.2272,40.1020];
var map = tt.map({
  key: APIKEY,
  container: 'mymap',
  center: UIUC,
  zoom: 13,
  style: 'tomtom://vector/1/basic-main'
});


// Does the moving map animation when you insert a location
function moveMap(lnglat) {
  map.flyTo({
    center: lnglat,
    zoom: 18
  });
}

// Handles search results
function handleResults(result) {
  console.log(result);
  if (result.results) {
    moveMap(result.results[0].position); // Long and latitude

    // Creates a marker on lnglat
    var marker = new tt.Marker()
            .setLngLat(result.results[0].position)
            .addTo(map);
  }
}

// Helps find location data
function search() {
  tt.services.fuzzySearch({
    key: APIKEY,
    query: document.getElementById("query").value,
    boundingBox: map.getBounds()
  }).go().then(handleResults);
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