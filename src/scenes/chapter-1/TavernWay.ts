import LevelTiles from 'assets/tilesets/szadi-caves/level-tiles.png';
import BG1Tiles from 'assets/tilesets/szadi-caves/bg-1.png';
import BG2Tiles from 'assets/tilesets/szadi-caves/bg-2.png';
import BG3Tiles from 'assets/tilesets/szadi-caves/bg-3.png';
import BG4Tiles from 'assets/tilesets/szadi-caves/bg-4.png';
import BG5Tiles from 'assets/tilesets/szadi-caves/bg-5.png';
import PropsTiles from 'assets/tilesets/szadi-caves/props-1.png';
import UtilTiles from 'assets/tilesets/utils/util-colors.png';
import Map from 'assets/tilemaps/tavern-way.json';
import GameScene from 'scenes/GameScene';

export default class TavernWayScene extends GameScene {

    protected mapAsset = Map;
    protected tileAssets = [
        { key: 'level-tiles',   accessor: 'level',  asset: LevelTiles,},
        { key: 'util-tiles',    accessor: 'util',   asset: UtilTiles, },
        { key: 'bg-1',          accessor: 'bg1',    asset: BG1Tiles, },
        { key: 'bg-2',          accessor: 'bg2',    asset: BG2Tiles, },
        { key: 'bg-3',          accessor: 'bg3',    asset: BG3Tiles, },
        { key: 'bg-4',          accessor: 'bg4',    asset: BG4Tiles, },
        { key: 'bg-5',          accessor: 'bg5',    asset: BG5Tiles, },
        { key: 'props-1',       accessor: 'props',  asset: PropsTiles, },
    ];
    protected mapTileLayersConf = [
        {accessor: 'floor',         tileSet: 'level', visible: true,    depth: 5,},
        {accessor: 'foreground',    tileSet: 'level', visible: true,    depth: 15,},
        {accessor: 'cameraBounds',  tileSet: 'level', visible: false,   depth: 100,},
    ]
        
    preloadHook () {}

    createHook () {}
    
}
