export default class GameWorldScene extends Phaser.Scene {
    constructor () {
        super('GameWorldScene');
    }

    preload () {}

    private activeScene: string = 'TavernScene';

    create () {
        this.scene.launch('DevHUD');
        this.scene.launch(this.activeScene);
        this.scene.get('GameWorldScene').events.on('teleport', (destination: string) => {
            console.debug(`🎬 Changing scene: ${destination}`);
            this.scene.stop(this.activeScene);
            this.scene.launch(destination);
            this.activeScene = destination;
        })
    }

}