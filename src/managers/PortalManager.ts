import GameScene from "scenes/GameLevelScene";
import { tiledPropsToObject, PortalData } from "helpers/mapProps";

export default class PortalLayer {
    public scene: GameScene;
    private objects: Phaser.Types.Tilemaps.TiledObject[] = [];
    private gameObjects: Phaser.GameObjects.Rectangle[] = [];

    constructor (scene: GameScene, objects: Phaser.Types.Tilemaps.TiledObject[]) {
        this.scene = scene;

        objects.forEach(p => {
            this.objects.push(p);
            const data = tiledPropsToObject<PortalData>(p.properties)
            const object = new Phaser.GameObjects.Rectangle(scene, p.x, p.y, p.width, p.height, 0xff00ff, .1);
            object.setDepth(100);
            object.setOrigin(0, 0);
            object.setData(data);
            scene.add.existing(object);
            this.gameObjects.push(object);
        });
    }

    update () {
        this.scene.scene.get(this.scene.scene.key).events.emit('devData', {
            emitter: this.scene.scene.key,
        });
        const portalCollisions = this.getPortalCollisions();
        if (portalCollisions.length) {
            const portal = portalCollisions[0];
            if (this.scene.player.canTeleport()) {
                this.takePortal(portal.data);
            }
        } else {
            if (this.scene.player.teleporting) {
                this.scene.player.teleporting = false;
            }
            if (this.scene.player.spawning) {
                this.scene.player.spawning = false;
            }
        }
    }

    getPortalCollisions () {
        const portalCollisions: Phaser.GameObjects.Rectangle[] = [];
        for (let i = 0; i < this.gameObjects.length; i++) {
            const p = this.gameObjects[i];
            if (Phaser.Geom.Intersects.RectangleToRectangle(this.scene.player.getBounds(), p.getBounds())) {
                portalCollisions.push(p);
            }
        }
        return portalCollisions;
    }

    takePortal (portal: Phaser.Data.DataManager) {
        const map: {[key: string]: any} = {
            'tavern': 'TavernScene',
            'tavern-way': 'TavernWayScene',
            'fork': 'ForkScene',
        }
        let destination = map[portal.get('Destination')];
        const origin = Object.entries(map).find(([k, v]) => v === this.scene.scene.key)[0];
        console.debug(`Teleport to ${map[portal.get('Destination')]} from ${origin}.`);
        if (!destination) {
            console.error(`💣 Destination "${portal.get('Destination')}" doesn't exist!`);
            destination = 'TavernScene';
        }
        this.scene.player.teleporting = true;
        this.scene.player.controllable = false;
        this.renderTransition(() => {
            this.scene.scene.pause(this.scene.scene.key);
            this.scene.scene.get('GameWorldScene').events.emit('teleport', destination, origin);
        });
    }

    renderTransition (callback: () => void) {
        const x = this.scene.cameras.main.scrollX;
        const y = this.scene.cameras.main.scrollY;
        const h = this.scene.getGameHeight();
        const w = this.scene.getGameWidth();
        const rect = new Phaser.GameObjects.Rectangle(this.scene, x, y, w, h, 0x000000, 1)
        .setDepth(100)
        .setOrigin(0)
        .setAlpha(0);
        this.scene.add.existing(rect);
        this.scene.tweens.addCounter({
            from: 0,
            to: 1,
            duration: 1000,
            onUpdate: (x) => {
                rect.setAlpha(x.getValue());
            },
            onComplete: callback
        });
    }
}