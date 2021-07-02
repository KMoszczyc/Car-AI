# Car-AI
Car AI steered with neural network that is trained by genetic algorithm in p5.js.

## Neural Network architecture
3 layers - (6,5,4)

input layer:
  - 5 front sensors
  - car velocity
  
hidden later: ..

output layer:
  - out_neuron[0] value > 0.5 - turn left
  - out_neuron[1] value > 0.5 - turn right
  - out_neuron[2] value > 0.5 - speed up
  - out_neuron[3] value > 0.5 - slow down

## Genetic Algorithm
algorithm:
  - start new generation (40 cars)
  - wait for some time
  - calculate cars fitness
  - roulette selection - more fitness -> bigger chance of making offspring
  - mutation of genes (randomly changing weights in neural network)
  - go to step 1

The best car from previous generation is copied to the next one without mutation, so that it's valuable genes don't get lost during the selection. All the rest of the cars are deleted from the previous generation.

## Fitness Function (naive)
fitness = distance_traveled + max_dist_from_start_point*3 + life_time

So this rewards cars that live long, travel longest distance but most importantly get as far away from the start as possible. It's supposed to fight the problem of spinning cars at the starting point, but it has a downside. For specific tracks it may get the population stuck in a local minimum being a sharp corner that is indeed far from the start, but to go further down the track the car has to get closer to the start sometimes, lowering it's fitness. This could be fixed with fitness gates, gates that would be positioned on the track and passing each one would increase car's fitness. Spinning cars would get 0 fitness score then. Although current naive fitness function is good enough.


## Making the race track
![create-race-track-speed](https://user-images.githubusercontent.com/61971053/116268718-ddde0e00-a77d-11eb-98c8-7c2211fdaf38.gif)


## First generations
![first_generations](https://user-images.githubusercontent.com/61971053/116266869-2d233f00-a77c-11eb-9c56-b8488aec687c.gif)

## Little help..
![little_help](https://user-images.githubusercontent.com/61971053/116268613-c6068a00-a77d-11eb-8852-8ab2e7c325aa.gif)

## Generation 35
![generation_35](https://user-images.githubusercontent.com/61971053/116284474-687a3980-a78d-11eb-82ad-0465c1a9236e.gif)

## Generation 207
![generation_207](https://user-images.githubusercontent.com/61971053/116286092-1f2ae980-a78f-11eb-9a18-d36f3a166b70.gif)



Neural network library based on: https://www.youtube.com/watch?v=XJ7HLz9VYz0&list=PLRqwX-V7Uu6aCibgK1PTWWu9by6XFdCfh by Dan Shiffman

https://p5js.org/

