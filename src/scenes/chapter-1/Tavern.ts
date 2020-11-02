import Phaser from 'phaser';
import Player from '../../sprites/Player';
import playerAnimations from '../../animations/Player';
import LevelTiles from '../../assets/tilesets/szadi-caves/level-tiles.png';
import Dwarf from '../../assets/dwarf.png';
import Map from '../../assets/tilemaps/world.json';

export default class TavernScene extends Phaser.Scene {

    private player: Player;
    private map: Phaser.Tilemaps.Tilemap;
    private levelTiles: Phaser.Tilemaps.Tileset;
    private groundLayer: Phaser.Tilemaps.StaticTilemapLayer;

    constructor (conf: Phaser.Types.Scenes.SettingsConfig) {
        super(conf);
    }

    preload () {
        this.load.on('complete', () => {
            playerAnimations(this);
        });
        this.load.spritesheet('dwarf', Dwarf, {
            frameWidth: 180,
            frameHeight: 240
        });
        this.load.tilemapTiledJSON('map', Map);
        this.load.image('level-tiles', LevelTiles);
    }

    create () {
        const height = this.sys.game.config.height as number;
        const width = this.sys.game.config.width as number;
    
        // Map
        this.map = this.make.tilemap({ key: 'map', tileWidth: 16, tileHeight: 16, });
        this.levelTiles = this.map.addTilesetImage('level-tiles')
        this.groundLayer = this.map.createStaticLayer(
            'floor',
            this.levelTiles,
            width / 2 - width,
            height / 2,
        );
        this.groundLayer.setScale(2.5);
        this.map.setCollisionBetween(700, 1600)

        // Player
        this.player = new Player(
            this,
            0,
            height + 560,
            'dwarf'
        );
        this.physics.world.addCollider(this.player, this.groundLayer)

        // Follow player
        this.cameras.main.startFollow(this.player);
    }

    update () {
        this.player.update();
    }
}
