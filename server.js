<<<<<<< HEAD
//ver. 0.02.06 03/18/2018
=======
//ver. 0.02.04 03/17/2018
>>>>>>> 0ffb16d5f48dc5afabff2e628ec18f70ab1e8d87
//DEFECT!! not properly updating baseUrl - sometimes works, sometimes not
//  this is because not adding domain when link is harvested, under internal links
//  also, need to skip links when found, not at search time
//DEFECT!! when word found, previously collected inbound links need to be skipped
<<<<<<< HEAD
//DEFECT!! not closing html on working and working2 (but do we care?)
//DEFECT!! search on "Andrew McCabe did not yield hits that were there.  "Trump" worked okay, what is problem?
//DEFECT!! snippets usually print twice and sometimes more than that.  Can't figure out
//  what triggers the loop, since it does not apparently go back to the found page incrementer.
//  however, sometimes while it skips the incrementer, it does a different link.
//  I think there is an issue with sync/async here.
=======
//DEFECT!! not closing html on working and working2 (but do we care?) 
>>>>>>> 0ffb16d5f48dc5afabff2e628ec18f70ab1e8d87
//need to consider sync/async issues
//honor robots -- this may need a skip list array
//divide up domains so we don't access same site repetitively and get blocked?
//add timer
//add stat analysis
//refine feedback
//import skip list from text file
//
<<<<<<< HEAD
//03/18/2018 - MAJOR CHANGE: code to return text in proximity to the search term
//03/18/2018 - remove all "<" from HTML in the retrieved text snippet, to prevent
//03/18/2018 captured html from rendering.
=======
//03/17/2018 - add search of a seedpage (or seedpages,if linked together).
//03/17/2018 - skip bing, qwant, bing, youtube, videos, images
//not sure we should skip wikipedia
//03/16/2018 - skip 3dcartstores amazon, twitter, facebook, google
//03/15/2018 - skip no response URLs
//03/13/2018 - increase max link to 1000
//03/13/2018 - separate "found" into working.html, "not found" into working2.html
//03/13/2018 - check for outbound links if search term found, local links if not found
>>>>>>> 0ffb16d5f48dc5afabff2e628ec18f70ab1e8d87

const http = require('http')
const port = 3000

<<<<<<< HEAD
var version = '0.02.06';
=======
var version = '0.02.04';
>>>>>>> 0ffb16d5f48dc5afabff2e628ec18f70ab1e8d87

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
var ii =0;
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
    numDomainsVisited = 0;
    numPagesFound = 0;
    ii = 1;
    pagesVisited = {};
    pagesToVisit = [];
    domainsFound = [];
    domainsVisited = [];
    bodyTest='';
    tempText='';
    tempLength = 0;
    t_url = new URL(START_URL);
    baseUrl = t_url.protocol + "//" + t_url.hostname;
    console.log('what is the domain? ' + t_url.hostname);
    var chooseDomain = baseUrl; 
    console.log('choosedomain = ' + chooseDomain);
    pagesToVisit.push(START_URL);
    
//delete old working.html and open new one
    
    fs.writeFileSync('public/working.html', '<html><body>Current Search:<br><br>');
    fs.writeFileSync('public/working2.html', '<html><body>Current Search rejects:<br><br>');
    
<<<<<<< HEAD
// crawl the internet

    crawl()

//crawl is done, finish working.html -- except this doesn't happen.  Why not???  No return from crawl()? (added the close to "no more sites" and "reached MAX") but should we close it, because we may want to append/combine results
=======
// crawl loop, this is just a test loop for now. the actual loop is in the crawl function


    var i=1;
    while(i<2){
        console.log(i);
        crawl()
        i++;
    }

//crawl is done, finish working.html -- except this doesn't happen.  Why not???  No return from crawl()? (added the close to "no more sites" and "reached MAX"
>>>>>>> 0ffb16d5f48dc5afabff2e628ec18f70ab1e8d87

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
<<<<<<< HEAD
    fs.appendFileSync('public/working.html', '<b>Reached max limit number of pages (' + MAX_PAGES_TO_VISIT + ') to visit. <br></b></body></html>');
    var tempDomains = domainsVisited.toString();
    tempDomains = tempDomains.replace(/,/g,'<br>');
    fs.appendFileSync('public/working2.html', '<b>Reached max limit number of pages (' + MAX_PAGES_TO_VISIT + ') to visit.</b> <br><br>' + tempDomains + '<br></body></html>');
    console.log('domains visited = ' + numDomainsVisited);
    console.log('pages visited = ' + numPagesVisited)   ;
//    console.log(domainsVisited);
//    console.log(pagesVisited);
    return;
  }
  
    
//find a domain in pagesToVisit and select one of those
    chooseDomain = baseUrl;
//pick a random domain to revisit.  But first we need a list of domains we have found to randomize.
    if (numDomainsVisited > 1){chooseDomain = domainsFound[Math.floor(Math.random() * domainsVisited.length)];}
    var foundDomain = pagesToVisit.find(fruit => fruit.includes(chooseDomain));
    var foundDomainIndex = pagesToVisit.findIndex(fruit => fruit.includes(chooseDomain));
    console.log('selected domain is ' + foundDomain + ' at ' + foundDomainIndex);

//if we can extract a found link, do it (not useful until we have an array of domains to check against)
//otherwise just use next link in order
    if (foundDomainIndex > 0){
        var nextPage = pagesToVisit.splice(foundDomainIndex,1);
        
    }else{
        var nextPage = pagesToVisit.shift();
    }
    console.log('next URL ' +nextPage);
    
//check if out of pages
  if (typeof nextPage ==='undefined'){console.log('no page');fs.appendFileSync('public/working.html', '<b>no more sites!</b></body></html>');return;}
  
//otherwise, update baseUrl
//  need url format
  t_url = new URL(nextPage);
//  let's see if it is a relative link
//  console.log("next url protocol is " + t_url.protocol);
//  if not a relative link, capture the base url -- it shouldn't be a relative link, though, because we save absolute links
  if(t_url.protocol.startsWith("http")){baseUrl = t_url.protocol + "//" + t_url.hostname;}
//  console.log('new baseURL ' + baseUrl);
//if new domain, added to visited domains
  if (typeof domainsVisited.find(fruit => fruit.includes(baseUrl)) === 'undefined'){domainsVisited.push(baseUrl);numDomainsVisited++;}
  
//in case we have a relative link, give it a base url
=======
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
>>>>>>> 0ffb16d5f48dc5afabff2e628ec18f70ab1e8d87
  var nprotUrl = t_url.protocol;
  if( nprotUrl ==='' ){
    var i = nextPage.indexOf('/');
    if(i > 0){nextPage = nextPage.substring(i);}
    nextPage = baseUrl + nextPage;console.log("protocol: " + nprotUrl);
    }
  if (nextPage in pagesVisited) {
      console.log('already visited');
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
<<<<<<< HEAD
        console.log('no response');fs.appendFileSync('public/working2.html', '<b>oops, defective url at page <a href=' + t_url + '>'+ t_url + '</a>!<br><br></b>');
=======
        console.log('no response');fs.appendFileSync('public/working2.html', '<b>oops, defective url!<br><br></b>');
>>>>>>> 0ffb16d5f48dc5afabff2e628ec18f70ab1e8d87
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
<<<<<<< HEAD
        bodyText = $('html > body').text().toLowerCase();

=======
>>>>>>> 0ffb16d5f48dc5afabff2e628ec18f70ab1e8d87
//load links from any page containing "pbseedpage" -- allows us to build seed pages
        var isWordFound = searchForWord($,'pbseedpage');
        if (!(isWordFound)){
//if not a seedpage, look for search term
            isWordFound = searchForWord($, SEARCH_WORD);
        }
<<<<<<< HEAD
        if(isWordFound){
            numPagesFound++;
            ii=1;
            console.log('Word ' + SEARCH_WORD + ' found at page ' + t_url);
            while (isWordFound) {
                body = '<b>' + numPagesFound + '. </b>Word "<b>' + SEARCH_WORD + '" found</b> at page <a href=' + t_url + '>'+ t_url + '</a><br>';
                fs.appendFileSync('public/working.html', body);
                fs.appendFileSync('public/working.html', tempText + '<br>');
                isWordFound = searchForWord($, SEARCH_WORD);
//!!WARNING -- THIS COULD LIMIT VALID RESULTS FROM A SINGLE PAGE
                if (ii>100){break;}
                ii++
            }


    //since found and we will look at site later, let's not waste more time here.
        collectExternalLinks($);
        pagesToVisit = pagesToVisit.filter(fruit => !(fruit.includes(baseUrl)));
//        console.log('test pages ' + pagesTest);
//!!! we need to use filter and remove links to this domain from our stack!!!
        }else{
=======
        if(isWordFound) {
        console.log('Word ' + SEARCH_WORD + ' found at page ' + t_url);
        body = 'Word "<b>' + SEARCH_WORD + '" found</b> at page <a href=' + t_url + '>'+ t_url + '</a><br>';
        fs.appendFileSync('public/working.html', body);
    //since found and we will look at site, let's not waste more time here.
        collectExternalLinks($);
        } else {
>>>>>>> 0ffb16d5f48dc5afabff2e628ec18f70ab1e8d87
        body = 'Word "<b>' + SEARCH_WORD + '"</b> not found at page <a href=' + t_url + '>'+ t_url + '</a><br>';
        console.log('Word ' + SEARCH_WORD + ' not found at page ' + t_url);
        fs.appendFileSync('public/working2.html', body);
    //since word not found, let's check the rest of the website
        collectInternalLinks($);
        }
<<<<<<< HEAD
=======
    //     fs.appendFileSync('public/working.html', body);
    //   collectInternalLinks($); was formerly here -- my concept is to collect outward links when the search term is found, browse deeper on the site when not found
    //   but then do we need a way to come back and study the site where found? -- if we are going to manually read the page, we will see the related inbound links ...
>>>>>>> 0ffb16d5f48dc5afabff2e628ec18f70ab1e8d87
        // In this short program, our callback is just calling crawl()
        callback();
        return;
    }
  });
}

function searchForWord($, word) {
//  var bodyText = $('html > body').text().toLowerCase();
    var tempLength1 = bodyText.indexOf(word.toLowerCase());
  if(bodyText.indexOf(word.toLowerCase())){
      tempLength1 = bodyText.indexOf(word.toLowerCase());
      tempLength = bodyText.indexOf(word.toLowerCase())-200;
      if (tempLength < 0){tempLength = 0;}
      console.log(tempLength1);
      console.log(tempLength);
//now we get 100 char before and after search term (but I want to put the search term in bold!)
      tempText = bodyText.substring(tempLength,tempLength1+200);
//strip leading '<' to break html -- what we really want is plain text
      tempText = tempText.replace(/</g,'');
//get rid of leading portion of page --NEED TO MOVE UP ABOVE because last iteration overlooked
      bodyText = bodyText.substring(tempLength1+1);
        console.log('what? ' + bodyText.indexOf(word.toLowerCase()));
//      console.log('bodyText ' + bodyText);
    }
  return(tempLength1 !== -1);
}

//would it be more efficient to collect all links in one pass and separate them out?
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
<<<<<<< HEAD
//here is our ignore list -- it needs to be loaded from an ignore list file
            if(test.indexOf("3dcartstores") !== -1){console.log("skipping 3dcartstores");return;}
            if(test.indexOf("amazon.com") !== -1){console.log("skipping amazon");return;}
            if(test.indexOf("bing") !== -1){console.log("skipping bing");return;}
            if(test.indexOf("bloomberg.com/professional/") !== -1){console.log("skipping bloomberg.com/professional/");return;}
            if(test.indexOf("disney") !== -1){console.log("skipping disney");return;}
            if(test.indexOf("duckgo") !== -1){console.log("skipping duckduckgo");return;}
            if(test.indexOf("3dcartstores") !== -1){console.log("skipping 3dcartstores");return;}
            if(test.indexOf("google") !== -1){console.log("skipping google");return;}
            if(test.indexOf("facebook") !== -1){console.log("skipping facebook");return;}         
            if(test.indexOf("google") !== -1){console.log("skipping google");return;}
            if(test.indexOf("instagram") !== -1){console.log("skipping instagram");return;}
            if(test.indexOf("linkedin") !== -1){console.log("skipping linkedin");return;}
            if(test.indexOf("login") !== -1){console.log("skipping login");return;}
            if(test.indexOf("onecount") !== -1){console.log("skipping onecount");return;}
            if(test.indexOf("qwant") !== -1){console.log("skipping qwant");return;}
            if(test.indexOf("tumblr") !== -1){console.log("skipping tumblr");return;}
            if(test.indexOf("twitter") !== -1){console.log("skipping twitter");return;}
=======
            if(test.indexOf("3dcartstores") !== -1){console.log("skipping 3dcartstores");return;}
            if(test.indexOf("amazon.com") !== -1){console.log("skipping amazon");return;}
            if(test.indexOf("bing") !== -1){console.log("skipping bing");return;}
            if(test.indexOf("duckgo") !== -1){console.log("skipping duckduckgo");return;}
            if(test.indexOf("facebook") !== -1){console.log("skipping facebook");return;}         
            if(test.indexOf("google") !== -1){console.log("skipping google");return;}
            if(test.indexOf("qwant") !== -1){console.log("skipping qwant");return;}
>>>>>>> 0ffb16d5f48dc5afabff2e628ec18f70ab1e8d87
            if(test.indexOf("youtube") !== -1){console.log("skipping youtube");return;}
            if(test.indexOf("image") !== -1){console.log("skipping image");return;}
            if(test.indexOf(".png") !== -1){console.log("skipping image");return;}
            if(test.indexOf(".gif") !== -1){console.log("skipping image");return;}
            if(test.indexOf(".jpg") !== -1){console.log("skipping image");return;}
            if(test.indexOf(".jpeg") !== -1){console.log("skipping image");return;}
            if(test.indexOf("video") !== -1){console.log("skipping video");return;}
<<<<<<< HEAD
//test to skip local and relative links because we are only interested in outbound
//and we are making a list of found base urls so we can go back to the sites randomly rather than sequentially
//too much activity will get us banned -- another reason we want a large seed list
//BTW, I use "fruit" because that was the example at the javascript tutorial :-)
//do I need to test for '' protocol?
            if(!(test.startsWith(baseUrl)) && !(testUrl.protocol ==='') ){
            if(testUrl.protocol.startsWith("http")){
                test2 = domainsFound.find(fruit => fruit.includes(testUrl.protocol + "//" + testUrl.hostname));
//                console.log('founds ' + test2);
//commented items are for testing feedback and control
//                if (ii > 30){return;}
                if (typeof domainsFound.find(fruit => fruit.includes(test2)) === 'undefined'){
                      domainsFound.push(testUrl.protocol + "//" + testUrl.hostname);
                }
//                ii++;
            }
//                console.log('founds2  ');
//                console.log(domainsFound);
                pagesToVisit.push($(this).attr('href'));
                
            }
=======

            if(!(test.startsWith(baseUrl)) && !(testUrl.protocol ==='') ){pagesToVisit.push($(this).attr('href'));}
>>>>>>> 0ffb16d5f48dc5afabff2e628ec18f70ab1e8d87
        }
    });
}

function collectInternalLinks($) {  
//    var externalLinks = $("a[href^='http']");
    var internalLinks = $('a');
    console.log("Found " + internalLinks.length + " internal links on page");
    body = "Found " + internalLinks.length + " internal links on page<br><br>";
    fs.appendFileSync('public/working2.html', body);
//I wonder if I can reuse ii?
    var iii=0;
    internalLinks.each(function() {
//        pagesToVisit.push(baseUrl + $(this).attr('href'));
        var test = $(this).attr('href');
        var testUrl = new URL(test);

//skip empty/undefined/ill formatted
        if(typeof test ==='undefined'){
            
        }else{
<<<<<<< HEAD
//skip links we don't want to follow
=======
>>>>>>> 0ffb16d5f48dc5afabff2e628ec18f70ab1e8d87
            if(test.indexOf(".png") !== -1){console.log("skipping image");return;}
            if(test.indexOf(".gif") !== -1){console.log("skipping image");return;}
            if(test.indexOf(".jpg") !== -1){console.log("skipping image");return;}
            if(test.indexOf(".jpeg") !== -1){console.log("skipping image");return;}
<<<<<<< HEAD
//now test self-referencing local links (and is it redundant to put them here?  Why didn't I just put them above?  TRY IT SOON!!!
=======
>>>>>>> 0ffb16d5f48dc5afabff2e628ec18f70ab1e8d87
            if(test.startsWith(baseUrl)){;
                if(test.indexOf("#") !== -1){console.log("skipping local bookmark");return;}
                if(test.indexOf(".png") !== -1){console.log("skipping image");return;}
                if(test.indexOf("image") !== -1){console.log("skipping image");return;}
                if(test.indexOf(".gif") !== -1){console.log("skipping image");return;}
                if(test.indexOf(".jpg") !== -1){console.log("skipping image");return;}
                if(test.indexOf(".jpeg") !== -1){console.log("skipping image");return;}
                if(test.indexOf("video") !== -1){console.log("skipping video");return;}
<<<<<<< HEAD
//we are limiting number of local links to avoid link pollution overload
                if (iii < 5 ){pagesToVisit.push($(this).attr('href'));}
                iii++
            }
//now test relative links
=======
                pagesToVisit.push($(this).attr('href'))
            }
>>>>>>> 0ffb16d5f48dc5afabff2e628ec18f70ab1e8d87
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
<<<<<<< HEAD
//still limiting local links
                if ( iii < 5 ){pagesToVisit.push($(this).attr('href'));}
                iii++;
=======
                pagesToVisit.push($(this).attr('href'));                
>>>>>>> 0ffb16d5f48dc5afabff2e628ec18f70ab1e8d87
            }
        }
        console.log('limiter total is: ' + iii);
    });
}

