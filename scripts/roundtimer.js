var timer;
var curWorkTime;
var curRestTime;
var curRound;

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
    };

    var startClock = function() {
        var worktime = $("#worktime").val();
        var resttime = $("#resttime").val();
        var totalrounds = $("#totalrounds").val();

        if(curRound == 0) {
            curRound = 1;
            $("#cur-round").text(curRound);
        }

        timer = setInterval(function() {
            $("#countdown").css("background-color", "green");

            curWorkTime -= 1;
            renderClock(curWorkTime);

            if(curWorkTime == 0) {
                clearInterval(timer);

                timer = setInterval(function() {
                    $("#countdown").css("background-color", "red");

                    curRestTime -= 1;
                    renderClock(curRestTime);

                    if(curRestTime == 0) {
                        clearInterval(timer);
                        if(curRound < totalrounds) {
                            curRound++;
                            $("#cur-round").text(curRound);

                            curWorkTime = worktime;
                            curRestTime = resttime;

                            startClock();
                        }
                    }
                }, 1000);

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

    init();

    $("#start-stop").click(function() {
        if($("#start-stop").text() == "Start")
        {
            $("#start-stop").text("Stop");
            $("#start-stop").css("background-color", "red");

            $("#worktime").prop('disabled', true);
            $("#resttime").prop('disabled', true);
            $("#totalrounds").prop('disabled', true);

            setTimeout(function() { 
                startClock();
            }, 3000);
        }
        else
        {
            $("#start-stop").text("Start"); 
            $("#start-stop").css("background-color", "green");

            $("#worktime").prop('disabled', false);
            $("#resttime").prop('disabled', false);
            $("#totalrounds").prop('disabled', false);

            stopClock();
        }
    });

    $("#reset").click(function() {
        stopClock();
        init();
    });

    $("#worktime").change(init);
    $("#resttime").change(init);
    $("#totalrounds").change(init);
});
