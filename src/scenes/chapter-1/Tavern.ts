import Player from 'sprites/Player';
import playerAnimations from 'animations/Player';
import LevelTiles from 'assets/tilesets/szadi-caves/level-tiles.png';
import UtilTiles from 'assets/tilesets/utils/util-colors.png';
import Dwarf from 'assets/dwarf.png';
import Map from 'assets/tilemaps/tavern.json';
import { getObjectCustomProps, PortalData } from 'utils/mapProps';

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
    private portals: Phaser.GameObjects.Sprite[];

    constructor (conf: Phaser.Types.Scenes.SettingsConfig) {
        super({key: 'GameScene'});
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
        // Map
        const mapScale = 2.5;

        this.map = this.make.tilemap({ key: 'map' });
        this.tileSets.level = this.map.addTilesetImage('level-tiles');
        this.tileSets.util = this.map.addTilesetImage('util-tiles');
        
        const layers: LayerConf = [
            ['background', this.tileSets.level, true],
            ['floor', this.tileSets.level, true],
            ['cameraBounds', this.tileSets.level, false],
        ];
        layers.forEach(l => {
            let n = this.map.createStaticLayer(l[0], l[1], 0, 0);
            n.setScale(mapScale)
            this.layers[l[0]] = n;
        });

        // Player
        this.player = new Player(
            this,
            4000,
            100,
            'dwarf'
        );

        // Collision
        this.map.setCollisionBetween(0, 1600, true, true, 'floor');
        this.physics.world.addCollider(this.player, this.layers.floor)
        
        // Camera
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setBounds(
            0,
            0,
            this.layers.cameraBounds.displayWidth,
            this.layers.cameraBounds.displayHeight,
        );
        
        // Portals
        this.portals = this.map.createFromObjects('portals', 'portal', {
            x: 0,
            y: 0,
            key: 'util-tiles',
        });
        this.portals.forEach(p => {
            p.setDisplaySize(p.displayWidth * mapScale, p.displayHeight * mapScale);
            p.x = p.x * mapScale;
            p.y = p.y * mapScale;
        });
    }
    
    update () {
        // Player
        this.player.update();

        // Dev HUD
        this.events.emit('playerMove', this.player.x, this.player.y);

        // Portals
        this.portals.forEach(p => {
            if (Phaser.Geom.Intersects.RectangleToRectangle(this.player.getBounds(), p.getBounds())) {
                if (this.player.canTeleport()) {
                    this.takePortal(p);
                }
            } else {
                if (this.player.teleporting) {
                    this.player.teleporting = false;
                }
            }
        })
    }

    takePortal (portal: Phaser.GameObjects.Sprite) {
        this.player.teleporting = true;
        const data = getObjectCustomProps<PortalData>(portal.data);
        console.log(`Teleport to ${data.Destination} ${data.OnTouch ? 'Now' : 'on Interaction'}.`);
    }
}
