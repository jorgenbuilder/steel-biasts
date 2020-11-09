import GameScene from "scenes/GameLevelScene";
import { tiledPropsToObject, TriggerData } from "helpers/mapProps";

export default class TriggerLayer {
    private scene: GameScene;
    private objects: Phaser.Types.Tilemaps.TiledObject[] = [];
    private gameObjects: Phaser.GameObjects.Rectangle[] = [];
    private triggered: Phaser.GameObjects.Rectangle[] = [];

    constructor (scene: GameScene, objects: Phaser.Types.Tilemaps.TiledObject[]) {
        this.scene = scene;

        objects.forEach(t => {
            this.objects.push(t);
            const data = tiledPropsToObject<TriggerData>(t.properties)
            const object = new Phaser.GameObjects.Rectangle(scene, t.x, t.y, t.width, t.height, 0xffff00, .1);
            object.setDepth(100);
            object.setOrigin(0, 0);
            object.setData(data);
            scene.add.existing(object);
            this.gameObjects.push(object);
        });
    }

    update () {
        const keys = this.scene.input.keyboard.createCursorKeys();
        this.gameObjects.filter(x => this.triggered.indexOf(x) < 0).forEach(t => {
            if (Phaser.Geom.Intersects.RectangleToRectangle(this.scene.player.getBounds(), t.getBounds())) {
                const activate = keys.space.isDown;
                if (t.data.get('OnTouch') || activate) {
                    this.triggerDialogue(t.data.get('DialogueScript'))
                    this.triggered.push(t);
                }
            }
        });
    }

    triggerDialogue (script: string) {
        this.scene.player.anims.play(this.scene.player.standing());
        this.scene.player.haltMovement();
        this.scene.player.controllable = false;
        this.scene.triggerDialogue(script);
    }
}