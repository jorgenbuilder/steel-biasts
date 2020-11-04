export default function (scene: Phaser.Scene) {
    scene.anims.create({
        key: 'spin',
        frames: scene.anims.generateFrameNumbers('portal', { start: 0, end: 3}),
        frameRate: 5,
        repeat: -1
    });
};