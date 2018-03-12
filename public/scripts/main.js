function hello() {
    var myHeading = document.querySelector('h1');
    myHeading.textContent = 'Hello world!';           
}


function myFunction() {
    var x = document.getElementById("frm1");
    var text = "";
    var i;
    for (i = 0; i < x.length ;i++) {
        text += x.elements[i].name + ': ' + x.elements[i].value + "<br>";
    }
    document.getElementById("demo").innerHTML = text;
}


function readFile() {
    var txtFile = new XMLHttpRequest();
    txtFile.onreadystatechange = function() {
        if (this.readyState === 4) {  // Makes sure the document is ready to parse.
            if (this.status === 200) {  // Makes sure it's found the file.
            allText = this.responseText;
            lines = this.responseText.split("\n"); // Will separate each line into an array
            document.getElementById("demo").innerHTML = lines;
            }
        }
    }
    txtFile.open("GET", "LICENSE", true);
    txtFile.send(null);
}


function loadXMLDoc() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
        document.getElementById("demo").innerHTML =
        this.responseText;
        }
    };
    xhttp.open("GET", "index.html", true);
    xhttp.send();
}
