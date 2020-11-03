import Dwarf from 'assets/dwarf.png';
import Player from "sprites/Player";
import playerAnimations from 'animations/Player';
import { getObjectCustomProps, PortalData } from 'utils/mapProps';

export default abstract class GameScene extends Phaser.Scene {

    // The player's character
    protected player: Player;
    
    // Scene Assets
    protected abstract mapAsset: string;
    protected abstract tileAssets: {
        key: string;
        asset: string;
        accessor: string;
    }[];

    // Tilesets
    protected tileSets: {
        [key: string]: Phaser.Tilemaps.Tileset;
    } = {};

    // Map config
    protected mapScale: number = 2.5;

    // Game map objects
    protected map: Phaser.Tilemaps.Tilemap;
    protected mapTileLayers: {
        [key: string]: Phaser.Tilemaps.StaticTilemapLayer | Phaser.Tilemaps.DynamicTilemapLayer;
    } = {};
    protected mapObjectLayers: {
        [key: string]: Phaser.GameObjects.Sprite[]
    } = {};
    protected mapTileLayersConf: {
        accessor: string;
        tileSet: string;
        visible: boolean;
        depth: number;
    }[];


    constructor (conf: Phaser.Types.Scenes.SettingsConfig) {
        super({key: 'GameScene'});
    }

    abstract preloadHook (): void;
    
    preload () {
        // Initialize player animations
        this.load.on('complete', () => {
            playerAnimations(this);
        });
        
        // Character sprite
        this.load.spritesheet('dwarf', Dwarf, {
            frameWidth: 180,
            frameHeight: 240
        });

        // Scene-specific game map
        this.load.tilemapTiledJSON('map', this.mapAsset);

        // Scene-specific tile assets
        for (const conf of this.tileAssets) {
            this.load.image(conf.key, conf.asset)
        }

        // Hook for scene-specific preloading
        this.preloadHook();
    }
    
    abstract createHook (): void;

    create () {
        // Map
        this.map = this.make.tilemap({ key: 'map' });

        // Player
        this.player = new Player(
            this,
            4000,
            1200,
            'dwarf'
        );
        this.player.setDepth(10);
    
        // Add tile sets
        for (const conf of this.tileAssets) {
            this.tileSets[conf.accessor] = this.map.addTilesetImage(conf.key)
        }
        console.log(this.tileSets);
        
        // Add maps tile layers
        for (const conf of this.mapTileLayersConf) {
            this.mapTileLayers[conf.accessor] = this.map.createStaticLayer(
                conf.accessor, 
                this.tileSets[conf.tileSet],
                0, 0,
            );
            this.mapTileLayers[conf.accessor].setScale(this.mapScale);
            this.mapTileLayers[conf.accessor].setDepth(conf.depth);
        }
        console.log(this.mapTileLayers);

        // Collision
        this.physics.world.addCollider(this.player, this.mapTileLayers.floor)
        this.map.setCollisionBetween(0, 1600, true, true, 'floor');
        // this.mapObjectLayers.floor = this.map.createFromObjects('floor', 'floor', {
        //     x: 0,
        //     y: 0,
        //     key: 'util-tiles',
        // });
        // this.mapObjectLayers.floor.forEach(f => {
        //     f.setDisplaySize(f.displayWidth * mapScale, f.displayHeight * mapScale);
        //     f.x = 0;
        //     f.y = 0;
        // })
        // this.physics.world.addCollider(this.player, this.mapObjectLayers.floor)
        // this.physics.world.enable(this.mapObjectLayers.floor);

        // Camera
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setBounds(
            0,
            0,
            this.mapTileLayers.cameraBounds.displayWidth,
            this.mapTileLayers.cameraBounds.displayHeight,
        );

        // Portals
        this.mapObjectLayers.portals = this.map.createFromObjects('portals', 'portal', {
            x: 0,
            y: 0,
            key: 'util-tiles',
        });
        this.mapObjectLayers.portals.forEach(p => {
            p.setDisplaySize(p.displayWidth * this.mapScale, p.displayHeight * this.mapScale);
            p.x = p.x * this.mapScale;
            p.y = p.y * this.mapScale;
            p.setDepth(100);
        });

        // Hook for scene-specific initialization logic
        this.createHook();
    }

    update () {
        // Player
        this.player.update();

        // Dev HUD
        this.events.emit(
            'playerMove',
            this.player.x,
            this.player.y,
            // this.mapObjectLayers.floor[0].x,
            // this.mapObjectLayers.floor[0].y,
        );

        // Portals
        this.mapObjectLayers.portals.forEach(p => {
            if (Phaser.Geom.Intersects.RectangleToRectangle(this.player.getBounds(), p.getBounds())) {
                if (this.player.canTeleport()) {
                    this.takePortal(p);
                }
            } else {
                if (this.player.teleporting) {
                    this.player.teleporting = false;
                }
            }
        });
    }

    takePortal (portal: Phaser.GameObjects.Sprite) {
        this.player.teleporting = true;
        const data = getObjectCustomProps<PortalData>(portal.data);
        console.log(`Teleport to ${data.Destination} ${data.OnTouch ? 'Now' : 'on Interaction'}.`);
    }
    
}