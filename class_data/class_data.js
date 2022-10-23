/*
*   This function calls and returns the data from the API
*   This function assumes the parameters are in the format string, number, string
*   Assumes the year parameter is formatted correctly for comparison ("Spring 2022", for example)
*/
// eslint-disable-next-line no-unused-vars
async function loadClassData (subject, number, year) {
  let baseUrl = 'https://uiuc-course-api.herokuapp.com/api/classes/?subject='
  baseUrl += subject.toUpperCase()
  baseUrl += '&number='
  baseUrl += String(number)
  // eslint-disable-next-line no-return-assign
  await fetch(baseUrl).then((response) =>
    response = response.json().then((jsonResponse) => {
      const classData = []
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
            label: sections.label,
            crn: sections.crn
          }
          console.log(section)
          classData.push(section)
        }
      }
      window.localStorage.setItem('CLASS_DATA', JSON.stringify(classData))
      console.log('loading class data')
    })
  )
    .catch(() => {
      const section = {
        label: 'No class found!'
      }
      const classData = []
      classData.push(section)
      window.localStorage.setItem('CLASS_DATA', JSON.stringify(classData))
      console.log('No class found! Returning singular object with no class.')
    })
}

// Function to add a class to the schedule array
// The section received should be an object as defined below
// eslint-disable-next-line no-unused-vars
function addSection (section) {
  let schedule = JSON.parse(window.localStorage.getItem('SCHEDULE'))
  // Ensures schedule is an array
  if (schedule == null) {
    schedule = []
  }
  schedule.push(section)
  window.localStorage.setItem('SCHEDULE', JSON.stringify(schedule))
}

// Removes a section, if duplicate, removes first sighting of section
// eslint-disable-next-line no-unused-vars
function removeSection (section) {
  let schedule = JSON.parse(window.localStorage.getItem('SCHEDULE'))
  if (schedule == null) {
    schedule = []
  } else {
    const sectionString = JSON.stringify(section)
    for (let i = 0; i < schedule.length; i++) {
      if (sectionString === JSON.stringify(schedule[i])) {
        schedule.splice(i, 1)
        break
      }
    }
  }
  window.localStorage.setItem('SCHEDULE', JSON.stringify(schedule))
}

// eslint-disable-next-line no-unused-vars
function clearSchedule () {
  const schedule = []
  window.localStorage.setItem('SCHEDULE', JSON.stringify(schedule))
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
- crn
You can call the property name to obtain the value as these are in (key, value) pairs
All values are strings, crn is a number
*/

// eslint-disable-next-line no-unused-vars
function testaddremove () {
  const data = JSON.parse(window.localStorage.getItem('SCHEDULE'))
  const section = {
    building: 'New',
    room: 'new',
    days_of_week: 'new',
    start_time: 'new',
    end_time: 'new',
    section: 'new',
    type: 'new',
    type_code: 'new',
    label: 'new',
    crn: 0
  }
  addSection(section)
  let schedule = JSON.parse(window.localStorage.getItem('SCHEDULE'))
  console.log(schedule)
  removeSection(data[0])
  schedule = JSON.parse(window.localStorage.getItem('SCHEDULE'))
  console.log(schedule)
}

// eslint-disable-next-line no-unused-vars
function syncSchedule () {
  window.localStorage.setItem('SCHEDULE', window.localStorage.getItem('CLASS_DATA'))
}
