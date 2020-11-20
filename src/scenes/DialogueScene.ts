import FontDinobyte from 'assets/fonts/dbyte.png';
import FontDinobyteData from 'assets/fonts/dbyte.fnt';
import { DialoguePassage } from 'managers/DialogueManager';
import { getGameHeight, getGameWidth } from 'helpers/dimensions';

export default class DialogueScene extends Phaser.Scene {

    // Visual Config
    private margin: number = 3;
    private padding: number = 2;
    private dialogHeight: number = 90;

    // UI Element Refs
    private speakerText: Phaser.GameObjects.BitmapText;
    private dialogueText: Phaser.GameObjects.BitmapText;
    private art?: Phaser.GameObjects.Image;


    constructor () {
        super(`DialogueScene`);
    }

    preload () {
        this.load.bitmapFont('dbyte', FontDinobyte, FontDinobyteData);
    }

    getDimensions () {
        const h = getGameHeight(this);
        const w = getGameWidth(this);
        return {
            h,
            w,
            m: this.margin,
            p: this.padding,
            dH: this.dialogHeight,
            f: 12
        }
    }

    draw () {
        const { h, w, m, p, dH, f } = this.getDimensions();

        // Dialogue box
        this.add.rectangle(w / 2, h - m - dH / 2, w - (2*m), dH, 0x0000FF, .75)
        .setOrigin(.5, .5)
        .setStrokeStyle(/*1, 0xffffff*/);

        // Speaker name
        const speakerText = new Phaser.GameObjects.BitmapText(this, m + p, h - dH - m + p, 'dbyte', '')
        .setOrigin(0);
        this.add.existing(speakerText);
        this.speakerText = speakerText;
        
        // Passage text
        const dialogueText = new Phaser.GameObjects.BitmapText(this, m + p, h - dH + f + p, 'dbyte', ``)
        .setOrigin(0);
        this.add.existing(dialogueText);
        this.dialogueText = dialogueText;
    }

    undraw (callback: () => void) {
        // this.
    }

    setText (passage: DialoguePassage) {
        this.speakerText.setText(passage.speaker);
        this.tweens.addCounter({
            from: 0,
            to: passage.text.length,
            duration: passage.text.length * 10,
            onUpdate: (tween) => {
                const i = tween.getValue();
                this.dialogueText.setText(passage.text.slice(0, i));
                const blip = this.sound.add('blip');
                blip.play();
            },
        });
    }

    placeArt (passage: DialoguePassage) {
        if (this.art) this.art.destroy();
        if (!passage['art-asset'] || !passage['art-position']) return;
        const { h, w, m, dH, } = this.getDimensions();
        const x = passage['art-position'] === 'left' ? m : w - m;
        const art = new Phaser.GameObjects.Image(this, x, h - m - dH, `${passage['art-asset']}-art`)
        .setOrigin(passage['art-position'] === 'left' ? 0 : 1, 1);
        this.add.existing(art);
        this.art = art;
    }

    renderPassage (passage: DialoguePassage) {
        this.setText(passage);
        this.placeArt(passage);
    }
}
