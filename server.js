//ver. 0.02.04 03/17/2018
//DEFECT!! not properly updating baseUrl - sometimes works, sometimes not
//  this is because not adding domain when link is harvested, under internal links
//  also, need to skip links when found, not at search time
//DEFECT!! when word found, previously collected inbound links need to be skipped
//DEFECT!! not closing html on working and working2 (but do we care?) 
//need to consider sync/async issues
//honor robots -- this may need a skip list array
//divide up domains so we don't access same site repetitively and get blocked?
//add timer
//add stat analysis
//refine feedback
//import skip list from text file
//
//03/17/2018 - add search of a seedpage (or seedpages,if linked together).
//03/17/2018 - skip bing, qwant, bing, youtube, videos, images
//not sure we should skip wikipedia
//03/16/2018 - skip 3dcartstores amazon, twitter, facebook, google
//03/15/2018 - skip no response URLs
//03/13/2018 - increase max link to 1000
//03/13/2018 - separate "found" into working.html, "not found" into working2.html
//03/13/2018 - check for outbound links if search term found, local links if not found

const http = require('http')
const port = 3000

var version = '0.02.04';

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
    if (search_terms ===''){console.log('oops');fs.writeFileSync('public/working2.html', '<html><body><b>oops, no search terms!</b></body></html>');return; }
    console.log(req_site);
    console.log(search_terms);
    console.log(link_num);
    START_URL = req_site;
    SEARCH_WORD = search_terms;
    if (link_num < 1000){MAX_PAGES_TO_VISIT = link_num};
    numPagesVisited = 0;
    pagesVisited = {};
    pagesToVisit = [];
    t_url = new URL(START_URL);
    baseUrl = t_url.protocol + "//" + t_url.hostname;
    console.log(START_URL);    

    pagesToVisit.push(START_URL);



    
//delete old working.html and open new one
    
    fs.writeFileSync('public/working.html', '<html><body>Current Search:<br>');
    fs.writeFileSync('public/working2.html', '<html><body>Current Search rejects:<br>');


    
// crawl loop, this is just a test loop for now. the actual loop is in the crawl function


    var i=1;
    while(i<2){
        console.log(i);
        crawl()
        i++;
    }

//crawl is done, finish working.html -- except this doesn't happen.  Why not???  No return from crawl()? (added the close to "no more sites" and "reached MAX"

    body = '</body></html>';
    fs.appendFileSync('public/working.html', body);
    fs.appendFileSync('public/working2.html', body);
    

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

  console.clear();
  console.log(`pbcrawler ver. ` + version + ` is listening on ${port}`)
})
 

function crawl() {
  if(numPagesVisited >= MAX_PAGES_TO_VISIT) {
    console.log("Reached max limit number of pages (" + MAX_PAGES_TO_VISIT + ") to visit.");
    fs.appendFileSync('public/working.html', '<b>Reached max limit number of pages ' + MAX_PAGES_TO_VISIT + ' to visit.</b></body></html>');
    return;
  }
  var nextPage = pagesToVisit.pop();
//update the baseURL
  if (typeof nextPage ==='undefined'){console.log('no page');fs.appendFileSync('public/working.html', '<b>no more sites!</b></body></html>');return;}
  t_url = new URL(nextPage);
  console.log("new url " + t_url);
  if(nextPage.startsWith("http")){baseUrl = t_url.protocol + "//" + t_url.hostname;}
  console.log(baseUrl);
//  var n_url = new URL(nextPage);
  console.log('next page protocol is ' + t_url.protocol);
  var nprotUrl = t_url.protocol;
  if( nprotUrl ==='' ){
    var i = nextPage.indexOf('/');
    if(i > 0){nextPage = nextPage.substring(i);}
    nextPage = baseUrl + nextPage;console.log("protocol: " + nprotUrl);
    }
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
  if (typeof t_url ==='undefined'){console.log('no page');fs.appendFileSync('public/working.html', '<b>no more sites!</b></body></html>');return;}
  console.log("Visiting page " + t_url);
  req(t_url, function(error, response, body) {
     // Check status code (200 is HTTP OK)
    if (typeof response ==='undefined'){
        console.log('no response');fs.appendFileSync('public/working2.html', '<b>oops, defective url!<br><br></b>');
        callback();
        return;
    }else{
        console.log("Status code: " + response.statusCode);
        if(response.statusCode !== 200) {
        callback();
        return;
        }
        // Parse the document body
        var $ = cheerio.load(body);
//load links from any page containing "pbseedpage" -- allows us to build seed pages
        var isWordFound = searchForWord($,'pbseedpage');
        if (!(isWordFound)){
//if not a seedpage, look for search term
            isWordFound = searchForWord($, SEARCH_WORD);
        }
        if(isWordFound) {
        console.log('Word ' + SEARCH_WORD + ' found at page ' + t_url);
        body = 'Word "<b>' + SEARCH_WORD + '" found</b> at page <a href=' + t_url + '>'+ t_url + '</a><br>';
        fs.appendFileSync('public/working.html', body);
    //since found and we will look at site, let's not waste more time here.
        collectExternalLinks($);
        } else {
        body = 'Word "<b>' + SEARCH_WORD + '"</b> not found at page <a href=' + t_url + '>'+ t_url + '</a><br>';
        console.log('Word ' + SEARCH_WORD + ' not found at page ' + t_url);
        fs.appendFileSync('public/working2.html', body);
    //since word not found, let's check the rest of the website
        collectInternalLinks($);
        }
    //     fs.appendFileSync('public/working.html', body);
    //   collectInternalLinks($); was formerly here -- my concept is to collect outward links when the search term is found, browse deeper on the site when not found
    //   but then do we need a way to come back and study the site where found? -- if we are going to manually read the page, we will see the related inbound links ...
        // In this short program, our callback is just calling crawl()
        callback();
        return;
    }
  });
}

function searchForWord($, word) {
  var bodyText = $('html > body').text().toLowerCase();
  console.log(bodyText.indexOf(word.toLowerCase()));
  return(bodyText.indexOf(word.toLowerCase()) !== -1);
}

//would it be more efficient to collect all links in one pass and separate them out?
//note: will not pick up relative links that begin "../"


function collectExternalLinks($) {  
//    var externalLinks = $("a[href^='http']");
    var externalLinks = $('a');
    console.log("Found " + externalLinks.length + " outbound links on page");
    body = "Found " + externalLinks.length + " outbound links on page<br><br>";
    fs.appendFileSync('public/working.html', body);
    externalLinks.each(function() {
//        pagesToVisit.push(baseUrl + $(this).attr('href'));
        var test = $(this).attr('href');
        var testUrl = new URL(test);

        if(typeof test ==='undefined'){
            return;
        }else{
            if(test.indexOf("3dcartstores") !== -1){console.log("skipping 3dcartstores");return;}
            if(test.indexOf("amazon.com") !== -1){console.log("skipping amazon");return;}
            if(test.indexOf("bing") !== -1){console.log("skipping bing");return;}
            if(test.indexOf("duckgo") !== -1){console.log("skipping duckduckgo");return;}
            if(test.indexOf("facebook") !== -1){console.log("skipping facebook");return;}         
            if(test.indexOf("google") !== -1){console.log("skipping google");return;}
            if(test.indexOf("qwant") !== -1){console.log("skipping qwant");return;}
            if(test.indexOf("youtube") !== -1){console.log("skipping youtube");return;}
            if(test.indexOf("image") !== -1){console.log("skipping image");return;}
            if(test.indexOf(".png") !== -1){console.log("skipping image");return;}
            if(test.indexOf(".gif") !== -1){console.log("skipping image");return;}
            if(test.indexOf(".jpg") !== -1){console.log("skipping image");return;}
            if(test.indexOf(".jpeg") !== -1){console.log("skipping image");return;}
            if(test.indexOf("video") !== -1){console.log("skipping video");return;}

            if(!(test.startsWith(baseUrl)) && !(testUrl.protocol ==='') ){pagesToVisit.push($(this).attr('href'));}
        }
    });
}

function collectInternalLinks($) {  
//    var externalLinks = $("a[href^='http']");
    var internalLinks = $('a');
    console.log("Found " + internalLinks.length + " internal links on page");
    body = "Found " + internalLinks.length + " internal links on page<br><br>";
    fs.appendFileSync('public/working2.html', body);
    internalLinks.each(function() {
//        pagesToVisit.push(baseUrl + $(this).attr('href'));
        var test = $(this).attr('href');
        var testUrl = new URL(test);

        if(typeof test ==='undefined'){
            
        }else{
            if(test.indexOf(".png") !== -1){console.log("skipping image");return;}
            if(test.indexOf(".gif") !== -1){console.log("skipping image");return;}
            if(test.indexOf(".jpg") !== -1){console.log("skipping image");return;}
            if(test.indexOf(".jpeg") !== -1){console.log("skipping image");return;}
            if(test.startsWith(baseUrl)){;
                if(test.indexOf("#") !== -1){console.log("skipping local bookmark");return;}
                if(test.indexOf(".png") !== -1){console.log("skipping image");return;}
                if(test.indexOf("image") !== -1){console.log("skipping image");return;}
                if(test.indexOf(".gif") !== -1){console.log("skipping image");return;}
                if(test.indexOf(".jpg") !== -1){console.log("skipping image");return;}
                if(test.indexOf(".jpeg") !== -1){console.log("skipping image");return;}
                if(test.indexOf("video") !== -1){console.log("skipping video");return;}
                pagesToVisit.push($(this).attr('href'))
            }
            if(testUrl.protocol=''){
                
                if(test.indexOf("#") !== -1){console.log("skipping local bookmark");return;}
                if(test.indexOf(".png") !== -1){console.log("skipping image");return;}
                if(test.indexOf("image") !== -1){console.log("skipping image");return;}
                if(test.indexOf(".gif") !== -1){console.log("skipping image");return;}
                if(test.indexOf(".jpg") !== -1){console.log("skipping image");return;}
                if(test.indexOf(".jpeg") !== -1){console.log("skipping image");return;}
                if(test.indexOf("video") !== -1){console.log("skipping video");return;}
                    var i = test.indexOf('/');
                if(i > 0){test = test.substring(i);}
                test = baseUrl + test;console.log("protocol: " + nprotUrl);
                pagesToVisit.push($(this).attr('href'));                
            }
        }
    });
}
