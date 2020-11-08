export default class DialogueScene extends Phaser.Scene {

    private sceneKey: string;

    constructor (key: string) {
        super(`DialogueScene`);
    }

    preload () {
        // 
    }

    create () {
        // this.add.text(this.game., 0.5, `Test`, {font: '24px monospace', fill: '#fff'});
        this.add.rectangle(30, this.game.canvas.height - 30, this.game.canvas.width - 60, 200, 0x0000FF, .25).setOrigin(0, 1)
    }

    update () {
        const keys = this.input.keyboard.createCursorKeys();
        if (keys.space.isDown) {
            console.log(this.sceneKey);
            this.scene.get('GameWorldScene').events.emit('unpause');
            this.scene.stop(`DialogueScene`);
        }
    }
}