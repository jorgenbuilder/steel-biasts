export interface DevData {
    pX: number;
    pY: number;
    pSpawning: boolean;
    location: string;
}

export default class DevHUD extends Phaser.Scene {

    private playerPos: Phaser.GameObjects.Text;
    private pX: number = 0;
    private pY: number = 0;
    private pSpawning: boolean = false;
    private location: string = '';
    
    constructor () {
        super('DevHUD');
    }

    preload () {
        //
    }

    create () {
        this.playerPos = this.add.text(0, 0, this.playerText(), {font: '12px monospace', fill: '#fff'});
        this.scene.get('GameWorldScene').events.on('devData', (data: Partial<DevData>) => {
            // @ts-ignore
            Object.keys(data).forEach(k => this[k] = data[k]);
            this.updatePlayerText();
        });
    }

    playerText(): string {
        return `
        Location: ${this.location}
        Player Coords: ${Math.floor(this.pX)}, ${Math.floor(this.pY)}
        Player Spawning: ${this.pSpawning}
        `
    }

    updatePlayerText(): void {
        this.playerPos.setText(this.playerText());
    }
}