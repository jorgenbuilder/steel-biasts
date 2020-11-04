import { DevData } from "./DevHUD";

export default class GameWorldScene extends Phaser.Scene {

    private initialScene: string = 'TavernScene';
    constructor () {
        super('GameWorldScene');
    }

    preload () {}

    private activeScene: string | undefined;

    create () {
        this.scene.launch('DevHUD');
        this.scene.get('GameWorldScene').events.on('teleport', (sceneKey: string) => {
            this.activateGameScene(sceneKey);
        });
        this.activateGameScene(this.initialScene);
    }
    
    activateGameScene (sceneKey: string) {
        console.debug(`🎬 Changing scene: ${sceneKey}`);
        if (this.activeScene) {
            this.unsubscribeDevHUD(this.activeScene);
            this.scene.stop(this.activeScene);
        }
        this.scene.launch(sceneKey);
        this.activeScene = sceneKey;
        this.subscribeDevHUD(sceneKey);
        this.scene.get('GameWorldScene').events.emit('devData', {
            location: sceneKey
        });
    }

    subscribeDevHUD (scene: string) {
        this.scene.get(scene).events.on('devData', (data: DevData) => {
            this.scene.get('GameWorldScene').events.emit('devData', data);
        });
    }
    
    unsubscribeDevHUD (scene: string) {
        this.scene.get(scene).events.off('devData');
    }

}