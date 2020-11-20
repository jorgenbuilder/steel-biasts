import { getGameHeight, getGameWidth } from 'helpers/dimensions';

export default class EscMenuScene extends Phaser.Scene {

    public escMenuActive: boolean = false;
    private hovering: boolean = false;
    private hoverTimeout: NodeJS.Timeout;
    private hoverMenuButton: Phaser.GameObjects.Rectangle;
    private escKey: Phaser.Input.Keyboard.Key;

    constructor () {
        super('EscMenuScene');
    }

    preload () {}

    create () {
        this.escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        this.escKey.on('up', () => this.toggle());

        this.bindActivation();

        // Hover UI
        // TODO: I'm really not sure why this button seems to be rendering behind the game...
        const w = getGameWidth(this);
        this.hoverMenuButton = this.add.rectangle(w - 10, 10, 20, 20, 0xFF0000, 1)
            .setOrigin(1, 0)
            .setDepth(1000)
            // .setVisible(false);
    }

    toggle () {
        console.log('togg')
        if (!this.escMenuActive) {
            this.activate();
        } else {
            this.deactivate();
        }
    }

    bindActivation () {
        // Mouse
        this.input.on('pointermove', () => this.hoverCallback());
    }

    hoverCallback () {
        if (!this.hovering) {
            this.hovering = true;
            this.hoverMenuButton.setVisible(true);
        }
        if (this.hoverTimeout) {
            clearTimeout(this.hoverTimeout);
        }
        this.hoverTimeout = setTimeout(() => {
            this.hovering = false;
            this.hoverMenuButton.setVisible(false);
        }, 1000);
    }
    
    unbindActivation () {
        this.input.off('pointermove', () => this.hoverCallback());
        this.hoverMenuButton.setVisible(false);
    }

    activate () {
        this.escMenuActive = true;
        this.unbindActivation();
        
        // Temporary music control to keep me from going insane
        this.scene.get('GameWorldScene').events.emit('updateGameSettings', {music: true});
        this.scene.get('GameWorldScene').events.emit('playSong');
    }
    
    deactivate () {
        this.escMenuActive = false;
        this.bindActivation();

        // Temporary music control to keep me from going insane
        this.scene.get('GameWorldScene').events.emit('updateGameSettings', {music: false});
        this.scene.get('GameWorldScene').events.emit('stopSong');
    }

    update () {

        this.scene.get('GameWorldScene').events.emit('devData', {
            hovering: this.hovering,
            buttonX: this.hoverMenuButton.getBounds().x,
            buttonY: this.hoverMenuButton.getBounds().y,
            emitter: this.scene.key,
            escMenu: this.escMenuActive
        });
    }
} 