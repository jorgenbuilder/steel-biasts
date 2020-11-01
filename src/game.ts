import Phaser from 'phaser';
import Blackdrop from './assets/backdrops/blackdrop.png';
import Ground from './assets/ground.png';
import Dwarf from './assets/dwarf.png';

class Game {
    game: Phaser.Game;
    preload: Phaser.Types.Scenes.ScenePreloadCallback;
    create: Phaser.Types.Scenes.SceneCreateCallback;
    update: any;
    player: any;
    conf: () => Phaser.Types.Core.GameConfig;

    constructor () {
        this.create = create;
        this.preload = preload;
        this.update = update;
        this.game = new Phaser.Game({
            type: Phaser.AUTO,
            scale: {
                width: 2560,
                height: 1440,
                mode: Phaser.Scale.FIT,
                autoCenter: Phaser.Scale.CENTER_BOTH,
                parent: document.querySelector('body'),
            },
            scene: {
                preload: this.preload,
                create: this.create,
                update: this.update,
            },
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { y: 300, },
                    debug: false,
                },
            },
        });

        this.player;

        function create (this: any) {
            console.log('Creating...');
            this.add.image(2560 / 2, 1440 / 2, 'blackdrop');
            const platforms = this.physics.add.staticGroup();
            platforms.create(2560 / 2, 1440, 'ground').setScale(10).refreshBody();

            this.player = this.physics.add.sprite(100, 450, 'dwarf');
            this.player.direction = 'right';
            this.player.setBounce(.2);
            this.player.setCollideWorldBounds(true);
            this.player.body.setGravityY(300);
            this.physics.add.collider(this.player, platforms);
            this.anims.create({
                key: 'right',
                frames: this.anims.generateFrameNumbers('dwarf', { start: 0, end: 7}),
                frameRate: 10,
                repeat: -1
            });
            this.anims.create({
                key: 'standright',
                frames: [{key: 'dwarf', frame: 0}],
                frameRate: 20,
            });
            this.anims.create({
                key: 'left',
                frames: this.anims.generateFrameNumbers('dwarf', { start: 8, end: 16}),
                frameRate: 10,
                repeat: -1
            });
            this.anims.create({
                key: 'standleft',
                frames: [{key: 'dwarf', frame: 8}],
                frameRate: 20,
            });
        }

        function preload (this: any) {
            console.log('Preloading...');
            this.load.image('blackdrop', Blackdrop);
            this.load.image('ground', Ground);
            this.load.spritesheet('dwarf', Dwarf, {frameWidth: 180, frameHeight: 240});
        }

        function update (this: any) {
            const cursors = this.input.keyboard.createCursorKeys();
            if (cursors.left.isDown) {
                this.player.setVelocityX(-160);
                this.player.direction = 'left';
                this.player.anims.play('left', true);
            }
            else if (cursors.right.isDown) {
                this.player.setVelocityX(160);
                this.player.direction = 'right';
                this.player.anims.play('right', true);
            } else {
                this.player.setVelocityX(0);
                this.player.anims.play(`stand${this.player.direction}`, true);
            }

            if (cursors.up.isDown && this.player.body.touching.down) {
                this.player.setVelocityY(-330);
                this.player.anims.play(`stand${this.player.direction}`);
            }
        }
    }
}
export default Game;