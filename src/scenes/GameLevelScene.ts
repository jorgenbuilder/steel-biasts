import Dwarf from 'assets/dwarf.png';
import Portal from 'assets/portal.png';
import Player from "sprites/Player";
import playerAnimations from 'animations/Player';
import portalAnimations from 'animations/Portal';
import { getObjectCustomProps, PortalData, SpawnData, TriggerData } from 'utils/mapProps';
import TriggerLayer from 'sprites/Trigger';
import DialogueScene from './DialogueScene';

export default abstract class GameScene extends Phaser.Scene {

    // The player's character
    public player: Player;
    
    // Scene Assets
    protected abstract mapConf: {
        asset: string;
        key: string;
    }
    protected abstract tileAssets: {
        key: string;
        asset: string;
    }[];
    protected abstract floorLayer: string;
    protected abstract cameraBoundsLayer: string;

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
        key: string;
        tileSet: string;
        visible: boolean;
        depth: number;
    }[];

    // Spawn conf
    protected abstract spawnAt: string;

    protected triggers: TriggerLayer;
    public dialogueScene: DialogueScene;
    public dialogActive: boolean = false;


    constructor (key: string) {
        super(key)
        console.debug(`Initialising ${key}.`);
    }
    
    abstract preloadHook (): void;
    
    preload () {
        console.debug(`Preloading ${this.scene.key}.`);
        
        // Initialize animations
        this.load.on('complete', () => {
            playerAnimations(this);
            portalAnimations(this);
        });
        
        // Character sprite
        this.load.spritesheet('dwarf', Dwarf, {
            frameWidth: 180,
            frameHeight: 240
        });

        // Portal sprite
        this.load.spritesheet('portal', Portal, {
            frameWidth: 116,
            frameHeight: 275,
        })

        // Scene-specific game map
        this.load.tilemapTiledJSON(this.mapConf.key, this.mapConf.asset);

        // Scene-specific tile assets
        let i = 1;
        console.debug(`🎨 Loading assets...`)
        for (const conf of this.tileAssets) {
            this.load.image(conf.key, conf.asset)
            // const ok = 
            console.debug(`\t${i}/${this.tileAssets.length}: ${conf.key}`)
            i++;
        }

        // Hook for scene-specific preloading
        this.preloadHook();
    }
    
    abstract createHook (): void;

    create () {
        console.debug(`Creating ${this.scene.key}.`);
        // Map
        console.debug(`🗺 Creating map.`)
        this.map = this.make.tilemap({ key: this.mapConf.key });
    
        // Add tile sets
        console.debug(`📐 Initializing tile sets...`)
        let i = 1;
        for (const conf of this.tileAssets) {
            this.tileSets[conf.key] = this.map.addTilesetImage(conf.key)
            const ok = this.tileSets[conf.key] ? true : false;
            console.debug(`\t${i}/${this.tileAssets.length}: ${conf.key}, ${ok ? 'Okay' : 'Oops!'}`)
            i++;
        }
        
        // Add maps tile layers
        console.debug(`🌄 Initializing layers...`)
        i = 1;
        for (const conf of this.mapTileLayersConf) {
            this.mapTileLayers[conf.key] = this.map.createStaticLayer(
                conf.key, 
                this.tileSets[conf.tileSet],
                0, 0,
            );
            this.mapTileLayers[conf.key].setDisplayOrigin(0, 1);
            // this.mapTileLayers[conf.key].setScale(this.mapScale);
            this.mapTileLayers[conf.key].setDepth(conf.depth);
            const ok = this.mapTileLayers[conf.key] ? true : false;
            console.debug(`\t${i}/${this.mapTileLayersConf.length}: ${conf.key}, ${ok ? 'Okay' : 'Oops!'}`)
            if (!ok) console.debug(`\t\tIt looks like ${conf.key} layer doesn't exist on the game map.`)
            i++
        }

        // Portals
        console.debug(`🚪 Adding portals.`)
        this.mapObjectLayers.portals = this.map.createFromObjects('portals', 'portal', {
            x: 0,
            y: 0,
            key: 'portal',
        });
        if (this.mapObjectLayers.portals) {
            i = 1;
            this.mapObjectLayers.portals.forEach(p => {
                const data = getObjectCustomProps<PortalData>(p.data);
                p.setDisplayOrigin(0, 1);
                // p.setDisplaySize(p.displayWidth * this.mapScale, p.displayHeight * this.mapScale);
                // p.x = p.x * this.mapScale;
                // p.y = p.y * this.mapScale;
                p.setDepth(100);
                p.name = data.Name;
                console.debug(`\t${i}/${this.mapObjectLayers.portals.length}: ${p.name}`);
            });
        }

        // Player spawn points
        console.debug(`💫 Initializing player spawn points...`);
        this.mapObjectLayers.playerSpawns = this.map.createFromObjects('playerSpawns', 'playerSpawn', {
            x: 0,
            y: 0,
            key: 'util',
        });
        if (this.mapObjectLayers.playerSpawns) {
            i = 1;
            this.mapObjectLayers.playerSpawns.forEach(s => {
                const data = getObjectCustomProps<SpawnData>(s.data);
                s.setDisplayOrigin(0, 1);
                // s.setDisplaySize(s.displayWidth * this.mapScale, s.displayHeight * this.mapScale);
                // s.x = s.x * this.mapScale;
                // s.y = s.y * this.mapScale;
                s.setDepth(100);
                s.name = data.Name;
                console.debug(`\t${i}/${this.mapObjectLayers.playerSpawns.length}: ${s.name}`);
                i++;
            });
        } else {
            console.warn(`⚠ No player spawn points found on this map!`);
        }

        // Player
        const spawnPoint = this.mapObjectLayers.playerSpawns.find(
            x => x.name === this.spawnAt
        );
        console.debug(`🤺 Spawning player at ${this.spawnAt} spawn point.`)
        this.player = new Player(
            this,
            spawnPoint.x,
            spawnPoint.y,
            'dwarf'
        );
        this.player.spawning = true;
        this.player.teleporting = true;
        this.player.setDepth(10);

        // Collision
        console.debug(`🥊 Adding collision to ${this.floorLayer}.`)
        this.physics.world.addCollider(this.player, this.mapTileLayers[this.floorLayer]);
        const start = this.mapTileLayers[this.floorLayer].tileset[0].firstgid;
        const end = start + this.mapTileLayers[this.floorLayer].tileset[0].total;
        this.map.setCollisionBetween(start, end, true, true, this.floorLayer);
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
        console.debug(`📷 Configuring camera.`)
        const bounds = this.mapTileLayers[this.cameraBoundsLayer].getBounds();
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setBounds(bounds.x, bounds.y, bounds.width, bounds.height,);

        // Dialog triggers
        console.debug(`🔫🗣 Initializing dialogue triggers... ${this.scene.key}`);
        this.dialogueScene = new DialogueScene(this.scene.key);
        this.triggers = new TriggerLayer(this, this.map.getObjectLayer('triggers').objects);
        this.scene.get('GameWorldScene').events.on('unpause', () => this.scene.resume(this.scene.key));

        // Hook for scene-specific initialization logic
        this.createHook();
    }

    update () {
        // Player
        this.player.update();
        this.triggers.update();

        // Dev HUD
        this.events.emit(
            'devData',
            {
                pX: this.player.x,
                pY: this.player.y,
                pSpawning: this.player.spawning,
            }
        );

        // Portals
        if (this.mapObjectLayers.portals) {
            this.mapObjectLayers.portals.forEach(p => {
                if (Phaser.Geom.Intersects.RectangleToRectangle(this.player.getBounds(), p.getBounds())) {
                    if (this.player.canTeleport()) {
                        this.takePortal(p);
                    }
                } else {
                    if (this.player.teleporting) {
                        this.player.teleporting = false;
                    }
                    if (this.player.spawning) {
                        this.player.spawning = false;
                    }
                }
            });
        }
    }

    takePortal (portal: Phaser.GameObjects.Sprite) {
        this.player.teleporting = true;
        const data = getObjectCustomProps<PortalData>(portal.data);
        const destination = data.Destination;
        console.log(`Teleport to ${destination} ${data.OnTouch ? 'Now' : 'on Interaction'}.`);
        const map: {[key: string]: any} = {
            'tavern': 'TavernScene',
            'tavern-way': 'TavernWayScene',
            'fork': 'ForkScene',
        }
        this.scene.get('GameWorldScene').events.emit('teleport', map[destination]);
    }

    triggerDialogue () {
        if (!this.dialogActive) {
            console.log(
                `Trigger Dialogue: DialogueScene`,
                this.scene.get(`DialogueScene`),
                this.dialogueScene,
                this
            );
            this.dialogActive = true;
            this.scene.launch(`DialogueScene`);
            this.scene.pause(this.scene.key);
        }
    }
    
}