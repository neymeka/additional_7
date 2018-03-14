// solveSudoku([
//   [6, 5, 0, 7, 3, 0, 0, 8, 0],
//   [0, 0, 0, 4, 8, 0, 5, 3, 0],
//   [8, 4, 0, 9, 2, 5, 0, 0, 0],
//   [0, 9, 0, 8, 0, 0, 0, 0, 0],
//   [5, 3, 0, 2, 0, 9, 6, 0, 0],
//   [0, 0, 6, 0, 0, 0, 8, 0, 0],
//   [0, 0, 9, 0, 0, 0, 0, 0, 6],
//   [0, 0, 7, 0, 0, 0, 0, 5, 0],
//   [1, 6, 5, 3, 9, 0, 4, 7, 0]
// ])

 module.exports =
function solveSudoku(matrix) {
  var zerosPositions = getZerosPositions(matrix);
  var zerosArray = getZerosArray();

  while (zerosArray.length) {
    var length = zerosArray.length;
    if (checkMatrix() === length) {
      break;
    }
  }
  debugger;
  checkHiddenLoner();

  return matrix;

  function getZerosPositions(matrix) {
    var zerosPositionsByKirill = [];
    for (var i = 0; i < 9; i++) {
      for (var j = 0; j < 9; j++) {
        if (matrix[i][j] == 0) {
          zerosPositionsByKirill.push([i, j])
        }
      }
    }
    return zerosPositionsByKirill;
  }

  function getZerosArray() {
    var zerosArray = [];
    for (n = 0; n < zerosPositions.length; n++) {
      zerosArray[n] = {
        position: zerosPositions[n],
        possibleValues: [1, 2, 3, 4, 5, 6, 7, 8, 9]
      }
    }
    return zerosArray;
  }

  function checkRow(n, matrix) {
    for (var k = 0; k < 9; k++) {
      zerosArray[n].possibleValues = zerosArray[n].possibleValues.filter((value) => value !== matrix[zerosArray[n].position[0]][k])
    }
  }

  function checkColumn(n, matrix) {
    for (var k = 0; k < 9; k++) {
      zerosArray[n].possibleValues = zerosArray[n].possibleValues.filter((value) => value !== matrix[k][zerosArray[n].position[1]])
    }
  }

  // position: [0][7]
  function checkBox(n, matrix) {
    var ourX = Math.trunc(zerosArray[n].position[0] / 3) * 3; //  —>  0 -> 0
    var ourY = Math.trunc(zerosArray[n].position[1] / 3) * 3; // —>  2 -> 6

    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 3; j++) { //3,4
        zerosArray[n].possibleValues = zerosArray[n].possibleValues.filter(
          (value) => value !== matrix[ourX][ourY]
        );
        ourY++;
      }
      ourX++;
      ourY -= 3;
    }
  }

  function checkMatrix() {
    for (var n = 0; n < zerosArray.length; n++) {
      checkRow(n, matrix);
      checkColumn(n, matrix);
      checkBox(n, matrix);
      if (zerosArray[n].possibleValues.length == 1) {
        matrix[zerosArray[n].position[0]][zerosArray[n].position[1]] = zerosArray[n].possibleValues[0];
        // console.log(`insert value ${zerosArray[n].possibleValues[0]} on position [${zerosArray[n].position[0]}][${zerosArray[n].position[1]}]`);
      }
    }
    zerosArray = zerosArray.filter(element => element.possibleValues.length !== 1);

    return zerosArray.length;
  }

  function checkHiddenLoner() {
    // берем по порядку каждое возможное значение элемента и смотрим,
    // если оно не повторяется в ряду, строке и квадрате то
    // заменяем данную клетку в матрице и сокращаем массив возможных до одного, (чтобы потом отфильтровать - удалить )

    // и так по каждому
      for (var n = 0; n < zerosArray.length; n++) {
        for (var i = 0; i < zerosArray[n].possibleValues.length; i++) {
          var curValue = zerosArray[n].possibleValues[i];
          var curPosition = zerosArray[n].position;

          var columnZeros = zerosArray.filter(
            element => element.position[1] === curPosition[1]
          ).filter(element => element.position !== curPosition); // потом удалить из этого массива наш cur элемент
          var rowZeros = zerosArray.filter(
            element => element.position[0] === curPosition[0]
          ).filter(element => element.position !== curPosition);
          // фильтруем по квадрату
          var boxZeros = filterBoxZeros(curPosition).filter(element => element.position !== curPosition);

          // сравниваем уже с нулями
          if (checkUniqueValue(curValue, columnZeros) &&
              checkUniqueValue(curValue, rowZeros) &&
              checkUniqueValue(curValue, boxZeros)) {
              matrix[curPosition[0]][curPosition[1]] = curValue;
              zerosArray[n].possibleValues = [0];
          }
        }
      }

      zerosArray = zerosArray.filter(element => element.possibleValues.length !== 1);

      return zerosArray.length;
  }

  function checkUniqueValue(curValue, array) {
    var answer = true;
    array.forEach(zero => {
      if (zero.possibleValues.some(value => value === curValue)) {
        answer = false;
      }
    });

    return answer;
  }

  function filterBoxZeros(position) {
    var ourX = Math.trunc(position[0] / 3) * 3;
    var ourY = Math.trunc(position[1] / 3) * 3;
    var boxArray = [];

    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 3; j++) { //3,4
        var tempArray = zerosArray.filter(
          element => (element.position[0] === ourX &&
                      element.position[1] === ourY)
        )
        if (tempArray.length) {
          boxArray.push(tempArray[0])
        }
        ourY++;
      }
      ourX++;
      ourY -= 3;
    }
    return boxArray;
  }
}
//  logs-----------------

// [6, 5, 2, 7, 3, 1, 9, 8, 4]
// [9, 7, 1, 4, 8, 6, 5, 3, 2]
// [8, 4, 3, 9, 2, 5, 0, 0, 0]
// [0, 9, 4, 8, 0, 0, 0, 0, 0]
// [5, 3, 8, 2, 0, 9, 6, 0, 0]
// [0, 0, 6, 0, 0, 0, 8, 0, 0]
// [0, 0, 9, 0, 0, 0, 0, 0, 6]
// [0, 0, 7, 0, 0, 0, 0, 5, 0]
// [1, 6, 5, 3, 9, 2, 4, 7, 8]
