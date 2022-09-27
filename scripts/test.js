function test() {
    console.log("CAN YOU SEE THIS?!");
    document.getElementById("Test").innerHTML = "TEST APPLIED.";
}

function getClassData() {
    fetch("https://courses.illinois.edu/cisapi/schedule/courses?year=2012&term=spring§ionTypeCode=LEC§ionTypeCode=Q&collegeCode=KV&creditHours=3&subject=CHEM&sessionId=1&gened=NAT&qp=atomic+structure")
    .console("Successful");
}