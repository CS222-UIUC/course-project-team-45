// Global class data array (THIS ONLY EXISTS PER WEBPAGE)
// Resides in window.CLASS_DATA
const CLASS_DATA = []
/*
*   This function calls and returns the data from the API
*   This function assumes the parameters are in the format string, number, string
*   Assumes the year parameter is formatted correctly for comparison ("Spring 2022", for example)
*/
// eslint-disable-next-line no-unused-vars
function loadClassData (subject, number, year) {
  let baseUrl = 'https://uiuc-course-api.herokuapp.com/api/classes/?subject='
  baseUrl += subject.toUpperCase()
  baseUrl += '&number='
  baseUrl += String(number)
  // eslint-disable-next-line no-return-assign
  fetch(baseUrl).then((response) =>
    response = response.json().then((jsonResponse) => {
      for (let i = 0; i < jsonResponse.length; i++) {
        const sections = jsonResponse[i]
        if (sections.yearterm === year) {
          const section = {
            building: sections.building,
            room: sections.room,
            days_of_week: sections.days_of_week,
            start_time: sections.start_time,
            end_time: sections.end_time,
            section: sections.section,
            type: sections.type,
            type_code: sections.type_code,
            label: sections.label
          }
          CLASS_DATA.push(section)
        }
      }
      window.localStorage.setItem('CLASS_DATA', JSON.stringify(CLASS_DATA))
    })
  )
  console.log(CLASS_DATA)
}
/*
The object in the array has the following properties:
Property Name
- building
- room
- days_of_week
- start_time
- end_time
- section
- type
- type_code
- label
You can call the property name to obtain the value as these are in (key, value) pairs
All values are strings
*/
