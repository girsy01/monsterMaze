class Monster extends Figure {
  constructor(field, fieldsInRow, fieldsInCol) {
    super(field, fieldsInRow, fieldsInCol);
    this.currentDirection = 0;
  }
}
