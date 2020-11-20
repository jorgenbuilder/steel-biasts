import FontDinobyte from 'assets/fonts/dbyte.png';
import FontDinobyteData from 'assets/fonts/dbyte.fnt';

export interface DevData {
    pX: number;
    pY: number;
    pSpawning: boolean;
    pTeleporting: boolean;
    location: string;
    emitter: string;
    hovering: boolean;
    buttonX: number;
    buttonY: number;
}

export default class DevHUD extends Phaser.Scene {

    private debugText: Phaser.GameObjects.BitmapText;
    private devData: Partial<DevData> = {}
    private recentEmitters: {
        emitter: string;
        timestamp: number;
    }[] = [];
    
    constructor () {
        super('DevHUD');
    }
    
    preload () {
        this.load.bitmapFont('dbyte', FontDinobyte, FontDinobyteData);
    }

    create () {
        this.debugText = this.add.bitmapText(0, 0, 'dbyte', this.text()).setOrigin(0);
        this.scene.get('GameWorldScene').events.on('devData', (d: Partial<DevData>) => this.capture(d));
    }

    capture (data: Partial<DevData>) {
        this.recentEmitters = this.recentEmitters.filter(x => Date.now() - x.timestamp < 100);
        if (data.emitter) {
            if (!this.recentEmitters.some(x => x.emitter === data.emitter)) {
                this.recentEmitters.push({emitter: data.emitter, timestamp: Date.now()});
                this.recentEmitters = this.recentEmitters.sort((a, b) => a.emitter > b.emitter ? 1 : -1);
            }
        }
        //@ts-ignore
        Object.keys(data).forEach(k => this.devData[k] = data[k]);
        this.updateText();
    }

    text(): string {
        return `
        Location: ${this.devData.location}
        Player Coords: ${Math.floor(this.devData.pX)}, ${Math.floor(this.devData.pY)}
        Player Spawning: ${this.devData.pSpawning}
        Player Teleporting: ${this.devData.pTeleporting}
        Emitters: ${this.recentEmitters.map(x => x.emitter).join(', ')}
        FPS: ${Math.floor(this.game.loop.actualFps)}
        Hovering: ${this.devData.hovering}
        Button X: ${this.devData.buttonX}
        Button Y: ${this.devData.buttonY}
        `.replace(/(  )+/g, '');
    }

    updateText(): void {
        this.debugText.setText(this.text());
    }
}