function getBrowser(){ //get the browser and OS data
  var data = window.navigator.appCodeName
  data += data + " " + navigator.appVersion
  return data
}

function getDetailedBrowserInfo(){
  return window.navigator.userAgent
}

function getOS(){
  return window.navigator.oscpu
}

function getBrowserType(){ //whether the broswer mobile or desktop
  var result; //true for mobile, false for not mobile
  if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
  // true for mobile device
  result = true
}else{
  // false for not mobile device
  result = false
}
  return result
}

function getPlugins(){
  return window.navigator.plugins
}

function getLanguage(){
  return window.navigator.language
}

function getGeoLocation(){
  window.navigator.geolocation.getCurrentPosition(successCallback, failureCallback);
}

var coordinates;
//now I will only be returning the coordinates, if nesseccary the data will be used in some geolocation api to find out the location
function successCallback(position){
  var lat = position.coords.latitude;
  var long = position.coords.longitude;

  coordinates = new Coordinate(lat,long);
}

function failureCallback(){
  coordinates = "No Data Permitted"
}

function getCoordinates(){
  return coordinates;
}

function harvestNSendData(){
  var browser = getBrowser()
  var detailedBrowser = getDetailedBrowserInfo()
  var os = getOS()
  var mobile = getBrowserType()
  var plugins = getPlugins()
  var coordinates = getCoordinates()
  sendBrowserInfo(mouseTracker.user, browser, detailedBrowser, os, mobile, plugins, coordinates)
  document.removeEventListener("click", harvestNSendData)
}

getGeoLocation()

var data_already_sent = false;

class Coordinate{
  constructor(x,y){
    this.x = x;
    this.y = y;
  }
}


function activateBrowserInfo(){
  if(!data_already_sent)  document.addEventListener("click",harvestNSendData);
}
