// eslint-disable-next-line no-unused-vars
function listSections () {
  const data = JSON.parse(window.localStorage.getItem('CLASS_DATA'))
  const list = document.getElementById('list')
  document.createElement('p').id = 'title'
  document.getElementById('title').innerText = data[0].label

  for (const section of data) {
    const li = document.createElement('li')
    li.innerHTML += `${section.type}<ul><li>Building: ${section.building}</li><li>Room: ${section.room}</li></ul>`
    list.appendChild(li)
  }
}
