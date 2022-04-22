song = ""
speed = 0;
volume = 1;

rwX = 0;
rwY = 0;
rwC = 0;

lwX = 0;
lwY = 0;
lwC = 0;

function preload() {
    song = loadSound("music/monster.mp3");
}

function setup() {
    canv = createCanvas(600,500);
    cam = createCapture(VIDEO);
    cam.size(500,400);
    // cam.center();
    cam.hide();
    document.getElementById("canvHolder").append(canv.elt);

    poseNet = ml5.poseNet(cam, ()=>{
        console.log('Initialized poseNet');
    });

    poseNet.on('pose',results =>{
        console.log(results);
        if (results.length > 0) {
            rwX = results[0].pose.rightWrist.x;
            rwY = results[0].pose.rightWrist.y;
            rwC = results[0].pose.keypoints[10].score;

            lwX = results[0].pose.leftWrist.x;
            lwY = results[0].pose.leftWrist.y;
            lwC = results[0].pose.keypoints[9].score;
        }
    });

    
}

function draw() {
    image(cam,0,0,600,500);

    fill('red');
    stroke('red');

    if (rwC > 0.2) {
        circle(rwX,rwY,20);
        if (rwY >= 0 && rwY <= 100) {
            speed = 2.5;
        } else if(rwY >= 101 && rwY <= 200){
            speed = 2;
        } else if(rwY >= 201 && rwY <= 300){
            speed = 1.5;
        } else if(rwY >= 301 && rwY <= 400){
            speed = 1;
        } else if(rwY >= 401 && rwY <= 500){
            speed = 0.5;
        }
        song.rate(speed);
        document.getElementById('speedL').innerHTML = `Speed - ${speed}`;
    }

    if (lwC > 0.2) {
        circle(lwX,lwY,20);

        volume = 1 - (lwY / 500);
        console.log(volume);

        song.setVolume(volume);
        document.getElementById('volumeL').innerHTML = `Volume - ${volume}`
    }

}

document.getElementById('playB').addEventListener('click',()=>{
    song.setVolume(1);
    song.rate(1);
    song.play();
});