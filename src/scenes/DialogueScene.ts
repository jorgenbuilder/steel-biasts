export default class DialogueScene extends Phaser.Scene {

    private sceneKey: string;
    private margin: number = 30;
    private padding: number = 20;
    private text: Phaser.GameObjects.Text;
    public script: {
        'text': string;
    }[];

    constructor (key: string) {
        super(`DialogueScene`);
    }

    preload () {}

    create () {
        const height = this.getGameHeight();
        const width = this.getGameWidth();
        this.add.rectangle(this.margin, height - this.margin, width - 60, 200, 0x0000FF, .75).setOrigin(0, 1);
        const keys = this.input.keyboard.createCursorKeys();
        keys.space.on('up', (e: KeyboardEvent) => this.advance());
    }

    update () {
        // const keys = this.input.keyboard.createCursorKeys();
        // if (keys.space.isDown) {
        //     this.deactivate();
        // }
    }

    advance () {
        console.log(this.data.get('script'));
    }

    activate () {
        console.log(this);
    }

    deactivate () {
        this.scene.get('GameWorldScene').events.emit('unpause');
        this.scene.stop(`DialogueScene`);
    }

    private getGameWidth (): number {
        const w = this.sys.game.config.width;
        return typeof w === 'string' ? parseInt(w) : w;
    }

    private getGameHeight () {
        const h = this.sys.game.config.height;
        return typeof h === 'string' ? parseInt(h) : h;
    }
}