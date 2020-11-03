export interface DevData {
    pX: number;
    pY: number;
    pSpawning: boolean;
}

export default class DevHUD extends Phaser.Scene {

    private playerPos: Phaser.GameObjects.Text;
    private pX: number = 0;
    private pY: number = 0;
    private pSpawning: boolean = false;
    
    constructor () {
        super('DevHUD');
    }

    preload () {
        //
    }

    create () {
        this.playerPos = this.add.text(10, 10, this.playerText(), {font: '24px sans-serif', fill: '#fff'});
        this.scene.get('GameWorldScene').events.on('devData', (data: DevData) => {
            // @ts-ignore
            Object.keys(data).forEach(k => this[k] = data[k]);
            this.updatePlayerText();
        })
    }

    playerText(): string {
        return `
        Player Coords: ${Math.floor(this.pX)}, ${Math.floor(this.pY)}
        Player Spawning: ${this.pSpawning}
        `
    }

    updatePlayerText(): void {
        this.playerPos.setText(this.playerText());
    }
}