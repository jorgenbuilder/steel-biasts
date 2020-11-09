export default class DialogueScene extends Phaser.Scene {

    private sceneKey: string;
    private margin: number = 30;
    private padding: number = 20;
    private speakerText: Phaser.GameObjects.Text;
    private dialogueText: Phaser.GameObjects.Text;
    public script: DialoguePassage[];
    public passageIndex: number = 0;

    constructor (key: string) {
        super(`DialogueScene`);
    }

    preload () {}

    create () {
        const keys = this.input.keyboard.createCursorKeys();
        keys.space.on('down', () => this.advance());
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
        this.add.rectangle(x + m, h - m, w - (2*m), dH, 0x0000FF, .75).setOrigin(0, 1);
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

    advance () {
        this.passageIndex++;
        if (this.passageIndex >= this.script.length) {
            this.deactivate();
            return;
        }
        this.setText();
    }

    setText () {
        this.speakerText.setText(this.script[this.passageIndex].speaker);
        this.dialogueText.setText(this.script[this.passageIndex].text);
    }

    activate () {
        // this.scene.restart();
        console.log('Script', this.script);
        this.passageIndex = 0;
        this.draw();
        this.setText();
    }

    deactivate () {
        const keys = this.input.keyboard.createCursorKeys();
        keys.space.off('down');
        this.scene.get('GameWorldScene').events.emit('unpause');
        this.scene.stop(`DialogueScene`);
    }

    private getGameWidth (): number {
        const w = this.sys.game.config.width;
        return typeof w === 'string' ? parseInt(w) : w;
    }

    private getGameHeight () {
        const h = this.sys.game.config.height;
        return typeof h === 'string' ? parseInt(h) : h;
    }
}

interface DialoguePassage {
    'speaker': string;
    'text': string;
};

export function parseScript (script: any): DialoguePassage[] {
    return script as DialoguePassage[];
}