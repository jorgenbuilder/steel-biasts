import LevelTiles from 'assets/tilesets/szadi-caves/level.png';
import UtilTiles from 'assets/tilesets/utils/util.png';
import Map from 'assets/tilemaps/tavern.json';
import GameLevelScene from 'scenes/GameLevelScene';

export default class TavernScene extends GameLevelScene {

    protected mapConf = {
        asset: Map,
        key: 'tavernMap',
    }
    protected tileAssets = [
        { key: 'level', asset: LevelTiles,},
        { key: 'util',  asset: UtilTiles, },
    ];
    protected mapTileLayersConf = [
        {key: 'background',    tileSet: 'level', visible: true,    depth: 1,},
        {key: 'floor',         tileSet: 'level', visible: true,    depth: 5,},
        {key: 'foreground',    tileSet: 'level', visible: true,    depth: 15,},
        {key: 'cameraBounds',  tileSet: 'util', visible: false,   depth: 100,},
    ]

    protected spawnAt = 'tavern-way';

    constructor () {
        super('TavernScene');
    }

    preloadHook () {}

    createHook () {
        this.map.setCollisionBetween(0, 10000, true, true, 1);
        this.physics.world.addCollider(this.player, this.mapTileLayers.floor);
    }
    
}
