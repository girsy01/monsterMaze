class Player extends Figure {
  constructor(field, fieldsInRow, fieldsInCol) {
    super(field, fieldsInRow, fieldsInCol);
    this.coins = 0;
    this.lives = 2;
  }
}
