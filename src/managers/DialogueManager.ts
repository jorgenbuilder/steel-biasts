import { TriggerData } from "helpers/mapProps";
import DialogueScene from "scenes/DialogueScene";
import GameScene from "scenes/GameLevelScene";

export interface DialoguePassage {
    'speaker': string;
    'text': string;
};

export default class DialogueManager {
    private scene: GameScene;
    private dialogueScene: DialogueScene;

    private passageIndex: number = 0;
    private activeScript?: DialoguePassage[];
    public scripts: {[key: string]: any} = {};

    constructor (scene: GameScene) {
        this.scene = scene;
    }

    trigger (event: TriggerData) {
        this.startDialogue(event);
    }

    startDialogue (event: TriggerData) {
        if (this.activeScript) return;
        this.activeScript = this.parseScript(this.scripts[event.DialogueScript]);

        this.dialogueScene = this.scene.scene.get(`DialogueScene`) as DialogueScene;
        this.scene.scene.launch(`DialogueScene`);

        if (event.DisablePlayer) {
            this.scene.player.anims.play(this.scene.player.standing());
            this.scene.player.haltMovement();
            this.scene.player.controllable = false;
        }

        if (event.PauseGame) {
            this.scene.scene.pause(this.scene.scene.key);
        }

        this.passageIndex = 0;
        this.dialogueScene.draw();
        this.dialogueScene.setText(this.activeScript[this.passageIndex]);
        this.bindKeys();
    }

    stopDialogue () {
        this.scene.scene.stop(`DialogueScene`);
        this.scene.scene.resume(this.scene.scene.key);
        this.scene.player.controllable = true;
        this.scene.disablePortals = false;
        this.activeScript = undefined;
        this.unbindKeys();
    }

    advanceDialogue () {
        this.passageIndex++;
        if (this.passageIndex >= this.activeScript.length) {
            this.stopDialogue();
        } else {
            this.dialogueScene.setText(this.activeScript[this.passageIndex]);
        }
    }

    bindKeys () {
        const keys = this.scene.input.keyboard.createCursorKeys();
        keys.space.on('down', this.advanceDialogue, this);
    }

    unbindKeys () {
        const keys = this.scene.input.keyboard.createCursorKeys();
        keys.space.off('down', this.advanceDialogue, this);
    }

    parseScript (script: any): DialoguePassage[] {
        return script as DialoguePassage[];
    }
    
}