import { DialoguePassage } from "managers/DialogueManager";

export default class DialogueScene extends Phaser.Scene {

    // Visual Config
    private margin: number = 3;
    private padding: number = 2;

    // UI Element Refs
    private speakerText: Phaser.GameObjects.Text;
    private dialogueText: Phaser.GameObjects.Text;
    private art?: Phaser.GameObjects.Image;


    constructor () {
        super(`DialogueScene`);
    }

    getDimensions () {
        return {
            h: this.getGameHeight(),
            w: this.getGameWidth(),
            m: this.margin,
            p: this.padding,
            dH: 90,
            f: 12
        }
    }

    draw () {
        const { h, w, m, p, dH, f } = this.getDimensions();

        // Dialogue box
        this.add.rectangle(m, h - m, w - (2*m), dH, 0x0000FF, .75)
        .setOrigin(0, 1)
        .setStrokeStyle(/*1, 0xffffff*/);

        // Speaker name
        const speakerText = new Phaser.GameObjects.Text(this, x + m + p, h - dH - m + p, ``, {
            wordWrap: {
                width: w - (2*m + 2*p),
            },
            maxLines: 1,
            fixedHeight: f,
            fontSize: `${f}px`,
            // backgroundColor: 'rgba(0, 0, 0, .1)',
            stroke: '000000',
            strokeThickness: 3,
            fontStyle: 'bold',
        })
        .setOrigin(0);
        this.add.existing(speakerText);
        this.speakerText = speakerText;
        
        // Passage text
        const dialogueText = new Phaser.GameObjects.Text(this, x + m + p, h - dH + f + p, ``, {
            wordWrap: {
                width: w - (2*m + 2*p),
            },
            stroke: '000',
            fontSize: '10px',
            strokeThickness: 1,
        })
        .setLineSpacing(p)
        .setOrigin(0);
        this.add.existing(dialogueText);
        this.dialogueText = dialogueText;
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
            },
        });
    }

    placeArt (passage: DialoguePassage) {
        if (this.art) this.art.destroy();
        if (!passage['art-asset'] || !passage['art-position']) return;
        const { h, w, m, dH, } = this.getDimensions();
        const x = passage['art-position'] === 'left' ? m : w - m;
        const art = new Phaser.GameObjects.Image(this, x, h - m - dH, `${passage['art-asset']}-art`)
        .setOrigin(passage['art-position'] === 'left' ? 0 : 1, 1)
        .setScale(.4);
        this.add.existing(art);
        this.art = art;
    }

    renderPassage (passage: DialoguePassage) {
        this.setText(passage);
        this.placeArt(passage);
    }

    private getGameWidth (): number {
        const w = this.sys.game.config.width;
        return typeof w === 'string' ? parseInt(w) : w;
    }

    private getGameHeight (): number {
        const h = this.sys.game.config.height;
        return typeof h === 'string' ? parseInt(h) : h;
    }
}
