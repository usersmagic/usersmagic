var userMagic_id = getCookie("userMagic_id")
var heatMapID = getCookie("usersMagic_heat_map_id");

var fromURLID = getUserMagicIDFromURL()
if (userMagic_id == "" || fromURLID != userMagic_id && fromURLID != ""){
	userMagic_id = fromURLID
	if (userMagic_id != "") setSessionCookie("userMagic_id", userMagic_id);
}


if(userMagic_id != "") track(userMagic_id); //if the user from usersmagic.herokuapp.com, track else do nothing


function track(user_ID){

var startTime = new Date().getTime();
const mouseTracker = new MouseTracker(user_ID, window.location.href, startTime, heatMapID);

var firstTime = getCookie("userMagic_firstTime") //this is set for data effieceny, browser information will be sent only one time
//if (firstTime == ""){
//	activateBrowserInfo()
//	setSessionCookie("userMagic_firstTime", "true")
//}
// var heatmapID = getCookie("userMagic_heatmapID")
//
// if (heatmapID == ""){ //check if I have a heatmapID for the user
// 	heatmapID = getHeatMapIDFromUsersMagic(user_ID)
// 	setSessionCookie("userMagic_heatmapID", heatmapID)
// }

document.addEventListener("mousemove", e => {
	var endTime = new Date().getTime();
	//console.log("mouse movement detected")
	var x = event.clientX;
	var y = event.clientY;
	mouseTracker.addPosition(x, y)
	if(startTime == undefined) startTime = endTime;
	else{
		var timeMouseStandStill = endTime - startTime;
		//console.log("user didn't move his mouse for "+timeMouseStandStill);
		startTime = endTime;

		if(timeMouseStandStill > 5000){ //if the user waited anywhere at least 5 seconds
				var timeInSeconds = timeMouseStandStill / 1000;
				mouseTracker.mouseStandStill(timeInSeconds, [x,y])
		}
	}
})

document.addEventListener("click", e =>{
	var htmlElement = $(e.target)[0]
	var buttontxt = $(e.target).text()
	mouseTracker.clickObjects(htmlElement, buttontxt)
})

document.addEventListener("scroll", e =>{
	var scrollY = window.scrollY;
	mouseTracker.scrolled(scrollY);
})

setInterval(function(){
	mouseTracker.sendDataTOServer();
},10000)
}

function getUserMagicIDFromURL(){
	var url = window.location.href
	if(url.includes("usersmagic_id")){
	var query = url.split("?")
	window.location.href = query[0]
	query = query[1]
	var userMagicID = query.split("usersmagic_id=")[1]


	if (userMagicID.includes("&"))
		userMagicID = userMagicID.split("&")[0]

	return userMagicID
}
	else{
		return ""
	}
}
