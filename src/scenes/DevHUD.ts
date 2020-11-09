import { Time } from "phaser";

export interface DevData {
    pX: number;
    pY: number;
    touchingPortal: boolean;
    pSpawning: boolean;
    pTeleporting: boolean;
    location: string;
    emitter: string;
}

export default class DevHUD extends Phaser.Scene {

    private debugText: Phaser.GameObjects.Text;
    private pX: number = 0;
    private pY: number = 0;
    private pSpawning: boolean = false;
    private pTeleporting: boolean = false;
    private touchingPortal: boolean = false;
    private location: string = '';
    private recentEmitters: {
        emitter: string;
        timestamp: number;
    }[] = [];
    
    constructor () {
        super('DevHUD');
    }

    preload () {
        //
    }

    create () {
        this.debugText = this.add.text(0, 0, this.playerText(), {font: '12px monospace', fill: '#fff'}).setOrigin(0);
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
        this.updatePlayerText();
    }

    playerText(): string {
        return `
        Location: ${this.location}
        Player Coords: ${Math.floor(this.pX)}, ${Math.floor(this.pY)}
        Player Spawning: ${this.pSpawning}
        Player Teleporting: ${this.pTeleporting}
        Touching Portal: ${this.touchingPortal}
        Emitters: ${this.recentEmitters.map(x => x.emitter).join(', ')}
        `
    }

    updatePlayerText(): void {
        this.debugText.setText(this.playerText());
    }
}