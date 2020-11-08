import GameScene from "scenes/GameLevelScene";
import { getObjectCustomProps, tiledPropsToObject, TriggerData } from "utils/mapProps";

export default class TriggerLayer {
    private scene: GameScene;
    // private onTouch: boolean;
    // private isDialog: boolean;
    // private dialogScript: string;
    private objects: Phaser.Types.Tilemaps.TiledObject[] = [];
    private gameObjects: Phaser.GameObjects.Rectangle[] = [];

    constructor (scene: GameScene, objects: Phaser.Types.Tilemaps.TiledObject[]) {
        this.scene = scene;

        objects.forEach(t => {
            this.objects.push(t);
            const data = tiledPropsToObject<TriggerData>(t.properties);
            // this.onTouch = data.OnTouch;
            // this.dialogScript = data.DialogScript;
            // this.isDialog = data.IsDialog;
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
        const activate = keys.space.isDown;
        this.gameObjects.forEach(t => {
            const data = getObjectCustomProps<TriggerData>(t.data);
            if (data.OnTouch || activate) {
                if (Phaser.Geom.Intersects.RectangleToRectangle(this.scene.player.getBounds(), t.getBounds())) {
                    this.triggerDialog()
                }
            }
        });
    }

    triggerDialog () {
        this.scene.triggerDialogue();    
    }
}