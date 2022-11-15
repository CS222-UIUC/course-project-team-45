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
  document.getElementById('classes').innerHTML = ''
}

// eslint-disable-next-line no-unused-vars
function sortSchedule () {
  const sortedSchedule = [[], [], [], [], [], []]
  const dowMap = new Map()
  dowMap.set('M', 0)
  dowMap.set('T', 1)
  dowMap.set('W', 2)
  dowMap.set('R', 3)
  dowMap.set('F', 4)
  dowMap.set('null', 5)
  const schedule = JSON.parse(window.localStorage.getItem('SCHEDULE'))
  console.log(schedule)
  for (const section of schedule) {
    console.log(section.days_of_week == null, section.days_of_week === null)
    if (section.days_of_week == null) {
      sortedSchedule[5].push(section)
      continue
    }
    for (let i = 0; i < section.days_of_week.length; i++) {
      sortedSchedule[dowMap.get(section.days_of_week.charAt(i))].push(section)
    }
  }
  for (const day of sortedSchedule) {
    day.sort((a, b) => {
      if (a.start_time === 'ARRANGED' && b.start_time !== 'ARRANGED') {
        return 1
      } else if (a.start_time !== 'ARRANGED' && b.start_time === 'ARRANGED') {
        return -1
      } else if (a.start_time === 'ARRANGED' && b.start_time === 'ARRANGED') {
        return 0
      }
      let aTime = (a.start_time.substring(a.start_time.length - 2, a.start_time.length) === 'AM') ? 0 : 12
      let bTime = (b.start_time.substring(b.start_time.length - 2, b.start_time.length) === 'AM') ? 0 : 12

      aTime += parseInt(a.start_time.substring(0, 2)) % 12
      bTime += parseInt(b.start_time.substring(0, 2)) % 12

      aTime += parseInt(a.start_time.substring(3, 5)) / 60
      bTime += parseInt(b.start_time.substring(3, 5)) / 60

      return aTime - bTime
    })
  }
  window.localStorage.setItem('SORTED_SCHEDULE', JSON.stringify(sortedSchedule))
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
function syncSchedule () {
  window.localStorage.setItem('SCHEDULE', window.localStorage.getItem('CLASS_DATA'))
}

// @param crn: section's crn to find
// @param operation: 'ADD', 'REMOVE' - specifies the operation to perform
// This function either adds a section from class_data into schedule, or remove a section from schedule
// eslint-disable-next-line no-unused-vars
function findSection (crn, operation) {
  if (operation.toUpperCase() === 'ADD') {
    const classData = JSON.parse(window.localStorage.getItem('CLASS_DATA'))
    for (let i = 0; i < classData.length; i++) {
      console.log(i, classData.length)
      if (crn === classData[i].crn) {
        console.log('Adding ', classData[i])
        addSection(classData[i])
        break
      }
    }
  } else if (operation.toUpperCase() === 'REMOVE') {
    const schedule = JSON.parse(window.localStorage.getItem('SCHEDULE'))
    for (let i = 0; i < schedule.length; i++) {
      if (crn === schedule[i].crn) {
        console.log('Removed ', schedule[i])
        removeSection(schedule[i])
        break
      }
    }
  }
}

// eslint-disable-next-line no-unused-vars
function takeInput () {
  const value1 = document.getElementById('inputbox1').value.toUpperCase()
  const value2 = document.getElementById('inputbox2').value
  const course = [value1, value2]
  displayInputs(course)
}

/* Displays a list of the course section
 * passed into the function
 * Course is a two value array that holds
 * the subject and number (i.e. CS and 124)
 * The first element is subject, the second
 * is the number
*/
async function displayInputs (course) {
  let entry = `<h3>${course[0] + course[1]}</h3>`
  await loadClassData(course[0], course[1], 'Fall 2022')
  for (const section of JSON.parse(window.localStorage.getItem('CLASS_DATA'))) {
    entry += createDiv('CLASS', section)
  }
  document.getElementById('options').innerHTML = entry
}

function createDiv (operation, section) {
  let element = ''
  if (operation.toUpperCase() === 'CLASS') {
    element = `<div class="section" onclick="addtoSched(${section.crn})">`
    element += `<ul><li><b>Section ${section.section}</b>`
  } else if (operation.toUpperCase() === 'SCHEDULE') {
    element = `<div class="sched-sect", onclick="removefromSched(${section.crn})">`
    element += `<ul><li><b>${section.label} | Section ${section.section}</b>`
  }
  element += `<ul><li>Type: ${section.type}</li>`
  element += `<li>CRN: ${section.crn}</li>`
  element = (section.building === null) ? element + '<li>Location: <span id="buildingName">N/A<span></li>' : element + `<li>Location: ${section.room} <span id="buildingName">${section.building}<span></li>`
  element = (section.start_time === 'ARRANGED') ? element + `<li>Time: ${section.start_time}</li>` : element + `<li>Time: ${section.start_time} - ${section.end_time}</li>`
  element = (section.days_of_week === null) ? element + '<li>Days of Week: N/A</li>' : element + `<li>Days of Week: ${section.days_of_week}</li>`
  element += '</ul></li></ul></div>'
  return element
}

// eslint-disable-next-line no-unused-vars
function addtoSched (crn) {
  findSection(crn, 'ADD')
  displaySched()
}

// eslint-disable-next-line no-unused-vars
function removefromSched (crn) {
  findSection(crn, 'REMOVE')
  displaySched()
}

function displaySched () {
  const schedule = JSON.parse(window.localStorage.getItem('SCHEDULE'))
  let entry = ''
  for (const section of schedule) {
    entry += createDiv('SCHEDULE', section)
  }
  document.getElementById('classes').innerHTML = entry
}
