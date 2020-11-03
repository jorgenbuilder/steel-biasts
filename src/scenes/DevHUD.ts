export default class DevHUD extends Phaser.Scene {

    private playerPos: Phaser.GameObjects.Text;
    private pX: number = 0;
    private pY: number = 0;
    private fX: number = 0;
    private fY: number = 0;
    
    constructor (conf: Phaser.Types.Scenes.SettingsConfig) {
        super({key: 'UIScene', active: true});
    }

    preload () {
        //
    }

    create () {
        this.playerPos = this.add.text(10, 10, this.playerText(), {font: '24px sans-serif', fill: '#fff'});
        this.scene.get('GameScene').events.on('playerMove', (x: number, y: number, fX: number, fY: number) => {
            this.pX = Math.floor(x);
            this.pY = Math.floor(y);
            this.fX = Math.floor(fX);
            this.fY = Math.floor(fY);
            this.updatePlayerText();
        })
    }

    playerText(): string {
        return `
        Player (${this.pX}, ${this.pY})
        Floor (${this.fX}, ${this.fY})
        `
    }

    updatePlayerText(): void {
        this.playerPos.setText(this.playerText());
    }
}