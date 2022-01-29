exports.checkWin = (row, column, table, player, inAdvance = false) => {
  //console.log(`consider ${row} | ${column} of player ${player}`);
  let rowNumber = table.length;
  let columnNumber = table[0].length;
  // Check ว่าชนะเกมไหม
  //console.log(table);
  // Check แนวนอน
  let winHorizontal = true;
  table[row].forEach((el, index) => {
    // loop แต่ละ element ในแถวตนเอง
    //console.log(`checkH ${row} | ${index} value:${el}`);
    if (el !== player) {
      winHorizontal = false;
    }
  });
  // Check แนวดิ่ง
  let winVertical = true;
  table.forEach((row, index) => {
    //console.log(`checkV ${index} | ${column} value:${row[column]}`);
    // เข้าถึง element ในแถวที่ column นั้นๆ
    let el = row[column];
    if (el !== player) {
      winVertical = false;
    }
  });
  let winLeftDiagonal = false;
  // Check แนวทะแยงเมื่อตารางอยู่ในรูปแบบ n*n
  // Check แนวทะแยงเอียงซ้าย => \
  if (rowNumber === columnNumber && row === column) {
    winLeftDiagonal = true;
    table.forEach((row, index) => {
      //console.log(`checkLD ${index} | ${index} value:${row[index]}`);
      // เข้าถึง element ในแนวทะแยงซ้าย โดยที่แนวทะแยงซ้ายจะมี row === column
      let el = row[index];
      if (el !== player) {
        winLeftDiagonal = false;
      }
    });
  }

  // Check แนวทะแยงเอียงขวา => /
  let winRightDiagonal = false;
  if (rowNumber === columnNumber && row + column === rowNumber - 1) {
    winRightDiagonal = true;
    table.forEach((row, index) => {
      //console.log(`checkRD ${index} | ${index} value:${row[index]}`);
      let el = row[columnNumber - (index + 1)];
      if (el !== player) {
        winRightDiagonal = false;
      }
    });
  }

  // เช็คว่าถูกเงื่อนไขไดเงื่อนไขหนึ่ง
  let isWining =
    winHorizontal || winVertical || winLeftDiagonal || winRightDiagonal;

  if (winHorizontal) {
    return {
      isWining: true,
      condition: 1,
    };
  } else if (winVertical) {
    return {
      isWining: true,
      condition: 2,
    };
  } else if (winLeftDiagonal) {
    return {
      isWining: true,
      condition: 3,
    };
  } else if (winRightDiagonal) {
    return {
      isWining: true,
      condition: 4,
    };
  }

  return {
    isWining: false,
    condition: 0,
  };
};

// check if you can win against the other player in this current position
exports.checkIfCanWin = (row, column, table, otherPlayer) => {
  //console.log(`consider ${row} | ${column} against player ${otherPlayer}`);
  let rowNumber = table.length;
  let columnNumber = table[0].length;
  // Check ว่าชนะเกมไหม
  //console.log(table);
  // Check แนวนอน
  let winHorizontal = true;
  table[row].forEach((el, index) => {
    // loop แต่ละ element ในแถวตนเอง
    //console.log(`checkH ${row} | ${index} value:${el}`);
    if (el === otherPlayer) {
      winHorizontal = false;
    }
  });
  // Check แนวดิ่ง
  let winVertical = true;
  table.forEach((row, index) => {
    //console.log(`checkV ${index} | ${column} value:${row[column]}`);
    // เข้าถึง element ในแถวที่ column นั้นๆ
    let el = row[column];
    if (el === otherPlayer) {
      winVertical = false;
    }
  });
  let winLeftDiagonal = false;
  // Check แนวทะแยงเมื่อตารางอยู่ในรูปแบบ n*n
  // Check แนวทะแยงเอียงซ้าย => \
  if (rowNumber === columnNumber && row === column) {
    winLeftDiagonal = true;
    table.forEach((row, index) => {
      //console.log(`checkD ${index} | ${index} value:${row[index]}`);
      // เข้าถึง element ในแนวทะแยงซ้าย โดยที่แนวทะแยงซ้ายจะมี row === column
      let el = row[index];
      if (el === otherPlayer) {
        winLeftDiagonal = false;
      }
    });
  }

  // Check แนวทะแยงเอียงขวา => /
  let winRightDiagonal = false;
  if (rowNumber === columnNumber && row + column === rowNumber - 1) {
    winRightDiagonal = true;
    table.forEach((row, index) => {
      //console.log(`checkD ${index} | ${index} value:${row[index]}`);
      let el = row[columnNumber - (index + 1)];
      if (el === otherPlayer) {
        winRightDiagonal = false;
      }
    });
  }
  return {
    canWinHorizontal: winHorizontal,
    canWinVertical: winVertical,
    canWinLeftDiagonal: winLeftDiagonal,
    canWinRightDiagonal: winRightDiagonal,
  };
};

// It weirdly behave ??
exports.renderWinningBoard = (row, column, styleTable, condition, player) => {
  const styleTableTemplate = styleTable;
  switch (condition) {
    case 1:
      styleTableTemplate[row].forEach((el, index) => {
        // loop แต่ละ element ในแถวตนเอง
        styleTableTemplate[row][index] = player === 1 ? `green-bg` : `red-bg`;
      });
      break;
    case 2:
      styleTableTemplate.forEach((row, index) => {
        //console.log(`checkV ${index} | ${column} value:${row[column]}`);
        // เข้าถึง element ในแถวที่ column นั้นๆ
        styleTableTemplate[index][column] =
          player === 1 ? `green-bg` : `red-bg`;
      });
      break;
    case 3:
      styleTableTemplate.forEach((row, index) => {
        //console.log(`checkD ${index} | ${index} value:${row[index]}`);
        // เข้าถึง element ในแนวทะแยงซ้าย โดยที่แนวทะแยงซ้ายจะมี row === column
        styleTableTemplate[index][index] = player === 1 ? `green-bg` : `red-bg`;
      });
      break;
    case 4:
      styleTableTemplate.forEach((row, index) => {
        //console.log(`checkD ${index} | ${index} value:${row[index]}`);
        styleTableTemplate[index][row.length - (index + 1)] =
          player === 1 ? `green-bg` : `red-bg`;
      });
      break;
    default:
      return styleTableTemplate;
    // code block
  }
  return styleTableTemplate;
};

exports.getUnmarkNeighbor = (row, column, table) => {
  // เช็คว่าตารางอยู่ในรูปแบบ n*n
  const neighbors = [];
  for (let i = row - 1; i <= row + 1; i++) {
    if (i < 0 || i >= table.length) continue;
    for (let j = column - 1; j <= column + 1; j++) {
      if ((i === row && j === column) || j < 0 || j >= table[0].length)
        continue;
      if (table[i][j] !== 0) continue;
      neighbors.push({
        row: i,
        column: j,
      });
    }
  }
  return neighbors;
};

exports.getUnmarkHorizontal = (row, column, table) => {
  let unmarkPositions = [];
  table[row].forEach((el, index) => {
    if (el === 0) {
      unmarkPositions.push({ row: row, column: index });
    }
  });
  return unmarkPositions;
};

exports.getUnmarkVertical = (row, column, table) => {
  let unmarkPositions = [];
  table.forEach((row, index) => {
    if (row[column] === 0) {
      unmarkPositions.push({ row: index, column: column });
    }
  });
  return unmarkPositions;
};

exports.getUnmarkLeftDiagonal = (row, column, table) => {
  let unmarkPositions = [];
  table.forEach((row, index) => {
    let el = row[index];
    if (el === 0) {
      unmarkPositions.push({ row: index, column: index });
    }
  });
  return unmarkPositions;
};

exports.getUnmarkRightDiagonal = (row, column, table) => {
  let unmarkPositions = [];
  table.forEach((row, index) => {
    let el = row[table[0].length - (index + 1)];
    if (el === 0) {
      unmarkPositions.push({
        row: index,
        column: table[0].length - (index + 1),
      });
    }
  });
  return unmarkPositions;
};

// return null หากไม่สามารถชนะเกมผ่านทิศนั้นได้
// return number จำนวนที่ทำให้ชนะ
exports.getUnmarkWinDistance = (row, column, table, direction, player) => {
  /*
  direction Clock-wise
  1:N
  2:NE
  3:E
  4:SE
  5:S
  6:SW
  7:W
  8:NE
  */

  const checkIfOutsideTable = (row, column, table) => {
    return (
      row >= table.length || column >= table[0].length || row < 0 || column < 0
    );
  };

  let distance = 0;
  let isWinable = true;
  let currentRow = row;
  let currentColumn = column;
  let value = null;
  // เช็คว่าตารางอยู่ในรูปแบบ n*n
  switch (direction) {
    case 1: // N
      //console.log(`check N`);
      currentRow = row - 1;
      do {
        if (checkIfOutsideTable(currentRow, currentColumn, table)) return null;
        //console.log(`check in ${currentRow}|${currentColumn} }`);
        value = table[currentRow][column];
        if (value !== player) {
          if (value === 0) {
            distance += 1;
          } else {
            return null;
          }
        }
        currentRow -= 1;
        // จบ loop หากเป็นแถวหรือหลักสุดท้าย
      } while (currentRow >= 0);
      break;
    case 2: // NE
      //console.log(`check NE`);
      currentRow = row - 1;
      currentColumn = column + 1;
      do {
        if (checkIfOutsideTable(currentRow, currentColumn, table)) return null;
        // ทิศทางนั้นไปไม่ได้
        //console.log(`check in ${currentRow}|${currentColumn} }`);
        value = table[currentRow][currentColumn];
        if (value !== player) {
          if (value === 0) {
            distance += 1;
          } else {
            return null;
          }
        }
        currentRow -= 1;
        currentColumn += 1;
        // จบ loop หากเป็นแถวหรือหลักสุดท้าย
      } while (currentRow >= 0 || currentColumn < table[0].length);
      break;
    case 3: // E
      //console.log(`check E`);
      currentColumn = column + 1;
      do {
        if (checkIfOutsideTable(currentRow, currentColumn, table)) return null;
        // ทิศทางนั้นไปไม่ได้
        //console.log(`check in ${currentRow}|${currentColumn} }`);
        value = table[row][currentColumn];
        if (value !== player) {
          if (value === 0) {
            distance += 1;
          } else {
            return null;
          }
        }
        currentColumn += 1;
        // จบ loop หากเป็นแถวหรือหลักสุดท้าย
      } while (currentColumn < table[0].length);
      break;
    case 4: // SE
      //console.log(`check SE`);
      currentRow = row + 1;
      currentColumn = column + 1;
      do {
        if (checkIfOutsideTable(currentRow, currentColumn, table)) return null;
        // ทิศทางนั้นไปไม่ได้
        //console.log(`check in ${currentRow}|${currentColumn} }`);
        value = table[currentRow][currentColumn];
        if (value !== player) {
          if (value === 0) {
            distance += 1;
          } else {
            return null;
          }
        }
        currentRow += 1;
        currentColumn += 1;
        // จบ loop หากเป็นแถวหรือหลักสุดท้าย
      } while (currentRow < table.length || currentColumn < table[0].length);
      break;
    case 5: // S
      //console.log(`check S`);
      currentRow = row + 1;
      do {
        if (checkIfOutsideTable(currentRow, currentColumn, table)) return null;
        // ทิศทางนั้นไปไม่ได้
        //console.log(`check in ${currentRow}|${currentColumn} }`);
        value = table[currentRow][column];
        if (value !== player) {
          if (value === 0) {
            distance += 1;
          } else {
            return null;
          }
        }
        currentRow += 1;
        // จบ loop หากเป็นแถวหรือหลักสุดท้าย
      } while (currentRow < table.length);
      break;
    case 6: // SW
      //console.log(`check SW`);
      currentRow = row + 1;
      currentColumn = column - 1;
      do {
        // ทิศทางนั้นไปไม่ได้
        if (checkIfOutsideTable(currentRow, currentColumn, table)) return null;
        //console.log(`check in ${currentRow}|${currentColumn} }`);
        value = table[currentRow][currentColumn];
        if (value !== player) {
          if (value === 0) {
            distance += 1;
          } else {
            return null;
          }
        }
        currentRow += 1;
        currentColumn -= 1;
        // จบ loop หากเป็นแถวหรือหลักสุดท้าย
      } while (currentRow < table.length || currentColumn >= 0);
      break;
    case 7: // W
      //console.log(`check W`);
      currentColumn = column - 1;
      do {
        // ทิศทางนั้นไปไม่ได้
        if (checkIfOutsideTable(currentRow, currentColumn, table)) return null;
        //console.log(`check in ${currentRow}|${currentColumn} }`);
        value = table[row][currentColumn];
        if (value !== player) {
          if (value === 0) {
            distance += 1;
          } else {
            return null;
          }
        }
        currentColumn -= 1;
        // จบ loop หากเป็นแถวหรือหลักสุดท้าย
      } while (currentColumn >= 0);
      break;
    case 8: // NW
      //console.log(`check NW`);
      currentRow = row - 1;
      currentColumn = column - 1;
      do {
        // ทิศทางนั้นไปไม่ได้
        if (checkIfOutsideTable(currentRow, currentColumn, table)) return null;
        //console.log(`check in ${currentRow}|${currentColumn}`);
        value = table[currentRow][currentColumn];
        if (value !== player) {
          if (value === 0) {
            distance += 1;
          } else {
            return null;
          }
        }
        currentRow -= 1;
        currentColumn -= 1;
        // จบ loop หากเป็นแถวหรือหลักสุดท้าย
      } while (currentRow >= 0 || currentColumn >= 0);
      break;

    default:
      return null;
    // code block
  }
  return distance;
};
