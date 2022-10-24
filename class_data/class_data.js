const subjects = []
const sections = []

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
    console.log(classData)
    for (let i = 0; i < classData.length; i++) {
      console.log(classData[i].crn)
      if (crn === classData[i].crn) {
        addSection(classData[i])
        break
      }
    }
  } else if (operation.toUpperCase() === 'REMOVE') {
    const schedule = JSON.parse(window.localStorage.getItem('SCHEDULE'))
    console.log(schedule)
    for (let i = 0; i < schedule.length; i++) {
      if (crn === schedule[i].crn) {
        removeSection(schedule[i])
        break
      }
    }
  }
}

// eslint-disable-next-line no-unused-vars
function takeinput () {
  const value1 = document.getElementById('inputbox1').value.toUpperCase()
  const value2 = document.getElementById('inputbox2').value
  subjects.push(value1)
  sections.push(value2)
  displayInputs()
  clearSchedule()
}

async function displayInputs () {
  let entry = ''
  for (let i = 0; i < subjects.length; i++) {
    entry += `<h3>${subjects[i] + sections[i]}</h3>`
    // for loop here
    await loadClassData(subjects[i], sections[i], 'Fall 2022')
    for (const section of JSON.parse(window.localStorage.getItem('CLASS_DATA'))) {
      console.log('using class data')
      entry += createDiv('CLASS', section)
    }
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
function deletePrev () {
  subjects.pop()
  sections.pop()
  displayInputs()
}

// eslint-disable-next-line no-unused-vars
function addtoSched (crn) {
  findSection(crn, 'ADD')
  const schedule = JSON.parse(window.localStorage.getItem('SCHEDULE'))
  const section = schedule[schedule.length - 1]

  console.log('adding schedule section')

  document.getElementById('classes').innerHTML += createDiv('SCHEDULE', section)
}

// eslint-disable-next-line no-unused-vars
function removefromSched (crn) {
  findSection(crn, 'REMOVE')
  const schedule = JSON.parse(window.localStorage.getItem('SCHEDULE'))
  let entry = ''
  for (const section of schedule) {
    entry += createDiv('SCHEDULE', section)
  }
  document.getElementById('classes').innerHTML = entry
}
