/*
*-------------------------------------
*   Content-Script Global Variables
*-------------------------------------
*/

// Query the current location URL
var pXtn_URL = document.location.href;

// Holds the cause name.
var pXtn_causeName = "YOUR MOM";

// Will store the icon filename for the users cause.
var pXtn_causeIcon = "";

// Holds the current store name text.
var pXtn_storeName = "";

// Time out
var pXtn_timeout = 15000;

// The current subdomain (cause). <--- WTF IS THIS?
var pXtn_subdom;

/* DEPRICATED VARIABLES THAT ARE NO LONGER NEEDED?
// Stores the coupon string.  If any...
var WCR_coupon = "";
// Flag to determine if the Earn Donation button is to be rendered.
var WCR_earn = false;
// WTF DOES THIS DO? 
var slideUpTimeOut = null;
*/


/* -----------> REMOVE THIS BLURB, IT'S EVIDENCE BRO! <--------------
* Main Content-Script Process
* The main process consisits of two parts:
*  1. Did we come from we-care.com or were we referrered by we-care?
*  2. Any other case i.e(direct link, typed web address, other affiliate link etc..)
*
*  If we havent come from we-care first we will setup a long-lived connection and ask the extension
*  if it is ok to show the slider. If we get a response, show the slider; otherwise do nothing.
*
*  If we have come from we-care in some fashion, alert the extension to flag the current merchant
*  as visited.  If we are on another causes' mall and if we are not a read-only plugin alert
*  the extension to apply the new cause.
*/

if (pXtn_URL.search("pungle.me") == -1 && document.referrer.search("pungle.me") == -1) {
  // They didn't come from Pungle..
  
  // create a port to connect to the extension
  var port = chrome.extension.connect({ name: "punglePort" });
  
  // listener on port to extension
  port.onMessage.addListener(function (msg) {
    if (msg.response == "redirect") {
      // if the extension sends "redirect"..
      
      WCR_logoURL = msg.logo;
      WCR_merchantName = msg.merchant;
      WCR_subdom = msg.subdom;
      
      if (msg.causeName != "") { WCR_causeName = msg.causeName; }
      
      WCR_earn = msg.earn;
      WCR_coupon = msg.coupon;
      console.log("Running Slider on " + pXtn_URL);
      
      // WTF DOES THIS DO? 
      runSlider();
      
      port.postMessage({
        query: "requestSend",
        url: pXtn_URL
      });
    } else if (msg.response == "inject") {
      // if the extension sends "inject"..      
      var redirectURL = msg.url;
      var container = document.createElement('div');      
      container.id = 'wc_container';
      document.body.appendChild(container);
      container.innerHTML = container.innerHTML + "<img style='display:none' id='redirect'>";
      var iframe = document.getElementById("redirect");
      console.log("set iframe source");
      iframe.src = redirectURL; //'http://dev.we-care.com/TEST/redir1.php?count=0'; //redirectURL;
    }
  }); //end port onMessage event listener`
  
  // send our query to the extension.
  port.postMessage({
    query: "isRedirect",
    url: pXtn_URL
  });
} /* else {
  // They came from Pungle, so...
  
  var html = $('body').html();
  if (html.indexOf("<!-- SUBDOM: ") > 0) {
    var sessionSubdom = "";
    var causeName = "";
    var pos = html.indexOf("<!-- SUBDOM: ");
    pos += 13;
    var endPos = html.indexOf("-->", pos);
    var subdomTag = html.substr(pos, (endPos - pos));
    sessionSubdom = subdomTag.split(":");
    console.log("Found Subdomain: " + sessionSubdom);
    pos = html.indexOf("<!-- CAUSE-NAME: ");
    pos += 17;
    endPos = html.indexOf("-->", pos);
    var causeTag = html.substr(pos, (endPos - pos));
    causeName = causeTag.split(":");
    console.log("New Cause Name: " + causeName);
    if (sessionSubdom != "" && causeName != "") {
      console.log("Setting Up message passing...")
      //If we think there might be a cause change, set up a connection and notify the extension.
      var port = chrome.extension.connect({
        name: "punglePort"
      });
      port.onMessage.addListener(function (msg) {
        if (msg.response == "reply") {
          console.log("Ack");
        }
      }); //end port onMessage event listener`
      port.postMessage({
        action: "updateSubdom",
        session: sessionSubdom,
        cause: causeName
      });
    } //end if Send Message
  } //end if SUBDOM  
} */


/*
* runSlider:  Function
* This function handles the UI behavior for the dropdown redirect slider.
function runSlider(){

	var eventDiv = document.createElement("div");
	eventDiv.setAttribute('id', 'wcEvent');
	eventDiv.style.display= "none";
	
	document.body.insertBefore(eventDiv, document.body.firstChild);
	
	eventDiv = document.getElementById('wcEvent');
	
	var logoAddress = chrome.extension.getURL("images/logo_sm_h.bmp");
	
	eventDiv.addEventListener("wcImageEvent", function(){
	    WCR_logoURL = logoAddress;
	    var ele = document.getElementById("logoCauseImg");
	    if(ele != null){
		ele.setAttribute('src', WCR_logoURL);
	    }
	});
	
	var scrpt = document.createElement("script");
	scrpt.setAttribute('type', 'text/javascript');
	scrpt.innerHTML = "var customEvent = document.createEvent('HTMLEvents');customEvent.initEvent('wcImageEvent', true, true);function fireWCImageEvent(){var eventDiv = document.getElementById('wcEvent');eventDiv.dispatchEvent(customEvent);} function imgError(){fireWCImageEvent();}";
	
	document.body.insertBefore(scrpt, document.body.firstChild);
	
	var sliderDiv = document.createElement("div");
	sliderDiv.setAttribute("id", "sliderDiv");
	sliderDiv.setAttribute("class", "divGlobalAddonWeCare");
	sliderDiv.style.height = 0;
	sliderDiv.style.textAlign = "center";
	sliderDiv.style.backgroundColor = "#e4ffe0";
	sliderDiv.style.width = "100%";

	var content = "place";
	var paddRight = 'padding-right:210px';
	var earnDonation = "";
	var divAddon = "";
	var extImages = 'images/';
	
	
	var donateImage = chrome.extension.getURL("images/donate.bmp");
	var redirectCSS = chrome.extension.getURL("showRedirect.css");
	var closeImage  = chrome.extension.getURL("images/close.gif");

	// If we have a chosen cause, we display its logo and its name
	if(WCR_subdom == ""){	
		WCR_logoURL = logoAddress;
	}

	if(!WCR_earn){
		content = 'Thank you for supporting <b>'+WCR_causeName+'</b> by shopping at <b>'+WCR_merchantName+'</b>';
	}else{
		WCR_timeout = 60000;
		paddRight = 'padding-right:365px';
		content = 'To support <b>'+WCR_causeName+'</b> by shopping here, you must click "Earn Donation" (There\'s no cost to you.)';
		earnDonation = 		'<a id="earnLink">'+
					'<img src="'+donateImage+'"/> '+
					'</a>';
	}
	
	if(WCR_coupon != ""){
		content += "<br><p style='margin-top:10px'>"+WCR_coupon+"</p></br>";
	}

	sliderDiv.innerHTML = '<LINK href="'+redirectCSS+'" rel="stylesheet" type="text/css">' +
				'<div id="sliderInner" class="contentAddonWeCare">\n'+
				'<div class="logoCauseWeCare" id="logoCause">' +
						'<img id="logoCauseImg" onError="imgError();" src="'+WCR_logoURL+'" />'+
					'</div>'+
					'<div id="textContent" style="'+paddRight+'">'+
						content+
					'<div id="imgDonate">'+
						earnDonation+
					'</div>'+
					'</div>'+
					'<div id="linksRight">'+
						'<a href="http://www.we-care.com/ReminderIntro" target="_blank">What is this?</a><br />'+
						'<a href="mailto:gcsupport@we-care.com">GCSupport@We-Care.com</a><br />'+
						'<a href="http://www.we-care.com" target="_blank">Powered by We-Care.com</a>'+
					'</div>'+
					'<div id="closeImg">'+
						'<a id="removeBtn">'+
							'<img src="'+closeImage+'" />'+
						'</a>'+
					'</div>'+
				'</div>';



	document.body.insertBefore(sliderDiv, document.body.firstChild);
	sliderDiv = document.getElementById('sliderDiv');
	$('body').css('position', 'relative').css('top', '0px').css('margin-top', '0px !important');
	moveFixedElements();
	window.addEventListener("load", function(){
		moveFixedElements();
	}, false);
	setTimeout('slideDown(0)', 50);

	$("#removeBtn").click(function(){
		removeSlideBar();	
	});

	if(WCR_earn){
		$('#earnLink').click(function(){
			sendInformation();
		})
	}
}//end function runSlider
*/


/* 
* We need all this shit? DIVs, etc?
*
function moveFixedElements(){
	var allDivs = document.getElementsByTagName("div");
	for(var i=0; i<allDivs.length; i++)
	{
		var div = allDivs[i];
		if(!div.suMoved)
		{
			var style = window.getComputedStyle(div);
			if(style.position == "fixed")
			{
				if(div.getAttribute("id") != "sliderDiv")
				{
					var top = style.top;
					var nOldSpot = top ? parseInt(top) : 0;
					var nNewSpot = nOldSpot + 60;
					div.style.top = nNewSpot + "px";
					div.suMoved = true;
				}
			}
		}
	}
}

	
function restoreFixedElements() {
	var allDivs = document.getElementsByTagName("div");
	for(var i=0; i<allDivs.length; i++)
	{
		var div = allDivs[i];
		var style = window.getComputedStyle(div);
		if(style.position == "fixed")
		{
			if(allDivs[i].getAttribute("id") != "sliderDiv")
			{
				var top = style.top;
				var nOldSpot = top ? parseInt(top) : 0;
				var nNewSpot = nOldSpot - 60;
				allDivs[i].style.top = nNewSpot + "px";
			}
		}
		
	}
}
*/


/*
 * slideDown : Function ( height, divElement)
 *
 * @h - the starting height
 * @oDiv - the DOM element to apply css.
 *
 * This function loops until the height reaches 60, making the slider slowly appear on the page.
function slideDown(h){
	// alert(h);
	sliderDiv = document.getElementById('sliderDiv');
	h+=5;
	sliderDiv.style.height = h+"px";
	//sliderDiv.style.top = (-1*h)+ "px";
	$('body').css('margin-top', h+'px !important');
	if( h <= 60 ){
		setTimeout('slideDown('+h+')', 50);
	}
	else{
		sliderDiv.style.borderBottom = "1px solid black";
		document.getElementById("sliderInner").style.display = "block";
		document.getElementById("sliderInner").style.visibility = "visible";
		var top = (65-(document.getElementById("logoCauseImg").height))/2;
		document.getElementById("logoCauseImg").style.marginTop = top+"px !important";
		slideUpTimeOut = setTimeout('slideUp(60)', WCR_timeout);
	}
}//end slideDown
*/


/*
 *slideUp : Function(height, divElement)
 *
 *@h - the starting height
 *@oDiv - element to apply css styles
 *
 *This function recursively loops to retract the slider DOM element.
function slideUp(h){
   sliderDiv = document.getElementById('sliderDiv');
   h-=5;
   sliderDiv.style.height = h+"px";
   $('body').css('margin-top', h+'px !important');
   $('#logoCause').css('display', 'none');
   $('#sliderInner').css('display', 'none').css('visibility', 'hidden');
   if(h>5){
	setTimeout('slideUp('+h+')', 50);
   }else{
	restoreFixedElements();
	$("#sliderDiv").css('display', 'none');	
	$('#logoCauseImg').css('top', 0);
	$('body').css("margin-top", "0 !important");
   }
}//end slideUp
*/


/*
* sendInformation : Function
*
* This function is triggered from the Earn Donation button.  If clicked we send a message to the extension
* telling it to start the background redirect process for this merchant.
function sendInformation(){
	port.postMessage({query:"send", url:pXtn_URL});
	removeSlideBar();
}//end sendInformation
*/


/*
* removeSlideBar : Function
* This method start simply calls slideUp to start the retracting of the new DOM elements.
function removeSlideBar(){
	var ele = document.getElementById('sliderDiv');
	clearTimeout(slideUpTimeOut);
	slideUp(60, ele);
}//end removeSlideBar
*/