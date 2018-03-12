<h2>Javascript Sandbox</h2>

<button type="button"
onclick="document.getElementById('demo').innerHTML = Date()">
Click me to display Date and Time.</button>

<h2>change some text</h2>

<p id="demo">Put a link here!</p>

<button type="button" onclick='document.getElementById("demo").innerHTML = "<a href=http://daltrey.org target=one>daltrey site</a><iframe name=one> </iframe>"'>Click Me!</button><br>
<button type="button" onclick='document.getElementById("demo1").innerHTML = "<iframe name=one> </iframe>"'>Open Iframe</button>


<p id="demo1"></p>

<p id="demo2"></p>


<form id="frm1" action="">
  First name: <input type="text" name="fname" value="Donald"><br>
  Last name: <input type="text" name="lname" value="Duck"><br><br>
</form> 

<button onclick="myFunction()">Process</button><br><br> 

<button onclick="readFile()">Read</button>


<p id="demo3"></p>





<script>
function myFunction() {
    var x = document.getElementById("frm1");
    var text = "";
    var i;
    for (i = 0; i < x.length ;i++) {
        text += x.elements[i].value + "<br>";
    }
    document.getElementById("demo2").innerHTML = text;
}




function readFile() {
    var txtFile = new XMLHttpRequest();
    txtFile.open("GET", "http://daltrey.org/robots.txt", true);
    txtFile.onreadystatechange = function() {
    if (txtFile.readyState === 4) {  // Makes sure the document is ready to parse.
        if (txtFile.status === 200) {  // Makes sure it's found the file.
        allText = txtFile.responseText;
        lines = txtFile.responseText.split("\n"); // Will separate each line into an array
        }
    }
    }
    txtFile.send(null);
    document.getElementById("demo3").innerHTML = txtFile;
}




</script>


<h2>Using the XMLHttpRequest object</h2>

<button type="button" onclick="loadXMLDoc()">Change Content</button>

<p id="demo4"></p>

<script>
function loadXMLDoc() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      document.getElementById("demo4").innerHTML =
      this.responseText;
    }
  };
  xhttp.open("GET", "menu.php", true);
  xhttp.send();
}
</script>



<?php

   
?>
