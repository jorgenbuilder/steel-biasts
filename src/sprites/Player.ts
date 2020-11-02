export default class Player extends Phaser.Physics.Arcade.Sprite {

    private direction: 'right' | 'left' = 'right';
    private standing () { return `stand${this.direction}`; }
    private keys: Phaser.Types.Input.Keyboard.CursorKeys;

    public teleporting: boolean = false;
    public invulnerable: boolean = false;
    
    constructor (
        scene: Phaser.Scene,
        x: number,
        y: number,
        texture: string | Phaser.Textures.Texture,
        frame?: string | integer,
    ) {
        super(scene, x, y, texture, frame);

        // Default animation state
        this.anims.play(this.standing());

        // Put player in the gameworld
        scene.physics.world.enable(this);
        scene.add.existing(this);
    }

    update () {
        const keys = this.scene.input.keyboard.createCursorKeys();
        const speed = 500;
        if (keys.left.isDown) {
            this.setVelocityX(-speed);
            this.direction = 'left';
            this.anims.play('walkleft', true);
        }
        else if (keys.right.isDown) {
            this.setVelocityX(speed);
            this.direction = 'right';
            this.anims.play('walkright', true);
        } else {
            this.setVelocityX(0);
            this.anims.play(`stand${this.direction}`, true);
        }

        if (keys.up.isDown && this.body.blocked.down) {
            this.setVelocityY(-700);
            this.anims.play(`stand${this.direction}`);
        }
    }

    canTeleport (): boolean {
        return !this.teleporting;
    }

}