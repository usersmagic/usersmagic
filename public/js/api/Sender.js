function sendData(user,heatMapID,time,clickedObjects,positions,location,mouseStandStill,scrolledInfo){
  var xhttp = new XMLHttpRequest();
  var formData = new FormData();

  var data = {
      "test_id" : user,
      "heat_map_id" : heatMapID,
      "time" : time,
      "clicked_objects" : clickedObjects,
      "positions" : positions,
      "location" : location,
      "mouse_stand_still" : mouseStandStill,
      "scrolled" : scrolledInfo
  };

  data = JSON.stringify(data)
  //console.log(data)
  formData.append("data", data)
  xhttp.open("POST", "https://usersmagic.com/api/heat_map/details", false);
  xhttp.send(formData)
  var response = JSON.parse(xhttp.responseText);
  var heatMapID = response.heat_map_id
  var completed = response.completed

  setSessionCookie("usersMagic_heat_map_id", heatMapID);

  if(completed){ //if test is completed delete, usersmagicID in cookies
    setSessionCookie("userMagic_id", "");
  }


}

function sendBrowserInfo(user, browser, detailedBrowser, os, mobile, plugins, coordinates){
  var xhttp = new XMLHttpRequest();
  var formData = new FormData();

  var data = {
    "test_id" : user,
    "browser" : browser,
    "detailed_browser" : detailedBrowser,
    "os" : os,
    "mobile" : mobile,
    "plugins" : plugins,
    "coordinates" : coordinates
  };
  data = JSON.stringify(data)

  formData.append("data",data)
  xhttp.open("POST", "https://usersmagic.com/api/heat_map/details")
  xhttp.send(formData)
}

// function getHeatMapIDFromUsersMagic(user_ID){
//   var xhttp = new XMLHttpRequest();
//
//   xhttp.open("GET", ("usersmagic.com/api/test/details?id="+user_ID), true)
//   xhttp.send()
//   return xhttp.responseText;
// }
