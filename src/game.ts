import Phaser from 'phaser';
import ForkScene from 'scenes/chapter-1/Fork';
import TavernScene from 'scenes/chapter-1/Tavern';
import TavernWayScene from 'scenes/chapter-1/TavernWay';
import DevHUD from 'scenes/DevHUD';
import DialogueScene from 'scenes/DialogueScene';
import GameWorldScene from 'scenes/GameWorldScene';

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    scale: {
        width: 640,
        height: 360,
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        parent: document.querySelector('body'),
    },
    render: {
        pixelArt: true,
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 1500, },
            debug: false,
        },
    },
    scene: [
        GameWorldScene,
        TavernScene,
        TavernWayScene,
        ForkScene,
        DevHUD,
        DialogueScene,
    ],
};

const game = new Phaser.Game(config);

export default game;