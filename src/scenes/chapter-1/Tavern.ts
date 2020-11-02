import Phaser from 'phaser';
import Player from '../../sprites/Player';
import playerAnimations from '../../animations/Player';
import Blackdrop from '../../assets/backdrops/blackdrop.png';
import Ground from '../../assets/ground.png';
import Dwarf from '../../assets/dwarf.png';

export default class TavernScene extends Phaser.Scene {

    private player: Player;

    constructor (conf: Phaser.Types.Scenes.SettingsConfig) {
        super(conf);
    }

    // private player {
    //     body: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    // }

    preload () {
        this.load.on('complete', () => {
            playerAnimations(this);
        });
        this.load.image('blackdrop', Blackdrop);
        this.load.image('ground', Ground);
        this.load.spritesheet('dwarf', Dwarf, {
            frameWidth: 180,
            frameHeight: 240
        });
    }

    create () {
        // Backdrop
        this.add.image(2560 / 2, 1440 / 2, 'blackdrop');

        // Platforms
        const platforms = this.physics.add.staticGroup();
        platforms.create(2560 / 2, 1440, 'ground').setScale(10).refreshBody();

        // Player
        this.player = new Player(
            this,
            0,
            this.sys.game.config.height as number - 500,
            'dwarf'
        );

        // Set bounds for current room
        // this.player.setRoomBounds(this.rooms);

        // Follow player
        this.cameras.main.startFollow(this.player);
    }
}
