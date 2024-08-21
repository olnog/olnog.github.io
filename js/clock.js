const TOMETRIC = 1.157;
let earthTimeStarted = false;
let noonTime = "08/08/24 12:57:34";
let earthTime = 0;
let universalCycles = 0;
let universalTime = 0;
let universalDays = 0;
document.getElementById("solarNoon").value = noonTime; 
findUniversalTime();
setInterval (poop, 864);


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