
function getSearch() {
    var x = document.getElementById("frm1");
    var name = x.elements[0].value;
    var site = x.elements[1].value;
    if(x.elements[1].value===""){site = x.elements[2].value;}
    var terms = x.elements[3].value;
    terms1 = terms.replace(/ /g,'_');
    
    var num = x.elements[4].value;
    var search = 'name=' + name + '&site=' + site + '&terms='+ terms + '&num=' + num; 
    text = '<img src="images/bjm1.jpeg" alt="BJM" style="float:left; padding:10px; width:100px;"><b>Rocky, watch me pull a rabbit out of my hat!!!! <br> searching:</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + search ; 
    document.getElementById("demo").innerHTML = text;
    var link = '<a href="../' + name + '/index.html" target="one"><b>' + name + ':index</a></b><br><a href="../' + name + '/' + terms1 + '.html" target="one"><b>' + name + ':' + terms + '</a></b>'; 
    document.getElementById("result1").innerHTML = link;
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

