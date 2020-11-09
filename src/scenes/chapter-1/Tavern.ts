import LevelTiles from 'assets/tilesets/szadi-caves/level.png';
import UtilTiles from 'assets/tilesets/utils/util.png';
import Map from 'assets/tilemaps/tavern.json';
import GameLevelScene from 'scenes/GameLevelScene';
import Dialogue1 from 'assets/dialog/tavern-merriment-1.json';
import Dialogue2 from 'assets/dialog/tavern-merriment-2.json';

export default class TavernScene extends GameLevelScene {

    protected floorLayer = 'tavernFloor';

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
    ]

    public spawnAt = 'tavern-way';

    public disablePortals = true;

    constructor () {
        super('TavernScene');
    }

    preloadHook () {}

    createHook () {
        this.dialogue.scripts['tavern-merriment-1'] = Dialogue1;
        this.dialogue.scripts['tavern-merriment-2'] = Dialogue2;
    }
    
}
