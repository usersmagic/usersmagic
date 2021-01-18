if (isMobileBrowser()){
  $(".all-header-menu-wrapper").css({"position": "fixed",
                                      "bottom": "0px",
                                      "height": "75px",
                                      "width": "1500px"})

  $(".header-user-logo").css({"position": "fixed",
                              "top": "5px"})

  $(".icons-home").css({"position": "fixed",
                        "top" : "93%",
                        "left" : "13%"
                        })
  $(".icons-folder").css({"position": "fixed",
                          "top": "93%",
                          "left" : "45%"
                          })
  $(".icons-settings").css({"position": "fixed",
                            "top": "93%",
                            "left": "75%"
                            })

  $(".campaign-outer-wrapper").css({"top": "35%","width": "155px"})
}

var default_background_color;
var default_color;
var mouse_enter_change_background_color = "#2ec5ce";
var mouse_enter_change_color = "white"

$(".status_button").mouseenter(function(){
  default_color = $(this).css("color")
  default_background_color = $(this).css("background-color")
  $(this).css({"background-color":mouse_enter_change_background_color, "color": mouse_enter_change_color})
})

$(".status_button").mouseleave(function(){
  $(this).css({"background-color": default_background_color, "color": default_color})
})

$("#new").click(function(){
  window.location.assign("/campaigns")
})

$("#complete").click(function(){
  window.location.assign("/history?complete")
})

$("#in_review").click(function(){
  window.location.assign("/history?in_review")
})


function isMobileBrowser(){
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
