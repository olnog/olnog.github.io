const DAYSTOUNIX = 4371677;
const DAYSINCYCLE = 1000;
const SECONDSINDAY = 100000;
const TOMETRIC = 1.157;
let alarms = [];
let earthTimeStarted = false;
let noonTime = "08/08/24 12:57:34";
let earthTime = 0;
let timers = [];
let universalCycles = 0;
let universalTime = 0;
let universalDays = 0;


$( "#createAlarm" ).on( "click", function() {    
    createAlarm(Number($("#alarmValue").val()));
});


$(document).on("click", ".deleteTimer", function(e){    
    deleteTimer(Number(e.target.id.split('-')[1]));
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

$( "#whatDateDaysAgo" ).on( "click", function() {
    $("#convertResult").html(whatDate(Number($("#convertValue").val())));
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
        if (universalTime > alarm){
            className = 'timedOut';
        }
        text += "<div class='" + className + "'>" 
             + (alarm - universalTime).toLocaleString() + " @ " + (alarm / 1000).toFixed(1) + "k"
            + "</div>";
    }
    $("#alarms").html(text);
}

function displayTimers(){
    let text = "";
    for (let i in timers){
        let timer = timers[i];
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


function fetchHalalMediaDate(){
    findUniversalTime();    
    return whatDate(10000 + universalDays);
}

function fetchImperialTime(metricSeconds){
    let imperialSeconds = metricSeconds / TOMETRIC;
    let minutes = Math.floor(imperialSeconds / 60);
    imperialSeconds %= 60;
    return {minutes: minutes, seconds:imperialSeconds.toFixed(1)}
}

function fetchTimer(metricSeconds, metric, duration){
    let imperial = fetchImperialTime(metricSeconds);
    return {metricSeconds: metricSeconds, minutes: imperial.minutes, seconds: imperial.seconds, metric: metric, duration: duration}    
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

function runClock(){
    document.getElementById("solarNoon").value = noonTime; 
    findUniversalTime();
    setInterval (poop, 864);
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
    /*
    seconds = math.floor((time.time() - 50000) * TOMETRIC) #the 50k is to have it start at noon instead of midnight
    days = DAYSTOUNIX + math.floor(seconds / SECONDSINDAY)
    seconds = math.floor(seconds % SECONDSINDAY)
    cycle = math.floor(days / DAYSINCYCLE)
    date = math.floor(days % DAYSINCYCLE)
*/
    let seconds = Math.floor( ((Date.now() / 1000) - 50000) * TOMETRIC);

    let days = DAYSTOUNIX + Math.floor(seconds / SECONDSINDAY); 
    seconds %= SECONDSINDAY;        
    universalTime = seconds;
    universalCycles = Math.floor(days / DAYSINCYCLE);
    universalDays = Math.floor(days % DAYSINCYCLE);

    

}

function whatDate(daysAgo){
    let today = new Date();
    today.setDate(today.getDate() - daysAgo);
    return today.toDateString();
}
