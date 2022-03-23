/**
 * Genetic algorithm implementation with russian roulette selection
 */
class GA {
    constructor() {
        this.bestIndex = 0;
    }

    /**
     * Based on fitness produce cars for a new generation
     */
    nextGeneration() {
        this.calculateFitness();
        cars[0] = new Car(start.x, start.y, savedCars[this.bestIndex].brain);
        for (let i = 1; i < TOTAL; i++) {
            cars[i] = new Car(start.x, start.y, savedCars[this.pickOne()].brain);
            cars[i].brain.mutate(0.1, 0.7);
        }
        savedCars = [];
    }

    /**
     * Select a random car
     * The bigger the fitness, the better the chances for producing offspring - linear relation
     */
    pickOne() {
        var index = 0;
        var r = random(1);
        while (r > 0) {
            r = r - savedCars[index].fitness;
            index++;
        }
        index--;
        return index;
    }

    /**
     * Calculate fitness in range of [0 - 1], where 0 means that the car is shit, and 1 means that its op and all of the others are shit.
     */
    calculateFitness() {
        let sum = 0;
        for (let car of savedCars) {
            car.fitness = this.getCarFitness(car);
            sum += car.fitness;
        }

        let biggestFitness = 0;
        for (let i = 0; i < savedCars.length; i++) {
            savedCars[i].fitness = savedCars[i].fitness / sum;
            if (savedCars[i].fitness >= biggestFitness) {
                biggestFitness = savedCars[i].fitness;
                this.bestIndex = i;
            }
        }
    }

    /**
     * Calculate car's fitness based on time being alive, maximum distance from respawn point (prevents spinning), and the overall distance traveled.
     */
    getCarFitness(car) {
        if (car.maxDist < 500) {
            car.distance *= 0.1;
            car.maxDist *= 0.1;
        }
        return car.distance + car.maxDist * 3 + car.lifeCount;
    }
}
