//ver. 0.03.01 03/27/2018
//NOTE:  TO COPY CONSOLE TO LOGFILE, RUN AS "node server.js | tee public/log-file.txt
//DEFECT!! when word found, previously collected inbound links need to be skipped
//DEFECT!! search on "Andrew McCabe did not yield hits that were there.  "Trump" worked okay, what is problem?
//need to consider sync/async issues
//honor robots -- this may need a skip list array
//add timer
//add stat analysis
//import skip list from text file
//xml skins for b2evo/wp?
//need to delete similar links when hit "already visited, because may have added same multiple times
//or ... check to see if link already in list before adding?  Already in to visit OR already in visited
//!!need to process and follow links where the text found is actually the display text in the link!!
//03/27/2018 - list link once for multiple instances of word on page
//03/27/2018 - convert images to links (will not work if no "alt" entry!)
//03/27/2018 - found word shown in boldface
//03/27/2018 - added link to search page to view logfile, see above for how to generate
//03/20/2018 - limit loop to pick up only [4] internal links to get more variety of sites
//03/18/2018 - MAJOR CHANGE: code to return text in proximity to the search term
//03/18/2018 - remove all "<" from HTML in the retrieved text snippet, to prevent
//03/18/2018 captured html from rendering.

const http = require('http')
const port = 3000

var version = '0.03.01';

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
    wordLength = SEARCH_WORD.length;
    if (link_num < 1000){MAX_PAGES_TO_VISIT = link_num};
    numPagesVisited = 0;
    numDomainsVisited = 0;
    numPagesFound = 1;
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
    
    fs.writeFileSync('public/working.html', '<html><head><meta http-equiv="content-type" content="text/html;charset=utf-8" /></head><body>Current Search:<br><br>');
    fs.writeFileSync('public/working2.html', '<html><body>Current Search rejects:<br><br>');
    
// crawl the internet

    crawl()

//crawl is done, finish working.html -- except this doesn't happen.  Why not???  
//BECAUSE - async, this happens immediately after the new document is opened and before the crawl returns.

//    body = '</body></html>';
//    fs.appendFileSync('public/working.html', body);
//    fs.appendFileSync('public/working2.html', body);
    

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
    console.log('selected domain is ' + chooseDomain + ' at ' + foundDomainIndex);

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
        console.log('no response');fs.appendFileSync('public/working2.html', '<b>no response at page <a href=' + t_url + '>'+ t_url + '</a>!<br><br></b>');
        fs.appendFileSync('public/working.html', '<b>no response at page <a href=' + t_url + '>'+ t_url + '</a>!<br><br></b>');
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
        bodyText = $('html > body').text().toLowerCase();

//load links from any page containing "pbseedpage" -- allows us to build seed pages
        var isWordFound = searchForWord($,'pbseedpage');
        if (!(isWordFound)){
//if not a seedpage, look for search term
            isWordFound = searchForWord($, SEARCH_WORD);
        }else{numPagesFound--;}
        if(isWordFound){
            console.log('Word ' + SEARCH_WORD + ' found at page ' + t_url);
            body = '<b>' + numPagesFound + '. <a href=' + t_url + '>'+ t_url + '</a></b><br>';
            if (numPagesFound > 0){
                fs.appendFileSync('public/working.html', body);
            }
            numPagesFound++;
            ii=1;
            while (isWordFound) {
                if (numPagesFound > 1){
                    fs.appendFileSync('public/working.html', tempText + '<br><br>');
                }
                isWordFound = searchForWord($, SEARCH_WORD);
    //!!WARNING HIS COULD LIMIT VALID RESULTS FROM A SINGLE PAGE
                if (ii>100){break;}
                ii++
            }


    //since found and we will look at site later, let's not waste more time here.
        collectExternalLinks($);
//I removed the following line because it prevents following links to the actual story on the page.  Need to find another way to do this!!!
//        pagesToVisit = pagesToVisit.filter(fruit => !(fruit.includes(baseUrl)));
//        console.log('test pages ' + pagesTest);
//!!! we need to use filter and remove links to this domain from our stack!!! -- this is elsewhere, commented out
        }else{
        body = 'Word "<b>' + SEARCH_WORD + '"</b> not found at page <a href=' + t_url + '>'+ t_url + '</a><br>';
        console.log('Word ' + SEARCH_WORD + ' not found at page ' + t_url);
        fs.appendFileSync('public/working2.html', body);
    //since word not found, let's check the rest of the website
        collectInternalLinks($);
        }
        // In this short program, our callback is just calling crawl()
        callback();
        return;
    }
  });
}

function searchForWord($, word) {
  if(bodyText.indexOf(word.toLowerCase())){
      tempLength1 = bodyText.indexOf(word.toLowerCase());
      tempLength = bodyText.indexOf(word.toLowerCase())-200;
      if (tempLength < 0){tempLength = 0;}
      console.log(tempLength1);
      console.log(tempLength);
//now we get 100 char before and after search term (but I want to put the search term in bold!)
//      tempText = bodyText.substring(tempLength,tempLength1+200);
      tempText = bodyText.substring(tempLength,tempLength1)+"<b>" + word + "</b>" + bodyText.substring(tempLength1+wordLength,tempLength1+200);

//trap images
        if(tempText.indexOf('<img')){
            tempText = tempText.replace(/<img/g,'<b>image</b>');
            tempText = tempText.replace(/src/g,'<a href');
            tempText = tempText.replace(/alt=/g,'>') + '</a>';
        }

//get rid of leading portion of page -- is last iteration overlooked?? Why did I suspect that?
      bodyText = bodyText.substring(tempLength1+1);
    }
//this signals status of function to run again
    return(tempLength1 !== -1);
}

//would it be more efficient to collect all links in one pass and separate them out?
function collectExternalLinks($) {  
//    var externalLinks = $("a[href^='http']");
    var externalLinks = $('a');
//list number of links found on page
    console.log("Found " + externalLinks.length + " outbound links on page");
//    body = "Found " + externalLinks.length + " outbound links on page<br><br>";
//    fs.appendFileSync('public/working.html', body);
    externalLinks.each(function() {
//        pagesToVisit.push(baseUrl + $(this).attr('href'));
        var test = $(this).attr('href');
        var testUrl = new URL(test);

        if(typeof test ==='undefined'){
            return;
        }else{
//here is our ignore list -- it needs to be rewritten to load from an ignore list file
//ignoring useless links is critical    
            if(test.indexOf("3dcartstores") !== -1){console.log("skipping 3dcartstores");return;}
            if(test.indexOf("amazon.com") !== -1){console.log("skipping amazon");return;}
            if(test.indexOf("bing") !== -1){console.log("skipping bing");return;}
            if(test.indexOf("bloomberg.com/professional/") !== -1){console.log("skipping bloomberg.com/professional/");return;}
            if(test.indexOf("contest") !== -1){console.log("skipping contest");return;}
            if(test.indexOf("dashboard") !== -1){console.log("skipping dashboard");return;}
            if(test.indexOf("disney") !== -1){console.log("skipping disney");return;}
            if(test.indexOf("duckgo") !== -1){console.log("skipping duckduckgo");return;}
            if(test.indexOf("email") !== -1){console.log("skipping email");return;}
            if(test.indexOf("facebook") !== -1){console.log("skipping facebook");return;}         
            if(test.indexOf("feedback") !== -1){console.log("skipping feedback");return;}
            if(test.indexOf("flickr") !== -1){console.log("skipping flickr");return;}         
            if(test.indexOf("ooter") !== -1){console.log("skipping footer");return;}         
            if(test.indexOf("google") !== -1){console.log("skipping google");return;}
            if(test.indexOf("instagram") !== -1){console.log("skipping instagram");return;}
            if(test.indexOf("javascript") !== -1){console.log("skipping javascript");return;}
            if(test.indexOf("license") !== -1){console.log("skipping license");return;}
            if(test.indexOf("linkedin") !== -1){console.log("skipping linkedin");return;}
            if(test.indexOf("login") !== -1){console.log("skipping login");return;}
            if(test.indexOf("menu") !== -1){console.log("skipping menu");return;}
            if(test.indexOf("onecount") !== -1){console.log("skipping onecount");return;}
            if(test.indexOf("privacy") !== -1){console.log("skipping privacy");return;}
            if(test.indexOf("qwant") !== -1){console.log("skipping qwant");return;}
            if(test.indexOf("player.radio") !== -1){console.log("skipping player.radio");return;}
            if(test.indexOf("rewards") !== -1){console.log("skipping rewards");return;}
            if(test.indexOf("servlet") !== -1){console.log("skipping servlet");return;}
            if(test.indexOf("subscri") !== -1){console.log("skipping subscribe");return;}
            if(test.indexOf("tumblr") !== -1){console.log("skipping tumblr");return;}
            if(test.indexOf("truste.com") !== -1){console.log("skipping truste.com");return;}
            if(test.indexOf("twitter") !== -1){console.log("skipping twitter");return;}
            if(test.indexOf("youtu") !== -1){console.log("skipping youtube");return;}
            if(test.indexOf("wholefoods") !== -1){console.log("skipping wholefoods");return;}
            if(test.indexOf("woot") !== -1){console.log("skipping woot");return;}
            if(test.indexOf("image") !== -1){console.log("skipping image");return;}
            if(test.indexOf(".png") !== -1){console.log("skipping image");return;}
            if(test.indexOf(".gif") !== -1){console.log("skipping image");return;}
            if(test.indexOf(".jpg") !== -1){console.log("skipping image");return;}
            if(test.indexOf(".jpeg") !== -1){console.log("skipping image");return;}
            if(test.indexOf("ideo") !== -1){console.log("skipping video");return;}
//test to skip local and relative links because we are only interested in outbound
//and we are making a list of found base urls so we can go back to the sites randomly rather than sequentially
//too much activity will get us banned -- another reason we want a large seed list
//BTW, I use "fruit" because that was the example at the javascript tutorial :-)
//do we need to test for '' protocol?
//well, but we do want self-referring links that contain the search term!
//this seems to work, but getting "no response" in almost every instance??? Maybe it is a timeout thing,
//I as successful putting one of the links in as the starting page to be searched???

            if(test.indexOf(SEARCH_WORD.toLowerCase()) !== -1){
                console.log("LINK WITH SEARCH TERM!");
//                if(test.startsWith(baseUrl)){
//                    console.log($(this).attr('href'));
//                    pagesToVisit.push($(this).attr('href'));
//                }
                if(testUrl.protocol=''){
                    test = baseUrl + test;
                    console.log('here2');
//this is defective, didn't bring nprotUrl forward?
//                    console.log("protocol: " + nprotUrl);
                    console.log($(this).attr('href'));
                    pagesToVisit.push($(this).attr('href'));
                }else{
//this is probably redundant with first choice, probably there are https or http links, because
//we are getting "LINK WITH SEARCH TERMS!" and no link...
//so far, have not found any that log with 'here2'                    
//                    console.log('here3');
                    console.log($(this).attr('href'));
                    pagesToVisit.push($(this).attr('href'));                    
                }
                return;                
            }

            if(!(test.startsWith(baseUrl)) && !(testUrl.protocol ==='') ){
            if(testUrl.protocol.startsWith("http")){
                test2 = domainsFound.find(fruit => fruit.includes(testUrl.protocol + "//" + testUrl.hostname));
//                console.log('founds ' + test2);
//commented items are for testing feedback and control
//                if (ii > 30){return;}
                if (typeof domainsFound.find(fruit => fruit.includes(test2)) === 'undefined'){
                    console.log('new domain: ' + testUrl.protocol + "//" + testUrl.hostname);
                    domainsFound.push(testUrl.protocol + "//" + testUrl.hostname);
                }
//                ii++;
            }
//                console.log('founds2  ');
//                console.log(domainsFound);
                pagesToVisit.push($(this).attr('href'));
                
            }
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
//skip links we don't want to follow
            if(test.indexOf(".png") !== -1){console.log("skipping image");return;}
            if(test.indexOf(".gif") !== -1){console.log("skipping image");return;}
            if(test.indexOf(".jpg") !== -1){console.log("skipping image");return;}
            if(test.indexOf(".jpeg") !== -1){console.log("skipping image");return;}
            if(test.indexOf("contest") !== -1){console.log("skipping contest");return;}
            if(test.indexOf("dashboard") !== -1){console.log("skipping dashboard");return;}
            if(test.indexOf("email") !== -1){console.log("skipping email");return;}
            if(test.indexOf("image") !== -1){console.log("skipping image");return;}
            if(test.indexOf("javascript") !== -1){console.log("skipping javascript");return;}
            if(test.indexOf("menu") !== -1){console.log("skipping menu");return;}
            if(test.indexOf("privacy") !== -1){console.log("skipping privacy");return;}
            if(test.indexOf("subscri") !== -1){console.log("skipping subscribe");return;}
            if(test.indexOf("ideo") !== -1){console.log("skipping video");return;}
            if(test.startsWith(baseUrl)){
                if(test.indexOf("#") !== -1){console.log("skipping local bookmark");return;}
                console.log('limiter total is: ' + iii);
                if (iii < 5 ){pagesToVisit.push($(this).attr('href'));}else{return false;}
                iii++
            }
//now test relative links
            if(testUrl.protocol=''){                
                if(test.indexOf("#") !== -1){console.log("skipping local bookmark");return;}
                    var i = test.indexOf('/');
                if(i > 0){test = test.substring(i);}
                test = baseUrl + test;console.log("protocol: " + nprotUrl);
//still limiting local links
                console.log('limiter total is: ' + iii);
                if ( iii < 5 ){pagesToVisit.push($(this).attr('href'));}else{return false;}
                iii++;
            }
        }
    });
}

