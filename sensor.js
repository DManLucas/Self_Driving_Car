class Sensor {
  // Defining a class named Sensor
  constructor(car) {
    // Constructor function for Sensor class, takes in a car object
    this.car = car; // Setting the car object to an instance variable
    this.rayCount = 5; // Setting the number of rays the sensor will cast
    this.rayLength = 150; // Setting the length of the rays
    this.raySpread = Math.PI / 2; // Setting the spread of the rays

    this.rays = []; // Initializing an empty array for rays
    this.readings = []; // Initializing an empty array for readings
  }

  update(roadBorders, traffic) {
    // Update function, takes in roadBorders and traffic as arguments
    this.#castRays(); // Calling the private function castRays
    this.readings = []; // Resetting the readings array
    for (let i = 0; i < this.rays.length; i++) {
      // Looping through the rays array
      this.readings.push(this.#getReading(this.rays[i], roadBorders, traffic)); // Calling the private function getReading and pushing the result into the readings array
    }
  }

  #getReading(ray, roadBorders, traffic) {
    // Private function for getting readings from the rays
    let touches = []; // Initializing an empty array for touches
    for (let i = 0; i < roadBorders.length; i++) {
      // Looping through the roadBorders array
      const touch = getIntersection(
        // Calling the getIntersection function
        ray[0], // With the start point of the ray
        ray[1], // And the end point of the ray
        roadBorders[i][0], // And the start point of the roadBorder
        roadBorders[i][1] // And the end point of the roadBorder
      );
      if (touch) {
        // If the function returns a value
        touches.push(touch); // Push the value into the touches array
      }
    }

    for (let i = 0; i < traffic.length; i++) {
      // Looping through the traffic array
      const poly = traffic[i].polygon; // Setting the polygon of the current traffic object to a variable
      for (let j = 0; j < poly.length; j++) {
        // Looping through the points of the polygon
        const value = getIntersection(
          // Calling the getIntersection function
          ray[0], // With the start point of the ray
          ray[1], // And the end point of the ray
          poly[j], // And the current point of the polygon
          poly[(j + 1) % poly.length] // And the next point of the polygon
        );
        if (value) {
          // If the function returns a value
          touches.push(value); // Push the value into the touches array
        }
      }
    }

    if (touches.length == 0) {
      // If there are no touches
      return null; // Return null
    } else {
      // Otherwise
      const offsets = touches.map((e) => e.offset); // Map the touches array to an array of offsets
      const minOffset = Math.min(...offsets); // Find the minimum offset
      return touches.find((e) => e.offset == minOffset); // Return the touch with the minimum offset
    }
  }

  #castRays() {
    // Private function for casting rays
    this.rays = []; // Resetting the rays array
    for (let i = 0; i < this.rayCount; i++) {
      // Looping through the number of rays
      const rayAngle = // Calculating the angle of the ray
        lerp(
          // Using the lerp function
          this.raySpread / 2, // From the start angle
          -this.raySpread / 2, // To the end angle
          this.rayCount == 1 ? 0.5 : i / (this.rayCount - 1) // Based on the current index
        ) + this.car.angle; // And adding the car's angle

      const start = { x: this.car.x, y: this.car.y }; // Setting the start point of the ray
      const end = {
        x: this.car.x - Math.sin(rayAngle) * this.rayLength,
        y: this.car.y - Math.cos(rayAngle) * this.rayLength,
      }; // Calculating the end point of the ray
      this.rays.push([start, end]); // Pushing the start and end points into the rays array
    }
  }

  draw(ctx) {
    // Draw function, takes in the canvas context as an argument
    for (let i = 0; i < this.rayCount; i++) {
      // Looping through the rays array
      let end = this.rays[i][1]; // Setting the end point of the ray
      if (this.readings[i]) {
        // If there is a reading for the current ray
        end = this.readings[i]; // Setting the end point to the reading
      }
      ctx.beginPath(); // Starting a new path
      ctx.lineWidth = 2; // Setting the line width
      ctx.strokeStyle = "red"; // Setting the stroke style
      ctx.moveTo(this.rays[i][0].x, this.rays[i][0].y); // Moving to the start point of the ray
      ctx.lineTo(end.x, end.y); // Drawing a line to the end point
      ctx.stroke(); // Stroking the path

      ctx.beginPath(); // Starting a new path
      ctx.lineWidth = 2; // Setting the line width
      ctx.strokeStyle = "black"; // Setting the stroke style
      ctx.moveTo(this.rays[i][1].x, this.rays[i][1].y); // Moving to the end point of the ray
      ctx.lineTo(end.x, end.y); // Drawing a line to the end point
      ctx.stroke(); // Stroking the path
    }
  }
}
