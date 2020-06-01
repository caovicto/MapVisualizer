/// visualization variables
var scale = 20;
var stop = false;
var frameCount = 0;
var fps, fpsInterval, startTime, now, then, elapsed;

var sprite0 = new Image();
sprite0.src = "images/0.png";
var sprite90 = new Image();
sprite90.src = "images/90.png";
var sprite180 = new Image();
sprite180.src = "images/180.png";
var sprite270 = new Image();
sprite270.src = "images/270.png";


/// animation variables
var timer = 0;
var frame = 0;
var delay = 300; 

var intervalID = null;
var animateID = null;
var sourceFile = null;
var frames = null;
var frameIndex = 0;
var currDestination = null;
var currHotspots = [];



window.onload = () =>
{
    var canvas = document.getElementById('mapCanvas');
    if (canvas.getContext) {
        var ctx = document.getElementById('mapCanvas').getContext('2d');
        ctx.font = '48px sans-serif';
        ctx.fillText("Select a file to play", 10, 50);
    } 
    else 
    {
        console.log("Canvas Unsupported");
    }

    
    startAnimating();

};


function startAnimating() {
    fps = document.getElementById("speed").value;
    fpsInterval = 1000 / fps;
    then = Date.now();
    startTime = then;
    console.log(fps);
    animate();
}
 


function play(){
    var selectedFile = document.getElementById('input').files[0];
    console.log(selectedFile);
    var reader = new FileReader();

    reader.onload = function(e) {
        let ctx = document.getElementById('mapCanvas').getContext('2d');
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);


        readXml=e.target.result;
        // console.log(readXml);
        var parser = new DOMParser();
        var doc = parser.parseFromString(readXml, "application/xml");

        frames = doc.getElementsByTagName("frame");

        stop = false;

        animate();
        
    }
    reader.readAsText(selectedFile);

};

function animate()
{
    // stop
    if (stop) 
    {
        return;
    }

    // request another frame
    animateID = requestAnimationFrame(animate);

    // calc elapsed time since last loop
    now = Date.now();
    elapsed = now - then;

    // if enough time has elapsed, draw the next frame
    if (elapsed > fpsInterval) {
        then = now - (elapsed % fpsInterval);

        // draw stuff here
        if (frames)
        {
            if (frameIndex >= frames.length)
            frameIndex = 0;
            animateID = requestAnimationFrame(animate);
            draw(frames[frameIndex]);
            // console.log(frames[frameIndex]);
            frameIndex++;
            timer++;
        }
    }

}

function reset()
{
    sourceFile = null;
    frames = null;
    frameIndex = 0;
    currDestination = null;
    currHotspots = [];
    timer = 0;

    clearMap();
    clearHighlight();
    clearNotice();
    clearAgent();

    var fullPath = document.getElementById('input').value;
    if (fullPath) {
        var startIndex = (fullPath.indexOf('\\') >= 0 ? fullPath.lastIndexOf('\\') : fullPath.lastIndexOf('/'));
        var filename = fullPath.substring(startIndex);
        if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0) {
            filename = filename.substring(1);
        }
        var ctx = document.getElementById('mapCanvas').getContext('2d');
        ctx.font = '48px sans-serif';
        ctx.fillText(filename, 10, 50);
    }
    
}


function draw(frame) {
    clearNotice();
    clearHighlight();

    var clears = frame.getElementsByTagName("clear");
    var walls = frame.getElementsByTagName("wall");
    var agent = frame.getElementsByTagName("agent");
    var hotspots = frame.getElementsByTagName("hotspot");
    var destination = frame.getElementsByTagName("destination");
    var hit = frame.getElementsByTagName("hit");
    var highlights = frame.getElementsByTagName("highlight");


    for (var i = 0; i < walls.length; i++){
        let coordinates = walls[i].innerHTML.split(',');
        drawWall(coordinates[0], coordinates[1]);
    }


    for (var i = 0; i < agent.length; i++){
        let coordinates = agent[i].innerHTML.split(',');
        drawAgent(coordinates[0], coordinates[1], coordinates[2]);
    }

    for (var i = 0; i < hotspots.length; i++){
        let coordinates = hotspots[i].innerHTML.split(',');
        drawHotspot(coordinates[0], coordinates[1]);
    }

    for (var i = 0; i < destination.length; i++){
        let coordinates = destination[i].innerHTML.split(',');
        drawDestination(coordinates[0], coordinates[1]);
    }


    for (var i = 0; i < highlights.length; i++){
        if (highlights[i].innerHTML == "destination")
            highlightDest();
        else if (highlights[i].innerHTML == "hotspot")
            highlightHotspot();
    }

    for (var i = 0; i < hit.length; i++){
        let ctx = document.getElementById('noticeBoard').getContext('2d');
        ctx.font = '48px sans-serif';
        if (hit[i].innerHTML == "wall")
            ctx.fillText("HIT WALL", ctx.canvas.width/4, ctx.canvas.height/2);
        else if (hit[i].innerHTML == "hotspot")
            ctx.fillText("HIT HOTSPOT", ctx.canvas.width/2, ctx.canvas.height/2);

        console.log(hit[i]);
    }

    for (var i = 0; i < clears.length; i++){
        if (clears[i].innerHTML == "map")
            clearMap();
        else if (clears[i].innerHTML == "timer")
            timer = 0;
    }

    document.getElementById('timer').innerHTML = timer;


}

function pause()
{
    stop = true;
}


/// animation
function clearMap()
{
    let ctx = document.getElementById('mapCanvas').getContext('2d');
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    currHotspots = [];
    currDestination = null;
}

function clearHighlight()
{
    let ctx = document.getElementById('highlightCanvas').getContext('2d');
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

function clearNotice()
{
    let ctx = document.getElementById('noticeBoard').getContext('2d');
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

function clearAgent()
{
    let ctx = document.getElementById('agentCanvas').getContext('2d');
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}



function drawDestination(x, y)
{
    let ctx = document.getElementById('mapCanvas').getContext('2d');
    ctx.fillStyle = "#A3D5FF";
    ctx.fillRect(x*scale, y*scale, scale, scale);

    currDestination = [x, y];
}

function highlightDest()
{
    let ctx = document.getElementById('highlightCanvas').getContext('2d');
    ctx.fillStyle = "Green";

    ctx.fillRect(currDestination[0]*scale, currDestination[1]*scale, scale, scale);
}


function drawWall(x, y)
{
    let ctx = document.getElementById('mapCanvas').getContext('2d');
    ctx.fillStyle = "rgb(104, 103, 181)";
    ctx.fillRect(x*scale, y*scale, scale, scale);
}

function drawHotspot(x, y)
{
    let ctx = document.getElementById('mapCanvas').getContext('2d');
    ctx.fillStyle = "#EAD7E3";
    ctx.fillRect(x*scale, y*scale, scale, scale);

    currHotspots.push([x, y]);
}
function highlightHotspot()
{
    let ctx = document.getElementById('highlightCanvas').getContext('2d');
    ctx.fillStyle = "#9F5683";

    for (var i = 0; i < currHotspots.length; i++)
    {
        ctx.fillRect(currHotspots[i][0]*scale, currHotspots[i][1]*scale, scale, scale);
    }
}



function drawAgent(x, y, degrees)
{
    clearAgent();

    let ctx = document.getElementById('agentCanvas').getContext('2d');

    if(degrees == 0)
    {
        ctx.drawImage(
            sprite0, scale*x, scale*y,
            scale, scale);
    }
    else if (degrees == 90)
    {
        ctx.drawImage(
            sprite90, scale*x, scale*y,
            scale, scale);

    }
    else if (degrees == 180)
    {
        ctx.drawImage(
            sprite180, scale*x, scale*y,
            scale, scale);
    }
    else
    {

        ctx.drawImage(
            sprite270, scale*x, scale*y,
            scale, scale);
    }


    lastCoordinates = [x, y];
}


