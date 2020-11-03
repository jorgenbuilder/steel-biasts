import LevelTiles from 'assets/tilesets/szadi-caves/level-tiles.png';
import UtilTiles from 'assets/tilesets/utils/util-colors.png';
import Map from 'assets/tilemaps/tavern.json';
import GameScene, { LayerConf } from 'scenes/GameScene';

export default class TavernScene extends GameScene {

    protected mapAsset = Map;
    protected tileAssets = [
        { key: 'level-tiles',   accessor: 'level',  asset: LevelTiles,},
        { key: 'util-tiles',    accessor: 'util',   asset: UtilTiles, },
    ];

    preloadHook () {}

    createHook () {
        // Map
        this.map = this.make.tilemap({ key: 'map' });
        this.tileSets.level = this.map.addTilesetImage('level-tiles');
        this.tileSets.util = this.map.addTilesetImage('util-tiles');
        
        const layers: LayerConf = [
            ['background', this.tileSets.level, true],
            ['floor', this.tileSets.level, true],
            ['foreground', this.tileSets.level, true],
            ['cameraBounds', this.tileSets.level, false],
        ];
        layers.forEach(l => {
            let n = this.map.createStaticLayer(l[0], l[1], 0, 0);
            n.setScale(this.mapScale)
            this.layers[l[0]] = n;
        });
    }
    
}
