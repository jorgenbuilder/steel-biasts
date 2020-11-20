export default function (scene: Phaser.Scene) {
    scene.anims.create({
        key: 'stand',
        frames: scene.anims.generateFrameNumbers('player', { start: 0, end: 4}),
        frameRate: 10,
        repeat: -1
    });
    // scene.anims.create({
    //     key: 'standright',
    //     frames: [{key: 'player', frame: 0}],
    //     frameRate: 20,
    // });
    // scene.anims.create({
    //     key: 'walkleft',
    //     frames: scene.anims.generateFrameNumbers('player', { start: 8, end: 16}),
    //     frameRate: 10,
    //     repeat: -1
    // });
    // scene.anims.create({
    //     key: 'standleft',
    //     frames: [{key: 'player', frame: 8}],
    //     frameRate: 20,
    // });
};