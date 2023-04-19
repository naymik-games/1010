let game;

let upcomingKey
//stores shapes
var bag = [];
//index for shapes in the bag
var bagIndex = 0;
//Used to help create a seeded generated random number for choosing shapes. makes results deterministic (reproducible) for debugging
var rndSeed = 1;
let times
let nextTimes = 2
var upcomingShape;
//Block shapes
var shapes = {
  A: [[1, 1, 1, 1, 1]],
  B: [[2, 2, 2]],
  C: [[3, 3]],
  D: [[4]],
  E: [[5, 5, 5], [0, 0, 5], [0, 0, 5]],
  F: [[6, 0], [6, 6]],
  G: [[7, 7], [7, 7]],
  H: [[8, 8, 8], [8, 8, 8], [8, 8, 8]],
  I: [[0, 9, 0], [9, 9, 9]],
  J: [[10, 10, 0], [0, 10, 10]],
  K: [[11, 11, 11, 11]],
  L: [[0, 0, 12], [12, 12, 12]],

};

shapesFrame = {
  A: 0,
  B: 1,
  C: 2,
  D: 3,
  E: 4,
  F: 5,
  G: 6,
  H: 7,
  I: 8,
  J: 9,
  K: 10,
  L: 11

};
var currentShape = { x: -5, y: -5, prevX: -5, prevY: -5, shape: undefined };
//Block colors
var colors = [0xF92338, 0xC973FF, 0x1C76BC, 0xFEE356, 0x53D504, 0x36E0FF, 0xF8931D, 0xF92338];

window.onload = function () {
  let gameConfig = {
    type: Phaser.AUTO,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      parent: "thegame",
      width: 900,
      height: 1640
    },

    scene: [preloadGame, startGame, playGame, UI]
  }
  game = new Phaser.Game(gameConfig);
  window.focus();
}
/////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////
class playGame extends Phaser.Scene {
  constructor() {
    super("playGame");
  }
  preload() {


  }
  create() {
    rndSeed = Phaser.Math.Between(1, 10)
    this.height = 10
    this.width = 10
    this.totalCleared = 0
    this.score = 0
    this.rotateTurn = false

    this.cameras.main.setBackgroundColor(0x000000);

    gameOptions.boardOffset.x = (game.config.width - (this.width * gameOptions.gemSize)) / 2

    this.generateBag()
    //console.log(bag)
    this.header = this.add.image(gameOptions.boardOffset.x - 1, gameOptions.boardOffset.y - 1, 'blank').setOrigin(0).setTint(0x000000).setAlpha(1);//0xB2BABB 
    this.header.displayWidth = (gameOptions.gemSize * this.width) + 2
    this.header.displayHeight = (gameOptions.gemSize * this.height) + 2;





    //main grid
    this.gameArray = [];

    for (let i = 0; i < this.height; i++) {
      this.gameArray[i] = [];
      for (let j = 0; j < this.width; j++) {
        //let randomValue = Math.floor(Math.random() * this.items);
        this.gameArray[i][j] = { row: i, column: j, value: 0, empty: true, sprite: null }
      }
    }
    for (let i = 0; i < this.height; i++) {
      for (let j = 0; j < this.width; j++) {
        let posX = gameOptions.boardOffset.x + gameOptions.gemSize * j + gameOptions.gemSize / 2;
        let posY = gameOptions.boardOffset.y + gameOptions.gemSize * i + gameOptions.gemSize / 2
        let gem = this.add.sprite(posX, posY, "tiles", 0).setInteractive({ dropZone: true });//.setTint(dotAllColors[this.draw3.valueAt(i, j)]);
        gem.displayWidth = gameOptions.gemSize
        gem.displayHeight = gameOptions.gemSize
        this.gameArray[i][j].sprite = gem
      }
    }
    //preview grid
    this.previewArray = []


    for (let i = 0; i < this.height; i++) {
      this.previewArray[i] = [];
      for (let j = 0; j < this.width; j++) {
        //let randomValue = Math.floor(Math.random() * this.items);
        this.previewArray[i][j] = { row: i, column: j, value: 0, empty: true, sprite: null }
      }
    }
    for (let i = 0; i < this.height; i++) {
      for (let j = 0; j < this.width; j++) {
        let posX = gameOptions.boardOffset.x + gameOptions.gemSize * j + gameOptions.gemSize / 2;
        let posY = gameOptions.boardOffset.y + gameOptions.gemSize * i + gameOptions.gemSize / 2
        let gem = this.add.sprite(posX, posY, "tilesPreview", 0);//.setTint(dotAllColors[this.draw3.valueAt(i, j)]);
        gem.displayWidth = gameOptions.gemSize
        gem.displayHeight = gameOptions.gemSize

        this.previewArray[i][j].sprite = gem
      }
    }


    var scale = (gameOptions.gemSize / gameOptions.gemFrameSize) * 4
    this.player = this.add.image(game.config.width / 2, 1400, 'shape_sheet', 0).setInteractive().setScale(scale).setTint(colorArray[0]);
    this.input.setDraggable(this.player);
    this.playerNext = this.add.image(game.config.width / 2 + 325, 1500, 'shape_sheet', 0).setInteractive().setScale(2).setTint(colorArray[0]);
    this.nextShape()


    this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
      // dragX = Phaser.Math.Snap.To(dragX, 100, gameOptions.boardOffset.x);
      // dragY = Phaser.Math.Snap.To(dragY, 100, gameOptions.boardOffset.y);

      gameObject.x = dragX;
      gameObject.y = dragY;
      //gameObject.text.x = dragX;
      //gameObject.text.y = dragY;
    }, this)
    this.input.on('dragenter', function (pointer, gameObject, target) {

      gameObject.setAlpha(0)
      /*  let row = Math.floor((pointer.y - gameOptions.boardOffset.y) / gameOptions.gemSize);
       let col = Math.floor((pointer.x - gameOptions.boardOffset.x) / gameOptions.gemSize);
       // console.log('row ' + row + ', col ' + col)
       currentShape.x = col
       currentShape.y = row */

    }, this)
    this.placed = false
    this.input.on('dragover', function (pointer, gameObject, target) {
      this.removeShape('preview')
      // this.removeShape('main')
      //tatget.setTint(0xff0000)
      let row = Math.floor((pointer.y - gameOptions.boardOffset.y) / gameOptions.gemSize);
      let col = Math.floor((pointer.x - gameOptions.boardOffset.x) / gameOptions.gemSize);
      //   console.log('row ' + row + ', col ' + col)
      currentShape.prevX = col
      currentShape.prevY = row
      currentShape.x = col
      currentShape.y = row
      this.applyShape('preview')
      if (this.collides()) {
        this.previewCollides()
      } else {
        this.previewDoesntCollides()
      }
    }, this)

    this.input.on('dragleave', function (pointer, gameObject, target) {
      gameObject.setAlpha(1)


    })

    this.input.on('drop', function (pointer, gameObject, target) {
      if (this.collides()) {
        currentShape.x = currentShape.prevX
        currentShape.y = currentShape.prevY
        this.removeShape('preview')
        this.placed = false
      } else {
        //this.applyShape('preview')
        this.applyShape('main')
        this.removeShape('preview')
        //currentShape.prevX = col
        //currentShape.prevY = row
        this.placed = true
      }
      //  this.dropTile(gameObject, target)
      // this.applyShape()
      if (this.placed) {
        gameObject.x = gameObject.input.dragStartX;
        gameObject.y = gameObject.input.dragStartY;
        gameObject.setAlpha(1)
        this.score += this.getScore()
        this.events.emit('score');

        this.checkBoard()
        this.nextShape()
      } else {
        gameObject.x = gameObject.input.dragStartX;
        gameObject.y = gameObject.input.dragStartY;
        gameObject.setAlpha(1)
      }

    }, this)

  }
  update() {

  }
  getScore() {
    var temp = 0
    for (var row = 0; row < currentShape.shape.length; row++) {
      for (var col = 0; col < currentShape.shape[row].length; col++) {
        //if its not empty
        if (currentShape.shape[row][col] !== 0) {
          //if it collides, return true
          temp++
        }
      }
    }
    return temp
  }
  previewCollides() {
    for (var row = 0; row < currentShape.shape.length; row++) {
      for (var col = 0; col < currentShape.shape[row].length; col++) {
        if (currentShape.shape[row][col] !== 0) {
          if (this.validPick(currentShape.y + row, currentShape.x + col)) {
            this.previewArray[currentShape.y + row][currentShape.x + col].sprite.setAlpha(.4)
          }

        }
      }
    }
  }
  previewDoesntCollides() {
    for (var row = 0; row < currentShape.shape.length; row++) {
      for (var col = 0; col < currentShape.shape[row].length; col++) {
        if (currentShape.shape[row][col] !== 0) {
          if (this.validPick(currentShape.y + row, currentShape.x + col)) {
            this.previewArray[currentShape.y + row][currentShape.x + col].sprite.setAlpha(1)
          }

        }
      }
    }
  }
  applyShape(type) {
    //for each value in the current shape (row x column)
    for (var row = 0; row < currentShape.shape.length; row++) {
      for (var col = 0; col < currentShape.shape[row].length; col++) {
        //if its non-empty
        if (currentShape.shape[row][col] !== 0) {
          //set the value in the grid to its value. Stick the shape in the grid!
          if (this.validPick(currentShape.y + row, currentShape.x + col)) {
            if (type == 'preview') {
              this.previewArray[currentShape.y + row][currentShape.x + col].sprite.setFrame(1).setTint(colorArray[currentShape.shape[row][col] - 1])
              this.previewArray[currentShape.y + row][currentShape.x + col].value = currentShape.shape[row][col]
            } else {
              this.gameArray[currentShape.y + row][currentShape.x + col].sprite.setFrame(1).setTint(colorArray[currentShape.shape[row][col] - 1])
              this.gameArray[currentShape.y + row][currentShape.x + col].value = currentShape.shape[row][col]
            }

          }

        }
      }
    }
  }
  removeShape(type) {
    for (var row = 0; row < currentShape.shape.length; row++) {
      for (var col = 0; col < currentShape.shape[row].length; col++) {
        if (currentShape.shape[row][col] !== 0) {
          if (this.validPick(currentShape.prevY + row, currentShape.prevX + col)) {
            if (type == 'preview') {
              this.previewArray[currentShape.prevY + row][currentShape.prevX + col].sprite.setFrame(0).clearTint();
              this.previewArray[currentShape.prevY + row][currentShape.prevX + col].value = 0
            } else {
              this.gameArray[currentShape.prevY + row][currentShape.prevX + col].sprite.setFrame(0).clearTint();
              this.gameArray[currentShape.prevY + row][currentShape.prevX + col].value = 0
            }

          }

        }
      }
    }
  }
  nextShape() {

    bagIndex += 1;
    //if we're at the start or end of the bag
    if (bag.length === 0 || bagIndex == bag.length) {
      //generate a new bag of genomes
      this.generateBag();
    }
    //if almost at end of bag
    if (bagIndex == bag.length - 1) {
      //store previous seed
      var prevSeed = rndSeed;
      //generate upcoming shape
      upcomingShape = randomProperty(shapes);
      upcomingKey = randomKey(shapes)
      //set random seed
      rndSeed = prevSeed;
    } else {
      //get the next shape from our bag
      upcomingShape = shapes[bag[bagIndex + 1]];
      upcomingKey = bag[bagIndex + 1]
    }
    console.log(upcomingShape)
    console.log(upcomingKey)
    //get our current shape from the bag
    currentShape.shape = shapes[bag[bagIndex]];
    //define its position

    times = nextTimes
    currentShape.shape = rotate(currentShape.shape, times);
    currentShape.x = -5
    currentShape.y = -5
    currentShape.prevX = -5
    currentShape.prevY = -5
    this.player.angle = 90 * times;
    this.player.setFrame(shapesFrame[bag[bagIndex]]).setTint(colorArray[shapesFrame[bag[bagIndex]]])
    this.player.setPosition(game.config.width / 2, 1400)
    this.playerNext.setFrame(shapesFrame[upcomingKey]).setTint(colorArray[shapesFrame[upcomingKey]])
    this.rotateTurn = false
    console.log(this.checkForMoves())
    if (!this.checkForMoves()) {
      this.events.emit('end');
      this.player.disableInteractive()
      if (this.totalCleared > gameData.linesCleared) {
        gameData.linesCleared = this.totalCleared
      }
      if (this.score > gameData.highScore) {
        gameData.highScore = this.score
      }
      localStorage.setItem('1010save', JSON.stringify(gameData));

      let timedEvent = this.time.addEvent({
        delay: 4000,
        callbackScope: this,
        callback: function () {
          this.scene.stop()
          this.scene.stop('UI')
          this.scene.start('startGame');
        }
      });
      /* this.scene.stop()
      this.scene.stop('UI')
      this.scene.start('startGame'); */
    }
    nextTimes = Phaser.Math.Between(0, 3)
    this.playerNext.angle = 90 * nextTimes;
  }
  rotateShape() {
    if (!this.rotateTurn) {
      this.score -= 10
      this.events.emit('score');
      this.rotateTurn = true
    }
    currentShape.shape = rotate(currentShape.shape, 1);
    this.player.angle += 90 * 1;
  }
  switchShapes() {
    var temp = currentShape.shape

    currentShape.shape = upcomingShape
    upcomingShape = temp
    this.player.setFrame(shapesFrame[upcomingKey]).setTint(colorArray[shapesFrame[upcomingKey]])
    this.player.angle = 90 * nextTimes;

    this.playerNext.setFrame(shapesFrame[bag[bagIndex]]).setTint(colorArray[shapesFrame[bag[bagIndex]]])
    this.playerNext.angle = 90 * times;
    var temp2 = bagIndex
    bagIndex = upcomingKey
    upcomingKey = temp2

  }
  checkBoard() {
    var rows = this.checkRows()
    var cols = this.checkCols()
    //console.log('rows ' + rows.length + ' cols ' + cols.length)
    //add rows,cols to tally
    this.totalCleared += rows.length + cols.length;
    this.events.emit('lines');
    //if clear row and col, bonus multiplier
    if (rows.length > 0 && cols.length > 0) {
      var mult = 50
    } else {
      var mult = 10
    }
    //add number of rows and cols by multiplier and add to score
    this.score += (rows.length + cols.length) * mult
    this.events.emit('score');
    // console.log(rows)
    if (rows.length > 0) {
      this.clearRows(rows)
    }
    //  console.log(cols)
    if (cols.length > 0) {
      this.clearCols(cols)
    }
  }
  clearRows(rows) {
    console.log(rows)
    var temp = []
    for (var r = 0; r < rows.length; r++) {
      for (var c = 0; c < this.width; c++) {
        temp.push({ r: rows[r], c: c })


      }
    }

    temp.forEach(function (gem) {
      this.gameArray[gem.r][gem.c].value = 0
      var sprite = this.gameArray[gem.r][gem.c].sprite
      this.tweens.add({
        targets: sprite,
        alpha: 0,
        duration: 500,
        // onCompleteScope: this,
        onComplete: function () {
          // console.log(r + ' ' + c)
          sprite.setFrame(0).clearTint().setAlpha(1);

        }
      })
    }.bind(this))





  }
  clearCols(cols) {
    var temp = []
    for (var c = 0; c < cols.length; c++) {
      for (var r = 0; r < this.height; r++) {
        temp.push({ r: r, c: cols[c] })

      }
    }

    temp.forEach(function (gem) {
      this.gameArray[gem.r][gem.c].value = 0
      var sprite = this.gameArray[gem.r][gem.c].sprite
      this.tweens.add({
        targets: sprite,
        alpha: 0,
        duration: 500,
        // onCompleteScope: this,
        onComplete: function () {
          // console.log(r + ' ' + c)
          sprite.setFrame(0).clearTint().setAlpha(1);

        }
      })
    }.bind(this))



  }
  checkCols() {
    var colsToClear = [];
    //for each row in the grid
    for (var col = 0; col < this.height; col++) {
      var containsEmptySpace = false;
      //for each column
      for (var row = 0; row < this.width; row++) {
        //if its empty
        if (this.gameArray[row][col].value === 0) {
          //set this value to true
          containsEmptySpace = true;
        }
      }
      //if none of the columns in the row were empty
      if (!containsEmptySpace) {
        //add the row to our list, it's completely filled!
        colsToClear.push(col);


      }
    }
    return colsToClear
  }
  checkRows() {
    var rowsToClear = [];
    //for each row in the grid
    for (var row = 0; row < this.height; row++) {
      var containsEmptySpace = false;
      //for each column
      for (var col = 0; col < this.width; col++) {
        //if its empty
        if (this.gameArray[row][col].value === 0) {
          //set this value to true
          containsEmptySpace = true;
        }
      }
      //if none of the columns in the row were empty
      if (!containsEmptySpace) {
        //add the row to our list, it's completely filled!
        rowsToClear.push(row);


      }
    }
    return rowsToClear
  }
  collides(scene, object) {
    //for the size of the shape (row x column)
    for (var row = 0; row < currentShape.shape.length; row++) {
      for (var col = 0; col < currentShape.shape[row].length; col++) {
        //if its not empty
        if (currentShape.shape[row][col] !== 0) {
          //if it collides, return true
          if (this.gameArray[currentShape.y + row] === undefined || this.gameArray[currentShape.y + row][currentShape.x + col] === undefined || this.gameArray[currentShape.y + row][currentShape.x + col].value !== 0) {
            return true;
          }
        }
      }
    }
    return false;
  }
  collidesCustom(r, c, scene, object) {
    //for the size of the shape (row x column)
    var doesCollide = 0
    var testShape = clone(currentShape.shape)
    for (var row = 0; row < testShape.length; row++) {
      for (var col = 0; col < testShape[row].length; col++) {
        //if its not empty
        if (testShape[row][col] !== 0) {
          //if it collides, return true
          if (this.gameArray[r + row] === undefined || this.gameArray[r + row][c + col] === undefined || this.gameArray[r + row][c + col].value !== 0) {
            return true
          }
        }
      }
    }
    return false
  }
  validPick(row, column) {
    return row >= 0 && row < this.height && column >= 0 && column < this.width && this.gameArray[row] != undefined && this.gameArray[row][column] != undefined;
  }
  randomProperty(obj) {
    var keys = Object.keys(obj);
    //return obj[keys[keys.length * Math.random() << 0]];
    return keys[keys.length * Math.random() << 0];
  };
  generateBag() {
    bag = [];
    var contents = "";
    //7 shapes
    for (var i = 0; i < 12; i++) {
      //generate shape randomly
      var shape = randomKey(shapes);
      while (contents.indexOf(shape) != -1) {
        shape = randomKey(shapes);
      }
      //update bag with generated shape
      bag[i] = shape;
      contents += shape;
    }
    //reset bag index
    bagIndex = 0;
  }
  checkForMoves() {
    var yes = 0
    var no = 0
    for (var r = 0; r < this.height; r++) {
      for (var c = 0; c < this.width; c++) {
        if (this.collidesCustom(r, c)) {
          yes++
        } else {
          no++
        }
      }
    }
    if (no == 0) {
      return false
    } else {
      return true
    }

  }
  checkForMoves_() {
    for (var r = 0; r < this.height; r++) {
      for (var c = 0; c < this.width; c++) {
        //this.gameArray[r][c].sprite.setFrame(0).clearTint();
        for (var row = 0; row < currentShape.shape.length; row++) {
          for (var col = 0; col < currentShape.shape[row].length; col++) {
            //if its non-empty
            if (currentShape.shape[row][col] !== 0) {
              //set the value in the grid to its value. Stick the shape in the grid!
              if (this.validPick(r + row, c + col)) {
                return true
              }

            }
          }
        }
      }
    }
  }

  addScore() {
    this.events.emit('score');
  }
}


/**
 * Clones an object.
 * @param  {Object} obj The object to clone.
 * @return {Object}     The cloned object.
 */
function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}


/**
 * Returns a random property from the given object.
 * @param  {Object} obj The object to select a property from.
 * @return {Property}     A random property.
 */
function randomProperty(obj) {
  return (obj[randomKey(obj)]);
}

/**
* Returns a random property key from the given object.
* @param  {Object} obj The object to select a property key from.
* @return {Property}     A random property key.
*/
function randomKey(obj) {
  var keys = Object.keys(obj);
  var i = seededRandom(0, keys.length);
  return keys[i];
}

function replaceAll(target, search, replacement) {
  return target.replace(new RegExp(search, 'g'), replacement);
}

/**
* Returns a random number that is determined from a seeded random number generator.
* @param  {Number} min The minimum number, inclusive.
* @param  {Number} max The maximum number, exclusive.
* @return {Number}     The generated random number.
*/
function seededRandom(min, max) {
  max = max || 1;
  min = min || 0;

  rndSeed = (rndSeed * 9301 + 49297) % 233280;
  var rnd = rndSeed / 233280;

  return Math.floor(min + rnd * (max - min));
}

//for rotating a shape, how many times should we rotate
function rotate(matrix, times) {
  //for each time
  for (var t = 0; t < times; t++) {
    //flip the shape matrix
    matrix = transpose(matrix);
    //and for the length of the matrix, reverse each column
    for (var i = 0; i < matrix.length; i++) {
      matrix[i].reverse();
    }
  }
  return matrix;
}
//flip row x column to column x row
function transpose(array) {
  return array[0].map(function (col, i) {
    return array.map(function (row) {
      return row[i];
    });
  });
}
