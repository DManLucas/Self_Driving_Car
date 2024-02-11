/**
 * Visualizer class for drawing neural networks.
 */
class Visualizer {
  /**
   * Draws the neural network on a given canvas context.
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
   * @param {Object} network - The neural network to visualize.
   */
  static drawNetwork(ctx, network) {
    // Define margin, left, top, width, and height variables for positioning and sizing the network visualization.
    const margin = 50;
    const left = margin;
    const top = margin;
    const width = ctx.canvas.width - margin * 2;
    const height = ctx.canvas.height - margin * 2;

    // Calculate levelHeight based on the number of levels in the network.
    const levelHeight = height / network.levels.length;

    // Loop through each level of the network, from last to first, and draw it.
    for (let i = network.levels.length - 1; i >= 0; i--) {
      const levelTop =
        top +
        lerp(
          height - levelHeight,
          0,
          network.levels.length == 1 ? 0.5 : i / (network.levels.length - 1)
        );

      // Set the line style for the level and call the drawLevel function to draw it.
      ctx.setLineDash([7, 3]);
      Visualizer.drawLevel(
        ctx,
        network.levels[i],
        left,
        levelTop,
        width,
        levelHeight,
        i == network.levels.length - 1 ? ["🠉", "🠈", "🠊", "🠋"] : []
      );
    }
  }

  /**
   * Draws a single level of the neural network.
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
   * @param {Object} level - The level to draw.
   * @param {number} left - The left position of the level.
   * @param {number} top - The top position of the level.
   * @param {number} width - The width of the level.
   * @param {number} height - The height of the level.
   * @param {Array} outputLabels - An array of output labels for the level's nodes.
   */
  static drawLevel(ctx, level, left, top, width, height, outputLabels) {
    // Calculate the right and bottom positions of the level.
    const right = left + width;
    const bottom = top + height;

    // Extract the inputs, outputs, weights, and biases from the level object.
    const { inputs, outputs, weights, biases } = level;

    // Loop through each input and output pair and draw the connecting lines.
    for (let i = 0; i < inputs.length; i++) {
      for (let j = 0; j < outputs.length; j++) {
        ctx.beginPath();
        ctx.moveTo(Visualizer.#getNodeX(inputs, i, left, right), bottom);
        ctx.lineTo(Visualizer.#getNodeX(outputs, j, left, right), top);
        ctx.lineWidth = 2;
        ctx.strokeStyle = getRGBA(weights[i][j]);
        ctx.stroke();
      }
    }

    // Define the nodeRadius and draw the input and output nodes.
    const nodeRadius = 18;
    for (let i = 0; i < inputs.length; i++) {
      const x = Visualizer.#getNodeX(inputs, i, left, right);
      ctx.beginPath();
      ctx.arc(x, bottom, nodeRadius, 0, Math.PI * 2);
      ctx.fillStyle = "black";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x, bottom, nodeRadius * 0.6, 0, Math.PI * 2);
      ctx.fillStyle = getRGBA(inputs[i]);
      ctx.fill();
    }

    for (let i = 0; i < outputs.length; i++) {
      const x = Visualizer.#getNodeX(outputs, i, left, right);
      ctx.beginPath();
      ctx.arc(x, top, nodeRadius, 0, Math.PI * 2);
      ctx.fillStyle = "black";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x, top, nodeRadius * 0.6, 0, Math.PI * 2);
      ctx.fillStyle = getRGBA(outputs[i]);
      ctx.fill();

      // Draw the bias circle and output label if they exist.
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.arc(x, top, nodeRadius * 0.8, 0, Math.PI * 2);
      ctx.strokeStyle = getRGBA(biases[i]);
      ctx.setLineDash([3, 3]);
      ctx.stroke();
      ctx.setLineDash([]);

      if (outputLabels[i]) {
        ctx.beginPath();
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "black";
        ctx.strokeStyle = "white";
        ctx.font = nodeRadius * 1.5 + "px Arial";
        ctx.fillText(outputLabels[i], x, top + nodeRadius * 0.1);
        ctx.lineWidth = 0.5;
        ctx.strokeText(outputLabels[i], x, top + nodeRadius * 0.1);
      }
    }
  }

  /**
   * Calculates the x-coordinate of a node based on its index and the level's left and right positions.
   * @param {Array} nodes - The array of nodes.
   * @param {number} index - The index of the node.
   * @param {number} left - The left position of the level.
   * @param {number} right - The right position of the level.
   * @returns {number} The calculated x-coordinate.
   */
  static #getNodeX(nodes, index, left, right) {
    return lerp(
      left,
      right,
      nodes.length == 1 ? 0.5 : index / (nodes.length - 1)
    );
  }
}

/**
 * Linear interpolation function.
 * @param {number} a - The first value.
 * @param {number} b - The second value.
 * @param {number} t - The interpolation factor.
 * @returns {number} The interpolated value.
 */
function lerp(a, b, t) {
  return a + (b - a) * t;
}

/**
 * Returns an RGBA color string based on a given value.
 * @param {number} value - The value to convert to a color.
 * @returns {string} The RGBA color string.
 */
function getRGBA(value) {
  // Implement a color mapping function here.
}
