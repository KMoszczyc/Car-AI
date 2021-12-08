# Car-AI
Car AI steered with neural network that is trained by genetic algorithm in p5.js.

## Play with it! -  https://kmoszczyc.github.io/Car-AI/

## Car sensors
![car](https://user-images.githubusercontent.com/61971053/129604685-7c12f101-c72c-439a-8cd0-a6cd449fa3fa.png)


## Neural Network architecture
![architecture](https://user-images.githubusercontent.com/61971053/129604658-ecb8c751-9148-48cc-804e-a1b71781be0b.png)

## Features
- Play and pause the simulation
- Play the simulation without starting the next generation
- Show sensors of neural networks
- Restart the simulation

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

## Update!
### Now the UI looks like that!
![image](https://user-images.githubusercontent.com/61971053/142705910-c7d1fc76-33a8-42f4-840e-39ed1c4022f0.png)
#### New features:
- clear current racetrack
- save and load racetracks (local storage)
- delete racetracks
- visualize best neural network
- zoom and move around with mouse
- Lock and unlock the camera


Neural network library based on: https://www.youtube.com/watch?v=XJ7HLz9VYz0&list=PLRqwX-V7Uu6aCibgK1PTWWu9by6XFdCfh by Dan Shiffman

https://p5js.org/

