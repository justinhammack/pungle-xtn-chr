/*
*---------------------
* Utility Functions
*---------------------
*/

// Query localStorage by key.
function getItem(key){
  try{
    var val = window.localStorage.getItem(key);
    if(val == null)	val = "";
    return val;
  }catch(e){
    console.log("Unable to return value for key  " + key);
    return "";
  }
}


// Query localStorage for integer by key. Return 0 if does not exist or non-int.
function getIntItem(key){
  var val = 0;
  try{
    val = parseInt(window.localStorage.getItem(key));
  }catch(e){}
  if(val == null || val == ""){
    val = 0;
  }
  return val;
}


// Set localStorage by key, value.
function setItem(key, value){
  try{
    window.localStorage.removeItem(key);
    window.localStorage.setItem(key, value);
  }catch(e){
    console.log("Unable to set value for key " + key);
  }
}


// Set localStorage by key only if does not exist
function setIfEmpty(key, value) {
  try {
    if (getItem(key) == "") {
      setItem(key, value);
    }
  }
  catch (e) {
    setItem(key, value);
  }
}


// Remove the www and subdomain from the URL.
function removeWWW(url) {
  if (typeof (url) == "undefined") {
    return;
  }
  var retval = url;
  if (url.indexOf("www") != -1) {
    retval = url.substring(url.indexOf(".") + 1, url.length);
  }
  var domainCount = retval.split(".").length - 1;
  while (domainCount > 1) {
    retval = retval.substring(retval.indexOf(".") + 1, retval.length);
    domainCount = retval.split(".").length - 1;
  }
  return retval;
}


// Strips the protocol and trailing slash from the URL leaving the domain.
// ie http://www.amazon.com/Products -> www.amazon.com
function cleanURL(url){
  if(typeof(url) == "undefined") return "undefined";
  
  url = url.replace("http://", "");
  url = url.replace("https://", "");
  url = url.substring(0, url.indexOf('/'));
  
  return url;
}


// This method sends the redirect message to a specific tab on 'port' telling the content-script to run the redirect.
function sendRedirectMessage(port, url) {
  if (!port) {
    log("TL:: ERROR: PORT NOT FOUND!");
    return;
  }
  
  var flag = pXtn.isRedirect(cleanURL(url));
  
  if (flag && !pXtn.hasRedirectRun(cleanURL(url))) {
    // We are clear to redirect and has not run before this call.
    log("TL:: CALL EX:: Redirect Request " + url);
    
    // Super scrubbed URL, just for good measure.
    var clean = cleanURL(url);
    
    // Mark the URL as having been redirected.
    pXtn.redirectRun(clean);
    
    // Collect merchant & cause information.
    var merchantID = pXtn.getMerchantID(clean);
    var causeID = pXtn.getCauseID();
    
    log("EX:: Compiling Message for ID: " + merchantID);
    
    port.postMessage({
      response: "redirect",
      merchant: merchantID,
      cause: causeID
    });
    
    log("EX:: Redirect message sent.");
  }
}


function queryVersion() {
  var jsonUrl = chrome.extension.getURL("manifest.json");
  var xhr = new XMLHttpRequest();
  var qVersion = "Undeclared";
  
  xhr.open("GET", jsonUrl, false);  
  xhr.send();
  
  if(xhr.readyState == 4 && xhr.status == 200) {
    var manifest = JSON.parse(xhr.responseText);
    qVersion = manifest.version;
  }
  
  return qVersion;
}


// Function to add/remove console logs
function log(txt){ console.log(txt); }