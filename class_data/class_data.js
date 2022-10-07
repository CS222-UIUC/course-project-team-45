/*
*   This function calls and returns the data from the API
*   This function assumes the parameters are in the format string, number, string
*   Assumes the year parameter is formatted correctly for comparison ("Spring 2022", for example)
*/
function getClassData(subject, number, year) {
    let base_url = 'https://cors-anywhere.herokuapp.com/https://uiuc-course-api.herokuapp.com/api/classes/?subject=';
    base_url += subject.toUpperCase();
    base_url += '&number=';
    base_url += String(number);
    console.log(base_url);
    
    fetch(base_url).then((response) =>
        response = response.json().then((jsonResponse) => {
            //Problem here, how to port this class data array to elsewhere for use?
            //Currently a local variable that will be deleted when the function is done
            let class_data = new Array();

            for (let i = 0; i < jsonResponse.length; i++) {
                let sections = jsonResponse[i];
                if (sections.yearterm == year) {
                    let section = new ClassSection(sections.building, sections.room, sections.days_of_week,
                                                sections.start_time, sections.end_time, sections.section,
                                                sections.type, sections.type_code, sections.label);
                    console.log(section, i);
                    class_data.push(section);
                }
            }
            console.log(class_data.toString());
            //Test that the array is filled
            document.getElementById("Test").innerHTML = class_data[0].label;
        })
    ); 
}

function ClassSection(...data) {
    //Data members
    this.building = data[0];
    this.room = data[1];
    this.days_of_week = data[2];
    this.start_time = data[3];
    this.end_time = data[4];
    this.section = data[5];
    this.type = data[6];
    this.type_code = data[7];
    this.label = data[8];

    //Potentially useful methods
    //Returns building and room in a pair
    this.getLocation = function() {
        return new Array(this.building, this.room);
    }
    //Provides the start, endtime, and days as an array
    this.getTime = function() {
        return new Array(this.start_time, this.end_time, this.days_of_week);
    }
    //Provides class data about the section
    this.getType = function() {
        return new Array(this.label, this.type, this.type_code, this.section);
    }
    //If you don't need these methods you can just call the property name
}

//Thinking about using a function but not sure how to implement
/*
function saveData(class_data) {

}
*/