export default class Player extends Phaser.Physics.Arcade.Sprite {

    private direction: 'right' | 'left' = 'right';
    private standing () { return `stand${this.direction}`; }
    private keys: Phaser.Types.Input.Keyboard.CursorKeys;

    public teleporting: boolean = false;
    public spawning: boolean = true;
    public invulnerable: boolean = false;
    public controllable: boolean = true;

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

        this.setScale(1 / 2.5)
        // Default animation state
        this.anims.play(this.standing());

        // Put player in the gameworld
        scene.physics.world.enable(this);
        scene.add.existing(this);
    }

    update () {
        if (this.controllable) this.controlPlayer();
    }

    controlPlayer () {
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
        return !this.teleporting && !this.spawning;
    }

}