import Phaser from 'phaser';
import Sprite from './Sprite';

export default class Player extends Sprite {

    private direction: 'right' | 'left' = 'right';
    private standing () { return `stand${this.direction}`; }
    
    constructor (
        scene: Phaser.Scene,
        x: number,
        y: number,
        texture: string | Phaser.Textures.Texture,
        frame?: string | integer,
    ) {
        super(scene, x, y, texture, frame);

        // Default animation state
        this.anims.play(this.standing())

        // Put player in the gameworld
        scene.physics.world.enable(this);
        scene.add.existing(this);
    }

    update () {
        const cursors = this.scene.input.keyboard.createCursorKeys();
        if (cursors.left.isDown) {
            this.setVelocityX(-160);
            this.direction = 'left';
            this.anims.play('left', true);
        }
        else if (cursors.right.isDown) {
            this.setVelocityX(160);
            this.direction = 'right';
            this.anims.play('right', true);
        } else {
            this.setVelocityX(0);
            this.anims.play(`stand${this.direction}`, true);
        }

        if (cursors.up.isDown && this.body.touching.down) {
            this.setVelocityY(-330);
            this.anims.play(`stand${this.direction}`);
        }
    }

}