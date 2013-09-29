var cast_api, cv_activity;
var actId = "a43dd925-df43-4ce2-ae56-781991066201";
var params;

initializeApi = function() {
    if(!cast_api) {
        cast_api = new cast.Api();
        cast_api.addReceiverListener(actId, onReceiverList);
    }
};

onReceiverList = function(list) {
    var chromecasts = document.getElementById("cc_receivers");
    chromecasts.innerHTML = "";

    cc_option = document.createElement("option");
    cc_option.setAttribute("value", 0);
    cc_option_text=document.createTextNode("<None>");
    cc_option.appendChild(cc_option_text);
    chromecasts.appendChild(cc_option);

    for(i = 0; i < list.length; i++) {
        cc_option = document.createElement("option");
        cc_option.setAttribute("value", list[i].id);
        cc_option_text=document.createTextNode(list[i].name);
        cc_option.appendChild(cc_option_text);
        chromecasts.appendChild(cc_option);
    }
};

document.getElementById("cc_receivers").onchange = function(event) {
    var chromecasts = document.getElementById("cc_receivers");
    var receiverId = chromecasts.options[chromecasts.selectedIndex].value;
    var receiverName = chromecasts.options[chromecasts.selectedIndex].text;
    if(receiverId) {
        receiver = new cast.Receiver(receiverId, receiverName);
        doLaunch(receiver);
    }
    else {
        cast_api.stopActivity(actId);
    }
}

doLaunch = function(receiver) {
    if(!cv_activity) {
        var request = new cast.LaunchRequest(actId, receiver);

        var workTime = toSeconds($("#worktime").val());
        var restTime = toSeconds($("#resttime").val());
        var totalRounds = $("#totalrounds").val();
        var delayTime = toSeconds($("#startdelay").val());

        params = new HiitParams(workTime, restTime, totalRounds, delayTime);

        request.parameters = params;
        request.description = new cast.LaunchDescription();
        request.description.text = "HIIT Round Training Timer";
        request.description.url = ""
        cast_api.launch(request, onLaunch);
    }
};

onLaunch = function(activity) {
    if (activity.status == "running") {
      cv_activity = activity;
    } else if (activity.status == "error") {
      cv_activity = null;
    }
};

onStop = function(activity) {
    if (activity.status == "stopped") {
      cv_activity = null;
    } else if (activity.status == "error") {
      cv_activity = activity;
    }
};



startCastApiListener = function() {
    window.addEventListener("message", function(event) {
        if (event.source == window && event.data && 
            event.data.source == "CastApi" &&
            event.data.event == "Hello") {
            initializeApi();
        }
    });
};

function HiitParams(workTime, restTime, numRounds, delayTime) {
    this.workTime = workTime;
    this.restTime = restTime;
    this.numRounds = numRounds;
    this.delayTime = delayTime;
}

startCastApiListener();
