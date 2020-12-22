$("head").append("<script src='https://usersmagic.herokuapp.com/js/api/Sender.js'></script>")
$("head").append("<script src='https://usersmagic.herokuapp.com/js/api/MouseTracker.js'></script>")
var userID = getCookie("userMagic_id")
var loc = window.location.href
//if users comes from usersMagic, import this for only one time
if (loc.includes("usersmagic_id")) $("head").append("<script src='https://usersmagic.herokuapp.com/js/api/browserInfo.js'></script>")

setTimeout( function(){
	$("head").append("<script src='https://usersmagic.herokuapp.com/js/api/usersTracker.js'></script>")
}, 1000);


function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function setSessionCookie(cname, cvalue) {
  document.cookie = cname + "=" + cvalue + "; path=/";
}
