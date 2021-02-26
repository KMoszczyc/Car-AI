class Utils {
    static linesIntersection(p0, p1,p2,p3) {
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
}
