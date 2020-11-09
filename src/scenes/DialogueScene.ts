import DialogueManager, { DialoguePassage } from "managers/DialogueManager";

export default class DialogueScene extends Phaser.Scene {

    // Visual Config
    private margin: number = 30;
    private padding: number = 20;

    // UI Element Refs
    private speakerText: Phaser.GameObjects.Text;
    private dialogueText: Phaser.GameObjects.Text;


    constructor () {
        super(`DialogueScene`);
    }

    draw () {
        const h = this.getGameHeight(),
              w = this.getGameWidth(),
              x = 0,
              y = h,
              m = this.margin,
              p = this.padding,
              dH = 200,
              f = 24;

        this.add.rectangle(x + m, h - m, w - (2*m), dH, 0x0000FF, .75).setOrigin(0, 1).setStrokeStyle(4, 0xffffff);
        const speakerText = new Phaser.GameObjects.Text(this, x + m + p, h - dH - m + p, ``, {
            wordWrap: {
                width: w - (2*m + 2*p),
            },
            maxLines: 1,
            fixedHeight: f,
            fontSize: `${f}px`,
            backgroundColor: 'rgba(0, 0, 0, .1)',
            stroke: '000000',
            strokeThickness: 3,
        })
        .setOrigin(0);
        this.add.existing(speakerText);
        this.speakerText = speakerText;
        const dialogueText = new Phaser.GameObjects.Text(this, x + m + p, h - dH + f + p, ``, {
            wordWrap: {
                width: w - (2*m + 2*p),
            },
            stroke: '000',
            strokeThickness: 2,
        })
        .setOrigin(0);
        this.add.existing(dialogueText);
        this.dialogueText = dialogueText;
    }

    setText (passage: DialoguePassage) {
        this.speakerText.setText(passage.speaker);
        this.dialogueText.setText(passage.text);
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
