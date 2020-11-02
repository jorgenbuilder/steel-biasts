import game from './game';
import './screen.css'

declare global {
    interface Window {
        game: Phaser.Game;
    }
};

window.game = game;

if (module.hot) {
    module.hot.accept('./game', () => {
        console.log('Accepting game.');
    });
}

export default game;