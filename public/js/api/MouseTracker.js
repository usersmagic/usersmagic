class MouseTracker{
  constructor(user, location, startTime, heatMapID){
    this.heatMapID = heatMapID;
    this.user = user
    this.startTime = startTime;
    this.lastScrollPosition = window.scrollY;
    this.clickedObjectsInfo = []; //its stores html info of clicked object and the name of the button
    this.changingPositionsInterpret = [];
    this.positions = [];
    this.location = location
    this.mouseStandStillInfo = []; //its array of, how many seconds and where the mouse stopped
    this.scrolledInfo = [];
    this.scrollInfoInterpret = [];
    this.scrolledInfo.push(this.lastScrollPosition);
  }

  addLocation(url){
    this.locations.push(url);
  }

  addPosition(x,y){
    var height = document.body.clientHeight;
    var width = document.body.clientWidth;
    x = x / width;
    y = (y+this.lastScrollPosition) / height; //couldn't test croll yet
    //y = y / height; //if there is a problem with lastScrollPosition, use this

    if(this.positions.length == 0){
      this.positions.push([x,y])
      return
    }
    var positionBefore = this.positions.pop();
    var xChange = x - positionBefore[0]; // minus --> left, plus --> right
    var yChange = y - positionBefore[1]; // minus --> top, plus --> bottom

    //interpret
    var interpretation = ""

    if(xChange == 0 && yChange == 0) interpretation += "No movement at all";
    if(xChange < 0) interpretation += "Mouse is moved "+Math.abs(xChange)+" pixels left ";
    if(xChange > 0) interpretation += "Mouse is moved "+Math.abs(xChange)+" pixels right ";
    if(yChange < 0) interpretation += "Mouse is moved "+Math.abs(yChange)+" pixels top ";
    if(yChange > 0) interpretation += "Mouse is moved "+Math.abs(yChange)+" pixels bottom ";

    this.changingPositionsInterpret.push(interpretation)
    this.positions.push(positionBefore)
    this.positions.push([x,y])
    //console.log("interpretation: "+interpretation)
   }

   mouseStandStill(time, location){
     var x = location[0]
     var y = location[1]
     var elementUnderMouse = document.elementFromPoint(x,y)
     this.mouseStandStillInfo.push(time, elementUnderMouse,[location])
   }

   clickObjects(htmlElement, buttontxt){
     this.clickedObjectsInfo.push(htmlElement, buttontxt)
     this.sendDataTOServer()
   }

   scrolled(scrollY){
     var scrollDiff = this.lastScrollPosition - scrollY;
     var interpretation = ""
     if(scrollDiff == 0) return;

     this.lastScrollPosition = scrollY;
     this.scrolledInfo.push(this.lastScrollPosition)

     if(scrollDiff < 0){
       interpretation += "Scrolled to top "+ Math.abs(scrollDiff)
     }
     else{
       interpretation += "Scrolled to down "+ Math.abs(scrollDiff)
     }
     this.scrollInfoInterpret.push(interpretation);
   }

   sendDataTOServer(){
     var time = ((new Date().getTime()) - this.startTime) / 1000;
     sendData(this.user,this.heatMapID,time,this.clickedObjectsInfo,this.positions, this.location, this.mouseStandStillInfo, this.scrolledInfo)
     this.clickedObjectsInfo = [];
     this.positions = [];
     this.mouseStandStillInfo = []
     this.scrolledInfo = []
   }
}
