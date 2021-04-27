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

## Fitness Function (naive)
fitness = distance_traveled + max_dist_from_start_point*3 + life_time

So this rewards cars that live long, travel longest distance but most importantly get as far away from the start as possible. It's supposed to fight the problem of spinning cars at the starting point, but it has a downside. For specific tracks it may get the population stuck in a local minimum being a sharp corner that is indeed far from the start, but to go further down the track the car has to get closer to the start sometimes, lowering it's fitness. This could be fixed with fitness gates, gates that would be positioned on the track and passing each one would increase car's fitness. Spinning cars would get 0 fitness score then. Although current naive fitness function is good enough.


## Make the race track
![create-race-track-speed](https://user-images.githubusercontent.com/61971053/116268718-ddde0e00-a77d-11eb-98c8-7c2211fdaf38.gif)


## First generations
![first_generations](https://user-images.githubusercontent.com/61971053/116266869-2d233f00-a77c-11eb-9c56-b8488aec687c.gif)

## Little help..
![little_help](https://user-images.githubusercontent.com/61971053/116268613-c6068a00-a77d-11eb-8852-8ab2e7c325aa.gif)


Neural network library based on: https://www.youtube.com/watch?v=XJ7HLz9VYz0&list=PLRqwX-V7Uu6aCibgK1PTWWu9by6XFdCfh by Dan Shiffman

https://p5js.org/

