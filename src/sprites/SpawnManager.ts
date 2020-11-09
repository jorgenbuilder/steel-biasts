import GameScene from "scenes/GameLevelScene";
import { tiledPropsToObject, SpawnData } from "utils/mapProps";

export default class SpawnLayer {
    public scene: GameScene;
    public objects: Phaser.Types.Tilemaps.TiledObject[] = [];
    public gameObjects: Phaser.GameObjects.Rectangle[] = [];

    constructor (scene: GameScene, objects: Phaser.Types.Tilemaps.TiledObject[]) {
        this.scene = scene;

        objects.forEach(s => {
            this.objects.push(s);
            const data = tiledPropsToObject<SpawnData>(s.properties)
            const object = new Phaser.GameObjects.Rectangle(scene, s.x, s.y, s.width, s.height, 0x4488ff, .1);
            object.setDepth(100);
            object.setOrigin(0, 0);
            object.setData(data);
            scene.add.existing(object);
            this.gameObjects.push(object);
        });
    }

    update () {}
}