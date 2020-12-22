function sendData(user,heatMapID,time,clickedObjects,positions,location,mouseStandStill,scrolledInfo){
  var xhttp = new XMLHttpRequest();
  var formData = new FormData();

  var data = {
      "test_id" : user,
      "heat_map_id" : heatMapID,
      "time" : parseInt(Math.floor(time*1000)),
      "clicked_objects" : clickedObjects,
      "positions" : positions,
      "location" : location,
      "mouse_stand_still" : mouseStandStill,
      "scrolled" : scrolledInfo
  };

  data = JSON.stringify(data);

  xhttp.open("POST", "https://usersmagic.herokuapp.com/api/heat_map/details", false);
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send(data);
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

  xhttp.open("POST", "https://usersmagic.herokuapp.com/api/heat_map/details");
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send(data)
}

// function getHeatMapIDFromUsersMagic(user_ID){
//   var xhttp = new XMLHttpRequest();
//
//   xhttp.open("GET", ("usersmagic.herokuapp.com/api/test/details?id="+user_ID), true)
//   xhttp.send()
//   return xhttp.responseText;
// }
