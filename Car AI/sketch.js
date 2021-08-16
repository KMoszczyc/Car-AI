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
let myCanvas

const generationCountText = document.querySelector('#generation-count');
const playCheckbox = document.querySelector('#play-box');
const runNonStopCheckBox = document.querySelector('#run-dont-stop-box');
const showSensorsCheckBox = document.querySelector('#show-sensors-box');
const clearWallsButton = document.querySelector('#clear-walls-btn');
const restartButton = document.querySelector('#restart-btn');

function setup() {
    myCanvas = createCanvas(window.innerWidth, window.innerHeight);
    myCanvas.parent("canvas-container");
    window.addEventListener('resize', updateCanvas, false);

    start=createVector(300,250)

    for(let i=0;i<TOTAL;i++){
        cars.push(new Car(start.x, start.y, new NeuralNetwork(6,5,4)))
    }

    camera = start.copy()
    ga = new GA()
    clearWallsButton.onclick = clearWalls;
    restartButton.onclick = onRestartButtonClicked;
}

function draw() {
    background(0)
    simulationFrame()
}

function simulationFrame(){
    //update car
    let maxScore=0;
    for(let i=0;i<cars.length;i++) {
        if(!cars[i].dead && playCheckbox.checked) {
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

     if (mouseIsPressed && mouseButton === LEFT)
         if(walls[i].hits(mouseX,mouseY)) {
           walls.splice(i,1)
       }
    }

    //drawing cars and walls with zooming and following the best car
    let cameraDistFromCar = camera.dist(cars[ga.bestIndex].pos)
    if(cameraDistFromCar>20) {
        // console.log('halo')
        let temp = p5.Vector.sub(cars[ga.bestIndex].pos,camera)
        temp.normalize()
        temp.mult(map(cameraDistFromCar, 0, height, 0, 20))
        camera.add(temp)
    }

    push()
    if(playCheckbox.checked) {
        translate(width/2,height/2)
        translate(-camera.x,-camera.y)
    }

    for(let wall of walls)
        wall.show()

    for(let car of cars)
        car.show()
    pop()



    //starting new generation
    if((deadCounter==cars.length || timeCount>5000 || (genCount<30 && timeCount>2000)
    ||(genCount<15 && timeCount>500)) && (deadCounter==cars.length || !runNonStopCheckBox.checked)) {
        for(let car of cars){
            if(!car.dead)
                savedCars.push(car)
        }

        ga.nextGeneration();
        timeCount=0;
        deadCounter=0;
        genCount++
        camera=start.copy()
    }

    if(playCheckbox.checked)
        timeCount++

    //its used to add new walls to the map
    if(wall!=null && count==1) {
        let v = createVector(wall.p1.x,wall.p1.y)
        let m = createVector(mouseX,mouseY)
        let angle = -m.sub(v).heading()
        wall.angle=angle;
        wall.w=dist(mouseX,mouseY,wall.p1.x,wall.p1.y)
        wall.p2=createVector(wall.p1.x+cos(-wall.angle)*wall.w,wall.p1.y+sin(-wall.angle)*wall.w)
        wall.p3=createVector(wall.p1.x+cos(-wall.angle+PI/2)*wall.h,wall.p1.y+sin(-wall.angle+PI/2)*wall.h)
        wall.p3=createVector(wall.p1.x+cos(-wall.angle+PI/2)*wall.h,wall.p1.y+sin(-wall.angle+PI/2)*wall.h)
        wall.p4=createVector(wall.p2.x+cos(-wall.angle+PI/2)*wall.h,wall.p2.y+sin(-wall.angle+PI/2)*wall.h)
        wall.show();
    }

    generationCountText.innerHTML = `Generation: ${genCount}`;
}


//also used to build new walls
function keyTyped() {
    if(count==1 && key === 'w') {
        walls.push(wall)
        count=-1;
        wall=null;
    }
    if(count==0  && key === 'w') {
        wall = new Wall(mouseX,mouseY,200,20,0)
    }
    count++;
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
    for(let i=0;i<TOTAL;i++){
        cars[i].brain = new NeuralNetwork(6,5,4)
    }
    ga.nextGeneration()
    genCount=0
}

function updateCanvas() {
    myCanvas.width = window.innerWidth;
    myCanvas.height = window.innerHeight;
}

function clearWalls() {
    console.log('clear!')
    walls = []
    for(let car of cars){
        car.pos = start;
        car.heading = 0; 
    }

    playCheckbox.checked = false;
}