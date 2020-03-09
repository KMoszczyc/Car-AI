
class Car {
  constructor(x,y,brain) {
    this.pos=createVector(x,y)
    this.w=10
    this.h=20
    this.heading=0
    this.vel=1
    this.score=0
    this.maxDist=0;
    this.fitness=0
    this.best=false;
    this.sensors=[-PI*2/5,-PI/5,0,PI/5,PI*2/5]
    this.sensorsLength=[100,100,100,100,100]
    this.frontPos=createVector(this.pos.x,this.pos.y)
    this.frontPos.add(cos(this.heading)*this.h/2,sin(this.heading)*this.h/2)
    this.dead=false
  this.brain=brain.copy();

  }
  think() {
    let inputs =[]
    inputs[0]=this.sensorsLength[0]
    inputs[1]=this.sensorsLength[1]
    inputs[2]=this.sensorsLength[2]
    inputs[3]=this.sensorsLength[3]
    inputs[4]=this.sensorsLength[4]
    // inputs[5]=this.heading
    inputs[5]=this.vel
    let output = this.brain.feedforward(inputs)
    if(output[0]>0.5)
    this.heading+=0.1
    if(output[1]>0.5)
    this.heading-=0.1
    if(output[2]>0.5)
    this.vel+=0.1
    if(output[3]>0.5 && this.vel>1)
    this.vel*=0.95
  }
  update() {
    let vel = p5.Vector.fromAngle(this.heading)
    vel.mult(this.vel)
    vel.limit(10)
    this.score+=vel.mag()
    if(start.dist(this.pos)>this.maxDist){
      this.maxDist=vel.dist(this.pos)
    }
    this.pos.add(vel)
    this.frontPos=this.pos.copy()
    this.frontPos.add(cos(this.heading)*this.h/2,sin(this.heading)*this.h/2)
    this.borders()
  }
  detectWalls(obstacles) {
    let sensorsRange=200;
    for(let i=0;i<this.sensors.length;i++) {
      this.sensorsLength[i]=200;
      for(let j=0;j<obstacles.length;j++) {
            let p2 = createVector(this.frontPos.x+cos(this.sensors[i]+this.heading)*sensorsRange,this.frontPos.y+sin(this.sensors[i]+this.heading)*sensorsRange)
            stroke(255)
            let cp1 =linesIntersection(obstacles[j].p1,obstacles[j].p2,this.frontPos,p2)
            let cp2 =linesIntersection(obstacles[j].p3,obstacles[j].p4,this.frontPos,p2)
            let dist1 = cp1.dist(this.frontPos);
            let dist2 = cp2.dist(this.frontPos);
            noStroke();
            if(cp1.x!=0 && cp1.y!=0 && dist1<dist2 && dist1<this.sensorsLength[i]) {
             this.sensorsLength[i]=dist1
           } else if(cp2.x!=0 && cp2.y!=0 && dist2<dist1&& dist2<this.sensorsLength[i]) {
          this.sensorsLength[i]=dist2
          }
           }
        // for(let k=sensorsRange;k>=0;k-=7){
        //   for(let j=0;j<obstacles.length;j++) {
        //     if(obstacles[j].hits(this.frontPos.x+cos(this.sensors[i]+this.heading)*k,this.frontPos.y+sin(this.sensors[i]+this.heading)*k)){
        //       this.sensorsLength[i]=k
        //     }
        //   }
  //  }
  }

  }
  show() {
    fill(255,0,0)
    if(this.best==true)
    fill(0,255,0)
    stroke(0)
    push()
    translate(this.pos.x,this.pos.y)
    rotate(this.heading+PI/2)
    rect(-this.w/2,-this.h/2,this.w,this.h)
    pop()
    if(showSensorsBox.checked() && !this.dead) {
      stroke(50)
      for(let i=0;i<this.sensors.length;i++) {
      line(this.frontPos.x,this.frontPos.y,this.frontPos.x+cos(this.sensors[i]+this.heading)*this.sensorsLength[i],this.frontPos.y+sin(this.sensors[i]+this.heading)*this.sensorsLength[i])
    }
    }
  }
  borders() {
   if(this.pos.x>width+this.h)
   this.pos.x=-this.h
   if(this.pos.x<-this.h)
   this.pos.x=width+this.h
   if(this.pos.y>height+this.h)
   this.pos.y=-this.h
   if(this.pos.y<-this.h)
   this.pos.y=height+this.h


  }
}
