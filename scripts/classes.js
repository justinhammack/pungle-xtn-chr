/*
  *----------------------------
  *   Pungle Extension Class
  *----------------------------
*/
function pungleExtension() {
  // Variables Declared
  
  // Hash of merchants visited during this session
  var pXtn_visitedHash = new Array();
  
  // Array used to flag URLs passed through pungle.me site, do not redirect.
  var pXtn_passThru = new Array();
  
  // Array used to flag if the redirect has run for the URL.
  var pXtn_redirectRun = new Array();
  
  // Array used to flag the key (url) as allowing the extension to redirect.
  var pXtn_redirectArray = new Array();
  
  // Clean String cause name
  var pXtn_cause_id;
  

  // Methods Declared 
  
  // Get the merchant name for URL (value)
  this.getMerchantName = function (value) {
    return pungleJSON.store[value].name;
  },
  
  // Get the merchant ID for URL
  this.getMerchantID = function (value) {
    value = removeWWW(value.toLowerCase());
    
    for ( var i=0, len=pungleJSON.store.length; i<len; ++i ){
		  if ( pungleJSON.store[i].domain == value && pungleJSON.store[i].live == true ) { 
		    // log("EX:: getMerchantID => ID:" + pungleJSON.store[i].id + ", URL: " + value);
		    return pungleJSON.store[i].id;
	    }
		}
		
    return false;
  },
  
  // Simply return the cause name
  this.getCauseID = function () {
    if(getItem == "") return 0;
    else return getItem("causeID");
  },
  
  // Tests if the merchant exists for the URL (value)
  this.exists = function (value) {
    
    if (value!='undefined' && value!='' && value.toString().indexOf("chrome:") == -1) {
      value = removeWWW(value.toLowerCase());
      
      for ( var i=0, len=pungleJSON.store.length; i<len; ++i ){
  		  if ( pungleJSON.store[i].domain == value && pungleJSON.store[i].live == true ) { 
  		    log("EX:: Live Vendor Exists => NAME: " + pungleJSON.store[i].name);
  		    return true;
  	    }
  		}
  		
  		// Else vendor not found.
  		log("EX:: Vendor Not Found => DOMAIN: " + value);
  	}
  	
    return false;    
  },
  
  // Did we already go here URL (value)
  this.wasVisited = function (value) {
    if (pXtn_visitedHash[value] == 1) {
      log("EX:: User has already visited: " + value);
      return true;
    }
    log("EX:: User's first visit: " + value);
    return false;
  },
  
  // Mark this URL as visited
  this.setVisited = function (value) {
    pXtn_visitedHash[value] = 1;
    // log("EX:: setVisited => TRUE: " + value);
  },
  
  // Return Affiliate Store Link by ID for Referral Process
  this.affiliateLink = function (merchant_ID, cause_ID) {
    var referralURL = "http://pungle.me/inject/#id=" + merchant_ID + "&c=" + cause_ID;
    // log("EX:: Returning => Link: " + referralURL);    
    return referralURL;
  },
  
  // Enable/Disable (flag) slider redirection on URL
  this.setRedirect = function (url, flag) {
    pXtn_redirectArray[url] = flag;
    // only called by TL.. log("EX:: setRedirect => " + flag + ": " + url);
  },
  
  // Ask if it's OK for content script to redirect? (URL)
  this.isRedirect = function (url) {
    return pXtn_redirectArray[url];
  },
  
  // Set the redirect as having run for this URL.
  this.redirectRun = function (url) {
    pXtn_redirectRun[url] = true;
    log("EX:: redirectRun => TRUE: " + url);
  },
  
  // Has the redirect run for this URL?
  this.hasRedirectRun = function (url) {
    return pXtn_redirectRun[url];
  }
  
  // HOLD: Flag this URL as having already passed through Pungl.me site injector.
  /* this.flagPungleRedirect = function (merchant) {
    pXtn_passThru[merchant] = 1;
  }, */
  
  // HOLD: Check if already flagged as redirected by Pungle.me site injector.
  /* this.isRedirectFlagged = function (merchant) {
    return pXtn_passThru[merchant];
  }, */
  
  // OBSOLETE - set in popup.. Set the cause name in this object and in localStorage
  /* this.setCauseID = function (cause) {
    setItem("causeID", cause);
    pXtn_cause_id = cause;
  }, */
  
} // CLOSE pungleExtension Object


/*
  *--------------------------------
  *   Pungle Tab Url Watch Class
  *--------------------------------
*/
// function PTUWatch(inTab){
  /*
    * This class creates and maintains a basic click-stream for each tab, where the click stream is defined by
    * any URL that passes via the tab.onUpdated event listener.  This click stream will contain very basic information.
    * 
    * Each time a 'click' or URL is appended to the stream we look to see if it matches any other affiliate variations.
    * There is no need to test for amazon here because amazon's URL will contain the indicator. As soon as we see the
    * affsrc the isAff boolean is set to true.  The object will continue to take on new 'clicks' until it has been cleared.
    *
    * For each new tabid a new PUTWatch object will be created.
    *
    * @param inTab : the numeric tab ID
  */
  /*
  // declare scope variables
  var tabid = inTab; // holds the passed variable
  var clicks = new Array(); // A 0-index array of URLs in the stream 
  // Bad Code .. Hardly worth it: isAff = false; // Flag to indicate click-stream belongs to another affialiate 
  var clickIndex = 0; // Current Index in 'clicks' array.
  
  // Append a new URL or click to the stream, @param url - the new URL to append.
  this.appendClick = function (url) {
    if (clickIndex == 0) {
      log("TL:: First URL for Tab ID: " + tabid);
    }
    
    clicks[clickIndex++] = url;
    
    if (url.match(".*affsrc=.*") || url.match(".*aff=.*") || url.match(".*afsrc=.*")) {
      // isAff = true;
      log("TabID " + tabid + " isAff true. (" + url + ")");
    }
  },
  
  disabled.. 
  // Get isAff 
  this.isClickThru = function () {
    return isAff;
  },  
  
  // This method resets this object
  this.clearStream = function () {
    clicks = new Array();
    clickIndex = 0;
    // isAff = false;
    completeCount = 0;
    log("TL:: Clear Link Array => Tab ID: " + tabid);
  }
} //end PTUWatch */