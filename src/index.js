module.exports = function solveSudoku(matrix) {
  var checkRow = (row, matrix, candidate) => {
    for (var i = 0; i < 9; i++) {
      if (matrix[row][i] == candidate) {
        return false;
      };
    };
    return true;
  };

  var checkColumn = (column, matrix, candidate) => {
    for (var i = 0; i < 9; i++) {
      if (matrix[i][column] == candidate) {
        return false;
      };
    };
    return true;
  };

  var checkBox = (row, column, matrix, candidate) => {
    var boxRowNumber = Math.floor((row / 3)) * 3;
    var boxColumnNumber = Math.floor((column / 3)) * 3;
    for (var boxRow = 0; boxRow < 3; boxRow++) {
      for (var boxColumn = 0; boxColumn < 3; boxColumn++) {
        if (matrix[boxRowNumber + boxRow][boxColumnNumber + boxColumn] == candidate) {
          return false;
        };
      };
    };
    return true;
  };

  let solve = (matrix) => {
    for (var row = 0; row <= 8; row++) {
      for (var column = 0; column <= 8; column++) {
        if (matrix[row][column] == 0) {
          for (var candidate = 1; candidate <= 9; candidate++) {
            if (checkBox(row, column, matrix, candidate)&&checkRow(row, matrix, candidate)&&checkColumn(column, matrix, candidate)) {
              matrix[row][column] = candidate;
              if (solve(matrix)) {
                return true;
              } else {
                matrix[row][column] = 0;
              };
            };
          };
          return false;
        };
      };
    };
    return true;
  }

  solve(matrix);
  return matrix;

}
