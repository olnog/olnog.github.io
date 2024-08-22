const TOMETRIC = 1.157;
let alarms = [];
let earthTimeStarted = false;
let noonTime = "08/08/24 12:57:34";
let earthTime = 0;
let timers = [];
let universalCycles = 0;
let universalTime = 0;
let universalDays = 0;
document.getElementById("solarNoon").value = noonTime; 
findUniversalTime();
setInterval (poop, 864);

$( "#createAlarm" ).on( "click", function() {
    console.log($("#alarmValue").val());
    createAlarm($("#alarmValue").val());
});

$( ".deleteTimer" ).on( "click", function(e) {
    console.log(e.target.id.split('-')[1]);
    //deleteMinuteTimer());
});

$( "#minuteTimer" ).on( "click", function() {
    createMinuteTimer(Number($("#newTimer").val()));
});

$( "#metricTimer" ).on( "click", function() {
    createTimer(Number($("#newTimer").val()));
});

$( "#toMetric" ).on( "click", function() {
    convertToMetric();
});

$( "#toImperial" ).on( "click", function() {
    convertToImperial();
});


function convertToImperial(){
    let metricSeconds = Number($("#convertValue").val()) * 1000;
    let imperial = fetchImperialTime(metricSeconds);
    $("#convertResult").html(imperial.minutes + "m" + imperial.seconds + "s");
}

function convertToMetric(){
    let minutes = Number($("#convertValue").val());
    let metricSeconds = (minutes * 60 * TOMETRIC / 1000).toFixed(3);
    $("#convertResult").html(metricSeconds + "k")
}

function createAlarm(kMetricSeconds){
    
    //i should create an algorithm to sort the alarms by soonest to latest
    let metricSeconds = kMetricSeconds * 1000;
    console.log(kMetricSeconds, metricSeconds);
    alarms.push(metricSeconds);
}

function createTimer(kMetricSeconds){
    let metricSeconds = kMetricSeconds * 1000;
    timers.push(fetchTimer(metricSeconds, true, metricSeconds));
    displayTimers();
}

function createMinuteTimer(minutes){
    let metricSeconds = minutes * 60 * TOMETRIC;
    timers.push(fetchTimer(metricSeconds, false, minutes));
    displayTimers();
}

function deleteTimer(id){
    timers.splice(id, 1);
}

function displayAlarms(){
    // add code to where if the alarm is for the next date, it adds the necessary time
    let text = "";
    for (let alarm of alarms){
        let className = "";
        if (alarm > universalTime){
            className = 'timedOut';
        }
        text += "<div class='" + className + "'>" + alarm.toLocaleString + " - " + alarm - universalTime + "</div>";
    }
    $("#alarms").html(text);
}

function displayTimers(){
    let text = "";
    for (let timer of timers){
        let duration = timer.duration + " minutes: ";
        if (timer.metric){
            duration = /*formatMSeconds(timer.duration)*/ timer.duration.toLocaleString() + " metric seconds: "
        }
        let className = '';
        if (timer.metricSeconds < 0){
            className = 'timedOut';
        }
        text += "<div class='" + className + "'>" 
            + "<button id='deleteTimer-" + i + "' class='deleteTimer'>x</button>"
            + duration + timer.metricSeconds.toLocaleString() + " / " + timer.minutes + 'm' + timer.seconds + 's</div>';
    }
    $("#timers").html(text);
}

function fetchConventionalYear(qCycle){
    //this does not factor in how many days are currently in the cycle and does not calculate out what day of the imperial year
    if (qCycle > universalCycles){
        return "That has not happened yet. (And I haven't bothered to calculate this."
    } else if (qCycle == universalCycles){
        return "This is this year. Congrats!"
    }
    let cycleDiff = universalCycles - qCycle;
    let days = cycleDiff * 1000;
   //this is rough because I'm not taking into account leap years;
   
}

function fetchImperialTime(metricSeconds){
    let imperialSeconds = metricSeconds / TOMETRIC;
    let minutes = Math.floor(imperialSeconds / 60);
    imperialSeconds %= 60;
    return {minutes: minutes, seconds:imperialSeconds.toFixed(1)}
}

function fetchTimer(metricSeconds, metric, duration){
    let imperial = fetchImperialTime(metricSeconds);
    return {metricSeconds: metricSeconds, minutes: imperial.minutes, seconds: imperial.seconds.toFixed(1), metric: metric, duration: duration}    
}


function poop(){
    universalTime++;
    if (universalTime >= 100000){
        universalTime = 0;
        universalDays++;
    }
    if (universalDays > 1000){
        universalDays = 1;
        universalCycles++;
    }
    for(let i in timers){
        let timer = timers[i];        
        timer.metricSeconds--;
        timers[i] = fetchTimer(Math.floor(timer.metricSeconds), timer.metric, timer.duration);
    }
    displayTimers();
    displayAlarms();
    document.getElementById("universalCycles").innerHTML = universalCycles.toLocaleString();
    document.getElementById("universalDays").innerHTML = universalDays.toLocaleString();
    document.getElementById("universalTime").innerHTML = universalTime.toLocaleString();
    


    if (!earthTimeStarted){
        return;
    }
    earthTime++;
    document.getElementById("earthTime").innerHTML = earthTime.toLocaleString();

    if (earthTime >= 100000){
        earthTime = 0;    
        reset(true);
    }
}
function reset(what){
    if (what == true){
        document.getElementById("reset").innerHTML = new Date().toLocaleString();
        return;
    }
    document.getElementById("reset").innerHTML = new Date(noonTime).toLocaleString();
}
function solarNoon(){            
    let noon = new Date (document.getElementById("solarNoon").value);
    let now = new Date();
    var diff = now - noon;
    diff /= 1000 ;
    earthTime = Math.round (diff * TOMETRIC);
    if (earthTime >= 100000){
        earthTime %= 100000;
    }
    earthTimeStarted = true;
    reset(false);
}

function typing(e){
    if(event.key === 'Enter') {
        solarNoon();     
    }

}
function findUniversalTime(){
    let seconds = Math.floor(Date.now() / 1000);
    seconds -= 50000; //adjust from midnight to noon
    seconds *= TOMETRIC;
    let days = seconds / 100000  + 4371922; //the number of 100k second days since 1970 and how many days in years in the heliocene calendar up to 1970
    seconds %= 100000;
    seconds = Math.floor(seconds);
    days = Math.floor(days);
    universalTime = seconds;
    universalCycles = Math.floor(days / 1000);
    universalDays = Math.floor(days % 1000);

    

}