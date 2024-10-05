class Player {
  constructor(field) {
    this.x = field.x;
    this.y = field.y;
    this.moveX = 0;
    this.moveY = 0;
  }

  move() {
    this.x += this.moveX;
    this.y += this.moveY;
    console.log("Moved to:", this.x, this.y);
  }
}
