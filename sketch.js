let wall;
let walls=[];
let count=0;
let cars=[];
let savedCars=[];
let TOTAL = 40
let deadCounter=0;
let timeCount=0;
let genCount =0;
let start;
let simulationSpeedSlider;
let secondBestIndex=0;
let camera;
let ga;
let zoom=1
let sf = 1, tx = 0, ty = 0;
let startPosOnMousePress;
let isMousePressed
let offsetX = 0;
let offsetY = 0;
let mouseShiftedX = 0
let mouseShiftedY = 0
let isSimulationRunning=false

const generationCountText = document.querySelector('#generation-count');
const playCheckbox = document.querySelector('#play-box');
const lockCameraCheckbox = document.querySelector('#lock-camera-box');
const runNonStopCheckBox = document.querySelector('#run-dont-stop-box');
const showSensorsCheckBox = document.querySelector('#show-sensors-box');
const showNeuralNetworkCheckBox = document.querySelector('#show-neuralnetwork-box');
const clearRacetrackButton = document.querySelector('#clear-racetrack-btn');
const restartButton = document.querySelector('#restart-btn');
const playButton = document.querySelector('#play-btn');
const stopButton = document.querySelector('#stop-btn');
const saveRacetrackForm = document.querySelector('#save-racetrack-form');
const racetrackName = document.querySelector('#save-racetrack-form');
const racetrackList = document.querySelector('#racetracks-list');
const showRacetracksButton = document.querySelector('#show-racetracks-btn');
const showSettingsButton = document.querySelector('#show-settings-btn');
const settingsIcon = document.querySelector('#settings-icon');
const racetracksIcon = document.querySelector('#racetracks-icon');


const racetracksContainer = document.getElementById('racetracks-container');
const settingsContainer = document.getElementById('settings-container');

let deleteRacetrackButtons = null;
let racetracksContainerVisibility = true;

const racetrackPaths = ['racetracks/track1.json', 'racetracks/track2.json', 'racetracks/track3.json']

function setup() {
    myCanvas = createCanvas(window.innerWidth, window.innerHeight);
    myCanvas.parent("canvas-container");
    window.addEventListener('resize', () => resizeCanvas(window.innerWidth, window.innerHeight) , false);

    camera = createVector(0, 0)
    start=createVector(300 + camera.x, 250+camera.y)
    console.log(width, height)

    for(let i=0;i<TOTAL;i++){
        cars.push(new Car(start.x, start.y, new NeuralNetwork(6,5,4)))
    }

    // camera = start.copy()
    console.log(window.innerWidth, window.innerHeight)
    ga = new GA()

    showNeuralNetworkCheckBox.click()
    clearRacetrackButton.onclick = clearRacetrack;
    restartButton.onclick = onRestartButtonClicked;
    playButton.onclick = () => isSimulationRunning = true
    stopButton.onclick = () => isSimulationRunning = false
    saveRacetrackForm.addEventListener('submit', event => {
        event.preventDefault()
        const racetrackName = event.target['racetrack'].value;
        saveRacetrack(racetrackName)
        event.target['racetrack'].value=""
      })
    showRacetracksButton.onclick = () => showHideContainer('racetracks-container', 'show-racetracks-btn', 'racetracks-icon');
    showSettingsButton.onclick = () => showHideContainer('settings-container', 'show-settings-btn', 'settings-icon');


    loadRacetrackLocally()
    loadRacetracksOnRefresh();
    deleteRacetracksOnClick();
}

function draw() {
    background(0)

    mouseShiftedX = (mouseX - camera.x)/sf
    mouseShiftedY = (mouseY - camera.y)/sf

    simulationFrame()
}

function simulationFrame(){
    //update car
    let maxScore=0;
    for(let i=0;i<cars.length;i++) {
        if(!cars[i].dead && isSimulationRunning) {
            cars[i].update()
            cars[i].detectWalls(walls)
            cars[i].think()
        }
        cars[i].fitness = ga.getCarFitness(cars[i])
        if(cars[i].fitness>maxScore) {
            secondBestIndex=ga.bestIndex;
            maxScore=cars[i].fitness
            ga.bestIndex=i
        }
        cars[i].best=false;
    }
    cars[ga.bestIndex].best=true;

    //update walls - collision detection
    for(let i=walls.length-1;i>=0;i--) {
        for(let j=cars.length-1;j>=0;j--) {
            if(!cars[j].dead && walls[i].hits(cars[j].frontPos.x,cars[j].frontPos.y)) {
            cars[j].dead=true;
            deadCounter++
            savedCars.push(cars[j]);
            }   
        }    
    }

    //Lock camera on the best car
    let cameraDistFromCar = camera.dist(cars[ga.bestIndex].pos)
    if(lockCameraCheckbox.checked && isSimulationRunning && cameraDistFromCar>20) {
        let temp = p5.Vector.sub(cars[ga.bestIndex].pos, camera)
        temp.normalize()
        temp.mult(map(cameraDistFromCar, 0, height, 0, 40))
        camera.add(temp)
    }

    // Draw cars and walls
    push()
    translate(camera.x, camera.y);
    scale(sf);

    if(isSimulationRunning && lockCameraCheckbox.checked) {
        translate(-camera.x,-camera.y)
        translate(window.innerWidth/2,window.innerHeight/2)
        translate(-camera.x,-camera.y)
    }

    for(let wall of walls)
        wall.show()

    if(wall!=null && count==1) 
        wall.show();

    for(let car of cars)
        car.show()
    cars[ga.bestIndex].show()
    pop()


    //its used to add new walls to the map
    if(wall!=null && count==1) {
        let v = createVector(wall.p1.x, wall.p1.y)
        let m = createVector(mouseShiftedX, mouseShiftedY)
        let angle = -m.sub(v).heading()
        wall.angle=angle;
        wall.w=dist(mouseShiftedX, mouseShiftedY, wall.p1.x, wall.p1.y)
        wall.p2=createVector(wall.p1.x+cos(-wall.angle)*wall.w,wall.p1.y+sin(-wall.angle)*wall.w)
        wall.p3=createVector(wall.p1.x+cos(-wall.angle+PI/2)*wall.h,wall.p1.y+sin(-wall.angle+PI/2)*wall.h)
        wall.p3=createVector(wall.p1.x+cos(-wall.angle+PI/2)*wall.h,wall.p1.y+sin(-wall.angle+PI/2)*wall.h)
        wall.p4=createVector(wall.p2.x+cos(-wall.angle+PI/2)*wall.h,wall.p2.y+sin(-wall.angle+PI/2)*wall.h)
    }

    if(showNeuralNetworkCheckBox.checked)
        Utils.drawNeuralNetwork(cars[ga.bestIndex].brain)
 
    //starting new generation
    if((deadCounter==cars.length || timeCount>5000 || (genCount<30 && timeCount>2000)
    ||(genCount<15 && timeCount>1000)) && (deadCounter==cars.length || !runNonStopCheckBox.checked)) {
        for(let car of cars){
            if(!car.dead)
                savedCars.push(car)
        }

        ga.nextGeneration();
        timeCount=0;
        deadCounter=0;
        genCount++
    }

    if(isSimulationRunning)
        timeCount++

    // move camera with mouse
    if(mouseIsPressed){
        camera.x -= pmouseX - mouseX
        camera.y -= pmouseY - mouseY
    }

    generationCountText.innerHTML = `Generation: ${genCount}`;
}


//also used to build new walls
function keyTyped() {
    if(key === 'w' && document.activeElement.tagName!='INPUT'){
        if(count==1) {
            walls.push(wall)
            count=-1;
            wall=null;
        }
        if(count==0) {
            console.log(camera.x, camera.y, mouseShiftedX, mouseShiftedY)
            wall = new Wall(mouseShiftedX, mouseShiftedY, 0)
        }
        count++;
    }

    if(key === 'd' && document.activeElement.tagName!='INPUT'){
        for(let i=0; i<walls.length; i++) {
            if(walls[i].hits(mouseShiftedX, mouseShiftedY)) 
                walls.splice(i,1)
        }
    }
}

function mouseWheel(event) {
    console.log(event.delta)
    if (event.deltaY==0)
        return 
    let mx = mouseX;
    let my = mouseY;

    let s = event.deltaY > 0 ? 0.95 : 1.05;

    sf = sf * s;
    camera.x = mx - s * mx + s * camera.x;
    camera.y = my - s * my + s * camera.y;
}


//not used now, steering the cars with keys
function steer(car) {
    if(keyIsDown(LEFT_ARROW))
        car.heading-=0.05
    if(keyIsDown(RIGHT_ARROW))
        car.heading+=0.05
    if(keyIsDown(UP_ARROW))
        car.vel+=0.1
    if(keyIsDown(DOWN_ARROW))
        car.vel*=0.95
}

function onRestartButtonClicked(){
    clearRacetrack();

    for(let i=0;i<TOTAL;i++){
        cars[i].brain = new NeuralNetwork(6,5,4)
    }
    ga.nextGeneration()
    genCount=0
}

function clearRacetrack() {
    walls = []
    for(let car of cars){
        car.pos = start.copy();
        car.heading = 0; 
    }

    isSimulationRunning = false;
}

function saveRacetrack(racetrackName) {
    let wallsStringified = []
    for(let wall of walls) {
        wallsStringified.push(wall.toJSON())
    }

    console.log(JSON.stringify({racetrackName: wallsStringified}))

    localStorage.setItem(racetrackName, JSON.stringify(wallsStringified));
    addRacetrackItem(racetrackName)
    deleteRacetracksOnClick()
}

async function loadRacetrackLocally(){
    const racetrackKeys = Object.keys(localStorage)

    // const response = await fetch("racetracks/track1.json")
    // const data = JSON.parse(response)

    for(const path of racetrackPaths){
        console.log(path)
        let response = await Utils.loadJSON(path)
        let data = JSON.parse(response)
        console.log(data.walls)
        if(!racetrackKeys.includes(data.racetrackName)) {
            localStorage.setItem(data.racetrackName, JSON.stringify(data.walls));
            addRacetrackItem(data.racetrackName)
        }
    }

    deleteRacetracksOnClick()
}

function loadRacetrack(racetrackName){
    clearRacetrack()

    let parsedWalls = JSON.parse(localStorage.getItem(racetrackName) || '[]')
    for(let item of parsedWalls) {
        walls.push(new Wall(item.x1, item.y1, item.angle, item.w, item.h))
    }
}

function addRacetrackItem(racetrackName){
    const li = document.createElement("li");
    const span = document.createElement("span");

    li.appendChild(document.createTextNode(racetrackName));
    li.addEventListener('click', () => loadRacetrack(racetrackName))

    span.className = "close"
    span.appendChild(document.createTextNode("\u00D7"))
    li.appendChild(span)
    racetrackList.appendChild(li);
}

function loadRacetracksOnRefresh(){
    const racetrackKeys = Object.keys(localStorage)

    for(let racetrackName of racetrackKeys){
        addRacetrackItem(racetrackName)
    }
}

function showHideContainer(containerID, buttonID, iconID){
    container = document.getElementById(containerID);
    button = document.getElementById(buttonID);
    containerIcon = document.getElementById(iconID);
    const icon = button.querySelector('i');

    if(container.offsetHeight == 0) {
        icon.classList.remove('fa-angle-down');
        icon.classList.add('fa-angle-up');
        container.classList.add('visible');
        containerIcon.classList.remove('visible');
    }
    else {
        icon.classList.remove('fa-angle-up');
        icon.classList.add('fa-angle-down');
        container.classList.remove('visible');
        containerIcon.classList.add('visible');
    }
}

function deleteRacetracksOnClick(){
    deleteRacetrackButtons = document.querySelectorAll('.close');
    for(let i=0; i<deleteRacetrackButtons.length; i++){
        const li = deleteRacetrackButtons[i].parentElement

        deleteRacetrackButtons[i].onclick = (e) => {
            console.log('delete: '+ li.innerText)
            e.cancelBubble = true;
            li.removeChild(li.lastChild)
            localStorage.removeItem(li.innerText);
            li.remove()
        }
    }
}