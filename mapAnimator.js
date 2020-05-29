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
var lastCoordinates = null;
var lastDestination = null;
var lastHotspots = [];


window.onload = () =>
{
    var canvas = document.getElementById('mapCanvas');
    if (canvas.getContext) {
        var ctx = document.getElementById('mapCanvas').getContext('2d');
        ctx.font = '48px Roboto';
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
        ctx.clearRect(0, 0, 1000, 1600); // clear the canvas


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



function draw(frame) {
    console.log(lastHotspots);
    clearHotspots();
    lastHotspots = [];

    var clears = frame.getElementsByTagName("clear");
    var walls = frame.getElementsByTagName("wall");
    var agent = frame.getElementsByTagName("agent");
    var hotspots = frame.getElementsByTagName("hotspot");
    var destination = frame.getElementsByTagName("destination");


    for (var i = 0; i < walls.length; i++){
        let coordinates = walls[i].innerHTML.split(',');
        drawWall(coordinates[0], coordinates[1]);
    }


    for (var i = 0; i < agent.length; i++){
        let coordinates = agent[i].innerHTML.split(',');
        console.log(coordinates[2])
        drawAgent(coordinates[0], coordinates[1], coordinates[2]);
    }

    for (var i = 0; i < hotspots.length; i++){
        let coordinates = hotspots[i].innerHTML.split(',');
        drawHotspot(coordinates[0], coordinates[1]);
        lastHotspots.push([coordinates[0], coordinates[1]]);
    }

    for (var i = 0; i < destination.length; i++){
        let coordinates = destination[i].innerHTML.split(',');
        drawDestination(coordinates[0], coordinates[1]);
    }

    for (var i = 0; i < clears.length; i++){
        if (clears[i].innerHTML == "map")
            clearCanvas();
        else if (clears[i].innerHTML == "destination")
            clearDestination();
        timer = 0;
    }

    document.getElementById('timer').innerHTML = timer;


}

function pause()
{
    stop = true;
}


/// animation
function clearCanvas()
{
    let ctx = document.getElementById('mapCanvas').getContext('2d');
    ctx.clearRect(0, 0, 1000, 1600);
    lastCoordinates = null;
}

function clearDestination()
{
    let ctx = document.getElementById('mapCanvas').getContext('2d');

    if (lastDestination)
    {
        ctx.clearRect(0, 0, scale, scale);
    }
}

function clearHotspots()
{
    let ctx = document.getElementById('mapCanvas').getContext('2d');

    for (var i = 0; i < lastHotspots.length; i++)
    {
        ctx.clearRect(lastHotspots[i][0]*scale, lastHotspots[i][1]*scale, scale, scale);
    }

    lastHotspots = [];
}

function drawDestination(x, y)
{
    let ctx = document.getElementById('mapCanvas').getContext('2d');
    ctx.fillStyle = "rgb(240, 132, 98)";
    ctx.fillRect(x*scale, y*scale, scale, scale);

    lastDestination = [x, y];
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
    ctx.fillStyle = "Red";
    ctx.fillRect(x*scale, y*scale, scale, scale);
}


function drawAgent(x, y, degrees)
{
    let ctx = document.getElementById('mapCanvas').getContext('2d');

    if (lastCoordinates)
    {
        ctx.clearRect(lastCoordinates[0]*scale, lastCoordinates[1]*scale, scale, scale);
    }

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



function sprite (options) {
                
    var that = {};
                    
    that.context = options.context;
    scale = options.width;
    scale = options.height;
    that.image = options.image;

    return that;
}

