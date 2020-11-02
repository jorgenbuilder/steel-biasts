import Phaser from 'phaser';

export default abstract class Sprite extends Phaser.Physics.Arcade.Sprite {
    
    constructor (
        scene: Phaser.Scene,
        x: number,
        y: number,
        texture: string | Phaser.Textures.Texture,
        frame?: string | integer,
    ) {
        super(scene, x, y, texture, frame);
    }

}