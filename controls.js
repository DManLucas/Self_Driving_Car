class Controls {
  // Create a constructor for the Controls class that accepts a type parameter
  constructor(type) {
    // Initialize the properties for the different control directions
    this.forward = false;
    this.left = false;
    this.right = false;
    this.reverse = false;

    // Based on the type parameter, add the appropriate event listeners
    switch (type) {
      case "KEYS":
        this.#addKeyboardListeners();
        break;
      case "DUMMY":
        this.forward = true;
        break;
      default:
        break;
    }
  }

  // Private method to add keyboard listeners for arrow keys
  #addKeyboardListeners() {
    // Set up event listeners for keydown and keyup events
    document.onkeydown = (event) => {
      // Based on the key pressed, update the corresponding control property
      switch (event.key) {
        case "ArrowLeft":
          this.left = true;
          break;

        case "ArrowRight":
          this.right = true;
          break;

        case "ArrowUp":
          this.forward = true;
          break;

        case "ArrowDown":
          this.reverse = true;
          break;
      }
    };

    document.onkeyup = (event) => {
      // Based on the key released, reset the corresponding control property
      switch (event.key) {
        case "ArrowLeft":
          this.left = false;
          break;

        case "ArrowRight":
          this.right = false;
          break;

        case "ArrowUp":
          this.forward = false;
          break;

        case "ArrowDown":
          this.reverse = false;
          break;
      }
    };
  }
}
