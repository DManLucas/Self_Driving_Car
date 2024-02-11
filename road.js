class Road {
  // Initialize the road object with a starting x-position, width, and optional lane count
  constructor(x, width, laneCount = 3) {
    this.x = x;
    this.width = width;
    this.laneCount = laneCount;

    // Calculate the left and right boundaries of the road
    this.left = x - width / 2;
    this.right = x + width / 2;

    // Set the top and bottom boundaries of the road to "infinity"
    const infinity = 1000000;
    this.top = -infinity;
    this.bottom = infinity;

    // Define the four corner points of the road
    const topLeft = { x: this.left, y: this.top };
    const topRight = { x: this.right, y: this.top };
    const bottomLeft = { x: this.left, y: this.bottom };
    const bottomRight = { x: this.right, y: this.bottom };

    // Store the corner points in an array for later use
    this.borders = [
      [topLeft, bottomLeft],
      [topRight, bottomRight],
    ];
  }

  // Calculate the center of a given lane
  getLaneCenter(laneIndex) {
    const laneWidth = this.width / this.laneCount;
    return (
      this.left +
      laneWidth / 2 +
      Math.min(laneIndex, this.laneCount - 1) * laneWidth
    );
  }

  // Draw the road on a canvas context
  draw(ctx) {
    ctx.lineWidth = 5;
    ctx.strokeStyle = "white";

    // Draw the lane lines
    for (let i = 0; i <= this.laneCount; i++) {
      const x = lerp(this.left, this.right, i / this.laneCount);

      if (i > 0 && i < this.laneCount) {
        // Dash the lane lines for better visibility
        ctx.setLineDash([20, 20]);
      } else {
        ctx.setLineDash([]);
      }

      ctx.beginPath();
      ctx.moveTo(x, this.top);
      ctx.lineTo(x, this.bottom);
      ctx.stroke();
    }

    // Draw the road borders
    ctx.setLineDash([]);
    this.borders.forEach((border) => {
      ctx.beginPath();
      ctx.moveTo(border[0].x, border[0].y);
      ctx.lineTo(border[1].x, border[1].y);
      ctx.stroke();
    });
  }
}

// Helper function for linear interpolation
function lerp(start, end, t) {
  return start + (end - start) * t;
}
