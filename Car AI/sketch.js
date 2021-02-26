let wall
let walls=[];
let count=0;
let cars=[]
let savedCars=[]
let TOTAL = 40
let playCheckbox
let restartButton
let noGenBox
let showSensorsBox
let deadCounter=0
let timeCount=0
let genCount =0;
let start
let slider
let secondBestIndex=0;
let camera
let ga

function setup() {
    createCanvas(1400,700);
    start=createVector(200,200)

    for(let i=0;i<TOTAL;i++){
        cars.push(new Car(start.x, start.y, new NeuralNetwork(6,5,4)))
    }

    playCheckbox = createCheckbox('play');
    restartButton = createButton('restart')
    noGenBox = createCheckbox('run n dont stop!');
    showSensorsBox = createCheckbox('show sensors!');
    slider= createSlider(1,100,1)
    camera = start.copy()

    restartButton.mousePressed(onRestartButtonClicked)
    ga = new GA()
}

function draw() {
    background(0)

    //update car
    let maxScore=0;
    for(let i=0;i<cars.length;i++) {
        if(!cars[i].dead && playCheckbox.checked()) {
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
    // console.log(camera.dist(cars[ga.bestIndex].pos))
    let cameraDistFromCar = camera.dist(cars[ga.bestIndex].pos)
    if(cameraDistFromCar>20) {
        // console.log('halo')
        let temp = p5.Vector.sub(cars[ga.bestIndex].pos,camera)
        temp.normalize()
        temp.mult(map(cameraDistFromCar, 0, height, 0, 20))
        camera.add(temp)
    }

    push()
    if(playCheckbox.checked()) {
      translate(width/2,height/2)
      scale(2)
      translate(-camera.x,-camera.y)
    }

    for(let wall of walls)
        wall.show()
    for(let car of cars)
        car.show()
    pop()

    //starting new generation
    if((deadCounter==cars.length || timeCount>5000 || (genCount<30 && timeCount>2000)
    ||(genCount<15 && timeCount>500)) && (deadCounter==cars.length || !noGenBox.checked())) {
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

    if(playCheckbox.checked())
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
    fill(255)
    textSize(32)
    text('generation: '+genCount,30, 50);
}

//also used to build new walls
function keyTyped() {
    if(count==1 && key===  ' ') {
        walls.push(wall)
        count=-1;
        wall=null;
    }
    if(count==0  && key=== ' ') {
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
        cars[i].brain = new NeuralNetwork(6,7,4)
    }
    ga.nextGeneration()
    genCount=0
}
