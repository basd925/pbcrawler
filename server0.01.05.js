//WARNING!!! No error recovery from bad url -- server crashes!

const http = require('http')
const port = 3000

var req = require('request');
var cheerio = require('cheerio');
var path = require('path');
var fs = require('fs');

//do I need both of these? Are they actually different?

var url = require('url');

//--this requires the url-parse module, apparently not needed for "url" which must be somewhere else
//--so, also needs requires-port, querystringify
var URL = require('url-parse');

var START_URL;
var SEARCH_WORD;
var MAX_PAGES_TO_VISIT = 10;

var pagesVisited = {};
var numPagesVisited = 0;
var pagesToVisit;
var t_url = new URL(START_URL);
var baseUrl = t_url.protocol + "//" + t_url.hostname;



var FAVICON = path.join(__dirname, 'public', 'favicon.ico');

const requestHandler = (request, response) => {

// retrieve requested url, parse for url to search and search termis    
    var q = url.parse(request.url, true);
//  console.log(q);
    var pathname = q.pathname;
    var req_site = q.query.site;
    var search_terms = q.query.terms;
    var link_num = q.query.num;

    
  if (typeof req_site !== 'undefined') {
    if (search_terms ===''){console.log('oops');fs.writeFileSync('public/working.html', '<html><body><b>oops, no search terms!</b></body></html>');return; }
    console.log('xx_' + req_site + '_xx');
    console.log('xx_' + search_terms + '_xx');
    console.log(link_num);
    START_URL = req_site;
    SEARCH_WORD = search_terms;
    if (link_num < 100){MAX_PAGES_TO_VISIT = link_num};
    numPagesVisited = 0;
    pagesVisited = {};
    pagesToVisit = [];
    t_url = new URL(START_URL);
    baseUrl = t_url.protocol + "//" + t_url.hostname;
    console.log(START_URL);    

    pagesToVisit.push(START_URL);



    
//delete old working.html and open new one
    
    fs.writeFileSync('public/working.html', '<html><body>Current Search:<br>');


    
// crawl loop, this is just a test loop for now. probably the loop will be in the crawl function


    var i=1;
    while(i<2){
        console.log(i);
//        crawl(req_site,search_terms);
        crawl()
        i++;
    }

//crawl is done, finish working.html

    body = '</body></html>';
    fs.appendFileSync('public/working.html', body);
    

  }
  
  if (request.method === 'GET' && pathname === '/update') {
        response.end('<iframe height="500" width="600" src="working.html" ></iframe><br><b>Um ... How fast da ya '
        + 'think we are??????</b>');
    return;

  }
  var SITE = path.join(__dirname, 'public', pathname);

  // If this request is asking for our favicon, respond with it.
  if (request.method === 'GET' && pathname === '/favicon.ico') {
    // MIME type of your favicon.
    //
    // .ico = 'image/x-icon' or 'image/vnd.microsoft.icon'
    // .png = 'image/png'
    // .jpg = 'image/jpeg'
    // .jpeg = 'image/jpeg'
    response.setHeader('Content-Type', 'image/x-icon');
    // Serve your favicon and finish response.
    //
    // You don't need to call `.end()` yourself because
    // `pipe` will do it automatically.
    fs.createReadStream(FAVICON).pipe(response);
    console.log(request.url);
    return;
  }

  if (request.method === 'GET' && pathname !== '/') {
    if (fs.existsSync(SITE)) {
        fs.createReadStream(SITE).pipe(response);
        console.log(request.url)+'duh!';
        return;
    }
        
  }

  console.log(request.url)
  response.end('<HTML><body><b>Hey! ... Whaddaya '
    + 'Want???</b><br><br><a href="search.html">search</a></body></HTML>');
  return;
}

const server = http.createServer(requestHandler)

server.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${port}`)
})
 

function crawl1(req_site,search_terms){
    console.log('howdy');
    console.log(ii+10);

//setup from crawler.js modified to use our site and search terms -- only if we have a search to do 
    
    
    
    req(req_site, function (error, response, body) {
        console.log('error:', error); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
//        fs.writeFileSync('public/working.html', body);
        var $ = cheerio.load(body);
        var isWordFound = searchForWord($, search_terms);
        if(isWordFound) {
            body = 'Word "<b>' + search_terms + '"</b> found at page <a href=' + req_site + '>'+ req_site + '</a><br><br>';
        }else{
            body = 'Word <b>"' + search_terms + '"</b> not found at page ' + req_site + '<br><br>';           
        }

        console.log('body:', body); 
        fs.appendFileSync('public/working.html', body);

    });      

    return;

}

function searchForWord1($, word) {
  var bodyText = $('html > body').text().toLowerCase();
  console.log(bodyText.indexOf(word.toLowerCase()));
  return(bodyText.indexOf(word.toLowerCase()) !== -1);
}


function crawl() {
  if(numPagesVisited >= MAX_PAGES_TO_VISIT) {
    console.log("Reached max limit of number of pages to visit.");
    fs.appendFileSync('public/working.html', '<b>Reached max limit of number of pages to visit.</b>');
    return;
  }
  var nextPage = pagesToVisit.pop();
  if (nextPage in pagesVisited) {
    // We've already visited this page, so repeat the crawl
    crawl();
  } else {
    // New page we haven't visited
    visitPage(nextPage, crawl);
  }
}

function visitPage(t_url, callback) {
  // Add page to our set
  pagesVisited[t_url] = true;
  numPagesVisited++;

  // Make the request
  if (typeof t_url ==='undefined'){console.log('no page');fs.appendFileSync('public/working.html', '<b>no more sites!</b>');return;}
  console.log("Visiting page " + t_url);
  req(t_url, function(error, response, body) {
     // Check status code (200 is HTTP OK)
  if (typeof response ==='undefined'){console.log('no response');fs.appendFileSync('public/working.html', '<b>oops, defective url!</b>');return;}
     console.log("Status code: " + response.statusCode);
     if(response.statusCode !== 200) {
       callback();
       return;
     }
     // Parse the document body
     var $ = cheerio.load(body);
     var isWordFound = searchForWord($, SEARCH_WORD);
     if(isWordFound) {
       console.log('Word ' + SEARCH_WORD + ' found at page ' + t_url);
       body = 'Word "<b>' + SEARCH_WORD + '" found</b> at page <a href=' + t_url + '>'+ t_url + '</a><br>';
       fs.appendFileSync('public/working.html', body);
       collectExternalLinks($);
     } else {
       body = 'Word "<b>' + SEARCH_WORD + '"</b> not found at page <a href=' + t_url + '>'+ t_url + '</a><br>';
       fs.appendFileSync('public/working.html', body);
       collectInternalLinks($);
     }
//     fs.appendFileSync('public/working.html', body);
//   collectInternalLinks($); was formerly here -- my concept is to collect outward links when the search term is found, browse deeper on the site when not found
//   but then do we need a way to come back and study the site where found? -- if we are going to manually read the page, we will see the related inbound links ...
       // In this short program, our callback is just calling crawl()
       callback();
  });
}

function searchForWord($, word) {
  var bodyText = $('html > body').text().toLowerCase();
  console.log(bodyText.indexOf(word.toLowerCase()));
  return(bodyText.indexOf(word.toLowerCase()) !== -1);
}

//would it be more efficient to collect all links in one pass and separate them out?
//note: will not pick up relative links that begin "../"

function collectInternalLinks($) {
    var relativeLinks = $("a[href^='/']");
    console.log("Found " + relativeLinks.length + " relative links on page");
    body = "Found " + relativeLinks.length + " relative links on page<br><br>";
    fs.appendFileSync('public/working.html', body);
    relativeLinks.each(function() {
        pagesToVisit.push(baseUrl + $(this).attr('href'));
    });
}
function collectExternalLinks($) {  
    var externalLinks = $("a[href^='http']");
    console.log("Found " + externalLinks.length + " outbound links on page");
    body = "Found " + externalLinks.length + " outbound links on page<br><br>";
    fs.appendFileSync('public/working.html', body);
    externalLinks.each(function() {
//        pagesToVisit.push(baseUrl + $(this).attr('href'));
        pagesToVisit.push($(this).attr('href'));
    });
}
