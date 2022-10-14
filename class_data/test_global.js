function listSections() {
    let data = localStorage.getItem("CLASS_DATA");
    CLASS_DATA = JSON.parse(data);
    console.log(CLASS_DATA);
    let list = document.getElementById("list");
    document.createElement("p").id = "title";
    document.getElementById("title").innerText = CLASS_DATA[0].label;

    for (let section of CLASS_DATA) {
        let li = document.createElement("li");
        li.innerHTML += `${section.type}<ul><li>Building: ${section.building}</li><li>Room: ${section.room}</li></ul>`;
        list.appendChild(li);
    }
}

function callData() {
    console.log(CLASS_DATA);
}