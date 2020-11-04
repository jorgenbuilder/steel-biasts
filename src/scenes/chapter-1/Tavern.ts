import LevelTiles from 'assets/tilesets/szadi-caves/level.png';
import UtilTiles from 'assets/tilesets/utils/util.png';
import Map from 'assets/tilemaps/tavern.json';
import GameLevelScene from 'scenes/GameLevelScene';

export default class TavernScene extends GameLevelScene {

    protected floorLayer = 'tavernFloor';
    protected cameraBoundsLayer = 'tavernCameraBounds';

    protected mapConf = {
        asset: Map,
        key: 'tavernMap',
    }
    protected tileAssets = [
        { key: 'level', asset: LevelTiles,},
        { key: 'util',  asset: UtilTiles, },
    ];
    protected mapTileLayersConf = [
        {key: 'tavernBackground',    tileSet: 'level', visible: true,    depth: 1,},
        {key: 'tavernFloor',         tileSet: 'level', visible: true,    depth: 5,},
        {key: 'tavernForeground',    tileSet: 'level', visible: true,    depth: 15,},
        {key: 'tavernCameraBounds',  tileSet: 'util', visible: false,   depth: 100,},
    ]

    protected spawnAt = 'tavern-way';

    constructor () {
        super('TavernScene');
    }

    preloadHook () {}

    createHook () {}
    
}
