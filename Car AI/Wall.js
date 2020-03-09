class Wall {
  constructor(x1,y1,w,h,angle) {
    this.p1=createVector(x1,y1);
    this.w=w;
    this.h=h;
    this.angle=angle;
    this.p2=createVector(this.p1.x+cos(-this.angle)*this.w,this.p1.y+sin(-this.angle)*this.w)
    this.p3=createVector(this.p1.x+cos(-this.angle)*this.h,this.p1.x+cos(-this.angle)*this.h)
    this.p4=createVector(this.p2.x+cos(-this.angle+PI/2)*this.h,this.p2.x+cos(-this.angle+PI/2)*this.h)
  }
  hits(carX,carY) {
  let x = cos(this.angle)*(carX - this.p1.x) - sin(this.angle)*(carY- this.p1.y) + this.p1.x
  let y = sin(this.angle)*(carX - this.p1.x) + cos(this.angle)*(carY- this.p1.y)+  this.p1.y
    if(x<this.p1.x + this.w && x>this.p1.x && y<this.p1.y + this.h && y>this.p1.y) {
      fill(255,0,0)
        return true
      }
      return false
}
  show() {
    noStroke()
  push()
  translate(this.p1.x,this.p1.y)
  rotate(-this.angle)
  fill(100)
  rect(0,0,this.w,this.h)
  pop()

}

}
