/*
*   This function calls and returns the data from the API
*   This function assumes the parameters are in the format string, number
*/
function getClassData(subject, number) {
    let base_url = 'https://uiuc-course-api.herokuapp.com/api/classes/?subject=';
    base_url += subject.toUpperCase();
    base_url += '&number=';
    base_url += String(number);
    console.log(base_url);
    
    fetch(base_url, {mode: 'cors'})
    .then((response) => {
        console.log(response);
        return response.text(); })
    .then((unparsed) => {
        console.log(unparsed);
        let data = unparsed ? JSON.parse(unparsed) : {};
        document.getElementById("Test").innerHTML = data.name;
    });
    
   /*
    var xhr = new XMLHttpRequest();
    
    xhr.open('GET', base_url, true);
    xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.send();
    xhr.onload = function() {
        var jsonResponse = xhr.response;
        document.getElementById("Test").innerHTML = jsonResponse.name;
    }
    */
    
    
}