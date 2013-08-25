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
        curRound = 0;

        disableJump();

        renderClock(curWorkTime);

        inProgress = false;
    };

    var startClock = function() {
        var worktime = $("#worktime").val();
        var resttime = $("#resttime").val();
        var totalrounds = $("#totalrounds").val();

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
                    $("#countdown").css("background-color", "gray");
                    $("#endworkout")[0].play();

                    controlsToStart();
                }
                else
                {
                    curRestTime = resttime;

                    $("#endround")[0].play();

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

    var jumpToNextRest = function() {
        var resttime = $("#resttime").val();
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
        var worktime = $("#worktime").val();
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
        $("#start-stop").css("background-color", "green");

        $("#settings").find("input").prop('disabled', false);
    }

    var controlsToStop = function() {
        $("#start-stop").text("Stop");
        $("#start-stop").css("background-color", "red");

        $("#settings").find("input").prop('disabled', true);
    }

    var disableJump = function() {
        $("#buttons").find(".jump").prop('disabled', true);
    }

    var enableJump = function() {
        $("#buttons").find(".jump").prop('disabled', false);
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
                }, $("#startdelay").val() * 1000);
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

    $("#nextrest").click(function() {
        jumpToNextRest();
    });

    $("#nextwork").click(function() {
        jumpToNextWork();
    });

    $("#settings").hover(
        function() {
            $("#settings").animate({'left': '+=165'}, "fast");
        },
        function() {
            $("#settings").animate({'left': '-=165'}, "fast");
        }
    );

    $(".preset").change( function() {
        if($("#mmatitle-s").is(":checked")) {
            $("#worktime").val(5 * 60);
            $("#resttime").val(60);
            $("#totalrounds").val(5);
        }
        else if($("#mma-s").is(":checked")) {
            $("#worktime").val(5 * 60);
            $("#resttime").val(60);
            $("#totalrounds").val(3);
        } 
        else if($("#muaythaititle-s").is(":checked")) {
            $("#worktime").val(3 * 60);
            $("#resttime").val(60);
            $("#totalrounds").val(5);
        }
        else if($("#muaythai-s").is(":checked")) {
            $("#worktime").val(3 * 60);
            $("#resttime").val(60);
            $("#totalrounds").val(3);
        }
        else if($("#boxing-s").is(":checked")) {
            $("#worktime").val(3 * 60);
            $("#resttime").val(60);
            $("#totalrounds").val(12);
        }
        else if($("#bjj-s").is(":checked")) {
            $("#worktime").val(6 * 60);
            $("#resttime").val(120);
            $("#totalrounds").val(4);
        } 
        else if($("#tabata-s").is(":checked")) {
            $("#worktime").val(20);
            $("#resttime").val(10);
            $("#totalrounds").val(40);
        }


        init();
    });

    $("#worktime").change(init);
    $("#resttime").change(init);
    $("#totalrounds").change(init);
});
