/*
  *--------------------------------
  *   Pungle Tab Url Watch Class
  *--------------------------------
*/
function PTUWatch(inTab){
  /*
    * Previously WCStream // <-- wtf does this do? 
    * This class creates and maintains a basic click-stream for each tab, where the click stream is defined by
    * any URL that passes via the tab.onUpdated event listener.  This click stream will contain very basic information.
    * 
    * Each time a 'click' or URL is appended to the stream we look to see if it matches any of the affsrc variations.
    * There is no need to test for amazon here because amazon's URL will contain the indicator. As soon as we see the
    * affsrc the isAff boolean is set to true.  The object will continue to take on new 'clicks' until it has been cleared.
    *
    * For each new tabid a new WCStream object will be created.
    *
    * @param inTab : the numeric tab ID
  */
  
  // declare scope variables
  var tabid = inTab; // <-- wtf does this do? 
  var clicks = new Array(); // A 0-index array of URLs in the stream 
  var isAff = false; // Flag to indicate click-stream belongs to another affialiate 
  var clickIndex = 0; // Current Index in 'clicks' array.
  
  // Append a new URL or click to the strem, @param url - the new URL to append.
  this.appendClick = function (url) {
    if (clickIndex == 0) {
      log("TabID " + tabid + " Start " + url);
    }
    
    clicks[clickIndex++] = url;
    
    if (url.match(".*affsrc=.*") || url.match(".*aff=.*") || url.match(".*afsrc=.*")) {
      isAff = true;
      log("TabID " + tabid + " isAff true. (" + url + ")");
    }
  },
  
  // Get isAff 
  this.isClickThru = function () {
    return isAff;
  },
  
  // This method resets this object
  this.clearStream = function () {
    clicks = new Array();
    clickIndex = 0;
    isAff = false;
    completeCount = 0;
    log("TabID " + tabid + "  Cleared Stream!");
  }
} //end PTUWatch 


/*
  *----------------------------
  *   Pungle Extension Class
  *----------------------------
*/
function pungleExtension() {
  
  // Variables Declared
  
  /*
  var pXtn_MerchantArray;   // Hash of all merchants
  
  var pXtn_ClickHash;       // Hash array of all click-thru links, used to test if a item in the click-stream is an affiliate click-thru
  
  var pXtn_VistedHash;      // Hash of merchants visited during this session
  
  var pXtn_version;         // Plugin version returned from Update call
  
  var pXtn_plugin_id;       // This plugin's secure ID
  
  var pXtn_subdom;          // Current Cause subdomain
  
  var pXtn_ltvid;            // The vintage of this plugin
  
  var pXtn_readonly;         // Flag indicates if the cause can be changed
  
  var pXtn_views;            // Count of page views
  
  var pXtn_accepts;          // Count of redirect accepts
  
  var pXtn_declines;         // Count of redirect declines
  
  var pXtn_cause_name;       // Clean String cause name
  
  var pXtn_wasUpdated;       // Last update date
  
  var pXtn_redirectHandle;   // Array of redirect handles (tab ids)
  
  var pXtn_informationSent;  // Array hash contains URL as keys and boolean values for flagged information
  
  var pXtn_redirectArray;    // Array used to flag the key (url) as allowing the plugin to redirect.
  
  var pXtn_sliderFired;      // Array used to flag if the slider fired. Key is the URL.
  
  var pXtn_wecareThru;       // Array used to flag URLs as not redirectable. Ie. we went though we-care mall, dont redirect again.
  
  var pXtn_logo;             // WTF do we need this for?
  */
  
  
  /*
   *  Methods Declared 
   */
  
  // THIS DOES WHAT? 
  this.updateMerchantHash = function () {
    WCR_VistedHash = new Array();
    var lastUpdate = getItem("lastUpdHash");
    var dd = lastUpdate.split("-");
    var updMonth = dd[1];
    var updDay = dd[2];
    var updYear = dd[0];
    lastUpdate = updYear + updMonth + updDay;
    WCR_informationSent = new Array();
    WCR_redirectArray = new Array();
    WCR_sliderFired = new Array();
    WCR_redirectHandle = new Array();
    WCR_wecareThru = new Array();
    WCR_wasUpdated = false;
    WCR_version = getItem("version");
    WCR_cause_name = getItem("cause_name");

    if (VERSION != WCR_version) {
      setItem("version", VERSION);
    }

    WCR_plugin_id = getItem("secureId");
    if (WCR_plugin_id == "") {
      WCR_plugin_id = "0";
    }
    WCR_plugin_id = "&id=" + WCR_plugin_id;

    WCR_subdom = getItem("subdomain");
    if (WCR_subdom == "") {
      WCR_subdom = "0";
      lastUpdate = "00000000000000";
    }

    WCR_subdom = "&subdom=" + WCR_subdom;

    WCR_ltvid = getItem("ltvid");
    WCR_views = getIntItem("btnviews");
    WCR_accepts = getIntItem("num_accepts");
    WCR_declines = getIntItem("num_declines");

    var WCR_clicks = "&clicks=" + WCR_views + ":" + WCR_accepts + ":" + WCR_declines;

    WCR_readonly = getItem("readonly");
    var self = this;
    var url = "http://plugin.we-care.com/UpdatePlugin.php?lastUpd=" + lastUpdate + "&version=" + WCR_version + WCR_plugin_id + WCR_subdom + WCR_clicks + '&plugin_type=' + __plugin_type + '&autoclk=true&ltvid=' + WCR_ltvid + '&readonly=' + WCR_readonly;
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", url, true);
    xmlHttp.onreadystatechange = function (e) {
      if (xmlHttp.readyState == 4) {
        if (xmlHttp.status == 200) {
          var data = xmlHttp.responseText;
          WCR_cause_name = xmlHttp.getResponseHeader('Cause-Name');
          if (WCR_cause_name != "" && WCR_cause_name != "undefined") {
            if (WCR_cause_name == "blank000") {
              log("setting cause name to null");
              setItem("cause_name", "");
              WCR_cause_name = "";
            }
            else {
              setItem("cause_name", WCR_cause_name);
            }

            log("Cause Name: " + getItem("cause_name"));
          } //end if WCR_cause_name
          if (xmlHttp.getResponseHeader('Update-Needed') == 'Yes') {
            //check if response data contains valid domains (Ask bryan about this??)
            if (data.search(";") < 30) {
              //change all line breaks into this delimeter '::'
              data = data.replace(/\n/g, "::");
              log("Setting domainHash");
              setItem("domainHash", data);
              self.createLocalHash(data);
              var WCR_date = new Date();
              setItem("lastUpdHash", formatDate(WCR_date));
            }
          } //end if Update-Needed
          else {
            self.createLocalHash(getItem("domainHash"));
          }
          //get a plugin Id if required
          if (xmlHttp.getResponseHeader("X-Plugin-Id") != null) {
            var id = xmlHttp.getResponseHeader("X-Plugin-Id");
            setItem("secureId", id);
          }

          //get the subdomain
          if (xmlHttp.getResponseHeader('X-Subdomain') != null) {
            var subdom = xmlHttp.getResponseHeader('X-Subdomain');
            setItem("subdomain", subdom);
            WCR_subdom = "&subdom=" + subdom;
            log("Subdomain: " + getItem("subdomain"));

            if (getItem("subdomain") != "") {
              //cache image
              self.cacheImage(self.getLogoURL());
            }
            else {
              log("unable to cache image!");
            }
          }
        }
      }
    }; //end on ready state change
    xmlHttp.send(null);
    WCR_wasUpdated = true;
  }, //end updateMerchantHash
  
  // THIS DOES WHAT? 
  this.cacheImage = function (url) {
    log("Caching Image " + url);
    var imageCache = new Image(60, 44);
    imageCache.src = url;
    log(imageCache.src);
    WCR_logo = url;
  },
  
  // THIS DOES WHAT? 
  this.createLocalHash = function (hashData) {
    WCR_MerchantArray = new Array();
    WCR_ClickHash = new Array();
    hashData = hashData.split("::");
    var hashcount = 0;
    for (var i = 0; i < hashData.length; i++) {
      var line = hashData[i];
      if (line.indexOf("@") == 0) {
        var arrLine = line.split(":");
        if (arrLine[0].trim != "" && arrLine[1].trim != "") {
          var clickthru = arrLine[0].substring(1, arrLine[0].length);
          WCR_ClickHash[clickthru] = arrLine[1];
          hashcount = hashcount + 1;
        }
      }
      else if (line.indexOf(";") >= 0) {
        var arrLine = line.split(";");
        if (arrLine[0].trim != "" && arrLine[1].trim != "" && arrLine[2].trim != "" && arrLine[3].trim != "") {
          WCR_MerchantArray[arrLine[0]] = new Array(3);
          WCR_MerchantArray[arrLine[0]][0] = arrLine[1];
          WCR_MerchantArray[arrLine[0]][1] = arrLine[2];
          WCR_MerchantArray[arrLine[0]][2] = arrLine[3];
          hashcount += 1;
        }
        //we have coupon data!
        if (arrLine.length > 4) {
          WCR_MerchantArray[arrLine[0]][3] = arrLine[4]; //description
          WCR_MerchantArray[arrLine[0]][4] = arrLine[5]; //coupon code
          log(arrLine[1] + " -> Adding Coupon Data: " + arrLine[4] + " -> " + arrLine[5]);
        }
      }
    } //end for i loop
  },
  
  // THIS DOES WHAT? 
  this.initLtvid = function () {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function (e) {
      if (xhr.readyState == 4) {
        if (xhr.responseText != "") {
          var resp = JSON.parse(xhr.responseText);
          if (resp) {
            setItem("ltvid", resp.ltvid);
            WCR_ltvid = resp.ltvid;
            log("LTVID JSON:: " + resp.ltvid + "  " + resp.subdomain);
            setItem("subdomain", resp.subdomain);
            WCR_subdom = "&subdom=" + resp.subdomain;
            setItem("readonly", "1");
            READ_ONLY = 1;
          }
        }
      }
    };
    try {
      var url = chrome.extension.getURL("ltvid.json");
      xhr.open("GET", url, true);
      xhr.send();
    }
    catch (e) {
      log("no ltvid file");
    }
  }, //end initLtvid
  
  // THIS DOES WHAT? Mark this merchant as comming through an affiliate link    
  this.flagWeCareRedirect = function (merchant) {
    WCR_wecareThru[merchant] = 1;
  },
  
  // THIS DOES WHAT? Getter, test if redirect is flagged.
  this.isRedirectFlagged = function (merchant) {
    return WCR_wecareThru[merchant];
  },
  
  // THIS DOES WHAT? Getter, test if url was clickthrough
  this.isClickThru = function (url) {
    return WCR_ClickHash[url] == 1 ? true : false;
  },
  
  // THIS DOES WHAT? Determine if merchant requires the Earn Donation button.
  this.isEarnDonation = function (value) {
    value = removeWWW(value.toLowerCase());
    var retval = WCR_MerchantArray[value][2];
    if (!retval) {
      retval = WCR_MerchantArray[value.toLowerCase()][2];
    }
    return retval == 1 ? false : true;
  },
  
  // THIS DOES WHAT? Get the merchant name for URL (value)
  this.getMerchantName = function (value) {
    value = removeWWW(value.toLowerCase());
    return WCR_MerchantArray[value][1];
  },
  
  // THIS DOES WHAT? Get coupon information for the merchant
  this.getMerchantCoupon = function (id) {
    id = removeWWW(id.toLowerCase());
    var couponStr = "";
    if (WCR_MerchantArray[id].length > 4) {
      couponStr = WCR_MerchantArray[id][3] + " use coupon code: <b>" + WCR_MerchantArray[id][4] + "</b>";
    }
    return couponStr;
  },
  
  // THIS DOES WHAT? Get the merchant ID for URL
  this.getMerchant = function (value) {
    value = removeWWW(value.toLowerCase());
    return WCR_MerchantArray[value][0];
  },
  
  // THIS DOES WHAT? Simply return the cause name
  this.getCauseName = function () {
    return WCR_cause_name;
  },
  
  // THIS DOES WHAT? Set the cause name in this object and in localStorage
  this.setCauseName = function (cause) {
    setItem("cause_name", cause);
    WCR_cause_name = cause;
  },
  
  // THIS DOES WHAT? Set the subdomain in this object and localStorage
  this.setSubdomain = function (subdom) {
    subdom = subdom.toString().trim();
    setItem("subdomain", subdom);
    WCR_subdom = "&subdom=" + subdom;
  },
  
  // THIS DOES WHAT? Getter for subdomain
  this.getSubdomain = function () {
    return WCR_subdom;
  },
  
  // THIS DOES WHAT? Returns and creates a logo url for the current subdomain
  this.getLogoURL = function () {
    return "http://" + getItem("subdomain") + ".we-care.com/logo.bmp?small=true";
  },
  
  // THIS DOES WHAT? Tests if the merchant exists for the URL (value)
  this.exists = function (value) {
    value = value.toLowerCase();
    var noWWW = removeWWW(value);
    var no = (typeof WCR_MerchantArray[noWWW] != "undefined") ? true : false;
    var retval = (typeof WCR_MerchantArray[value] != "undefined") ? true : false;
    if (retval || no) {
      return true;
    }
    return false;
  },
  
  // THIS DOES WHAT? Did we already go here URL (value)
  this.wasVisited = function (value) {
    if (WCR_VistedHash[value] == 1) {
      return true;
    }
    return false;
  },
  
  // THIS DOES WHAT? Mark this URL as visited
  this.setVisited = function (value) {
    WCR_VistedHash[value] = 1;
  },
  
  // THIS DOES WHAT? Send we-care redirect
  this.sendInformation = function (WCR_TO, accpt) {
    log("Sending Information For " + WCR_TO);
    if (!WCR_informationSent[WCR_TO]) {
      WCR_informationSent[WCR_TO] = false;
    }
    var views = 0,
      accepts = 0,
      declines = 0;
    if (accpt) {
      WCR_plugin_id = getItem("secureId");
      if (WCR_plugin_id == "") {
        WCR_plugin_id = "0";
      }
      var plugin_id = "?secure_id=" + WCR_plugin_id;
      var subdom = getItem("subdomain");

      if (subdom != null && subdom != '') {
        subdom = "&plugin_subdom=" + subdom;
      }

      WCR_accepts = this.incrementClicks("num_accepts");
      var ltvid = "";
      if (WCR_ltvid != "") {
        ltvid = "&ltvid=" + WCR_ltvid;
      }
      var url = '';
      if (!WCR_informationSent[WCR_TO]) {
        url = "http://plugin.we-care.com/Redirect/" + "Store/" + WCR_TO + plugin_id + subdom + '&plugin_type=' + __plugin_type + '&async=true' + ltvid + '&readonly=' + WCR_readonly;
        WCR_informationSent[WCR_TO] = true;
      }
    }
    return url;
  }, //end send information
  
  // THIS DOES WHAT? Increment the click counter based on key
  this.incrementClicks = function (key) {
    var num = Number(getIntItem(key));
    num++;
    setItem(key, num);
    return num;
  },
  
  // THIS DOES WHAT? Close the redirect handle (tab id) ???? @deprecated
  this.closeRedirect = function (url) {
    chrome.tabs.remove(WCR_redirectHandle[url]);
    // WCR_redirectHandle[url].close();
  },
  
  // THIS DOES WHAT? Enable/Disable (flag) slider redirection on URL
  this.setRedirect = function (url, flag) {
    WCR_redirectArray[url] = flag;
  },
  
  // THIS DOES WHAT? Can the slider redirect? (URL)
  this.isRedirect = function (url) {
    return WCR_redirectArray[url];
  },
  
  // THIS DOES WHAT? Set the slider fired for this URL
  this.sliderFired = function (url) {
    WCR_sliderFired[url] = true;
  },
  
  // THIS DOES WHAT? Has the slider fired for this URL?
  this.hasSliderFired = function (url) {
    return WCR_sliderFired[url];
  }
} // CLOSE pungleExtension Object