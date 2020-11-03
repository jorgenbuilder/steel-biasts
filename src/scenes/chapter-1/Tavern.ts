import LevelTiles from 'assets/tilesets/szadi-caves/level-tiles.png';
import UtilTiles from 'assets/tilesets/utils/util-colors.png';
import Map from 'assets/tilemaps/tavern.json';
import GameScene from 'scenes/GameScene';

export default class TavernScene extends GameScene {

    protected mapAsset = Map;
    protected tileAssets = [
        { key: 'level-tiles',   accessor: 'level',  asset: LevelTiles,},
        { key: 'util-tiles',    accessor: 'util',   asset: UtilTiles, },
    ];
    protected mapTileLayersConf = [
        {accessor: 'background', tileSet: this.tileSets.level, visible: true},
        {accessor: 'floor', tileSet: this.tileSets.level, visible: true},
        {accessor: 'foreground', tileSet: this.tileSets.level, visible: true},
        {accessor: 'cameraBounds', tileSet: this.tileSets.level, visible: false},
    ]

    preloadHook () {}

    createHook () {}
    
}
