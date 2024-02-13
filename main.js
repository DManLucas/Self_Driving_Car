// Get the canvas element for the car
const carCanvas = document.getElementById("carCanvas");
// Set the width of the car canvas
carCanvas.width = 200;

// Get the canvas element for the network
const networkCanvas = document.getElementById("networkCanvas");
// Set the width of the network canvas
networkCanvas.width = 300;

// Get the 2D rendering context of the car canvas
const carCtx = carCanvas.getContext("2d");
// Get the 2D rendering context of the network canvas
const networkCtx = networkCanvas.getContext("2d");

// Create a new road object with the center lane and bottom position
const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9);

// Set the number of cars to generate
const N = 1000;
// Generate an array of cars
const cars = generateCars(N);
// Set the best car to the first car in the array
let bestCar = cars[0];

// If there is a best brain in the local storage
if (localStorage.getItem("bestBrain")) {
  // Loop through all the cars
  for (let i = 0; i < cars.length; i++) {
    // Set the brain of the current car to the best brain in the local storage
    cars[i].brain = JSON.parse(localStorage.getItem("bestBrain"));
    // If the current car is not the first car
    if (i != 0) {
      // Mutate the brain of the current car
      NeuralNetwork.mutate(cars[i].brain, 0.1);
    }
  }
}

// Create an array of traffic cars
const traffic = [
  new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(0), -300, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(2), -300, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(0), -500, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(1), -500, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(1), -700, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(2), -700, 30, 50, "DUMMY", 2, getRandomColor()),
];

// Call the animate function
animate();

// Save the best brain to the local storage
function save() {
  localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain));
}

// Remove the best brain from the local storage
function discard() {
  localStorage.removeItem("bestBrain");
}

// Generate an array of cars
function generateCars(N) {
  const cars = [];
  // Loop through the number of cars to generate
  for (let i = 1; i <= N; i++) {
    // Add a new car to the array with the center lane and initial position
    cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, "AI"));
  }
  // Return the array of cars
  return cars;
}

// The animation loop function
function animate(time) {
  // Loop through all the traffic cars and update their position
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].update(road.borders, []);
  }
  // Loop through all the cars and update their position
  for (let i = 0; i < cars.length; i++) {
    cars[i].update(road.borders, traffic);
  }
  // Set the best car to the car with the minimum y position
  bestCar = cars.find((c) => c.y == Math.min(...cars.map((c) => c.y)));

  // Set the height of the canvases to the window height
  carCanvas.height = window.innerHeight;
  networkCanvas.height = window.innerHeight;

  // Save the canvas state
  carCtx.save();
  // Translate the canvas to the best car's y position
  carCtx.translate(0, -bestCar.y + carCanvas.height * 0.7);

  // Draw the road, traffic cars, and all cars
  road.draw(carCtx);
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].draw(carCtx);
  }
  carCtx.globalAlpha = 0.2;
  for (let i = 0; i < cars.length; i++) {
    cars[i].draw(carCtx);
  }
  carCtx.globalAlpha = 1;
  bestCar.draw(carCtx, true);

  // Restore the canvas state
  carCtx.restore();

  // Set the line dash offset of the network canvas context
  networkCtx.lineDashOffset = -time / 50;
  // Draw the best car's neural network
  Visualizer.drawNetwork(networkCtx, bestCar.brain);
  // Call the animate function again with the new time
  requestAnimationFrame(animate);
}
