import Dwarf from 'assets/dwarf.png';
import Player from "sprites/Player";
import playerAnimations from 'animations/Player';
import { getObjectCustomProps, PortalData } from 'utils/mapProps';

export type LayerConf = [
    string,
    Phaser.Tilemaps.Tileset,
    boolean,
][];

export default abstract class GameScene extends Phaser.Scene {

    protected player: Player;
    protected map: Phaser.Tilemaps.Tilemap;
    protected mapScale: number = 2.5;
    protected tileSets: {
        [key: string]: Phaser.Tilemaps.Tileset;
    } = {};
    protected layers: {
        [key: string]: Phaser.Tilemaps.StaticTilemapLayer | Phaser.Tilemaps.DynamicTilemapLayer;
    } = {};
    protected portals: Phaser.GameObjects.Sprite[];
    protected floor: Phaser.GameObjects.Sprite[];

    protected abstract mapAsset: string;
    protected abstract tileAssets: {
        key: string;
        asset: string;
        accessor: string;
    }[];

    constructor (conf: Phaser.Types.Scenes.SettingsConfig) {
        super({key: 'GameScene'});
    }

    abstract preloadHook (): void;
    
    preload () {
        this.load.on('complete', () => {
            playerAnimations(this);
        });
        
        this.load.spritesheet('dwarf', Dwarf, {
            frameWidth: 180,
            frameHeight: 240
        });

        this.load.tilemapTiledJSON('map', this.mapAsset);

        for (const conf of this.tileAssets) {
            this.load.image(conf.key, conf.asset)
        }

        this.preloadHook();
    }
    
    abstract createHook (): void;

    create () {
        this.createHook();

        // Player
        this.player = new Player(
            this,
            4000,
            1200,
            'dwarf'
        );

        // Collision
        this.physics.world.addCollider(this.player, this.layers.floor)
        this.map.setCollisionBetween(0, 1600, true, true, 'floor');
        // this.floor = this.map.createFromObjects('floor', 'floor', {
        //     x: 0,
        //     y: 0,
        //     key: 'util-tiles',
        // });
        // this.floor.forEach(f => {
        //     f.setDisplaySize(f.displayWidth * mapScale, f.displayHeight * mapScale);
        //     f.x = 0;
        //     f.y = 0;
        // })
        // this.physics.world.addCollider(this.player, this.floor)
        // this.physics.world.enable(this.floor);
        
        
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
            p.setDisplaySize(p.displayWidth * this.mapScale, p.displayHeight * this.mapScale);
            p.x = p.x * this.mapScale;
            p.y = p.y * this.mapScale;
        });
    }

    update () {
        // Player
        this.player.update();

        // Dev HUD
        this.events.emit(
            'playerMove',
            this.player.x,
            this.player.y,
            // this.floor[0].x,
            // this.floor[0].y,
        );

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