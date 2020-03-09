let wall
let walls=[];
let count=0;
let cars=[]
let savedCars=[]
let TOTAL = 50
let checkbox
let noGenBox
let showSensorsBox
let deadCounter=0
let timeCount=0
let genCount =0;
let start
let slider
let secondBestIndex=0;
let camera
let generations=1
function setup() {
createCanvas(1400,700);
start=createVector(200,200)

for(let i=0;i<TOTAL;i++)
cars.push(new Car(start.x,start.y,new NeuralNetwork(6,7,4)))
checkbox = createCheckbox('start');
noGenBox = createCheckbox('run n dont stop!');
showSensorsBox = createCheckbox('show sensors!');
slider= createSlider(1,100,1)
camera = start.copy()
}

function draw() {
background(0)

//update car
let maxScore=0;
for(let i=0;i<cars.length;i++) {
if(!cars[i].dead && checkbox.checked()) {
 cars[i].update()
 cars[i].detectWalls(walls)
 cars[i].think()
 //steer(cars[i])

}
if(cars[i].score+cars[i].maxDist*3>maxScore) {
  secondBestIndex=bestIndex;
  cars[i].fitness=cars[i].score+cars[i].maxDist*3
  maxScore=cars[i].fitness
  bestIndex=i
}
cars[i].best=false;
}
cars[bestIndex].best=true;

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
if(camera.dist(cars[bestIndex].pos)>5) {
  let temp = p5.Vector.sub(cars[bestIndex].pos,camera)
  temp.normalize()
  temp.mult(5)
  camera.add(temp)
} else camera=cars[bestIndex].pos.copy()

push()
if(checkbox.checked()) {
  translate(width/2,height/2)
  scale(2)
//  let x = cars[bestIndex].pos.x
//  let y= cars[bestIndex].pos.y
  translate(-camera.x,-camera.y)

}
for(let car of cars)
car.show()
for(let wall of walls)
wall.show()
pop()

//starting new generation
if((deadCounter==cars.length || timeCount>5000 || (genCount<30 && timeCount>2000) 
||(genCount<15 && timeCount>500)) && (deadCounter==cars.length || !noGenBox.checked())) {
  for(let car of cars){
    if(!car.dead)
    savedCars.push(car)
  }
  timeCount=0;
  deadCounter=0;
  genCount++
  nextGeneration();
  generations++
  camera=start.copy()
}
if(checkbox.checked())
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
text('generation: '+generations,30, 50);

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

 function linesIntersection(p0, p1,p2,p3) {
    let p4=createVector(-100000,-100000);
    let s1_x, s1_y, s2_x, s2_y;
    s1_x = p1.x - p0.x;     s1_y = p1.y - p0.y;
    s2_x = p3.x - p2.x;     s2_y = p3.y - p2.y;

    let s, t;
    s = (-s1_y * (p0.x - p2.x) + s1_x * (p0.y - p2.y)) / (-s2_x * s1_y + s1_x * s2_y);
    t = ( s2_x * (p0.y - p2.y) - s2_y * (p0.x - p2.x)) / (-s2_x * s1_y + s1_x * s2_y);

    // Collision detected
    if (s >= 0 && s <= 1 && t >= 0 && t <= 1) {
            p4.x = p0.x + (t * s1_x);
            p4.y = p0.y + (t * s1_y);
    }
    return p4;
}
