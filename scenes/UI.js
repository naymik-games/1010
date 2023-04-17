class UI extends Phaser.Scene {

  constructor() {

    super("UI");
  }
  preload() {



  }
  create() {
    this.Main = this.scene.get('playGame');
    /*     this.header = this.add.image(game.config.width / 2, 0, 'blank').setOrigin(.5, 0).setTint(0x3e5e71);
        this.header.displayWidth = 870;
        this.header.displayHeight = 125; */


    this.score = 0;
    this.lineLabelText = this.add.text(85, 50, 'L: ' + gameData.linesCleared, { fontFamily: 'PixelFont', fontSize: '80px', color: '#fa0000', align: 'left' }).setOrigin(0, .5)
    this.lineText = this.add.text(85, 125, 0, { fontFamily: 'PixelFont', fontSize: '170px', color: '#fafafa', align: 'left' }).setOrigin(0, .5)

    //this.lineText = this.add.bitmapText(85, 100, 'topaz', 0, 80).setOrigin(.5).setTint(0xfafafa).setAlpha(1);
    this.scoreLabelText = this.add.text(500, 50, 'S: ' + gameData.highScore, { fontFamily: 'PixelFont', fontSize: '80px', color: '#fa0000', align: 'left' }).setOrigin(0, .5)
    this.scoreText = this.add.text(500, 125, this.score, { fontFamily: 'PixelFont', fontSize: '170px', color: '#fafafa', align: 'left' }).setOrigin(0, .5)

    //this.scoreText = this.add.bitmapText(285, 100, 'topaz', this.score, 80).setOrigin(0, .5).setTint(0xfafafa).setAlpha(1);
    this.gameOverText = this.add.text(game.config.width / 2, 250, 'GAME OVER', { fontFamily: 'PixelFont', fontSize: '170px', color: '#ff0000', align: 'center' }).setOrigin(.5).setAlpha(0)



    this.rotateButton = this.add.image(75, game.config.height - 75, 'rotate').setInteractive()
    this.rotateButton.on('pointerdown', function () {
      this.Main.rotateShape()
    }, this)

    this.skipButton = this.add.image(75, game.config.height - 200, 'skip').setInteractive()
    this.skipButton.on('pointerdown', function () {
      this.Main.totalCleared -= 5
      this.lineText.setText(this.Main.totalCleared)
      this.Main.nextShape()
    }, this)

    this.homeButton = this.add.image(75, game.config.height - 325, 'home').setInteractive()
    this.homeButton.on('pointerdown', function () {
      this.scene.stop()
      this.scene.stop('playGame')
      this.scene.start('startGame');
    }, this)

    /*  this.switchButton = this.add.image(75, game.config.height - 325, 'switch').setInteractive()
     this.switchButton.on('pointerdown', function () {
       this.Main.switchShapes()
     }, this) */

    this.Main.events.on('lines', function () {
      //console.log('dots ' + string)
      this.lineText.setText(this.Main.totalCleared)
    }, this);
    this.Main.events.on('score', function () {
      //console.log('dots ' + string)
      this.scoreText.setText(this.Main.score)
    }, this);
    this.Main.events.on('end', function () {
      //console.log('dots ' + string)
      this.gameOverText.setAlpha(1)
    }, this);

  }

  update() {

  }



}