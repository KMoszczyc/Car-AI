class GA {
    constructor(){
        this.bestIndex=0
    }
    nextGeneration() {
        console.log('new generation')
        this.calculateFitness();
        cars[0]=new Car(start.x,start.y,savedCars[this.bestIndex].brain);
        for(let i=1;i<TOTAL;i++) {
            cars[i]=new Car(start.x,start.y,savedCars[this.pickOne()].brain);
            cars[i].brain.mutate(0.1,0.7);
        }
        savedCars=[];
    }
    pickOne() {
      var index =0;
      var r = random(1);
      while(r>0) {
        r = r - savedCars[index].fitness;
        index++
      }
      index--;
      return index;
    }

    calculateFitness() {
      let sum=0;
      for(let car of savedCars) {
        car.fitness = this.getCarFitness(car)
        sum += car.fitness
      }

      let biggestFitness=0
      for(let i=0;i<savedCars.length;i++) {
        savedCars[i].fitness=savedCars[i].fitness/sum;
        if(savedCars[i].fitness>=biggestFitness){
          biggestFitness=savedCars[i].fitness
          this.bestIndex=i;
        }
      }
    }

    getCarFitness(car){
        if(car.maxDist<500) {
          car.score*=0.1
          car.maxDist*=0.1
        }
        return car.score + car.maxDist*3 + car.lifeCount;
    }
}
