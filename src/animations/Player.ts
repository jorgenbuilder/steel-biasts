export default function (scene: Phaser.Scene) {
    scene.anims.create({
        key: 'walkright',
        frames: scene.anims.generateFrameNumbers('dwarf', { start: 0, end: 7}),
        frameRate: 10,
        repeat: -1
    });
    scene.anims.create({
        key: 'standright',
        frames: [{key: 'dwarf', frame: 0}],
        frameRate: 20,
    });
    scene.anims.create({
        key: 'walkleft',
        frames: scene.anims.generateFrameNumbers('dwarf', { start: 8, end: 16}),
        frameRate: 10,
        repeat: -1
    });
    scene.anims.create({
        key: 'standleft',
        frames: [{key: 'dwarf', frame: 8}],
        frameRate: 20,
    });
};