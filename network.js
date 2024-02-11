class NeuralNetwork {
  // Constructor for the NeuralNetwork class, which takes an array of neuron counts as an argument
  constructor(neuronCounts) {
    // Initialize an empty array to store the levels of the neural network
    this.levels = [];
    // Iterate over the neuronCounts array, creating and pushing new Level instances into the levels array
    for (let i = 0; i < neuronCounts.length - 1; i++) {
      this.levels.push(new Level(neuronCounts[i], neuronCounts[i + 1]));
    }
  }

  // Static method for feeding forward the given inputs through the neural network
  static feedForward(givenInputs, network) {
    // Initialize outputs with the result of feeding forward the given inputs into the first level
    let outputs = Level.feedForward(givenInputs, network.levels[0]);
    // Iterate over the remaining levels, feeding forward the outputs from the previous level
    for (let i = 1; i < network.levels.length; i++) {
      outputs = Level.feedForward(outputs, network.levels[i]);
    }
    // Return the final outputs
    return outputs;
  }

  // Static method for mutating the weights and biases of the neural network by a given amount
  static mutate(network, amount = 1) {
    // Iterate over the levels, updating the biases and weights of each level
    network.levels.forEach((level) => {
      for (let i = 0; i < level.biases.length; i++) {
        // Use linear interpolation (lerp) to update the biases
        level.biases[i] = lerp(level.biases[i], Math.random() * 2 - 1, amount);
      }
      for (let i = 0; i < level.weights.length; i++) {
        for (let j = 0; j < level.weights[i].length; j++) {
          // Use linear interpolation (lerp) to update the weights
          level.weights[i][j] = lerp(
            level.weights[i][j],
            Math.random() * 2 - 1,
            amount
          );
        }
      }
    });
  }
}

class Level {
  // Constructor for the Level class, which takes the inputCount and outputCount as arguments
  constructor(inputCount, outputCount) {
    // Initialize arrays for inputs, outputs, biases, and weights
    this.inputs = new Array(inputCount);
    this.outputs = new Array(outputCount);
    this.biases = new Array(outputCount);

    this.weights = [];
    for (let i = 0; i < inputCount; i++) {
      this.weights[i] = new Array(outputCount);
    }

    // Call the private randomize method to initialize the weights and biases
    Level.#randomize(this);
  }

  // Private static method for randomizing the weights and biases of a level
  static #randomize(level) {
    for (let i = 0; i < level.inputs.length; i++) {
      for (let j = 0; j < level.outputs.length; j++) {
        level.weights[i][j] = Math.random() * 2 - 1;
      }
    }

    for (let i = 0; i < level.biases.length; i++) {
      level.biases[i] = Math.random() * 2 - 1;
    }
  }

  // Static method for feeding forward the given inputs through a single level
  static feedForward(givenInputs, level) {
    // Copy the given inputs into the level's inputs array
    for (let i = 0; i < level.inputs.length; i++) {
      level.inputs[i] = givenInputs[i];
    }

    // Calculate the outputs for the level based on the inputs and weights
    for (let i = 0; i < level.outputs.length; i++) {
      let sum = 0;
      for (let j = 0; j < level.inputs.length; j++) {
        sum += level.inputs[j] * level.weights[j][i];
      }

      // Set the output to 1 if the sum is greater than the bias, otherwise set it to 0
      if (sum > level.biases[i]) {
        level.outputs[i] = 1;
      } else {
        level.outputs[i] = 0;
      }
    }

    // Return the level's outputs
    return level.outputs;
  }
}
