var timer;
var curWorkTime;
var curRestTime;
var curRound;
var inProgress;

$(document).ready(function() {
    var init = function() {
        var worktime = $("#worktime").val();
        var resttime = $("#resttime").val();
        var totalrounds = $("#totalrounds").val();

        $("#total-round").text(totalrounds);
        $("#cur-round").text("0");

        curWorkTime = worktime;
        curRestTime = resttime;
        curRound = 0;

        renderClock(curWorkTime);

        inProgress = false;
    };

    var startClock = function() {
        var worktime = $("#worktime").val();
        var resttime = $("#resttime").val();
        var totalrounds = $("#totalrounds").val();

        $("#startround")[0].play();

        if(curRound == 0) {
            curRound = 1;
            $("#cur-round").text(curRound);
        }

        timer = setInterval(function() {
            if(curWorkTime <= 0) {
                
                clearInterval(timer);

                if(curRound == totalrounds) {
                    $("#countdown").css("background-color", "gray");
                    $("#endworkout")[0].play();

                    controlsToStart();
                }
                else
                {
                    $("#endround")[0].play();

                    timer = setInterval(function() {

                        if(curRestTime <= 0) {
                            clearInterval(timer);
                            if(curRound < totalrounds) {
                                curRound++;
                                $("#cur-round").text(curRound);

                                curWorkTime = worktime;
                                curRestTime = resttime;

                                startClock();
                            }
                        }
                        else {
                            $("#countdown").css("background-color", "red");

                            renderClock(curRestTime);
                            curRestTime -= 1;
                            renderClock(curRestTime);
                        }
                    }, 1000);
                }
            }
            else {
                $("#countdown").css("background-color", "green");

                renderClock(curWorkTime);
                curWorkTime -= 1;
                renderClock(curWorkTime);
            }
        }, 1000);
    };

    var stopClock = function() {
        clearInterval(timer);
        $("#countdown").css("background-color", "gray");
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
        $("#start-stop").css("background-color", "green");

        $("#worktime").prop('disabled', false);
        $("#resttime").prop('disabled', false);
        $("#totalrounds").prop('disabled', false);
        $("#startdelay").prop('disabled', false);
    }

    var controlsToStop = function() {
        $("#start-stop").text("Stop");
        $("#start-stop").css("background-color", "red");

        $("#worktime").prop('disabled', true);
        $("#resttime").prop('disabled', true);
        $("#totalrounds").prop('disabled', true);
        $("#startdelay").prop('disabled', true);
    }

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
                }, $("startdelay").val());
            }

            inProgress = true;
        }
        else
        {
            controlsToStart();

            stopClock();
        }
    });

    $("#reset").click(function() {
        stopClock();
        controlsToStart();
        init();
    });

    $("#settings").hover(
        function() {
            $("#settings").animate({'left': '+=115'}, "fast");
        },
        function() {
            $("#settings").animate({'left': '-=115'}, "fast");
        }
    );

    $("#worktime").change(init);
    $("#resttime").change(init);
    $("#totalrounds").change(init);
});
