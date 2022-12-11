// Displays the map centered at UIUC
// eslint-disable-next-line no-undef
const APIKEY = config.APIKEY
const UIUC = [-88.2272, 40.1020]

// eslint-disable-next-line no-undef
const map = tt.map({
  key: APIKEY,
  container: 'mymap',
  center: UIUC,
  zoom: 13,
  style: 'tomtom://vector/1/basic-main'
})

let markers = []
let locate = []
let schedule = []

// Clears schedule display if you click another button
function clear_ () {
  document.getElementById('classlist').innerHTML = ''
  document.getElementById('distance').innerHTML = ''
  document.getElementById('time').innerHTML = ''
  // Deletes marker data after plotting Route
  for (const mark of markers) {
    mark.remove()
  }
  markers = []
  locate = []
  schedule = []
}

// Code is inspired by TomTom API guides
// Adds martkers to map and keeps tracks of each marker's latlng
function handleResults (result) {
  console.log(result)
  if (result.results) {
    // Creates a marker on lnglat
    // eslint-disable-next-line no-undef
    const marker = new tt.Marker().setLngLat(result.results[0].position).addTo(map)
    markers.push(marker)
    locate.push(result.results[0].position)
  }
}

// Code is inspired by TomTom API guides
// Helps find location data
function search (address) {
  // eslint-disable-next-line no-undef
  tt.services.fuzzySearch({
    key: APIKEY,
    query: address,
    boundingBox: map.getBounds()
  }).go().then(handleResults)
}

// Code is inspired by TomTom API guides
// Displays Route and is customizable
function displayRoute (geoJSON) {
  map.addLayer({
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

// Keep track if route is displayed in order to delete route layer later
let routeIsDisplayed = false

// Code is inspired by TomTom API guides
// Creates route from building address list and computes distance and time
// eslint-disable-next-line no-unused-vars
function createRoute () {
  const routeOptions = {
    key: APIKEY,
    locations: locate,
    travelMode: 'pedestrian'
  }
  // eslint-disable-next-line no-undef
  tt.services.calculateRoute(routeOptions).go().then(
    function (routeData) {
      // Displays your distance and time
      document.getElementById('distance').innerHTML =
        '<b>Total distance: ' +
        (routeData.routes[0].summary.lengthInMeters * 0.000621371).toFixed(2) +
        ' mi</br>'
      document.getElementById('time').innerHTML =
        '<b>Approximate Time: ' +
        Math.floor(routeData.routes[0].summary.travelTimeInSeconds / 60) +
        ' min</b>'

      calculateBetween(routeData.routes[0].legs)

      console.log(routeData)

      // Geolocates our lnglat
      const geo = routeData.toGeoJson()
      displayRoute(geo)
      routeIsDisplayed = true
    }
  )
}

function displaySchedule (section) {
  let element = `<b><u><p>${section.label} `
  element += `(${section.type})<br></u></b>`
  element = (section.start_time === 'ARRANGED') ? element + `${section.start_time}` : element + `${section.start_time} - ${section.end_time}<br>`
  element = (section.building === null) ? element + '<span id="buildingName">N/A<span><br>' : element + `${section.room} <span id="buildingName">${section.building}<span><br>`
  element += '</p>'
  return element
}

// Calculates our time and distance between classes
function calculateBetween (legs) {
  document.getElementById('classlist').innerHTML = ''

  for (let i = 0; i < schedule.length; i++) {
    // Does not display time/distance for first class
    // Displays time distance between classes
    if (i > 0) {
      const leg = legs[i - 1]
      document.getElementById('classlist').innerHTML +=
      'Distance: ' +
      (leg.summary.lengthInMeters * 0.000621371).toFixed(2) +
      ' mi' +
      '<br>' +
      'Time: ' +
      Math.floor(leg.summary.travelTimeInSeconds / 60) +
      ' min'
    }
    // Display classes
    document.getElementById('classlist').innerHTML += displaySchedule(schedule[i])
  }
}

// eslint-disable-next-line no-unused-vars
function plotMap (day) {
  clear_()
  // If the route is displayed on map refresh page to remove it
  if (routeIsDisplayed) {
    location.reload()
  }

  schedule = JSON.parse(window.localStorage.getItem('SORTED_SCHEDULE'))[day]

  if (schedule.length === 0) {
    document.getElementById('classlist').innerHTML = '<p>You have no classes on this day! :D</p>'
    return
  }

  for (const sched of schedule) {
    // Displays your classes
    document.getElementById('classlist').innerHTML += displaySchedule(sched)
    // Searches and plot the class location
    const building = sched.building.toUpperCase()
    // eslint-disable-next-line no-undef
    const address = addressMap.get(building)
    // Finds the lng and lat of the building and stores them
    search(address)
  }
}
