/*
*-------------------------------------------------------------------------------
* Content Script Messenger
*   Pungle referral?
*   Otherwise... Setup open connection and send isRedirect query.
*-------------------------------------------------------------------------------
*/

// Content-Script Global Variables

// Query the current location URL
var pXtn_URL = document.location.href;

// Holds the cause ID.
var pXtn_causeID = 0;

// Holds the current store ID.
var pXtn_merchantID = 0;

// Logic Loop..
if (pXtn_URL.search("pungle.me") == -1 && document.referrer.search("pungle.me") == -1) {
  // They didn't come from Pungle..
  
  // create a port to connect to the extension
  var port = chrome.extension.connect({ name: "punglePort" });
  
  // listener on port to extension
  port.onMessage.addListener(function (msg) {
    if (msg.response == "redirect") {
      // if the extension sends "redirect OK"..
      
      /*
      * ENTIRE LOOP DESIGNED TO ALLOW FOR USER INTERACTION BEFORE REDIRECT
      */
      
      pXtn_merchantID = msg.merchant; // and we do nothing with it?
      if (msg.cause != "") { pXtn_causeName = msg.cause; }
      
      console.log("CS:: received => response: " + msg.response);
      
      port.postMessage({
        query: "requestSend",
        url: pXtn_URL
      });
      
      console.log("CS:: sent => query: requestSend");
    } else if (msg.response == "inject") {
      // if the extension sends "inject"..
      
      console.log("CS:: received => response: " + msg.response);
      
      var redirectURL = msg.url;
      
      // Create container that holds iFrame.
      var pungTainer = document.createElement('div');      
      pungTainer.id = 'pungleContainer';
      pungTainer.style.display = 'none';
      document.body.appendChild(pungTainer);
      
      // Add the iFrame to the container.
      pungTainer.innerHTML = pungTainer.innerHTML + "<iframe id='pungleRedirect'>";
      var iframe = document.getElementById("pungleRedirect");
      iframe.src = redirectURL;      
      console.log("CS:: Injected iFrame source.");
    }
  }); //end port onMessage event listener`
  
  // send our query to the extension.
  port.postMessage({
    query: "isRedirect",
    url: pXtn_URL
  });
  console.log("CS:: sent => query: isRedirect");
} else if (pXtn_URL.search("pungle.me") == -1 && document.referrer.search("pungle.me") != -1){
  // Pungle Referral, Notify Extension
 
  console.log("CS:: Pungle Referral");
  
  // create a port to connect to the extension
  var port = chrome.extension.connect({ name: "punglePort" });
  
  // send our query to the extension.
  port.postMessage({
    query: "pungleReferral",
    url: pXtn_URL
  });
}
else console.log("CS:: Pungle.me Site");