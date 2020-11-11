import LevelTiles from 'assets/tilesets/szadi-caves/level.png';
import UtilTiles from 'assets/tilesets/utils/util.png';
import Map from 'assets/tilemaps/tavern.json';
import GameLevelScene from 'scenes/GameLevelScene';
import Dialogue1 from 'assets/dialog/scripts/tavern-merriment-1.json';
import Dialogue2 from 'assets/dialog/scripts/tavern-merriment-2.json';
import ThrainArt from 'assets/dialog/art/thrain.png';
import VolkerArt from 'assets/dialog/art/volker.png';
import SvaliArt from 'assets/dialog/art/svali.png';
import GuntramArt from 'assets/dialog/art/guntram.png';

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

    preloadHook () {
        this.load.image('thrain-art', ThrainArt);
        this.load.image('volker-art', VolkerArt);
        this.load.image('svali-art', SvaliArt);
        this.load.image('guntram-art', GuntramArt);
    }

    createHook () {
        this.dialogue.scripts['tavern-merriment-1'] = Dialogue1;
        this.dialogue.scripts['tavern-merriment-2'] = Dialogue2;
    }
    
}
