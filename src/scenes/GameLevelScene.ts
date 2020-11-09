import Dwarf from 'assets/dwarf.png';
import Player from "sprites/Player";
import playerAnimations from 'animations/Player';
import portalAnimations from 'animations/Portal';
import TriggerManager from 'managers/TriggerManager';
import PortalManager from 'managers/PortalManager';
import SpawnManager from 'managers/SpawnManager';
import DialogueManager from 'managers/DialogueManager';

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
    protected mapTileLayersConf: {
        key: string;
        tileSet: string;
        visible: boolean;
        depth: number;
    }[];

    // Portals
    protected portals: PortalManager;
    public disablePortals: boolean = false;

    // Spawns
    protected spawns: SpawnManager;
    public abstract spawnAt: string;

    // Triggers
    protected triggers: TriggerManager;

    // Dialogue
    public dialogue: DialogueManager;


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
        this.portals = new PortalManager(this, this.map.getObjectLayer('portals').objects);

        // Spawns
        console.debug(`💫 Initializing player spawn points...`);
        if (this.map.getObjectLayer('portals').objects.length) {
            this.spawns = new SpawnManager(this, this.map.getObjectLayer('playerSpawns').objects);
        } else {
            console.warn(`⚠ No player spawn points found on this map!`);
        }

        // Player
        let spawnPoint = this.spawns.gameObjects.find(
            x => x.data.get('Name') === this.spawnAt
        );
        if (!spawnPoint) {
            console.error(`💣 Spawn point "${this.spawnAt}" doesn't exist!`)
            spawnPoint = this.spawns.gameObjects[0];
        }
        console.debug(`🤺 Spawning player at ${this.spawnAt} spawn point.`)
        this.player = new Player(
            this,
            spawnPoint.x,
            spawnPoint.y + spawnPoint.height,
            'dwarf'
        );
        this.player.setDepth(10);

        // Collision
        console.debug(`🥊 Adding collision to ${this.floorLayer}.`)
        this.physics.world.addCollider(this.player, this.mapTileLayers[this.floorLayer]);
        const start = this.mapTileLayers[this.floorLayer].tileset[0].firstgid;
        const end = start + this.mapTileLayers[this.floorLayer].tileset[0].total;
        this.map.setCollisionBetween(start, end, true, true, this.floorLayer);

        // Camera
        this.cameras.main.startFollow(this.player);
        if (this.map.getObjectLayer('cameraBounds')) {
            const bounds = this.map.getObjectLayer('cameraBounds').objects[0];
            console.debug(`📷 Configuring camera (${bounds.x}, ${bounds.y}, ${bounds.width}, ${bounds.height}).`)
            this.cameras.main.setBounds(bounds.x, bounds.y, bounds.width, bounds.height,);
        } else {
            console.error(`Map has no camera bounds!`)
        }

        // Triggers
        console.debug(`🔫 Initializing triggers.`);
        if (this.map.getObjectLayer('triggers')) {
            this.triggers = new TriggerManager(this, this.map.getObjectLayer('triggers').objects);
        }

        // Dialogue
        this.dialogue = new DialogueManager(this);

        // Hook for scene-specific initialization logic
        this.createHook();
    }

    update () {
        this.player.update();
        this.portals.update();
        if (this.triggers) this.triggers.update();

        // Dev HUD
        this.events.emit(
            'devData',
            {
                pX: this.player.x,
                pY: this.player.y,
                pSpawning: this.player.spawning,
                pTeleporting: this.player.teleporting,
                emitter: this.scene.key,
            }
        );
    }

    getGameWidth (): number {
        const w = this.sys.game.config.width;
        return typeof w === 'string' ? parseInt(w) : w;
    }

    getGameHeight () {
        const h = this.sys.game.config.height;
        return typeof h === 'string' ? parseInt(h) : h;
    }
    
}