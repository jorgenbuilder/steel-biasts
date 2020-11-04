import LevelTiles from 'assets/tilesets/szadi-caves/level.png';
import UtilTiles from 'assets/tilesets/utils/util.png';
import Map from 'assets/tilemaps/fork.json';
import GameLevelScene from 'scenes/GameLevelScene';

export default class ForkScene extends GameLevelScene {

    protected floorLayer = 'forkFloor';
    protected cameraBoundsLayer = 'forkCameraBounds';

    protected mapConf = {
        asset: Map,
        key: 'forkMap',
    }
    protected tileAssets = [
        { key: 'level', asset: LevelTiles,},
        { key: 'util', asset: UtilTiles,},
    ];
    protected mapTileLayersConf = [
        {key: 'forkBackground',    tileSet: 'level', visible: true,    depth: 1,},
        {key: 'forkFloor',         tileSet: 'level', visible: true,    depth: 5,},
        {key: 'forkCameraBounds',  tileSet: 'util', visible: false,   depth: 100,},
    ]

    protected spawnAt = 'tavern-way';

    constructor () {
        super('ForkScene');
    }

    preloadHook () {}

    createHook () {}
    
}
