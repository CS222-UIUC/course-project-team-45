// Example of how to get the class data for usage
// Example of how to get the class data for usage
// eslint-disable-next-line no-unused-vars
function listSections () {
  const data = JSON.parse(window.localStorage.getItem('SCHEDULE'))
  const list = document.getElementById('list')
  list.innerHTML = ''
  list.innerHTML = ''
  document.createElement('p').id = 'title'
  if (data.length === 0) {
    document.getElementById('title').innerText = 'Empty!'
  } else {
    document.getElementById('title').innerText = data[0].label

    for (const section of data) {
      const li = document.createElement('li')
      li.innerHTML += `${section.type}<ul><li>Building: ${section.building}</li><li>Room: ${section.room}</li><li>CRN: ${section.crn}</li></ul>`
      list.appendChild(li)
    }
  }
}
