// Displays the map centered at UIUC
var APIKEY = "AvmH2sk25s5jn09Mhc980ITYPNpfAm31";
var UIUC = [-88.2272,40.1020];
var map = tt.map({
  key: APIKEY,
  container: 'mymap',
  center: UIUC,
  zoom: 14,
  style: 'tomtom://vector/1/basic-main'
});

async function getLatLong(building) { 
  // Geocoding using tomtom Place API
  // May need to manually type out addresses for each building for this to work
  let baseUrl = 'https://api.tomtom.com/search/2/search/';
  let place = encodeURI(building).replace("'", "%27"); // URL encode building name
  baseUrl += place;
  baseUrl += '.json?lat=40.1020&lon=-88.2272&radius=5000&minFuzzyLevel=1&maxFuzzyLevel=2&view=Unified&relatedPois=off&key=';
  baseUrl += APIKEY;
  await fetch(baseUrl).then((response) =>
    response = response.json().then((jsonResponse) => {
      const lat = jsonResponse.results[0].position.lat // Gets the first result's latitude
      const long = jsonResponse.results[0].position.lon // Gets the first result's longitude
      const latlong = [lat, long]
      window.localStorage.setItem('LAT_LONG', JSON.stringify(latlong))
      console.log("Calculating latitude and longitude for building...")
    })
  )
}

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