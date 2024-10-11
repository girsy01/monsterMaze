class Field {
  constructor(x, y, size) {
    this.x = x; //not x position on the screen but number in matrix
    this.y = y; //not y position on the screen but number in matrix
    this.size = size;
    this.element = document.createElement("div");
    this.element.style.height = `${size}px`;
    this.element.style.width = `${size}px`;
    this.element.classList.add("field");
    this.element.style.position = "absolute";
    this.element.style.left = `${x * size}px`;
    this.element.style.top = `${y * size}px`;
    this.isWall = false;
    this.hasCoin = false;
  }
}
