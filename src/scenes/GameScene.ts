import { DevData } from "./DevHUD";
import GameScene from "./GameLevelScene";

export default class GameWorldScene extends Phaser.Scene {

    private initialScene: string = 'TavernScene';
    constructor () {
        super('GameWorldScene');
    }

    preload () {}

    private activeScene: string | undefined;

    create () {
        this.scene.launch('DevHUD');
        this.scene.get('GameWorldScene').events.on('teleport', (destination: string, origin: string) => {
            this.activateGameScene(destination, origin);
        });
        this.activateGameScene(this.initialScene);
    }
    
    activateGameScene (sceneKey: string, previousSceneKey: string = undefined) {
        console.debug(`🎬 Changing scene: ${sceneKey}`);
        if (this.activeScene) {
            this.unsubscribeDevHUD(this.activeScene);
            this.scene.sleep(this.activeScene);
            this.scene.stop(this.activeScene);
        }
        if (previousSceneKey) {
            (this.scene.get(sceneKey) as GameScene).spawnAt = previousSceneKey;
        }
        this.scene.launch(sceneKey);
        this.activeScene = sceneKey;
        this.subscribeDevHUD(sceneKey);
        this.scene.get('GameWorldScene').events.emit('devData', {
            location: sceneKey
        });
    }

    subscribeDevHUD (scene: string) {
        console.log(`Sub to ${scene}.`)
        this.scene.get(scene).events.on('devData', (data: DevData) => {
            this.scene.get('GameWorldScene').events.emit('devData', data);
        });
    }
    
    unsubscribeDevHUD (scene: string) {
        console.log(`Unsub from ${scene}.`)
        this.scene.get(scene).events.off('devData');
    }

}