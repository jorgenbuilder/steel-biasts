import LevelTiles from 'assets/tilesets/szadi-caves/level.png';
import BG1Tiles from 'assets/tilesets/szadi-caves/bg1.png';
import BG2Tiles from 'assets/tilesets/szadi-caves/bg2.png';
import BG3Tiles from 'assets/tilesets/szadi-caves/bg3.png';
import BG4Tiles from 'assets/tilesets/szadi-caves/bg4.png';
import BG5Tiles from 'assets/tilesets/szadi-caves/bg5.png';
import PropsTiles from 'assets/tilesets/szadi-caves/props2.png';
import UtilTiles from 'assets/tilesets/utils/util.png';
import Map from 'assets/tilemaps/tavern-way.json';
import GameLevelScene from 'scenes/GameLevelScene';

export default class TavernWayScene extends GameLevelScene {

    protected floorLayer = 'tavernWayFloor';

    protected mapConf = {
        asset: Map,
        key: 'tavernWayMap',
    }
    protected tileAssets = [
        { key: 'level', asset: LevelTiles,},
        { key: 'util',  asset: UtilTiles, },
        { key: 'bg1',   asset: BG1Tiles, },
        { key: 'bg2',   asset: BG2Tiles, },
        { key: 'bg3',   asset: BG3Tiles, },
        { key: 'bg4',   asset: BG4Tiles, },
        { key: 'bg5',   asset: BG5Tiles, },
        { key: 'props2',asset: PropsTiles, },
    ];
    protected mapTileLayersConf = [
        {key: 'tavernWayBg1',            tileSet: 'bg1',     visible: true,    depth: 1,},
        {key: 'tavernWayBg2',            tileSet: 'bg2',     visible: true,    depth: 2,},
        {key: 'tavernWayBg3',            tileSet: 'bg3',     visible: true,    depth: 3,},
        {key: 'tavernWayBg4',            tileSet: 'bg4',     visible: true,    depth: 4,},
        {key: 'tavernWayFloor',          tileSet: 'level',   visible: true,    depth: 5,},
        {key: 'tavernWayForeground',     tileSet: 'props2',  visible: true,    depth: 15,},
        {key: 'tavernWayGroundClutter',  tileSet: 'level',   visible: true,    depth: 11,},
    ]
    public spawnAt = 'tavern';

    constructor () {
        super('TavernWayScene');
    }
        
    preloadHook () {}

    createHook () {
        // Audio tracks
        this.scene.get('GameWorldScene').events.emit('stopSong');
    }
    
}
