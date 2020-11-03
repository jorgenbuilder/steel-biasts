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
        {accessor: 'background',    tileSet: 'level', visible: true,    depth: 1,},
        {accessor: 'floor',         tileSet: 'level', visible: true,    depth: 5,},
        {accessor: 'foreground',    tileSet: 'level', visible: true,    depth: 15,},
        {accessor: 'cameraBounds',  tileSet: 'level', visible: false,   depth: 100,},
    ]

    preloadHook () {}

    createHook () {
        console.log(
            this.map.getTileLayerNames(),
            this.map.getLayerIndex('background'),
            this.map.getLayerIndex('floor'),
            this.map.getLayerIndex('foreground'),
            this.map.getLayerIndex('cameraBounds'),
            this.map.getLayer('background'),
            this.map.getLayer('floor'),
            this.map.getLayer('foreground'),
            this.map.getLayer('cameraBounds'),
        );
    }
    
}
