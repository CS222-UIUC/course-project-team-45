// eslint-disable-next-line no-unused-vars
function listSections () {
  const data = window.localStorage.getItem('CLASS_DATA')
  window.CLASS_DATA = JSON.parse(data)
  console.log(window.CLASS_DATA)
  const list = document.getElementById('list')
  document.createElement('p').id = 'title'
  document.getElementById('title').innerText = window.CLASS_DATA[0].label

  for (const section of window.CLASS_DATA) {
    const li = document.createElement('li')
    li.innerHTML += `${section.type}<ul><li>Building: ${section.building}</li><li>Room: ${section.room}</li></ul>`
    list.appendChild(li)
  }
}

// eslint-disable-next-line no-unused-vars
function callData () {
  console.log(window.CLASS_DATA)
}
