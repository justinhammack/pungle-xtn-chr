/*
  *-----------------------
  *   Utility Functions
  *-----------------------
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
function setItemIfNotExists(key, value) {
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


// Format date object into year, month, day String
function formatDate(date){
  var year = new String(date.getYear() + 1900);
  var month = new String(date.getMonth()+1);
  var day = new String(date.getDate());
  
  if(month.length == 1) month = "0" + month;
  
  if(day.length == 1 ) day = "0" + day;
  
  return year+"-"+month+"-"+day;	
}


// Strips the protocol and trailing slash from the URL leaving the domain.
// ie http://www.amazon.com/Products -> www.amazon.com
function cleanURL(url){
  if(typeof(url) == "undefined") return "undefined";
  
  url = url.replace("http://", "");
  url = url.replace("https://", "");
  url = url.substring(0, url.indexOf('/'));
  
  log("Clean URL: " + url);
  
  return url;
}


// This method sends the redirect message to a specific tab on 'port' telling the content-script to run the slider.
function sendRedirectMessage(port, url) {
  if (!port) {
    return;
  }
  var flag = WCR.isRedirect(cleanURL(url));
  
  if (flag && !WCR.hasSliderFired(cleanURL(url))) {
    log("(BG) Sending Redirect Message " + url);
    var clean = cleanURL(url);
    WCR.sliderFired(clean);
    var merchantName = WCR.getMerchantName(clean);
    var logoURL = WCR.getLogoURL();
    var couponStr = WCR.getMerchantCoupon(clean);
    log("[[SendRedirect]] Got " + merchantName + " - > " + couponStr);
    
    port.postMessage({
      response: "redirect",
      merchant: merchantName,
      logo: logoURL,
      subdom: getItem("subdomain"),
      causeName: WCR.getCauseName(),
      earn: WCR.isEarnDonation(clean),
      coupon: couponStr
    });
  }
}


// Function to add/remove console logs
function log(txt){ console.log(txt); }