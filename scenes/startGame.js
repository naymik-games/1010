class startGame extends Phaser.Scene {
  constructor() {
    super("startGame");
  }
  preload() {
    //this.load.bitmapFont('atari', 'assets/fonts/atari-smooth.png', 'assets/fonts/atari-smooth.xml');
    // this.load.bitmapFont('atari', 'assets/fonts/Lato_0.png', 'assets/fonts/lato.xml');

  }
  create() {

    gameData = JSON.parse(localStorage.getItem('1010save'));
    if (gameData === null || gameData.length <= 0) {
      localStorage.setItem('1010save', JSON.stringify(defaultValues));
      gameData = defaultValues;
    }

    this.cameras.main.setBackgroundColor(0x000000);

    //var title = this.add.bitmapText(game.config.width / 2, 100, 'topaz', 'SquareDots', 150).setOrigin(.5).setTint(0xc76210);
    // this.title = this.add.text(game.config.width / 2, 200, '1010', { fontFamily: 'PixelFont', fontSize: '220px', color: '#ED6424', align: 'center' }).setOrigin(.5)
    this.logo = this.add.image(game.config.width / 2, 200, 'logo2').setScale(1.5)

    var startTime = this.add.text(game.config.width / 2, 475, 'PLAY', { fontFamily: 'PixelFont', fontSize: '220px', color: '#fafafa', align: 'center' }).setOrigin(.5)
    startTime.setInteractive();
    startTime.on('pointerdown', this.clickHandler, this);

    this.lineLabelText = this.add.text(225, 675, 'CLEARED', { fontFamily: 'PixelFont', fontSize: '100px', color: '#fa0000', align: 'center' }).setOrigin(.5)
    this.lineText = this.add.text(225, 800, gameData.linesCleared, { fontFamily: 'PixelFont', fontSize: '100px', color: '#fafafa', align: 'center' }).setOrigin(.5)

    this.scoreLabelText = this.add.text(675, 675, 'SCORE', { fontFamily: 'PixelFont', fontSize: '100px', color: '#fa0000', align: 'center' }).setOrigin(.5)
    this.scoreText = this.add.text(675, 800, gameData.highScore, { fontFamily: 'PixelFont', fontSize: '100px', color: '#fafafa', align: 'center' }).setOrigin(.5)


    this.clearDataText = this.add.text(game.config.width / 2, 1550, 'RESET DATA', { fontFamily: 'PixelFont', fontSize: '75px', color: '#fa0000', align: 'center' }).setOrigin(.5).setInteractive()
    this.clearDataText.on('pointerdown', function () {

      this.clearDataText.setText('DATA CLEARED')
      this.lineText.setText(0)
      this.scoreText.setText(0)
      localStorage.removeItem('1010save');
      localStorage.setItem('1010save', JSON.stringify(defaultValues));
      gameData = defaultValues;
    }, this)

  }
  clickHandler() {

    this.scene.start('playGame');
    this.scene.launch('UI');
  }

}