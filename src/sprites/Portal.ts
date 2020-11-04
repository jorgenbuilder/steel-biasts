export default class Portal extends Phaser.Physics.Arcade.Sprite {

    public originX = 0;
    public originY = 1;
    
    constructor (
        scene: Phaser.Scene,
        x: number,
        y: number,
        texture: string | Phaser.Textures.Texture,
        frame?: string | integer,
    ) {
        super(scene, x, y, texture, frame);

        this.anims.play('spin');
    }

}