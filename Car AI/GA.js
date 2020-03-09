let bestIndex=0
function nextGeneration() {
console.log('new generation')
  calculateFitness();
 cars[0]=new Car(start.x,start.y,savedCars[bestIndex].brain);
  for(let i=1;i<TOTAL;i++) {
 cars[i]=new Car(start.x,start.y,savedCars[pickOne()].brain);
    cars[i].brain.mutate(0.1,0.7);
  }
  savedCars=[];
}
function pickOne() {
  var index =0;
  var r = random(1);
  while(r>0) {
    r = r - savedCars[index].fitness;
    index++
  }
  index--;
  return index;
}

function calculateFitness() {
  let sum=0;
  for(let car of savedCars) {
    if(car.maxDist<500) {
      car.score*=0.1
      car.maxDist*=0.1
    }

    sum+=car.score + car.maxDist*3;
  }
  let biggestFitness=0
  for(let i=0;i<savedCars.length;i++) {
    savedCars[i].fitness=(savedCars[i].score+savedCars[i].maxDist*3)/sum;
    if(savedCars[i].fitness>=biggestFitness){
      biggestFitness=savedCars[i].fitness
      bestIndex=i;
    }
  }
}
