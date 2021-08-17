class Wall {
    constructor(x1, y1, angle, w=0, h=20) {
        this.w = w;
        this.h = h;
        this.angle = angle;
        this.p1 = createVector(x1,y1);
        this.p2 = createVector(this.p1.x + cos(-this.angle)*this.w, this.p1.y + sin(-this.angle)*this.w)
        this.p3 = createVector(this.p1.x + cos(-this.angle+PI/2)*this.h, this.p1.y + sin(-this.angle+PI/2)*this.h)
        this.p4 = createVector(this.p3.x + cos(-this.angle)*this.w, this.p3.y + sin(-this.angle)*this.w)

        console.log(this.w, this.h, this.angle, this.p1, this.p2, this.p3, this.p4)
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

        fill(255,0,0)
        ellipse(this.p1.x,this.p1.y, 5, 5)
        ellipse(this.p2.x,this.p2.y, 5, 5)
        ellipse(this.p3.x,this.p3.y, 5, 5)
        ellipse(this.p4.x,this.p4.y, 5, 5)

    }

    toJSON() {
        return {x1: this.p1.x, y1: this.p1.y, angle: this.angle, w: this.w, h: this.h}
    }
}
