// Function to linearly interpolate between two values (A and B) based on a factor (t)
function lerp(A, B, t) {
  return A + (B - A) * t;
}

// Function to find the intersection point of two lines defined by points A, B and C, D
function getIntersection(A, B, C, D) {
  // Calculate the top part of the equation for the intersection of two lines
  const tTop = (D.x - C.x) * (A.y - C.y) - (D.y - C.y) * (A.x - C.x);
  const uTop = (C.y - A.y) * (A.x - B.x) - (C.x - A.x) * (A.y - B.y);
  const bottom = (D.y - C.y) * (B.x - A.x) - (D.x - C.x) * (B.y - A.y);

  // If the bottom part of the equation is not zero, calculate the t and u values
  if (bottom != 0) {
    const t = tTop / bottom;
    const u = uTop / bottom;

    // Check if the intersection point is within the line segments
    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
      // Return the intersection point, its offset along the line, and null otherwise
      return {
        x: lerp(A.x, B.x, t),
        y: lerp(A.y, B.y, t),
        offset: t,
      };
    }
  }

  // If no intersection is found, return null
  return null;
}

// Function to check if two polygons intersect
function polysIntersect(poly1, poly2) {
  // Loop through all the edges of the first polygon
  for (let i = 0; i < poly1.length; i++) {
    // Loop through all the edges of the second polygon
    for (let j = 0; j < poly2.length; j++) {
      // Calculate the intersection point of the two lines
      const touch = getIntersection(
        poly1[i],
        poly1[(i + 1) % poly1.length],
        poly2[j],
        poly2[(j + 1) % poly2.length]
      );

      // If an intersection point is found, return true
      if (touch) {
        return true;
      }
    }
  }

  // If no intersection is found, return false
  return false;
}

// Function to convert a value to an RGBA color string
function getRGBA(value) {
  // Calculate the alpha value
  const alpha = Math.abs(value);

  // Calculate the RGB values based on the sign of the value
  const R = value < 0 ? 0 : 255;
  const G = R;
  const B = value > 0 ? 0 : 255;

  // Return the RGBA color string
  return "rgba(" + R + "," + G + "," + B + "," + alpha + ")";
}

// Function to generate a random color
function getRandomColor() {
  // Generate a random hue value
  const hue = 290 + Math.random() * 260;

  // Return the HSL color string
  return "hsl(" + hue + ", 100%, 60%)";
}
