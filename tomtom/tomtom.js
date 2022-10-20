async function getTomTomDirections() {
    //need to add inputs to convert to lat and long, inputted as addresses
    let baseUrl = 'https://api.tomtom.com/routing/1/calculateRoute/'
    let lat1 = '52.50931';
    let long1 = '13.42936';
    let lat2 = '52.50274';
    let long2 = '13.43872'
    let loc1 = lat1 + ',' + long1;
    let loc2 = lat2 + ',' + long2;
    let location = loc1 + ":" + loc2 + "/";
    baseUrl += location;
    baseUrl += 'json?instructionsType=text&sectionType=pedestrian&routeType=shortest&travelMode=pedestrian&key=AvmH2sk25s5jn09Mhc980ITYPNpfAm31';
    //url is ready for request
    await fetch(baseUrl).then((response) =>
    response = response.json().then((jsonResponse) => {
      let instructions = jsonResponse["instructionGroups"]["groupMessage"];
      console.log(instructions);
    })
  )
    //document.getElementById("test").innerHTML = baseUrl;//whatever the output is

}