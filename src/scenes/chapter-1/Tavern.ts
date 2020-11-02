import Player from '../../sprites/Player';
import playerAnimations from '../../animations/Player';
import LevelTiles from '../../assets/tilesets/szadi-caves/level-tiles.png';
import UtilTiles from '../../assets/tilesets/utils/util-colors.png';
import Dwarf from '../../assets/dwarf.png';
import Map from '../../assets/tilemaps/tavern.json';

type LayerConf = [
    string,
    Phaser.Tilemaps.Tileset,
    boolean,
][];

export default class TavernScene extends Phaser.Scene {

    private player: Player;
    private map: Phaser.Tilemaps.Tilemap;
    private tileSets: {
        [key: string]: Phaser.Tilemaps.Tileset;
    } = {};
    private layers: {
        [key: string]: Phaser.Tilemaps.StaticTilemapLayer | Phaser.Tilemaps.DynamicTilemapLayer;
    } = {};

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
        this.load.image('util-tiles', UtilTiles);
    }

    create () {
        const height = this.sys.game.config.height as number;
        const width = this.sys.game.config.width as number;

        // Map
        const mapScale = 2.5;
        const mapOriginX = width / 2 - width;
        const mapOriginY = height / 2;

        this.map = this.make.tilemap({ key: 'map', tileWidth: 16, tileHeight: 16, });
        this.tileSets.level = this.map.addTilesetImage('level-tiles');
        this.tileSets.util = this.map.addTilesetImage('util-tiles');
        
        const layers: LayerConf = [
            ['background', this.tileSets.level, true],
            ['floor', this.tileSets.level, true],
            ['camera-bounds', this.tileSets.level, false],
        ];
        layers.forEach(l => {
            let n = this.map.createStaticLayer(l[0], l[1], mapOriginX, mapOriginY);
            n.setScale(mapScale)
            this.layers[l[0]] = n;
        });

        // Player
        this.player = new Player(
            this,
            0,
            height + 560,
            'dwarf'
        );

        // Collision
        this.map.setCollisionBetween(0, 1600, true, true, 'floor');
        this.physics.world.addCollider(this.player, this.layers.floor)

        // Camera
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setBounds(
            mapOriginX,
            mapOriginY,
            this.layers['camera-bounds'].displayWidth,
            this.layers['camera-bounds'].displayHeight,
        );
    }

    update () {
        this.player.update();
    }
}
