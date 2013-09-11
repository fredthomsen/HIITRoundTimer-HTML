var timer;
var curWorkTime;
var curRestTime;
var curRound;
var inProgress;
var settingTimeoutId;

$(document).ready(function() {
    var init = function() {
        var worktime = toSeconds($("#worktime").val());
        var resttime = toSeconds($("#resttime").val());
        var totalrounds = $("#totalrounds").val()

        $("#total-round").text(totalrounds);
        $("#cur-round").text("0");

        curWorkTime = worktime;
        curRound = 0;

        showSettings();
        disableJump();

        $("#countdown").toggleClass("idle", true);
        
        renderClock(curWorkTime);

        inProgress = false;
    };

    var toSeconds = function(timeStr) {
        var time = timeStr.split(":");
        var mins = parseInt(time[0]);
        var secs = parseInt(time[1]);

        return (mins * 60) + secs;
    }

    var toTimeStr = function(seconds) {
        return zeroPad(Math.floor(seconds/60), 1) + ":" + zeroPad(seconds%60, 2);
    }

    var zeroPad = function(num, size) {
        var s = num + "";
            while (s.length < size) {
                s = "0" + s;
            }
        return s;
    }

    var startClock = function() {
        var worktime = toSeconds($("#worktime").val());
        var resttime = toSeconds($("#resttime").val());
        var totalrounds = $("#totalrounds").val();

        hideSettings();
        $("#countdown").toggleClass("idle", false);

        $("#startround")[0].play();


        if(curRound == 0) {
            enableJump();
            curRound = 1;
            $("#cur-round").text(curRound);
        }

        timer = setInterval(function() {
            if(curWorkTime <= 0) {
                
                clearInterval(timer);

                if(curRound == totalrounds) {
                    $("#endworkout")[0].play();
                    $("#countdown").toggleClass("work", false);
                    $("#countdown").toggleClass("idle", true);

                    controlsToStart();
                }
                else
                {
                    if(curRestTime == 0 || isNaN(curRestTime)) {
                        $("#endround")[0].play();
                        curRestTime = resttime;
                    }

                    timer = setInterval(function() {

                        if(curRestTime <= 0) {
                            clearInterval(timer);
                            if(curRound < totalrounds) {
                                curRound++;
                                $("#cur-round").text(curRound);

                                if(curRound == totalrounds) {
                                    disableJump();
                                }

                                curWorkTime = worktime;

                                startClock();
                            }
                        }
                        else {
                            $("#countdown").toggleClass("rest", true);
                            $("#countdown").toggleClass("work", false);

                            renderClock(curRestTime);
                            curRestTime -= 1;
                            renderClock(curRestTime);
                        }
                    }, 1000);
                }
            }
            else {
                $("#countdown").toggleClass("rest", false);
                $("#countdown").toggleClass("work", true);

                renderClock(curWorkTime);
                curWorkTime -= 1;
                renderClock(curWorkTime);
            }
        }, 1000);
    };

    var stopClock = function() {
        clearInterval(timer);
    };

    var jumpToNextRest = function() {
        var resttime = toSeconds($("#resttime").val());
        var totalrounds = $("#totalrounds").val();

        if(curRestTime) {
            if(curRound < totalrounds) {
                curRestTime = resttime;
                curRound++;
                $("#cur-round").text(curRound);
            }
        }
        else {
            curWorkTime = 0;
        }
    };

    var jumpToNextWork = function() {
        var worktime = toSeconds($("#worktime").val());
        var totalrounds = $("#totalrounds").val();

        if(curWorkTime) {
            if(curRound < totalrounds) {
                curWorkTime = worktime;
                curRound++;
                $("#cur-round").text(curRound);
            }
        }
        else {
            curRestTime = 0;
        }    
    };

    var renderClock = function(worktime) {
        var tenminutes = Math.floor(worktime/600);
        var minutes = Math.floor((worktime - (tenminutes * 600))/60);
        var tenseconds = Math.floor((worktime - (tenminutes * 600) - (minutes * 60))/10);
        var seconds = worktime - (tenminutes * 600) - (minutes * 60) - (tenseconds * 10);

        $("#minutes :first-child").text(tenminutes);
        $("#minutes :last-child").text(minutes);

        $("#seconds :first-child").text(tenseconds);
        $("#seconds :last-child").text(seconds);
    };

    var controlsToStart = function() {
        $("#start-stop").text("Start");
        $("#start-stop").toggleClass("start", true);
        $("#start-stop").toggleClass("stop", false);

        $("#settings").find("input").prop('disabled', false);

        showSettings();
    }

    var controlsToStop = function() {
        $("#start-stop").text("Stop");
        $("#start-stop").toggleClass("start", false);
        $("#start-stop").toggleClass("stop", true);

        $("#settings").find("input").prop('disabled', true);

        hideSettings();
    }

    var disableJump = function() {
        $("#buttons").find(".jump").prop('disabled', true);
    }

    var enableJump = function() {
        $("#buttons").find(".jump").prop('disabled', false);
    }

    var showSettings = function() {
        $("#slideicon").css('visibility', 'visible');
    }

    var hideSettings = function() {
        $("#slideicon").css('visibility', 'hidden');
    }

    var initSliders = function() {
        $("#worktimeSlider").slider({
                  value: 30,
                  min: 0,
                  max: 1200,
                  step: 5,
                  slide: function( event, ui ) {
                              $("#worktime").val(toTimeStr(ui.value));
                              init();
                         }
        });
        $("#worktime").val(toTimeStr($("#worktimeSlider").slider("value")));

        $("#resttimeSlider").slider({
                  value: 10,
                  min: 0,
                  max: 600,
                  step: 5,
                  slide: function(event, ui) {
                              $("#resttime").val(toTimeStr(ui.value));
                              init();
                         }
        });
        $("#resttime").val(toTimeStr($("#resttimeSlider").slider("value")));


        $("#totalroundsSlider").slider({
                  value: 20,
                  min: 1,
                  max: 50,
                  step: 1,
                  slide: function(event, ui) {
                              $("#totalrounds").val(ui.value);
                              init();
                         }
        });
        $("#totalrounds").val( $("#totalroundsSlider").slider("value"));

        $( "#startdelaySlider" ).slider({
                  value: 5,
                  min: 0,
                  max: 60,
                  step: 5,
                  slide: function(event, ui) {
                              $("#startdelay").val(toTimeStr(ui.value));
                         }
        });
        $("#startdelay").val(toTimeStr($("#startdelaySlider").slider("value")));
    }

    initSliders();
    init();

    $("#start-stop").click(function() {
        if($("#start-stop").text() == "Start")
        {
            controlsToStop();

            if(inProgress) {
                startClock();
            }
            else
            {
                setTimeout(function() { 
                    startClock();
                }, toSeconds($("#startdelay").val()) * 1000);
            }

            inProgress = true;
        }
        else
        {
            controlsToStart();

            stopClock();
        }
    });

    $(document).keydown(function (e) {
       switch(e.keyCode) {
           case $.ui.keyCode.SPACE: //space
               $("#start-stop").click();
               break;
           case 88: //X
               $("#reset").click();
               break;
           case 87: //W
               $("#nextwork").click();
               break;
           case 82: //R
               $("#nextrest").click();
               break;
           default:
               return;
           e.preventDefault();
       }
    });

    $("#reset").click(function() {
        stopClock();
        controlsToStart();
        init();
    });

    $("#nextrest").click(function() {
        jumpToNextRest();
    });

    $("#nextwork").click(function() {
        jumpToNextWork();
    });

    $("#slideicon").mouseenter( function() {
        if(!settingTimeoutId) {
            settingTimeoutId = setTimeout(function() {
                settingTimeoutId = null;
                $("#buttons").fadeOut('fast', function() {
                        $("hr").css("display", "none");
                        $("#settings").slideDown();
                });
            }, 500);
        }
    });

    $("#settingContainer").mouseleave( function() {
        if (settingTimeoutId) {
            clearTimeout(settingTimeoutId);
            settingTimeoutId = null;
        }
        else {
            $("#settings").slideUp('fast', function() {
                $("hr").css("display", "block");
                $("#buttons").fadeIn();
            });
        }
    });


    $(".preset").change( function() {
        if ($("#defaultw").is(":checked")) {
            $("#worktime").val("00:30");
            $("#resttime").val("00:10");
            $("#totalrounds").val(20);
        }
        else if($("#mmatitle-s").is(":checked")) {
            $("#worktime").val("5:00");
            $("#resttime").val("1:00");
            $("#totalrounds").val(5);
        }
        else if($("#mma-s").is(":checked")) {
            $("#worktime").val("5:00");
            $("#resttime").val("1:00");
            $("#totalrounds").val(3);
        } 
        else if($("#muaythaititle-s").is(":checked")) {
            $("#worktime").val("3:00");
            $("#resttime").val("1:00");
            $("#totalrounds").val(5);
        }
        else if($("#muaythai-s").is(":checked")) {
            $("#worktime").val("3:00");
            $("#resttime").val("1:00");
            $("#totalrounds").val(3);
        }
        else if($("#boxing-s").is(":checked")) {
            $("#worktime").val("3:00");
            $("#resttime").val("1:00");
            $("#totalrounds").val(12);
        }
        else if($("#tabata-s").is(":checked")) {
            $("#worktime").val("0:20");
            $("#resttime").val("0:10");
            $("#totalrounds").val(40);
        }

        init();
    });

    $("#worktime").change(init);
    $("#resttime").change(init);
    $("#totalrounds").change(init);
});
