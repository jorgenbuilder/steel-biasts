import FontDinobyte from 'assets/fonts/dbyte.png';
import FontDinobyteData from 'assets/fonts/dbyte.fnt';

export interface DevData {
    pX: number;
    pY: number;
    pSpawning: boolean;
    pTeleporting: boolean;
    location: string;
    emitter: string;
}

export default class DevHUD extends Phaser.Scene {

    private debugText: Phaser.GameObjects.BitmapText;
    private pX: number = 0;
    private pY: number = 0;
    private pSpawning: boolean = false;
    private pTeleporting: boolean = false;
    private location: string = '';
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
            }
        }
        //@ts-ignore
        Object.keys(data).forEach(k => this[k] = data[k]);
        this.updateText();
    }

    text(): string {
        return `Location: ${this.location}
Player Coords: ${Math.floor(this.pX)}, ${Math.floor(this.pY)}
Player Spawning: ${this.pSpawning}
Player Teleporting: ${this.pTeleporting}
Emitters: ${this.recentEmitters.map(x => x.emitter).join(', ')}
FPS: ${Math.floor(this.game.loop.actualFps)}
        `
    }

    updateText(): void {
        this.debugText.setText(this.text());
    }
}