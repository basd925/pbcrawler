
function getSearch() {
    var x = document.getElementById("frm1");
    var site = x.elements[0].value;
    if(x.elements[0].value===""){site = x.elements[1].value;}
    var terms = x.elements[2].value;
    var num = x.elements[3].value;
    var search = 'site=' + site + '&terms='+ terms + '&num=' + num; 
    text = '<img src="images/bjm1.jpeg" alt="BJM" style="float:left; padding:10px; width:100px;"><b>Rocky, watch me pull a rabbit out of my hat!!!! <br> searching:</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + search ; 
    document.getElementById("demo").innerHTML = text;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
        document.getElementById("demo1").innerHTML =
        this.responseText;
        }
    };
    xhttp.open("GET", '/?' + search, true);
    xhttp.send();
    var timeoutID;
    delayedAlert();
}


function delayedAlert() {
  timeoutID = window.setTimeout(slowAlert, 5000);
}

function slowAlert() {
//  alert('That was really slow!');
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
        document.getElementById("demo1").innerHTML =
        this.responseText;
        }
    };
    xhttp.open("GET", '/update', true);
    xhttp.send();
}

function clearAlert() {
  window.clearTimeout(timeoutID);
  
}
